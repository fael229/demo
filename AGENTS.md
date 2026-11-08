# 🤖 AGENTS & IA OPERATING SYSTEM — STUDIO VIDÉO-AS-CODE, MOTION DESIGN & AUDIT

Bienvenue ! Ce fichier est le manuel d'instructions automatique et la charte de conduite pour toute IA ou Agent (Antigravity, OpenCode, Claude Code, Codex) opérant dans ce workspace.

---

## 🛑 PROTOCOLE STRICT : CADRAGE ÉTAPE PAR ÉTAPE SANS HALLUCINATION

> [!IMPORTANT]
> **RÈGLE FONDAMENTALE DÈS LE PREMIER PROMPT DE L'UTILISATEUR :**  
> Ne **JAMAIS** foncer tête baissée dans la génération de code sans avoir validé la direction créative.  
> Après le premier prompt de l'utilisateur, l'Agent **DOIT** poser les questions de cadrage nécessaires pour verrouiller les choix clés et avancer étape par étape sans halluciner.

### 📋 Questionnaire de Cadrage Immédiat (À présenter dès le 1er tour) :
1. **Objectif & Format** :
   - *Choix A* : **Spot / Trailer commercial percutant (30-45s)** (style Keynote Apple, typographie cinétique, reveals 3D via *Huashu-Motion*).
   - *Choix B* : **Démo produit interactive guidée (1-3 min)** (parcours complet du site, clics, formulaires via *Argo*).
   - *Choix C* : **Réplication d'une vidéo modèle** (clonage du mouvement d'une vidéo fournie via *Reanimate*).
   - *Choix D* : **Schéma animé explicatif** (diagramme vectoriel de flux via *Explainroo*).
2. **Ratio & Diffusion** : 16:9 horizontal (YouTube/Web) ou 9:16 vertical (TikTok/Reels) ?
3. **Univers Sonore** : Voix off française (Gemini TTS), bande-son musicale rythmée (procéder par tempo/BPM), ou bruitages UI seuls (Earshot) ?
4. **Message Clé** : Quelle est la promesse n°1 ou le problème résolu par le produit ?

### 🪜 Les 4 Jalons de Validation Étape par Étape :
- **Jalon 1 (Storyboard & Direction)** : Proposer 2 à 3 directions artistiques claires et attendre le feu vert.
- **Jalon 2 (Structure & Scènes)** : Rédiger les textes de scènes (`.scenes.json` ou `treatment.md`) avant d'animer.
- **Jalon 3 (Production & Preview)** : Coder l'animation, extraire les frames clés (`om still` ou `argo preview`) et montrer le résultat.
- **Jalon 4 (Mixage Sonore & Export)** : Insérer les SFX Earshot, la voix Gemini et exporter en MP4 Full HD 1080p audité avec Video-Director.

---

## 🧰 Outils intégrés et Orchestration (`studio.mjs`)

Le point d'entrée unique de tout le studio est :
```bash
node studio.mjs <commande> [options]
```

### 1. Trailers & Spots Publicitaires Produit (Huashu-Motion)
- **Créer un nouveau teaser commercial** :
  ```bash
  node studio.mjs trailer <nom-du-projet> [template]
  ```
  *Templates disponibles :* `keynote-ui` (Apple style), `ui-space` (3D interface layers), `object-3d` (produit en studio), `kinetic-type` (mots percutants), `math-3b1b` (explications techniques), `vox-collage` (documentaire).
- **Lancer le studio interactif "Point-and-Edit"** :
  ```bash
  node studio.mjs motion studio trailers/<nom-du-projet>
  ```
- **Rendu en vidéo MP4 Full HD avec motion blur** :
  ```bash
  node studio.mjs motion render trailers/<nom-du-projet> --blur
  ```

### 2. Démos Interactives d'Applications (Argo + Gemini TTS)
- **Scaffolding d'un nouveau projet de démo** :
  ```bash
  node studio.mjs new <nom> <https://url-du-site.com> [Titre]
  ```
- **Rendu en vidéo MP4 Full HD 1080p** :
  ```bash
  node studio.mjs demo <nom>
  ```

### 3. Rétro-ingénierie & Réplication d'Animations (Reanimate + FFmpeg)
Quand l'utilisateur fournit une vidéo de référence à reproduire :
- **Déconstruire la vidéo** :
  ```bash
  node studio.mjs replicate <chemin-video.mp4> <nom-du-projet>
  ```
  Extrait les frames clés à 10 fps, crée une planche contact `filmstrip_overview.png` et génère le contrat de mouvement `spec.md`.
- **Adapter avec le nouveau sujet** : L'agent édite `replications/<nom>/index.html` pour calquer le rythme sur le nouveau sujet.

### 4. Exploration & Audit Autonome de Sites Web (Stagehand)
- **Crawl & Cartographie universelle de n'importe quel site** :
  ```bash
  node studio.mjs audit <url-ou-nom-projet> [nombre-de-pages]
  ```
  Découvre automatiquement les liens, génère des captures Desktop (1920×1080) et Mobile responsive (390×844) dans `audit_screenshots/<domaine>/`.

### 5. Sound Design Procédural (Earshot)
- **Générer des effets sonores UI sans licence** :
  ```bash
  node studio.mjs sfx render whoosh_fast/crisp -o assets/sfx/whoosh.wav
  node studio.mjs sfx render tactile_switch/medium -o assets/sfx/click.wav
  ```

### 6. Schémas Explicatifs & Motion Design (Explainroo)
- **Animation vectorielle Canvas** :
  ```bash
  node studio.mjs explainer init <nom> --language fr
  node studio.mjs explainer render
  ```

### 7. Contrôle Qualité Audio/Vidéo (Video Director)
- **Auditer la conformité technique** :
  ```bash
  node studio.mjs qa <video.mp4>
  ```
