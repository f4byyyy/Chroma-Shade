import { createProgramFromFiles } from "./shaderUtils.js";
import { appWindow } from './node_modules/@tauri-apps/api/window.js';


let vertexShaderPath = "shaders/vertex.glsl";
let fragmentShaderPath = "shaders/fragment.glsl";

let maxFPS = 60, calcFPS = true;
let minimized = false; //stop rendering when minimized
let pause = false;

let baseColor = [-0.3, 0.1, 0.5];

const zoomSlider = document.getElementById("zoom-slider");
const iterationsSlider = document.getElementById("iterations-slider");
const noiseCheckbox = document.getElementById("noise-checkbox");
const frostedNoiseCheckbox = document.getElementById("frosted-noise-checkbox");
const colorInput = document.getElementById("shader-color-input");

let realThen = 0;

export function initCanvas() {

    // get a WebGL2 context
    let canvas = document.getElementById("canvas");
    let gl = canvas.getContext("webgl2", {preserveDrawingBuffer: true});
    if(!gl) {
        console.error("Could not get WebGL2 context");
        return;
    }

    //setCanvasResolution(canvas, canvas.clientWidth, canvas.clientHeight);
    setCanvasResolution(canvas, 400, 225);

    createProgramFromFiles(gl, vertexShaderPath, fragmentShaderPath).then((program) => {
        setup(program);
    });


    function setup(program) {

        // look up locations of attributes and uniforms
        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

        const resolutionLocation = gl.getUniformLocation(program, "iResolution");
        const timeLocation = gl.getUniformLocation(program, "iTime");
        const zoomLocation = gl.getUniformLocation(program, "zoom");
        const iterationsLocation = gl.getUniformLocation(program, "iterations");
        const noiseLocation = gl.getUniformLocation(program, "noise");
        const frostedNoiseLocation = gl.getUniformLocation(program, "frostedNoise");
        const baseColorLocation = gl.getUniformLocation(program, "baseColor");

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,  // first triangle
             1, -1,
            -1,  1,
            -1,  1,  // second triangle
             1, -1,
             1,  1,
        ]), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(positionAttributeLocation);

        // tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        gl.vertexAttribPointer(
            positionAttributeLocation,
            2,          // 2 components per iteration
            gl.FLOAT,   // the data is 32bit floats
            false,      // don't normalize the data
            0,          // 0 = move forward size * sizeof(type) each iteration to get the next position
            0,          // start at the beginning of the buffer
        );

        
        let time = 0;
        let then = 0;

        let fpsTimer = 0, frames = 0;

        function render(now) {
            
            requestAnimationFrame(render);

            const timePassed = now - then;

            if(minimized || pause || timePassed < (1000 / maxFPS)) { return }

            if(calcFPS) {
                fpsTimer += now - realThen;
                frames++;
                if(fpsTimer >= 1000) {
                    //console.log(frames);
                    fpsTimer = 0;
                    frames = 0;
                }
            }   
            
            const timePassedInSeconds = (now - realThen) * 0.001;
            time += timePassedInSeconds;
            
            then = now - (timePassed % (1000 / maxFPS));
            realThen = now;

            // tell WebGL how to convert from clip space (-1 to 1) to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        
            gl.useProgram(program);
        
            gl.bindVertexArray(vao);
        
            // set values of the uniforms
            gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
            gl.uniform1f(timeLocation, time);
            gl.uniform1f(zoomLocation, zoomSlider.value);
            gl.uniform1i(iterationsLocation, iterationsSlider.value);
            gl.uniform1i(noiseLocation, noiseCheckbox.checked);
            gl.uniform1i(frostedNoiseLocation, frostedNoiseCheckbox.checked);
            gl.uniform3f(baseColorLocation, baseColor[0], baseColor[1], baseColor[2]);
        
            gl.drawArrays(
                gl.TRIANGLES,
                0,     // offset
                6,     // number of vertices to process
            );
            
        }

        requestAnimationFrame(render);
    }
 
}

//the resolution of the canvas can be different from its size set by css
export function setCanvasResolution(canvas, width, height) {
    canvas.width  = width;
    canvas.height = height;
}

initCanvas();

//pause canvas rendering while window is minimized:
appWindow.listen("tauri://focus", () => {
    appWindow.isMinimized().then(val => minimized = val);
});

appWindow.listen('tauri://blur', async () => {
    await new Promise(r => setTimeout(r, 180)); //wait 180ms
    appWindow.isMinimized().then(val => {minimized = val});
});

//pause on button click:
document.getElementById("pause-button").onclick = togglePauseShader;

function togglePauseShader() {
    if(pause) {
        document.getElementById("pause-button").title = "Pause";
        document.getElementById("play-icon").style.display = "none";
        document.getElementById("pause-icon").style.display = "block";
        realThen = window.performance.now();
    } else {
        document.getElementById("pause-button").title = "Play";
        document.getElementById("play-icon").style.display = "block";
        document.getElementById("pause-icon").style.display = "none";
    }
    pause = !pause;
}

//color input:
colorInput.addEventListener("input", (e) => {
    const color = e.target.value;
    baseColor[0] = parseInt(color.substr(1,2), 16) / 255.0;
    baseColor[1] = parseInt(color.substr(3,2), 16) / 255.0;
    baseColor[2] = parseInt(color.substr(5,2), 16) / 255.0;
});