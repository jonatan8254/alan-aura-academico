#!/usr/bin/env python3
"""
verificar_coherencia.py — el validador que faltaba.

Los cuatro validadores de las skills ICONIX cubren MD-01, DCU-01, las 14 ECU y
los 14 DR. No cubren los cinco documentos mas densos del paquete —MV-01, REQ-01,
PER-01, PRIV-01 y PLAN-01—, que se editan a mano. Este script cubre ese hueco.

Cuatro comprobaciones:

  1. HECHOS CANONICOS  — que las cifras repetidas entre documentos coincidan, y
     que ningun valor obsoleto sobreviva como afirmacion viva.
  2. RESIDUOS DE STACK — que los nombres del stack superado por ADR-002 solo
     aparezcan donde son cita historica.
  3. DISCIPLINA DE FICHA — que todo archivo tocado suba su version y anote su
     fila de historial.
  4. VERSIONES DECLARADAS — que el inventario de INDICE_MAESTRO diga, de cada
     artefacto, la version que ese artefacto dice tener en su propia ficha.
  5. ARTEFACTOS DERIVADOS — que ningun `.svg` ni las cabeceras de codigo queden
     mas antiguos que el `.puml` del que se generan. Anadido en SD-39: en el
     retrabajo del CDR-01 hubo diez desfasados a la vez y solo se cazaron con un
     barrido a mano.

La distincion que hace util a (1) y (2): un valor viejo dentro de un bloque de
historial, changelog o registro de decisiones es CORRECTO —describe lo que se
decidio entonces—. El mismo valor dentro de una regla, requisito, criterio de
aceptacion o descripcion del sistema es un DEFECTO. El script implementa
exactamente esa regla; la documenta `docs/00_gobernanza/HECHOS_CANONICOS.md`.

Uso:
    python scripts/verificar_coherencia.py            # las tres comprobaciones
    python scripts/verificar_coherencia.py --sin-git  # omite (3)

Salida: lista de errores y codigo de salida 1 si hay alguno. Es instrumental
documental, no codigo de la aplicacion: por eso sigue en Python pese a ADR-002-D4.
"""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# Carpetas que nunca se inspeccionan.
#   grafo/  es capa derivada, no se edita a mano (CLAUDE.md §7).
EXCLUIDAS = ("grafo", "node_modules", ".git", ".venv", "dist")

# Archivos cuya naturaleza ES registrar el pasado: en ellos, un valor obsoleto
# es correcto en cualquier linea.
ARCHIVOS_HISTORICOS = {
    "00_PLAN_CODEX_ORIGINAL.md",       # fuente primaria archivada verbatim (SD-16)
    "00_AUDITORIA_PLAN_CODEX.md",      # auditoria de esa fuente
    "CHANGELOG.md",
    "REGISTRO_DECISIONES.md",
    "MANIFIESTO_FUENTES.md",
    "HECHOS_CANONICOS.md",             # documenta los valores obsoletos a proposito
    "PDR-01_primera_pasada_correcciones.md",
    "RPD-01_revision_preliminar_diseno.md",
    "RET-01_retroalimentacion_docente.md",
    "ADR-001_decisiones_tecnicas.md",  # superada en parte; su texto se conserva
    "ADR-002_reversion_stack_serverless.md",  # explica de que se viene
}

# Una linea es "historica" si es entrada de changelog embebido o fila de la
# tabla de historial de cambios.
LINEA_HISTORICA = re.compile(
    r"^\s*(?:\*\*Cambio v|>?\s*\|\s*v\d+\.\d+)"
    r"|Historial de cambios"
    r"|^\*\*ID:\*\*.*\*\*Versi[oó]n:\*\*",  # la ficha cita el motivo del cambio
    re.IGNORECASE,
)

