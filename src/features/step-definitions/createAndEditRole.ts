import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import * as puppeteer from "puppeteer";
import * as constants from '../../pages/constants';
import { globalBrowser } from "./launchBrowser";
import LoginPage from "../../pages/LoginPage";
import SidebarMenu from "../../pages/SidebarMenu";
import RolesPage from "../../pages/RolesPage";
import { expect } from "chai";

setDefaultTimeout(constants.THREE_MINUTES);
let browser: puppeteer.Browser, page: puppeteer.Page;

Given('Im logged in to the site and i navigate to Roles', async () => {
    if (!browser) {
        browser = await puppeteer.connect({ browserWSEndpoint: globalBrowser?.wsEndpoint() });
    }
    page = await browser.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.doAuthenticate(page);
    const sidebarMenu = new SidebarMenu(page);
    await sidebarMenu.navigateToRoles();
});
When('I create new Role', async () => {
    const rolesPage = new RolesPage(page);
    await rolesPage.createNewRole();
})
When('I navigate to a created role and change name and description and click on save', async () => {
    const sidebarMenu = new SidebarMenu(page);
    await sidebarMenu.clickOnRoles();
    await sidebarMenu.waitForLoading();
    const rolesPage = new RolesPage(page);
    await rolesPage.editTheCreatedRole();
})
Then('I will see that the role has been edited', async () => {
    const sidebarMenu = new SidebarMenu(page);
    await sidebarMenu.clickOnRoles();
    await sidebarMenu.waitForLoading();
    const rolesPage = new RolesPage(page);
    expect(await rolesPage.checkVisibilityOfEditedRole()).to.be.true;

    await rolesPage.deleteTheEditedRole();
    await page.close();
})