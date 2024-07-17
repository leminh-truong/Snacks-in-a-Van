require('dotenv').config();
const testShutdown = require("../../controllers/dbController");

// Add 'supertest' to allow tests to send HTTP requests
const request = require('supertest');

// Add the exported app.js
const server = require('../../app');

// Test suit for testing functionality: Van operator sets the status of their van
describe("Integration test: Van operator sets status of their van", ()=> {
    // Create an agent to represent the van operator
    let agent = request.agent(server);
    //console.log(agent);

    

    // Store token returned by the app
    let token = null;
    jest.setTimeout(100000); 
    beforeAll(() => agent
        //Send a POST request to login
        .post(`/api/van/login`)
        // Set the content type. Without this express will not accept the request
        .set('Content-Type', 'application/json;charset=UTF-8')
        // Send the van name and password
        .send({
            name: 'Tasty Trailer',
            password: 'hi123456'
        })
        .then((res)=>{
            token = res.text.replace('\"', '');
            token = token.replace('\"', '');
        })
    );

    test("Test 1A: Set status of a van to open", () => {
        return agent.post('/api/van/open').set('Authorization', `Bearer ${token}`)
        .send({xpos: "1.0", ypos: "2.0", locationString: "HCM City"})
        .then((response) => {
            expect(response.statusCode).toBe(200);
        })
    });

    test("Test 1B: Set status of a van to closed", () => {
        return agent.post('/api/van/close').set('Authorization', `Bearer ${token}`).then((response) => {
            expect(response.statusCode).toBe(200);
        })
    });

    afterAll(() => {
        testShutdown();
        server.close();
    })
})