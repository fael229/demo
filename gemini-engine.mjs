import { convertToWav, parseRawAudioMime } from './node_modules/@argo-video/cli/dist/tts/engine.js';

export class GeminiTtsEngine {
  apiKey;
  models = ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts', 'gemini-2.5-flash-preview-tts'];
  currentModelIndex = 0;

  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.GEMINI_API_KEY || '';
    if (options.model) {
      this.models = [options.model, ...this.models.filter((m) => m !== options.model)];
    }
  }

  describe() {
    return { engine: 'gemini', model: this.models[this.currentModelIndex] };
  }

  async generate(text, options = {}) {
    if (!text?.trim()) throw new Error('TTS text must not be empty');
    const key = this.apiKey || process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY is required');

    const voice = options.voice || 'Aoede';

    while (this.currentModelIndex < this.models.length) {
      const model = this.models[this.currentModelIndex];
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

      let attempts = 4;
      let modelExhausted = false;

      while (attempts > 0) {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text }] }],
            generationConfig: {
              responseModalities: ['AUDIO'],
              speech_config: {
                voice_config: {
                  prebuilt_voice_config: {
                    voice_name: voice,
                  },
                },
              },
            },
          }),
        });

        const data = await res.json();

        if (res.status === 429 || data.error?.code === 429) {
          const msg = data.error?.message || '';
          if (msg.includes('per day')) {
            // Daily quota for this model is exhausted -> switch to next fallback model immediately!
            console.log(`\n[Quota journalier atteint pour ${model}, basculement automatique vers le modèle suivant]`);
            this.currentModelIndex++;
            modelExhausted = true;
            break;
          }
          // Per-minute rate limit: wait 22s and retry
          attempts--;
          process.stdout.write(' [Pause RPM: 22s...] ');
          await new Promise((resolve) => setTimeout(resolve, 22000));
          continue;
        }

        const candidate = data.candidates?.[0];
        const audioPart = candidate?.content?.parts?.find((p) => p.inlineData?.mimeType?.startsWith('audio/'));

        if (!audioPart) {
          throw new Error(`Gemini TTS returned no audio: ${JSON.stringify(data)}`);
        }

        const rawBuffer = Buffer.from(audioPart.inlineData.data, 'base64');
        const inputFormat = parseRawAudioMime(audioPart.inlineData.mimeType);

        // Pause to avoid burst RPM
        await new Promise((resolve) => setTimeout(resolve, 4000));

        return convertToWav(rawBuffer, options.speed ?? 1, inputFormat);
      }

      if (!modelExhausted) {
        throw new Error(`Gemini TTS: quota épuisé sur ${model}`);
      }
    }

    throw new Error('Tous les modèles Gemini TTS ont atteint leur quota journalier.');
  }
}
