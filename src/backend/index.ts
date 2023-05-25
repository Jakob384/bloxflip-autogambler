import { checkAuth } from "./bloxflip/user.js";
import { startDataAnalysis } from "./bloxflip/data.js";
import { fetchCfg } from "@utils/config.js";
import { Logger, createLog } from "@utils/logger.js";
import { startBrowser, page } from "@utils/browser.js";
import { startApi } from "@api/server.js";
import { readFileSync, existsSync } from "node:fs";
import { checkUpdates } from "@utils/updater.js";
import { sleep } from "@utils/sleep.js";

(async (): Promise<void> => {
    Logger.log("STARTUP", "Starting bloxflip-autocrash");
    Logger.log("SUPPORT", "Support the developers by giving the repo a star! https://github.com/Norikiru/bloxflip-autocrash");
   
    await fetchCfg();
    await startApi();
    await startBrowser();
    await createLog();

    await checkUpdates();
    await checkAuth();
    await startDataAnalysis();
    
    sleep(5000);
    if (existsSync("./dist/userScript.js")) {
        const autoCrash = readFileSync("./dist/userScript.js", "utf-8");
        page.evaluate(autoCrash);
    } else {
        Logger.error("BFAC", "Unable to read UserScript, make sure that UserScript is built.", { forceClose: true });
    }
})();

export { page };
