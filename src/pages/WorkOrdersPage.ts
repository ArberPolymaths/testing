import BasePage from './BasePage';
import * as constants from './constants';

class WorkOrdersPage extends BasePage {

    public static newWOErrorPopUpMessage = 'A work order with this work order number already exists.';

    private static browserRoot = 'ipd-ims-work-order-browser-component::shadow-dom(div)';
    private static editorRoot = 'ipd-ims-work-order-editor-component::shadow-dom(div)';
    private static assemblyRoot = 'ipd-ims-assembly-components-tab-component::shadow-dom(div)';
    private static uploadAttachmentRoot = 'ipd-ims-assembly-components-tab-component::shadow-dom(map-files-widget::shadow-dom(div)';
    private static newWOBtnSelector = '.btn-group.me-2';
    private static newWOCustomerSelector = '#f_customerId_0';
    private static newWONumberSelector = '#f_workOrderNumber_1';
    private static newWOPOSelector = '#f_purchaseOrderNumber_2';
    private static newWOLocationSelector = '#f_locationId_0';
    private static newWOSaveBtnSelector = '.btn-group.me-2>button:nth-child(2)';
    private static newWOErrorPopUpSelector = 'div>div>div:nth-child(4)>div>div>div.modal-body';
    private static newWOOkBtnSelector = 'div>div>div:nth-child(4)>div>div>div.modal-footer>button';
    private static newWOCustomerValue = '1';
    private static newWOLocationValue = '1';
    private static oneDigitNumber = '1';
    private static newWOQuantitySelector = '#f_customerRequestedCount_1';
    private static newWONuberValueSelector = '#f_workOrderNumber_1';
    private static newWOdisabledUndoBtnSelector = '.btn-group.me-2>button.btn.btn-sm.btn-light.toolbar-action-disabled:nth-child(4)';
    private static rowFooterSelector = '.row.footer';
    private static workOrderFormSelector = '.polymaths-react-forms';
    private static firstWOSelector = '.table.table-hover>tbody>tr';
    private static firstAssemblySelector = 'table>tbody>tr:nth-child(1)>td:nth-child(1)>div';
    private static firstAssemblyAllocationSelector = '.fa.fa-plus';
    private static firstRaidoButton = 'div > div > div.form-dialog-component > div.modal.undefined > div > div > div.modal-body > div.form-body > div:nth-child(6) > div > div > div > div > div > div.table-responsive.table-scrollable-responsive.ps-1.pe-1 > table > tbody > tr:nth-child(1) > td:nth-child(1) > input';
    private static allocationInputSizeField = '#f_allocatedCount_0';
    private static saveAllocationSelector = 'div > div > div.form-dialog-component > div.modal.undefined > div > div > div.modal-body > div.form-actions > div > button:nth-child(1)';
    private static uploadBtnSelector = '.fa.fa-upload.me-2';
    private static selectFileBtnSelector = 'div>div>div:nth-child(2)>div>div>div.modal-body>div>div:nth-child(1)>div>button';
    private static maxNumerOfRowsSelector = '.col-6.text-end.m-auto';
    private static lastPageSelector = '.pagination.m-0>li:nth-last-child(2)';
    private static lastPageTyperSelector = '.form-control-plaintext';
    private static paginationSelector = '.pagination.m-0>li';
    private static customerFilterValue = '.filter-bar>div>div>div>ul>li';
    private static customerFilterSelector = '.filter-bar>div';

    async selectFirstFilter(): Promise<void> {
        await this.selectOptionByValue(WorkOrdersPage.browserRoot, WorkOrdersPage.customerFilterSelector, WorkOrdersPage.customerFilterValue)
    }

    async checkPageTyperNavFormat(): Promise<boolean> {
        await (await this.pickShadowSelector(WorkOrdersPage.browserRoot))?.waitForSelector(WorkOrdersPage.paginationSelector);
        const list = await (await this.pickShadowSelector(WorkOrdersPage.browserRoot))?.$$(WorkOrdersPage.paginationSelector);
        if (!list) throw new Error('list is missing');
        if (list.length == 3) {
            return true;
        } else return false;
    }

    async generateTenDigitsNumber(): Promise<string> {
        return (Math.floor(Math.random() * constants.nineBillion) + constants.oneBillion).toString();
    }

    async typeUniqueWONumber(): Promise<void> {
        await this.clearField(WorkOrdersPage.editorRoot, WorkOrdersPage.newWONumberSelector);
        await this.typeInField(WorkOrdersPage.editorRoot, WorkOrdersPage.newWONumberSelector, await this.generateTenDigitsNumber());
    }

