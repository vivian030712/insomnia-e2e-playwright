import { test, expect } from '@playwright/test';
import { launchInsomnia } from './helpers/electron-launch';
import { locators } from './helpers/insomnia-locators';

test('POST Request: Create new resource', async () => {
  const { app, window } = await launchInsomnia();

  await window.locator(locators.createRequestButton).click();
  await window.locator(locators.requestNameField).fill("POST Create User");

  await window.locator(locators.methodDropdown).click();
  await window.getByRole('option', { name: 'POST' }).click();

  await window.locator(locators.urlInput).fill("https://jsonplaceholder.typicode.com/posts");

  // Body
  await window.locator(locators.bodyTab).click();
  await window.locator(locators.jsonEditor).fill(`{
    "title": "foo",
    "body": "bar",
    "userId": 1
  }`);

  await window.locator(locators.sendButton).click();

  await expect(window.locator(locators.responseStatus)).toContainText("201");
  await expect(window.locator(locators.responseBody)).toContainText('"id":');

  await app.close();
});
