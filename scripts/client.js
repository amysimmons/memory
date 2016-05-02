$(document).ready(function(){

Game = {

  initialize: function(values, source){

    Game.source = source;
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

      grid[0][0].option = insta;
      grid[0][1].option = giphy;
    }
    if(option=="instagram"){
      var own = document.createElement("p");
      var ownNode = document.createTextNode('Play with your own Instagram pics')
      own.appendChild(ownNode);

      var other = document.createElement("p");
      var otherNode = document.createTextNode('Play with someone else\'s Instagram pics')
      other.appendChild(otherNode);

      grid[0][0].option = own;
      grid[0][1].option = other;
    }
    if(option=="giphy"){
      var themes = ["Game Of Thrones", "House Of Cards", "Skateboard fail"];

      for (var i = 0; i < themes.length; i++) {
        var theme = themes[i];
        var p = document.createElement("p");
        var pNode = document.createTextNode(theme)
        p.appendChild(pNode);
        grid[0][i].option = p;
      };

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
        // if(grid[i][j].value != null){
        //   front.style.backgroundColor = '#000'
        // }
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

  fetchCards: function(source){

    if(source == "instagram"){
      Game.fetchInstagramCards(source);
    }else if(source == "giphy"){
      Game.fetchGiphyCards(source);
    }

  },

  fetchInstagramCards: function(source){
    var embedUrls = [];
    console.log('fetching instas')
    $.get("/accesstoken")
      .done(function(data){
        if (data){
          $.get( "/posts")
            .done(function(posts){
              // debugger
              console.log('posts', posts)
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

    $.get( "http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC&limit=8")
      .done(function(data){
        for (var i = 0; i < data.data.length; i++) {
          var gif = data.data[i];
          embedUrls.push(gif.images.original.url);
        };
        Game.initialize(embedUrls, source);
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

  showOptions: function(source){
    console.log('show optiojns caleld')
    $('.select-card-source').addClass('hide');
    if(source == "instagram"){
      $('.select-instagram-username').removeClass('hide');
    }else if(source == "giphy"){
      $('.select-giphy-theme').removeClass('hide');
    }
  },

  initEvents: function(){

    $('body').on('click', '.tile', function(event) {

      console.log(Game.seconds);

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
      //$('.menu-container').addClass('hide');

     // Game.showOptions(source);

      Game.generateBoard("sourcetheme", source);

      //Game.fetchCards(source);

    });


    Game.generateBoard("cardsource", null);

  }

}

Game.initEvents();

});