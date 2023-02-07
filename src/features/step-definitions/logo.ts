import { When, Then, Given, setDefaultTimeout } from '@cucumber/cucumber';
import * as puppeteer from 'puppeteer';
import { expect } from 'chai';
import LoginPage from '../../pages/LoginPage';
import * as constants from '../../pages/constants';
import { globalBrowser } from './launchBrowser';

setDefaultTimeout(constants.THREE_MINUTES);

let browser: puppeteer.Browser, page: puppeteer.Page;

Given('I navigate in browser', async () => {
    if (!browser) {
        browser = await puppeteer.connect({ browserWSEndpoint: globalBrowser?.wsEndpoint() });
    }
    page = await browser.newPage();

});
When('I go to ims site and authenticated', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.doAuthenticate(page);
});
Then('I can see the logo in homepage', async () => {
    const loginPage = new LoginPage(page);
    expect(await loginPage.checkLogo()).to.be.true;
    await page.close();
});