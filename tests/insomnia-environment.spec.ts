import { test, expect } from '@playwright/test';
import { launchInsomnia } from './helpers/electron-launch';
import { locators } from './helpers/insomnia-locators';

test('Environment variable resolution test', async () => {
  const { app, window } = await launchInsomnia();

  // Create environment
  await window.locator(locators.envButton).click();
  await window.locator(locators.createEnvButton).click();

  await window.locator(locators.envNameInput).fill("QA Env");
  await window.locator(locators.envEditor).fill(`{
    "baseUrl": "https://jsonplaceholder.typicode.com"
  }`);

  // Create request
  await window.locator(locators.createRequestButton).click();
  await window.locator(locators.requestNameField).fill("Env GET");

  await window.locator(locators.urlInput).fill("{{ baseUrl }}/posts/1");
  await window.locator(locators.sendButton).click();

  await expect(window.locator(locators.responseStatus)).toContainText("200");

  await app.close();
});
