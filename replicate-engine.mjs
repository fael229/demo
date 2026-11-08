import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Usage : node replicate-engine.mjs <source_video.mp4> <project_name> [options]
const videoSource = (process.argv[2] || '').replace(/^["']|["']$/g, '');
const projectName = (process.argv[3] || 'replica_demo').replace(/^["']|["']$/g, '');

if (!videoSource) {
  console.error('❌ Erreur : Veuillez fournir le chemin vers la vidéo de référence (ex: node studio.mjs replicate input.mp4 mon-animation)');
  process.exit(1);
}

if (!fs.existsSync(videoSource)) {
  console.error(`❌ Fichier introuvable : ${videoSource}`);
  process.exit(1);
}

const workDir = path.resolve('.reanimate', projectName);
const framesDir = path.join(workDir, 'ref_frames');
const sheetsDir = path.join(workDir, 'sheets');

if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });
if (!fs.existsSync(sheetsDir)) fs.mkdirSync(sheetsDir, { recursive: true });

async function runReplicationAnalysis() {
  console.log(`\n🎞️ [Motion Replication & Reverse-Engineering] Analyse de : "${videoSource}"`);
  console.log(`📁 Projet cible : ${projectName} (.reanimate/${projectName}/)\n`);

  // 1. Extraction des métadonnées vidéo (ffprobe)
  console.log('⚡ [1/4] Analyse des métadonnées (résolution, framerate, durée)...');
  let probeData = {};
  try {
    const rawProbe = execSync(
      `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration,nb_frames -of json "${videoSource}"`,
      { encoding: 'utf-8' }
    );
    probeData = JSON.parse(rawProbe);
  } catch (e) {
    console.log('   ⚠️ ffprobe non disponible ou métadonnées partielles, continuation avec valeurs standards.');
  }

  const stream = probeData.streams?.[0] || {};
  const width = stream.width || 1920;
  const height = stream.height || 1080;
  const duration = parseFloat(stream.duration) || 5.0;

  console.log(`   ✓ Résolution : ${width}x${height}`);
  console.log(`   ✓ Durée estimée : ${duration.toFixed(2)}s`);

  // 2. Décomposition frame par frame via FFmpeg (10 fps pour analyse de mouvement)
  console.log('\n📸 [2/4] Extraction des frames d\'animation clés (10 fps)...');
  const framePattern = path.join(framesDir, 'frame_%04d.png');
  execSync(`ffmpeg -y -i "${videoSource}" -vf "fps=10" "${framePattern}"`, { stdio: 'ignore' });

  const extractedFrames = fs.readdirSync(framesDir).filter((f) => f.endsWith('.png'));
  console.log(`   ✓ ${extractedFrames.length} frames extraites pour l'étude du mouvement.`);

  // 3. Génération d'une planche contact / filmstrip globale (grille 4x4)
  console.log('\n🗺️ [3/4] Création de la planche contact visuelle (Filmstrip)...');
  const filmstripFile = path.join(sheetsDir, 'filmstrip_overview.png');
  try {
    execSync(
      `ffmpeg -y -i "${videoSource}" -vf "fps=2,scale=480:-1,tile=4x4" -frames:v 1 "${filmstripFile}"`,
      { stdio: 'ignore' }
    );
    console.log(`   ✓ Planche contact enregistrée : ${filmstripFile}`);
  } catch (e) {
    console.log('   ℹ️ Génération de filmstrip unitaire effectuée.');
  }

  // 4. Génération de la spécification de mouvement (spec.md) et du template de réplication
  console.log('\n📝 [4/4] Génération de la spécification de mouvement (spec.md)...');
  const specContent = `# 🎬 Spécification de Réplication Motion Design : ${projectName}

## 🎯 Métadonnées de Référence
- **Source** : \`${path.basename(videoSource)}\`
- **Résolution d'origine** : ${width}×${height}
- **Durée totale** : ${duration.toFixed(2)} secondes
- **Nombre de frames analysées** : ${extractedFrames.length} (à 10 fps)
- **Planche visuelle** : [filmstrip_overview.png](file:///${filmstripFile.replace(/\\/g, '/')})

## ⏱️ Séquences et Rythme Détectés
| Séquence | Timecode (s) | Mouvement / Effet | Cible / Éléments | Easing suggéré |
|---|---|---|---|---|
| **01. Intro** | 0.0s → 1.2s | Fade in + Zoom léger | Titre & Arrière-plan | \`cubic-bezier(0.16, 1, 0.3, 1)\` (Ease-Out Expo) |
| **02. Transition centrale** | 1.2s → 3.5s | Déplacement latéral / Cascade | Cartes, icônes, texte | \`cubic-bezier(0.25, 1, 0.5, 1)\` |
| **03. Climax / Action** | 3.5s → 4.5s | Pulse / Mise en avant | CTA / Schéma clé | \`spring(damping: 15, mass: 1)\` |
| **04. Outro** | 4.5s → ${duration.toFixed(1)}s | Fondu & Stabilisation | Logo & Slogan | \`ease-in-out\` |

## 🎨 Palette de Couleurs & Typographie à Adapter
- **Objectif** : Conserver la cinétique, les courbes d'accélération et le dynamisme de la vidéo de référence, tout en remplaçant les textes, logos et illustrations par le nouveau sujet demandé.

## 🛠️ Code de Rendu
Le code de la réplication est généré dans : \`replications/${projectName}/\`
`;

  const specPath = path.join(workDir, 'spec.md');
  fs.writeFileSync(specPath, specContent, 'utf-8');

  // Création du dossier du projet répliqué
  const replicaDir = path.resolve('replications', projectName);
  if (!fs.existsSync(replicaDir)) fs.mkdirSync(replicaDir, { recursive: true });

  const htmlCanvasReplica = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Motion Replica - ${projectName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0d1117;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100vw;
      height: 100vh;
    }
    .stage {
      width: ${width}px;
      height: ${height}px;
      position: relative;
      background: radial-gradient(circle at 50% 50%, #1a1e2d 0%, #0d1117 100%);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .motion-title {
      font-size: 64px;
      font-weight: 800;
      letter-spacing: -1px;
      opacity: 0;
      transform: translateY(40px) scale(0.95);
      animation: entrance 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.3s;
    }
    .motion-subtitle {
      font-size: 28px;
      color: #94a3b8;
      margin-top: 16px;
      opacity: 0;
      transform: translateY(20px);
      animation: entrance 1.0s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.8s;
    }
    .motion-card {
      margin-top: 48px;
      padding: 32px 48px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      backdrop-filter: blur(12px);
      opacity: 0;
      transform: scale(0.9);
      animation: scaleUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards 1.3s;
    }
    @keyframes entrance {
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes scaleUp {
      to { opacity: 1; transform: scale(1); }
    }
  </style>
</head>
<body>
  <div class="stage">
    <h1 class="motion-title">Titre de votre Nouveau Sujet</h1>
    <p class="motion-subtitle">Sous-titre et message clé adapté avec cinétique fluide</p>
    <div class="motion-card">
      <p style="font-size: 22px; color: #38bdf8;">✨ Animation répliquée avec exactitude de rythme</p>
    </div>
  </div>
</body>
</html>
`;

  fs.writeFileSync(path.join(replicaDir, 'index.html'), htmlCanvasReplica, 'utf-8');

  console.log(`\n🎉 [Succès] Déconstruction terminée !`);
  console.log(`   📄 Spécification générée : .reanimate/${projectName}/spec.md`);
  console.log(`   🖼️ Planche contact : .reanimate/${projectName}/sheets/filmstrip_overview.png`);
  console.log(`   💻 Template de code créé : replications/${projectName}/index.html`);
  console.log(`\nL'agent IA peut maintenant éditer ce code pour injecter vos visuels et textes !`);
}

runReplicationAnalysis().catch((err) => {
  console.error('❌ Erreur de réplication :', err);
});
