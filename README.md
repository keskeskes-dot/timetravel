# TimeTravel Agency — Webapp interactive

Webapp immersive pour une **agence de voyages temporels fictive**. Le site présente
un catalogue de trois destinations à travers l'Histoire, un agent conversationnel IA
(« Chronos ») et un quiz de recommandation personnalisée. Projet pédagogique réalisé
avec l'aide d'outils d'IA générative.

> Destinations proposées : **Paris 1889** (Belle Époque), le **Crétacé** (ère des
> dinosaures) et **Florence 1504** (Renaissance).

## 🛠️ Stack technique

- **Next.js 14** (App Router) + **React 18**
- **TypeScript**
- **Tailwind CSS** (thème sur mesure : palette `chrono` / `void`, utilitaires custom)
- **Framer Motion** (animations d'apparition, hero animé)
- **Mistral AI API** (`mistral-small-latest`) pour le chatbot et le quiz
- **pngjs** (script de traitement d'images pour détourer le logo)
- Cible d'hébergement : **Netlify**

## ✨ Features implémentées

- **Page d'accueil** : hero animé (fond étoilé CSS + image), présentation de l'agence,
  statistiques, galerie, section « comment ça marche » en 3 étapes, bloc agent, FAQ et
  CTA final.
- **Galerie des destinations** (`/destinations`) : 3 époques en cards interactives,
  chacune affichant son **tarif d'entrée**.
- **Pages de détail** (`/destinations/[slug]`) : temps forts, infos clés (climat, durée,
  niveau), **tarifs Découverte / Prestige** et FAQ propre à chaque destination.
- **Comparateur** (`/comparateur`) : tableau comparatif des 3 époques (durée, climat,
  niveau, tarifs, temps forts) pour choisir d'un coup d'œil.
- **Chatbot IA « Chronos »** : widget de chat flottant, branché sur l'API Mistral.
  Le prompt système intègre tout le catalogue et les tarifs (source de vérité unique dans
  `lib/destinations.ts`) pour des réponses cohérentes ; il rend le markdown léger (gras,
  liens vers les fiches) et **persiste la conversation** via `sessionStorage`.
- **Quiz de recommandation personnalisée** (`/quiz`) : 4 questions, scoring déterministe
  côté serveur, puis explication personnalisée générée par l'IA. Un **fallback sans IA**
  garantit une recommandation cohérente si la clé API est absente ou l'API indisponible.
  Le résultat affiche le tarif et peut être **partagé** (Web Share API + copie du lien).
- **Pages légales** : mentions légales, politique temporelle et CGV (`/mentions-legales`,
  `/politique-temporelle`, `/cgv`), clairement identifiées comme contenu fictif.
- **États de navigation** : 404 (`not-found`), error boundary et écran de chargement
  aux couleurs du site.
- **Design responsive** mobile-first (grilles 1 → 2 → 3 colonnes).

## 🤖 Outils IA utilisés (transparence)

- **Code** : généré et itéré avec un assistant de codage IA (Cursor).
- **Chatbot & recommandations quiz** : **Mistral AI** (`mistral-small-latest`) appelé via
  l'API REST officielle (`https://api.mistral.ai/v1/chat/completions`) dans
  `app/api/chat/route.ts` et `app/api/quiz/route.ts`.
- **Visuels** : illustrations des destinations et logo générés par IA (image generation),
  puis détourage du logo via le script `scripts/make-transparent.mjs`.

## 📦 Installation

Prérequis : **Node.js 18+** et npm.

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
#    Copier l'exemple puis renseigner votre clé Mistral
cp .env.local.example .env.local          # macOS / Linux
copy .env.local.example .env.local        # Windows (PowerShell / CMD)
```

Renseigner ensuite dans `.env.local` :

```env
MISTRAL_API_KEY=votre_cle_api_mistral
MISTRAL_MODEL=mistral-small-latest   # optionnel
```

> Une clé API Mistral gratuite s'obtient sur [console.mistral.ai](https://console.mistral.ai/).
> Sans clé, le site fonctionne quand même : le quiz utilise un fallback déterministe et le
> chatbot renvoie un message d'indisponibilité.

```bash
# 3. Lancer le serveur de développement
npm run dev
```

Ouvrir ensuite [http://localhost:3000](http://localhost:3000).

> ℹ️ Les scripts `dev`, `build` et `start` chargent `exfat-fs-patch.js` (`node --require`).
> Ce correctif ne sert que lorsque le projet est stocké sur un volume **exFAT** (où
> `fs.readlink()` renvoie `EISDIR`) ; il est sans effet sur NTFS, macOS ou Linux.

### Scripts disponibles

| Commande            | Description                                       |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Serveur de développement                          |
| `npm run build`     | Build de production                               |
| `npm run start`     | Sert le build de production                       |
| `npm run lint`      | Linting (ESLint / `eslint-config-next`)           |
| `npm run test`      | Tests unitaires de la logique du quiz             |
| `npm run test:api`  | Test d'intégration de l'endpoint `/api/quiz`      |

## 🗂️ Structure du projet

```
app/
  layout.tsx                 Layout global (header, footer, chat)
  page.tsx                   Page d'accueil
  loading.tsx                Écran de chargement global
  not-found.tsx              Page 404
  error.tsx                  Error boundary global
  destinations/page.tsx      Galerie
  destinations/[slug]/       Détail d'une destination (tarifs inclus)
  comparateur/page.tsx       Tableau comparatif des destinations
  quiz/page.tsx              Quiz de recommandation
  mentions-legales/          Mentions légales
  politique-temporelle/      Politique temporelle
  cgv/                       Conditions générales de vente
  api/chat/route.ts          Endpoint chatbot (Mistral)
  api/quiz/route.ts          Endpoint recommandation quiz (Mistral + fallback)
components/                  Header, Footer, cards, chat, quiz, FAQ, légal, animations
lib/
  destinations.ts            Source de vérité : destinations + tarifs (formatEuros)
  quiz.ts                    Questions + algorithme de scoring
public/images/               Visuels des destinations et logos
scripts/
  make-transparent.mjs       Détourage du logo (pngjs)
  make-favicon.cjs           Génération du favicon
  test-logic.cjs             Tests unitaires de la logique du quiz
  test-quiz.mjs              Test d'intégration de /api/quiz
next.config.js               Config Next.js + correctif exFAT (webpack)
next.config.mjs              Config Next.js (reactStrictMode)
exfat-fs-patch.js            Patch readlink EISDIR -> EINVAL (volumes exFAT)
```

## 🙏 Crédits

- **API IA** : [Mistral AI](https://mistral.ai/) — modèle `mistral-small-latest`.
- **Framework** : [Next.js](https://nextjs.org/).
- **Hébergement** : [Netlify](https://www.netlify.com/).
- **Styles** : [Tailwind CSS](https://tailwindcss.com/).
- **Animations** : [Framer Motion](https://www.framer.com/motion/).
- **Traitement d'images** : [pngjs](https://github.com/pngjs/pngjs).
- **Visuels & logo** : générés par IA (image generation).
- Contenus (destinations, tarifs, FAQ) : **fictifs**, à visée pédagogique.

## 📄 Licence

Projet pédagogique — M1/M2 Digital & IA. Usage éducatif uniquement.
