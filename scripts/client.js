$(document).ready(function(){

Game = {

  initialize: function(){
    Game.phase = { cardsSource: true, cardsSourceTheme: false }
    Game.cardsSource = null;
    Game.cardsSourceTheme = null;
    Game.tilesAcross = 4;
    Game.values = null;

    //Game.pairAndShuffle(values);
    Game.board = Game.generateBoard();
    Game.pair = [];
    Game.matches = [];
    Game.seconds = 0;
    Game.minutes = 0;
    Game.timer = null;
    //Game.startTimer();
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

  populateBoard: function(){
    if(!Game.phase.cardsSource || !Game.phase.cardsSourceTheme){
      Game.placeMenuOptions();
    }
    else {
      //Game.placeCards();
      //value: Game.getRandomValue(),
    }
  },

  placeMenuOptions: function(){

    debugger

    var grid = Game.board;

    if(Game.phase.cardsSource && !Game.phase.cardsSourceTheme){

      var insta = document.createElement("div");
      var text = document.createElement("p");
      var textNode = document.createTextNode('Play with Instagram')
      text.appendChild(textNode);
      insta.appendChild(text);
      insta.className = "instagram logo";

      var giphy = document.createElement('div');
      var text = document.createElement("p");
      var textNode = document.createTextNode('Play with Giphy')
      text.appendChild(textNode);
      giphy.appendChild(text);
      giphy.className = "giphy logo";

      var positions = Game.getRandomGridPos(grid);

      grid[positions[0][0]][positions[0][1]].option = insta;
      grid[positions[1][0]][positions[1][1]].option = giphy;
    }
    if(Game.phase.cardsSourceTheme && Game.cardsSourceTheme =="instagram"){
      var ownDiv = document.createElement("div");
      var own = document.createElement("p");
      var ownNode = document.createTextNode('Play with your own pics')
      own.appendChild(ownNode);
      ownDiv.appendChild(own)
      own.className = 'insta-option-own';
      ownDiv.className = 'option';

      var other = document.createElement("div");
      other.className = 'option';
      var otherp = document.createElement("p");
      otherp.className = 'insta-option-other';
      var otherNode = document.createTextNode('Play with someone else\'s pics')
      otherp.appendChild(otherNode);


      var input = $('<input>').attr({
                    id: 'insta-option-other',
                    type: 'text',
                    name: 'user giphy theme',
                    placeholder: 'Enter a username'
                  }).appendTo('<form>');

      other.appendChild(otherp);
      other.appendChild(input[0]);

      var positions = Game.getRandomGridPos(grid);
      grid[positions[0][0]][positions[0][1]].option = ownDiv;
      grid[positions[1][0]][positions[1][1]].option = other;
    }
    if(Game.phase.cardsSourceTheme && Game.cardsSourceTheme =="giphy"){
      var themes = ["Game Of Thrones", "House Of Cards", "Skateboard fails"];
      var input = $('<input>').attr({
                    id: 'user-giphy-theme',
                    name: 'user giphy theme',
                    type: 'text',
                    placeholder: 'Cute cats'
                  }).appendTo('<form>');

      var inputDiv = document.createElement("div");

      var yourTheme = document.createElement("p");
      yourTheme.className = 'giphy-option-other';
      var yourThemeNode = document.createTextNode('Your theme')
      yourTheme.appendChild(yourThemeNode);


      inputDiv.appendChild(yourTheme);
      inputDiv.appendChild(input[0]);
      inputDiv.className = "option";

      var positions = Game.getRandomGridPos(grid);

      for (var i = 0; i < themes.length; i++) {
        var theme = themes[i];
        var div = document.createElement("div");
        var p = document.createElement("p");
        var pNode = document.createTextNode(theme);
        p.appendChild(pNode);
        div.appendChild(p);
        p.className = "giphy-option";
        div.className = "option";
        grid[positions[i][0]][positions[i][1]].option = div;
      };

      grid[positions[positions.length-1][0]][positions[positions.length-1][1]].option = inputDiv;

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
      alert("You're a winner!");
      Game.over = true;
    }

  },

  fetchInstagramCards: function(source){
    var embedUrls = [];
    $.get("/accesstoken")
      .done(function(data){
        if (data){
          $.get( "/posts/"+source)
            .done(function(posts){
              for (var i = 0; i < 8; i++) {
                var post = posts[i].images.standard_resolution.url;
                embedUrls.push(post);
              };
              Game.initialize(embedUrls, source);
            });
          }else{
            window.location = "/authorize_user"
          }
      });
    },

  fetchGiphyCards: function(source){
    var embedUrls = [];
    $.get( "http://api.giphy.com/v1/gifs/search?q=" + source + "&api_key=dc6zaTOxFJmzC&limit=8")
      .done(function(data){
        for (var i = 0; i < data.data.length; i++) {
          var gif = data.data[i];
          embedUrls.push(gif.images.original.url);
        };
        Game.initialize(embedUrls);
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
    }else if (e.classList.contains("instagram")){
      return "instagram";
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


    $('body').on('click', '.logo', function(event){
      Game.cardsSource = Game.getCardsSource(event.currentTarget);
      Game.phase.cardsSourceTheme = true;
      Game.populateBoard();
      console.log('logo clicked');
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

    $('body').on('click', '.insta-option-own', function(event){
        Game.fetchInstagramCards('own');
    });

    $('body').on('keypress', '#insta-option-other', function( event ) {
      if ( event.which == 13 ) {
         event.preventDefault();
         Game.cardsSourceTheme = event.currentTarget.value;
         Game.fetchInstagramCards();
      }
    });

    $('body').on('click', '.tile', function(event) {
      if(Game.seconds != undefined){
        var tile = Game.board[event.currentTarget.yPos][event.currentTarget.xPos];

        if(Game.over){
          alert("You've successfully matched all tiles");
        }else if(tile.matched){
          alert("You've already matched this tile");
        }else if(!tile.flipped && Game.pair.length < 2){
          Game.flipTile(tile, event);
        }
      }
    });

    Game.initialize();
  }

}

Game.initEvents();

});