import { When, Then, Given, setDefaultTimeout } from '@cucumber/cucumber';
import * as puppeteer from 'puppeteer';
import { expect } from 'chai';
import LoginPage from '../../pages/LoginPage';
import * as constants from '../../pages/constants';
import { globalBrowser } from './launchBrowser';
import SidebarMenu from '../../pages/SidebarMenu';
import RolesPage from '../../pages/RolesPage';

setDefaultTimeout(constants.THREE_MINUTES);

let browser: puppeteer.Browser, page: puppeteer.Page;

Given('Im logged in to the IMS site and i navigate to Roles', async () => {
    if (!browser) {
        browser = await puppeteer.connect({ browserWSEndpoint: globalBrowser?.wsEndpoint() });
    }
    page = await browser.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.doAuthenticate(page);
    const sidebarMenu = new SidebarMenu(page);
    await sidebarMenu.navigateToRoles();
});
When('I create a new Role', async () => {
    const rolesPage = new RolesPage(page);
    await rolesPage.createNewRole();
});
Then('I will see that the role has been created , then delete it and not see it in the browser', async () => {
    const sidebarMenu = new SidebarMenu(page);
    await sidebarMenu.clickOnRoles();
    await sidebarMenu.waitForLoading();
    const rolesPage = new RolesPage(page);
    expect(await rolesPage.checkVisibilityOfCreatedRole()).to.be.true;

    await rolesPage.deleteTheCreatedRole();
    expect(await rolesPage.checkVisibilityOfCreatedRole()).to.be.false;

    await page.close();
});