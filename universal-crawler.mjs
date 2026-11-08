import { Stagehand, localBrowser } from '@browserbasehq/stagehand';
import fs from 'node:fs';
import path from 'node:path';
import { URL } from 'node:url';

// Récupération des arguments : node universal-crawler.mjs <url-or-project-name> [max-pages]
const targetArg = process.argv[2] || 'djidjoho';
const maxPages = parseInt(process.argv[3], 10) || 12;

function getProjectInfo(target) {
  try {
    const configPath = path.resolve('studio.config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (config.projects?.[target]) {
        return {
          name: target,
          url: config.projects[target].url,
          credentials: config.projects[target].credentials,
        };
      }
    }
  } catch (e) {}

  // Si c'est une URL directe
  if (target.startsWith('http://') || target.startsWith('https://')) {
    const parsed = new URL(target);
    const domainName = parsed.hostname.replace(/[^a-zA-Z0-9]/g, '_');
    return {
      name: domainName,
      url: target,
      credentials: null,
    };
  }

  return {
    name: target,
    url: 'https://' + target,
    credentials: null,
  };
}

const project = getProjectInfo(targetArg);
const outputDir = path.resolve('audit_screenshots', project.name);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function runUniversalCrawl() {
  console.log(`\n🌐 [Universal Web Explorer] Cible : ${project.name} (${project.url})`);
  console.log(`📁 Dossier de sortie : ${outputDir}\n`);

  const browser = await localBrowser.launch({ headless: true });
  const stagehand = await Stagehand.create({ browser });
  const [page] = await stagehand.browser.context.pages();

  const visitedUrls = new Set();
  const queue = [project.url];
  let capturedCount = 0;

  const targetOrigin = new URL(project.url).origin;

  try {
    console.log(`⚡ Chargement de la page d'accueil...`);
    await page.goto(project.url);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1000);

    // Gérer l'authentification si des identifiants sont fournis dans la config
    if (project.credentials?.email && project.credentials?.password) {
      console.log(`🔐 Authentification automatique configurée...`);
      const emailField = page.locator('input[type="email"], input[name="email"], input[name="username"]').first();
      const passField = page.locator('input[type="password"]').first();
      const submitBtn = page.locator('button[type="submit"], input[type="submit"]').first();

      // Si bouton de bannière ou pop-in login
      const bannerBtn = page.locator('button.cm-banner-btn, button:has-text("CONNEXION"), a[href*="connexion"]').first();
      if (await bannerBtn.isVisible().catch(() => false)) {
        await bannerBtn.click().catch(() => {});
        await page.waitForTimeout(500);
      }

      if (await emailField.isVisible().catch(() => false) && await passField.isVisible().catch(() => false)) {
        await emailField.fill(project.credentials.email);
        await passField.fill(project.credentials.password);
        if (await submitBtn.isVisible().catch(() => false)) {
          await submitBtn.click().catch(() => {});
          await page.waitForTimeout(2000);
        }
      }
    }

    // Capture initiale de la page principale
    capturedCount++;
    const homeFile = path.join(outputDir, `01_accueil_desktop.png`);
    await page.screenshot({ path: homeFile });
    console.log(`📸 [01] Accueil Desktop capturé : ${homeFile}`);

    visitedUrls.add(page.url());

    // Découverte autonome des liens internes
    console.log(`🔍 Exploration et cartographie des pages du site...`);
    const links = await page.evaluate((origin) => {
      const anchors = Array.from(document.querySelectorAll('a[href]'));
      const found = [];
      for (const a of anchors) {
        try {
          const href = a.href;
          const u = new URL(href, document.baseURI);
          if (u.origin === origin && !u.pathname.match(/\.(png|jpg|jpeg|svg|css|js|pdf)$/i) && !u.hash) {
            found.push(u.href);
          }
        } catch (e) {}
      }
      return [...new Set(found)];
    }, targetOrigin);

    console.log(`   ✓ ${links.length} liens internes découverts.`);
    for (const link of links) {
      if (!visitedUrls.has(link) && queue.length < maxPages) {
        queue.push(link);
      }
    }

    // Exploration séquentielle
    while (queue.length > 0 && capturedCount < maxPages) {
      const nextUrl = queue.shift();
      if (visitedUrls.has(nextUrl)) continue;
      visitedUrls.add(nextUrl);

      capturedCount++;
      const urlObj = new URL(nextUrl);
      const cleanSlug = (urlObj.pathname.replace(/^\/|\/$/g, '').replace(/[\/\?#=]/g, '_') || 'home');
      const filename = `${String(capturedCount).padStart(2, '0')}_${cleanSlug}.png`;
      const filePath = path.join(outputDir, filename);

      console.log(`🌐 [${capturedCount}/${maxPages}] Navigation vers : ${urlObj.pathname || '/'}`);
      try {
        await page.goto(nextUrl);
        await page.waitForLoadState('networkidle').catch(() => {});
        await page.waitForTimeout(600);
        await page.screenshot({ path: filePath });
        console.log(`   📸 Enregistré : ${filename}`);
      } catch (err) {
        console.log(`   ⚠️ Erreur d'accès à ${nextUrl} :`, err.message);
      }
    }

    // Audit Mobile Responsive
    console.log(`\n📱 Audit Responsive Mobile (iPhone 14 / Viewport 390x844)...`);
    await page.setViewportSize(390, 844);
    await page.goto(project.url);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(600);
    const mobileHomeFile = path.join(outputDir, `mobile_accueil.png`);
    await page.screenshot({ path: mobileHomeFile });
    console.log(`   📸 [Mobile] Accueil responsive capturé : ${mobileHomeFile}`);

    console.log(`\n✨ [Succès] Exploration terminée : ${capturedCount + 1} captures sauvegardées dans ${outputDir}/`);

  } catch (err) {
    console.error('❌ Erreur durant l\'exploration :', err);
  } finally {
    await stagehand.close();
  }
}

runUniversalCrawl();

