import { test, expect } from '@playwright/test';
import { launchInsomnia } from './helpers/electron-launch';
import { locators } from './helpers/insomnia-locators';

test('DELETE Request: Delete resource', async () => {
  const { app, window } = await launchInsomnia();

  await window.locator(locators.createRequestButton).click();
  await window.locator(locators.requestNameField).fill("DELETE Resource");

  await window.locator(locators.methodDropdown).click();
  await window.getByRole('option', { name: 'DELETE' }).click();

  await window.locator(locators.urlInput).fill("https://jsonplaceholder.typicode.com/posts/1");

  await window.locator(locators.sendButton).click();

  await expect(window.locator(locators.responseStatus)).toContainText("200");

  await app.close();
});
