# Motion refs → Hitman

Pipeline for basing Hitman Spine clips on external motion data (Brawlhalla-style or hand-authored).

## Intermediate format: `*.motion.json`

```json
{
  "id": "my-jab",
  "name": "My Jab",
  "fps": 60,
  "source": "demo | brawlhalla-anm | capture",
  "bones": {
    "ARM_F": [{ "time": 0, "angle": 0 }, { "time": 0.1, "angle": -35 }],
    "FOREARM_F": [{ "time": 0, "angle": 0 }, { "time": 0.1, "angle": -20 }]
  }
}
```

Bone IDs use Brawlhalla-like names + side (`_F` front / `_B` back):

| Ref bone | Hitman bone |
|---|---|
| `TORSO` | `Torso` |
| `ARM_F` / `ARM_B` | `F_UpperArm` / `B_UpperArm` |
| `FOREARM_F` / `FOREARM_B` | `F_Forearm` / `B_Forearm` |
| `LEG_F` / `LEG_B` | `F_Thigh` / `B_Thigh` |
| `SHIN_F` / `SHIN_B` | `F_Shin` / `B_Shin` |
| `FOOT_F` / `FOOT_B` | `F_Foot` / `B_Foot` |
| `NECK` / `HEAD` / `HAIR` | `Neck` / `Head` / `Hair` |

Angles are **degrees**, Spine-local rotate keys (same convention as Hitman.json).

## Without the game (works now)

```powershell
node tools/retarget-motion-to-hitman.mjs refs/samples/synthetic-jab.motion.json
```

Then hard-refresh the preview → category **Retarget**.

## With Brawlhalla installed (next step)

1. Install tools that read local `.anm` (e.g. [BrawlhallaAnmRender](https://github.com/bucccket/BrawlhallaAnmRender), [BhANMexporter](https://github.com/Farbigoz/BhANMexporter), [BrawlhallaAnimLib](https://github.com/allhailcheese/BrawlhallaAnimLib)).
2. Export one animation’s bone frames to JSON.
3. Convert Flash-style matrix fields (`ScaleX`, `RotateSkew0`, `RotateSkew1`, `ScaleY`, `X`, `Y`) into our `angle`/`x`/`y` motion format (helper TBD).
4. Run `retarget-motion-to-hitman.mjs` on that file.

```powershell
node tools/find-brawlhalla.mjs
```

Do **not** commit ripped BMG assets. Keep personal dumps out of git.

## Capture fallback

Drop frame PNGs or mp4 under `refs/captures/` for a future rotoscope pass if ANM export isn’t available.
