# EVANGEL GitHub and Base44 Workflow

## Branch model

- `main` is the Base44-synchronized stable branch.
- Structural and feature work happens on focused branches.
- Pull requests run CI before merge.

## Required CI

```bash
npm ci
npm run lint
npm run build
```

## Base44 synchronization

GitHub synchronization and Base44 publishing are separate concerns. Merge verified code to `main`; allow Base44's Git synchronization to receive the change; publish from the Base44 dashboard when ready.

Do not use a competing deployment path that causes deployed Base44 state to diverge from Git history.

## Binary hygiene

Normal Git history is for source and optimized runtime assets. Keep historical ZIPs, duplicate PDF/DOCX exports, raw generated art archives, and large publication bundles out of the repository unless they are truly required. Use Releases or external storage for distributable bundles, and Git LFS only for binaries that genuinely require version tracking.