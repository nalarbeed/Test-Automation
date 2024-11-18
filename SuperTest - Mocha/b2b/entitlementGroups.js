import supertest from 'supertest';
import { expect } from 'chai';

const request = supertest('https://api.iddev.osn.com');
const request2 = supertest('http://10.119.0.243');
const SubscriptionKey = '67900bcc6a624f228cf8dea0ea2e5198';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Generate a string of 3 or 4 char:
const randomString = (() => Array.from({ length: Math.floor(Math.random() * 2) + 3 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join(''))();
const updatedRandomString = (() => Array.from({ length: Math.floor(Math.random() * 2) + 3 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join(''))();


// End To End scenario to Create,Get an entitlement group.
describe('B2B Entitlement Groups', () => {

    let createdGroupId, createdGroupName, updatedGroupId, updatedGroupName;
    // Add new Group
    it('Should Add New Group', async () => {
        const payload = {
            name: `Group-${randomString}`,
            description: "Created for Testing propose",
            channels: [
                {
                    name: "MTV"
                }
            ],
            contentCategories: [
                "DSR"
            ],
            partnerId: "bc637b23-0d84-4eb7-ae62-d27f154e037d",
            partnerName: "Nbras Test999"
        }
        try {
            const res = await request.post('/osnb2b/api/v1/entitlement-groups').set('Ocp-Apim-Subscription-Key', SubscriptionKey).send(payload);
            // Assert the response status
            expect(res.status).to.eq(201);
            // Assert the response body
            // expect(res.body).to.deep.equal(payload);  will not work because we are not sending id
            expect(res.body.name).to.eq(payload.name);
            // Get the created ID for next verification
            createdGroupId = res.body.id;
            createdGroupName = res.body.name;
            // Print created Partner ID/Name:
            console.log("Created Group ID:", res.body.id);
            console.log("Created Group Name:", res.body.name);

            // Get the Data to vrify that Added successfully to DB:
            const response = await request.get(`/osnb2b/api/v1/entitlement-groups/${createdGroupId}`).set('Ocp-Apim-Subscription-Key', SubscriptionKey);
            // Assert the response status
            expect(response.status).to.eq(200);
            expect(res.body.id).to.eq(createdGroupId);
            expect(res.body.name).to.eq(createdGroupName);

            console.log("Returned Group ID:", res.body.id);
            console.log("Returned Group Name:", res.body.name);

        } catch (err) {
            throw new Error(err);
        }
    });

    // Update a Group
    it('Should Update a Group', async () => {
        const payload = {
            id: `${createdGroupId}`,
            name: `Group-${updatedRandomString}`,
            description: "Created for Testing propose",
            channels: [
                {
                    name: "MTV"
                }
            ],
            contentCategories: [
                "DMV"
            ],
            partnerId: "bc637b23-0d84-4eb7-ae62-d27f154e037d",
            partnerName: "Nbras Test999"
        }
        try {
            const res = await request.put('/osnb2b/api/v1/entitlement-groups').set('Ocp-Apim-Subscription-Key', SubscriptionKey).send(payload);
            // Assert the response status
            expect(res.status).to.eq(200);
            // Assert the response body
            expect(res.body).to.have.property('id', createdGroupId); // Verify the updated Group ID
            expect(res.body).to.have.property('name', payload.name); // Verify the updated Name
            expect(res.name).to.not.eq(createdGroupName);

            updatedGroupId = res.body.id;
            updatedGroupName = res.body.name;
            // Print created Group ID/Name:
            console.log("Updated Group ID:", res.body.id);
            console.log("Updated Group Name:", res.body.name);


            // Get the Data to vrify that updated successfully to DB:
            const response = await request.get(`/osnb2b/api/v1/entitlement-groups/${createdGroupId}`).set('Ocp-Apim-Subscription-Key', SubscriptionKey);
            // Assert the response status
            expect(response.status).to.eq(200);
            expect(res.body.id).to.eq(createdGroupId);
            expect(res.body.name).to.eq(updatedGroupName);

            console.log("Returned Group ID After Update:", res.body.id);
            console.log("Returned Group Name After Update:", res.body.name);

        } catch (err) {
            throw new Error(err);
        }
    });

    // Delete the group that have been added :)

    it('Should Delete the Group', async () => {
        const res = await request2.delete(`/api/v1/entitlement-groups/${updatedGroupId}`).set('Ocp-Apim-Subscription-Key', SubscriptionKey);
        // Assert the response status
        expect(res.status).to.eq(200);
        expect(res.body).to.eq(true);

        // Get All Groups to Check That the inserted One is Got Deleted
        const response = await request.get("/osnb2b/api/v1/entitlement-groups").set('Ocp-Apim-Subscription-Key', SubscriptionKey);
        // Assert the response status
        expect(response.status).to.eq(200);
        // The some() method is used to check if any group in the response data has the specified ID.
        const isIdPresent = response.body.some(group => group.id === updatedGroupId);
        // Assert that the ID is not present
        expect(isIdPresent).to.be.false;

    });

});