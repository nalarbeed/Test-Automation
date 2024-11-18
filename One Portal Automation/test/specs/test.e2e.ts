import { expect } from '@wdio/globals'
import Partner from '../pageobjects/partner.page'

describe('B2B Partners', () => {

    // Verify That User Will Not Be Able To Add A New Partner Without Fill All The Mandatory Fields
    it('Should Disable The Save Button If Mandatory Fields Are Missing', async () => {
        await Partner.open()

        await Partner.VirefyMandatoryFields();
        await expect(Partner.btnSavePartner).toBeDisabled();
    })

    // Add A New Partner
    it('Should Add a New Partner', async () => {
        await Partner.open()

        await Partner.addPartner("Test", "Test", "Test", "UAE")
    });

    // Update Partner Information
    it.only('should Update Partner Details', async () => {

        await Partner.open()
        const editButton = await Partner.getEditPartnerButton("OSNTV");
        // Check if the button is displayed before clicking
        if (await editButton.isDisplayed()) {
            await editButton.click();
            await browser.pause(2000);
        } else {
            throw new Error('Edit button for partner OSNTV not found.');
        }
       
    });
})

