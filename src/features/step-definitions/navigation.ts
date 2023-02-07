import { When, Then, Given, setDefaultTimeout } from '@cucumber/cucumber';
import * as puppeteer from 'puppeteer';
import { expect } from 'chai';
import LoginPage from '../../pages/LoginPage';
import SidebarMenu from '../../pages/SidebarMenu';
import * as constants from '../../pages/constants';
import { globalBrowser } from './launchBrowser';

setDefaultTimeout(constants.TEN_MINUTES);

let browser: puppeteer.Browser, page: puppeteer.Page;

Given('Im in browser and i authenticate in IMS', async () => {
    if (!browser) {
        browser = await puppeteer.connect({ browserWSEndpoint: globalBrowser?.wsEndpoint() });
    }
    page = await browser.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.doAuthenticate(page);
});
When('I click on component Lots in the menu', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.doAuthenticate(page);

    const sidebarMenu = new SidebarMenu(page);
    await sidebarMenu.navigateToComponentLots();
});
Then('The URL will change', async () => {
    expect(page.url()).to.equal(SidebarMenu.cLotsURL);

    await page.close();
});