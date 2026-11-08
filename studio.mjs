#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_FILE = path.join(__dirname, 'studio.config.json');

const args = process.argv.slice(2);
const command = args[0];

function loadConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    } catch (e) {}
  }
  return { activeProject: 'default', projects: {} };
}

function saveConfig(cfg) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), 'utf-8');
}

function run(cmd, cmdArgs, envExtra = {}) {
  const safeArgs = cmdArgs.map((a) => (typeof a === 'string' && a.includes(' ') && !a.startsWith('"') ? `"${a}"` : a));
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, safeArgs, {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, ...envExtra },
    });
    p.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Process exited with code ${code}`));
    });
  });
}

function showHelp() {
  const config = loadConfig();
  console.log(`
🎬 STUDIO MULTI-PROJETS : VIDÉO, IA & NAVIGATION AUTONOME
─────────────────────────────────────────────────────────────
Projet actif actuel : [ ${config.activeProject || 'aucun'} ]

USAGE :
  node studio.mjs <commande> [arguments]

COMMANDES MULTI-PROJETS :
  projects                  Liste tous les projets configurés dans le Studio.
  use <nom>                 Définit le projet actif.
  new <nom> <url> [titre]   Initialise un nouveau projet complet (script Playwright,
                            narration Gemini TTS et profil de configuration).

GÉNÉRATION DE VIDÉO-DÉMO (ARGO + GEMINI TTS) :
  demo [nom]                Génère la vidéo du projet avec voix off IA en français,
                            suivie d'un audit de conformité vidéo automatique.
  preview                   Ouvre l'interface de prévisualisation interactive Argo.

TRAILERS & SPOTS PUBLICITAIRES PRODUIT (HUASHU-MOTION) :
  trailer <url|nom> [tmpl]  Génère un spot publicitaire / trailer de lancement (30s)
                            style Apple Keynote / 3D UI avec musique algorithmique.
  motion <commande> [...]   Accès direct au moteur Huashu-Motion (studio, render, grab).

EXPLORATION & AUDIT AUTONOME (STAGEHAND / AGENT) :
  audit <url|nom> [pages]   Parcourt n'importe quel site web de manière 100% autonome,
                            découvre ses pages et capture des captures HD + mobile.
  pilot                     Exécute l'audit approfondi du projet hospitalier Djidjoho.

SOUND DESIGN & EFFETS SONORES (EARSHOT) :
  sfx list                  Liste les 252 bruitages de la bibliothèque procédurale.
  sfx render <id> -o <f>    Génère un effet sonore WAV personnalisé (clics, transitions).

ANALYSE QUALITÉ AUDIO/VIDÉO (VIDEO-DIRECTOR) :
  qa <fichier.mp4>          Audit audio/vidéo (Loudness LUFS, freezes, lisibilité mobile).

ANIMATIONS VECTORIELLES & SCHÉMAS (EXPLAINROO) :
  explainer init <nom>      Crée un projet de motion design explicatif.
  explainer render          Exporte le projet animé Canvas en MP4.

RÉTRO-INGÉNIERIE & RÉPLICATION D'ANIMATION (REANIMATE + FFMPEG) :
  replicate <video> <nom>   Déconstruit une vidéo fournie (frame par frame, courbes de
                            vitesse, timing) et prépare sa réplication sur un nouveau sujet.
  clone <video.mp4>         Décompose une vidéo frame par frame pour reproduction.
