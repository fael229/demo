# 🎬 Studio Vidéo-as-Code & Création / Réplication de Motion Design

Système universel d'orchestration pour :
1. **Trailers & Spots Publicitaires Produit** (Huashu-Motion : GSAP, 3D Keynote, musique algorithmique).
2. **Démos de sites & applications** (Argo + Playwright + voix Google Gemini TTS native en français).
3. **Rétro-ingénierie & Réplication d'animations de référence** (Reanimate + FFmpeg frame-by-frame).
4. **Schémas animés explicatifs** (Explainroo + Canvas vectoriel).
5. **Sound Design procédural** (Earshot, 252 bruitages UI générés mathématiquement).
6. **Exploration & Audit autonome de navigateurs** (Stagehand piloté par l'IA).
7. **Contrôle Qualité & Conformité vidéo** (Video-Director QA).

---

## 🛑 Protocole Collaboratif Étape par Étape

Dès l'ouverture d'une session, l'IA ne fonce jamais à l'aveugle : elle analyse votre demande, vous pose les questions de cadrage indispensables (format, univers sonore, message clé) et avance avec vous jalon par jalon pour garantir un résultat sur-mesure et **zéro hallucination**.

Consultez [AGENTS.md](AGENTS.md) pour les règles d'exploitation complètes.

---

## 🛠️ Commandes Principales (`studio.mjs`)

| Action | Commande | Description |
|---|---|---|
| **Trailer / Teaser 30s** | `node studio.mjs trailer <projet> [template]` | Génère un spot publicitaire dynamique style Apple Keynote |
| **Studio Live Motion** | `node studio.mjs motion studio <dossier>` | Ouvre l'éditeur interactif "Point-and-Edit" dans le navigateur |
| **Démo Logicielle Guidée** | `node studio.mjs demo [nom]` | Enregistre l'application et exporte le MP4 avec voix Gemini |
| **Nouveau Projet Démo** | `node studio.mjs new <nom> <url> [titre]` | Initialise le script de démo et le scénario vocal |
| **Répliquer une Vidéo** | `node studio.mjs replicate <video.mp4> <nom>` | Déconstruit une vidéo d'inspiration pour copier son mouvement |
| **Explorer & Auditer** | `node studio.mjs audit <url\|nom> [pages]` | Exploration autonome de n'importe quel site web |
| **Sound Design** | `node studio.mjs sfx render <id> -o <fichier.wav>` | Génère des bruitages UI procéduraux |
| **Contrôle Qualité** | `node studio.mjs qa <video.mp4>` | Audit de conformité vidéo (Loudness, freeze) |

---

## 📁 Architecture du Workspace

```
demo/
├── .reanimate/           # Données de déconstruction vidéo (frames, filmstrips, spec.md)
├── assets/               # SFX audio, logos et polices
├── audit_screenshots/    # Captures d'écran issues des audits autonomes Stagehand
├── demos/                # Scripts de démo Playwright (.demo.ts) et scènes vocales (.scenes.json)
├── replications/         # Projets d'animation répliqués sur de nouveaux sujets
├── tools/
│   ├── earshot/          # Moteur de bruitages procéduraux Python
│   ├── explainroo/       # Moteur de motion design Canvas
│   ├── huashu-motion/    # Moteur de trailers & spots commerciaux GSAP
│   ├── reanimate/        # Moteur de rétro-ingénierie cinétique
│   └── video-director/   # Moteur de contrôle qualité vidéo
├── trailers/             # Projets de spots publicitaires Huashu-Motion
├── videos/               # Vidéos Full HD finales exportées
├── AGENTS.md             # Charte d'exploitation et protocole anti-hallucination
├── argo.config.mjs       # Configuration dynamique de rendu vidéo
├── gemini-engine.mjs     # Moteur Gemini TTS (voix Aoede)
├── studio.config.json    # Registre centralisé multi-projets
└── studio.mjs            # Orchestrateur CLI unique
```
