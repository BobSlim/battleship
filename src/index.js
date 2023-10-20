import { Game, Renderer } from "./game"
import { Gameboard } from "./gameboard"
import { Fleet, defaultShips } from "./ship"
const fleets = [Fleet(), Fleet()]
fleets.forEach(fleet => {
    fleet.placeShips(defaultShips())
})
const game = Game(Gameboard(fleets[0]), Gameboard(fleets[1]))
const notifString = (event) => `${event.playerName} fired at ${event.coords} and ${event.hit ? "hit" : "missed"}. ${event.sunk ? `A ${event.sunk} was sunk.` : ""} ${event.allSunk ? `All ships are sunk. ${event.playerName} win. ` : ""}`
const fnClick = (coords) => {
    const events = game.step(coords)
    renderer.log(notifString(events[0]) + notifString(events[1]))
    renderer.render(game)
}
const renderer = Renderer(document.getElementById("main"), document, fnClick)
renderer.init(game)