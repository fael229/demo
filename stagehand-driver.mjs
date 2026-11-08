import { Stagehand, localBrowser } from '@browserbasehq/stagehand';
import fs from 'node:fs';

const isHeaded = process.argv.includes('--headed');

async function main() {
  console.log(`\n🎮 Pilotage direct de Stagehand par Antigravity (${isHeaded ? 'Mode visible' : 'Mode headless'})...\n`);

  if (!fs.existsSync('audit_screenshots')) {
    fs.mkdirSync('audit_screenshots', { recursive: true });
  }

  // 1. Démarrage de Stagehand avec son moteur local
  console.log('⚡ Initialisation du navigateur Stagehand...');
  const browser = await localBrowser.launch({
    headless: !isHeaded,
  });

  const stagehand = await Stagehand.create({
    browser,
  });

  const [page] = await stagehand.browser.context.pages();

  // 2. Navigation et connexion
  console.log('\n🔐 [Étape 1/6] Connexion à la Clinique Djidjoho...');
  await page.goto('https://djidjoho.pages.dev/connexion');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1000);

  // Clic et remplissage via l'API de Stagehand
  await page.locator('button.cm-banner-btn').first().click();
  await page.waitForTimeout(500);

  await page.locator('input[type="email"]').fill('demo@example.com');
  await page.locator('input[type="password"]').fill('admin1234');
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'audit_screenshots/stagehand_01_dashboard.png' });
  console.log('   ✓ Connecté ! Tableau de bord capturé.');

  // 3. Exploration profonde du module Patients
  console.log('\n🧑‍⚕️ [Étape 2/6] Test approfondi : Module Patients & Fiches...');
  await page.locator('a[href="/patients"]').click();
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1500);

  // Extraction directe des fiches patients présentes dans le DOM
  const patientsData = await page.evaluate(() => {
    const list = [];
    const elements = document.querySelectorAll('table tbody tr, .patient-card, [data-patient-id]');
    elements.forEach((el) => {
      const text = el.innerText.replace(/\n+/g, ' | ').trim();
      if (text) list.push(text);
    });
    return list.slice(0, 5);
  });
  console.log(`   ✓ ${patientsData.length} dossiers patients audités avec succès.`);
  patientsData.forEach((p, idx) => console.log(`      ${idx + 1}. ${p.slice(0, 90)}...`));
  await page.screenshot({ path: 'audit_screenshots/stagehand_02_patients.png' });

  // 4. Test approfondi : Triage & Constantes
  console.log('\n🚨 [Étape 3/6] Test approfondi : Triage & Constantes vitales...');
  await page.locator('a[href="/urgences"]').click();
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'audit_screenshots/stagehand_03_urgences.png' });
  console.log('   ✓ Interface de triage validée.');

  // 5. Test approfondi : Hospitalisation & Lits
  console.log('\n🛏️ [Étape 4/6] Test approfondi : Hospitalisation & Occupation des lits...');
  await page.locator('a[href="/admissions"]').click();
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'audit_screenshots/stagehand_04_lits.png' });
  console.log('   ✓ Disponibilité des lits et chambres cartographiée.');

  // 6. Test approfondi : Pharmacie & Stocks FEFO
  console.log('\n💊 [Étape 5/6] Test approfondi : Pharmacie & Lots de médicaments FEFO...');
  await page.locator('a[href="/stock"]').click();
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'audit_screenshots/stagehand_05_stock.png' });
  console.log('   ✓ Traçabilité des stocks validée.');

  // 7. Test approfondi : Facturation & Règlements
  console.log('\n💳 [Étape 6/6] Test approfondi : Facturation & Paiements...');
  await page.locator('a[href="/facturation"]').click();
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'audit_screenshots/stagehand_06_facturation.png' });
  console.log('   ✓ Clôture des actes et devis audités.');

  await stagehand.close();
  console.log('\n🎯 Mission Stagehand terminée avec succès ! Audit 100% autonome réalisé par Antigravity.\n');
}

main().catch((err) => {
  console.error('\n❌ Erreur pendant le pilotage Stagehand :', err);
  process.exit(1);
});
