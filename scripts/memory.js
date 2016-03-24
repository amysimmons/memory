Game = {

  initialize: function(values){
    Game.difficulty = "easy";
    Game.values = Game.pairAndShuffle(values);
    Game.board = Game.generateBoard();
    Game.pairs = [];
    Game.matches = [];
    Game.over = false;
    Game.initEvents();
  },

  generateBoard: function(){

    var tilesAcross;

    switch (Game.difficulty){
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
          value: Game.getRandomValue(),
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

  pairAndShuffle: function(values){

    var duplicateValues = values.concat(values);
    var shuffledValues = _.shuffle(duplicateValues);
    return shuffledValues;

  },

  getRandomValue: function(){

    return Game.values.pop();

  },

  flipTile: function(tile, event){

    tile.flipped = true;
    event.target.className = "tile flipped";

    Game.pairs.push(tile);

    if(Game.pairs.length == 2){
      Game.checkForMatch(event);
    }

  },

  checkForMatch: function(event){

    if(Game.pairs[0].value == Game.pairs[1].value){
      alert("That's a match!")
      //todo: update tile to be matched
      Game.pairs = [];
    }else {
      alert("No match");
      Game.unflipTiles(event);
    }

  },

  unflipTiles: function(event){

      for (var i = 0; i < Game.pairs.length; i++) {
        var tile = Game.pairs[i];

        Game.board[tile.position[0]][tile.position[1]].flipped = false;

        var domTile = document.getElementsByClassName('row')[tile.position[0]].childNodes[tile.position[1]]
        domTile.className = "tile unflipped";
      };

      Game.pairs = [];
  },

  updateDom: function(position){
    console.log(position);
    console.log('hi')
  },

  initEvents: function(){

    $('body').on('click', '.tile', function(event) {

      var tile = Game.board[event.target.yPos][event.target.xPos];

      console.log(tile);

      if(Game.over){
        alert("You've successfully matched all tiles");
      }else if(tile.matched){
        alert("You've already matched this tile");
      }else if(!tile.flipped){
        Game.flipTile(tile, event);

      }

    });

  }

}

$(document).ready(function(){
  var values = ["A", "B", "C", "D", "E", "F", "G", "H"];
  Game.initialize(values);
});