import * as Puppeteer from 'puppeteer';
import { $ } from 'puppeteer-shadow-selector';
import { FIVE_SECONDS, ONE_SECOND, TEN_SECONDS } from './constants';

export default class BasePage {
    protected page: Puppeteer.Page;

    constructor(page: Puppeteer.Page) {
        this.page = page;
    }

    pickShadowSelector(selector: string): Promise<Puppeteer.ElementHandle<Element> | null> {
        return $(this.page, selector);
    }

    waitForSelector(selector: string, options?: Puppeteer.WaitForSelectorOptions | undefined): Promise<Puppeteer.ElementHandle<Element> | null> {
        return this.page.waitForSelector(selector, options);
    }

    async typeInField(root: string | null, selector: string, text: string): Promise<void> {
        if (root === null) {
            await this.page.waitForSelector(selector);
            const domElement = await this.pickShadowSelector(selector);
            if (!domElement) throw Error(`DOM element not found: ${selector}`);
            await domElement.type(text);
        } else {
            await (await this.pickShadowSelector(root))?.waitForSelector(selector);
            const domElement = await (await this.pickShadowSelector(root))?.$(selector);
            if (!domElement) throw Error(`DOM element not found: ${selector}`);
            await domElement.type(text);
        }
    }
    async clickBtn(shadowRoot: string | null, selector: string): Promise<void> {
        if (shadowRoot === null) {
            await this.page.waitForSelector(selector);
            const button = await this.page.$(selector);
            if (!button) throw Error('Button not found');
            await button.click();
        } else {
            await (await this.pickShadowSelector(shadowRoot))?.waitForSelector(selector);
            const button = await (await this.pickShadowSelector(shadowRoot))?.$(selector);
            if (!button) throw Error('Click button not found');
            await button.click();
        }
    }
    async goTo(url: string, options?: (Puppeteer.WaitForOptions & {
        referer?: string | undefined;
    }) | undefined): Promise<Puppeteer.HTTPResponse | null> {
        return this.page.goto(url, options);
    }
    async waitForNavigationLoad(): Promise<Puppeteer.HTTPResponse | null> {
        return this.page.waitForNavigation({ waitUntil: 'networkidle0' });
    }
    async waitForLoading(): Promise<void> {
        await this.page.waitForTimeout(FIVE_SECONDS);
    }
    async waitForLongLoading(): Promise<void> {
        await this.page.waitForTimeout(TEN_SECONDS);
    }
    async waitForShortLoading(): Promise<void> {
        await this.page.waitForTimeout(ONE_SECOND);
    }
    async clearField(shadowRoot: string | null, selector: string): Promise<void> {
        if (shadowRoot === null) {
            await this.page.waitForSelector(selector);
            const button = await this.page.$(selector);
            if (!button) throw Error('Button not found');
            await button.click({ clickCount: 3 });
            await button.press('Backspace');
        } else {
            await (await this.pickShadowSelector(shadowRoot))?.waitForSelector(selector);
            const button = await (await this.pickShadowSelector(shadowRoot))?.$(selector);
            if (!button) throw Error('Click button not found');
            await button.click({ clickCount: 3 });
            await button.press('Backspace');
        }
    }
}