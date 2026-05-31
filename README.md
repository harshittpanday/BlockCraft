# 🧱 BlockCraft

A lightweight voxel sandbox game built with **Three.js**, featuring procedural terrain, block building, and basic physics.

---

## 🌍 Features

- 🌄 Procedural terrain generation (plains + mountains)
- 🌲 Tree generation system
- 🧱 Block placing and breaking
- 🎮 First-person movement (WASD + mouse look)
- 🦘 Jumping + gravity physics
- 🚧 Simple collision system
- 🎯 Hotbar block selection (1–3 / scroll wheel)

---

## 🎮 Controls

| Action | Key / Input |
|--------|------------|
| Move | W A S D |
| Jump | Space |
| Break block | Left Click |
| Place block | Right Click |
| Switch block | 1 / 2 / 3 |
| Scroll hotbar | Mouse wheel |
| Look around | Mouse |

---

## 🧠 How it works

BlockCraft uses:

- A 3D grid-based voxel system
- Simple height-based terrain generation using sine noise
- Basic collision detection using block proximity checks
- Raycasting for block interaction (place/break)

---

## 📁 Project Structure

Currently simplified to keep development stable:

```
BlockCraft/
├── index.html
├── main.js
├── style.css
└── README.md
```

---

## 🚀 Future Plans

- 🌳 More tree types and vegetation
- ⛰️ Improved terrain noise (Perlin/Simplex)
- 🕳️ Cave generation
- 🌅 Day/night cycle
- 📦 Inventory system
- 💾 Save/load worlds
- 🌍 Infinite chunk loading

---

## ⚠️ Notes

This project is still in early development.  
Some systems are intentionally simple to keep performance stable and debugging easy.

---

## 🧑‍💻 Tech Stack

- Three.js (WebGL rendering)
- JavaScript (core logic)
- HTML/CSS (UI + canvas)

---

## 📌 Status

👉 Playable prototype  
👉 Actively being developed  
👉 Focus: learning + building a Minecraft-style engine from scratch
```
