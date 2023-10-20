/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Game: () => (/* binding */ Game),
/* harmony export */   Renderer: () => (/* binding */ Renderer)
/* harmony export */ });
const Game = (playerBoard, computerBoard) => {
    const step = (coords) => {
        const computerEvent = computerBoard.receiveAttack(coords)
        computerEvent.playerName = "You"
        const playerEvent = playerBoard.receiveAttack(playerBoard.getRandomShot())
        playerEvent.playerName = "Computer"
        return [computerEvent, playerEvent]
    }

    return {
        step,
        player: playerBoard,
        computer: computerBoard,
    }
}

const Renderer = (frame, doc, fnClick) => {
    let playerBoardRef
    let computerBoardRef
    let logRef
    const renderCell = (cell, isPlayer) => {
        const cellDOM = doc.createElement("button")
        cellDOM.classList.add("gamecell")
        if(cell.isHit){
            cellDOM.classList.add(cell.shipRef ? "gamecell--hit" : "gamecell--miss")
        }
        if(isPlayer){
            cellDOM.innerText = cell.shipRef ? cell.symbol : ""
        }
        if(!isPlayer && !cell.isHit){
            cellDOM.addEventListener("click", (event) => {fnClick(cell.coords)})
        }
        return cellDOM
    }
    const renderBoard = (board, isPlayer = false) => {
        const boardDOM = doc.createElement("div")
        boardDOM.classList.add("gameboard")

        const cells = board.getCells().map( x => renderCell(x, isPlayer))
        for(let e of cells){
            boardDOM.appendChild(e)
        }
        return boardDOM
    }
    const init = (game) => {
        const playerBoard = renderBoard(game.player, true)
        const computerBoard = renderBoard(game.computer)
        logRef = doc.createElement("div")
        logRef.classList.add("log")
        playerBoardRef = playerBoard
        computerBoardRef = computerBoard
        frame.appendChild(playerBoard)
        frame.appendChild(logRef)
        frame.appendChild(computerBoard)

    }
    const render = (game) => {
        const playerBoard = renderBoard(game.player, true)
        playerBoardRef.replaceWith(playerBoard)
        playerBoardRef = playerBoard
        const computerBoard = renderBoard(game.computer)
        computerBoardRef.replaceWith(computerBoard)
        computerBoardRef = computerBoard
    }
    const log = (message) => {
        const newMessage = doc.createElement("p")
        newMessage.innerText = message
        logRef.prepend(newMessage)
    }
    return {render, init, log}
}

/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Gameboard: () => (/* binding */ Gameboard),
/* harmony export */   Gamecell: () => (/* binding */ Gamecell),
/* harmony export */   initializeBoard: () => (/* binding */ initializeBoard)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/ship.js");
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vector */ "./src/vector.js");



//a vector is an array of [x, y].

const Gamecell = (coords = [0,0]) => {
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

const initializeBoard = (width, height) => {
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

const Gameboard = (fleet, board = initializeBoard(10, 10), ) => {
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
    const getRandomShot = () => (0,_vector__WEBPACK_IMPORTED_MODULE_1__.chooseRandomElement)(getOpenCells()).coords
    const getRandomCoords = () => (0,_vector__WEBPACK_IMPORTED_MODULE_1__.chooseRandomElement)(getCells()).coords
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

/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Fleet: () => (/* binding */ Fleet),
/* harmony export */   Ship: () => (/* binding */ Ship),
/* harmony export */   defaultShips: () => (/* binding */ defaultShips),
/* harmony export */   getKeys: () => (/* binding */ getKeys),
/* harmony export */   isOccupied: () => (/* binding */ isOccupied),
/* harmony export */   shipCoords: () => (/* binding */ shipCoords)
/* harmony export */ });
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vector */ "./src/vector.js");


const defaultShips = () => [
    Ship("Carrier", 5),
    Ship("Battleship", 4),
    Ship("Cruiser", 3),
    Ship("Submarine", 3),
    Ship("Destroyer", 2),
]

