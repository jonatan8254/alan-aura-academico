---
name: sync-frontend
description: Sincroniza el workspace local con los últimos cambios compartidos en main (contrato-api, mock, vercel.json, CONTRATO_API_v1.md) y resume qué cambió. Úsalo cuando te avisen que hay novedades que traer al frontend, antes de seguir trabajando.
---

# sync-frontend

Trae a la rama actual (normalmente `frontend`) los últimos cambios de `main` —la base
compartida del proyecto: `packages/contrato-api`, `backend/mock`, `frontend/vercel.json`,
`docs/10_arquitectura/CONTRATO_API_v1.md`— y resume exactamente qué cambió, para que quien
ejecuta esto no tenga que preguntar. No toca nada de `backend/infra` ni de los handlers Lambda:
eso vive solo en la rama `backend` y no es relevante para el frontend.

## Pasos

1. **Verificar que el working tree está limpio.** Corré `git status --short`. Si hay cambios sin
   commitear, **parar y preguntar** al usuario si quiere commitearlos o guardarlos con
   `git stash -u` antes de seguir — nunca asumir. No continuar con el working tree sucio.

2. **Traer las referencias remotas.** `git fetch origin`.

3. **Mostrar qué va a entrar, antes de traerlo.** Corré:
   ```
   git log --oneline HEAD..origin/main
   ```
   Si no hay nada nuevo, decilo y terminar acá — no hace falta seguir con los pasos siguientes.

4. **Mergear.** `git merge origin/main --no-edit`.
   - Si hay conflictos: **no los resuelvas a ciegas**. Para archivos compartidos
     (`packages/contrato-api/**`, `docs/10_arquitectura/CONTRATO_API_v1.md`,
     `backend/mock/**`, `frontend/vercel.json`) lo normal es que `origin/main` tenga la versión
     correcta si la rama local no los tocó a propósito — pero mostrale el conflicto al usuario y
     dejá que decida, no asumas.

5. **Reinstalar dependencias y reconstruir el contrato.**
   ```
   npm install
   npm run build --workspace contrato-api
   ```
   Si algo falla acá, repórtalo tal cual — no lo ocultes ni lo "arregles" adivinando.

6. **Resumir el impacto, no solo el `git log`.** De los commits nuevos (paso 3), identificá cuáles
   tocaron:
   - `packages/contrato-api/src/*` — cambios de tipos/contrato: decí qué campos, rutas o códigos
     de estado cambiaron (leé el diff si hace falta, `git show <commit> -- packages/contrato-api`).
   - `docs/10_arquitectura/CONTRATO_API_v1.md` — mismo contrato en prosa, útil si el diff de tipos
     no es suficiente para entender el porqué.
   - `backend/mock/**` — si el mock cambió de comportamiento (nuevas rutas, fixtures distintos).
   - `frontend/vercel.json` — si cambió el rewrite (poco frecuente, pero rompe la conexión al mock
     si pasa desapercibido).
   Ignorá en el resumen los commits que solo tocan `backend/infra` o handlers Lambda — no son
   relevantes para quien trabaja en frontend.

7. **Recordar el reinicio del mock.** Si el usuario tiene `npm run mock` corriendo en otra
   terminal, avisarle que lo reinicie para que tome los fixtures/rutas nuevas (`tsx` no hace
   hot-reload de dependencias del workspace).

## Qué NO hacer

- No mergear `backend` en la rama de frontend — no es relevante y puede traer código que no
  compila sin las dependencias de `backend/infra` (CDK, AWS SDK).
- No hacer `git push --force` ni reescribir historia bajo ninguna circunstancia.
- No inventar un resumen de cambios sin haber leído los commits/diffs reales — si no se pudo
  determinar el impacto de un commit, decilo explícitamente en vez de omitirlo o adivinar.
