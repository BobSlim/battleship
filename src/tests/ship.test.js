import { Ship } from "#src/ship";
import { Fleet, shipCoords, isOccupied, getKeys } from "../ship";


const sampleMap = [["a", "i"],["b", "j"]]
describe("utils", () => {
    test("getkeys", () => {
        expect(getKeys(sampleMap)).toEqual["a", "b"]
    })
    test("overlaps", () => {
        expect(isOccupied(sampleMap, ["c"])).toBe(false)
        expect(isOccupied(sampleMap, ["a"])).toBe(true)
    })
})

describe("utils", () => {
    test("shipCoords", () => {
        expect(shipCoords(2, [0,0], [1,0])).toEqual([[0,0],[1,0]]);
    });
});

describe("ship", () => {
    test("hit and sunk", () => {
        const ship = Ship("Destroyer");
        expect(ship.hit()).toBe(ship.name);
    });
    test("hit and not sunk", () => {
        const ship = Ship("Destroyer", 2);
        expect(ship.hit()).toBe("");
        expect(ship.hit()).toBe(ship.name);
    });

    test("correct length", () => {
        const ship = Ship("Destroyer", 2)
        expect(ship.length).toBe(2)
    });
});

describe("fleet", () => {
    let ships = [Ship("Destroyer"), Ship("Patrol Boat")]
    let [ship1, ship2] = ships
    let fleet
    beforeEach(() => {
        fleet = Fleet()
    })
    test("shipCoords", () => {
        expect(shipCoords(1, [0,0], [1,0])).toEqual([[0,0]])
    })
    test("places ship", () => {
        expect(fleet.place(ship1, [0,0], [0,1])).toEqual([[[0,0], ship1]])
    });
    test("attempts to overlap ship", () => {
        fleet.place(ship1, [0,0], [0,1])
        expect(fleet.place(ship2, [0,0], [0,1])).toEqual(false)
        expect(fleet.shipCoordinates).toEqual([[[0,0], ship1]])
    });
    test("removes ship", () => {
        fleet.place(ship1, [0,0], [0,1])
        expect(fleet.remove(ship1)).toEqual([])
    });
    test("returns allSunk correctly", () => {
        fleet.place(ship1, [0,0], [0,1])
        fleet.place(ship2, [1,0], [0,1])
        expect(fleet.isAllSunk()).toBe(false)
        ship1.hit()
        ship2.hit()
        expect(fleet.isAllSunk()).toBe(true)
    });
    test("places all ships", () => {
        const mockGenerator = jest.fn();
        mockGenerator
            .mockReturnValueOnce({coords: [0,0], direction: [0,1]})
            .mockReturnValueOnce({coords: [0,0], direction: [0,1]})
            .mockReturnValueOnce({coords: [1,0], direction: [0,1]})
        fleet.placeShips(ships, mockGenerator)
        expect(mockGenerator.mock.calls.length).toBe(3)
        expect(fleet.shipCoordinates.length).toBe(ships.length)
        expect(fleet.ships()).toEqual(ships)
    })
});