# Nombrar lo viejo APUNTANDO a lo que lo reemplazo no es un residuo: es
# documentar bien. Pero el marcador tiene que ser ESTRECHO: una version laxa
# silencia justo lo que el script existe para detectar.
#
# Deliberadamente NO se incluyen:
#   - "antes de"  -> es subcadena de "antes del release", que aparece por todo
#                    el corpus: seria un pase libre.
#   - "ADR-002" a secas -> eximiria incluso una linea que la contradiga.
#   - "sustitu|reemplaz|pasa de" sueltos -> disparan con usos no relacionados.
# Se exige una construccion COMPARATIVA explicita, con el residuo y su relevo.
MARCADOR_SUPERACION = re.compile(
    r"supera(?:da|do|n|)\s+por"          # «superada por ADR-002»
    r"|que\s+supera"                      # «ADR-002-D5, que supera a ADR-001-D2»
    r"|en\s+lugar\s+de"
    r"|pasa\s+de\s+\*{0,2}\w"             # «el stack pasa de **Django**…»
    r"|→"                                 # «motor SQLite → DynamoDB»
    r"|daba\s+de\s+f[aá]brica"
    r"|dej[oó]\s+de\s+ser"
    r"|se\s+abandona"
    r"|ADR-001-D[0-9]"                    # citar la decision concreta superada
    r"|superad[ao]s?\b.*ADR-002"
    r"|ADR-002.*superad[ao]",
    re.IGNORECASE,
)

# Excepciones explicitas: cada una con su motivo. Preferimos una lista corta y
# auditable a una heuristica que silencie de mas.
#   (fragmento de ruta, fragmento del texto de la linea, motivo)
EXCEPCIONES = [
    ("docs/06_dominio/MD-01_modelo_dominio.md", "el validador avisa a partir de 12 clases",
     "habla del umbral del validador, no del numero de clases del modelo"),
    ("docs/00_gobernanza/ESTADO_PIPELINE.md", "Verificación forense contra el plan de Codex",
     "descripcion historica de SD-15"),
    ("docs/02_modelos_verbales/MV-01_modelo_verbal_general.md", "Las 12 clases candidatas",
     "HALLAZGO ABIERTO, no falso positivo: la matriz de candidatas de MV-01 quedo en 12 "
     "tras el PDR-01, mientras MD-01 tiene 16. Es hueco de propagacion del PDR-01, ajeno "
     "al cambio de stack, y su dueña es la fase D.5. Documentado en "
     "HECHOS_CANONICOS §Estado de los pendientes, punto 2. Al cerrarlo, BORRAR esta excepcion."),
]

# ---------------------------------------------------------------------------
# 1. Hechos canonicos
# ---------------------------------------------------------------------------
# (id, descripcion, patron OBSOLETO, patron VIGENTE, etiqueta del valor vigente)
# Si el patron vigente aparece en la MISMA linea, se entiende que la linea es una
# comparacion «antes → despues» y no una afirmacion viva.
VALORES_OBSOLETOS = [
    ("H-01", "caracteres por mensaje", r"1\.500\s+caracteres", r"2\.500", "2.500"),
    ("H-11", "clases del dominio", r"\b12\s+clases\b", r"\b16\s+clases\b", "16"),
    ("H-13", "casos de uso", r"\b10\s+casos de uso\b", r"\b14\s+casos de uso\b", "14"),
    ("H-10", "campos de la capsula", r"c[aá]psula de\s+3\s+campos",
     r"5\s*(?:de contenido|campos|\+)", "5 de contenido + 2 metadatos"),
]

# (id, archivo duenno, patron que DEBE aparecer)
VALORES_VIGENTES = [
    ("H-01", "docs/03_requisitos/REQ-01_requisitos.md", r"2\.500\s+caracteres"),
    ("H-04", "docs/03_requisitos/REQ-01_requisitos.md", r"3 solicitudes/min y 30/d[ií]a"),
    ("H-05", "docs/03_requisitos/REQ-01_requisitos.md", r"timeout de LLM \*\*20 s\*\*"),
    ("H-01", "docs/02_modelos_verbales/MV-01_modelo_verbal_general.md", r"2\.500 caracteres"),
]

