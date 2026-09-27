# Sugar Nails: site vitrine

Site premium bilingue (bulgare par défaut, anglais sur `/en/`) du studio de manucure Sugar Nails, à Ovcha Kupel (Sofia). Les réservations passent par Studio24.

Stack : [Vite](https://vite.dev), [React](https://react.dev), TypeScript et [Motion](https://motion.dev) pour les animations.

## Démarrer

```bash
npm install
npm run dev
```

Le site est ensuite disponible sur http://localhost:5173 (et http://localhost:5173/en/ en anglais).

## Scripts

| Commande          | Rôle                                                        |
| ----------------- | ----------------------------------------------------------- |
| `npm run dev`     | Serveur de développement avec rechargement à chaud          |
| `npm run build`   | Vérification TypeScript puis build dans `dist/` (`/` et `/en/`) |
| `npm run preview` | Sert le build de production en local                        |
| `npm run lint`    | Analyse du code avec Oxlint                                  |

## Modifier le contenu

- **Textes** (bulgare et anglais) : `src/i18n/dict.ts`.
- **Infos du salon** (téléphone, horaires, prix, liens, widget Studio24, note) : `src/salon.ts`.
- **Photos et logo** : `src/assets/img/` (WebP). Pour changer une photo de la galerie, remplacez le fichier en gardant le même nom.
- **Référencement** (titre, description, image de partage) : `index.html` et `en/index.html`.

Le brief et la direction artistique sont décrits dans `brief.md`, les règles de code dans `CLAUDE.md`.
