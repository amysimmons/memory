Game = {

  initialize: function(){
    Game.difficulty = "easy"
    Game.board = Game.renderBoard(Game.difficulty);
    Game.pairs = [];
    Game.matches = [];
  },

  renderBoard: function(difficulty){

    var tilesAcross;

    switch (difficulty){
      case 'easy':
        tilesAcross = 4;
        break;
      case 'medium':
        tilesAcross = 6;
        break;
      case 'hard':
        tilesAcross = 8;
        break;
      default:
        tilesAcross = 4;
    }

    var grid = [];

    for (var i = 0; i < tilesAcross; i++) {
      var row = [];
      for (var j = 0; j < tilesAcross; j++) {
        var tile = {
          position: [i, j],
          value: "X",
          flipped: false
        }
        row.push(tile);
      };
      grid.push(row);
    };

    console.log(grid, 'grid');
    return grid;

  }
}

$(document).ready(function(){
  Game.initialize();

});