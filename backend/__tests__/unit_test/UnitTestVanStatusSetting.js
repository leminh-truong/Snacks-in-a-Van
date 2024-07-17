const Van = require("../../models/vanModel");

const vanController = require("../../controllers/vanController");

const mongoose = require("mongoose");

describe("Unit testing: Van operator sets status of their van ", () => {

    const req = {
        user : {_id: '6076348132841a9959f91d8a'},
        body: {
        name: 'Tasty Trailer',
        password: 'hi123456',
        checkOustanding: '0',
        xpos: "1.0", 
        ypos: "2.0", 
        locationString: "HCM City"
        }
    };

    const res = {
        send: jest.fn()
    };

    beforeAll(() => {
        Van.findByIdAndUpdate = jest.fn().mockImplementation(() => {
            return( {
            _id: "6076348132841a9959f91d8a",
            name: "Tasty Trailer",
            isOpen: "false"})
        });
    })

    test("Test 2A: Set status of a van to open", () => {
        async () => {
            vanController.openVan(req, res)
            .then(res => {
            console.log(res);
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res).toContain({
                name: "Tasty Trailer",
                isOpen: "true"}
            );
            })
        }
    })

    test("Test 2B: Set status of a van to closed", () => {
        async () => {
            vanController.closeVan(req, res)
            .then(res => {
            console.log(res);
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res).toContain({
                name: "Tasty Trailer",
                isOpen: "false"}
            );
            })
        }
    })
})