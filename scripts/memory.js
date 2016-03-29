$(document).ready(function(){

Game = {

  initialize: function(theme, values){

    Game.difficulty = "easy";
    // Game.values = Game.pairAndShuffle(values);
    // Game.board = Game.generateBoard();
    Game.pair = [];
    Game.matches = [];
    Game.seconds = 0;
    Game.minutes = 0;
    Game.timer = Game.startTimer();
    Game.theme = theme;
    Game.over = false;

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

    console.log(grid)

    return grid;

  },

  renderBoard: function(grid){

    var container = document.getElementsByClassName('game-container')[0];

    for (var i = 0; i < grid.length; i++) {

      var row = document.createElement('div');
      row.className = 'row'

      for (var j = 0; j < grid[i].length; j++) {
        var tile = document.createElement('div');
        tile.className = grid[i][j].flipped ? 'tile flipped' : 'tile unflipped';
        tile.xPos = j;
        tile.yPos = i;
        tile.style.backgroundImage = "url('" + grid[i][j].value + "')";
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

    Game.pair.push(tile);

    if(Game.pair.length == 2){
      Game.checkForMatch(event);
    }

  },

  checkForMatch: function(event){

    if(Game.pair[0].value == Game.pair[1].value){
      alert("That's a match!");

      for (var i = 0; i < Game.pair.length; i++) {
        var tile = Game.pair[i];

        //updates tile to be matched
        Game.board[tile.position[0]][tile.position[1]].matched = true;

        //pushes the tile into the matches array, used to check for win
        Game.matches.push(Game.pair[i])
      };

      //resets pair array to empty
      Game.pair = [];

      //checks for win
      Game.checkForWin();

    }else {
      alert("No match");
      Game.unflipTiles(event);
    }

  },

  unflipTiles: function(event){

      for (var i = 0; i < Game.pair.length; i++) {
        var tile = Game.pair[i];

        Game.board[tile.position[0]][tile.position[1]].flipped = false;

        var domTile = document.getElementsByClassName('row')[tile.position[0]].childNodes[tile.position[1]]
        domTile.className = "tile unflipped";
      };

      Game.pair = [];
  },

  checkForWin: function(){

    if(Game.matches.length == _.flatten(Game.board).length){
      alert("You're a winner!");
      Game.over = true;
    }

  },

  fetchGifs: function(theme){

    var query = theme.split(' ').join('+').toLowerCase();
    var limit = 8;
    var embedUrls = [];

    $.get( "http://api.giphy.com/v1/gifs/search?q=" + query + "&limit=" + limit + "&api_key=dc6zaTOxFJmzC")
      .done(function(data){
        for (var i = 0; i < data.data.length; i++) {
          var gif = data.data[i];
          embedUrls.push(gif.images.original.url);
        };
        Game.initialize(theme, embedUrls);
      });

  },

  addTime: function(){

    if (Game.seconds < 59) {
      Game.seconds++;
    }
    else if (Game.seconds >= 59 && Game.minutes < 60) {
      Game.seconds = 0;
      Game.minutes++;
    }
    else {
      Game.over = false;
      alert("Out of time");
    }

    Game.startTimer();

  },

  startTimer: function(){

    t = setTimeout(Game.addTime, 1000);

    if (Game.seconds < 10){
      $('.seconds')[0].innerHTML = ": " + "0" + Game.seconds;
    }else {
      $('.seconds')[0].innerHTML = ": " + Game.seconds;
    }

    if(Game.minutes < 10){
      $('.minutes')[0].innerHTML = "0" + Game.minutes;
    }else {
      $('.minutes')[0].innerHTML = Game.minutes;
    }

  },

  initEvents: function(){

    $('body').on('click', '.tile', function(event) {

      var tile = Game.board[event.target.yPos][event.target.xPos];

      if(Game.over){
        alert("You've successfully matched all tiles");
      }else if(tile.matched){
        alert("You've already matched this tile");
      }else if(!tile.flipped){
        Game.flipTile(tile, event);

      }

    });

    $('body').on('click', '.menu-item', function(event){

      if($('.selected').length > 0){
        $('.selected')[0].className = "menu-item";
      }

      event.target.className = "menu-item selected";


    });

    $('body').on('click', '.start-game', function(event){

      if($('.selected').length > 0 && Game.theme != "none"){
          var theme = $('.selected')[0].innerHTML;
          // Game.fetchGifs(theme);
          Game.initialize();
      }

    });

  }

}

Game.initEvents();

});