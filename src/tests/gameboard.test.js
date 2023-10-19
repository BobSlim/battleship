
import { Gameboard, Gamecell } from "#src/gameboard";
import { Fleet, Ship } from "../ship";

describe("symbol", () => {
    test("empty => .", () => {
        const cell = Gamecell()
        expect(cell.symbol).toBe(".")
    })
    test("hit => x", () => {
        const cell = Gamecell()
        cell.hit()
        expect(cell.symbol).toBe("x")
    })
    test("patrol boat => P", () => {
        const cell = Gamecell()
        cell.shipRef = {name: "Destroyer"}
        expect(cell.symbol).toBe("D")
    })
    test("prefers hit over object", () => {
        const cell = Gamecell()
        cell.hit()
        cell.shipRef = {name: "Destroyer"}
        expect(cell.symbol).toBe("x")
    })
})

describe("gameboard", () => {
    let board
    let ships = [Ship("Destroyer", 2), Ship("Patrol Boat")]
    let [ship1, ship2] = ships
    let fleet
    beforeEach(() => {
        fleet = Fleet()
        fleet.place(ship1, [0,0], [0,1])
        fleet.place(ship2, [1,0], [0,1])
        board = Gameboard(fleet)
    })
    test("getCell", () => {
        expect(board.getCell([-1, -1]) instanceof Error).toBe(true)
    })
    test("miss shot", () => {
        expect(board.receiveAttack([2,0]).hit).toBe(false)
    })
    test("hit shot", () => {
        expect(board.receiveAttack([0,0]).hit).toBe(true)
    });
    test("sink ship", () => {
        board.receiveAttack([0,0])
        expect(board.receiveAttack([0,1]).sunk).toBe(ship1.name)
    })
    test("all ships sunk", () => {
        board.receiveAttack([0,0])
        expect(board.receiveAttack([0,1]).allSunk).toBe(false)
        expect(board.receiveAttack([1,0]).allSunk).toBe(true)
    })
    test("with one hit", () => {
        board.receiveAttack([0,0])
        expect(board.print()).toBe(
        `x D . . . . . . . .
P . . . . . . . . .
. . . . . . . . . .
. . . . . . . . . .
. . . . . . . . . .
. . . . . . . . . .
. . . . . . . . . .
. . . . . . . . . .
. . . . . . . . . .
. . . . . . . . . .`)
    })
    test("randomly fires at 50 squares", () => {
        for (let index = 0; index < 50; index++) {
            board.receiveAttack(board.getRandomShot());
        }
        expect(board.getHitCount()).toBe(50)
    })
    test("randomly fires at 100 squares", () => {
        for (let index = 0; index < 100; index++) {
            board.receiveAttack(board.getRandomShot());
        }
        expect(board.getHitCount()).toBe(100)
    })

})