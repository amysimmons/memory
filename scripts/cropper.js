$(document).ready(function(){
  photo= null;

  function loadImage(input){
    var file = input.files[0];
    var canvas = document.getElementById('photo-canvas');
    var ctx = canvas.getContext('2d');
    var reader = new FileReader();

    reader.onload = function(e){
      var img = new Image();
      img.onload = function(){
        console.log(img.height)
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      }
      img.src = event.target.result;
      photo = img;
    };
    reader.readAsDataURL(file);
  }

  function slicePhoto(){
    var canvas = document.getElementById('photo-canvas');
    var ctx = canvas.getContext('2d');

    var id = 0;
    var sx = 0;
    var sy = 0;
    var sw = 610;
    var sh = 610;

    while(sy <= canvas.height - sh){
      while (sx <= canvas.width - sw){
        var imageData = ctx.getImageData(sx, sy, sw, sh);
        renderCrop(imageData);
        sx += sw;
        id++;
      }
      sy += sh;
      sx = 0;
    }
  }

  function renderCrop(imageData){
    var xPos = 610;
    var container = $('#crop-container');

    var c = document.createElement('canvas');
    c.width = imageData.width;
    c.height = imageData.height;
    container.append(c);

    var ctx2 = c.getContext("2d");
    ctx2.putImageData(imageData,xPos,0);

    xPos * 610;
  }

  document.getElementById("uploadInput").onchange = function(){
    loadImage(this);
  };

  document.getElementById("crop").onclick = function(){
    slicePhoto();
  };
});