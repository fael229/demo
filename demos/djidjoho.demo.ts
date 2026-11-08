import { test } from '@argo-video/cli';
import { withOverlay } from '@argo-video/cli';

test('djidjoho', async ({ page, narration }) => {
  test.setTimeout(300000);

  // 1. Scene : Connexion
  await page.goto('/connexion');
  await page.waitForLoadState('networkidle');

  // Démarrage de l'enregistrement vidéo
  await narration.startRecording(page);

  narration.mark('connexion');
  await withOverlay(page, 'connexion', async () => {
    // Clic sur "SE CONNECTER"
    const loginBannerBtn = page.getByText('SE CONNECTER').first();
    await loginBannerBtn.click();
    await page.waitForTimeout(600);

    // Saisie des identifiants
    const emailField = page.locator('input[type="email"]');
    const passField = page.locator('input[type="password"]');

    await emailField.pressSequentially('demo@example.com', { delay: 45 });
    await page.waitForTimeout(300);
    await passField.pressSequentially('admin1234', { delay: 45 });
    await page.waitForTimeout(400);

    // Soumission du formulaire
    await passField.press('Enter');
    await page.waitForURL('**/', { timeout: 12000 }).catch(() => {});
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(narration.durationFor('connexion'));
  });

  // 2. Scene : Tableau de Bord
  narration.mark('dashboard');
  await withOverlay(page, 'dashboard', async () => {
    await page.waitForTimeout(1000);
    // Défilement doux sur les widgets et statistiques
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(narration.durationFor('dashboard'));
  });

  // 3. Scene : Patients
  narration.mark('patients');
  await withOverlay(page, 'patients', async () => {
    await page.click('a[href="/patients"]');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollBy({ top: 250, behavior: 'smooth' }));
    await page.waitForTimeout(narration.durationFor('patients'));
  });

  // 4. Scene : Rendez-vous
  narration.mark('rendez_vous');
  await withOverlay(page, 'rendez_vous', async () => {
    await page.click('a[href="/rendez-vous"]');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1200);
    await page.waitForTimeout(narration.durationFor('rendez_vous'));
  });

  // 5. Scene : Urgences & Triage
  narration.mark('urgences');
  await withOverlay(page, 'urgences', async () => {
    await page.click('a[href="/urgences"]');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1200);
    await page.waitForTimeout(narration.durationFor('urgences'));
  });

  // 6. Scene : Consultations Médicales
  narration.mark('consultations');
  await withOverlay(page, 'consultations', async () => {
    await page.click('a[href="/consultations"]');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1200);
    await page.waitForTimeout(narration.durationFor('consultations'));
  });

  // 7. Scene : Prescriptions
  narration.mark('prescriptions');
  await withOverlay(page, 'prescriptions', async () => {
    await page.click('a[href="/prescriptions"]');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1200);
    await page.waitForTimeout(narration.durationFor('prescriptions'));
  });

  // 8. Scene : Analyses & Imagerie Médicale
  narration.mark('examens');
  await withOverlay(page, 'examens', async () => {
    await page.click('a[href="/examens"]');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1200);
    await page.waitForTimeout(narration.durationFor('examens'));
  });

  // 9. Scene : Soins & Actes Infirmiers
  narration.mark('soins');
  await withOverlay(page, 'soins', async () => {
    await page.click('a[href="/soins-infirmiers"]');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1200);
    await page.waitForTimeout(narration.durationFor('soins'));
  });

  // 10. Scene : Hospitalisation & Gestion des Lits
  narration.mark('admissions');
  await withOverlay(page, 'admissions', async () => {
    await page.click('a[href="/admissions"]');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1200);
    await page.waitForTimeout(narration.durationFor('admissions'));
  });

  // 11. Scene : Pharmacie & Stocks FEFO
  narration.mark('stock');
  await withOverlay(page, 'stock', async () => {
    await page.click('a[href="/stock"]');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1200);
    await page.waitForTimeout(narration.durationFor('stock'));
  });

  // 12. Scene : Facturation & Paiements
  narration.mark('facturation');
  await withOverlay(page, 'facturation', async () => {
    await page.click('a[href="/facturation"]');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1200);
    await page.waitForTimeout(narration.durationFor('facturation'));
  });

  // 13. Scene : Personnel & Shifts
  narration.mark('personnel');
  await withOverlay(page, 'personnel', async () => {
    await page.click('a[href="/personnel"]');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1200);
    await page.click('a[href="/shifts"]');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(narration.durationFor('personnel'));
  });

  // 14. Scene : Conclusion & Synthèse
  narration.mark('conclusion');
  await withOverlay(page, 'conclusion', async () => {
    await page.click('a[href="/"]');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);
    await page.waitForTimeout(narration.durationFor('conclusion'));
  });
});

