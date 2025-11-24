import { test, expect } from '@playwright/test';
import { launchInsomnia } from './helpers/electron-launch';
import { locators } from './helpers/insomnia-locators';

test('Mock Server: Create → Add Route → Validate Response', async () => {
  const { app, window } = await launchInsomnia();

  await window.locator(locators.mockServerMenu).click();
  await window.locator(locators.createMockServer).click();

  await window.locator(locators.mockServerRouteButton).click();

  await window.locator(locators.routePathInput).fill("/hello");
  await window.locator(locators.routeStatusInput).fill("200");
  await window.locator(locators.routeBodyEditor).fill(`{ "message": "hello world" }`);

  // Request using mock server
  await window.locator(locators.createRequestButton).click();
  await window.locator(locators.requestNameField).fill("Mock Test");

  await window.locator(locators.urlInput).fill("http://127.0.0.1:4010/hello");
  await window.locator(locators.sendButton).click();

  await expect(window.locator(locators.responseStatus)).toContainText("200");
  await expect(window.locator(locators.responseBody)).toContainText("hello world");

  await app.close();
});
