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

    var xPos = 610;

    while(sy <= canvas.height - sh){
      while (sx <= canvas.width - sw){
        var imageData = ctx.getImageData(sx, sy, sw, sh);
        console.log('hello')
        var cropCanvas = document.createElement('canvas');
        cropCanvas.height = imageData.height;
        cropCanvas.width = imageData.width;
        cropCtx = cropCanvas.getContext('2d');
        var cropImageData = cropCtx.createImageData(imageData);
        cropCtx.putImageData(cropImageData, 0, 0);
        document.body.appendChild(cropCanvas);
        sx += sw;
        id++;
      }
      sy += sh;
      sx = 0;
      xPos * 610;
    }
  }

  document.getElementById("uploadInput").onchange = function(){
    loadImage(this);
  };

  document.getElementById("crop").onclick = function(){
    slicePhoto();
  };
});