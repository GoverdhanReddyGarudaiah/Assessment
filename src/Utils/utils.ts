export async function getScreenShot(): Promise<any> {
    return browser.takeScreenshot();
  }