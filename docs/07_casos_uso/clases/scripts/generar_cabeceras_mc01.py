#!/usr/bin/env python3
"""Genera las cabeceras de codigo de MC-01 (regla #2 del CDR) con nombres de
clase que SI son identificadores validos.

POR QUE EXISTE ESTE SCRIPT
==========================
`generate_code_headers.py`, de la skill `iconix-cdr-review`, emite el nombre de
cada clase tomando la ETIQUETA del modelo. En PlantUML, `class "X" as Y`
declara dos nombres: la etiqueta `X`, que lleva el significado y se dibuja, y el
alias `Y`, que es el identificador. `MC-01` usa esa forma A PROPOSITO en las
clases de pantalla y de control, porque la etiqueta debe leerse como
«Gestion de cuenta (P-13)» en el diagrama y el identificador debe ser
`B_PaginaGestionCuenta` en el codigo.

Resultado sin este script: 20 de las 43 clases salen como

    public class Presentacion / landing (P-01) {   // <<solucion>>

que no es un identificador valido en ningun lenguaje. Ninguna de las 20 es un
defecto del modelo: las 20 tienen alias valido. Es el generador el que no mira
el alias — comprobado uno a uno en el retrabajo del CDR-01 (SD-39).

POR QUE NO SE PARCHEA LA SKILL
------------------------------
Porque un parche local a una herramienta compartida es invisible para el equipo
y se pierde en la siguiente actualizacion del plugin. El proyecto ya resolvio
este mismo dilema con `verificar_procedencia_mc01.py`, escrito porque el
validador de la skill comparaba por bolsa de palabras (`MC-00 §5.3`). Mismo
criterio aqui: herramienta propia, versionada y auditable, y el defecto se
reporta igualmente al mantenedor de la skill.

QUE HACE, EXACTAMENTE
---------------------
1. Ejecuta el generador de la skill, sin modificarlo.
2. Lee de `MC-01` el mapa etiqueta -> alias.
3. Sustituye SOLO en la linea de declaracion (`public [abstract] class ...`) y
   SOLO cuando la etiqueta no es un identificador valido.
4. Deja constancia de cada sustitucion y de la etiqueta original, que no se
   pierde: se conserva como comentario en la misma linea.
5. **Aborta** si una etiqueta invalida no tiene alias, o si el alias tampoco es
   valido, o si la etiqueta aparece fuera de su linea de declaracion. Callar
   cualquiera de los tres casos produciria un archivo que parece correcto.

Se comprobo (SD-39) que las 20 etiquetas aparecen EXACTAMENTE UNA VEZ, en su
declaracion: a las pantallas solo se llega por dependencias, y el generador no
emite dependencias como campos. La comprobacion 5 vuelve a verificarlo en cada
ejecucion en vez de darlo por hecho.

Uso:
    python docs/07_casos_uso/clases/scripts/generar_cabeceras_mc01.py \
        --generador <ruta a generate_code_headers.py de la skill> \
        [--clases docs/07_casos_uso/clases/MC-01_modelo_clases_diseno.puml] \
        [--salida cabeceras.txt]

Codigos de salida:
    0  generadas y corregidas
    2  error de uso, archivo no encontrado o fallo del generador
    3  una etiqueta invalida sin alias utilizable, o aparicion inesperada
"""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[4]
CLASES_POR_DEFECTO = RAIZ / "docs/07_casos_uso/clases/MC-01_modelo_clases_diseno.puml"

# `class "Etiqueta" as Alias` — la unica forma que produce el desajuste.
#
# El alias se captura ENTERO, hasta el espacio o la llave, y no con `(\w+)`.
# Con `(\w+)` la captura se cortaba en el primer caracter no-palabra, de modo que
# `as B_Landing-P01` se leia como `B_Landing`: un identificador valido POR
# CONSTRUCCION. Eso volvia INALCANZABLE la segunda guarda —la que comprueba
# `IDENTIFICADOR.match(nuevo)`—, porque nunca podia recibir un alias invalido.
# Y era peor que no disparar: el script emitia la clase con un identificador
# DISTINTO del que el modelo declara, en silencio, que es exactamente el modo de
# fallo que la regla #2 del CDR existe para cazar. Hallazgo `SD-40-H1`, detectado
# al ejercitar las guardas con un generador simulado; corregido en SD-42.
DECL_CON_ALIAS = re.compile(r'^\s*(?:abstract\s+)?class\s+"([^"]*)"\s+as\s+([^\s{]+)', re.M)
# La linea que el generador emite por clase.
DECL_EMITIDA = re.compile(r'^public (?:abstract )?(?:class|enum|interface) ')
IDENTIFICADOR = re.compile(r'^[A-Za-z_][A-Za-z0-9_]*$')


def mapa_alias(ruta_clases: Path) -> dict[str, str]:
    texto = ruta_clases.read_text(encoding="utf-8")
    return {m.group(1): m.group(2) for m in DECL_CON_ALIAS.finditer(texto)}


NOMBRE_EMITIDO = re.compile(
    r'^public (?:abstract )?(?:class|enum|interface) (.*?)\s*\{')
MARCA_SOLUCION = "  // <<solucion>>"


