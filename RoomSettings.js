var players = [];
var boarSize = { x: 5, y: 5 }
var initBoard = (l, w) => new Array(l)
    .fill([])
    .map(i => new Array(w).fill(0));

function Player(id, roomSelected) {
    this.name = `Player_${id}`;
    this.isAlive = true;
    this.roomSelected = roomSelected
    this.board = initBoard(boarSize.x, boarSize.y)
}

var newPlayer = id => new Player(id);

/*var newGame = function(idPlayer, numPlayers) {

    for (var i = 0; i < numPlayers - 1; i++) {
        players.push({
            name: `Player_${idPlayer}`,
            isAlive: true,
            board: initBoard(boarSize.x, boarSize.y)
        });
    }
    return players;
}*/

module.exports = {
    players,
    boarSize,
    initBoard,
    newPlayer
}