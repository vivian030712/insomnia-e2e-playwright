import { test, expect } from "@playwright/test";
import { launchInsomnia } from "./helpers/electron-launch";
import { locators } from "./helpers/insomnia-locators";

test.describe("URL Input – Equivalence Partitioning Assertions", () => {

  const VALID_URLS = [
    { name: "Valid HTTP URL", url: "http://httpbin.org/get" },
    { name: "Valid HTTPS URL", url: "https://httpbin.org/get" },
    { name: "Valid localhost URL", url: "http://localhost:3000" },
  ];

  const INVALID_URLS = [
    { name: "Empty string", url: "" },
    { name: "Malformed URL", url: "htp:/broken" },
    { name: "Unsupported protocol", url: "ftp://example.com" },
    { name: "Whitespace only", url: "    " }
  ];

  let app: any;
  let window: any;

  test.beforeEach(async ({}, testInfo) => {
    const instance = await launchInsomnia(testInfo);
    app = instance.app;
    window = instance.window;
  });

  // -------------------------------------
  // VALID URL PARTITIONS (expanded)
  // -------------------------------------
  VALID_URLS.forEach(({ name, url }) => {
    test(`Valid Partition: ${name}`, async ({}) => {

      // Create new request
      await window.locator(locators.newRequestButton).click();
      await window.locator(locators.requestNameInput).fill(`Valid Test - ${name}`);
      await window.locator(locators.createRequestConfirm).click();

      // URL Input
      await window.locator(locators.urlInput).fill(url);
      await expect(window.locator(locators.urlInput)).toHaveValue(url);

      // Assert send button is enabled
      await expect(window.locator(locators.sendButton)).toBeEnabled();

      // Send request
      await window.locator(locators.sendButton).click();

      // RESPONSE VALIDATIONS
      const status = window.locator(locators.responseStatus);
      await expect(status).toBeVisible();

      // Check status code is 2xx or 3xx
      const statusText = await status.innerText();
      expect(statusText).toMatch(/(20|30)\d/);

      // Check response size > 0
      await expect(window.locator(locators.responseSize)).not.toHaveText("0 B");

      // Check response headers exist
      await expect(window.locator(locators.responseHeadersTab)).toBeVisible();

      // Select body tab
      await window.locator(locators.responseBodyTab).click();

      // Check response body exists
      const bodyText = await window.locator(locators.responseBody).innerText();
      expect(bodyText.length).toBeGreaterThan(2);

      // httpbin returns JSON → assert JSON detect
      if (url.includes("httpbin")) {
        expect(() => JSON.parse(bodyText)).not.toThrow();
      }

      // Assert history updated
      await expect(window.locator(locators.historyListItem).first()).toBeVisible();

      // Assert no error banner
      await expect(window.locator(locators.errorBanner)).toHaveCount(0);
    });
  });

  // -------------------------------------
  // INVALID URL PARTITIONS (expanded)
  // -------------------------------------
  INVALID_URLS.forEach(({ name, url }) => {
    test(`Invalid Partition: ${name}`, async ({}) => {

      // Create request
      await window.locator(locators.newRequestButton).click();
      await window.locator(locators.requestNameInput).fill(`Invalid Test - ${name}`);
      await window.locator(locators.createRequestConfirm).click();

      // Enter invalid URL
      await window.locator(locators.urlInput).fill(url);
      await expect(window.locator(locators.urlInput)).toHaveValue(url);

      // ASSERTIONS FOR INVALID INPUT
      // Send button often should be disabled
      const sendBtn = window.locator(locators.sendButton);
      const isEnabled = await sendBtn.isEnabled();

      if (!url.trim() || url.startsWith("ftp") || url.startsWith("htp")) {
        expect(isEnabled).toBeFalsy();   // Should NOT be enabled
      }

      // Attempt click anyway
      if (isEnabled) {
        await sendBtn.click();
      }

      // Expect ERROR UI feedback
      const errorShown =
        (await window.locator(locators.errorBanner).count()) > 0 ||
        (await window.locator(locators.invalidUrlWarningIcon).count()) > 0;

      expect(errorShown).toBeTruthy();

      // Assert NO response panel appears
      await expect(window.locator(locators.responseStatus)).toHaveCount(0);

      // Assert no history item added
      // Small wait just to ensure Insomnia refreshes
      await window.waitForTimeout(300);
      expect(await window.locator(locators.historyListItem).count()).toBe(0);

      // Assert no response body, no headers
      await expect(window.locator(locators.responseBody)).toHaveCount(0);
      await expect(window.locator(locators.responseHeadersTab)).toHaveCount(0);
    });
  });
});
