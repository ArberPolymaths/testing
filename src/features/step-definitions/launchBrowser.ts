import { Before, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import * as puppeteer from 'puppeteer';
import * as constants from '../../pages/constants';

setDefaultTimeout(constants.ONE_MINUTE);

let browser: puppeteer.Browser;
export let globalBrowser: puppeteer.Browser;

Before(async () => {

    if (!browser) {
        browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
    }
    globalBrowser = browser;
});
AfterAll(async () => {
    await browser.close();
});