---
name: commit
description: Verifica un ticket y registra un commit trazable después de sus documentos.
disable-model-invocation: true
---

# /commit

1. Identifica el ID del ticket en `docs/backlog/TICKETS.md`.
2. Confirma que el PRD y la spec del ticket ya estén en un commit anterior.
3. Revisa `git diff`, ejecuta `npm run test` y `npm run build` cuando corresponda.
4. Verifica que `git status` no incluya `.env`, `node_modules`, ni claves.
5. Commitea exclusivamente los archivos del ticket con `git commit -m "feat(E2-XX): ..."`.
6. Si falla algo, registra el bloqueo y NO inventes una ejecución exitosa.
