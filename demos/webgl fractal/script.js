function initWebGL(canvas) {
    var gl = null;
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) {}
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        return false;
    }
    return gl;
}

function quad() {
    var vertexPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
    var vertices = [-1, -1, 1, -1, -1, 1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vertexPosBuffer.itemSize = 2;
    vertexPosBuffer.numItems = 4;
    return vertexPosBuffer;
}

function createShader(str, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    return shader;
}

function createProgram(vstr, fstr) {
    var program = gl.createProgram();
    var vshader = createShader(vstr, gl.VERTEX_SHADER);
    var fshader = createShader(fstr, gl.FRAGMENT_SHADER);
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    return program;
}

var canvas = document.getElementById("canvas"),
    gl = initWebGL(canvas),
    offset = [-0.5, 0],
    scale = 1.35,
    iv = null,
    actions = {};

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

var vertexPosBuffer = quad(),
    vs = document.getElementById('vshader').textContent,
    fs = document.getElementById('fshader').textContent,
    program = createProgram(vs, fs);

gl.useProgram(program);
program.vertexPosAttrib = gl.getAttribLocation(program, 'aVertexPosition');
program.canvasSizeUniform = gl.getUniformLocation(program, 'uCanvasSize');
program.offsetUniform = gl.getUniformLocation(program, 'uOffset');
program.scaleUniform = gl.getUniformLocation(program, 'uScale');
gl.enableVertexAttribArray(program.vertexPosArray);
gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0);

function draw(){
    gl.uniform2f(program.canvasSizeUniform, canvas.width, canvas.height);
    gl.uniform2f(program.offsetUniform, offset[0], offset[1]);
    gl.uniform1f(program.scaleUniform, scale);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);
}

draw();