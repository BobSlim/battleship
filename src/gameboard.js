import { Ship, defaultShips, shipCoords } from "./ship"
import { add, chooseRandomElement, randomInt, scale, directionArray } from "./vector"

//a vector is an array of [x, y].

export const Gamecell = (coords = [0,0]) => {
    let shipRef = null;
    let isHit = false;
    const hit = () => {
        isHit = true;
        const output = {hit: false, sunk: ""}
        if(shipRef){
            output.hit = true
            output.sunk = shipRef.hit()
            }
        return output
        }

    const symbol = () => 
        isHit ? "x" :
        shipRef ? shipRef.name.slice(0, 1) :
        ".";

    return {
        coords,
        get shipRef() { return shipRef; },
        set shipRef(newShip) { shipRef = newShip; },
        get isHit() { return isHit; },
        get symbol() { return symbol(); },
        hit,
    };
};

export const initializeBoard = (width, height) => {
    const board = []
    for (let x = 0; x < width; x++) {
        let row = []
        for (let y = 0; y < height; y++) {
            row.push(Gamecell([x, y]))
        }
        board.push(row)
    }
    return board
}

export const Gameboard = (fleet, board = initializeBoard(10, 10), ) => {
    const data = () => board.map(cell => cell.data())
    const getCell = (coords) => {
        if(coords.some(x => x < 0 | x > board.length - 1)){
            return new Error("out of bounds")
        }
        const [x, y] = coords
        return board[x][y]
    }

    fleet.shipCoordinates.forEach(([coord, ship]) => getCell(coord).shipRef = ship)

    const getCells = () => board.flat()
    const getHitCount = () => getCells().filter(x => x.isHit).length
    const getOpenCells = () => getCells().filter(x => !x.isHit)
    const getRandomShot = () => chooseRandomElement(getOpenCells()).coords
    const getRandomCoords = () => chooseRandomElement(getCells()).coords
    const getBoard = () => board

    const print = () => board.map(x => x.map(y => y.symbol).join(" ")).join("\n")
    const receiveAttack = (coords) => {
        const cell = getCell(coords)
        if(cell.isHit){throw new Error("cell already hit")}
        const hitReport = cell.hit()
        hitReport.allSunk = fleet.isAllSunk()
        hitReport.coords = coords
        return hitReport
    }

    return { 
        receiveAttack, 
        getCell,
        getCells,
        getHitCount,
        getRandomShot,
        getRandomCoords,
        print,
        getBoard,
        data,
    }
}