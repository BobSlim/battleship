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
const notifString = (event) => `${event.playerName} fired at ${event.coords} and ${event.hit ? "hit" : "missed"}. ${event.sunk ? `A ${event.sunk} was sunk.` : ""} ${event.allSunk ? `All ships are sunk. ${event.playerName} wins.` : ""}`
const fnClick = (coords) => {
    const events = game.step(coords)
    events.forEach((event) => {
        renderer.log(notifString(event))
    })
    renderer.render(game)
}
const renderer = (0,_game__WEBPACK_IMPORTED_MODULE_0__.Renderer)(document.getElementById("main"), document, fnClick)
renderer.init(game)
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDTnVDO0FBQ0E7QUFDSztBQUM1QyxnQkFBZ0IsNENBQUssSUFBSSw0Q0FBSztBQUM5QjtBQUNBLHFCQUFxQixtREFBWTtBQUNqQyxDQUFDO0FBQ0QsYUFBYSwyQ0FBSSxDQUFDLHFEQUFTLGFBQWEscURBQVM7QUFDakQsa0NBQWtDLGtCQUFrQixXQUFXLGNBQWMsTUFBTSw2QkFBNkIsSUFBSSxrQkFBa0IsWUFBWSxpQkFBaUIsRUFBRSx1Q0FBdUMsa0JBQWtCLFlBQVk7QUFDMU87QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLGlCQUFpQiwrQ0FBUTtBQUN6QixtQiIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9nYW1lLmpzIiwid2VicGFjazovLy8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZlY3Rvci5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IEdhbWUgPSAocGxheWVyQm9hcmQsIGNvbXB1dGVyQm9hcmQpID0+IHtcclxuICAgIGNvbnN0IHN0ZXAgPSAoY29vcmRzKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY29tcHV0ZXJFdmVudCA9IGNvbXB1dGVyQm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZHMpXHJcbiAgICAgICAgY29tcHV0ZXJFdmVudC5wbGF5ZXJOYW1lID0gXCJZb3VcIlxyXG4gICAgICAgIGNvbnN0IHBsYXllckV2ZW50ID0gcGxheWVyQm9hcmQucmVjZWl2ZUF0dGFjayhwbGF5ZXJCb2FyZC5nZXRSYW5kb21TaG90KCkpXHJcbiAgICAgICAgcGxheWVyRXZlbnQucGxheWVyTmFtZSA9IFwiQ29tcHV0ZXJcIlxyXG4gICAgICAgIHJldHVybiBbY29tcHV0ZXJFdmVudCwgcGxheWVyRXZlbnRdXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzdGVwLFxyXG4gICAgICAgIHBsYXllcjogcGxheWVyQm9hcmQsXHJcbiAgICAgICAgY29tcHV0ZXI6IGNvbXB1dGVyQm9hcmQsXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBSZW5kZXJlciA9IChmcmFtZSwgZG9jLCBmbkNsaWNrKSA9PiB7XHJcbiAgICBsZXQgcGxheWVyQm9hcmRSZWZcclxuICAgIGxldCBjb21wdXRlckJvYXJkUmVmXHJcbiAgICBsZXQgbG9nUmVmXHJcbiAgICBjb25zdCByZW5kZXJDZWxsID0gKGNlbGwsIGlzUGxheWVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2VsbERPTSA9IGRvYy5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpXHJcbiAgICAgICAgY2VsbERPTS5jbGFzc0xpc3QuYWRkKFwiZ2FtZWNlbGxcIilcclxuICAgICAgICBpZihjZWxsLmlzSGl0KXtcclxuICAgICAgICAgICAgY2VsbERPTS5jbGFzc0xpc3QuYWRkKGNlbGwuc2hpcFJlZiA/IFwiZ2FtZWNlbGwtLWhpdFwiIDogXCJnYW1lY2VsbC0tbWlzc1wiKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihpc1BsYXllcil7XHJcbiAgICAgICAgICAgIGNlbGxET00uaW5uZXJUZXh0ID0gY2VsbC5zaGlwUmVmID8gY2VsbC5zeW1ib2wgOiBcIlwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFpc1BsYXllciAmJiAhY2VsbC5pc0hpdCl7XHJcbiAgICAgICAgICAgIGNlbGxET00uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge2ZuQ2xpY2soY2VsbC5jb29yZHMpfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNlbGxET01cclxuICAgIH1cclxuICAgIGNvbnN0IHJlbmRlckJvYXJkID0gKGJvYXJkLCBpc1BsYXllciA9IGZhbHNlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYm9hcmRET00gPSBkb2MuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgICAgIGJvYXJkRE9NLmNsYXNzTGlzdC5hZGQoXCJnYW1lYm9hcmRcIilcclxuXHJcbiAgICAgICAgY29uc3QgY2VsbHMgPSBib2FyZC5nZXRDZWxscygpLm1hcCggeCA9PiByZW5kZXJDZWxsKHgsIGlzUGxheWVyKSlcclxuICAgICAgICBmb3IobGV0IGUgb2YgY2VsbHMpe1xyXG4gICAgICAgICAgICBib2FyZERPTS5hcHBlbmRDaGlsZChlKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYm9hcmRET01cclxuICAgIH1cclxuICAgIGNvbnN0IGluaXQgPSAoZ2FtZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBsYXllckJvYXJkID0gcmVuZGVyQm9hcmQoZ2FtZS5wbGF5ZXIsIHRydWUpXHJcbiAgICAgICAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IHJlbmRlckJvYXJkKGdhbWUuY29tcHV0ZXIpXHJcbiAgICAgICAgbG9nUmVmID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuICAgICAgICBwbGF5ZXJCb2FyZFJlZiA9IHBsYXllckJvYXJkXHJcbiAgICAgICAgY29tcHV0ZXJCb2FyZFJlZiA9IGNvbXB1dGVyQm9hcmRcclxuICAgICAgICBmcmFtZS5hcHBlbmRDaGlsZChwbGF5ZXJCb2FyZClcclxuICAgICAgICBmcmFtZS5hcHBlbmRDaGlsZChsb2dSZWYpXHJcbiAgICAgICAgZnJhbWUuYXBwZW5kQ2hpbGQoY29tcHV0ZXJCb2FyZClcclxuXHJcbiAgICB9XHJcbiAgICBjb25zdCByZW5kZXIgPSAoZ2FtZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBsYXllckJvYXJkID0gcmVuZGVyQm9hcmQoZ2FtZS5wbGF5ZXIsIHRydWUpXHJcbiAgICAgICAgcGxheWVyQm9hcmRSZWYucmVwbGFjZVdpdGgocGxheWVyQm9hcmQpXHJcbiAgICAgICAgcGxheWVyQm9hcmRSZWYgPSBwbGF5ZXJCb2FyZFxyXG4gICAgICAgIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSByZW5kZXJCb2FyZChnYW1lLmNvbXB1dGVyKVxyXG4gICAgICAgIGNvbXB1dGVyQm9hcmRSZWYucmVwbGFjZVdpdGgoY29tcHV0ZXJCb2FyZClcclxuICAgICAgICBjb21wdXRlckJvYXJkUmVmID0gY29tcHV0ZXJCb2FyZFxyXG4gICAgfVxyXG4gICAgY29uc3QgbG9nID0gKG1lc3NhZ2UpID0+IHtcclxuICAgICAgICBjb25zdCBuZXdNZXNzYWdlID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJwXCIpXHJcbiAgICAgICAgbmV3TWVzc2FnZS5pbm5lclRleHQgPSBtZXNzYWdlXHJcbiAgICAgICAgbG9nUmVmLnByZXBlbmQobmV3TWVzc2FnZSlcclxuICAgIH1cclxuICAgIHJldHVybiB7cmVuZGVyLCBpbml0LCBsb2d9XHJcbn0iLCJpbXBvcnQgeyBTaGlwLCBkZWZhdWx0U2hpcHMsIHNoaXBDb29yZHMgfSBmcm9tIFwiLi9zaGlwXCJcclxuaW1wb3J0IHsgYWRkLCBjaG9vc2VSYW5kb21FbGVtZW50LCByYW5kb21JbnQsIHNjYWxlLCBkaXJlY3Rpb25BcnJheSB9IGZyb20gXCIuL3ZlY3RvclwiXHJcblxyXG4vL2EgdmVjdG9yIGlzIGFuIGFycmF5IG9mIFt4LCB5XS5cclxuXHJcbmV4cG9ydCBjb25zdCBHYW1lY2VsbCA9IChjb29yZHMgPSBbMCwwXSkgPT4ge1xyXG4gICAgbGV0IHNoaXBSZWYgPSBudWxsO1xyXG4gICAgbGV0IGlzSGl0ID0gZmFsc2U7XHJcbiAgICBjb25zdCBoaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgaXNIaXQgPSB0cnVlO1xyXG4gICAgICAgIGNvbnN0IG91dHB1dCA9IHtoaXQ6IGZhbHNlLCBzdW5rOiBcIlwifVxyXG4gICAgICAgIGlmKHNoaXBSZWYpe1xyXG4gICAgICAgICAgICBvdXRwdXQuaGl0ID0gdHJ1ZVxyXG4gICAgICAgICAgICBvdXRwdXQuc3VuayA9IHNoaXBSZWYuaGl0KClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXRwdXRcclxuICAgICAgICB9XHJcblxyXG4gICAgY29uc3Qgc3ltYm9sID0gKCkgPT4gXHJcbiAgICAgICAgaXNIaXQgPyBcInhcIiA6XHJcbiAgICAgICAgc2hpcFJlZiA/IHNoaXBSZWYubmFtZS5zbGljZSgwLCAxKSA6XHJcbiAgICAgICAgXCIuXCI7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjb29yZHMsXHJcbiAgICAgICAgZ2V0IHNoaXBSZWYoKSB7IHJldHVybiBzaGlwUmVmOyB9LFxyXG4gICAgICAgIHNldCBzaGlwUmVmKG5ld1NoaXApIHsgc2hpcFJlZiA9IG5ld1NoaXA7IH0sXHJcbiAgICAgICAgZ2V0IGlzSGl0KCkgeyByZXR1cm4gaXNIaXQ7IH0sXHJcbiAgICAgICAgZ2V0IHN5bWJvbCgpIHsgcmV0dXJuIHN5bWJvbCgpOyB9LFxyXG4gICAgICAgIGhpdCxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZUJvYXJkID0gKHdpZHRoLCBoZWlnaHQpID0+IHtcclxuICAgIGNvbnN0IGJvYXJkID0gW11cclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgd2lkdGg7IHgrKykge1xyXG4gICAgICAgIGxldCByb3cgPSBbXVxyXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgaGVpZ2h0OyB5KyspIHtcclxuICAgICAgICAgICAgcm93LnB1c2goR2FtZWNlbGwoW3gsIHldKSlcclxuICAgICAgICB9XHJcbiAgICAgICAgYm9hcmQucHVzaChyb3cpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gYm9hcmRcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IEdhbWVib2FyZCA9IChmbGVldCwgYm9hcmQgPSBpbml0aWFsaXplQm9hcmQoMTAsIDEwKSwgKSA9PiB7XHJcbiAgICBjb25zdCBkYXRhID0gKCkgPT4gYm9hcmQubWFwKGNlbGwgPT4gY2VsbC5kYXRhKCkpXHJcbiAgICBjb25zdCBnZXRDZWxsID0gKGNvb3JkcykgPT4ge1xyXG4gICAgICAgIGlmKGNvb3Jkcy5zb21lKHggPT4geCA8IDAgfCB4ID4gYm9hcmQubGVuZ3RoIC0gMSkpe1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwib3V0IG9mIGJvdW5kc1wiKVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBbeCwgeV0gPSBjb29yZHNcclxuICAgICAgICByZXR1cm4gYm9hcmRbeF1beV1cclxuICAgIH1cclxuXHJcbiAgICBmbGVldC5zaGlwQ29vcmRpbmF0ZXMuZm9yRWFjaCgoW2Nvb3JkLCBzaGlwXSkgPT4gZ2V0Q2VsbChjb29yZCkuc2hpcFJlZiA9IHNoaXApXHJcblxyXG4gICAgY29uc3QgZ2V0Q2VsbHMgPSAoKSA9PiBib2FyZC5mbGF0KClcclxuICAgIGNvbnN0IGdldEhpdENvdW50ID0gKCkgPT4gZ2V0Q2VsbHMoKS5maWx0ZXIoeCA9PiB4LmlzSGl0KS5sZW5ndGhcclxuICAgIGNvbnN0IGdldE9wZW5DZWxscyA9ICgpID0+IGdldENlbGxzKCkuZmlsdGVyKHggPT4gIXguaXNIaXQpXHJcbiAgICBjb25zdCBnZXRSYW5kb21TaG90ID0gKCkgPT4gY2hvb3NlUmFuZG9tRWxlbWVudChnZXRPcGVuQ2VsbHMoKSkuY29vcmRzXHJcbiAgICBjb25zdCBnZXRSYW5kb21Db29yZHMgPSAoKSA9PiBjaG9vc2VSYW5kb21FbGVtZW50KGdldENlbGxzKCkpLmNvb3Jkc1xyXG4gICAgY29uc3QgZ2V0Qm9hcmQgPSAoKSA9PiBib2FyZFxyXG5cclxuICAgIGNvbnN0IHByaW50ID0gKCkgPT4gYm9hcmQubWFwKHggPT4geC5tYXAoeSA9PiB5LnN5bWJvbCkuam9pbihcIiBcIikpLmpvaW4oXCJcXG5cIilcclxuICAgIGNvbnN0IHJlY2VpdmVBdHRhY2sgPSAoY29vcmRzKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2VsbCA9IGdldENlbGwoY29vcmRzKVxyXG4gICAgICAgIGlmKGNlbGwuaXNIaXQpe3Rocm93IG5ldyBFcnJvcihcImNlbGwgYWxyZWFkeSBoaXRcIil9XHJcbiAgICAgICAgY29uc3QgaGl0UmVwb3J0ID0gY2VsbC5oaXQoKVxyXG4gICAgICAgIGhpdFJlcG9ydC5hbGxTdW5rID0gZmxlZXQuaXNBbGxTdW5rKClcclxuICAgICAgICBoaXRSZXBvcnQuY29vcmRzID0gY29vcmRzXHJcbiAgICAgICAgcmV0dXJuIGhpdFJlcG9ydFxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7IFxyXG4gICAgICAgIHJlY2VpdmVBdHRhY2ssIFxyXG4gICAgICAgIGdldENlbGwsXHJcbiAgICAgICAgZ2V0Q2VsbHMsXHJcbiAgICAgICAgZ2V0SGl0Q291bnQsXHJcbiAgICAgICAgZ2V0UmFuZG9tU2hvdCxcclxuICAgICAgICBnZXRSYW5kb21Db29yZHMsXHJcbiAgICAgICAgcHJpbnQsXHJcbiAgICAgICAgZ2V0Qm9hcmQsXHJcbiAgICAgICAgZGF0YSxcclxuICAgIH1cclxufSIsImltcG9ydCB7IGFkZCwgaXNQb2ludFZhbGlkLCBzY2FsZSwgZ2V0UmFuZG9tQ29vcmRzLCBnZXRSYW5kb21EaXJlY3Rpb24gfSBmcm9tIFwiLi92ZWN0b3JcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBkZWZhdWx0U2hpcHMgPSAoKSA9PiBbXHJcbiAgICBTaGlwKFwiQ2FycmllclwiLCA1KSxcclxuICAgIFNoaXAoXCJCYXR0bGVzaGlwXCIsIDQpLFxyXG4gICAgU2hpcChcIkNydWlzZXJcIiwgMyksXHJcbiAgICBTaGlwKFwiU3VibWFyaW5lXCIsIDMpLFxyXG4gICAgU2hpcChcIkRlc3Ryb3llclwiLCAyKSxcclxuXVxyXG5cclxuZXhwb3J0IGNvbnN0IFNoaXAgPSAobmFtZSA9IFwiXCIsIGxlbmd0aCA9IDEpID0+IHtcclxuICAgIGxldCBoaXRDb3VudCA9IDA7XHJcbiAgICBjb25zdCBpc1N1bmsgPSAoKSA9PiBoaXRDb3VudCA+PSBsZW5ndGg7XHJcbiAgICBjb25zdCBoaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgaGl0Q291bnQrKztcclxuICAgICAgICByZXR1cm4gaXNTdW5rKCkgPyBuYW1lIDogXCJcIjtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIGxlbmd0aCxcclxuICAgICAgICBpc1N1bmssXHJcbiAgICAgICAgaGl0LFxyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBzaGlwQ29vcmRzID0gKGxlbmd0aCwgbG9jYXRpb24sIGRpcmVjdGlvbikgPT5cclxuICAgICghbG9jYXRpb24gfCAhZGlyZWN0aW9uKSA/IFxyXG4gICAgICAgIFtdIDogXHJcbiAgICAgICAgWy4uLkFycmF5KGxlbmd0aCkua2V5cygpXS5tYXAoeCA9PiBhZGQobG9jYXRpb24sIHNjYWxlKGRpcmVjdGlvbiwgeCkpKVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldEtleXMgPSBhcnJheSA9PiBhcnJheS5tYXAoKFtrZXksIHZhbHVlXSkgPT4ga2V5KVxyXG5jb25zdCBnZXRWYWx1ZXMgPSBhcnJheSA9PiBhcnJheS5tYXAoKFtrZXksIHZhbHVlXSkgPT4gdmFsdWUpXHJcbmNvbnN0IGV4Y2x1ZGVWYWx1ZSA9IChhcnJheSwgZXhjbHVkZWRWYWx1ZSkgPT4gYXJyYXkuZmlsdGVyKChba2V5LCB2YWx1ZV0pID0+IHZhbHVlICE9IGV4Y2x1ZGVkVmFsdWUpXHJcbmV4cG9ydCBjb25zdCBpc09jY3VwaWVkID0gKG1hcCwgY29vcmQpID0+IG5ldyBTZXQoZ2V0S2V5cyhtYXApLm1hcCh4ID0+IHgudG9TdHJpbmcoKSkpLmhhcyhjb29yZC50b1N0cmluZygpKVxyXG5cclxuZXhwb3J0IGNvbnN0IEZsZWV0ID0gKGJvYXJkU2l6ZSA9IDEwKSA9PiB7XHJcbiAgICBsZXQgc2hpcENvb3JkaW5hdGVzID0gW11cclxuICAgIGNvbnN0IGZsZWV0SXNPY2N1cGllZCA9IChjb29yZCkgPT4gaXNPY2N1cGllZChzaGlwQ29vcmRpbmF0ZXMsIGNvb3JkKVxyXG5cclxuICAgIGNvbnN0IHBsYWNlID0gKHNoaXAsIGxvY2F0aW9uLCBkaXJlY3Rpb24pID0+IHtcclxuICAgICAgICBjb25zdCBsb2NhdGlvbnMgPSBzaGlwQ29vcmRzKHNoaXAubGVuZ3RoLCBsb2NhdGlvbiwgZGlyZWN0aW9uKVxyXG4gICAgICAgIGlmKGludmFsaWRQbGFjZShsb2NhdGlvbnMpKXtyZXR1cm4gZmFsc2V9XHJcbiAgICAgICAgc2hpcENvb3JkaW5hdGVzID0gc2hpcENvb3JkaW5hdGVzLmNvbmNhdChsb2NhdGlvbnMubWFwKHggPT4gW3gsIHNoaXBdKSlcclxuICAgICAgICByZXR1cm4gc2hpcENvb3JkaW5hdGVzXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaW52YWxpZFBsYWNlID0gKGxvY2F0aW9ucykgPT4gbG9jYXRpb25zLnNvbWUoY29vcmQgPT4gZmxlZXRJc09jY3VwaWVkKGNvb3JkKSB8ICFpc1BvaW50VmFsaWQoY29vcmQsIGJvYXJkU2l6ZSkpXHJcblxyXG4gICAgY29uc3QgcmVtb3ZlID0gKHNoaXApID0+IHtcclxuICAgICAgICBzaGlwQ29vcmRpbmF0ZXMgPSBleGNsdWRlVmFsdWUoc2hpcENvb3JkaW5hdGVzLCBzaGlwKVxyXG4gICAgICAgIHJldHVybiBzaGlwQ29vcmRpbmF0ZXNcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBnZW5lcmF0ZVJhbmRvbVBsYWNlbWVudCA9ICgpID0+ICh7XHJcbiAgICAgICAgY29vcmRzOiBnZXRSYW5kb21Db29yZHMoYm9hcmRTaXplKSwgXHJcbiAgICAgICAgZGlyZWN0aW9uOiBnZXRSYW5kb21EaXJlY3Rpb24oKSxcclxuICAgIH0pXHJcblxyXG4gICAgY29uc3QgcGxhY2VTaGlwcyA9IChzaGlwcywgcG9zaXRpb25HZW5lcmF0b3IgPSBnZW5lcmF0ZVJhbmRvbVBsYWNlbWVudCkgPT4ge1xyXG4gICAgICAgIHNoaXBzLmZvckVhY2goc2hpcCA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzdWNjZXNzID0gZmFsc2VcclxuICAgICAgICAgICAgd2hpbGUgKCFzdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBnZW4gPSBwb3NpdGlvbkdlbmVyYXRvcigpXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzID0gISFwbGFjZShzaGlwLCBnZW4uY29vcmRzLCBnZW4uZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9O1xyXG4gICAgY29uc3Qgc2hpcHMgPSAoKSA9PiBcclxuICAgICAgICBbLi4ubmV3IFNldChnZXRWYWx1ZXMoc2hpcENvb3JkaW5hdGVzKSldXHJcblxyXG4gICAgY29uc3QgaXNBbGxTdW5rID0gKCkgPT4gXHJcbiAgICAgICAgc2hpcHMoKS5ldmVyeSh4ID0+IHguaXNTdW5rKCkpXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXQgc2hpcENvb3JkaW5hdGVzKCl7cmV0dXJuIHNoaXBDb29yZGluYXRlc30sXHJcbiAgICAgICAgc2hpcHMsXHJcbiAgICAgICAgaXNBbGxTdW5rLFxyXG4gICAgICAgIHBsYWNlLFxyXG4gICAgICAgIHBsYWNlU2hpcHMsXHJcbiAgICAgICAgcmVtb3ZlLFxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNvbnN0IGFkZCA9ICh2ZWN0b3IxLCB2ZWN0b3IyKSA9PiB7XHJcbiAgICByZXR1cm4gdmVjdG9yMS5tYXAoKHgsIGkpID0+IHggKyB2ZWN0b3IyW2ldKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc3VidHJhY3QgPSAodmVjdG9yMSwgdmVjdG9yMikgPT4ge1xyXG4gICAgcmV0dXJuIHZlY3RvcjEubWFwKCh4LCBpKSA9PiB4IC0gdmVjdG9yMltpXSlcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG11bHRpcGx5ID0gKHZlY3RvcjEsIHZlY3RvcjIpID0+IHtcclxuICAgIHJldHVybiB2ZWN0b3IxLm1hcCgoeCwgaSkgPT4geCAqIHZlY3RvcjJbaV0pXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzY2FsZSA9ICh2ZWN0b3IxLCBzY2FsYXIpID0+IHtcclxuICAgIHJldHVybiB2ZWN0b3IxLm1hcCh4ID0+IHggKiBzY2FsYXIpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByYW5kb21JbnQgPSAobWF4KSA9PiB7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKm1heClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNob29zZVJhbmRvbUVsZW1lbnQgPSAoYXJyYXkpID0+IGFycmF5W3JhbmRvbUludChhcnJheS5sZW5ndGggLTEpXVxyXG5cclxuZXhwb3J0IGNvbnN0IGlzUG9pbnRWYWxpZCA9IChjb29yZHMsIGJvYXJkU2l6ZSkgPT5cclxuICAgICFjb29yZHMuc29tZSh4ID0+IHggPCAwIHwgeCA+IGJvYXJkU2l6ZSAtIDEpXHJcblxyXG5leHBvcnQgY29uc3QgZ2V0UmFuZG9tQ29vcmRzID0gKGJvYXJkU2l6ZSkgPT4gW3JhbmRvbUludChib2FyZFNpemUpLCByYW5kb21JbnQoYm9hcmRTaXplKV1cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRSYW5kb21EaXJlY3Rpb24gPSAoKSA9PiBcclxuICAgIGNob29zZVJhbmRvbUVsZW1lbnQoW1sxLDBdLCBbMCwxXSwgWy0xLDBdLCBbMCwtMV1dKVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IEdhbWUsIFJlbmRlcmVyIH0gZnJvbSBcIi4vZ2FtZVwiXHJcbmltcG9ydCB7IEdhbWVib2FyZCB9IGZyb20gXCIuL2dhbWVib2FyZFwiXHJcbmltcG9ydCB7IEZsZWV0LCBkZWZhdWx0U2hpcHMgfSBmcm9tIFwiLi9zaGlwXCJcclxuY29uc3QgZmxlZXRzID0gW0ZsZWV0KCksIEZsZWV0KCldXHJcbmZsZWV0cy5mb3JFYWNoKGZsZWV0ID0+IHtcclxuICAgIGZsZWV0LnBsYWNlU2hpcHMoZGVmYXVsdFNoaXBzKCkpXHJcbn0pXHJcbmNvbnN0IGdhbWUgPSBHYW1lKEdhbWVib2FyZChmbGVldHNbMF0pLCBHYW1lYm9hcmQoZmxlZXRzWzFdKSlcclxuY29uc3Qgbm90aWZTdHJpbmcgPSAoZXZlbnQpID0+IGAke2V2ZW50LnBsYXllck5hbWV9IGZpcmVkIGF0ICR7ZXZlbnQuY29vcmRzfSBhbmQgJHtldmVudC5oaXQgPyBcImhpdFwiIDogXCJtaXNzZWRcIn0uICR7ZXZlbnQuc3VuayA/IGBBICR7ZXZlbnQuc3Vua30gd2FzIHN1bmsuYCA6IFwiXCJ9ICR7ZXZlbnQuYWxsU3VuayA/IGBBbGwgc2hpcHMgYXJlIHN1bmsuICR7ZXZlbnQucGxheWVyTmFtZX0gd2lucy5gIDogXCJcIn1gXHJcbmNvbnN0IGZuQ2xpY2sgPSAoY29vcmRzKSA9PiB7XHJcbiAgICBjb25zdCBldmVudHMgPSBnYW1lLnN0ZXAoY29vcmRzKVxyXG4gICAgZXZlbnRzLmZvckVhY2goKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgcmVuZGVyZXIubG9nKG5vdGlmU3RyaW5nKGV2ZW50KSlcclxuICAgIH0pXHJcbiAgICByZW5kZXJlci5yZW5kZXIoZ2FtZSlcclxufVxyXG5jb25zdCByZW5kZXJlciA9IFJlbmRlcmVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpblwiKSwgZG9jdW1lbnQsIGZuQ2xpY2spXHJcbnJlbmRlcmVyLmluaXQoZ2FtZSkiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=