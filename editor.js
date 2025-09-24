// =====================
// editor.js - Jerry Editor
// =====================

// =====================
// GLOBAL STATE
// =====================
let currentMode = ‘pixel’; // ‘pixel’ or ‘sketch’
let currentTool = ‘pencil’;
let symmetryMode = ‘none’;
let isPainting = false;
let startX = 0, startY = 0;
let canvasWidth = 16, canvasHeight = 16;
let pixelData = [];
let cellSize = 20;
let lastMousePos = null;

let primaryColor = ‘#000000’;
let secondaryColor = ‘#FFFFFF’;
let builtInPalette = [’#000000’,’#FFFFFF’,’#FF0000’,’#00FF00’,’#0000FF’,’#FFFF00’,’#FF00FF’,’#00FFFF’];
let customPalette = [’#ffffff’,’#ff0000’,’#00ff00’,’#0000ff’,’#ffff00’,’#ff00ff’,’#00ffff’,’#000000’];
let activePalette = builtInPalette;
let currentColorIndex = 0;

// Sketch palettes
let sketchBuiltInPalette = [’#000000’,’#555555’,’#AAAAAA’,’#FF5733’,’#FFC300’,’#DAF7A6’,’#33FF57’,’#3357FF’];
let sketchCustomPalette = [’#000000’,’#111111’,’#222222’,’#333333’,’#444444’,’#555555’,’#666666’,’#777777’];
let sketchActivePalette = sketchBuiltInPalette;
let sketchColorIndex = 0;

let pixelUndoStack = [];
let pixelRedoStack = [];
let sketchUndoStack = [];
let sketchRedoStack = [];
let selection = null;

// =====================
// CANVAS ELEMENTS
// =====================
const pixelCanvas = document.getElementById(‘canvas’);
const canvasGrid = document.getElementById(‘canvasGrid’);
const paletteContainer = document.getElementById(‘swatches’);
const colorPickersContainer = document.getElementById(‘colorPickers’);

// Create preview canvas
const previewCanvas = document.createElement(‘canvas’);
previewCanvas.width = canvasWidth * cellSize;
previewCanvas.height = canvasHeight * cellSize;
previewCanvas.style.position = ‘absolute’;
previewCanvas.style.top = ‘0’;
previewCanvas.style.left = ‘0’;
previewCanvas.style.pointerEvents = ‘none’;
previewCanvas.style.zIndex = ‘10’;
document.querySelector(’.canvas-wrapper’).appendChild(previewCanvas);
const previewCtx = previewCanvas.getContext(‘2d’);

// Sketch canvas
const sketchCanvas = document.getElementById(‘sketchCanvas’);
const sketchCtx = sketchCanvas.getContext(‘2d’);
let sketchPainting = false;
let brushSize = 10;
let brushOpacity = 1;
let brushFlow = 1;
let brushHardness = 100;
let brushColor = ‘#000000’;
let zoomLevel = 1;
let sketchLayers = [{ id: 0, name: ‘Layer 1’, opacity: 1, visible: true, data: null }];
let activeLayer = 0;

// =====================
// UTILITY FUNCTIONS
// =====================
function createPixelGrid(width, height) {
pixelCanvas.innerHTML = ‘’;
canvasGrid.innerHTML = ‘’;
pixelData = [];
pixelCanvas.style.gridTemplateColumns = `repeat(${width}, ${cellSize}px)`;
pixelCanvas.style.gridTemplateRows = `repeat(${height}, ${cellSize}px)`;

for(let y = 0; y < height; y++) {
pixelData[y] = [];
for(let x = 0; x < width; x++) {
const cell = document.createElement(‘div’);
cell.classList.add(‘cell’);
cell.dataset.x = x;
cell.dataset.y = y;
cell.style.width = `${cellSize}px`;
cell.style.height = `${cellSize}px`;
cell.style.backgroundColor = ‘transparent’;
pixelCanvas.appendChild(cell);
pixelData[y][x] = ‘transparent’;
}
}

// Update preview canvas size
previewCanvas.width = width * cellSize;
previewCanvas.height = height * cellSize;
}

function getSymmetricPoints(x, y) {
const points = [{x, y}];

if (symmetryMode === ‘vertical’ || symmetryMode === ‘both’) {
points.push({ x: canvasWidth - 1 - x, y });
}

if (symmetryMode === ‘horizontal’ || symmetryMode === ‘both’) {
points.push({ x, y: canvasHeight - 1 - y });
}

if (symmetryMode === ‘both’) {
points.push({ x: canvasWidth - 1 - x, y: canvasHeight - 1 - y });
}

return points.filter((v,i,a) => a.findIndex(t => t.x === v.x && t.y === v.y) === i);
}

function updateCanvasInfo() {
const info = document.getElementById(‘canvasInfo’);
if(info) {
info.textContent = `${canvasWidth}×${canvasHeight} | ${currentTool} | ${currentMode === 'pixel' ? primaryColor : brushColor}`;
}
}

function savePixelState() {
const snapshot = pixelData.map(row => […row]);
pixelUndoStack.push(snapshot);
pixelRedoStack = [];
if(pixelUndoStack.length > 50) pixelUndoStack.shift();
}

function restorePixelState(stackFrom, stackTo) {
if(stackFrom.length === 0) return;
const snapshot = stackFrom.pop();
stackTo.push(pixelData.map(row => […row]));
pixelData = snapshot.map(row => […row]);
renderPixelCanvas();
}

function renderPixelCanvas() {
for(let y = 0; y < canvasHeight; y++) {
for(let x = 0; x < canvasWidth; x++) {
const cell = pixelCanvas.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
if(cell) cell.style.backgroundColor = pixelData[y][x];
}
}
}

function getCellFromEvent(e) {
const rect = pixelCanvas.getBoundingClientRect();
const x = Math.floor((e.clientX - rect.left) / cellSize);
const y = Math.floor((e.clientY - rect.top) / cellSize);
return {x, y};
}

function paintPixel(x, y, color) {
if(x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) return;
pixelData[y][x] = color;
}

function setPixel(x, y, color) {
if(x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) return;
pixelData[y][x] = color;
const cell = pixelCanvas.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
if(cell) cell.style.backgroundColor = color;
}

// =====================
// FLOOD FILL ALGORITHM
// =====================
function floodFill(startX, startY, newColor) {
const startColor = pixelData[startY][startX];
if(startColor === newColor) return;

const stack = [[startX, startY]];
const visited = new Set();

while(stack.length > 0) {
const [x, y] = stack.pop();
const key = `${x},${y}`;

```
if(visited.has(key)) continue;
if(x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) continue;
if(pixelData[y][x] !== startColor) continue;

visited.add(key);
pixelData[y][x] = newColor;

stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
```

}
}

// =====================
// DRAWING SHAPES
// =====================
function drawLine(x0, y0, x1, y1, color) {
const dx = Math.abs(x1 - x0);
const dy = Math.abs(y1 - y0);
const sx = x0 < x1 ? 1 : -1;
const sy = y0 < y1 ? 1 : -1;
let err = dx - dy;

while(true) {
if(currentTool.includes(‘symmetric’)) {
getSymmetricPoints(x0, y0).forEach(p => setPixel(p.x, p.y, color));
} else {
setPixel(x0, y0, color);
}

```
if (x0 === x1 && y0 === y1) break;
let e2 = 2 * err;
if(e2 > -dy) { err -= dy; x0 += sx; }
if(e2 < dx) { err += dx; y0 += sy; }
```

}
}

function drawRect(x0, y0, x1, y1, color, filled = false) {
const xStart = Math.min(x0, x1);
const xEnd = Math.max(x0, x1);
const yStart = Math.min(y0, y1);
const yEnd = Math.max(y0, y1);

for(let y = yStart; y <= yEnd; y++) {
for(let x = xStart; x <= xEnd; x++) {
if(filled || y === yStart || y === yEnd || x === xStart || x === xEnd) {
if(currentTool.includes(‘symmetric’)) {
getSymmetricPoints(x, y).forEach(p => setPixel(p.x, p.y, color));
} else {
setPixel(x, y, color);
}
}
}
}
}

function drawCircle(cx, cy, radius, color, filled = false) {
for(let y = -radius; y <= radius; y++) {
for(let x = -radius; x <= radius; x++) {
const distance = Math.sqrt(x * x + y * y);
if(filled ? distance <= radius : Math.abs(distance - radius) < 0.8) {
if(currentTool.includes(‘symmetric’)) {
getSymmetricPoints(cx + x, cy + y).forEach(p => setPixel(p.x, p.y, color));
} else {
setPixel(cx + x, cy + y, color);
}
}
}
}
}

function drawPreviewShape(x0, y0, x1, y1, tool, color) {
if(!previewCtx) return;
previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
previewCtx.fillStyle = color;
const scale = cellSize;

function drawSymmetricPixel(px, py) {
const points = tool.includes(‘symmetric’) ? getSymmetricPoints(px, py) : [{x: px, y: py}];
points.forEach(p => {
if(p.x >= 0 && p.y >= 0 && p.x < canvasWidth && p.y < canvasHeight) {
previewCtx.fillRect(p.x * scale, p.y * scale, scale, scale);
}
});
}

switch(tool) {
case ‘line’:
const dx = Math.abs(x1 - x0);
const dy = Math.abs(y1 - y0);
const sx = x0 < x1 ? 1 : -1;
const sy = y0 < y1 ? 1 : -1;
let err = dx - dy;
let lx = x0, ly = y0;
while(true) {
drawSymmetricPixel(lx, ly);
if(lx === x1 && ly === y1) break;
let e2 = 2 * err;
if(e2 > -dy) { err -= dy; lx += sx; }
if(e2 < dx) { err += dx; ly += sy; }
}
break;

```
case 'rect':
  const xStart = Math.min(x0, x1);
  const xEnd = Math.max(x0, x1);
  const yStart = Math.min(y0, y1);
  const yEnd = Math.max(y0, y1);
  for(let y = yStart; y <= yEnd; y++) {
    for(let x = xStart; x <= xEnd; x++) {
      if(y === yStart || y === yEnd || x === xStart || x === xEnd) {
        drawSymmetricPixel(x, y);
      }
    }
  }
  break;

case 'circle':
  const radius = Math.round(Math.hypot(x1 - x0, y1 - y0));
  for(let y = -radius; y <= radius; y++) {
    for(let x = -radius; x <= radius; x++) {
      if(Math.abs(Math.sqrt(x*x + y*y) - radius) < 0.8) {
        drawSymmetricPixel(x0 + x, y0 + y);
      }
    }
  }
  break;
```

}
}

// =====================
// SELECTION & MOVE TOOL
// =====================
let isSelecting = false;
let selectionStart = null;
let selectionData = null;
let isMovingSelection = false;
let moveOffset = {x: 0, y: 0};

function startSelection(x, y) {
isSelecting = true;
selectionStart = {x, y};
}

function endSelection(x, y) {
if(!isSelecting) return;
isSelecting = false;
const x0 = Math.min(selectionStart.x, x);
const y0 = Math.min(selectionStart.y, y);
const x1 = Math.max(selectionStart.x, x);
const y1 = Math.max(selectionStart.y, y);
selectionData = {x0, y0, x1, y1, data: []};

for(let yy = y0; yy <= y1; yy++) {
let row = [];
for(let xx = x0; xx <= x1; xx++) {
row.push(pixelData[yy][xx]);
}
selectionData.data.push(row);
}

// Clear selected area
for(let yy = y0; yy <= y1; yy++) {
for(let xx = x0; xx <= x1; xx++) {
pixelData[yy][xx] = ‘transparent’;
}
}

renderPixelCanvas();
isMovingSelection = true;
moveOffset = {x: 0, y: 0};
}

function moveSelection(dx, dy) {
if(!selectionData) return;
moveOffset.x += dx;
moveOffset.y += dy;
renderPixelCanvas();

const {x0, y0, data} = selectionData;
for(let yy = 0; yy < data.length; yy++) {
for(let xx = 0; xx < data[0].length; xx++) {
const px = x0 + xx + moveOffset.x;
const py = y0 + yy + moveOffset.y;
if(px >= 0 && py >= 0 && px < canvasWidth && py < canvasHeight) {
const cell = pixelCanvas.querySelector(`.cell[data-x="${px}"][data-y="${py}"]`);
if(cell && data[yy][xx] !== ‘transparent’) {
cell.style.backgroundColor = data[yy][xx];
}
}
}
}
}

function finalizeSelection() {
if(!selectionData) return;
const {x0, y0, data} = selectionData;
for(let yy = 0; yy < data.length; yy++) {
for(let xx = 0; xx < data[0].length; xx++) {
const px = x0 + xx + moveOffset.x;
const py = y0 + yy + moveOffset.y;
if(px >= 0 && py >= 0 && px < canvasWidth && py < canvasHeight) {
pixelData[py][px] = data[yy][xx];
}
}
}
selectionData = null;
isMovingSelection = false;
moveOffset = {x: 0, y: 0};
renderPixelCanvas();
}

// =====================
// PIXEL TOOL HANDLERS
// =====================
function handlePixelPaint(e) {
if(!e || currentMode !== ‘pixel’) return;

const {x, y} = getCellFromEvent(e);
if(x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) return;

let color = e.button === 2 ? secondaryColor : primaryColor;

switch(currentTool) {
case ‘pencil’:
paintPixel(x, y, color);
break;
case ‘eraser’:
paintPixel(x, y, ‘transparent’);
break;
case ‘symmetricPencil’:
getSymmetricPoints(x, y).forEach(p => paintPixel(p.x, p.y, color));
break;
case ‘symmetricEraser’:
getSymmetricPoints(x, y).forEach(p => paintPixel(p.x, p.y, ‘transparent’));
break;
case ‘fill’:
savePixelState();
floodFill(x, y, color);
break;
case ‘symmetricFill’:
savePixelState();
getSymmetricPoints(x, y).forEach(p => {
if(p.x >= 0 && p.y >= 0 && p.x < canvasWidth && p.y < canvasHeight) {
floodFill(p.x, p.y, color);
}
});
break;
case ‘eyedropper’:
if(pixelData[y] && pixelData[y][x]) {
if(e.button === 2) {
secondaryColor = pixelData[y][x];
} else {
primaryColor = pixelData[y][x];
}
updateCanvasInfo();
updateColorSwatches();
}
break;
}
}

// =====================
// MOUSE EVENTS
// =====================
let drawingShape = false;
let shapeStart = {x: 0, y: 0};

pixelCanvas.addEventListener(‘mousedown’, e => {
if(currentMode !== ‘pixel’) return;
e.preventDefault();

const {x, y} = getCellFromEvent(e);

if(currentTool === ‘select’) {
startSelection(x, y);
} else if([‘line’, ‘rect’, ‘circle’].includes(currentTool)) {
drawingShape = true;
shapeStart = {x, y};
savePixelState();
} else if(isMovingSelection) {
finalizeSelection();
} else {
savePixelState();
isPainting = true;
handlePixelPaint(e);
}

lastMousePos = {x: e.clientX, y: e.clientY};
});

pixelCanvas.addEventListener(‘mousemove’, e => {
if(currentMode !== ‘pixel’) return;
e.preventDefault();

const {x, y} = getCellFromEvent(e);

if(isSelecting) {
const x0 = Math.min(selectionStart.x, x);
const y0 = Math.min(selectionStart.y, y);
const x1 = Math.max(selectionStart.x, x);
const y1 = Math.max(selectionStart.y, y);

```
previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
previewCtx.strokeStyle = 'rgba(0,150,255,0.8)';
previewCtx.lineWidth = 2;
previewCtx.setLineDash([4, 2]);
previewCtx.strokeRect(
  x0 * cellSize,
  y0 * cellSize,
  (x1 - x0 + 1) * cellSize,
  (y1 - y0 + 1) * cellSize
);
```

} else if(drawingShape) {
drawPreviewShape(shapeStart.x, shapeStart.y, x, y, currentTool, primaryColor);
} else if(isMovingSelection && lastMousePos) {
const dx = Math.floor((e.clientX - lastMousePos.x) / cellSize);
const dy = Math.floor((e.clientY - lastMousePos.y) / cellSize);
if(dx !== 0 || dy !== 0) {
moveSelection(dx, dy);
lastMousePos = {x: e.clientX, y: e.clientY};
}
} else if(isPainting) {
handlePixelPaint(e);
}
});

pixelCanvas.addEventListener(‘mouseup’, e => {
if(currentMode !== ‘pixel’) return;
e.preventDefault();

const {x, y} = getCellFromEvent(e);

if(isSelecting) {
endSelection(x, y);
previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
} else if(drawingShape) {
drawingShape = false;
previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

```
switch(currentTool) {
  case 'line':
    drawLine(shapeStart.x, shapeStart.y, x, y, primaryColor);
    break;
  case 'rect':
    drawRect(shapeStart.x, shapeStart.y, x, y, primaryColor, false);
    break;
  case 'circle':
    const radius = Math.round(Math.hypot(x - shapeStart.x, y - shapeStart.y));
    drawCircle(shapeStart.x, shapeStart.y, radius, primaryColor, false);
    break;
}
```

}

isPainting = false;
lastMousePos = null;
renderPixelCanvas();
});

// Touch events
pixelCanvas.addEventListener(‘touchstart’, e => {
if(currentMode !== ‘pixel’) return;
e.preventDefault();
const touch = e.touches[0];
const mouseEvent = new MouseEvent(‘mousedown’, {
clientX: touch.clientX,
clientY: touch.clientY,
button: 0
});
pixelCanvas.dispatchEvent(mouseEvent);
});

pixelCanvas.addEventListener(‘touchmove’, e => {
if(currentMode !== ‘pixel’) return;
e.preventDefault();
const touch = e.touches[0];
const mouseEvent = new MouseEvent(‘mousemove’, {
clientX: touch.clientX,
clientY: touch.clientY
});
pixelCanvas.dispatchEvent(mouseEvent);
});

pixelCanvas.addEventListener(‘touchend’, e => {
if(currentMode !== ‘pixel’) return;
e.preventDefault();
const touch = e.changedTouches[0];
const mouseEvent = new MouseEvent(‘mouseup’, {
clientX: touch.clientX,
clientY: touch.clientY,
button: 0
});
pixelCanvas.dispatchEvent(mouseEvent);
});

// Right-click context menu prevention
pixelCanvas.addEventListener(‘contextmenu’, e => e.preventDefault());

// =====================
// SKETCH MODE HANDLERS
// =====================
function saveSketchState() {
const snapshot = sketchCanvas.toDataURL();
sketchUndoStack.push(snapshot);
sketchRedoStack = [];
if(sketchUndoStack.length > 50) sketchUndoStack.shift();
}

function restoreSketchState(stackFrom, stackTo) {
if(stackFrom.length === 0) return;
const snapshot = stackFrom.pop();
stackTo.push(sketchCanvas.toDataURL());
const img = new Image();
img.onload = () => {
sketchCtx.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);
sketchCtx.drawImage(img, 0, 0);
};
img.src = snapshot;
}

function getBrushSettings() {
return {
size: brushSize,
opacity: brushOpacity,
flow: brushFlow,
hardness: brushHardness / 100,
color: brushColor
};
}

function drawBrushStroke(x, y, settings) {
const { size, opacity, flow, hardness, color } = settings;

sketchCtx.save();
sketchCtx.globalAlpha = opacity * flow;
sketchCtx.fillStyle = color;
sketchCtx.beginPath();

if(hardness < 1) {
// Soft brush
const gradient = sketchCtx.createRadialGradient(x, y, 0, x, y, size / 2);
gradient.addColorStop(0, color);
gradient.addColorStop(hardness, color);
gradient.addColorStop(1, color + ‘00’);
sketchCtx.fillStyle = gradient;
}

sketchCtx.arc(x, y, size / 2, 0, Math.PI * 2);
sketchCtx.fill();
sketchCtx.restore();
}

sketchCanvas.addEventListener(‘mousedown’, e => {
if(currentMode !== ‘sketch’) return;
e.preventDefault();
sketchPainting = true;
saveSketchState();

const rect = sketchCanvas.getBoundingClientRect();
const x = (e.clientX - rect.left) / zoomLevel;
const y = (e.clientY - rect.top) / zoomLevel;

sketchCtx.beginPath();
sketchCtx.moveTo(x, y);

const settings = getBrushSettings();
drawBrushStroke(x, y, settings);
});

sketchCanvas.addEventListener(‘mousemove’, e => {
if(currentMode !== ‘sketch’ || !sketchPainting) return;
e.preventDefault();

const rect = sketchCanvas.getBoundingClientRect();
const x = (e.clientX - rect.left) / zoomLevel;
const y = (e.clientY - rect.top) / zoomLevel;

const settings = getBrushSettings();

sketchCtx.globalAlpha = settings.opacity * settings.flow;
sketchCtx.strokeStyle = settings.color;
sketchCtx.lineWidth = settings.size;
sketchCtx.lineCap = ‘round’;
sketchCtx.lineJoin = ‘round’;

sketchCtx.lineTo(x, y);
sketchCtx.stroke();
});

sketchCanvas.addEventListener(‘mouseup’, () => {
if(currentMode !== ‘sketch’) return;
sketchPainting = false;
});

// Touch events for sketch
sketchCanvas.addEventListener(‘touchstart’, e => {
if(currentMode !== ‘sketch’) return;
e.preventDefault();
const touch = e.touches[0];
const mouseEvent = new MouseEvent(‘mousedown’, {
clientX: touch.clientX,
clientY: touch.clientY
});
sketchCanvas.dispatchEvent(mouseEvent);
});

sketchCanvas.addEventListener(‘touchmove’, e => {
if(currentMode !== ‘sketch’) return;
e.preventDefault();
const touch = e.touches[0];
const mouseEvent = new MouseEvent(‘mousemove’, {
clientX: touch.clientX,
clientY: touch.clientY
});
sketchCanvas.dispatchEvent(mouseEvent);
});

sketchCanvas.addEventListener(‘touchend’, e => {
if(currentMode !== ‘sketch’) return;
e.preventDefault();
const mouseEvent = new MouseEvent(‘mouseup’, {});
sketchCanvas.dispatchEvent(mouseEvent);
});

// =====================
// TOOL BUTTONS
// =====================
document.querySelectorAll(’.tool-btn’).forEach(btn => {
btn.addEventListener(‘click’, () => {
document.querySelectorAll(’.tool-btn’).forEach(b => b.classList.remove(‘active’));
btn.classList.add(‘active’);
currentTool = btn.dataset.tool;
updateCanvasInfo();
});
});

// =====================
// MODE SWITCHING
// =====================
let lastPixelColorIndex = 0;

function updateModeDisplay() {
const paletteContainer = document.getElementById(‘swatches’);
const pixelControls = document.querySelectorAll(’.pixel-controls’);
const sketchControls = document.querySelectorAll(’.sketch-controls’);

if(currentMode === ‘pixel’) {
pixelCanvas.style.display = ‘grid’;
sketchCanvas.style.display = ‘none’;

```
document.querySelectorAll('.pixel-tools').forEach(d => d.style.display = 'flex');
document.querySelectorAll('.sketch-tools').forEach(d => d.style.display = 'none');

pixelControls.forEach(d => d.style.display = 'block');
sketchControls.forEach(d => d.style.display = 'none');

paletteContainer.style.display = 'flex';
colorPickersContainer.style.display = (activePalette === customPalette ? 'flex' : 'none');

currentColorIndex = lastPixelColorIndex;
primaryColor = activePalette[currentColorIndex] || builtInPalette[0];
```

} else {
pixelCanvas.style.display = ‘none’;
sketchCanvas.style.display = ‘block’;

```
document.querySelectorAll('.pixel-tools').forEach(d => d.style.display = 'none');
document.querySelectorAll('.sketch-tools').forEach(d => d.style.display = 'flex');

pixelControls.forEach(d => d.style.display = 'none');
sketchControls.forEach(d => d.style.display = 'block');

paletteContainer.style.display = 'flex';
colorPickersContainer.style.display = (sketchActivePalette === sketchCustomPalette ? 'flex' : 'none');

brushColor = sketchActivePalette[sketchColorIndex] || sketchBuiltInPalette[0];

lastPixelColorIndex = currentColorIndex;
```

}

renderPalette();
updatePaletteSelector();
updateCanvasInfo();
}

document.querySelectorAll(’.mode-btn’).forEach(btn => {
btn.addEventListener(‘click’, () => {
document.querySelectorAll(’.mode-btn’).forEach(b => b.classList.remove(‘active’));
btn.classList.add(‘active’);
currentMode = btn.dataset.mode;
updateModeDisplay();
});
});

// =====================
// PALETTE HANDLING
// =====================
function renderPalette() {
if (!paletteContainer) return;
paletteContainer.innerHTML = ‘’;

const palette = (currentMode === ‘pixel’) ? activePalette : sketchActivePalette;
const index = (currentMode === ‘pixel’) ? currentColorIndex : sketchColorIndex;

palette.forEach((color, i) => {
const swatch = document.createElement(‘div’);
swatch.classList.add(‘swatch’);
swatch.style.backgroundColor = color;

```
if (i === index) {
  swatch.classList.add('selected');
}

swatch.addEventListener('click', () => {
  if(currentMode === 'pixel') {
    primaryColor = color;
    currentColorIndex = i;
  } else {
    brushColor = color;
    sketchColorIndex = i;
  }
  updateCanvasInfo();
  renderPalette();
  updateColorSwatches();
});

paletteContainer.appendChild(swatch);
```

});
}

function updateColorSwatches() {
const primarySwatch = document.getElementById(‘primaryColor’);
const secondarySwatch = document.getElementById(‘secondaryColor’);

if(primarySwatch) primarySwatch.style.backgroundColor = primaryColor;
if(secondarySwatch) secondarySwatch.style.backgroundColor = secondaryColor;
}

const paletteSelector = document.getElementById(‘paletteSelector’);

function updatePaletteSelector() {
if(!paletteSelector) return;
paletteSelector.innerHTML = ‘’;

const builtInOption = document.createElement(‘option’);
builtInOption.value = ‘built-in’;
builtInOption.textContent = ‘Built-in Palette’;
paletteSelector.appendChild(builtInOption);

const customOption = document.createElement(‘option’);
customOption.value = ‘custom’;
customOption.textContent = ‘Custom Palette’;
paletteSelector.appendChild(customOption);

if(currentMode === ‘pixel’) {
paletteSelector.value = (activePalette === customPalette) ? ‘custom’ : ‘built-in’;
} else {
paletteSelector.value = (sketchActivePalette === sketchCustomPalette) ? ‘custom’ : ‘built-in’;
}
}

paletteSelector.addEventListener(‘change’, e => {
if(currentMode === ‘pixel’) {
activePalette = (e.target.value === ‘built-in’) ? builtInPalette : customPalette;
colorPickersContainer.style.display = (e.target.value === ‘custom’) ? ‘flex’ : ‘none’;
} else {
sketchActivePalette = (e.target.value === ‘built-in’) ? sketchBuiltInPalette : sketchCustomPalette;
colorPickersContainer.style.display = (e.target.value === ‘custom’) ? ‘flex’ : ‘none’;
}
renderPalette();
});

// Custom Palette UI
function renderCustomPalette() {
if(!colorPickersContainer) return;
colorPickersContainer.innerHTML = ‘’;

const targetPalette = currentMode === ‘pixel’ ? customPalette : sketchCustomPalette;

for(let i = 0; i < 8; i++) {
const input = document.createElement(‘input’);
input.type = ‘color’;
input.value = targetPalette[i] || ‘#ffffff’;
input.addEventListener(‘input’, e => {
targetPalette[i] = e.target.value;
renderPalette();
});
colorPickersContainer.appendChild(input);
}
}

const saveCustomPaletteBtn = document.getElementById(‘saveCustomPalette’);
if(saveCustomPaletteBtn) {
saveCustomPaletteBtn.addEventListener(‘click’, () => {
renderCustomPalette();
if(currentMode === ‘pixel’) {
activePalette = customPalette;
} else {
sketchActivePalette = sketchCustomPalette;
}
renderPalette();
});
}

// Primary/Secondary color swatches
const primarySwatch = document.getElementById(‘primaryColor’);
const secondarySwatch = document.getElementById(‘secondaryColor’);

if(primarySwatch) {
primarySwatch.addEventListener(‘click’, () => {
const input = document.createElement(‘input’);
input.type = ‘color’;
input.value = primaryColor;
input.addEventListener(‘change’, e => {
primaryColor = e.target.value;
updateColorSwatches();
updateCanvasInfo();
});
input.click();
});
}

if(secondarySwatch) {
secondarySwatch.addEventListener(‘click’, () => {
const input = document.createElement(‘input’);
input.type = ‘color’;
input.value = secondaryColor;
input.addEventListener(‘change’, e => {
secondaryColor = e.target.value;
updateColorSwatches();
});
input.click();
});
}

// =====================
// SYMMETRY CONTROLS
// =====================
document.querySelectorAll(’.symmetry-btn’).forEach(btn => {
btn.addEventListener(‘click’, () => {
document.querySelectorAll(’.symmetry-btn’).forEach(b => b.classList.remove(‘active’));
btn.classList.add(‘active’);
symmetryMode = btn.dataset.symmetry;
});
});

// =====================
// CANVAS CONTROLS
// =====================
const undoBtn = document.getElementById(‘undo’);
const redoBtn = document.getElementById(‘redo’);
const clearBtn = document.getElementById(‘clear’);

if(undoBtn) {
undoBtn.addEventListener(‘click’, () => {
if(currentMode === ‘pixel’) {
restorePixelState(pixelUndoStack, pixelRedoStack);
} else {
restoreSketchState(sketchUndoStack, sketchRedoStack);
}
});
}

if(redoBtn) {
redoBtn.addEventListener(‘click’, () => {
if(currentMode === ‘pixel’) {
restorePixelState(pixelRedoStack, pixelUndoStack);
} else {
restoreSketchState(sketchRedoStack, sketchUndoStack);
}
});
}

if(clearBtn) {
clearBtn.addEventListener(‘click’, () => {
if(currentMode === ‘pixel’) {
savePixelState();
createPixelGrid(canvasWidth, canvasHeight);
} else {
saveSketchState();
sketchCtx.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);
}
});
}

// Canvas resize
const resizeBtn = document.getElementById(‘resizeCanvas’);
if(resizeBtn) {
resizeBtn.addEventListener(‘click’, () => {
const widthInput = document.getElementById(‘canvasWidth’);
const heightInput = document.getElementById(‘canvasHeight’);

```
if(widthInput && heightInput) {
  const w = parseInt(widthInput.value);
  const h = parseInt(heightInput.value);
  
  if(!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
    canvasWidth = w;
    canvasHeight = h;

    if(currentMode === 'pixel') {
      createPixelGrid(canvasWidth, canvasHeight);
    } else {
      sketchCanvas.width = canvasWidth * cellSize;
      sketchCanvas.height = canvasHeight * cellSize;
      sketchCanvas.style.transform = `scale(${zoomLevel})`;
    }
    
    updateCanvasInfo();
  }
}
```

});
}

// Grid toggle
const gridToggle = document.getElementById(‘gridToggle’);
if(gridToggle) {
gridToggle.addEventListener(‘change’, e => {
canvasGrid.style.display = e.target.checked ? ‘grid’ : ‘none’;
});
}

// =====================
// BRUSH CONTROLS (SKETCH)
// =====================
const brushSizeSlider = document.getElementById(‘brushSize’);
const brushSizeLabel = document.getElementById(‘brushSizeLabel’);
const brushOpacitySlider = document.getElementById(‘brushOpacity’);
const opacityLabel = document.getElementById(‘opacityLabel’);
const brushHardnessSlider = document.getElementById(‘brushHardness’);
const hardnessLabel = document.getElementById(‘hardnessLabel’);
const brushFlowSlider = document.getElementById(‘brushFlow’);
const flowLabel = document.getElementById(‘flowLabel’);
const sketchColorPicker = document.getElementById(‘sketchColor’);

if(brushSizeSlider && brushSizeLabel) {
brushSizeSlider.addEventListener(‘input’, e => {
brushSize = parseInt(e.target.value);
brushSizeLabel.textContent = brushSize;
updateBrushPreview();
});
}

if(brushOpacitySlider && opacityLabel) {
brushOpacitySlider.addEventListener(‘input’, e => {
brushOpacity = parseInt(e.target.value) / 100;
opacityLabel.textContent = e.target.value;
updateBrushPreview();
});
}

if(brushHardnessSlider && hardnessLabel) {
brushHardnessSlider.addEventListener(‘input’, e => {
brushHardness = parseInt(e.target.value);
hardnessLabel.textContent = e.target.value;
updateBrushPreview();
});
}

if(brushFlowSlider && flowLabel) {
brushFlowSlider.addEventListener(‘input’, e => {
brushFlow = parseInt(e.target.value) / 100;
flowLabel.textContent = e.target.value;
});
}

if(sketchColorPicker) {
sketchColorPicker.addEventListener(‘input’, e => {
brushColor = e.target.value;
updateCanvasInfo();
updateBrushPreview();
});
}

function updateBrushPreview() {
const preview = document.getElementById(‘brushPreview’);
if(!preview) return;

preview.innerHTML = ‘’;
const canvas = document.createElement(‘canvas’);
canvas.width = 50;
canvas.height = 50;
const ctx = canvas.getContext(‘2d’);

ctx.fillStyle = ‘#f0f0f0’;
ctx.fillRect(0, 0, 50, 50);

const centerX = 25;
const centerY = 25;
const previewSize = Math.min(brushSize, 40);

ctx.save();
ctx.globalAlpha = brushOpacity;

if(brushHardness < 100) {
const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, previewSize / 2);
gradient.addColorStop(0, brushColor);
gradient.addColorStop(brushHardness / 100, brushColor);
gradient.addColorStop(1, brushColor + ‘00’);
ctx.fillStyle = gradient;
} else {
ctx.fillStyle = brushColor;
}

ctx.beginPath();
ctx.arc(centerX, centerY, previewSize / 2, 0, Math.PI * 2);
ctx.fill();
ctx.restore();

preview.appendChild(canvas);
}

// =====================
// ZOOM CONTROLS
// =====================
const zoomInBtn = document.getElementById(‘zoomIn’);
const zoomOutBtn = document.getElementById(‘zoomOut’);
const zoomResetBtn = document.getElementById(‘zoomReset’);
const zoomIndicator = document.getElementById(‘zoomIndicator’);

if(zoomInBtn) {
zoomInBtn.addEventListener(‘click’, () => {
zoomLevel = Math.min(zoomLevel * 1.25, 5);
if(currentMode === ‘sketch’) {
sketchCanvas.style.transform = `scale(${zoomLevel})`;
}
if(zoomIndicator) {
zoomIndicator.textContent = Math.round(zoomLevel * 100) + ‘%’;
}
});
}

if(zoomOutBtn) {
zoomOutBtn.addEventListener(‘click’, () => {
zoomLevel = Math.max(zoomLevel / 1.25, 0.1);
if(currentMode === ‘sketch’) {
sketchCanvas.style.transform = `scale(${zoomLevel})`;
}
if(zoomIndicator) {
zoomIndicator.textContent = Math.round(zoomLevel * 100) + ‘%’;
}
});
}

if(zoomResetBtn) {
zoomResetBtn.addEventListener(‘click’, () => {
zoomLevel = 1;
if(currentMode === ‘sketch’) {
sketchCanvas.style.transform = `scale(${zoomLevel})`;
}
if(zoomIndicator) {
zoomIndicator.textContent = ‘100%’;
}
});
}

// =====================
// SPRITES HANDLING
// =====================
let sprites = [];
let currentSpriteIndex = -1;
const spriteSelector = document.getElementById(‘spriteSelector’);

function updateSpriteSelector() {
if(!spriteSelector) return;
spriteSelector.innerHTML = ‘’;

sprites.forEach((s, i) => {
const option = document.createElement(‘option’);
option.value = i;
option.textContent = s.name || `Sprite ${i + 1}`;
spriteSelector.appendChild(option);
});

spriteSelector.value = currentSpriteIndex;
}

function newSprite() {
const sprite = {
name: `Sprite ${sprites.length + 1}`,
width: canvasWidth,
height: canvasHeight,
data: pixelData.map(row => […row])
};
sprites.push(sprite);
currentSpriteIndex = sprites.length - 1;
updateSpriteSelector();
}

function duplicateSprite() {
if(currentSpriteIndex < 0) return;
const original = sprites[currentSpriteIndex];
const copy = {
name: original.name + ’ Copy’,
width: original.width,
height: original.height,
data: original.data.map(row => […row])
};
sprites.push(copy);
currentSpriteIndex = sprites.length - 1;
pixelData = copy.data.map(row => […row]);
renderPixelCanvas();
updateSpriteSelector();
}

function deleteSprite() {
if(currentSpriteIndex < 0) return;
sprites.splice(currentSpriteIndex, 1);
currentSpriteIndex = sprites.length - 1;

if(currentSpriteIndex >= 0) {
pixelData = sprites[currentSpriteIndex].data.map(row => […row]);
renderPixelCanvas();
} else {
createPixelGrid(canvasWidth, canvasHeight);
}

updateSpriteSelector();
}

const newSpriteBtn = document.getElementById(‘newSprite’);
const duplicateSpriteBtn = document.getElementById(‘duplicateSprite’);
const deleteSpriteBtn = document.getElementById(‘deleteSprite’);

if(newSpriteBtn) newSpriteBtn.addEventListener(‘click’, newSprite);
if(duplicateSpriteBtn) duplicateSpriteBtn.addEventListener(‘click’, duplicateSprite);
if(deleteSpriteBtn) deleteSpriteBtn.addEventListener(‘click’, deleteSprite);

if(spriteSelector) {
spriteSelector.addEventListener(‘change’, e => {
currentSpriteIndex = parseInt(e.target.value);
if(currentSpriteIndex >= 0) {
pixelData = sprites[currentSpriteIndex].data.map(row => […row]);
renderPixelCanvas();
}
});
}

// =====================
// TRANSFORM CONTROLS
// =====================
const rotateLeftBtn = document.getElementById(‘rotateLeft’);
const rotate180Btn = document.getElementById(‘rotate180’);
const rotateRightBtn = document.getElementById(‘rotateRight’);
const flipHorizontalBtn = document.getElementById(‘flipHorizontal’);
const flipVerticalBtn = document.getElementById(‘flipVertical’);

function rotatePixelData(degrees) {
if(!selectionData) return;

const { data } = selectionData;
let rotated;

switch(degrees) {
case 90:
rotated = data[0].map((*, i) => data.map(row => row[i]).reverse());
break;
case 180:
rotated = data.slice().reverse().map(row => row.slice().reverse());
break;
case 270:
rotated = data[0].map((*, i) => data.map(row => row[row.length - 1 - i]));
break;
}

selectionData.data = rotated;
moveSelection(0, 0); // Refresh display
}

function flipPixelData(direction) {
if(!selectionData) return;

const { data } = selectionData;

if(direction === ‘horizontal’) {
selectionData.data = data.map(row => row.slice().reverse());
} else {
selectionData.data = data.slice().reverse();
}

moveSelection(0, 0); // Refresh display
}

if(rotateLeftBtn) rotateLeftBtn.addEventListener(‘click’, () => rotatePixelData(270));
if(rotate180Btn) rotate180Btn.addEventListener(‘click’, () => rotatePixelData(180));
if(rotateRightBtn) rotateRightBtn.addEventListener(‘click’, () => rotatePixelData(90));
if(flipHorizontalBtn) flipHorizontalBtn.addEventListener(‘click’, () => flipPixelData(‘horizontal’));
if(flipVerticalBtn) flipVerticalBtn.addEventListener(‘click’, () => flipPixelData(‘vertical’));

// =====================
// LAYERS HANDLING (SKETCH)
// =====================
function updateLayerList() {
const layerList = document.getElementById(‘layerList’);
if(!layerList) return;

layerList.innerHTML = ‘’;

sketchLayers.forEach((layer, i) => {
const layerDiv = document.createElement(‘div’);
layerDiv.className = ‘layer-item’ + (i === activeLayer ? ’ active’ : ‘’);
layerDiv.innerHTML = `<span class="layer-name">${layer.name}</span> <button class="layer-visibility" data-layer="${i}">${layer.visible ? '👁' : '🙈'}</button>`;

```
layerDiv.addEventListener('click', () => {
  activeLayer = i;
  updateLayerList();
});

layerList.appendChild(layerDiv);
```

});
}

const addLayerBtn = document.getElementById(‘addLayer’);
if(addLayerBtn) {
addLayerBtn.addEventListener(‘click’, () => {
const newLayer = {
id: sketchLayers.length,
name: `Layer ${sketchLayers.length + 1}`,
opacity: 1,
visible: true,
data: null
};
sketchLayers.push(newLayer);
activeLayer = sketchLayers.length - 1;
updateLayerList();
});
}

const layerOpacitySlider = document.getElementById(‘layerOpacity’);
const layerOpacityLabel = document.getElementById(‘layerOpacityLabel’);

if(layerOpacitySlider && layerOpacityLabel) {
layerOpacitySlider.addEventListener(‘input’, e => {
const opacity = parseInt(e.target.value);
layerOpacityLabel.textContent = opacity;
if(sketchLayers[activeLayer]) {
sketchLayers[activeLayer].opacity = opacity / 100;
}
});
}

// =====================
// EXPORT FUNCTIONALITY
// =====================
const exportPNGBtn = document.getElementById(‘exportPNG’);
const exportPNG2Btn = document.getElementById(‘exportPNG2’);
const exportJSONBtn = document.getElementById(‘exportJSON’);

function exportPixelArt() {
const tempCanvas = document.createElement(‘canvas’);
tempCanvas.width = canvasWidth;
tempCanvas.height = canvasHeight;
const ctx = tempCanvas.getContext(‘2d’);

for(let y = 0; y < canvasHeight; y++) {
for(let x = 0; x < canvasWidth; x++) {
ctx.fillStyle = pixelData[y][x] === ‘transparent’ ? ‘#ffffff’ : pixelData[y][x];
ctx.fillRect(x, y, 1, 1);
}
}

const link = document.createElement(‘a’);
link.download = ‘pixel-art.png’;
link.href = tempCanvas.toDataURL();
link.click();
}

function exportSketch() {
const link = document.createElement(‘a’);
link.download = ‘sketch.png’;
link.href = sketchCanvas.toDataURL();
link.click();
}

function exportJSON() {
if(currentMode === ‘pixel’) {
const data = {
width: canvasWidth,
height: canvasHeight,
pixelData: pixelData,
sprites: sprites
};

```
const dataStr = JSON.stringify(data, null, 2);
const blob = new Blob([dataStr], {type: 'application/json'});
const link = document.createElement('a');
link.href = URL.createObjectURL(blob);
link.download = 'pixel-art.json';
link.click();

const output = document.getElementById('output');
if(output) output.value = dataStr;
```

}
}

if(exportPNGBtn) {
exportPNGBtn.addEventListener(‘click’, () => {
if(currentMode === ‘pixel’) {
exportPixelArt();
} else {
exportSketch();
}
});
}

if(exportPNG2Btn) {
exportPNG2Btn.addEventListener(‘click’, () => {
if(currentMode === ‘pixel’) {
exportPixelArt();
} else {
exportSketch();
}
});
}

if(exportJSONBtn) {
exportJSONBtn.addEventListener(‘click’, exportJSON);
}

// =====================
// PROJECT MANAGEMENT
// =====================
const newProjectBtn = document.getElementById(‘newProject’);
const saveProjectBtn = document.getElementById(‘saveProject’);

if(newProjectBtn) {
newProjectBtn.addEventListener(‘click’, () => {
if(confirm(‘Create new project? This will clear current work.’)) {
if(currentMode === ‘pixel’) {
createPixelGrid(canvasWidth, canvasHeight);
sprites = [];
currentSpriteIndex = -1;
updateSpriteSelector();
} else {
sketchCtx.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);
sketchLayers = [{ id: 0, name: ‘Layer 1’, opacity: 1, visible: true, data: null }];
activeLayer = 0;
updateLayerList();
}

```
  pixelUndoStack = [];
  pixelRedoStack = [];
  sketchUndoStack = [];
  sketchRedoStack = [];
}
```

});
}

if(saveProjectBtn) {
saveProjectBtn.addEventListener(‘click’, () => {
const projectData = {
mode: currentMode,
canvasWidth,
canvasHeight,
pixelData: currentMode === ‘pixel’ ? pixelData : null,
sketchData: currentMode === ‘sketch’ ? sketchCanvas.toDataURL() : null,
sprites,
currentSpriteIndex,
primaryColor,
secondaryColor,
customPalette,
sketchCustomPalette
};

```
const dataStr = JSON.stringify(projectData, null, 2);
const blob = new Blob([dataStr], {type: 'application/json'});
const link = document.createElement('a');
link.href = URL.createObjectURL(blob);
link.download = 'jerry-editor-project.json';
link.click();
```

});
}

// Import functionality
const importFile = document.getElementById(‘importFile’);
if(importFile) {
importFile.addEventListener(‘change’, e => {
const file = e.target.files[0];
if(!file) return;

```
const reader = new FileReader();
reader.onload = e => {
  try {
    const data = JSON.parse(e.target.result);
    
    if(data.pixelData) {
      // Import pixel art
      canvasWidth = data.width || canvasWidth;
      canvasHeight = data.height || canvasHeight;
      pixelData = data.pixelData;
      
      document.getElementById('canvasWidth').value = canvasWidth;
      document.getElementById('canvasHeight').value = canvasHeight;
      
      createPixelGrid(canvasWidth, canvasHeight);
      renderPixelCanvas();
      
      if(data.sprites) {
        sprites = data.sprites;
        currentSpriteIndex = data.currentSpriteIndex || -1;
        updateSpriteSelector();
      }
      
      currentMode = 'pixel';
      document.querySelector('[data-mode="pixel"]').click();
    }
    
    updateCanvasInfo();
  } catch(error) {
    alert('Error importing file: ' + error.message);
  }
};
reader.readAsText(file);
```

});
}

// =====================
// KEYBOARD SHORTCUTS
// =====================
document.addEventListener(‘keydown’, e => {
if(e.ctrlKey || e.metaKey) {
switch(e.key) {
case ‘z’:
e.preventDefault();
if(e.shiftKey) {
document.getElementById(‘redo’)?.click();
} else {
document.getElementById(‘undo’)?.click();
}
break;
case ‘n’:
e.preventDefault();
document.getElementById(‘newProject’)?.click();
break;
case ‘s’:
e.preventDefault();
document.getElementById(‘saveProject’)?.click();
break;
}
} else {
switch(e.key) {
case ‘b’:
document.querySelector(’[data-tool=“pencil”]’)?.click();
break;
case ‘e’:
document.querySelector(’[data-tool=“eraser”]’)?.click();
break;
case ‘g’:
document.querySelector(’[data-tool=“fill”]’)?.click();
break;
case ‘i’:
document.querySelector(’[data-tool=“eyedropper”]’)?.click();
break;
case ‘l’:
document.querySelector(’[data-tool=“line”]’)?.click();
break;
case ‘r’:
document.querySelector(’[data-tool=“rect”]’)?.click();
break;
case ‘o’:
document.querySelector(’[data-tool=“circle”]’)?.click();
break;
case ‘m’:
document.querySelector(’[data-tool=“select”]’)?.click();
break;
}
}
});

// =====================
// INITIALIZATION
// =====================
function initialize() {
createPixelGrid(canvasWidth, canvasHeight);
updateCanvasInfo();
renderPalette();
updatePaletteSelector();
updateModeDisplay();
updateColorSwatches();
updateBrushPreview();
updateSpriteSelector();
updateLayerList();
}

// Service Worker registration
if(‘serviceWorker’ in navigator) {
window.addEventListener(‘load’, () => {
navigator.serviceWorker.register(’./service-worker.js’)
.then(reg => console.log(‘Service Worker registered:’, reg))
.catch(err => console.error(‘SW registration failed:’, err));
});
}

// Prevent touch scrolling on canvas areas
document.body.addEventListener(‘touchstart’, e => {
if(e.target.closest(’#canvas’) || e.target.closest(’#sketchCanvas’)) {
e.preventDefault();
}
}, {passive: false});

document.body.addEventListener(‘touchmove’, e => {
if(e.target.closest(’#canvas’) || e.target.closest(’#sketchCanvas’)) {
e.preventDefault();
}
}, {passive: false});

// Initialize the app
initialize();
