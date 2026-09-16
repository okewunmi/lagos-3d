# Dropping in real characters and props (Phase 2)

The scene currently renders flat-color placeholders for every marker.
To swap any of them for a real model, you don't need to touch any
component code — just:

1. Export your model as `.glb` (Draco-compressed if possible) and put
   it in `public/models/characters/` or `public/models/props/`.
2. In `src/data/chapters.js`, find the marker you want to upgrade and
   add a `model` (and optionally `animation`) field, e.g.:

   ```js
   { type: 'figure', pos: [9, 0, -10], color: '#c98f3a', label: 'Kosoko',
     model: 'characters/kosoko.glb', animation: 'Idle' }
   ```

3. Reload. `AssetSlot` will try to load `model`; if the file is
   missing or fails to parse, it silently falls back to the flat
   placeholder — so you can upgrade characters one at a time without
   ever breaking the build.

## Suggested Mixamo shopping list

Every character shares one base rig, so retargeting is automatic once
each is exported from Mixamo with the same skeleton:

| Character | Mixamo base | Animations to grab |
|---|---|---|
| Kosoko, Akitoye, Dosunmu (Obas) | Y Bot | Idle, Talking, Sitting (for the two treaty-signing chapters) |
| Beecroft, McCoskry (consular) | Y Bot | Idle, Walking, Talking |
| Bruce, Bedingfield (naval officers) | Y Bot | Idle, Salute, Walking |
| Oshodi Tapa (war captain) | Y Bot | Idle, Sword And Shield Slash, Battle Idle |

Costume each exported `.glb` in Blender (recolor the base mesh UVs,
or add simple attached geometry for crowns/epaulettes/sashes) before
dropping it into `public/models/characters/`.

## Props (poly.pizza)

Search poly.pizza for: sailing ship, cannon, west african hut,
colonial flag pole, palace / fort. Export as `.glb`, drop into
`public/models/props/`, reference the same way via `model` on a
`ship` / `palace` / `hut` / `flag` marker.
