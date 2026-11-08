import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from '@argo-video/cli';
import { GeminiTtsEngine } from './gemini-engine.mjs';

// Résolution dynamique de l'URL cible selon le projet en cours
function resolveBaseURL() {
  if (process.env.TARGET_URL) return process.env.TARGET_URL;
  if (process.env.BASE_URL) return process.env.BASE_URL;

  try {
    const configPath = path.resolve('studio.config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      const active = config.activeProject || 'default';
      if (config.projects?.[active]?.url) {
        return config.projects[active].url;
      }
    }
  } catch (e) {}

  return 'http://localhost:3000';
}

const baseURL = resolveBaseURL();

export default defineConfig({
  baseURL,
  demosDir: 'demos',
  outputDir: 'videos',
  tts: {
    engine: new GeminiTtsEngine(),
    defaultVoice: process.env.TTS_VOICE || 'Aoede',
    defaultSpeed: 1.0,
  },
  video: {
    width: 1920,
    height: 1080,
    fps: 30,
    browser: 'chromium',
  },
  export: {
    preset: 'slow',
    crf: 16,
  },
  overlays: {
    autoBackground: true,
  },
});
