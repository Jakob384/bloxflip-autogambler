import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { Browser, Page } from "puppeteer";
import { Logger } from "@utils/logger.js";
import { USER_AGENT, __dirname } from "@utils/constants.js";
import { config } from "@utils/config.js";
import { join } from "path"

let browser: Browser;
let page: Page;

async function startBrowser(): Promise<void> {
    puppeteer.default.use(stealthPlugin());
    const pathToExtension = join(__dirname, "..", "lib", "nopecha");
    browser = await puppeteer.default.launch(
        {
            headless: config.debugging.headless,
            defaultViewport: { width: 1920, height: 1080 },
            args: [
                "--start-maximized", "--single-process",
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
            ]
        }
    );
    Logger.info("BROWSER", "Successfully started browser");

    page = (await browser.pages())[0];
    await page.setUserAgent(USER_AGENT);
    await page.goto("https://bloxflip.com", { timeout: 0 });
    const auth = config.auth;
    await page.evaluate((auth: string) => {
        localStorage.setItem("_DO_NOT_SHARE_BLOXFLIP_TOKEN", auth);
    }, auth);
    await page.goto("about:blank", { timeout: 0 });

    Logger.info("BLOXFLIP", "Successfully set up page for Bloxflip");
}

export { startBrowser, page, browser };