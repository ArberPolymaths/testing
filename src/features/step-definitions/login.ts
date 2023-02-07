import { When, Then, Given, setDefaultTimeout } from '@cucumber/cucumber';
import * as puppeteer from 'puppeteer';
import { expect } from 'chai';
import LoginPage from '../../pages/LoginPage';
import * as constants from '../../pages/constants';
import { globalBrowser } from './launchBrowser';

setDefaultTimeout(constants.THREE_MINUTES);

let browser: puppeteer.Browser, page: puppeteer.Page;

Given('Im in browser', async () => {
    if (!browser) {
        browser = await puppeteer.connect({ browserWSEndpoint: globalBrowser?.wsEndpoint() });
    }
    page = await browser.newPage();

});
When('I go to ims site and i login', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.doAuthenticate(page);
});
Then('I will see the signOut button', async () => {
    const loginPage = new LoginPage(page);
    expect(await loginPage.checkSignOutBtn()).to.be.true;

    await page.close();
});