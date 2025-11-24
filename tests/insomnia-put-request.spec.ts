import { test, expect } from '@playwright/test';
import { launchInsomnia } from './helpers/electron-launch';
import { locators } from './helpers/insomnia-locators';

test('PUT Request: Update existing resource', async () => {
  const { app, window } = await launchInsomnia();

  await window.locator(locators.createRequestButton).click();
  await window.locator(locators.requestNameField).fill("PUT Update Resource");

  await window.locator(locators.methodDropdown).click();
  await window.getByRole('option', { name: 'PUT' }).click();

  await window.locator(locators.urlInput).fill("https://jsonplaceholder.typicode.com/posts/1");

  await window.locator(locators.bodyTab).click();
  await window.locator(locators.jsonEditor).fill(`{
    "id": 1,
    "title": "updated",
    "body": "updated body",
    "userId": 1
  }`);

  await window.locator(locators.sendButton).click();

  await expect(window.locator(locators.responseStatus)).toContainText("200");
  await expect(window.locator(locators.responseBody)).toContainText('"updated"');

  await app.close();
});
