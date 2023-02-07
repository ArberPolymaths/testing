import { When, Then, Given, setDefaultTimeout } from '@cucumber/cucumber';
import * as puppeteer from 'puppeteer';
import { expect } from 'chai';
import LoginPage from '../../pages/LoginPage';
import SidebarMenu from '../../pages/SidebarMenu';
import * as constants from '../../pages/constants';
import WorkOrdersPage from '../../pages/WorkOrdersPage';
import { globalBrowser } from './launchBrowser';

setDefaultTimeout(constants.TWO_HOURS);

let browser: puppeteer.Browser, page: puppeteer.Page;

Given('I am in a browser that has more than 250 rows', async () => {
    if (!browser) {
        browser = await puppeteer.connect({ browserWSEndpoint: globalBrowser?.wsEndpoint() });
    }
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.doAuthenticate(page);

    const sidebarMenu = new SidebarMenu(page);
    await sidebarMenu.navigateToWorkOrders();

    const workOrders = new WorkOrdersPage(page);
    while (await workOrders.getTotalNumberOfRows() < 250) {
        const workOrders = new WorkOrdersPage(page);
        await workOrders.waitTillBrowserFooterIsLoaded();
        await workOrders.createUniqueWO();

        await sidebarMenu.clickOnWorkOrders();
    }
});
When('I add one more row to the table', async () => {
    const sidebarMenu = new SidebarMenu(page);
    const workOrders = new WorkOrdersPage(page);
    await workOrders.waitTillBrowserFooterIsLoaded();
    await workOrders.createUniqueWO();

    await sidebarMenu.clickOnWorkOrders();
    await workOrders.waitTillBrowserFooterIsLoaded();
});
Then('The pagination format will not change', async () => {
    const workOrders = new WorkOrdersPage(page);
    expect(await workOrders.checkPageTyperNavFormat()).to.be.true;
});