# (id, comando de conteo sobre artefactos, valor esperado)
CONTEOS = [
    ("H-11", "clases de dominio", "docs/06_dominio/MD-01_modelo_dominio.puml", r"^\s*class ", 16),
    ("H-12", "relaciones de dominio", "docs/06_dominio/MD-01_modelo_dominio.puml",
     r"^\s*\w+ +(?:<\|--|\*--|--) ", 17),
    ("H-13", "casos de uso", "docs/07_casos_uso/DCU-01_casos_uso.puml", r"^\s*usecase ", 14),
    ("H-14", "actores", "docs/07_casos_uso/DCU-01_casos_uso.puml", r"^\s*actor ", 5),
    # Anadidos en SD-39. Las cuatro cifras de MC-01 se movieron durante el
    # retrabajo del CDR-01 —las relaciones, tres veces: 73 -> 71 -> 80— y hasta
    # ahora ninguna se contrastaba contra el modelo: se copiaban de artefacto en
    # artefacto. Contarlas aqui es lo que convierte «se propago» en algo
    # comprobable.
    ("H-25", "clases de diseno", "docs/07_casos_uso/clases/MC-01_modelo_clases_diseno.puml",
     r"^\s*(?:abstract )?class ", 43),
    ("H-26", "operaciones de diseno", "docs/07_casos_uso/clases/MC-01_modelo_clases_diseno.puml",
     r"^\s+[+-]\w+\s*\(", 201),
    ("H-27", "atributos de diseno", "docs/07_casos_uso/clases/MC-01_modelo_clases_diseno.puml",
     r"^\s+[+-][\w/]+\s*:\s*\w", 51),
    # El `(?!N_)` excluye los dos conectores entre notas, que PlantUML dibuja
    # con la misma sintaxis y NO son relaciones del modelo (hallazgo H-13).
    ("H-29", "relaciones de diseno", "docs/07_casos_uso/clases/MC-01_modelo_clases_diseno.puml",
     r"^(?!N_)\w+ .*(?:<\|--|\*--|\.\.>| -- )", 80),
]

# ---------------------------------------------------------------------------
# 2. Residuos de stack (superado por ADR-002)
# ---------------------------------------------------------------------------
# "Render" a secas NO se busca: los anexos de MD-01 y DCU-01 dicen "Render
# acompanante" refiriendose al SVG renderizado, no al proveedor de hosting.
RESIDUOS_STACK = re.compile(
    r"\bDjango\b|\bSQLite\b|\bPythonAnywhere\b|\bRender Free\b|\bGunicorn\b|\bWSGI\b",
    re.IGNORECASE,
)


def archivos_markdown() -> list[Path]:
    salida = []
    for p in RAIZ.rglob("*.md"):
        if any(parte in EXCLUIDAS for parte in p.relative_to(RAIZ).parts):
            continue
        salida.append(p)
    return sorted(salida)


def leer(p: Path) -> list[str]:
    return p.read_text(encoding="utf-8", errors="replace").splitlines()


def es_historica(archivo: Path, linea: str) -> bool:
    return archivo.name in ARCHIVOS_HISTORICOS or bool(LINEA_HISTORICA.search(linea))


def exceptuada(rel: str, linea: str) -> bool:
    return any(ruta in rel and texto in linea for ruta, texto, _ in EXCEPCIONES)


# --------------------------------------------------------------------------
# 4. VERSIONES DECLARADAS
# --------------------------------------------------------------------------
#
# Por que existe este bloque. En SD-31 el INDICE_MAESTRO declaraba
# «DS-00..14 v1.0» cuando DS-00 iba por v1.3, y una lectura a ojo no lo vio.
# Al contrastarlo por script aparecieron ademas MD-01 citado en v1.4 (iba por
# v1.6) y DCU-01 en v2.1 (iba por v2.2). Importa mas de lo que parece: el
# indice es donde se mira para saber QUE VERSION CONSUMIR, asi que una version
# mal ahi se propaga a quien lo lea.

# «**Versión:** v1.6» en la ficha de cabecera
VERSION_FICHA = re.compile(r"\*\*Versi[oó]n:\*\*\s*(v\d+\.\d+)")

# ALCANCE: solo el INVENTARIO, y hay una razon para que sea tan estrecho.
#
# La primera version de este bloque miraba TODA mencion «ARTEFACTO vX.Y» del
# corpus. Dio 202 hallazgos y practicamente ninguno era un defecto: la inmensa
# mayoria son PROCEDENCIA —«`Visitante` | Clase de MD-01 v1.4», «Mapa a DCU-01
# v2.1», las lineas de `**Insumos:**`—, que dicen contra que version se
# construyo algo y son legitimamente historicas. Un bloque con esa relacion
# senal/ruido no se lee: se ignora, y entonces no vigila nada.
#
# Lo que si es una afirmacion viva sobre el estado ACTUAL es el inventario de
# `INDICE_MAESTRO`, cuyo proposito declarado es decir que es cada artefacto y
# en que version esta. Ahi mentir se propaga a quien lo consulte, y ahi es
# donde el error de SD-31 se colo de verdad.
ARCHIVOS_INVENTARIO = {"INDICE_MAESTRO.md"}

