import supertest from 'supertest';
import { expect } from 'chai';

const request = supertest('https://gorest.co.in/public/v2/');
const token = '63683020687e43df47a90f5fc7f34ed58325c7c54e834de84c36e28613693c60';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Get() Test
describe('Get Users Data', () => {
    before(async () => {
        await console.info('Welcome To API Testing :)')
    });
    it('Get /users', (done) => {
        request.get(`users?access-token=${token}`)
            .then(res => {
                console.log(res.statusCode);
                expect(res.body).to.be.empty; // Adjusted to check res.body directly
                done();
            })
            .catch(err => {
                console.error(err);
                done(err);
            });
    });

    it('Get Specific User by Filters', () => {

        return request.get(`users/7020318?access-token=${token}`).then(res => {
            
            let response = res.body.email;
            expect(response).to.be.eq('jain_sen_bhudev@bogisich.example');

        });
        
    });

    it('Get Data by Filters', () => {

        return request.get(`users?access-token=${token}&gender=male`).then(res => {
            
            res.body.forEach((data) => {
                expect(data.gender).to.be.eq("female");
            });

        });
        
    });

    it.only('Get users using async', async() => {
        
        try {
            const res = await request.get(`users?access-token=${token}`);
            console.log(res.body);
            expect(res.body).to.not.be.empty;
        } catch (err) {
            console.error(err);
            throw err;
        };
    });
});

// Post Test
xdescribe('Post User Data', () => {
    it('Add new user', () => {
        
        const newuser = {
            "name": "Mr.Tom",
            "email": `tom${Math.floor(Math.random() * 999)}@test.ne`,
            "gender": "male",
            "status": "active"
        }

        return request.post('users').set('Authorization',`Bearer ${token}`).send(newuser).then((res) => {

            console.log(res.body);
            // Assign a different value to fail the test
            newuser.email = "tom444@test.ne";

            expect(res.body.email).to.eq(newuser.email);

            //  we can verify the full newuser obj
            // expect(res.body).to.deep.include(newuser);
        });
    });
});
