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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ051QztBQUNBO0FBQ0s7QUFDNUMsZ0JBQWdCLDRDQUFLLElBQUksNENBQUs7QUFDOUI7QUFDQSxxQkFBcUIsbURBQVk7QUFDakMsQ0FBQztBQUNELGFBQWEsMkNBQUksQ0FBQyxxREFBUyxhQUFhLHFEQUFTO0FBQ2pELGtDQUFrQyxrQkFBa0IsV0FBVyxjQUFjLE1BQU0sNkJBQTZCLElBQUksa0JBQWtCLFlBQVksaUJBQWlCLEVBQUUsdUNBQXVDLGtCQUFrQixZQUFZO0FBQzFPO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxpQkFBaUIsK0NBQVE7QUFDekIsbUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovLy8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovLy8uL3NyYy92ZWN0b3IuanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBHYW1lID0gKHBsYXllckJvYXJkLCBjb21wdXRlckJvYXJkKSA9PiB7XG4gICAgY29uc3Qgc3RlcCA9IChjb29yZHMpID0+IHtcbiAgICAgICAgY29uc3QgY29tcHV0ZXJFdmVudCA9IGNvbXB1dGVyQm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZHMpXG4gICAgICAgIGNvbXB1dGVyRXZlbnQucGxheWVyTmFtZSA9IFwiWW91XCJcbiAgICAgICAgY29uc3QgcGxheWVyRXZlbnQgPSBwbGF5ZXJCb2FyZC5yZWNlaXZlQXR0YWNrKHBsYXllckJvYXJkLmdldFJhbmRvbVNob3QoKSlcbiAgICAgICAgcGxheWVyRXZlbnQucGxheWVyTmFtZSA9IFwiQ29tcHV0ZXJcIlxuICAgICAgICByZXR1cm4gW2NvbXB1dGVyRXZlbnQsIHBsYXllckV2ZW50XVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIHN0ZXAsXG4gICAgICAgIHBsYXllcjogcGxheWVyQm9hcmQsXG4gICAgICAgIGNvbXB1dGVyOiBjb21wdXRlckJvYXJkLFxuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IFJlbmRlcmVyID0gKGZyYW1lLCBkb2MsIGZuQ2xpY2spID0+IHtcbiAgICBsZXQgcGxheWVyQm9hcmRSZWZcbiAgICBsZXQgY29tcHV0ZXJCb2FyZFJlZlxuICAgIGxldCBsb2dSZWZcbiAgICBjb25zdCByZW5kZXJDZWxsID0gKGNlbGwsIGlzUGxheWVyKSA9PiB7XG4gICAgICAgIGNvbnN0IGNlbGxET00gPSBkb2MuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKVxuICAgICAgICBjZWxsRE9NLmNsYXNzTGlzdC5hZGQoXCJnYW1lY2VsbFwiKVxuICAgICAgICBpZihjZWxsLmlzSGl0KXtcbiAgICAgICAgICAgIGNlbGxET00uY2xhc3NMaXN0LmFkZChjZWxsLnNoaXBSZWYgPyBcImdhbWVjZWxsLS1oaXRcIiA6IFwiZ2FtZWNlbGwtLW1pc3NcIilcbiAgICAgICAgfVxuICAgICAgICBpZihpc1BsYXllcil7XG4gICAgICAgICAgICBjZWxsRE9NLmlubmVyVGV4dCA9IGNlbGwuc2hpcFJlZiA/IGNlbGwuc3ltYm9sIDogXCJcIlxuICAgICAgICB9XG4gICAgICAgIGlmKCFpc1BsYXllciAmJiAhY2VsbC5pc0hpdCl7XG4gICAgICAgICAgICBjZWxsRE9NLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtmbkNsaWNrKGNlbGwuY29vcmRzKX0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNlbGxET01cbiAgICB9XG4gICAgY29uc3QgcmVuZGVyQm9hcmQgPSAoYm9hcmQsIGlzUGxheWVyID0gZmFsc2UpID0+IHtcbiAgICAgICAgY29uc3QgYm9hcmRET00gPSBkb2MuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgICBib2FyZERPTS5jbGFzc0xpc3QuYWRkKFwiZ2FtZWJvYXJkXCIpXG5cbiAgICAgICAgY29uc3QgY2VsbHMgPSBib2FyZC5nZXRDZWxscygpLm1hcCggeCA9PiByZW5kZXJDZWxsKHgsIGlzUGxheWVyKSlcbiAgICAgICAgZm9yKGxldCBlIG9mIGNlbGxzKXtcbiAgICAgICAgICAgIGJvYXJkRE9NLmFwcGVuZENoaWxkKGUpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJvYXJkRE9NXG4gICAgfVxuICAgIGNvbnN0IGluaXQgPSAoZ2FtZSkgPT4ge1xuICAgICAgICBjb25zdCBwbGF5ZXJCb2FyZCA9IHJlbmRlckJvYXJkKGdhbWUucGxheWVyLCB0cnVlKVxuICAgICAgICBjb25zdCBjb21wdXRlckJvYXJkID0gcmVuZGVyQm9hcmQoZ2FtZS5jb21wdXRlcilcbiAgICAgICAgbG9nUmVmID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgICAgcGxheWVyQm9hcmRSZWYgPSBwbGF5ZXJCb2FyZFxuICAgICAgICBjb21wdXRlckJvYXJkUmVmID0gY29tcHV0ZXJCb2FyZFxuICAgICAgICBmcmFtZS5hcHBlbmRDaGlsZChwbGF5ZXJCb2FyZClcbiAgICAgICAgZnJhbWUuYXBwZW5kQ2hpbGQobG9nUmVmKVxuICAgICAgICBmcmFtZS5hcHBlbmRDaGlsZChjb21wdXRlckJvYXJkKVxuXG4gICAgfVxuICAgIGNvbnN0IHJlbmRlciA9IChnYW1lKSA9PiB7XG4gICAgICAgIGNvbnN0IHBsYXllckJvYXJkID0gcmVuZGVyQm9hcmQoZ2FtZS5wbGF5ZXIsIHRydWUpXG4gICAgICAgIHBsYXllckJvYXJkUmVmLnJlcGxhY2VXaXRoKHBsYXllckJvYXJkKVxuICAgICAgICBwbGF5ZXJCb2FyZFJlZiA9IHBsYXllckJvYXJkXG4gICAgICAgIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSByZW5kZXJCb2FyZChnYW1lLmNvbXB1dGVyKVxuICAgICAgICBjb21wdXRlckJvYXJkUmVmLnJlcGxhY2VXaXRoKGNvbXB1dGVyQm9hcmQpXG4gICAgICAgIGNvbXB1dGVyQm9hcmRSZWYgPSBjb21wdXRlckJvYXJkXG4gICAgfVxuICAgIGNvbnN0IGxvZyA9IChtZXNzYWdlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld01lc3NhZ2UgPSBkb2MuY3JlYXRlRWxlbWVudChcInBcIilcbiAgICAgICAgbmV3TWVzc2FnZS5pbm5lclRleHQgPSBtZXNzYWdlXG4gICAgICAgIGxvZ1JlZi5wcmVwZW5kKG5ld01lc3NhZ2UpXG4gICAgfVxuICAgIHJldHVybiB7cmVuZGVyLCBpbml0LCBsb2d9XG59IiwiaW1wb3J0IHsgU2hpcCwgZGVmYXVsdFNoaXBzLCBzaGlwQ29vcmRzIH0gZnJvbSBcIi4vc2hpcFwiXG5pbXBvcnQgeyBhZGQsIGNob29zZVJhbmRvbUVsZW1lbnQsIHJhbmRvbUludCwgc2NhbGUsIGRpcmVjdGlvbkFycmF5IH0gZnJvbSBcIi4vdmVjdG9yXCJcblxuLy9hIHZlY3RvciBpcyBhbiBhcnJheSBvZiBbeCwgeV0uXG5cbmV4cG9ydCBjb25zdCBHYW1lY2VsbCA9IChjb29yZHMgPSBbMCwwXSkgPT4ge1xuICAgIGxldCBzaGlwUmVmID0gbnVsbDtcbiAgICBsZXQgaXNIaXQgPSBmYWxzZTtcbiAgICBjb25zdCBoaXQgPSAoKSA9PiB7XG4gICAgICAgIGlzSGl0ID0gdHJ1ZTtcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0ge2hpdDogZmFsc2UsIHN1bms6IFwiXCJ9XG4gICAgICAgIGlmKHNoaXBSZWYpe1xuICAgICAgICAgICAgb3V0cHV0LmhpdCA9IHRydWVcbiAgICAgICAgICAgIG91dHB1dC5zdW5rID0gc2hpcFJlZi5oaXQoKVxuICAgICAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0XG4gICAgICAgIH1cblxuICAgIGNvbnN0IHN5bWJvbCA9ICgpID0+IFxuICAgICAgICBpc0hpdCA/IFwieFwiIDpcbiAgICAgICAgc2hpcFJlZiA/IHNoaXBSZWYubmFtZS5zbGljZSgwLCAxKSA6XG4gICAgICAgIFwiLlwiO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29vcmRzLFxuICAgICAgICBnZXQgc2hpcFJlZigpIHsgcmV0dXJuIHNoaXBSZWY7IH0sXG4gICAgICAgIHNldCBzaGlwUmVmKG5ld1NoaXApIHsgc2hpcFJlZiA9IG5ld1NoaXA7IH0sXG4gICAgICAgIGdldCBpc0hpdCgpIHsgcmV0dXJuIGlzSGl0OyB9LFxuICAgICAgICBnZXQgc3ltYm9sKCkgeyByZXR1cm4gc3ltYm9sKCk7IH0sXG4gICAgICAgIGhpdCxcbiAgICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxpemVCb2FyZCA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XG4gICAgY29uc3QgYm9hcmQgPSBbXVxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgd2lkdGg7IHgrKykge1xuICAgICAgICBsZXQgcm93ID0gW11cbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBoZWlnaHQ7IHkrKykge1xuICAgICAgICAgICAgcm93LnB1c2goR2FtZWNlbGwoW3gsIHldKSlcbiAgICAgICAgfVxuICAgICAgICBib2FyZC5wdXNoKHJvdylcbiAgICB9XG4gICAgcmV0dXJuIGJvYXJkXG59XG5cbmV4cG9ydCBjb25zdCBHYW1lYm9hcmQgPSAoZmxlZXQsIGJvYXJkID0gaW5pdGlhbGl6ZUJvYXJkKDEwLCAxMCksICkgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSAoKSA9PiBib2FyZC5tYXAoY2VsbCA9PiBjZWxsLmRhdGEoKSlcbiAgICBjb25zdCBnZXRDZWxsID0gKGNvb3JkcykgPT4ge1xuICAgICAgICBpZihjb29yZHMuc29tZSh4ID0+IHggPCAwIHwgeCA+IGJvYXJkLmxlbmd0aCAtIDEpKXtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJvdXQgb2YgYm91bmRzXCIpXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgW3gsIHldID0gY29vcmRzXG4gICAgICAgIHJldHVybiBib2FyZFt4XVt5XVxuICAgIH1cblxuICAgIGZsZWV0LnNoaXBDb29yZGluYXRlcy5mb3JFYWNoKChbY29vcmQsIHNoaXBdKSA9PiBnZXRDZWxsKGNvb3JkKS5zaGlwUmVmID0gc2hpcClcblxuICAgIGNvbnN0IGdldENlbGxzID0gKCkgPT4gYm9hcmQuZmxhdCgpXG4gICAgY29uc3QgZ2V0SGl0Q291bnQgPSAoKSA9PiBnZXRDZWxscygpLmZpbHRlcih4ID0+IHguaXNIaXQpLmxlbmd0aFxuICAgIGNvbnN0IGdldE9wZW5DZWxscyA9ICgpID0+IGdldENlbGxzKCkuZmlsdGVyKHggPT4gIXguaXNIaXQpXG4gICAgY29uc3QgZ2V0UmFuZG9tU2hvdCA9ICgpID0+IGNob29zZVJhbmRvbUVsZW1lbnQoZ2V0T3BlbkNlbGxzKCkpLmNvb3Jkc1xuICAgIGNvbnN0IGdldFJhbmRvbUNvb3JkcyA9ICgpID0+IGNob29zZVJhbmRvbUVsZW1lbnQoZ2V0Q2VsbHMoKSkuY29vcmRzXG4gICAgY29uc3QgZ2V0Qm9hcmQgPSAoKSA9PiBib2FyZFxuXG4gICAgY29uc3QgcHJpbnQgPSAoKSA9PiBib2FyZC5tYXAoeCA9PiB4Lm1hcCh5ID0+IHkuc3ltYm9sKS5qb2luKFwiIFwiKSkuam9pbihcIlxcblwiKVxuICAgIGNvbnN0IHJlY2VpdmVBdHRhY2sgPSAoY29vcmRzKSA9PiB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBnZXRDZWxsKGNvb3JkcylcbiAgICAgICAgaWYoY2VsbC5pc0hpdCl7dGhyb3cgbmV3IEVycm9yKFwiY2VsbCBhbHJlYWR5IGhpdFwiKX1cbiAgICAgICAgY29uc3QgaGl0UmVwb3J0ID0gY2VsbC5oaXQoKVxuICAgICAgICBoaXRSZXBvcnQuYWxsU3VuayA9IGZsZWV0LmlzQWxsU3VuaygpXG4gICAgICAgIGhpdFJlcG9ydC5jb29yZHMgPSBjb29yZHNcbiAgICAgICAgcmV0dXJuIGhpdFJlcG9ydFxuICAgIH1cblxuICAgIHJldHVybiB7IFxuICAgICAgICByZWNlaXZlQXR0YWNrLCBcbiAgICAgICAgZ2V0Q2VsbCxcbiAgICAgICAgZ2V0Q2VsbHMsXG4gICAgICAgIGdldEhpdENvdW50LFxuICAgICAgICBnZXRSYW5kb21TaG90LFxuICAgICAgICBnZXRSYW5kb21Db29yZHMsXG4gICAgICAgIHByaW50LFxuICAgICAgICBnZXRCb2FyZCxcbiAgICAgICAgZGF0YSxcbiAgICB9XG59IiwiaW1wb3J0IHsgYWRkLCBpc1BvaW50VmFsaWQsIHNjYWxlLCBnZXRSYW5kb21Db29yZHMsIGdldFJhbmRvbURpcmVjdGlvbiB9IGZyb20gXCIuL3ZlY3RvclwiO1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdFNoaXBzID0gKCkgPT4gW1xuICAgIFNoaXAoXCJDYXJyaWVyXCIsIDUpLFxuICAgIFNoaXAoXCJCYXR0bGVzaGlwXCIsIDQpLFxuICAgIFNoaXAoXCJDcnVpc2VyXCIsIDMpLFxuICAgIFNoaXAoXCJTdWJtYXJpbmVcIiwgMyksXG4gICAgU2hpcChcIkRlc3Ryb3llclwiLCAyKSxcbl1cblxuZXhwb3J0IGNvbnN0IFNoaXAgPSAobmFtZSA9IFwiXCIsIGxlbmd0aCA9IDEpID0+IHtcbiAgICBsZXQgaGl0Q291bnQgPSAwO1xuICAgIGNvbnN0IGlzU3VuayA9ICgpID0+IGhpdENvdW50ID49IGxlbmd0aDtcbiAgICBjb25zdCBoaXQgPSAoKSA9PiB7XG4gICAgICAgIGhpdENvdW50Kys7XG4gICAgICAgIHJldHVybiBpc1N1bmsoKSA/IG5hbWUgOiBcIlwiO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lLFxuICAgICAgICBsZW5ndGgsXG4gICAgICAgIGlzU3VuayxcbiAgICAgICAgaGl0LFxuICAgIH07XG59O1xuXG5leHBvcnQgY29uc3Qgc2hpcENvb3JkcyA9IChsZW5ndGgsIGxvY2F0aW9uLCBkaXJlY3Rpb24pID0+XG4gICAgKCFsb2NhdGlvbiB8ICFkaXJlY3Rpb24pID8gXG4gICAgICAgIFtdIDogXG4gICAgICAgIFsuLi5BcnJheShsZW5ndGgpLmtleXMoKV0ubWFwKHggPT4gYWRkKGxvY2F0aW9uLCBzY2FsZShkaXJlY3Rpb24sIHgpKSlcblxuZXhwb3J0IGNvbnN0IGdldEtleXMgPSBhcnJheSA9PiBhcnJheS5tYXAoKFtrZXksIHZhbHVlXSkgPT4ga2V5KVxuY29uc3QgZ2V0VmFsdWVzID0gYXJyYXkgPT4gYXJyYXkubWFwKChba2V5LCB2YWx1ZV0pID0+IHZhbHVlKVxuY29uc3QgZXhjbHVkZVZhbHVlID0gKGFycmF5LCBleGNsdWRlZFZhbHVlKSA9PiBhcnJheS5maWx0ZXIoKFtrZXksIHZhbHVlXSkgPT4gdmFsdWUgIT0gZXhjbHVkZWRWYWx1ZSlcbmV4cG9ydCBjb25zdCBpc09jY3VwaWVkID0gKG1hcCwgY29vcmQpID0+IG5ldyBTZXQoZ2V0S2V5cyhtYXApLm1hcCh4ID0+IHgudG9TdHJpbmcoKSkpLmhhcyhjb29yZC50b1N0cmluZygpKVxuXG5leHBvcnQgY29uc3QgRmxlZXQgPSAoYm9hcmRTaXplID0gMTApID0+IHtcbiAgICBsZXQgc2hpcENvb3JkaW5hdGVzID0gW11cbiAgICBjb25zdCBmbGVldElzT2NjdXBpZWQgPSAoY29vcmQpID0+IGlzT2NjdXBpZWQoc2hpcENvb3JkaW5hdGVzLCBjb29yZClcblxuICAgIGNvbnN0IHBsYWNlID0gKHNoaXAsIGxvY2F0aW9uLCBkaXJlY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgbG9jYXRpb25zID0gc2hpcENvb3JkcyhzaGlwLmxlbmd0aCwgbG9jYXRpb24sIGRpcmVjdGlvbilcbiAgICAgICAgaWYoaW52YWxpZFBsYWNlKGxvY2F0aW9ucykpe3JldHVybiBmYWxzZX1cbiAgICAgICAgc2hpcENvb3JkaW5hdGVzID0gc2hpcENvb3JkaW5hdGVzLmNvbmNhdChsb2NhdGlvbnMubWFwKHggPT4gW3gsIHNoaXBdKSlcbiAgICAgICAgcmV0dXJuIHNoaXBDb29yZGluYXRlc1xuICAgIH1cblxuICAgIGNvbnN0IGludmFsaWRQbGFjZSA9IChsb2NhdGlvbnMpID0+IGxvY2F0aW9ucy5zb21lKGNvb3JkID0+IGZsZWV0SXNPY2N1cGllZChjb29yZCkgfCAhaXNQb2ludFZhbGlkKGNvb3JkLCBib2FyZFNpemUpKVxuXG4gICAgY29uc3QgcmVtb3ZlID0gKHNoaXApID0+IHtcbiAgICAgICAgc2hpcENvb3JkaW5hdGVzID0gZXhjbHVkZVZhbHVlKHNoaXBDb29yZGluYXRlcywgc2hpcClcbiAgICAgICAgcmV0dXJuIHNoaXBDb29yZGluYXRlc1xuICAgIH1cblxuICAgIGNvbnN0IGdlbmVyYXRlUmFuZG9tUGxhY2VtZW50ID0gKCkgPT4gKHtcbiAgICAgICAgY29vcmRzOiBnZXRSYW5kb21Db29yZHMoYm9hcmRTaXplKSwgXG4gICAgICAgIGRpcmVjdGlvbjogZ2V0UmFuZG9tRGlyZWN0aW9uKCksXG4gICAgfSlcblxuICAgIGNvbnN0IHBsYWNlU2hpcHMgPSAoc2hpcHMsIHBvc2l0aW9uR2VuZXJhdG9yID0gZ2VuZXJhdGVSYW5kb21QbGFjZW1lbnQpID0+IHtcbiAgICAgICAgc2hpcHMuZm9yRWFjaChzaGlwID0+IHtcbiAgICAgICAgICAgIGxldCBzdWNjZXNzID0gZmFsc2VcbiAgICAgICAgICAgIHdoaWxlICghc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdlbiA9IHBvc2l0aW9uR2VuZXJhdG9yKClcbiAgICAgICAgICAgICAgICBzdWNjZXNzID0gISFwbGFjZShzaGlwLCBnZW4uY29vcmRzLCBnZW4uZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9O1xuICAgIGNvbnN0IHNoaXBzID0gKCkgPT4gXG4gICAgICAgIFsuLi5uZXcgU2V0KGdldFZhbHVlcyhzaGlwQ29vcmRpbmF0ZXMpKV1cblxuICAgIGNvbnN0IGlzQWxsU3VuayA9ICgpID0+IFxuICAgICAgICBzaGlwcygpLmV2ZXJ5KHggPT4geC5pc1N1bmsoKSlcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldCBzaGlwQ29vcmRpbmF0ZXMoKXtyZXR1cm4gc2hpcENvb3JkaW5hdGVzfSxcbiAgICAgICAgc2hpcHMsXG4gICAgICAgIGlzQWxsU3VuayxcbiAgICAgICAgcGxhY2UsXG4gICAgICAgIHBsYWNlU2hpcHMsXG4gICAgICAgIHJlbW92ZSxcbiAgICB9XG59IiwiZXhwb3J0IGNvbnN0IGFkZCA9ICh2ZWN0b3IxLCB2ZWN0b3IyKSA9PiB7XG4gICAgcmV0dXJuIHZlY3RvcjEubWFwKCh4LCBpKSA9PiB4ICsgdmVjdG9yMltpXSlcbn1cblxuZXhwb3J0IGNvbnN0IHN1YnRyYWN0ID0gKHZlY3RvcjEsIHZlY3RvcjIpID0+IHtcbiAgICByZXR1cm4gdmVjdG9yMS5tYXAoKHgsIGkpID0+IHggLSB2ZWN0b3IyW2ldKVxufVxuXG5leHBvcnQgY29uc3QgbXVsdGlwbHkgPSAodmVjdG9yMSwgdmVjdG9yMikgPT4ge1xuICAgIHJldHVybiB2ZWN0b3IxLm1hcCgoeCwgaSkgPT4geCAqIHZlY3RvcjJbaV0pXG59XG5cbmV4cG9ydCBjb25zdCBzY2FsZSA9ICh2ZWN0b3IxLCBzY2FsYXIpID0+IHtcbiAgICByZXR1cm4gdmVjdG9yMS5tYXAoeCA9PiB4ICogc2NhbGFyKVxufVxuXG5leHBvcnQgY29uc3QgcmFuZG9tSW50ID0gKG1heCkgPT4ge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqbWF4KVxufVxuXG5leHBvcnQgY29uc3QgY2hvb3NlUmFuZG9tRWxlbWVudCA9IChhcnJheSkgPT4gYXJyYXlbcmFuZG9tSW50KGFycmF5Lmxlbmd0aCAtMSldXG5cbmV4cG9ydCBjb25zdCBpc1BvaW50VmFsaWQgPSAoY29vcmRzLCBib2FyZFNpemUpID0+XG4gICAgIWNvb3Jkcy5zb21lKHggPT4geCA8IDAgfCB4ID4gYm9hcmRTaXplIC0gMSlcblxuZXhwb3J0IGNvbnN0IGdldFJhbmRvbUNvb3JkcyA9IChib2FyZFNpemUpID0+IFtyYW5kb21JbnQoYm9hcmRTaXplKSwgcmFuZG9tSW50KGJvYXJkU2l6ZSldXG5cbmV4cG9ydCBjb25zdCBnZXRSYW5kb21EaXJlY3Rpb24gPSAoKSA9PiBcbiAgICBjaG9vc2VSYW5kb21FbGVtZW50KFtbMSwwXSwgWzAsMV0sIFstMSwwXSwgWzAsLTFdXSlcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgR2FtZSwgUmVuZGVyZXIgfSBmcm9tIFwiLi9nYW1lXCJcbmltcG9ydCB7IEdhbWVib2FyZCB9IGZyb20gXCIuL2dhbWVib2FyZFwiXG5pbXBvcnQgeyBGbGVldCwgZGVmYXVsdFNoaXBzIH0gZnJvbSBcIi4vc2hpcFwiXG5jb25zdCBmbGVldHMgPSBbRmxlZXQoKSwgRmxlZXQoKV1cbmZsZWV0cy5mb3JFYWNoKGZsZWV0ID0+IHtcbiAgICBmbGVldC5wbGFjZVNoaXBzKGRlZmF1bHRTaGlwcygpKVxufSlcbmNvbnN0IGdhbWUgPSBHYW1lKEdhbWVib2FyZChmbGVldHNbMF0pLCBHYW1lYm9hcmQoZmxlZXRzWzFdKSlcbmNvbnN0IG5vdGlmU3RyaW5nID0gKGV2ZW50KSA9PiBgJHtldmVudC5wbGF5ZXJOYW1lfSBmaXJlZCBhdCAke2V2ZW50LmNvb3Jkc30gYW5kICR7ZXZlbnQuaGl0ID8gXCJoaXRcIiA6IFwibWlzc2VkXCJ9LiAke2V2ZW50LnN1bmsgPyBgQSAke2V2ZW50LnN1bmt9IHdhcyBzdW5rLmAgOiBcIlwifSAke2V2ZW50LmFsbFN1bmsgPyBgQWxsIHNoaXBzIGFyZSBzdW5rLiAke2V2ZW50LnBsYXllck5hbWV9IHdpbnMuYCA6IFwiXCJ9YFxuY29uc3QgZm5DbGljayA9IChjb29yZHMpID0+IHtcbiAgICBjb25zdCBldmVudHMgPSBnYW1lLnN0ZXAoY29vcmRzKVxuICAgIGV2ZW50cy5mb3JFYWNoKChldmVudCkgPT4ge1xuICAgICAgICByZW5kZXJlci5sb2cobm90aWZTdHJpbmcoZXZlbnQpKVxuICAgIH0pXG4gICAgcmVuZGVyZXIucmVuZGVyKGdhbWUpXG59XG5jb25zdCByZW5kZXJlciA9IFJlbmRlcmVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpblwiKSwgZG9jdW1lbnQsIGZuQ2xpY2spXG5yZW5kZXJlci5pbml0KGdhbWUpIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9