import { When, Then, Given, setDefaultTimeout } from '@cucumber/cucumber';
import * as puppeteer from 'puppeteer';
import { expect } from 'chai';
import LoginPage from '../../pages/LoginPage';
import * as constants from '../../pages/constants';
import { globalBrowser } from './launchBrowser';

setDefaultTimeout(constants.THREE_MINUTES);

let browser: puppeteer.Browser, page: puppeteer.Page;

Given('Im authenticated in the IMS site', async () => {
    if (!browser) {
        browser = await puppeteer.connect({ browserWSEndpoint: globalBrowser?.wsEndpoint() });
    }
    page = await browser.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.doAuthenticate(page);
});
When('I click the log out button', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.clickLogOutBtn();
});
Then('I will see the authentication page', async () => {
    expect(page.url()).to.equal(LoginPage.authenticationURL);

    await page.close();
});