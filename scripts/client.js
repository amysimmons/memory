$(document).ready(function(){

Game = {

  initialize: function(values){

    Game.values = Game.pairAndShuffle(values);
    Game.board = Game.generateBoard("cards");
    Game.pair = [];
    Game.matches = [];
    Game.seconds = 0;
    Game.minutes = 0;
    Game.timer = Game.startTimer();
    Game.over = false;

  },

  generateBoard: function(type, source){

    var tilesAcross = 4;

    var grid = [];

    if(type=="cardsource"){
      for (var i = 0; i < tilesAcross; i++) {
        var row = [];
        for (var j = 0; j < tilesAcross; j++) {
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

      //put the card source options in random divs
      Game.placeMenuOptions(grid, "cardsource");
    }

    if(type=="sourcetheme"){

      for (var i = 0; i < tilesAcross; i++) {
        var row = [];
        for (var j = 0; j < tilesAcross; j++) {
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
      // put the theme choices in random divs
      Game.placeMenuOptions(grid, source);
    }

    if(type=="cards"){
      for (var i = 0; i < tilesAcross; i++) {
        var row = [];
        for (var j = 0; j < tilesAcross; j++) {
          var  tile = {
            position: [i, j],
            value: Game.getRandomValue(),
            flipped: false,
            matched: false
          }
          row.push(tile);
        };
        grid.push(row);
      };
    }

    Game.renderBoard(grid);

    return grid;

  },

  placeMenuOptions: function(grid, option){
    if(option=="cardsource"){

      var insta = document.createElement("img");
      insta.className = "instagram logo";
      insta.setAttribute('src', '../images/instagram.png');

      var giphy = document.createElement('img');
      giphy.className = "giphy logo";
      giphy.setAttribute('src', '../images/giphy.png');

      var positions = Game.getRandomGridPos(grid);

      grid[positions[0][0]][positions[0][1]].option = insta;
      grid[positions[1][0]][positions[1][1]].option = giphy;
    }
    if(option=="instagram"){
      var own = document.createElement("p");
      var ownNode = document.createTextNode('Play with your own Instagram pics')
      own.appendChild(ownNode);
      own.className = 'insta-option-own';


      var other = document.createElement("div");
      var otherp = document.createElement("p");
      var otherNode = document.createTextNode('Play with someone else\'s Instagram pics')
      otherp.appendChild(otherNode);


      var input = $('<input>').attr({
                    id: 'insta-option-other',
                    name: 'user giphy theme',
                    placeholder: 'Enter a username'
                  }).appendTo('<form>');

      other.appendChild(otherp);
      other.appendChild(input[0]);

      var positions = Game.getRandomGridPos(grid);
      grid[positions[0][0]][positions[0][1]].option = own;
      grid[positions[1][0]][positions[1][1]].option = other;
    }
    if(option=="giphy"){
      var themes = ["Game Of Thrones", "House Of Cards", "Skateboard fails"];
      var input = $('<input>').attr({
                    id: 'user-giphy-theme',
                    name: 'user giphy theme',
                    placeholder: 'Cute cats'
                  }).appendTo('<form>');

      var positions = Game.getRandomGridPos(grid);

      for (var i = 0; i < themes.length; i++) {
        var theme = themes[i];
        var p = document.createElement("p");
        var pNode = document.createTextNode(theme)
        p.appendChild(pNode);
        p.className = "giphy-option"
        grid[positions[i][0]][positions[i][1]].option = p;
      };

      grid[positions[positions.length-1][0]][positions[positions.length-1][1]].option = input[0];

    }
  },

  renderBoard: function(grid){

    $('.row').remove();

    var container = document.getElementsByClassName('game-container')[0];

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
        }else {
          front.style.backgroundColor = '#000'
        }

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
          $.get( "/posts")
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

  cardsSource: function(e){

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

    $('body').on('click', '.giphy-option', function(event){
        var theme = event.currentTarget.innerHTML;
        Game.fetchGiphyCards(theme);
    });

    $('body').on('keypress', '#user-giphy-theme', function( event ) {
      if ( event.which == 13 ) {
         event.preventDefault();
         var theme = event.currentTarget.value;
         Game.fetchGiphyCards(theme);
      }
    });

    $('body').on('click', '.insta-option-own', function(event){
        Game.fetchInstagramCards('own');
    });

    $('body').on('keypress', '#insta-option-other', function( event ) {
      if ( event.which == 13 ) {
         event.preventDefault();
         var theme = event.currentTarget.value;
         Game.fetchInstagramCards(theme);
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

    $('body').on('click', '.logo', function(event){
      var source = Game.cardsSource(event.currentTarget);
      Game.generateBoard("sourcetheme", source);
    });

    Game.generateBoard("cardsource", null);
  }

}

Game.initEvents();

});