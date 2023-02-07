import BasePage from './BasePage';
import * as constants from './constants';
import SidebarMenu from './SidebarMenu';

class RolesPage extends BasePage {

    private static browserRoot = 'role-browser-component::shadow-dom(div)';
    private static editorRoot = 'role-editor-component::shadow-dom(div)';
    private static newRoleBtnSelector = '.btn-group.me-2>button:nth-child(1)';
    private static saveBtnSelector = '.btn-group.me-2>button:nth-child(2)';
    private static deleteBtnSelector = '.btn-group.me-2>button:nth-child(3)';
    private static undoBtnSelector = '.btn-group.me-2>button:nth-child(4)';
    private static nameFieldSelector = '#f_name_0';
    private static descriptionFieldSelector = '#f_description_0';
    private static roleName = 'RolesTest';
    private static description = 'DescriptionTest';
    private static rolesTest = '.table.table-hover>tbody>tr>td [title="RolesTest"]';
    private static okConfirmBtnSelector = '.modal-footer>button:nth-child(2)';

    async createNewRole(): Promise<void> {
        await this.waitForLoading();
        await this.clickNewRoleBtn();
        await this.waitForLoading();
        await this.typeRoleName();
        await this.waitForLoading();
        await this.typeRoleDescription();
        await this.waitForLoading();
        await this.clickSaveRoleBtn();
        await this.waitForLoading();
    }
    async deleteTheCreatedRole(): Promise<void> {
        await this.waitForLoading();
        await this.clickBtn(RolesPage.browserRoot, RolesPage.rolesTest);
        await this.waitForLoading();
        await this.clickDeleteRoleBtn();
        await this.waitForLoading();
        await this.clickOKConfirmBtn();
        await this.waitForLoading();
    }
    async clickOKConfirmBtn(): Promise<void> {
        await this.clickBtn(RolesPage.editorRoot, RolesPage.okConfirmBtnSelector);
    }
    async checkVisibilityOfCreatedRole(): Promise<boolean> {
        return await this.isElementVisibleMethod(RolesPage.browserRoot, RolesPage.rolesTest);
    }

    private async isElementVisibleMethod(shadowRoot: string | null, selector: string): Promise<boolean> {
        try {
            let element;
            if (shadowRoot === null) {
                element = await this.page.$(selector);
            } else {
                const root = await this.pickShadowSelector(shadowRoot);
                if (!root) throw new Error('Shadow root not found');
                element = await root.$(selector);
            }
            if (!element) throw new Error('Element not found');
            return await element.evaluate(elem => window.getComputedStyle(elem).getPropertyValue('display') !== 'none');
        }
        catch (error) {
            return false;
        }
    }

    async clickNewRoleBtn(): Promise<void> {
        await this.clickBtn(null, RolesPage.newRoleBtnSelector);
    }
    async clickSaveRoleBtn(): Promise<void> {
        await this.clickBtn(null, RolesPage.saveBtnSelector);
    }
    async clickDeleteRoleBtn(): Promise<void> {
        await this.clickBtn(null, RolesPage.deleteBtnSelector);
    }
    async typeRoleName(): Promise<void> {
        await this.clearField(RolesPage.editorRoot, RolesPage.nameFieldSelector);
        await this.typeInField(RolesPage.editorRoot, RolesPage.nameFieldSelector, RolesPage.roleName);
    }
    async typeRoleDescription(): Promise<void> {
        await this.clearField(RolesPage.editorRoot, RolesPage.descriptionFieldSelector);
        await this.typeInField(RolesPage.editorRoot, RolesPage.descriptionFieldSelector, RolesPage.description);
    }
}
export default RolesPage;