    async getTotalNumberOfRows(): Promise<number> {
        await (await this.pickShadowSelector(WorkOrdersPage.browserRoot))?.waitForSelector(WorkOrdersPage.maxNumerOfRowsSelector);
        const totalCustomersNumberSelector = await (await this.pickShadowSelector(WorkOrdersPage.browserRoot))?.$(WorkOrdersPage.maxNumerOfRowsSelector);
        const insideText = totalCustomersNumberSelector ? await (await totalCustomersNumberSelector.getProperty('innerText')).jsonValue() as string : '';
        const stringArray = insideText.split(' '); // split into subsrtrings on space => " "
        return stringArray[constants.THIRD_SUBSTRING_INDEX] as unknown as number; // returns 3rd substring => total number of rows
    }
    async clickOnLastPage(): Promise<void> {
        const totalRows = await this.getTotalNumberOfRows();
        if (totalRows < constants.TWO_HUNDRED_FIFTY_ONE) {
            await this.clickBtn(WorkOrdersPage.browserRoot, WorkOrdersPage.lastPageSelector);
        } else {
            await this.clearField(WorkOrdersPage.browserRoot, WorkOrdersPage.lastPageTyperSelector);
            const numOfFullPages = parseInt((totalRows / constants.FIFTY).toString(), 10);

            if (totalRows % constants.FIFTY !== constants.ZERO) {
                const increasedValueByOne = numOfFullPages + constants.ONE;
                await this.typeInField(WorkOrdersPage.browserRoot, WorkOrdersPage.lastPageTyperSelector, increasedValueByOne.toString());
            } else {
                await this.typeInField(WorkOrdersPage.browserRoot, WorkOrdersPage.lastPageTyperSelector, numOfFullPages.toString());
            }
        }
    }
    async createUniqueWO(): Promise<void> {
        await this.clickNewWOBtn();
        await this.waitForLoading();
        await this.selectCustomerFromNewWoList();
        await this.waitForShortLoading();
        await this.typeUniqueWONumber();
        await this.waitForShortLoading();
        await this.setPONumberWithFiveDigits();
        await this.waitForShortLoading();
        await this.setWOQuantityToTen();
        await this.waitForShortLoading();
        await this.clickSaveInNewWOEditor();
        await this.waitForLoading();
    }

    async clickUploadBtn(): Promise<void> {
        await this.clickBtn(null, WorkOrdersPage.uploadBtnSelector);
    }
    async selectFileToUpload(): Promise<void> {
        await this.clickBtn(WorkOrdersPage.uploadAttachmentRoot, WorkOrdersPage.selectFileBtnSelector);
    }

