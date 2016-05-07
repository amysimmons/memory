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

    var sx = 0;
    var sy = 0;
    var sw = 610;
    var sh = 610;
    var count = 1;

    while(sy < canvas.height){
      while (sx < canvas.width){

        var cropCanvas = document.createElement('canvas');
        cropCanvas.width = sw;
        cropCanvas.height = sh;
        cropCanvas.id = count;
        cropCanvas.className = "crop";

        var imageData = ctx.getImageData(sx, sy, sw, sh);

        var cropCtx = cropCanvas.getContext('2d');
        cropCtx.putImageData(imageData, 0, 0);

        var crops = document.getElementById('image-crops');
        crops.appendChild(cropCanvas);
        sx += sw;
        count++
      }
      sy += sh;
      sx = 0;
    }
  }

  document.getElementById("uploadInput").onchange = function(){
    loadImage(this);
  };

  document.getElementById("crop").onclick = function(){
    slicePhoto();
  };

});