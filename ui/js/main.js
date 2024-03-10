import "./titlebar.js";
import "./shaderSetup.js";
import { setCanvasResolution } from "./shaderSetup.js";
import "./exportImage.js";
import "./resize.js";



//sliders:
function updateZoomInputValue() {
    document.getElementById("zoom-slider-value").value = Number(document.getElementById("zoom-slider").value).toLocaleString("en", { minimumFractionDigits: 1 });
}

function updateIterationsInputValue() {
    document.getElementById("iterations-slider-value").value = document.getElementById("iterations-slider").value;
}

document.getElementById("zoom-slider").oninput = updateZoomInputValue;
document.getElementById("iterations-slider").oninput = updateIterationsInputValue;


//text input filters:
let maxRes = 4096;

function setInputFilter(input, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
        input.addEventListener(event, function() {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }

            let width = document.getElementById("width-input").value;
            let height = document.getElementById("height-input").value;
            setCanvasResolution(document.getElementById("canvas"), width, height);
            document.getElementById("canvas-container").style.aspectRatio = width / height;
            document.getElementById("canvas").style.aspectRatio = width / height;
        });
    });
}

function checkInput(value) {
    return /^\d*$/.test(value) && (value === "" || parseInt(value) <= maxRes) && (value === "" || parseInt(value) > 0);
}

setInputFilter(document.getElementById("width-input"), checkInput);
setInputFilter(document.getElementById("height-input"), checkInput);

//disable context menu (right click menu):
document.addEventListener('contextmenu', e => {
    e.preventDefault();
    return false;
}, { capture: true });