    async setWOQuantityToTen(): Promise<void> {
        await this.typeInField(WorkOrdersPage.editorRoot, WorkOrdersPage.newWOQuantitySelector, constants.TEN.toString());
    }
    async getWOValue(): Promise<number> {
        await (await this.pickShadowSelector(WorkOrdersPage.editorRoot))?.waitForSelector(WorkOrdersPage.newWONuberValueSelector);
        const numericLotSelector = await (await this.pickShadowSelector(WorkOrdersPage.editorRoot))?.$(WorkOrdersPage.newWONuberValueSelector);
        if (!numericLotSelector)
            throw Error('numericLotSelector not found');
        return await (await numericLotSelector.getProperty('value')).jsonValue() as number;
    }
    private async getTextValueRoot(root: string, selector: string): Promise<string> {
        await (await this.pickShadowSelector(root))?.waitForSelector(selector);
        const numericLotSelector = await (await this.pickShadowSelector(root))?.$(selector);
        if (!numericLotSelector)
            throw Error('text not found');
        return await (await numericLotSelector.getProperty('innerText')).jsonValue() as string;
    }
    async setAllocationInput(): Promise<void> {
        await this.typeInField(WorkOrdersPage.assemblyRoot, WorkOrdersPage.allocationInputSizeField, '0.01');
    }
    async clickFirstAssembly(): Promise<void> {
        await this.clickBtn(WorkOrdersPage.editorRoot, WorkOrdersPage.firstAssemblySelector);
    }
    async clickFirstRaidoBtn(): Promise<void> {
        await this.clickBtn(WorkOrdersPage.assemblyRoot, WorkOrdersPage.firstRaidoButton);
    }
    async clickSaveAllocationBtn(): Promise<void> {
        await this.clickBtn(WorkOrdersPage.assemblyRoot, WorkOrdersPage.saveAllocationSelector);
    }
    async clickFirstAssemblyAllocationPlus(): Promise<void> {
        await this.clickBtn(WorkOrdersPage.assemblyRoot, WorkOrdersPage.firstAssemblyAllocationSelector);
    }
    async clickFirstWO(): Promise<void> {
        await this.clickBtn(WorkOrdersPage.browserRoot, WorkOrdersPage.firstWOSelector);
    }
    async getErrorMsg(): Promise<string> {
        return await this.getTextValueRoot(WorkOrdersPage.editorRoot, WorkOrdersPage.newWOErrorPopUpSelector);
    }
    async setDuplicateWONumber(copiedNumber: number): Promise<void> {
        await this.typeInField(WorkOrdersPage.editorRoot, WorkOrdersPage.newWONumberSelector, copiedNumber.toString());
    }
    async clickNewWOBtn(): Promise<void> {
        await this.clickBtn(null, WorkOrdersPage.newWOBtnSelector);
    }
    async generateFiveDigitsNumber(): Promise<string> {
        return (Math.floor(Math.random() * constants.ninetyThousand) + constants.tenThousand).toString();
    }
    async selectCustomerFromNewWoList(): Promise<void> {
        await (await this.pickShadowSelector(WorkOrdersPage.editorRoot))?.waitForSelector(WorkOrdersPage.newWOCustomerSelector);
        await this.selectOptionByValue(WorkOrdersPage.editorRoot, WorkOrdersPage.newWOCustomerSelector, WorkOrdersPage.newWOCustomerValue);
    }
    async selectLocationFromNewWoList(): Promise<void> {
        await (await this.pickShadowSelector(WorkOrdersPage.editorRoot))?.waitForSelector(WorkOrdersPage.newWOLocationSelector);
        await this.selectOptionByValue(WorkOrdersPage.editorRoot, WorkOrdersPage.newWOLocationSelector, WorkOrdersPage.newWOLocationValue);
    }
    private async selectOptionByValue(shadow: string, selector: string, value: string): Promise<void> {
        const element = await (await this.pickShadowSelector(shadow))?.waitForSelector(selector);
        await element?.select(`select${element}`, `${value}`);
    }
    async clickWOInNewWOEditor(): Promise<void> {
        await this.clickBtn(WorkOrdersPage.editorRoot, WorkOrdersPage.newWONumberSelector);
    }
    async clickPOInNewWOEditor(): Promise<void> {
        await this.clickBtn(WorkOrdersPage.editorRoot, WorkOrdersPage.newWOPOSelector);
    }
    async clickSaveInNewWOEditor(): Promise<void> {
        await this.clickBtn(null, WorkOrdersPage.newWOSaveBtnSelector);
    }
    async clickOKInNewWOErrorPopUp(): Promise<void> {
        await this.clickBtn(WorkOrdersPage.editorRoot, WorkOrdersPage.newWOOkBtnSelector);
    }
    async setWONumberLessThanFiveDigits(): Promise<void> {
        await this.typeInField(WorkOrdersPage.editorRoot, WorkOrdersPage.newWONumberSelector, WorkOrdersPage.oneDigitNumber);
    }
    async setPONumberWithFiveDigits(): Promise<void> {
        await this.typeInField(WorkOrdersPage.editorRoot, WorkOrdersPage.newWOPOSelector, await this.generateFiveDigitsNumber());
    }
    async setWONumberWithFiveDigits(): Promise<void> {
        await this.typeInField(WorkOrdersPage.editorRoot, WorkOrdersPage.newWONumberSelector, await this.generateFiveDigitsNumber());
    }
    async checkDisabledUndoBtn(): Promise<boolean> {
        await this.pickShadowSelector(WorkOrdersPage.newWOdisabledUndoBtnSelector);
        const disabledField = await this.pickShadowSelector(WorkOrdersPage.newWOdisabledUndoBtnSelector);
        return Boolean(disabledField);
    }
    async waitTillBrowserFooterIsLoaded(): Promise<void> {
        await (await this.pickShadowSelector(WorkOrdersPage.browserRoot))?.waitForSelector(WorkOrdersPage.rowFooterSelector);
    }
    async waitTillWOFormIsLoaded(): Promise<void> {
        await (await this.pickShadowSelector(WorkOrdersPage.editorRoot))?.waitForSelector(WorkOrdersPage.workOrderFormSelector);
    }
}
export default WorkOrdersPage;