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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7QUNOdUM7QUFDQTtBQUNLO0FBQzVDLGdCQUFnQiw0Q0FBSyxJQUFJLDRDQUFLO0FBQzlCO0FBQ0EscUJBQXFCLG1EQUFZO0FBQ2pDLENBQUM7QUFDRCxhQUFhLDJDQUFJLENBQUMscURBQVMsYUFBYSxxREFBUztBQUNqRCxrQ0FBa0Msa0JBQWtCLFdBQVcsY0FBYyxNQUFNLDZCQUE2QixJQUFJLGtCQUFrQixZQUFZLGlCQUFpQixFQUFFLHVDQUF1QyxrQkFBa0IsWUFBWTtBQUMxTztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLCtDQUFRO0FBQ3pCLG1CIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmVjdG9yLmpzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgR2FtZSA9IChwbGF5ZXJCb2FyZCwgY29tcHV0ZXJCb2FyZCkgPT4ge1xyXG4gICAgY29uc3Qgc3RlcCA9IChjb29yZHMpID0+IHtcclxuICAgICAgICBjb25zdCBjb21wdXRlckV2ZW50ID0gY29tcHV0ZXJCb2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkcylcclxuICAgICAgICBjb21wdXRlckV2ZW50LnBsYXllck5hbWUgPSBcIllvdVwiXHJcbiAgICAgICAgY29uc3QgcGxheWVyRXZlbnQgPSBwbGF5ZXJCb2FyZC5yZWNlaXZlQXR0YWNrKHBsYXllckJvYXJkLmdldFJhbmRvbVNob3QoKSlcclxuICAgICAgICBwbGF5ZXJFdmVudC5wbGF5ZXJOYW1lID0gXCJDb21wdXRlclwiXHJcbiAgICAgICAgcmV0dXJuIFtjb21wdXRlckV2ZW50LCBwbGF5ZXJFdmVudF1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHN0ZXAsXHJcbiAgICAgICAgcGxheWVyOiBwbGF5ZXJCb2FyZCxcclxuICAgICAgICBjb21wdXRlcjogY29tcHV0ZXJCb2FyZCxcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFJlbmRlcmVyID0gKGZyYW1lLCBkb2MsIGZuQ2xpY2spID0+IHtcclxuICAgIGxldCBwbGF5ZXJCb2FyZFJlZlxyXG4gICAgbGV0IGNvbXB1dGVyQm9hcmRSZWZcclxuICAgIGxldCBsb2dSZWZcclxuICAgIGNvbnN0IHJlbmRlckNlbGwgPSAoY2VsbCwgaXNQbGF5ZXIpID0+IHtcclxuICAgICAgICBjb25zdCBjZWxsRE9NID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIilcclxuICAgICAgICBjZWxsRE9NLmNsYXNzTGlzdC5hZGQoXCJnYW1lY2VsbFwiKVxyXG4gICAgICAgIGlmKGNlbGwuaXNIaXQpe1xyXG4gICAgICAgICAgICBjZWxsRE9NLmNsYXNzTGlzdC5hZGQoY2VsbC5zaGlwUmVmID8gXCJnYW1lY2VsbC0taGl0XCIgOiBcImdhbWVjZWxsLS1taXNzXCIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGlzUGxheWVyKXtcclxuICAgICAgICAgICAgY2VsbERPTS5pbm5lclRleHQgPSBjZWxsLnNoaXBSZWYgPyBjZWxsLnN5bWJvbCA6IFwiXCJcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIWlzUGxheWVyICYmICFjZWxsLmlzSGl0KXtcclxuICAgICAgICAgICAgY2VsbERPTS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7Zm5DbGljayhjZWxsLmNvb3Jkcyl9KVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2VsbERPTVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVuZGVyQm9hcmQgPSAoYm9hcmQsIGlzUGxheWVyID0gZmFsc2UpID0+IHtcclxuICAgICAgICBjb25zdCBib2FyZERPTSA9IGRvYy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcbiAgICAgICAgYm9hcmRET00uY2xhc3NMaXN0LmFkZChcImdhbWVib2FyZFwiKVxyXG5cclxuICAgICAgICBjb25zdCBjZWxscyA9IGJvYXJkLmdldENlbGxzKCkubWFwKCB4ID0+IHJlbmRlckNlbGwoeCwgaXNQbGF5ZXIpKVxyXG4gICAgICAgIGZvcihsZXQgZSBvZiBjZWxscyl7XHJcbiAgICAgICAgICAgIGJvYXJkRE9NLmFwcGVuZENoaWxkKGUpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBib2FyZERPTVxyXG4gICAgfVxyXG4gICAgY29uc3QgaW5pdCA9IChnYW1lKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGxheWVyQm9hcmQgPSByZW5kZXJCb2FyZChnYW1lLnBsYXllciwgdHJ1ZSlcclxuICAgICAgICBjb25zdCBjb21wdXRlckJvYXJkID0gcmVuZGVyQm9hcmQoZ2FtZS5jb21wdXRlcilcclxuICAgICAgICBsb2dSZWYgPSBkb2MuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgICAgIGxvZ1JlZi5jbGFzc0xpc3QuYWRkKFwibG9nXCIpXHJcbiAgICAgICAgcGxheWVyQm9hcmRSZWYgPSBwbGF5ZXJCb2FyZFxyXG4gICAgICAgIGNvbXB1dGVyQm9hcmRSZWYgPSBjb21wdXRlckJvYXJkXHJcbiAgICAgICAgZnJhbWUuYXBwZW5kQ2hpbGQocGxheWVyQm9hcmQpXHJcbiAgICAgICAgZnJhbWUuYXBwZW5kQ2hpbGQobG9nUmVmKVxyXG4gICAgICAgIGZyYW1lLmFwcGVuZENoaWxkKGNvbXB1dGVyQm9hcmQpXHJcblxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVuZGVyID0gKGdhbWUpID0+IHtcclxuICAgICAgICBjb25zdCBwbGF5ZXJCb2FyZCA9IHJlbmRlckJvYXJkKGdhbWUucGxheWVyLCB0cnVlKVxyXG4gICAgICAgIHBsYXllckJvYXJkUmVmLnJlcGxhY2VXaXRoKHBsYXllckJvYXJkKVxyXG4gICAgICAgIHBsYXllckJvYXJkUmVmID0gcGxheWVyQm9hcmRcclxuICAgICAgICBjb25zdCBjb21wdXRlckJvYXJkID0gcmVuZGVyQm9hcmQoZ2FtZS5jb21wdXRlcilcclxuICAgICAgICBjb21wdXRlckJvYXJkUmVmLnJlcGxhY2VXaXRoKGNvbXB1dGVyQm9hcmQpXHJcbiAgICAgICAgY29tcHV0ZXJCb2FyZFJlZiA9IGNvbXB1dGVyQm9hcmRcclxuICAgIH1cclxuICAgIGNvbnN0IGxvZyA9IChtZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmV3TWVzc2FnZSA9IGRvYy5jcmVhdGVFbGVtZW50KFwicFwiKVxyXG4gICAgICAgIG5ld01lc3NhZ2UuaW5uZXJUZXh0ID0gbWVzc2FnZVxyXG4gICAgICAgIGxvZ1JlZi5wcmVwZW5kKG5ld01lc3NhZ2UpXHJcbiAgICB9XHJcbiAgICByZXR1cm4ge3JlbmRlciwgaW5pdCwgbG9nfVxyXG59IiwiaW1wb3J0IHsgU2hpcCwgZGVmYXVsdFNoaXBzLCBzaGlwQ29vcmRzIH0gZnJvbSBcIi4vc2hpcFwiXHJcbmltcG9ydCB7IGFkZCwgY2hvb3NlUmFuZG9tRWxlbWVudCwgcmFuZG9tSW50LCBzY2FsZSwgZGlyZWN0aW9uQXJyYXkgfSBmcm9tIFwiLi92ZWN0b3JcIlxyXG5cclxuLy9hIHZlY3RvciBpcyBhbiBhcnJheSBvZiBbeCwgeV0uXHJcblxyXG5leHBvcnQgY29uc3QgR2FtZWNlbGwgPSAoY29vcmRzID0gWzAsMF0pID0+IHtcclxuICAgIGxldCBzaGlwUmVmID0gbnVsbDtcclxuICAgIGxldCBpc0hpdCA9IGZhbHNlO1xyXG4gICAgY29uc3QgaGl0ID0gKCkgPT4ge1xyXG4gICAgICAgIGlzSGl0ID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBvdXRwdXQgPSB7aGl0OiBmYWxzZSwgc3VuazogXCJcIn1cclxuICAgICAgICBpZihzaGlwUmVmKXtcclxuICAgICAgICAgICAgb3V0cHV0LmhpdCA9IHRydWVcclxuICAgICAgICAgICAgb3V0cHV0LnN1bmsgPSBzaGlwUmVmLmhpdCgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0cHV0XHJcbiAgICAgICAgfVxyXG5cclxuICAgIGNvbnN0IHN5bWJvbCA9ICgpID0+IFxyXG4gICAgICAgIGlzSGl0ID8gXCJ4XCIgOlxyXG4gICAgICAgIHNoaXBSZWYgPyBzaGlwUmVmLm5hbWUuc2xpY2UoMCwgMSkgOlxyXG4gICAgICAgIFwiLlwiO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY29vcmRzLFxyXG4gICAgICAgIGdldCBzaGlwUmVmKCkgeyByZXR1cm4gc2hpcFJlZjsgfSxcclxuICAgICAgICBzZXQgc2hpcFJlZihuZXdTaGlwKSB7IHNoaXBSZWYgPSBuZXdTaGlwOyB9LFxyXG4gICAgICAgIGdldCBpc0hpdCgpIHsgcmV0dXJuIGlzSGl0OyB9LFxyXG4gICAgICAgIGdldCBzeW1ib2woKSB7IHJldHVybiBzeW1ib2woKTsgfSxcclxuICAgICAgICBoaXQsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRpYWxpemVCb2FyZCA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XHJcbiAgICBjb25zdCBib2FyZCA9IFtdXHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcclxuICAgICAgICBsZXQgcm93ID0gW11cclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGhlaWdodDsgeSsrKSB7XHJcbiAgICAgICAgICAgIHJvdy5wdXNoKEdhbWVjZWxsKFt4LCB5XSkpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJvYXJkLnB1c2gocm93KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJvYXJkXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBHYW1lYm9hcmQgPSAoZmxlZXQsIGJvYXJkID0gaW5pdGlhbGl6ZUJvYXJkKDEwLCAxMCksICkgPT4ge1xyXG4gICAgY29uc3QgZGF0YSA9ICgpID0+IGJvYXJkLm1hcChjZWxsID0+IGNlbGwuZGF0YSgpKVxyXG4gICAgY29uc3QgZ2V0Q2VsbCA9IChjb29yZHMpID0+IHtcclxuICAgICAgICBpZihjb29yZHMuc29tZSh4ID0+IHggPCAwIHwgeCA+IGJvYXJkLmxlbmd0aCAtIDEpKXtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIm91dCBvZiBib3VuZHNcIilcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgW3gsIHldID0gY29vcmRzXHJcbiAgICAgICAgcmV0dXJuIGJvYXJkW3hdW3ldXHJcbiAgICB9XHJcblxyXG4gICAgZmxlZXQuc2hpcENvb3JkaW5hdGVzLmZvckVhY2goKFtjb29yZCwgc2hpcF0pID0+IGdldENlbGwoY29vcmQpLnNoaXBSZWYgPSBzaGlwKVxyXG5cclxuICAgIGNvbnN0IGdldENlbGxzID0gKCkgPT4gYm9hcmQuZmxhdCgpXHJcbiAgICBjb25zdCBnZXRIaXRDb3VudCA9ICgpID0+IGdldENlbGxzKCkuZmlsdGVyKHggPT4geC5pc0hpdCkubGVuZ3RoXHJcbiAgICBjb25zdCBnZXRPcGVuQ2VsbHMgPSAoKSA9PiBnZXRDZWxscygpLmZpbHRlcih4ID0+ICF4LmlzSGl0KVxyXG4gICAgY29uc3QgZ2V0UmFuZG9tU2hvdCA9ICgpID0+IGNob29zZVJhbmRvbUVsZW1lbnQoZ2V0T3BlbkNlbGxzKCkpLmNvb3Jkc1xyXG4gICAgY29uc3QgZ2V0UmFuZG9tQ29vcmRzID0gKCkgPT4gY2hvb3NlUmFuZG9tRWxlbWVudChnZXRDZWxscygpKS5jb29yZHNcclxuICAgIGNvbnN0IGdldEJvYXJkID0gKCkgPT4gYm9hcmRcclxuXHJcbiAgICBjb25zdCBwcmludCA9ICgpID0+IGJvYXJkLm1hcCh4ID0+IHgubWFwKHkgPT4geS5zeW1ib2wpLmpvaW4oXCIgXCIpKS5qb2luKFwiXFxuXCIpXHJcbiAgICBjb25zdCByZWNlaXZlQXR0YWNrID0gKGNvb3JkcykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNlbGwgPSBnZXRDZWxsKGNvb3JkcylcclxuICAgICAgICBpZihjZWxsLmlzSGl0KXt0aHJvdyBuZXcgRXJyb3IoXCJjZWxsIGFscmVhZHkgaGl0XCIpfVxyXG4gICAgICAgIGNvbnN0IGhpdFJlcG9ydCA9IGNlbGwuaGl0KClcclxuICAgICAgICBoaXRSZXBvcnQuYWxsU3VuayA9IGZsZWV0LmlzQWxsU3VuaygpXHJcbiAgICAgICAgaGl0UmVwb3J0LmNvb3JkcyA9IGNvb3Jkc1xyXG4gICAgICAgIHJldHVybiBoaXRSZXBvcnRcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geyBcclxuICAgICAgICByZWNlaXZlQXR0YWNrLCBcclxuICAgICAgICBnZXRDZWxsLFxyXG4gICAgICAgIGdldENlbGxzLFxyXG4gICAgICAgIGdldEhpdENvdW50LFxyXG4gICAgICAgIGdldFJhbmRvbVNob3QsXHJcbiAgICAgICAgZ2V0UmFuZG9tQ29vcmRzLFxyXG4gICAgICAgIHByaW50LFxyXG4gICAgICAgIGdldEJvYXJkLFxyXG4gICAgICAgIGRhdGEsXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBhZGQsIGlzUG9pbnRWYWxpZCwgc2NhbGUsIGdldFJhbmRvbUNvb3JkcywgZ2V0UmFuZG9tRGlyZWN0aW9uIH0gZnJvbSBcIi4vdmVjdG9yXCI7XHJcblxyXG5leHBvcnQgY29uc3QgZGVmYXVsdFNoaXBzID0gKCkgPT4gW1xyXG4gICAgU2hpcChcIkNhcnJpZXJcIiwgNSksXHJcbiAgICBTaGlwKFwiQmF0dGxlc2hpcFwiLCA0KSxcclxuICAgIFNoaXAoXCJDcnVpc2VyXCIsIDMpLFxyXG4gICAgU2hpcChcIlN1Ym1hcmluZVwiLCAzKSxcclxuICAgIFNoaXAoXCJEZXN0cm95ZXJcIiwgMiksXHJcbl1cclxuXHJcbmV4cG9ydCBjb25zdCBTaGlwID0gKG5hbWUgPSBcIlwiLCBsZW5ndGggPSAxKSA9PiB7XHJcbiAgICBsZXQgaGl0Q291bnQgPSAwO1xyXG4gICAgY29uc3QgaXNTdW5rID0gKCkgPT4gaGl0Q291bnQgPj0gbGVuZ3RoO1xyXG4gICAgY29uc3QgaGl0ID0gKCkgPT4ge1xyXG4gICAgICAgIGhpdENvdW50Kys7XHJcbiAgICAgICAgcmV0dXJuIGlzU3VuaygpID8gbmFtZSA6IFwiXCI7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmFtZSxcclxuICAgICAgICBsZW5ndGgsXHJcbiAgICAgICAgaXNTdW5rLFxyXG4gICAgICAgIGhpdCxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3Qgc2hpcENvb3JkcyA9IChsZW5ndGgsIGxvY2F0aW9uLCBkaXJlY3Rpb24pID0+XHJcbiAgICAoIWxvY2F0aW9uIHwgIWRpcmVjdGlvbikgPyBcclxuICAgICAgICBbXSA6IFxyXG4gICAgICAgIFsuLi5BcnJheShsZW5ndGgpLmtleXMoKV0ubWFwKHggPT4gYWRkKGxvY2F0aW9uLCBzY2FsZShkaXJlY3Rpb24sIHgpKSlcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRLZXlzID0gYXJyYXkgPT4gYXJyYXkubWFwKChba2V5LCB2YWx1ZV0pID0+IGtleSlcclxuY29uc3QgZ2V0VmFsdWVzID0gYXJyYXkgPT4gYXJyYXkubWFwKChba2V5LCB2YWx1ZV0pID0+IHZhbHVlKVxyXG5jb25zdCBleGNsdWRlVmFsdWUgPSAoYXJyYXksIGV4Y2x1ZGVkVmFsdWUpID0+IGFycmF5LmZpbHRlcigoW2tleSwgdmFsdWVdKSA9PiB2YWx1ZSAhPSBleGNsdWRlZFZhbHVlKVxyXG5leHBvcnQgY29uc3QgaXNPY2N1cGllZCA9IChtYXAsIGNvb3JkKSA9PiBuZXcgU2V0KGdldEtleXMobWFwKS5tYXAoeCA9PiB4LnRvU3RyaW5nKCkpKS5oYXMoY29vcmQudG9TdHJpbmcoKSlcclxuXHJcbmV4cG9ydCBjb25zdCBGbGVldCA9IChib2FyZFNpemUgPSAxMCkgPT4ge1xyXG4gICAgbGV0IHNoaXBDb29yZGluYXRlcyA9IFtdXHJcbiAgICBjb25zdCBmbGVldElzT2NjdXBpZWQgPSAoY29vcmQpID0+IGlzT2NjdXBpZWQoc2hpcENvb3JkaW5hdGVzLCBjb29yZClcclxuXHJcbiAgICBjb25zdCBwbGFjZSA9IChzaGlwLCBsb2NhdGlvbiwgZGlyZWN0aW9uKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbG9jYXRpb25zID0gc2hpcENvb3JkcyhzaGlwLmxlbmd0aCwgbG9jYXRpb24sIGRpcmVjdGlvbilcclxuICAgICAgICBpZihpbnZhbGlkUGxhY2UobG9jYXRpb25zKSl7cmV0dXJuIGZhbHNlfVxyXG4gICAgICAgIHNoaXBDb29yZGluYXRlcyA9IHNoaXBDb29yZGluYXRlcy5jb25jYXQobG9jYXRpb25zLm1hcCh4ID0+IFt4LCBzaGlwXSkpXHJcbiAgICAgICAgcmV0dXJuIHNoaXBDb29yZGluYXRlc1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGludmFsaWRQbGFjZSA9IChsb2NhdGlvbnMpID0+IGxvY2F0aW9ucy5zb21lKGNvb3JkID0+IGZsZWV0SXNPY2N1cGllZChjb29yZCkgfCAhaXNQb2ludFZhbGlkKGNvb3JkLCBib2FyZFNpemUpKVxyXG5cclxuICAgIGNvbnN0IHJlbW92ZSA9IChzaGlwKSA9PiB7XHJcbiAgICAgICAgc2hpcENvb3JkaW5hdGVzID0gZXhjbHVkZVZhbHVlKHNoaXBDb29yZGluYXRlcywgc2hpcClcclxuICAgICAgICByZXR1cm4gc2hpcENvb3JkaW5hdGVzXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZ2VuZXJhdGVSYW5kb21QbGFjZW1lbnQgPSAoKSA9PiAoe1xyXG4gICAgICAgIGNvb3JkczogZ2V0UmFuZG9tQ29vcmRzKGJvYXJkU2l6ZSksIFxyXG4gICAgICAgIGRpcmVjdGlvbjogZ2V0UmFuZG9tRGlyZWN0aW9uKCksXHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnN0IHBsYWNlU2hpcHMgPSAoc2hpcHMsIHBvc2l0aW9uR2VuZXJhdG9yID0gZ2VuZXJhdGVSYW5kb21QbGFjZW1lbnQpID0+IHtcclxuICAgICAgICBzaGlwcy5mb3JFYWNoKHNoaXAgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc3VjY2VzcyA9IGZhbHNlXHJcbiAgICAgICAgICAgIHdoaWxlICghc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2VuID0gcG9zaXRpb25HZW5lcmF0b3IoKVxyXG4gICAgICAgICAgICAgICAgc3VjY2VzcyA9ICEhcGxhY2Uoc2hpcCwgZ2VuLmNvb3JkcywgZ2VuLmRpcmVjdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHNoaXBzID0gKCkgPT4gXHJcbiAgICAgICAgWy4uLm5ldyBTZXQoZ2V0VmFsdWVzKHNoaXBDb29yZGluYXRlcykpXVxyXG5cclxuICAgIGNvbnN0IGlzQWxsU3VuayA9ICgpID0+IFxyXG4gICAgICAgIHNoaXBzKCkuZXZlcnkoeCA9PiB4LmlzU3VuaygpKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0IHNoaXBDb29yZGluYXRlcygpe3JldHVybiBzaGlwQ29vcmRpbmF0ZXN9LFxyXG4gICAgICAgIHNoaXBzLFxyXG4gICAgICAgIGlzQWxsU3VuayxcclxuICAgICAgICBwbGFjZSxcclxuICAgICAgICBwbGFjZVNoaXBzLFxyXG4gICAgICAgIHJlbW92ZSxcclxuICAgIH1cclxufSIsImV4cG9ydCBjb25zdCBhZGQgPSAodmVjdG9yMSwgdmVjdG9yMikgPT4ge1xyXG4gICAgcmV0dXJuIHZlY3RvcjEubWFwKCh4LCBpKSA9PiB4ICsgdmVjdG9yMltpXSlcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHN1YnRyYWN0ID0gKHZlY3RvcjEsIHZlY3RvcjIpID0+IHtcclxuICAgIHJldHVybiB2ZWN0b3IxLm1hcCgoeCwgaSkgPT4geCAtIHZlY3RvcjJbaV0pXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBtdWx0aXBseSA9ICh2ZWN0b3IxLCB2ZWN0b3IyKSA9PiB7XHJcbiAgICByZXR1cm4gdmVjdG9yMS5tYXAoKHgsIGkpID0+IHggKiB2ZWN0b3IyW2ldKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2NhbGUgPSAodmVjdG9yMSwgc2NhbGFyKSA9PiB7XHJcbiAgICByZXR1cm4gdmVjdG9yMS5tYXAoeCA9PiB4ICogc2NhbGFyKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmFuZG9tSW50ID0gKG1heCkgPT4ge1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSptYXgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjaG9vc2VSYW5kb21FbGVtZW50ID0gKGFycmF5KSA9PiBhcnJheVtyYW5kb21JbnQoYXJyYXkubGVuZ3RoIC0xKV1cclxuXHJcbmV4cG9ydCBjb25zdCBpc1BvaW50VmFsaWQgPSAoY29vcmRzLCBib2FyZFNpemUpID0+XHJcbiAgICAhY29vcmRzLnNvbWUoeCA9PiB4IDwgMCB8IHggPiBib2FyZFNpemUgLSAxKVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJhbmRvbUNvb3JkcyA9IChib2FyZFNpemUpID0+IFtyYW5kb21JbnQoYm9hcmRTaXplKSwgcmFuZG9tSW50KGJvYXJkU2l6ZSldXHJcblxyXG5leHBvcnQgY29uc3QgZ2V0UmFuZG9tRGlyZWN0aW9uID0gKCkgPT4gXHJcbiAgICBjaG9vc2VSYW5kb21FbGVtZW50KFtbMSwwXSwgWzAsMV0sIFstMSwwXSwgWzAsLTFdXSlcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBHYW1lLCBSZW5kZXJlciB9IGZyb20gXCIuL2dhbWVcIlxyXG5pbXBvcnQgeyBHYW1lYm9hcmQgfSBmcm9tIFwiLi9nYW1lYm9hcmRcIlxyXG5pbXBvcnQgeyBGbGVldCwgZGVmYXVsdFNoaXBzIH0gZnJvbSBcIi4vc2hpcFwiXHJcbmNvbnN0IGZsZWV0cyA9IFtGbGVldCgpLCBGbGVldCgpXVxyXG5mbGVldHMuZm9yRWFjaChmbGVldCA9PiB7XHJcbiAgICBmbGVldC5wbGFjZVNoaXBzKGRlZmF1bHRTaGlwcygpKVxyXG59KVxyXG5jb25zdCBnYW1lID0gR2FtZShHYW1lYm9hcmQoZmxlZXRzWzBdKSwgR2FtZWJvYXJkKGZsZWV0c1sxXSkpXHJcbmNvbnN0IG5vdGlmU3RyaW5nID0gKGV2ZW50KSA9PiBgJHtldmVudC5wbGF5ZXJOYW1lfSBmaXJlZCBhdCAke2V2ZW50LmNvb3Jkc30gYW5kICR7ZXZlbnQuaGl0ID8gXCJoaXRcIiA6IFwibWlzc2VkXCJ9LiAke2V2ZW50LnN1bmsgPyBgQSAke2V2ZW50LnN1bmt9IHdhcyBzdW5rLmAgOiBcIlwifSAke2V2ZW50LmFsbFN1bmsgPyBgQWxsIHNoaXBzIGFyZSBzdW5rLiAke2V2ZW50LnBsYXllck5hbWV9IHdpbi4gYCA6IFwiXCJ9YFxyXG5jb25zdCBmbkNsaWNrID0gKGNvb3JkcykgPT4ge1xyXG4gICAgY29uc3QgZXZlbnRzID0gZ2FtZS5zdGVwKGNvb3JkcylcclxuICAgIHJlbmRlcmVyLmxvZyhub3RpZlN0cmluZyhldmVudHNbMF0pICsgbm90aWZTdHJpbmcoZXZlbnRzWzFdKSlcclxuICAgIHJlbmRlcmVyLnJlbmRlcihnYW1lKVxyXG59XHJcbmNvbnN0IHJlbmRlcmVyID0gUmVuZGVyZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluXCIpLCBkb2N1bWVudCwgZm5DbGljaylcclxucmVuZGVyZXIuaW5pdChnYW1lKSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==