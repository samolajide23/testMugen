# Hitman Spine Character Lab

Source of truth: **`packs/hitman`** (Spine 3.8 skeleton + atlas).

## Run

```powershell
npm run sync:hitman
npm run dev
```

Open **http://127.0.0.1:5180/preview/index.html**

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Preview server on `:5180` |
| `npm run sync:hitman` | Copy `packs/hitman` → `generated/spine/hitman` |
| `npm run test:hitman` | Playwright smoke for Hitman Spine |

Edit bones/anims/art only under `packs/hitman`, then sync.
