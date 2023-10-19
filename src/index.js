import { Game, Renderer } from "./game"
import { Gameboard } from "./gameboard"
import { Fleet, defaultShips } from "./ship"
const fleets = [Fleet(), Fleet()]
fleets.forEach(fleet => {
    fleet.placeShips(defaultShips())
})
const game = Game(Gameboard(fleets[0]), Gameboard(fleets[1]))
const notifString = (event) => `${event.playerName} fired at ${event.coords} and ${event.hit ? "hit" : "missed"}. ${event.sunk ? `A ${event.sunk} was sunk.` : ""} ${event.allSunk ? `All ships are sunk. ${event.playerName} wins.` : ""}`
const fnClick = (coords) => {
    const events = game.step(coords)
    events.forEach((event) => {
        renderer.log(notifString(event))
    })
    renderer.render(game)
}
const renderer = Renderer(document.getElementById("main"), document, fnClick)
renderer.init(game)