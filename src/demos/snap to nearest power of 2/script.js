// based on http://stackoverflow.com/questions/1322510/given-an-integer-how-do-i-find-the-next-largest-power-of-two-using-bit-twiddlin

var canvas = document.getElementById( 'c' ),
    ctx = canvas.getContext( '2d' ),
    size,
    n;

function resize() {
  // start magic
  var size = Math.min( window.innerWidth, window.innerHeight ),
      n = Math.pow(2, Math.floor(Math.log(size) / Math.log(2)));

  // end magic

  c.width = n;
  c.height = n;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.clearRect( 0, 0, n, n );
  ctx.fillText( n + 'x' + n, n / 2, n / 2 );
}

window.addEventListener( 'resize', resize, false );
resize();