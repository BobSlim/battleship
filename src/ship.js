import { add, isPointValid, scale, getRandomCoords, getRandomDirection } from "./vector";

export const defaultShips = () => [
    Ship("Carrier", 5),
    Ship("Battleship", 4),
    Ship("Cruiser", 3),
    Ship("Submarine", 3),
    Ship("Destroyer", 2),
]

export const Ship = (name = "", length = 1) => {
    let hitCount = 0;
    const isSunk = () => hitCount >= length;
    const hit = () => {
        hitCount++;
        return isSunk() ? name : "";
    };

    return {
        name,
        length,
        isSunk,
        hit,
    };
};

export const shipCoords = (length, location, direction) =>
    (!location | !direction) ? 
        [] : 
        [...Array(length).keys()].map(x => add(location, scale(direction, x)))

export const getKeys = array => array.map(([key, value]) => key)
const getValues = array => array.map(([key, value]) => value)
const excludeValue = (array, excludedValue) => array.filter(([key, value]) => value != excludedValue)
export const isOccupied = (map, coord) => new Set(getKeys(map).map(x => x.toString())).has(coord.toString())

export const Fleet = (boardSize = 10) => {
    let shipCoordinates = []
    const fleetIsOccupied = (coord) => isOccupied(shipCoordinates, coord)

    const place = (ship, location, direction) => {
        const locations = shipCoords(ship.length, location, direction)
        if(invalidPlace(locations)){return false}
        shipCoordinates = shipCoordinates.concat(locations.map(x => [x, ship]))
        return shipCoordinates
    }

    const invalidPlace = (locations) => locations.some(coord => fleetIsOccupied(coord) | !isPointValid(coord, boardSize))

    const remove = (ship) => {
        shipCoordinates = excludeValue(shipCoordinates, ship)
        return shipCoordinates
    }

    const generateRandomPlacement = () => ({
        coords: getRandomCoords(boardSize), 
        direction: getRandomDirection(),
    })

    const placeShips = (ships, positionGenerator = generateRandomPlacement) => {
        ships.forEach(ship => {
            let success = false
            while (!success) {
                const gen = positionGenerator()
                success = !!place(ship, gen.coords, gen.direction);
            }
        })
    };
    const ships = () => 
        [...new Set(getValues(shipCoordinates))]

    const isAllSunk = () => 
        ships().every(x => x.isSunk())

    return {
        get shipCoordinates(){return shipCoordinates},
        ships,
        isAllSunk,
        place,
        placeShips,
        remove,
    }
}