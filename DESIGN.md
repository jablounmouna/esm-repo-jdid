Design system — my-react-app

But: Fournit des directives concises pour un frontend propre, accessible et réutilisable.

1) Tokens
- Couleurs:
  - --color-bg: #faf8f5
  - --color-surface: #ffffff
  - --color-ink: #0f1720
  - --color-ink-soft: #596168
  - --color-primary: #1f4d3d
  - --color-accent: #c8973f
- Espacements: base = 16px, scale: 8,16,24,32
- Rayons: 6px / 12px
- Ombrages: soft / tight
- Max width: 1200px

2) Typographie
- Police affichage: Fraunces
- Police corps: Inter
- Échelles: h1=28px, h2=20px, base=16px
- Emphase: utiliser font-weight 600 pour titres

3) Layout & grid
- Page container: centré, padding 24px, max-width 1200px
- Grille produits: `grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))`
- Navbar: flex row, align-items center, justify-content space-between; breakpoint mobile -> column

4) Composants
- Buttons: `.btn`, variants `.btn-primary`, `.btn-ghost`, `.btn-sm`
- Cards: background surface, border-radius 12px, box-shadow
- Badges: pill, small
- Wishlist: circular button top-right

5) Accessibility
- Focus-visible styles (3px offset)
- Contrast: primary text / background meets AA
- Use `aria-label` on icon-only buttons

6) RTL
- When `ar` selected, add `dir="rtl"` to `<html>` or root container; flip margins/paddings where nécessaire.

7) Tailwind
- Conserver tokens en CSS variables et utiliser `theme.extend` dans `tailwind.config.js` si vous activez Tailwind utilities.

8) Implementation plan
- 1) Importer `src/style.css` globalement
- 2) Supprimer / neutraliser règles conflictuelles dans `src/index.css`
- 3) Standardiser `Navbar` classes pour utiliser `.brand`, `.nav-actions` et `.center`
- 4) Tester en desktop/tablet/mobile

Pour que je continue, je peux appliquer automatiquement l'import global et commencer à harmoniser `index.css` vs `style.css`.