const Ship = (name = "", length = 1) => {
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

const shipCoords = (length, location, direction) =>
    (!location | !direction) ? 
        [] : 
        [...Array(length).keys()].map(x => (0,_vector__WEBPACK_IMPORTED_MODULE_0__.add)(location, (0,_vector__WEBPACK_IMPORTED_MODULE_0__.scale)(direction, x)))

const getKeys = array => array.map(([key, value]) => key)
const getValues = array => array.map(([key, value]) => value)
const excludeValue = (array, excludedValue) => array.filter(([key, value]) => value != excludedValue)
const isOccupied = (map, coord) => new Set(getKeys(map).map(x => x.toString())).has(coord.toString())

const Fleet = (boardSize = 10) => {
    let shipCoordinates = []
    const fleetIsOccupied = (coord) => isOccupied(shipCoordinates, coord)

    const place = (ship, location, direction) => {
        const locations = shipCoords(ship.length, location, direction)
        if(invalidPlace(locations)){return false}
        shipCoordinates = shipCoordinates.concat(locations.map(x => [x, ship]))
        return shipCoordinates
    }

    const invalidPlace = (locations) => locations.some(coord => fleetIsOccupied(coord) | !(0,_vector__WEBPACK_IMPORTED_MODULE_0__.isPointValid)(coord, boardSize))

    const remove = (ship) => {
        shipCoordinates = excludeValue(shipCoordinates, ship)
        return shipCoordinates
    }

    const generateRandomPlacement = () => ({
        coords: (0,_vector__WEBPACK_IMPORTED_MODULE_0__.getRandomCoords)(boardSize), 
        direction: (0,_vector__WEBPACK_IMPORTED_MODULE_0__.getRandomDirection)(),
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

/***/ }),

/***/ "./src/vector.js":
/*!***********************!*\
  !*** ./src/vector.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   chooseRandomElement: () => (/* binding */ chooseRandomElement),
/* harmony export */   getRandomCoords: () => (/* binding */ getRandomCoords),
/* harmony export */   getRandomDirection: () => (/* binding */ getRandomDirection),
/* harmony export */   isPointValid: () => (/* binding */ isPointValid),
/* harmony export */   multiply: () => (/* binding */ multiply),
/* harmony export */   randomInt: () => (/* binding */ randomInt),
/* harmony export */   scale: () => (/* binding */ scale),
/* harmony export */   subtract: () => (/* binding */ subtract)
/* harmony export */ });
const add = (vector1, vector2) => {
    return vector1.map((x, i) => x + vector2[i])
}

const subtract = (vector1, vector2) => {
    return vector1.map((x, i) => x - vector2[i])
}

const multiply = (vector1, vector2) => {
    return vector1.map((x, i) => x * vector2[i])
}

const scale = (vector1, scalar) => {
    return vector1.map(x => x * scalar)
}

const randomInt = (max) => {
    return Math.floor(Math.random()*max)
}

const chooseRandomElement = (array) => array[randomInt(array.length -1)]

const isPointValid = (coords, boardSize) =>
    !coords.some(x => x < 0 | x > boardSize - 1)

const getRandomCoords = (boardSize) => [randomInt(boardSize), randomInt(boardSize)]

const getRandomDirection = () => 
    chooseRandomElement([[1,0], [0,1], [-1,0], [0,-1]])


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/game.js");
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ship */ "./src/ship.js");



