import { add, subtract, multiply, scale } from "#src/vector.js";

describe("vectorutil", () => {
    test("adds", () => {
        expect(add([0, 2], [3, 2])).toEqual([3, 4]);
    });
    test("subtracts", () => {
        expect(subtract([0, 2], [3, 2])).toEqual([-3, 0]);
    });
    test("multiplies", () => {
        expect(multiply([0, 2], [0, 3])).toEqual([0, 6]);
    });
    test("scalar", () => {
        expect(scale([0, 2], 3)).toEqual([0, 6]);
    });
});
