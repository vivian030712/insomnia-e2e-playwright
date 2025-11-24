import { _electron as electron, ElectronApplication, Page } from 'playwright';

export async function launchInsomnia(): Promise<{ app: ElectronApplication; window: Page }> {
  const app = await electron.launch({
    executablePath: "C:/Program Files/Insomnia/Insomnia.exe"
  });

  const window = await app.firstWindow();
  await window.waitForLoadState('domcontentloaded');

  return { app, window };
}
