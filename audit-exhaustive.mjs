import { Stagehand, localBrowser } from '@browserbasehq/stagehand';
import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOT_DIR = path.resolve('audit_screenshots/exhaustive');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runExhaustiveAudit() {
  console.log('🚀 [Stagehand Deep Audit] Lancement de l\'audit exhaustif complet (20 écrans)...');

  const browser = await localBrowser.launch({
    headless: true,
  });

  const stagehand = await Stagehand.create({ browser });
  const [page] = await stagehand.browser.context.pages();

  const auditReport = [];

  const capture = async (name, description) => {
    const filename = `${name}.png`;
    const filepath = path.join(SCREENSHOT_DIR, filename);
    await page.waitForTimeout(600);
    await page.screenshot({ path: filepath });
    console.log(`   📸 [${name}] ${description}`);
    auditReport.push({ name, description, file: filename });
  };

  try {
    // 1. Écran de Connexion
    console.log('\n🔑 1. Authentification & Connexion');
    await page.goto('https://djidjoho.pages.dev/connexion');
    await page.waitForLoadState('networkidle').catch(() => {});
    await capture('01_page_connexion', 'Page initiale de login');

    const bannerBtn = page.locator('button.cm-banner-btn').first();
    if (await bannerBtn.isVisible().catch(() => false)) {
      await bannerBtn.click().catch(() => {});
      await page.waitForTimeout(400);
    }
    await page.locator('input[type="email"]').fill('demo@example.com');
    await page.locator('input[type="password"]').fill('admin1234');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);

    // 2. Tableau de Bord Principal
    console.log('\n📊 2. Tableau de bord & KPIs');
    await page.goto('https://djidjoho.pages.dev/');
    await page.waitForLoadState('networkidle').catch(() => {});
    await capture('02_dashboard_principal', 'Vue d\'ensemble avec indicateurs et métriques');
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'instant' }));
    await capture('03_dashboard_widgets', 'Widgets graphiques et alertes du jour');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

    // 3. Module Patients & Fiche Détail
    console.log('\n👥 3. Module Patients');
    await page.goto('https://djidjoho.pages.dev/patients');
    await page.waitForLoadState('networkidle').catch(() => {});
    await capture('04_patients_liste', 'Registre complet des patients admis et archivés');

    // Clic sur le premier patient
    try {
      const openBtn = page.locator('table tbody tr button').first();
      if (await openBtn.isVisible().catch(() => false)) {
        await openBtn.click().catch(() => {});
        await page.waitForTimeout(800);
        await capture('05_patient_dossier_detail', 'Dossier médical patient détaillé');
      }
    } catch (e) {}

    // 4. Rendez-vous
    console.log('\n📅 4. Rendez-vous & Planning');
    await page.goto('https://djidjoho.pages.dev/rendez-vous');
    await page.waitForLoadState('networkidle').catch(() => {});
    await capture('06_rendez_vous_planning', 'Planning des consultations et réservations');

    // 5. Urgences & Triage
    console.log('\n🚨 5. Urgences & Triage');
    await page.goto('https://djidjoho.pages.dev/urgences');
    await page.waitForLoadState('networkidle').catch(() => {});
    await capture('07_urgences_triage', 'File active de triage et évaluation des constantes');

    // 6. Consultations Médicales
    console.log('\n🩺 6. Consultations');
    await page.goto('https://djidjoho.pages.dev/consultations');
    await page.waitForLoadState('networkidle').catch(() => {});
    await capture('08_consultations_suivi', 'Journal des actes de consultation et diagnostics');

    // 7. Prescriptions
    console.log('\n📝 7. Prescriptions');
    await page.goto('https://djidjoho.pages.dev/prescriptions');
    await page.waitForLoadState('networkidle').catch(() => {});
    await capture('09_prescriptions_ordonnances', 'Gestion des ordonnances et posologies');

    // 8. Examens & Biologie
    console.log('\n🔬 8. Examens & Laboratoire');
    await page.goto('https://djidjoho.pages.dev/examens');
    await page.waitForLoadState('networkidle').catch(() => {});
    await capture('10_examens_laboratoire', 'Analyses biologiques et imagerie médicale');

    // 9. Soins Infirmiers
    console.log('\n💉 9. Soins Infirmiers');
    await page.goto('https://djidjoho.pages.dev/soins-infirmiers');
    await page.waitForLoadState('networkidle').catch(() => {});
    await capture('11_soins_infirmiers', 'Planification des actes et administration des soins');

    // 10. Admissions & Lits
    console.log('\n🛏️ 10. Hospitalisation & Lits');
    await page.goto('https://djidjoho.pages.dev/admissions');
    await page.waitForLoadState('networkidle').catch(() => {});
    await capture('12_hospitalisation_lits', 'Carte des lits, chambres et taux d\'occupation');

    // 11. Pharmacie & FEFO
    console.log('\n💊 11. Pharmacie & FEFO');
    await page.goto('https://djidjoho.pages.dev/stock');
    await page.waitForLoadState('networkidle').catch(() => {});
    await capture('13_pharmacie_stock_fefo', 'Inventaire des médicaments et alertes de péremption');

    // 12. Facturation & Encaissements
    console.log('\n💳 12. Facturation & Caisse');
    await page.goto('https://djidjoho.pages.dev/facturation');
    await page.waitForLoadState('networkidle').catch(() => {});
    await capture('14_facturation_encaissements', 'Grand livre des factures, devis et encaissements');

    // 13. Personnel Médical & RH
    console.log('\n👨‍⚕️ 13. Personnel & Équipes');
    await page.goto('https://djidjoho.pages.dev/personnel');
    await page.waitForLoadState('networkidle').catch(() => {});
    await capture('15_personnel_medical', 'Répertoire des médecins, soignants et administratifs');

    // 14. Gardes & Shifts
    console.log('\n⏰ 14. Planning des Shifts');
    await page.goto('https://djidjoho.pages.dev/shifts');
    await page.waitForLoadState('networkidle').catch(() => {});
    await capture('16_gardes_et_shifts', 'Grille de roulement et rotations de garde');

    // 15. Audit Responsive Mobile (390x844)
    console.log('\n📱 15. Audit Responsive Mobile (iPhone 14 / Viewport 390x844)');
    await page.setViewportSize(390, 844);
    
    await page.goto('https://djidjoho.pages.dev/');
    await page.waitForLoadState('networkidle').catch(() => {});
    await capture('17_mobile_dashboard', 'Rendu mobile responsive du tableau de bord');

    await page.goto('https://djidjoho.pages.dev/patients');
    await page.waitForLoadState('networkidle').catch(() => {});
    await capture('18_mobile_patients', 'Rendu mobile du registre patient');

    await page.goto('https://djidjoho.pages.dev/urgences');
    await page.waitForLoadState('networkidle').catch(() => {});
    await capture('19_mobile_urgences', 'Rendu mobile de l\'interface d\'urgence');

    await page.goto('https://djidjoho.pages.dev/stock');
    await page.waitForLoadState('networkidle').catch(() => {});
    await capture('20_mobile_pharmacie', 'Rendu mobile de la pharmacie et stock FEFO');

    console.log(`\n🎉 [Succès] Audit exhaustif terminé : ${auditReport.length} captures haute fidélité enregistrées !`);

  } catch (err) {
    console.error('❌ Erreur durant l\'audit exhaustif :', err);
  } finally {
    await stagehand.close();
  }
}

runExhaustiveAudit();
