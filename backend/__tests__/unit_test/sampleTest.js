const { TestWatcher } = require("jest")

describe("Getting started with JEST", () => {
    test("A sample test", ()=>{
        expect(123).toEqual(123);
    })
});