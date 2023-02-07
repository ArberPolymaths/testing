import { Page } from 'puppeteer';
import BasePage from './BasePage';

class LoginPage extends BasePage {

    public static authenticationURL = 'https://amb.polymaths.dev/auth/login';

    private static loginRoot = 'login-component::shadow-dom(div)';
    private static emailFieldSelector = '#f_email_0';
    private static passwordFieldSelector = '#f_password_0';
    private static loginBtnSelector = '#auth-btn';
    private static siteURL = 'https://amb.polymaths.dev';
    private static userEmail = 'arber@polymaths.co';
    private static userPassword = '.4r83r1.';
    private static navSelector = '.nav';
    private static spinnerSelector = '.spinner-border';
    private static signOutBtnSelector = '.fas.fa-sign-out-alt';
    private static logoSelector = '.navbar-brand';

    async goToTheSite(): Promise<void> {
        await this.page.goto(LoginPage.siteURL);
        await this.page.setCacheEnabled(false);
        await this.waitForLoading();
    }

    async typeEmail(email: string): Promise<void> {
        await this.typeInField(LoginPage.loginRoot, LoginPage.emailFieldSelector, email);
    }

    async typePassword(password: string): Promise<void> {
        await this.typeInField(LoginPage.loginRoot, LoginPage.passwordFieldSelector, password);
    }
    async clickLoginButton(): Promise<void> {
        await this.clickBtn(LoginPage.loginRoot, LoginPage.loginBtnSelector);
    }

    async doAuthenticate(page: Page): Promise<void> {
        await page.goto(LoginPage.siteURL);
        await this.waitForLoading();
        if (page.url() == 'https://amb.polymaths.dev/auth/login') {
            await page.setCacheEnabled(false);

            while (await this.page.$(LoginPage.spinnerSelector)) {
                await page.reload({
                    waitUntil: 'networkidle2',
                    timeout: 10000,
                });
                await this.waitForLoading();
            }

            await this.typeEmail(LoginPage.userEmail);
            await this.typePassword(LoginPage.userPassword);
            await this.clickLoginButton();
            await this.waitForLongLoading();
        }
        while (await this.page.$(LoginPage.spinnerSelector)) {
            await page.reload({
                waitUntil: 'networkidle2',
                timeout: 10000,
            });
            await this.waitForLongLoading();
        }
    }
    async reloadThePageTillStuckInLoading(): Promise<void> {
        var startTime = Date.now();
        while (!await this.page.$(LoginPage.spinnerSelector) && (Date.now() - startTime < 500000)) {

            await this.page.goto(LoginPage.siteURL);
            await this.page.setCacheEnabled(false);
            await this.waitForLoading();
        }
    }
    async checkSpinner(): Promise<boolean> {
        await this.page.waitForSelector(LoginPage.spinnerSelector);
        const spinner = await this.page.waitForSelector(LoginPage.spinnerSelector);
        return Boolean(spinner);
    }
    async checkSignOutBtn(): Promise<boolean> {
        await this.page.waitForSelector(LoginPage.signOutBtnSelector);
        const btn = await this.page.waitForSelector(LoginPage.signOutBtnSelector);
        return Boolean(btn);
    }
    async clickLogOutBtn(): Promise<void> {
        await this.clickBtn(null, LoginPage.signOutBtnSelector);
        await this.waitForLoading();
    }
    async checkEmailFieldSelector(): Promise<boolean> {
        await (await this.pickShadowSelector(LoginPage.loginRoot))?.waitForSelector(LoginPage.emailFieldSelector);
        const emailField = await (await this.pickShadowSelector(LoginPage.loginRoot))?.$$(LoginPage.emailFieldSelector);
        return Boolean(emailField);
    }
    async checkLogo(): Promise<boolean> {
        await this.page.waitForSelector(LoginPage.logoSelector);
        const btn = await this.page.waitForSelector(LoginPage.logoSelector);
        return Boolean(btn);
    }

}

export default LoginPage;