def nombre_emitido(linea: str) -> str | None:
    """El nombre de clase tal y como el generador lo escribio.

    No se puede partir por el primer espacio: el nombre PUEDE contener
    espacios, y ese es justo el defecto que este script corrige. Se toma todo
    lo que hay hasta la llave y despues se recorta la clausula de herencia.
    """
    m = NOMBRE_EMITIDO.match(linea)
    if m is None:
        return None
    nombre = m.group(1)
    for corte in (" extends ", " implements "):
        if corte in nombre:
            nombre = nombre.split(corte, 1)[0]
    return nombre.strip()


def corregir(texto: str, alias: dict[str, str]) -> tuple[str, list[str], list[str]]:
    lineas = texto.splitlines()
    cambios: list[str] = []
    errores: list[str] = []

    invalidas = set()
    for i, linea in enumerate(lineas):
        nombre = nombre_emitido(linea)
        if nombre is None or IDENTIFICADOR.match(nombre):
            continue
        invalidas.add(nombre)
        nuevo = alias.get(nombre)
        if nuevo is None:
            errores.append(
                f"L{i+1}: «{nombre}» no es un identificador valido y el modelo "
                f"no le da alias. Corrige el MODELO, no este script.")
            continue
        if not IDENTIFICADOR.match(nuevo):
            errores.append(
                f"L{i+1}: «{nombre}» tiene alias '{nuevo}', que tampoco es un "
                f"identificador valido. Corrige el MODELO.")
            continue
        es_solucion = MARCA_SOLUCION in linea
        nueva = linea.replace(MARCA_SOLUCION, "").replace(nombre, nuevo, 1).rstrip()
        # La etiqueta NO se pierde: es lo que lleva el significado, y quien
        # inspeccione la cabecera tiene que poder volver del identificador a la
        # pantalla que nombra.
        nueva += f"  // {nombre}"
        if es_solucion:
            nueva += "  <<solucion>>"
        lineas[i] = nueva
        cambios.append(f"{nombre}  ->  {nuevo}")

    # Ninguna etiqueta invalida puede aparecer fuera de su declaracion: si lo
    # hace, sustituir solo la declaracion dejaria una referencia colgando.
    for i, linea in enumerate(lineas):
        if DECL_EMITIDA.match(linea):
            continue
        for nombre in invalidas:
            if nombre in linea:
                errores.append(
                    f"L{i+1}: «{nombre}» aparece FUERA de su declaracion; "
                    f"sustituir solo la declaracion dejaria esta referencia rota.")
    return "\n".join(lineas) + "\n", cambios, errores


def main(argv=None) -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--generador", required=True,
                   help="ruta a generate_code_headers.py de la skill iconix-cdr-review")
    p.add_argument("--clases", default=str(CLASES_POR_DEFECTO))
    p.add_argument("--id", default="CDR-01")
    p.add_argument("--salida", help="archivo destino; por defecto, stdout")
    args = p.parse_args(argv)

    gen, clases = Path(args.generador), Path(args.clases)
    for ruta, que in ((gen, "generador"), (clases, "modelo de clases")):
        if not ruta.exists():
            print(f"No existe el {que}: {ruta}", file=sys.stderr)
            return 2

    # El generador estampa la ruta recibida en la cabecera del archivo. Se le
    # pasa RELATIVA A LA RAIZ del repositorio para que la salida no arrastre una
    # ruta de la maquina de quien la genero: si el archivo llega a versionarse,
    # `C:\Users\...` seria a la vez ruido y una falsa pista.
    try:
        ruta_gen = clases.resolve().relative_to(RAIZ).as_posix()
    except ValueError:
        ruta_gen = str(clases)

    r = subprocess.run([sys.executable, str(gen), "--clases", ruta_gen,
                        "--id", args.id],
                       cwd=str(RAIZ),
                       capture_output=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        print(f"El generador de la skill fallo (codigo {r.returncode}):",
              file=sys.stderr)
        print(r.stderr, file=sys.stderr)
        return 2

    # El generador imprime las cabeceras y despues su informe; se corta en la
    # marca del informe para no arrastrarlo al archivo.
    crudo = r.stdout.split("QUE REVELA LA TRADUCCION A CODIGO")[0].rstrip()
    texto, cambios, errores = corregir(crudo, mapa_alias(clases))

    if errores:
        print("ABORTADO: el modelo tiene algo que este script NO debe tapar.",
              file=sys.stderr)
        for e in errores:
            print(f"  - {e}", file=sys.stderr)
        return 3

    if args.salida:
        Path(args.salida).write_text(texto, encoding="utf-8")
        print(f"Cabeceras escritas en {args.salida}")
    else:
        print(texto)

    print()
    print("NOMBRES DE CLASE CORREGIDOS (etiqueta -> alias)")
    if cambios:
        for c in cambios:
            print(f"  {c}")
        print(f"  Total: {len(cambios)}. La etiqueta se conserva como comentario "
              f"en la misma linea; no se pierde.")
    else:
        print("  Ninguno: todas las etiquetas ya eran identificadores validos.")
    print()
    print("Esto NO es codigo de produccion: es el instrumento de la regla #2.")
    print("Si algo esta mal, esta mal en el MODELO. No se edita aqui.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
