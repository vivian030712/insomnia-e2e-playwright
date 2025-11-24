import { test } from '@playwright/test';
import { launchInsomnia } from './helpers/electron-launch';
import { locators } from './helpers/insomnia-locators';
import { testData } from './helpers/test-data';
import { validateResponse } from './helpers/state-assertions';

test.describe('Insomnia Main Workflow - Create / Send / Validate Request', () => {

  test('E2E: Create → Send → Validate HTTP Request', async () => {

    // Launch Insomnia
    const { app, window } = await launchInsomnia();

    // --- STATE TRANSITION: New Workspace → New Request ---
    await window.locator(locators.createRequestButton).click();

    await window.locator(locators.requestNameField).fill("Playwright Auto Test API Request");

    // Select method
    await window.locator(locators.methodDropdown).click();
    await window.getByRole('option', { name: 'GET' }).click();

    // URL input — includes Boundary Value + Equivalence Class
    await window.locator(locators.urlInput).fill(testData.apiUrl);

    // SEND request
    await window.locator(locators.sendButton).click();

    // --- SYSTEM BEHAVIOR VALIDATION ---
    await validateResponse(window);

    // EXIT Insomnia
    await app.close();
  });
});
