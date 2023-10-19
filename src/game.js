export const Game = (playerBoard, computerBoard) => {
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

export const Renderer = (frame, doc, fnClick) => {
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