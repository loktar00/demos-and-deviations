var numberOfObjects = 10000,
    canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    objects = [];

// image and canvas vars
var imgToDraw = null,
    imageCanvas = null,
    iCtx = null,
    imageData = null,
    imagePixData = null,
    imgWidth = null,
    imgHeight = null;

// store our canvas width and height for faster access
var width = 800,
    height = 600;

// create and initialize our objects
for (var i = 0; i < numberOfObjects; i++) {
    objects.push({
        angle: Math.random() * 360,
        x: 100 + (Math.random() * canvas.width/2),
        y: 100 + (Math.random() * canvas.height/2),
        speed: 1 + Math.random() * 20
    });
}

function draw() {
    // create new Image data
    var canvasData = ctx.createImageData(canvas.width, canvas.height),
        // get the pixel data
        cData = canvasData.data;

    // iterate over the opbects
    for (var nObject = 0; nObject < numberOfObjects; nObject++) {
        // for ref the entity
        var entity = objects[nObject],
            // some fancy nancy stuff.
            velY = Math.cos(entity.angle * Math.PI / 180) * entity.speed,
            velX = Math.sin(entity.angle * Math.PI / 180) * entity.speed;

        entity.x += velX;
        entity.y -= velY;

            // now iterate over the image we stored
            for (var w = 0; w < imgWidth; w++) {
                for (var h = 0; h < imgHeight; h++) {
                    // make sure the edges of the image are still inside the canvas
                    if (entity.x + w < width && entity.x + w > 0 &&
                        entity.y + h > 0 && entity.y + h < height) {
                        // get the position pixel from the image canvas
                        var iData = (h * imgWidth + w) * 4;
                        // get the position of the data we will write to on our main canvas
                        var pData = (~~ (entity.x + w) + ~~ (entity.y + h) * width) * 4;

                        // copy the r/g/b/ and alpha values to our main canvas from
                        // our image canvas data.

                        cData[pData] = imagePixData[iData];
                        cData[pData + 1] = imagePixData[iData + 1];
                        cData[pData + 2] = imagePixData[iData + 2];
                        // this is where alpha blending could be applied
                        if(cData[pData + 3] < 100){
                            cData[pData + 3] = imagePixData[iData + 3];
                        }
                    }
                }
            }

        entity.angle++;
    }
        // now put all of that image data we just wrote onto the actual canvas.
        ctx.putImageData(canvasData, 0, 0);
        requestAnimationFrame(draw);
}

imgToDraw = new Image();
imgToDraw.crossOrigin = true;
imgToDraw.src = "http://i.imgur.com/blkXzbU.png";

    imgToDraw.onload = function () {
        // In memory canvas
        imageCanvas = document.createElement("canvas"),
            iCtx = imageCanvas.getContext("2d");

        // set the canvas to the size of the image
        imageCanvas.width = this.width;
        imageCanvas.height = this.height;

        // draw the image onto the canvas
        iCtx.drawImage(this, 0, 0);

        // get the ImageData for the image.
        imageData = iCtx.getImageData(0, 0, this.width, this.height);
        // get the pixel component data from the image Data.
        imagePixData = imageData.data;

        // store our width and height so we can reference it faster.
        imgWidth = this.width;
        imgHeight = this.height;

        draw();
    };