# «MD-01 v1.4» — el ID pegado a su version, sin otro ID de por medio, para que
# «DS-00 v1.3 · DS-01…14 v1.0» no ate el v1.0 al DS-00.
MENCION_VERSION = re.compile(
    r"\b([A-Z]{2,4}-\d{2}(?:-\d{2})?)\b[^A-Z|\n]{0,14}?\b(v\d+\.\d+)\b")


def version_de_ficha(archivo: Path) -> str | None:
    """La version que el propio artefacto declara en sus primeras lineas."""
    for linea in leer(archivo)[:8]:
        m = VERSION_FICHA.search(linea)
        if m:
            return m.group(1)
    return None


def indice_de_fichas() -> dict[str, tuple[str, str]]:
    """ID de artefacto -> (version declarada en su ficha, ruta).

    El ID se toma del nombre del archivo: `MD-01_modelo_dominio.md` -> `MD-01`.
    Si dos archivos reclaman el mismo ID, gana ninguno: se omite, porque no
    hay una respuesta unica que exigir.
    """
    fichas: dict[str, tuple[str, str]] = {}
    duplicados: set[str] = set()
    for archivo in archivos_markdown():
        m = re.match(r"([A-Z]{2,4}-\d{2}(?:-\d{2})?)_", archivo.name)
        if not m:
            continue
        ident = m.group(1)
        version = version_de_ficha(archivo)
        if version is None:
            continue
        if ident in fichas:
            duplicados.add(ident)
        fichas[ident] = (version, archivo.relative_to(RAIZ).as_posix())
    for d in duplicados:
        fichas.pop(d, None)
    return fichas


def comprobar_versiones() -> list[str]:
    """El inventario debe declarar la version que cada artefacto dice tener."""
    errores: list[str] = []
    fichas = indice_de_fichas()

    for archivo in archivos_markdown():
        if archivo.name not in ARCHIVOS_INVENTARIO:
            continue
        rel = archivo.relative_to(RAIZ).as_posix()
        for n, linea in enumerate(leer(archivo), 1):
            # Una cita de changelog o de ficha describe lo que fue: es correcta.
            if es_historica(archivo, linea):
                continue
            for ident, citada in MENCION_VERSION.findall(linea):
                if ident not in fichas:
                    continue
                real, origen = fichas[ident]
                if citada != real:
                    errores.append(
                        f"[VERSION] {rel}:{n} — el inventario declara «{ident} "
                        f"{citada}» pero su ficha dice {real} ({origen})")
    return errores


def comprobar_hechos() -> list[str]:
    errores: list[str] = []

    # 1a. Ningun valor obsoleto como afirmacion viva.
    for archivo in archivos_markdown():
        rel = archivo.relative_to(RAIZ).as_posix()
        for n, linea in enumerate(leer(archivo), 1):
            if es_historica(archivo, linea) or exceptuada(rel, linea):
                continue
            for hid, desc, patron, patron_vigente, vigente in VALORES_OBSOLETOS:
                if re.search(patron, linea, re.IGNORECASE):
                    if re.search(patron_vigente, linea, re.IGNORECASE):
                        continue
                    errores.append(
                        f"[{hid}] {rel}:{n} — valor obsoleto de «{desc}» en una "
                        f"afirmacion viva; el vigente es {vigente}. "
                        f"Si la linea es historica, marcala como tal."
                    )

    # 1b. Los valores vigentes estan donde deben.
    for hid, ruta, patron in VALORES_VIGENTES:
        p = RAIZ / ruta
        if not p.exists():
            errores.append(f"[{hid}] falta el archivo duenno: {ruta}")
            continue
        if not re.search(patron, p.read_text(encoding="utf-8", errors="replace")):
            errores.append(f"[{hid}] {ruta} — no contiene el valor canonico esperado (/{patron}/)")

    # 1c. Los conteos estructurales cuadran con la tabla de hechos.
    for hid, desc, ruta, patron, esperado in CONTEOS:
        p = RAIZ / ruta
        if not p.exists():
            errores.append(f"[{hid}] falta el artefacto: {ruta}")
            continue
        real = sum(1 for l in leer(p) if re.search(patron, l))
        if real != esperado:
            errores.append(
                f"[{hid}] {ruta} — {desc}: se contaron {real}, "
                f"HECHOS_CANONICOS declara {esperado}"
            )
    return errores


