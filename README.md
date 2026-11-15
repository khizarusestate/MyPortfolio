# Khizar Hayat — Portfolio

A premium, interactive personal portfolio built with React, Vite, Three.js and React Three Fiber.

## Planned experience
- Cinematic hero with an animated 3D character placeholder
- Camera presets: front, back, left, right, top and bottom
- Subtle idle / breathing motion (placeholder animation until the final scanned model is ready)
- About, experience, skills, projects and contact sections
- Responsive layout, accessible controls and reduced-motion support

## Tech stack
- React + Vite
- Three.js via @react-three/fiber and @react-three/drei
- Framer Motion for interface transitions
- Lucide React for icons

## Requirements
- Node.js 20.19+ or 22.12+
- npm

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

## 3D model integration
The hero currently uses a lightweight procedural placeholder. When the personal scan is ready, export it as GLB/GLTF and replace the placeholder scene. Keep the model's origin near the feet and use meters consistently where possible.

## Project status
Initial scaffold. Portfolio content and final 3D scan will be added in later iterations.
