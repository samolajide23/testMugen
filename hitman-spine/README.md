# Hitman Spine

Standalone project with **only** the Hitman Spine character:

- `assets/Hitman.json` — skeleton + animations
- `assets/Hitman.atlas` + `assets/Hitman.png` — texture atlas
- `assets/character.json` — scale, anim map, physics, moves
- Spine 3.8 canvas runtime under `vendor/`

No other characters. No MUGEN import. No Roblox yet.

## Run

```powershell
npm start
```

Open **http://127.0.0.1:5180/**

Controls: **A/D** move · **F** flip · **Space** pause · animation dropdown to switch clips.

## License

Hitman art: Spine Asset Pack License (`assets/LICENSE.txt`).  
Runtime: Spine Runtimes license (`vendor/NOTICE.txt`).
