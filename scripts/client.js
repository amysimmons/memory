$(document).ready(function(){

Game = {

  initialize: function(){
    Game.phase = { cardsSource: true, cardsSourceTheme: false }
    Game.cardsSource = null;
    Game.cardsSourceTheme = null;
    Game.tilesAcross = 4;
    Game.values = null;
    Game.board = Game.generateBoard();
    Game.pair = [];
    Game.matches = [];
    Game.seconds = 0;
    Game.minutes = 0;
    Game.over = false;
  },

  generateBoard: function(){
    var grid = [];

    for (var i = 0; i < Game.tilesAcross; i++) {
      var row = [];
      for (var j = 0; j < Game.tilesAcross; j++) {
        var  tile = {
          position: [i, j],
          value: null,
          option: null,
          flipped: false,
          matched: false
        }
        row.push(tile);
      };
      grid.push(row);
    };

    Game.board = grid;
    Game.populateBoard();
    return grid;
  },

  clearBoardOptions: function(){
    for (var i = 0; i < Game.board.length; i++) {
      var row = Game.board[i];
      for (var x = 0; x < row.length; x++) {
        var tile = row[x];
        tile.option = null;
      };
    };
  },

  addCardsToBoard: function(){
    for (var i = 0; i < Game.board.length; i++) {
      var row = Game.board[i];
      for (var x = 0; x < row.length; x++) {
        var tile = row[x];
        tile.value = Game.getRandomValue();
      };
    };
  },

  populateBoard: function(){
    if(Game.cardsSource == null || Game.cardsSourceTheme == null){
      Game.placeMenuOptions();
    }
  },

  playWithGiphy: function(){
    var giphy = document.createElement('div')
    giphy.className = "giphy source";
    var text = document.createElement("p");
    var textNode = document.createTextNode('Play with Giphy')
    text.appendChild(textNode);
    giphy.appendChild(text);
    return giphy;
  },

  ownGiphyTheme: function(){
    var yourTheme = document.createElement("p");
    yourTheme.className = 'giphy-option-other';
    var yourThemeNode = document.createTextNode('Your theme')
    yourTheme.appendChild(yourThemeNode);

    var input = $('<input>').attr({
                  id: 'user-giphy-theme',
                  name: 'user giphy theme',
                  type: 'text',
                  placeholder: 'Cute cats'
                }).appendTo('<form>');

    var container = document.createElement("div");
    container.className = "option";
    container.appendChild(yourTheme);
    container.appendChild(input[0]);
    return container;
  },

  placeMenuOptions: function(){
    var grid = Game.board;

    //play with giphy
    if(Game.phase.cardsSource && !Game.phase.cardsSourceTheme){
      var giphy = Game.playWithGiphy();
      var positions = Game.getRandomGridPos(grid);
      grid[positions[1][0]][positions[1][1]].option = giphy;
    }

    //choose a giphy theme
    if(Game.phase.cardsSourceTheme && Game.cardsSource == "giphy"){
      Game.clearBoardOptions();
      var themes = ["Game Of Thrones", "House Of Cards", "Skateboard fails"];
      var yourTheme = Game.ownGiphyTheme();
      var positions = Game.getRandomGridPos(grid);

      for (var i = 0; i < themes.length; i++) {
        var theme = themes[i];
        var div = document.createElement("div");
        div.className = "option";
        var p = document.createElement("p");
        p.className = "giphy-option";
        var pNode = document.createTextNode(theme);
        p.appendChild(pNode);
        div.appendChild(p);
        grid[positions[i][0]][positions[i][1]].option = div;
      };

      grid[positions[positions.length-1][0]][positions[positions.length-1][1]].option = yourTheme;
    }

    Game.renderBoard();
  },

  renderBoard: function(){
    var grid = Game.board;
    $('.row').remove();

    var container = document.getElementsByClassName('game-container')[0];
    var imageCount = 1;

    for (var i = 0; i < grid.length; i++) {
      var row = document.createElement('div');
      row.className = 'row'

      for (var j = 0; j < grid[i].length; j++) {
        var tile = document.createElement('div');
        tile.className = grid[i][j].flipped ? 'tile flipped' : 'tile unflipped';
        tile.xPos = j;
        tile.yPos = i;

        var front = document.createElement('div');
        front.className = 'front';
        if(grid[i][j].option != null){
          var option = grid[i][j].option;
          front.appendChild(option);
        }
        front.style.backgroundImage =  "url('../images/hk/" + imageCount + ".png')";
        imageCount++;

        var back = document.createElement('div');
        back.className = 'back';
        if(grid[i][j].value != null){
          back.style.backgroundImage = "url('" + grid[i][j].value + "')";
        }

        tile.appendChild(front);
        tile.appendChild(back);
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
    event.currentTarget.className = "tile flipped";

    Game.pair.push(tile);

    if(Game.pair.length == 2){
      Game.checkForMatch(event);
    }
  },

  checkForMatch: function(event){
    if(Game.pair[0].value == Game.pair[1].value){
      for (var i = 0; i < Game.pair.length; i++) {
        var tile = Game.pair[i];
        Game.board[tile.position[0]][tile.position[1]].matched = true;
        Game.matches.push(Game.pair[i])
      };

      Game.pair = [];
      Game.checkForWin();
    }else {
      setTimeout(function(){ Game.unflipTiles(event); }, 2000);
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
      $('<p>You\'re a winner</p>').appendTo('.message');
      Game.over = true;
    }
  },

  startGame: function(){
    Game.clearBoardOptions();
    Game.addCardsToBoard();
    Game.renderBoard();
    Game.startTimer();
  },

  fetchGiphyCards: function(){
    var embedUrls = [];
    $.get( "http://api.giphy.com/v1/gifs/search?q=" + Game.cardsSourceTheme + "&api_key=dc6zaTOxFJmzC&limit=8")
      .done(function(data){
        for (var i = 0; i < data.data.length; i++) {
          var gif = data.data[i];
          embedUrls.push(gif.images.original.url);
        };
        Game.values = Game.pairAndShuffle(embedUrls);
        Game.startGame();
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
      $('<p>Meep, you\'re out of time</p>').appendTo('.message');
    }
    if(!Game.over){
      Game.startTimer();
    }
  },

  startTimer: function(){
    $('.timer').removeClass('hide');

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

  getCardsSource: function(e){
    if(e.classList.contains("giphy")){
      return "giphy";
    }
  },

  getRandomGridPos: function(grid){
    var shuffled = _.shuffle(_.flatten(grid));
    var randomGridPositions = [];
    for (var i = 0; i < shuffled.length; i++) {
      randomGridPositions.push(shuffled[i].position);
    };
    return randomGridPositions;
  },

  initEvents: function(){
    $('body').on('click', '.source', function(event){
      Game.cardsSource = Game.getCardsSource(event.currentTarget);
      Game.phase.cardsSourceTheme = true;
      Game.populateBoard();
    });

    $('body').on('click', '.giphy-option', function(event){
        Game.cardsSourceTheme = event.currentTarget.innerHTML;
        Game.populateBoard();
        Game.fetchGiphyCards();
    });

    $('body').on('keypress', '#user-giphy-theme', function( event ) {
      if ( event.which == 13 ) {
         event.preventDefault();
         Game.cardsSourceTheme = event.currentTarget.value;
         Game.fetchGiphyCards();
      }
    });

    $('body').on('click', '.tile', function(event) {
      if(Game.seconds > 0){
        var tile = Game.board[event.currentTarget.yPos][event.currentTarget.xPos];

        if(!Game.over && !tile.matched && !tile.flipped && Game.pair.length < 2){
          Game.flipTile(tile, event);
        }
      }
    });

    Game.initialize();

  }
}

Game.initEvents();

});