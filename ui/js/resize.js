let sideControls = document.getElementById("side-controls");
let sideDragBar = document.getElementById("side-drag-bar");
let mainContainer = document.getElementById("main-container");

let startDragMouseX; //mouse position in the window
let oldSideControlsWidth;


function setCursor(cursor) {
	document.body.style.cursor = cursor;
}

function startDrag(e) {
    sideDragBar.setPointerCapture(e.pointerId);
    setCursor("ew-resize");
    document.body.onpointermove = onDrag;
    startDragMouseX = e.clientX;
    oldSideControlsWidth = sideControls.clientWidth;
}

function endDrag(e) {
    sideDragBar.releasePointerCapture(e.pointerId);
	setCursor("auto");
    document.body.onpointermove = null;
}

function onDrag(e) {
    let newWidth = (startDragMouseX - e.clientX) + oldSideControlsWidth;
    newWidth = Math.min(Math.max(newWidth, parseInt(window.getComputedStyle(sideControls).getPropertyValue("min-width")) + 1), parseInt(window.getComputedStyle(sideControls).getPropertyValue("max-width")));
    mainContainer.style.gridTemplateColumns = "auto " + sideDragBar.clientWidth + "px " + newWidth + "px";
}

document.getElementById("side-drag-bar").addEventListener("pointerdown", (e) => {
    startDrag(e);
});

document.addEventListener("pointerup", (e) => {
    endDrag(e);
});