def comprobar_residuos() -> list[str]:
    errores: list[str] = []
    for archivo in archivos_markdown():
        if archivo.name in ARCHIVOS_HISTORICOS:
            continue
        rel = archivo.relative_to(RAIZ).as_posix()
        for n, linea in enumerate(leer(archivo), 1):
            if es_historica(archivo, linea) or exceptuada(rel, linea):
                continue
            if MARCADOR_SUPERACION.search(linea):
                continue
            m = RESIDUOS_STACK.search(linea)
            if m:
                errores.append(
                    f"[STACK] {rel}:{n} — «{m.group(0)}» aparece como afirmacion viva. "
                    f"El stack vigente es ADR-002 (React + Vercel + AWS). "
                    f"Si es cita historica, muevela a un bloque de historial."
                )
    return errores


def comprobar_fichas() -> list[str]:
    """Todo archivo tocado que tenga ficha debe subir version; si ademas tiene
    tabla de historial, debe anotar fila nueva.

    PUNTO CIEGO, declarado: se apoya en `git diff HEAD`, asi que solo ve cambios
    SIN COMITEAR. Una vez comiteada la rama, esta comprobacion pasa en verde sin
    haber comprobado nada, y tampoco ve archivos nuevos no rastreados. Es util
    ANTES de comitear; despues, no significa nada. Para auditar una rama ya
    comiteada hay que comparar contra su base (p. ej. `git diff main...HEAD`).
    """
    errores: list[str] = []
    try:
        tocados = subprocess.run(
            ["git", "diff", "--name-only", "HEAD"],
            cwd=RAIZ, capture_output=True, text=True, check=True,
            encoding="utf-8", errors="replace",
        ).stdout.split()
    except (subprocess.CalledProcessError, FileNotFoundError) as exc:
        return [f"[FICHA] no se pudo consultar git ({exc}); usa --sin-git para omitir"]

    for rel in tocados:
        if not rel.endswith(".md") or any(x in rel for x in EXCLUIDAS):
            continue
        p = RAIZ / rel
        if not p.exists():
            continue
        texto = p.read_text(encoding="utf-8", errors="replace")
        tiene_version = "**Versión:**" in texto or "**Version:**" in texto
        tiene_historial = "Historial de cambios" in texto
        if not (tiene_version or tiene_historial):
            continue

        diff = subprocess.run(
            ["git", "diff", "-U0", "HEAD", "--", rel],
            cwd=RAIZ, capture_output=True, text=True,
            encoding="utf-8", errors="replace",
        ).stdout
        anadidas = [l[1:] for l in diff.splitlines() if l.startswith("+") and not l.startswith("+++")]

        if tiene_version and not any(("**Versión:**" in l or "**Version:**" in l) for l in anadidas):
            errores.append(f"[FICHA] {rel} — editado sin subir **Versión** en la ficha")
        if tiene_historial and not any(
            re.match(r"\s*\|\s*\*{0,2}v\d+\.\d+\*{0,2}\s*\|", l) for l in anadidas
        ):
            errores.append(f"[FICHA] {rel} — editado sin anadir fila al Historial de cambios")
    return errores


# --------------------------------------------------------------------------
# 5. ARTEFACTOS DERIVADOS
# --------------------------------------------------------------------------
#
# Por que existe este bloque. Los `.svg` y las cabeceras de codigo NO son
# fuentes: se generan de un `.puml`. Cuando alguien edita el `.puml` y olvida
# regenerar, el repositorio queda diciendo dos cosas distintas a la vez, y la
# derivada es la que se mira. En el retrabajo del CDR-01 hubo diez de estos a
# la vez y solo se cazaron con un barrido a mano; este bloque lo mecaniza.

# Un `.puml` produce su `.svg` al lado o en la carpeta hermana `svg/`.
# `MC-01` produce ademas las cabeceras de la regla #2 del CDR.
DERIVADOS_EXTRA = {
    "docs/07_casos_uso/clases/MC-01_modelo_clases_diseno.puml":
        ["docs/07_casos_uso/clases/MC-01_cabeceras.txt"],
}