─────────────────────────────────────────────────────────────
`);
}

async function main() {
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    return;
  }

  const subArgs = args.slice(1);
  const config = loadConfig();

  switch (command) {
    case 'projects': {
      console.log('\n📁 Projets enregistrés dans le Studio :');
      for (const [key, proj] of Object.entries(config.projects || {})) {
        const isActive = key === config.activeProject ? ' ⭐ (ACTIF)' : '';
        console.log(`  • ${key}${isActive} : ${proj.name || key} -> ${proj.url}`);
      }
      console.log('');
      break;
    }

    case 'use': {
      const targetProject = subArgs[0];
      if (!targetProject || !config.projects?.[targetProject]) {
        console.error(`❌ Projet "${targetProject}" introuvable. Utilisez "node studio.mjs projects" pour voir la liste.`);
        process.exit(1);
      }
      config.activeProject = targetProject;
      saveConfig(config);
      console.log(`✅ Projet actif changé vers : "${targetProject}" (${config.projects[targetProject].url})`);
      break;
    }

    case 'new': {
      const projectName = subArgs[0];
      const projectUrl = subArgs[1];
      const title = subArgs[2] || projectName;

      if (!projectName || !projectUrl) {
        console.error('Usage : node studio.mjs new <nom-du-projet> <https://url-du-site.com> [Titre]');
        process.exit(1);
      }

      console.log(`\n✨ Création du nouveau projet de démo : "${projectName}" (${projectUrl})...`);

      // 1. Ajouter à studio.config.json
      if (!config.projects) config.projects = {};
      config.projects[projectName] = {
        name: title,
        url: projectUrl,
        demo: projectName,
        voice: 'Aoede',
      };
      config.activeProject = projectName;
      saveConfig(config);

      // 2. Créer demos/<name>.scenes.json
      const scenesFile = path.join(__dirname, 'demos', `${projectName}.scenes.json`);
      const defaultScenes = {
        scenes: [
          {
            id: 'intro',
            title: `Introduction - ${title}`,
            text: `Bienvenue sur la présentation de ${title}. Découvrons ensemble les fonctionnalités majeures de cette plateforme.`,
          },
          {
            id: 'navigation',
            title: 'Navigation & Vue Principale',
            text: `L'interface offre une prise en main intuitive avec un accès rapide aux différents services et outils.`,
          },
          {
            id: 'conclusion',
            title: 'Conclusion',
            text: `Merci de votre attention. Cette solution apporte fluidité et efficacité à l'ensemble des utilisateurs.`,
          },
        ],
      };
      fs.writeFileSync(scenesFile, JSON.stringify(defaultScenes, null, 2), 'utf-8');

      // 3. Créer demos/<name>.demo.ts
      const demoScriptFile = path.join(__dirname, 'demos', `${projectName}.demo.ts`);
      const defaultDemoScript = `import { test, withOverlay } from '@argo-video/cli';

test('${projectName}', async ({ page, narration }) => {
  test.setTimeout(180000);

  // 1. Scène : Introduction
  await page.goto('/');
  await page.waitForLoadState('networkidle').catch(() => {});
  await narration.startRecording(page);

  narration.mark('intro');
  await withOverlay(page, 'intro', async () => {
    await page.waitForTimeout(1000);
    await page.waitForTimeout(narration.durationFor('intro'));
  });

  // 2. Scène : Navigation
  narration.mark('navigation');
  await withOverlay(page, 'navigation', async () => {
    await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(narration.durationFor('navigation'));
  });

  // 3. Scène : Conclusion
  narration.mark('conclusion');
  await withOverlay(page, 'conclusion', async () => {
    await page.waitForTimeout(1000);
    await page.waitForTimeout(narration.durationFor('conclusion'));
  });
});
`;
      fs.writeFileSync(demoScriptFile, defaultDemoScript, 'utf-8');

      console.log(`   ✓ Configuration enregistrée dans studio.config.json`);
      console.log(`   ✓ Script de démo créé : demos/${projectName}.demo.ts`);
      console.log(`   ✓ Scénario vocal créé : demos/${projectName}.scenes.json`);
      console.log(`\n🎉 Projet prêt ! Vous pouvez lancer :`);
      console.log(`   node studio.mjs demo ${projectName}`);
      break;
    }

    case 'demo': {
      const demoName = subArgs[0] || config.activeProject || 'djidjoho';
      const proj = config.projects?.[demoName];
      const targetUrl = proj?.url || process.env.BASE_URL || 'https://djidjoho.pages.dev';

      console.log(`\n🚀 [1/2] Lancement du pipeline Argo pour : "${demoName}"...`);
      console.log(`   🌐 URL cible : ${targetUrl}`);

      await run('npx', ['argo', 'pipeline', demoName, '--browser', 'chromium'], {
        BASE_URL: targetUrl,
        TARGET_URL: targetUrl,
      });

      const videoFile = `videos/${demoName}.mp4`;
      if (fs.existsSync(videoFile)) {
        console.log(`\n🔍 [2/2] Audit Qualité automatique avec Video-Director...`);
        const qaDir = `qa_${demoName}`;
        await run('python', [
          'tools/video-director/video-director/scripts/qa_video.py',
          `"${videoFile}"`,
          '--out',
          `"${qaDir}"`,
        ]).catch(() => {
          console.log(`ℹ️ Rapport QA complet généré dans le dossier : ${qaDir}/`);
        });
      }
      break;
    }

    case 'preview': {
      await run('npx', ['argo', 'preview', ...subArgs]);
      break;
    }

    case 'trailer': {
      const target = subArgs[0] || config.activeProject || 'mon-produit';
      const template = subArgs[1] || 'keynote-ui';
      const omBin = path.join(__dirname, 'tools', 'huashu-motion', 'cli', 'om.js');
      const trailerDir = path.resolve('trailers', target);

      console.log(`\n🎬 Lancement de Huashu-Motion pour le trailer : "${target}" (template: ${template})...`);
      if (!fs.existsSync(trailerDir)) {
        console.log(`📦 Création du projet de trailer dans trailers/${target}...`);
        await run('node', [omBin, 'new', `"${trailerDir}"`, '--template', template]);
      }
      console.log(`\n✨ Projet prêt dans : ${trailerDir}`);
      console.log(`Pour lancer l'éditeur interactif : node studio.mjs motion studio "${trailerDir}"`);
      console.log(`Pour compiler en MP4 : node studio.mjs motion render "${trailerDir}"\n`);
      break;
    }

    case 'motion': {
      const omBin = path.join(__dirname, 'tools', 'huashu-motion', 'cli', 'om.js');
      await run('node', [omBin, ...subArgs]);
      break;
    }

    case 'explore':
    case 'audit': {
      const target = subArgs[0] || config.activeProject || 'djidjoho';
      const maxPages = subArgs[1] || '12';
      console.log(`\n🌐 Lancement du crawler universel autonome pour : "${target}"...`);
      await run('node', ['universal-crawler.mjs', target, maxPages]);
      break;
    }

    case 'pilot': {
      console.log('\n🚀 Lancement de l\'audit exhaustif Stagehand...');
      await run('node', ['audit-exhaustive.mjs', ...subArgs]);
      break;
    }

    case 'agent': {
      console.log('\n🤖 Lancement du pilotage Stagehand direct...');
      await run('node', ['stagehand-driver.mjs', ...subArgs]);
      break;
    }

    case 'sfx': {
      const earshotEnv = { PYTHONPATH: path.join(__dirname, 'tools', 'earshot') };
      await run('python', ['-m', 'earshot', 'sfx', ...subArgs], earshotEnv);
      break;
    }

    case 'qa': {
      const targetVideo = subArgs[0];
      if (!targetVideo) {
        console.error('Erreur : Veuillez spécifier le fichier vidéo à analyser (ex: node studio.mjs qa videos/djidjoho.mp4)');
        process.exit(1);
      }
      const outDir = subArgs[1] || 'qa_report';
      await run('python', [
        'tools/video-director/video-director/scripts/qa_video.py',
        `"${targetVideo}"`,
        '--out',
        `"${outDir}"`,
      ]).catch(() => {
        console.log(`ℹ️ Rapport QA disponible dans : ${outDir}/`);
      });
      break;
    }

    case 'explainer': {
      const explainrooBin = path.join(__dirname, 'tools', 'explainroo', 'bin', 'explainroo.js');
      await run('node', [explainrooBin, ...subArgs]);
      break;
    }

    case 'replicate': {
      const videoSrc = subArgs[0];
      const replicaName = subArgs[1] || 'mon_animation';
      if (!videoSrc) {
        console.error('Erreur: Veuillez spécifier le fichier vidéo de référence (ex: node studio.mjs replicate video.mp4 nouveau_projet)');
        process.exit(1);
      }
      await run('node', ['replicate-engine.mjs', videoSrc, replicaName]);
      break;
    }

    case 'clone':
    case 'reanimate': {
      const reanimateScripts = path.join(__dirname, 'tools', 'reanimate', 'skills', 'reanimate', 'scripts');
      console.log(`ℹ️ Module Reanimate actif dans : ${reanimateScripts}`);
      console.log(`Utilisez 'node ${path.join(reanimateScripts, 'capture.ts')}' ou 'frames.ts' pour décomposer une animation.`);
      break;
    }

    default:
      console.log(`Commande inconnue : "${command}"`);
      showHelp();
      break;
  }
}

main().catch((err) => {
  console.error('\n❌ Erreur dans Studio :', err.message);
  process.exit(1);
});
