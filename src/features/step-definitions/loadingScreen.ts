import { When, Then, Given, setDefaultTimeout } from '@cucumber/cucumber';
import * as puppeteer from 'puppeteer';
import { expect } from 'chai';
import LoginPage from '../../pages/LoginPage';
import * as constants from '../../pages/constants';
import { globalBrowser } from './launchBrowser';

setDefaultTimeout(constants.TEN_MINUTES);

let browser: puppeteer.Browser, page: puppeteer.Page;

Given('I am in browser', async () => {
    if (!browser) {
        browser = await puppeteer.connect({ browserWSEndpoint: globalBrowser?.wsEndpoint() });
    }
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goToTheSite();
});
When('I go to ims site and i reload the page a few times', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.reloadThePageTillStuckInLoading();
});
Then('The page will not get stuck in loading screen', async () => {
    const loginPage = new LoginPage(page);
    expect(await loginPage.checkEmailFieldSelector()).to.be.true;

    await page.close();
});