def derivados_de(rel: str) -> list[Path]:
    """Los artefactos que ese `.puml` genera y que existen hoy."""
    fuente = RAIZ / rel
    base = fuente.stem
    candidatos = [fuente.with_suffix(".svg"),
                  fuente.parent.parent / "svg" / f"{base}.svg"]
    candidatos += [RAIZ / x for x in DERIVADOS_EXTRA.get(rel, ())]
    return [c for c in candidatos if c.exists()]


def comprobar_derivados() -> list[str]:
    """Ningun artefacto derivado puede ser mas antiguo que su `.puml`.

    PUNTO CIEGO, declarado, y es el mismo que el bloque 3: se apoya en
    `git diff HEAD`, asi que solo mira los `.puml` con cambios SIN COMITEAR.
    Tiene que ser asi. Git no conserva las fechas de modificacion, de modo que
    tras un clon reciente todos los archivos tienen la misma marca y una
    comprobacion de frescura sobre el arbol entero seria ruido puro. Restringido
    a lo que acabas de tocar, la fecha si es informacion fiable: si editaste el
    `.puml` despues de generar, se ve.

    Segunda razon para usar la fecha y no el contenido: un cambio en el `.puml`
    puede no alterar el `.svg` ni un byte —renombrar un alias no cambia lo que
    se dibuja, porque el dibujo lleva la etiqueta—, pero el generador reescribe
    el archivo igual y la fecha sube. Comparar contenidos daria falsos avisos
    justo en ese caso, que en el CDR-01 fue el de tres diagramas de robustez.
    """
    errores: list[str] = []
    try:
        tocados = subprocess.run(
            ["git", "diff", "--name-only", "HEAD"],
            cwd=RAIZ, capture_output=True, text=True, check=True,
            encoding="utf-8", errors="replace",
        ).stdout.split()
    except (subprocess.CalledProcessError, FileNotFoundError) as exc:
        return [f"[DERIVADO] no se pudo consultar git ({exc}); usa --sin-git para omitir"]

    for rel in tocados:
        if not rel.endswith(".puml") or any(x in rel for x in EXCLUIDAS):
            continue
        fuente = RAIZ / rel
        if not fuente.exists():
            continue
        derivados = derivados_de(rel)
        if not derivados:
            # No es un error: hay `.puml` sin vista derivada, y forzarla seria
            # inventar una obligacion que el proyecto no tiene.
            continue
        for d in derivados:
            if d.stat().st_mtime < fuente.stat().st_mtime:
                errores.append(
                    f"[DERIVADO] {d.relative_to(RAIZ).as_posix()} es mas antiguo "
                    f"que {rel} — regeneralo antes de comitear")
    return errores


def main() -> int:
    ap = argparse.ArgumentParser(description="Verifica la coherencia del paquete documental.")
    ap.add_argument("--sin-git", action="store_true",
                    help="omite la comprobacion de disciplina de ficha")
    args = ap.parse_args()

    bloques = [
        ("1. HECHOS CANONICOS", comprobar_hechos()),
        ("2. RESIDUOS DE STACK", comprobar_residuos()),
        ("4. VERSIONES DECLARADAS", comprobar_versiones()),
    ]
    if not args.sin_git:
        bloques.insert(2, ("3. DISCIPLINA DE FICHA (solo cambios sin comitear)",
                           comprobar_fichas()))
        bloques.append(("5. ARTEFACTOS DERIVADOS (solo cambios sin comitear)",
                        comprobar_derivados()))

    total = 0
    print("Verificacion de coherencia — «Alan & Aura Academico»")
    print("=" * 55)
    for titulo, errores in bloques:
        print(f"\n### {titulo}")
        if not errores:
            print("    ERRORES: ninguno")
        else:
            total += len(errores)
            for e in errores:
                print(f"    - {e}")

    print("\n" + "=" * 55)
    if total:
        print(f"RESULTADO: {total} error(es).")
        print("Recuerda: un valor viejo en un bloque de historial es correcto;")
        print("en una regla o requisito vigente, es un defecto.")
        return 1
    print("RESULTADO: sin errores.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
