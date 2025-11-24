import { expect, Page } from '@playwright/test';
import { locators } from './insomnia-locators';
import { testData } from './test-data';

export async function validateResponse(page: Page) {
  await expect(page.locator(locators.responseStatus)).toContainText(testData.expectedStatus);
  await expect(page.locator(locators.responseBody)).toContainText(testData.expectedTitle);
}
