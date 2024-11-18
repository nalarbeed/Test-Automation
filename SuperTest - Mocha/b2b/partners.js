import supertest from 'supertest';
import { expect } from 'chai';

const request = supertest('https://api.iddev.osn.com');
const SubscriptionKey = '67900bcc6a624f228cf8dea0ea2e5198';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// End To End scenario to Create,Get, and update partner.
describe('B2B Partners', () => {

    let createdPartnerId;
    let createdPartnerName;
    it('should create a new partner', async () => {
        const payload = {
            name: `Nbras Test${Math.floor(Math.random() * 999)}`,
            sourceType: "IP",
            ipBatId: `${Math.floor(1000 + Math.random() * 9000)}`,
            satelliteBatId: `${Math.floor(1000 + Math.random() * 9000)}`,
            phone: "00971508889999",
            country: "SYR"
        };

        try {
            const res = await request.post('/osnb2b/api/v1/partners').set('Ocp-Apim-Subscription-Key', SubscriptionKey).send(payload);
            // Assert the response status
            expect(res.status).to.equal(201);
            // Assert the response body
            expect(res.body).to.have.property('id');
            // Get the created ID for next verification
            createdPartnerId = res.body.id;
            createdPartnerName = res.body.name;
            // Print created Partner ID/Name:
            console.log("Created Partner ID:", res.body.id);
            console.log("Created Partner Name:", res.body.name);

        } catch (err) {
            throw new Error(err);
        }
    });

    it('should return the created partner', async () => {
        const response = await request.get(`/osnb2b/api/v1/partners/${createdPartnerId}`).set('Ocp-Apim-Subscription-Key', SubscriptionKey);
        // Assert the response status
        expect(response.status).to.equal(200);
        // Verify the retrieved partner ID 
        expect(response.body.id).to.equal(createdPartnerId);
        // print the returned Partner ID/Name:
        console.log("Returned Partner ID:", response.body.id);
        console.log("Returned Partner Name:", response.body.name);
    });

    it('should update existing partner', async () => {
        const payload = {
            id: `${createdPartnerId}`,
            name: `${createdPartnerName}`,
            sourceType: "IPTV",
            ipBatId: `${Math.floor(1000 + Math.random() * 9000)}`,
            satelliteBatId: `${Math.floor(1000 + Math.random() * 9000)}`,
            phone: "00971508889955",
            country: "SYR"
        };
        try {
            const res = await request.put('/osnb2b/api/v1/partners').set('Ocp-Apim-Subscription-Key', SubscriptionKey).send(payload);
            // Assert the response status
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('id', createdPartnerId); // Verify the updated partner ID
            expect(res.body).to.have.property('sourceType', payload.sourceType); // Verify the updated name
            
        } catch (err) {
            throw new Error(err);
        }
    });
});
