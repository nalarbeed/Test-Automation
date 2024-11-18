import Page from "./page";


class Partner extends Page {

    public get btnNewPartner() {
        return $("//button[@label='New']");
    }
    public get btnSavePartner() {
        return $("//button[@label='Save']");
    }

    public get btnEditPartner() {
        return $("//tbody[@role='rowgroup']//tr[td[1][contains(text(), 'OSNTV')]][last()]/td[last()]");
    }

    public get inputPartnerName() {
        return $("(//div[@class='field']//input[@id='name'])[1]");
    }
    public get inputSource() {
        return $("//label[text()='Source']/following-sibling::input[@id='name']");
    }
    public get inputContact() {
        return $("//label[text()='Contact']/following-sibling::input[@id='name']");
    }
    public get inputCountry() {
        return $("//label[text()='Country']/following-sibling::input[@id='name']");
    }


    //  Methodes Section

    // overwite from parent
    public open() {
        return super.open('partners');
    }

    public async VirefyMandatoryFields() {
        // Clear all input fields
        await this.btnNewPartner.click();
        await this.inputPartnerName.setValue('');
        await this.inputSource.setValue('');
        await this.inputContact.setValue('');
        await this.inputCountry.setValue('');
    }

    public async addPartner(name: string, source: string, contact: string, country: string) {
        await this.btnNewPartner.click();
        await this.inputPartnerName.setValue(name);
        await this.inputSource.setValue(source);
        await this.inputContact.setValue(contact);
        await this.inputCountry.setValue(country);
        await this.btnSavePartner.click();
    }

    public async getEditPartnerButton(partnerName: string) {
        const button = $(`//tbody[@role='rowgroup']//tr[td[1][contains(text(), '${partnerName}')]][last()]/td[last()]`);
        await button.waitForDisplayed(); // Optionally wait for the button to be displayed
        return button;
    }

}

export default new Partner();