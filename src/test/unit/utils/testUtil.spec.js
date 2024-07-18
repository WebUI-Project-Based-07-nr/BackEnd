const foo = require("~/utils/testUtil")

describe("coverage test", () => {
    test("testUtil", () => {
        const fooRes = foo()

        expect(fooRes).toBeTruthy()
    })
})