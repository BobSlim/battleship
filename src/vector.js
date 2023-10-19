export const add = (vector1, vector2) => {
    return vector1.map((x, i) => x + vector2[i])
}

export const subtract = (vector1, vector2) => {
    return vector1.map((x, i) => x - vector2[i])
}

export const multiply = (vector1, vector2) => {
    return vector1.map((x, i) => x * vector2[i])
}

export const scale = (vector1, scalar) => {
    return vector1.map(x => x * scalar)
}

export const randomInt = (max) => {
    return Math.floor(Math.random()*max)
}

export const chooseRandomElement = (array) => array[randomInt(array.length -1)]

export const isPointValid = (coords, boardSize) =>
    !coords.some(x => x < 0 | x > boardSize - 1)

export const getRandomCoords = (boardSize) => [randomInt(boardSize), randomInt(boardSize)]

export const getRandomDirection = () => 
    chooseRandomElement([[1,0], [0,1], [-1,0], [0,-1]])
