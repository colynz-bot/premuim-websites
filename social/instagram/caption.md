# Instagram Codex Web : projet Sugar Nails (bulgare)

Direction : carnet de projet. Papier et encre, vraies captures du site posées à plat, annotations en mono, un seul cercle rose par visuel. On raconte une décision de design par slide au lieu de lister des « fonctionnalités ».

| Fichier | Format | Contenu |
| --- | --- | --- |
| `post-1.png` | 1080×1350 | « Всичко е розово. » : le slogan du salon sur leur photo |
| `post-2.png` | 1080×1350 | « Затова сайтът е черен. » : le parti pris |
| `post-3.png` | 1080×1350 | Les 3 couleurs, avec leurs noms tirés du code |
| `post-4.png` | 1080×1350 | Le « д » bulgare et le « д » russe : la police Sofia Sans |
| `post-5.png` | 1080×1350 | « Не смален. Пренареден. » : la version mobile |
| `post-6.png` | 1080×1350 | Les cristaux de sucre, image par image |
| `post-7.png` | 1080×1350 | Conclusion et crédits du projet |
| `story-1.png` | 1080×1920 | Accroche |
| `story-2.mp4` | 1080×1920, 22 s | Défilement réel du site, avec la section en cours à droite |
| `story-3.png` | 1080×1920 | Quiz : lequel des deux « д » est bulgare ? |
| `story-4.png` | 1080×1920 | Réponse + appel à l'action |

Pour régénérer : `npm run build`, `npx vite preview --port 4173`, puis `node social/instagram/source/render.cjs`. Les textes sont dans `source/templates.html`.

---

## Légende du post (à copier)

```
„Всичко е розово“ — това е девизът на Sugar Nails, студио за маникюр в Овча купел.

Затова направихме сайта им черен.

На черен фон снимките на ноктите изпъкват, а розовото остава за това, което се натиска — най-вече за бутона „Запази час“. Така окото знае къде да отиде.

Още няколко неща, които не се виждат от пръв поглед:
• шрифтът е Sofia Sans, създаден в България, и пише с българските форми на буквите, не с руските
• на телефона сайтът е пренареден, не смален — галерия с плъзгане и бутон за час под палеца
• часът се запазва през Studio24, без да излизаш от сайта
• кристали от „захар“ се събират в нокът при всяко отваряне

Плъзни, за да видиш процеса →

Искаш сайт, който прилича на бизнеса ти, а не на шаблон? Пиши ни „сайт“ в DM.

Снимки: @sugar_nails_sofia

#уебдизайн #изработканасайт #сайт #дизайн #типография #кирилица #софия #овчакупел #маникюр #webdesign #typography #cyrillic
```

Identifier `@sugar_nails_sofia` sur les slides 1 et 5, lieu : « Овча купел, София ».

## Texte alternatif (Paramètres avancés → Accessibilité)

1. Розови стилето нокти с брокат и надпис „Всичко е розово.“
2. Началната страница на сайта на Sugar Nails на черен фон; бутонът „Запази час“ е ограден в розово.
3. Три цветни мостри: черно #0B0909, захарно бяло #F5EEE8 и розово #E3568E.
4. Буквите д, л, в, г в руска и в българска форма, и надписът „Сладка прецизност.“
5. Три екрана от мобилната версия: цени, галерия и студиото.
6. Три кадъра от анимацията, в която кристали се събират във формата на нокът.
7. Надпис „Сайт, който прилича на бизнеса ти.“ и данни за проекта.

---

## Stories : stickers à ajouter dans Instagram

Le bas des stories 3 et 4 est laissé vide exprès pour les stickers.

1. **story-1.png** : sticker mention `@sugar_nails_sofia`.
2. **story-2.mp4** : rien à ajouter. Si tu mets une musique, garde-la discrète.
3. **story-3.png** : sticker **Quiz** sous les deux cadres.
   Question : `Кое е българското?` · Réponses : `А` / `Б` (bonne réponse : **Б**).
   N'écris pas la lettre « д » dans le sticker : la police d'Instagram affiche la forme russe.
4. **story-4.png** : sticker **Question** sous le texte : `Какъв сайт ти трябва?`
   (ou un sticker lien vers ton site si tu en as un).

Ensuite, ajoute les 4 stories à la une « Проекти ».