const fleets = [(0,_ship__WEBPACK_IMPORTED_MODULE_2__.Fleet)(), (0,_ship__WEBPACK_IMPORTED_MODULE_2__.Fleet)()]
fleets.forEach(fleet => {
    fleet.placeShips((0,_ship__WEBPACK_IMPORTED_MODULE_2__.defaultShips)())
})
const game = (0,_game__WEBPACK_IMPORTED_MODULE_0__.Game)((0,_gameboard__WEBPACK_IMPORTED_MODULE_1__.Gameboard)(fleets[0]), (0,_gameboard__WEBPACK_IMPORTED_MODULE_1__.Gameboard)(fleets[1]))
const notifString = (event) => `${event.playerName} fired at ${event.coords} and ${event.hit ? "hit" : "missed"}. ${event.sunk ? `A ${event.sunk} was sunk.` : ""} ${event.allSunk ? `All ships are sunk. ${event.playerName} win. ` : ""}`
const fnClick = (coords) => {
    const events = game.step(coords)
    renderer.log(notifString(events[0]) + notifString(events[1]))
    renderer.render(game)
}
const renderer = (0,_game__WEBPACK_IMPORTED_MODULE_0__.Renderer)(document.getElementById("main"), document, fnClick)
renderer.init(game)
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBELHFCQUFxQjtBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEV1RDtBQUM4Qjs7QUFFckY7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3QixpQkFBaUI7QUFDekMsK0JBQStCLG9CQUFvQjtBQUNuRCxzQkFBc0IsZUFBZTtBQUNyQyx1QkFBdUIsa0JBQWtCO0FBQ3pDO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0Esb0JBQW9CLFdBQVc7QUFDL0I7QUFDQSx3QkFBd0IsWUFBWTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyw0REFBbUI7QUFDbkQsa0NBQWtDLDREQUFtQjtBQUNyRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckZ5Rjs7QUFFbEY7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0EsMkNBQTJDLDRDQUFHLFdBQVcsOENBQUs7O0FBRXZEO0FBQ1A7QUFDQTtBQUNPOztBQUVBO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTs7QUFFQSwwRkFBMEYscURBQVk7O0FBRXRHO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCLHdEQUFlO0FBQy9CLG1CQUFtQiwyREFBa0I7QUFDckMsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDhCQUE4Qix1QkFBdUI7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRk87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTzs7QUFFQTtBQUNQOztBQUVPOztBQUVBO0FBQ1A7Ozs7Ozs7VUM1QkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDTnVDO0FBQ0E7QUFDSztBQUM1QyxnQkFBZ0IsNENBQUssSUFBSSw0Q0FBSztBQUM5QjtBQUNBLHFCQUFxQixtREFBWTtBQUNqQyxDQUFDO0FBQ0QsYUFBYSwyQ0FBSSxDQUFDLHFEQUFTLGFBQWEscURBQVM7QUFDakQsa0NBQWtDLGtCQUFrQixXQUFXLGNBQWMsTUFBTSw2QkFBNkIsSUFBSSxrQkFBa0IsWUFBWSxpQkFBaUIsRUFBRSx1Q0FBdUMsa0JBQWtCLFlBQVk7QUFDMU87QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiwrQ0FBUTtBQUN6QixtQiIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9nYW1lLmpzIiwid2VicGFjazovLy8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZlY3Rvci5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IEdhbWUgPSAocGxheWVyQm9hcmQsIGNvbXB1dGVyQm9hcmQpID0+IHtcbiAgICBjb25zdCBzdGVwID0gKGNvb3JkcykgPT4ge1xuICAgICAgICBjb25zdCBjb21wdXRlckV2ZW50ID0gY29tcHV0ZXJCb2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkcylcbiAgICAgICAgY29tcHV0ZXJFdmVudC5wbGF5ZXJOYW1lID0gXCJZb3VcIlxuICAgICAgICBjb25zdCBwbGF5ZXJFdmVudCA9IHBsYXllckJvYXJkLnJlY2VpdmVBdHRhY2socGxheWVyQm9hcmQuZ2V0UmFuZG9tU2hvdCgpKVxuICAgICAgICBwbGF5ZXJFdmVudC5wbGF5ZXJOYW1lID0gXCJDb21wdXRlclwiXG4gICAgICAgIHJldHVybiBbY29tcHV0ZXJFdmVudCwgcGxheWVyRXZlbnRdXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RlcCxcbiAgICAgICAgcGxheWVyOiBwbGF5ZXJCb2FyZCxcbiAgICAgICAgY29tcHV0ZXI6IGNvbXB1dGVyQm9hcmQsXG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgUmVuZGVyZXIgPSAoZnJhbWUsIGRvYywgZm5DbGljaykgPT4ge1xuICAgIGxldCBwbGF5ZXJCb2FyZFJlZlxuICAgIGxldCBjb21wdXRlckJvYXJkUmVmXG4gICAgbGV0IGxvZ1JlZlxuICAgIGNvbnN0IHJlbmRlckNlbGwgPSAoY2VsbCwgaXNQbGF5ZXIpID0+IHtcbiAgICAgICAgY29uc3QgY2VsbERPTSA9IGRvYy5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpXG4gICAgICAgIGNlbGxET00uY2xhc3NMaXN0LmFkZChcImdhbWVjZWxsXCIpXG4gICAgICAgIGlmKGNlbGwuaXNIaXQpe1xuICAgICAgICAgICAgY2VsbERPTS5jbGFzc0xpc3QuYWRkKGNlbGwuc2hpcFJlZiA/IFwiZ2FtZWNlbGwtLWhpdFwiIDogXCJnYW1lY2VsbC0tbWlzc1wiKVxuICAgICAgICB9XG4gICAgICAgIGlmKGlzUGxheWVyKXtcbiAgICAgICAgICAgIGNlbGxET00uaW5uZXJUZXh0ID0gY2VsbC5zaGlwUmVmID8gY2VsbC5zeW1ib2wgOiBcIlwiXG4gICAgICAgIH1cbiAgICAgICAgaWYoIWlzUGxheWVyICYmICFjZWxsLmlzSGl0KXtcbiAgICAgICAgICAgIGNlbGxET00uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge2ZuQ2xpY2soY2VsbC5jb29yZHMpfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2VsbERPTVxuICAgIH1cbiAgICBjb25zdCByZW5kZXJCb2FyZCA9IChib2FyZCwgaXNQbGF5ZXIgPSBmYWxzZSkgPT4ge1xuICAgICAgICBjb25zdCBib2FyZERPTSA9IGRvYy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgICAgIGJvYXJkRE9NLmNsYXNzTGlzdC5hZGQoXCJnYW1lYm9hcmRcIilcblxuICAgICAgICBjb25zdCBjZWxscyA9IGJvYXJkLmdldENlbGxzKCkubWFwKCB4ID0+IHJlbmRlckNlbGwoeCwgaXNQbGF5ZXIpKVxuICAgICAgICBmb3IobGV0IGUgb2YgY2VsbHMpe1xuICAgICAgICAgICAgYm9hcmRET00uYXBwZW5kQ2hpbGQoZSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYm9hcmRET01cbiAgICB9XG4gICAgY29uc3QgaW5pdCA9IChnYW1lKSA9PiB7XG4gICAgICAgIGNvbnN0IHBsYXllckJvYXJkID0gcmVuZGVyQm9hcmQoZ2FtZS5wbGF5ZXIsIHRydWUpXG4gICAgICAgIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSByZW5kZXJCb2FyZChnYW1lLmNvbXB1dGVyKVxuICAgICAgICBsb2dSZWYgPSBkb2MuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgICBsb2dSZWYuY2xhc3NMaXN0LmFkZChcImxvZ1wiKVxuICAgICAgICBwbGF5ZXJCb2FyZFJlZiA9IHBsYXllckJvYXJkXG4gICAgICAgIGNvbXB1dGVyQm9hcmRSZWYgPSBjb21wdXRlckJvYXJkXG4gICAgICAgIGZyYW1lLmFwcGVuZENoaWxkKHBsYXllckJvYXJkKVxuICAgICAgICBmcmFtZS5hcHBlbmRDaGlsZChsb2dSZWYpXG4gICAgICAgIGZyYW1lLmFwcGVuZENoaWxkKGNvbXB1dGVyQm9hcmQpXG5cbiAgICB9XG4gICAgY29uc3QgcmVuZGVyID0gKGdhbWUpID0+IHtcbiAgICAgICAgY29uc3QgcGxheWVyQm9hcmQgPSByZW5kZXJCb2FyZChnYW1lLnBsYXllciwgdHJ1ZSlcbiAgICAgICAgcGxheWVyQm9hcmRSZWYucmVwbGFjZVdpdGgocGxheWVyQm9hcmQpXG4gICAgICAgIHBsYXllckJvYXJkUmVmID0gcGxheWVyQm9hcmRcbiAgICAgICAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IHJlbmRlckJvYXJkKGdhbWUuY29tcHV0ZXIpXG4gICAgICAgIGNvbXB1dGVyQm9hcmRSZWYucmVwbGFjZVdpdGgoY29tcHV0ZXJCb2FyZClcbiAgICAgICAgY29tcHV0ZXJCb2FyZFJlZiA9IGNvbXB1dGVyQm9hcmRcbiAgICB9XG4gICAgY29uc3QgbG9nID0gKG1lc3NhZ2UpID0+IHtcbiAgICAgICAgY29uc3QgbmV3TWVzc2FnZSA9IGRvYy5jcmVhdGVFbGVtZW50KFwicFwiKVxuICAgICAgICBuZXdNZXNzYWdlLmlubmVyVGV4dCA9IG1lc3NhZ2VcbiAgICAgICAgbG9nUmVmLnByZXBlbmQobmV3TWVzc2FnZSlcbiAgICB9XG4gICAgcmV0dXJuIHtyZW5kZXIsIGluaXQsIGxvZ31cbn0iLCJpbXBvcnQgeyBTaGlwLCBkZWZhdWx0U2hpcHMsIHNoaXBDb29yZHMgfSBmcm9tIFwiLi9zaGlwXCJcbmltcG9ydCB7IGFkZCwgY2hvb3NlUmFuZG9tRWxlbWVudCwgcmFuZG9tSW50LCBzY2FsZSwgZGlyZWN0aW9uQXJyYXkgfSBmcm9tIFwiLi92ZWN0b3JcIlxuXG4vL2EgdmVjdG9yIGlzIGFuIGFycmF5IG9mIFt4LCB5XS5cblxuZXhwb3J0IGNvbnN0IEdhbWVjZWxsID0gKGNvb3JkcyA9IFswLDBdKSA9PiB7XG4gICAgbGV0IHNoaXBSZWYgPSBudWxsO1xuICAgIGxldCBpc0hpdCA9IGZhbHNlO1xuICAgIGNvbnN0IGhpdCA9ICgpID0+IHtcbiAgICAgICAgaXNIaXQgPSB0cnVlO1xuICAgICAgICBjb25zdCBvdXRwdXQgPSB7aGl0OiBmYWxzZSwgc3VuazogXCJcIn1cbiAgICAgICAgaWYoc2hpcFJlZil7XG4gICAgICAgICAgICBvdXRwdXQuaGl0ID0gdHJ1ZVxuICAgICAgICAgICAgb3V0cHV0LnN1bmsgPSBzaGlwUmVmLmhpdCgpXG4gICAgICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXRcbiAgICAgICAgfVxuXG4gICAgY29uc3Qgc3ltYm9sID0gKCkgPT4gXG4gICAgICAgIGlzSGl0ID8gXCJ4XCIgOlxuICAgICAgICBzaGlwUmVmID8gc2hpcFJlZi5uYW1lLnNsaWNlKDAsIDEpIDpcbiAgICAgICAgXCIuXCI7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb29yZHMsXG4gICAgICAgIGdldCBzaGlwUmVmKCkgeyByZXR1cm4gc2hpcFJlZjsgfSxcbiAgICAgICAgc2V0IHNoaXBSZWYobmV3U2hpcCkgeyBzaGlwUmVmID0gbmV3U2hpcDsgfSxcbiAgICAgICAgZ2V0IGlzSGl0KCkgeyByZXR1cm4gaXNIaXQ7IH0sXG4gICAgICAgIGdldCBzeW1ib2woKSB7IHJldHVybiBzeW1ib2woKTsgfSxcbiAgICAgICAgaGl0LFxuICAgIH07XG59O1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZUJvYXJkID0gKHdpZHRoLCBoZWlnaHQpID0+IHtcbiAgICBjb25zdCBib2FyZCA9IFtdXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCB3aWR0aDsgeCsrKSB7XG4gICAgICAgIGxldCByb3cgPSBbXVxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGhlaWdodDsgeSsrKSB7XG4gICAgICAgICAgICByb3cucHVzaChHYW1lY2VsbChbeCwgeV0pKVxuICAgICAgICB9XG4gICAgICAgIGJvYXJkLnB1c2gocm93KVxuICAgIH1cbiAgICByZXR1cm4gYm9hcmRcbn1cblxuZXhwb3J0IGNvbnN0IEdhbWVib2FyZCA9IChmbGVldCwgYm9hcmQgPSBpbml0aWFsaXplQm9hcmQoMTAsIDEwKSwgKSA9PiB7XG4gICAgY29uc3QgZGF0YSA9ICgpID0+IGJvYXJkLm1hcChjZWxsID0+IGNlbGwuZGF0YSgpKVxuICAgIGNvbnN0IGdldENlbGwgPSAoY29vcmRzKSA9PiB7XG4gICAgICAgIGlmKGNvb3Jkcy5zb21lKHggPT4geCA8IDAgfCB4ID4gYm9hcmQubGVuZ3RoIC0gMSkpe1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIm91dCBvZiBib3VuZHNcIilcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBbeCwgeV0gPSBjb29yZHNcbiAgICAgICAgcmV0dXJuIGJvYXJkW3hdW3ldXG4gICAgfVxuXG4gICAgZmxlZXQuc2hpcENvb3JkaW5hdGVzLmZvckVhY2goKFtjb29yZCwgc2hpcF0pID0+IGdldENlbGwoY29vcmQpLnNoaXBSZWYgPSBzaGlwKVxuXG4gICAgY29uc3QgZ2V0Q2VsbHMgPSAoKSA9PiBib2FyZC5mbGF0KClcbiAgICBjb25zdCBnZXRIaXRDb3VudCA9ICgpID0+IGdldENlbGxzKCkuZmlsdGVyKHggPT4geC5pc0hpdCkubGVuZ3RoXG4gICAgY29uc3QgZ2V0T3BlbkNlbGxzID0gKCkgPT4gZ2V0Q2VsbHMoKS5maWx0ZXIoeCA9PiAheC5pc0hpdClcbiAgICBjb25zdCBnZXRSYW5kb21TaG90ID0gKCkgPT4gY2hvb3NlUmFuZG9tRWxlbWVudChnZXRPcGVuQ2VsbHMoKSkuY29vcmRzXG4gICAgY29uc3QgZ2V0UmFuZG9tQ29vcmRzID0gKCkgPT4gY2hvb3NlUmFuZG9tRWxlbWVudChnZXRDZWxscygpKS5jb29yZHNcbiAgICBjb25zdCBnZXRCb2FyZCA9ICgpID0+IGJvYXJkXG5cbiAgICBjb25zdCBwcmludCA9ICgpID0+IGJvYXJkLm1hcCh4ID0+IHgubWFwKHkgPT4geS5zeW1ib2wpLmpvaW4oXCIgXCIpKS5qb2luKFwiXFxuXCIpXG4gICAgY29uc3QgcmVjZWl2ZUF0dGFjayA9IChjb29yZHMpID0+IHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGdldENlbGwoY29vcmRzKVxuICAgICAgICBpZihjZWxsLmlzSGl0KXt0aHJvdyBuZXcgRXJyb3IoXCJjZWxsIGFscmVhZHkgaGl0XCIpfVxuICAgICAgICBjb25zdCBoaXRSZXBvcnQgPSBjZWxsLmhpdCgpXG4gICAgICAgIGhpdFJlcG9ydC5hbGxTdW5rID0gZmxlZXQuaXNBbGxTdW5rKClcbiAgICAgICAgaGl0UmVwb3J0LmNvb3JkcyA9IGNvb3Jkc1xuICAgICAgICByZXR1cm4gaGl0UmVwb3J0XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgXG4gICAgICAgIHJlY2VpdmVBdHRhY2ssIFxuICAgICAgICBnZXRDZWxsLFxuICAgICAgICBnZXRDZWxscyxcbiAgICAgICAgZ2V0SGl0Q291bnQsXG4gICAgICAgIGdldFJhbmRvbVNob3QsXG4gICAgICAgIGdldFJhbmRvbUNvb3JkcyxcbiAgICAgICAgcHJpbnQsXG4gICAgICAgIGdldEJvYXJkLFxuICAgICAgICBkYXRhLFxuICAgIH1cbn0iLCJpbXBvcnQgeyBhZGQsIGlzUG9pbnRWYWxpZCwgc2NhbGUsIGdldFJhbmRvbUNvb3JkcywgZ2V0UmFuZG9tRGlyZWN0aW9uIH0gZnJvbSBcIi4vdmVjdG9yXCI7XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0U2hpcHMgPSAoKSA9PiBbXG4gICAgU2hpcChcIkNhcnJpZXJcIiwgNSksXG4gICAgU2hpcChcIkJhdHRsZXNoaXBcIiwgNCksXG4gICAgU2hpcChcIkNydWlzZXJcIiwgMyksXG4gICAgU2hpcChcIlN1Ym1hcmluZVwiLCAzKSxcbiAgICBTaGlwKFwiRGVzdHJveWVyXCIsIDIpLFxuXVxuXG5leHBvcnQgY29uc3QgU2hpcCA9IChuYW1lID0gXCJcIiwgbGVuZ3RoID0gMSkgPT4ge1xuICAgIGxldCBoaXRDb3VudCA9IDA7XG4gICAgY29uc3QgaXNTdW5rID0gKCkgPT4gaGl0Q291bnQgPj0gbGVuZ3RoO1xuICAgIGNvbnN0IGhpdCA9ICgpID0+IHtcbiAgICAgICAgaGl0Q291bnQrKztcbiAgICAgICAgcmV0dXJuIGlzU3VuaygpID8gbmFtZSA6IFwiXCI7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIGxlbmd0aCxcbiAgICAgICAgaXNTdW5rLFxuICAgICAgICBoaXQsXG4gICAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBzaGlwQ29vcmRzID0gKGxlbmd0aCwgbG9jYXRpb24sIGRpcmVjdGlvbikgPT5cbiAgICAoIWxvY2F0aW9uIHwgIWRpcmVjdGlvbikgPyBcbiAgICAgICAgW10gOiBcbiAgICAgICAgWy4uLkFycmF5KGxlbmd0aCkua2V5cygpXS5tYXAoeCA9PiBhZGQobG9jYXRpb24sIHNjYWxlKGRpcmVjdGlvbiwgeCkpKVxuXG5leHBvcnQgY29uc3QgZ2V0S2V5cyA9IGFycmF5ID0+IGFycmF5Lm1hcCgoW2tleSwgdmFsdWVdKSA9PiBrZXkpXG5jb25zdCBnZXRWYWx1ZXMgPSBhcnJheSA9PiBhcnJheS5tYXAoKFtrZXksIHZhbHVlXSkgPT4gdmFsdWUpXG5jb25zdCBleGNsdWRlVmFsdWUgPSAoYXJyYXksIGV4Y2x1ZGVkVmFsdWUpID0+IGFycmF5LmZpbHRlcigoW2tleSwgdmFsdWVdKSA9PiB2YWx1ZSAhPSBleGNsdWRlZFZhbHVlKVxuZXhwb3J0IGNvbnN0IGlzT2NjdXBpZWQgPSAobWFwLCBjb29yZCkgPT4gbmV3IFNldChnZXRLZXlzKG1hcCkubWFwKHggPT4geC50b1N0cmluZygpKSkuaGFzKGNvb3JkLnRvU3RyaW5nKCkpXG5cbmV4cG9ydCBjb25zdCBGbGVldCA9IChib2FyZFNpemUgPSAxMCkgPT4ge1xuICAgIGxldCBzaGlwQ29vcmRpbmF0ZXMgPSBbXVxuICAgIGNvbnN0IGZsZWV0SXNPY2N1cGllZCA9IChjb29yZCkgPT4gaXNPY2N1cGllZChzaGlwQ29vcmRpbmF0ZXMsIGNvb3JkKVxuXG4gICAgY29uc3QgcGxhY2UgPSAoc2hpcCwgbG9jYXRpb24sIGRpcmVjdGlvbikgPT4ge1xuICAgICAgICBjb25zdCBsb2NhdGlvbnMgPSBzaGlwQ29vcmRzKHNoaXAubGVuZ3RoLCBsb2NhdGlvbiwgZGlyZWN0aW9uKVxuICAgICAgICBpZihpbnZhbGlkUGxhY2UobG9jYXRpb25zKSl7cmV0dXJuIGZhbHNlfVxuICAgICAgICBzaGlwQ29vcmRpbmF0ZXMgPSBzaGlwQ29vcmRpbmF0ZXMuY29uY2F0KGxvY2F0aW9ucy5tYXAoeCA9PiBbeCwgc2hpcF0pKVxuICAgICAgICByZXR1cm4gc2hpcENvb3JkaW5hdGVzXG4gICAgfVxuXG4gICAgY29uc3QgaW52YWxpZFBsYWNlID0gKGxvY2F0aW9ucykgPT4gbG9jYXRpb25zLnNvbWUoY29vcmQgPT4gZmxlZXRJc09jY3VwaWVkKGNvb3JkKSB8ICFpc1BvaW50VmFsaWQoY29vcmQsIGJvYXJkU2l6ZSkpXG5cbiAgICBjb25zdCByZW1vdmUgPSAoc2hpcCkgPT4ge1xuICAgICAgICBzaGlwQ29vcmRpbmF0ZXMgPSBleGNsdWRlVmFsdWUoc2hpcENvb3JkaW5hdGVzLCBzaGlwKVxuICAgICAgICByZXR1cm4gc2hpcENvb3JkaW5hdGVzXG4gICAgfVxuXG4gICAgY29uc3QgZ2VuZXJhdGVSYW5kb21QbGFjZW1lbnQgPSAoKSA9PiAoe1xuICAgICAgICBjb29yZHM6IGdldFJhbmRvbUNvb3Jkcyhib2FyZFNpemUpLCBcbiAgICAgICAgZGlyZWN0aW9uOiBnZXRSYW5kb21EaXJlY3Rpb24oKSxcbiAgICB9KVxuXG4gICAgY29uc3QgcGxhY2VTaGlwcyA9IChzaGlwcywgcG9zaXRpb25HZW5lcmF0b3IgPSBnZW5lcmF0ZVJhbmRvbVBsYWNlbWVudCkgPT4ge1xuICAgICAgICBzaGlwcy5mb3JFYWNoKHNoaXAgPT4ge1xuICAgICAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmYWxzZVxuICAgICAgICAgICAgd2hpbGUgKCFzdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2VuID0gcG9zaXRpb25HZW5lcmF0b3IoKVxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MgPSAhIXBsYWNlKHNoaXAsIGdlbi5jb29yZHMsIGdlbi5kaXJlY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH07XG4gICAgY29uc3Qgc2hpcHMgPSAoKSA9PiBcbiAgICAgICAgWy4uLm5ldyBTZXQoZ2V0VmFsdWVzKHNoaXBDb29yZGluYXRlcykpXVxuXG4gICAgY29uc3QgaXNBbGxTdW5rID0gKCkgPT4gXG4gICAgICAgIHNoaXBzKCkuZXZlcnkoeCA9PiB4LmlzU3VuaygpKVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0IHNoaXBDb29yZGluYXRlcygpe3JldHVybiBzaGlwQ29vcmRpbmF0ZXN9LFxuICAgICAgICBzaGlwcyxcbiAgICAgICAgaXNBbGxTdW5rLFxuICAgICAgICBwbGFjZSxcbiAgICAgICAgcGxhY2VTaGlwcyxcbiAgICAgICAgcmVtb3ZlLFxuICAgIH1cbn0iLCJleHBvcnQgY29uc3QgYWRkID0gKHZlY3RvcjEsIHZlY3RvcjIpID0+IHtcbiAgICByZXR1cm4gdmVjdG9yMS5tYXAoKHgsIGkpID0+IHggKyB2ZWN0b3IyW2ldKVxufVxuXG5leHBvcnQgY29uc3Qgc3VidHJhY3QgPSAodmVjdG9yMSwgdmVjdG9yMikgPT4ge1xuICAgIHJldHVybiB2ZWN0b3IxLm1hcCgoeCwgaSkgPT4geCAtIHZlY3RvcjJbaV0pXG59XG5cbmV4cG9ydCBjb25zdCBtdWx0aXBseSA9ICh2ZWN0b3IxLCB2ZWN0b3IyKSA9PiB7XG4gICAgcmV0dXJuIHZlY3RvcjEubWFwKCh4LCBpKSA9PiB4ICogdmVjdG9yMltpXSlcbn1cblxuZXhwb3J0IGNvbnN0IHNjYWxlID0gKHZlY3RvcjEsIHNjYWxhcikgPT4ge1xuICAgIHJldHVybiB2ZWN0b3IxLm1hcCh4ID0+IHggKiBzY2FsYXIpXG59XG5cbmV4cG9ydCBjb25zdCByYW5kb21JbnQgPSAobWF4KSA9PiB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSptYXgpXG59XG5cbmV4cG9ydCBjb25zdCBjaG9vc2VSYW5kb21FbGVtZW50ID0gKGFycmF5KSA9PiBhcnJheVtyYW5kb21JbnQoYXJyYXkubGVuZ3RoIC0xKV1cblxuZXhwb3J0IGNvbnN0IGlzUG9pbnRWYWxpZCA9IChjb29yZHMsIGJvYXJkU2l6ZSkgPT5cbiAgICAhY29vcmRzLnNvbWUoeCA9PiB4IDwgMCB8IHggPiBib2FyZFNpemUgLSAxKVxuXG5leHBvcnQgY29uc3QgZ2V0UmFuZG9tQ29vcmRzID0gKGJvYXJkU2l6ZSkgPT4gW3JhbmRvbUludChib2FyZFNpemUpLCByYW5kb21JbnQoYm9hcmRTaXplKV1cblxuZXhwb3J0IGNvbnN0IGdldFJhbmRvbURpcmVjdGlvbiA9ICgpID0+IFxuICAgIGNob29zZVJhbmRvbUVsZW1lbnQoW1sxLDBdLCBbMCwxXSwgWy0xLDBdLCBbMCwtMV1dKVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBHYW1lLCBSZW5kZXJlciB9IGZyb20gXCIuL2dhbWVcIlxuaW1wb3J0IHsgR2FtZWJvYXJkIH0gZnJvbSBcIi4vZ2FtZWJvYXJkXCJcbmltcG9ydCB7IEZsZWV0LCBkZWZhdWx0U2hpcHMgfSBmcm9tIFwiLi9zaGlwXCJcbmNvbnN0IGZsZWV0cyA9IFtGbGVldCgpLCBGbGVldCgpXVxuZmxlZXRzLmZvckVhY2goZmxlZXQgPT4ge1xuICAgIGZsZWV0LnBsYWNlU2hpcHMoZGVmYXVsdFNoaXBzKCkpXG59KVxuY29uc3QgZ2FtZSA9IEdhbWUoR2FtZWJvYXJkKGZsZWV0c1swXSksIEdhbWVib2FyZChmbGVldHNbMV0pKVxuY29uc3Qgbm90aWZTdHJpbmcgPSAoZXZlbnQpID0+IGAke2V2ZW50LnBsYXllck5hbWV9IGZpcmVkIGF0ICR7ZXZlbnQuY29vcmRzfSBhbmQgJHtldmVudC5oaXQgPyBcImhpdFwiIDogXCJtaXNzZWRcIn0uICR7ZXZlbnQuc3VuayA/IGBBICR7ZXZlbnQuc3Vua30gd2FzIHN1bmsuYCA6IFwiXCJ9ICR7ZXZlbnQuYWxsU3VuayA/IGBBbGwgc2hpcHMgYXJlIHN1bmsuICR7ZXZlbnQucGxheWVyTmFtZX0gd2luLiBgIDogXCJcIn1gXG5jb25zdCBmbkNsaWNrID0gKGNvb3JkcykgPT4ge1xuICAgIGNvbnN0IGV2ZW50cyA9IGdhbWUuc3RlcChjb29yZHMpXG4gICAgcmVuZGVyZXIubG9nKG5vdGlmU3RyaW5nKGV2ZW50c1swXSkgKyBub3RpZlN0cmluZyhldmVudHNbMV0pKVxuICAgIHJlbmRlcmVyLnJlbmRlcihnYW1lKVxufVxuY29uc3QgcmVuZGVyZXIgPSBSZW5kZXJlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5cIiksIGRvY3VtZW50LCBmbkNsaWNrKVxucmVuZGVyZXIuaW5pdChnYW1lKSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==