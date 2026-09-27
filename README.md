# premuim-websites

Projet [Vite](https://vite.dev) + [React](https://react.dev) + TypeScript, avec [Motion](https://motion.dev) pour les animations.

## Démarrer

```bash
npm install
npm run dev
```

Le site est ensuite disponible sur http://localhost:5173.

## Scripts

| Commande          | Rôle                                                  |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Serveur de développement avec rechargement à chaud    |
| `npm run build`   | Vérification TypeScript puis build dans `dist/`       |
| `npm run preview` | Sert le build de production en local                  |
| `npm run lint`    | Analyse du code avec Oxlint                           |

## Motion

`src/App.tsx` montre les bases de Motion pour React (`import { motion } from 'motion/react'`) :

- **Entrée en cascade** : `variants` et `delayChildren: stagger(...)`.
- **Gestes** : `whileHover` et `whileTap`.
- **Apparition au défilement** : `whileInView`.

`<MotionConfig reducedMotion="user">` rend instantanés les déplacements et les zooms pour les visiteurs qui ont activé la réduction des animations dans leur système. Les fondus sont conservés.

Documentation : https://motion.dev/docs/react
