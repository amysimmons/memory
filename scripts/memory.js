Game = {

  initialize: function(){
    Game.difficulty = "easy";
    Game.values = ["A", "B", "C", "D", "E", "F", "G", "H"];
    Game.board = Game.generateBoard(Game.difficulty);
    Game.pairs = [];
    Game.matches = [];
    Game.initEvents();
  },

  generateBoard: function(difficulty, values){

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
          value: Game.getRandomValue(Game.values),
          flipped: false,
          matched: false
        }
        row.push(tile);
      };
      grid.push(row);
    };


    Game.renderBoard(grid);

    return grid;

  },

  renderBoard: function(grid){

    var container = document.getElementsByClassName('container')[0];

    for (var i = 0; i < grid.length; i++) {

      var row = document.createElement('div');
      row.className = 'row'

      for (var j = 0; j < grid[i].length; j++) {
        var tile = document.createElement('div');
        tile.className = grid[i][j].flipped ? 'tile flipped' : 'tile unflipped';
        tile.xPos = j;
        tile.yPos = i;
        var value = document.createTextNode(grid[i][j].value);
        tile.appendChild(value);
        row.appendChild(tile);
      };

      container.appendChild(row);
    };

  },

  duplicateValues: function(values){

    return values.concat(values);

  },

  getRandomValue: function(values){

    var allValues = Game.duplicateValues(values);
    var shuffled = _.shuffle(allValues);
    return shuffled.pop();

  },

  initEvents: function(){

    $('body').on('click', '.tile', function(event) {

      if(Game.board[event.target.yPos][event.target.xPos].matched){
        alert("You've already matched this tile");
      }
      else if(event.target.classList.contains("unflipped")){
        Game.board[event.target.yPos][event.target.xPos].flipped = true;
        event.target.className = "tile flipped";
      }else{
        Game.board[event.target.yPos][event.target.xPos].flipped = false;
        event.target.className = "tile unflipped";
      }

    });

  }

}

$(document).ready(function(){
  Game.initialize();
});