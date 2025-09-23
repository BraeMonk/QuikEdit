// =====================
// editor.js - Jerry Editor
// =====================

// =====================
// GLOBAL STATE
// =====================
let currentMode = 'pixel'; // 'pixel' or 'sketch'
let currentTool = 'pencil';
let symmetryMode = 'none';
let isPainting = false;
let startX = 0, startY = 0;
let canvasWidth = 16, canvasHeight = 16;
let pixelData = [];
let cellSize = 20;
let lastMousePos = null;


let primaryColor = '#000000';
let secondaryColor = '#FFFFFF';
let builtInPalette = ['#000000','#FFFFFF','#FF0000','#00FF00','#0000FF','#FFFF00','#FF00FF','#00FFFF'];
let customPalette = ['#ffffff','#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff','#00ffff','#000000'];
let activePalette = builtInPalette;
let currentColorIndex = 0;

// NEW: Sketch palettes
let sketchBuiltInPalette = ['#000000','#555555','#AAAAAA','#FF5733','#FFC300','#DAF7A6','#33FF57','#3357FF'];
let sketchCustomPalette = ['#000000','#111111','#222222','#333333','#444444','#555555','#666666','#777777'];
let sketchActivePalette = sketchBuiltInPalette;
let sketchColorIndex = 0;

let pixelUndoStack = [];
let pixelRedoStack = [];
let sketchUndoStack = [];
let sketchRedoStack = [];
let selection = null;

// =====================
// PIXEL CANVAS
// =====================
const pixelCanvas = document.getElementById('canvas');
const canvasGrid = document.getElementById('canvasGrid');
const paletteContainer = document.getElementById('swatches');
const colorPickersContainer = document.getElementById('colorPickers') || document.createElement('div');


const previewCanvas = document.createElement('canvas');
previewCanvas.width = canvasWidth * cellSize;
previewCanvas.height = canvasHeight * cellSize;
previewCanvas.style.position = 'absolute';
previewCanvas.style.top = pixelCanvas.offsetTop + 'px';
previewCanvas.style.left = pixelCanvas.offsetLeft + 'px';
previewCanvas.style.pointerEvents = 'none'; // so it doesn't block mouse
pixelCanvas.parentElement.appendChild(previewCanvas);
const previewCtx = previewCanvas.getContext('2d');

document.body.addEventListener('touchstart', e => { if(e.target.closest('#canvas')||e.target.closest('#sketchCanvas')) e.preventDefault(); }, {passive:false});
document.body.addEventListener('touchmove', e => { if(e.target.closest('#canvas')||e.target.closest('#sketchCanvas')) e.preventDefault(); }, {passive:false});


// =====================
// SKETCH CANVAS
// =====================
const sketchCanvas = document.getElementById('sketchCanvas');
const sketchCtx = sketchCanvas.getContext('2d');
let sketchPainting = false;
let brushSize = 10;
let brushOpacity = 1;
let brushFlow = 1;
let brushColor = '#000000';
let zoomLevel = 1;
let sketchLayers = [];
let activeLayer = 0;

// =====================
// UTILITY FUNCTIONS
// =====================
function createPixelGrid(width, height) {
  pixelCanvas.innerHTML = '';
  canvasGrid.innerHTML = '';
  pixelData = [];
  pixelCanvas.style.gridTemplateColumns = `repeat(${width}, ${cellSize}px)`;
  pixelCanvas.style.gridTemplateRows = `repeat(${height}, ${cellSize}px)`;
  for(let y=0; y<height; y++){
    pixelData[y] = [];
    for(let x=0; x<width; x++){
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;
      cell.style.backgroundColor = 'transparent';
      pixelCanvas.appendChild(cell);
      pixelData[y][x] = 'transparent';
    }
  }
}

function drawPreviewShape(x0, y0, x1, y1, tool, color){
  if(!previewCtx) return;
  previewCtx.clearRect(0,0,previewCanvas.width, previewCanvas.height);
  previewCtx.fillStyle = color;
  previewCtx.strokeStyle = color;
  const scale = cellSize;
  
  function drawSymmetricPixel(px, py){
    getSymmetricPoints(px, py).forEach(p=>{
      previewCtx.fillRect(p.x*scale, p.y*scale, scale, scale);
    });
  }

  switch(tool){
    case 'line':
      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx - dy;
      let lx = x0;
      let ly = y0;
      while(true){
        drawSymmetricPixel(lx, ly);
        if(lx === x1 && ly === y1) break;
        let e2 = 2*err;
        if(e2 > -dy){ err -= dy; lx += sx; }
        if(e2 < dx){ err += dx; ly += sy; }
      }
      break;

    case 'rect':
      const xStart = Math.min(x0,x1);
      const xEnd = Math.max(x0,x1);
      const yStart = Math.min(y0,y1);
      const yEnd = Math.max(y0,y1);
      for(let y=yStart;y<=yEnd;y++){
        for(let x=xStart;x<=xEnd;x++){
          if(y===yStart || y===yEnd || x===xStart || x===xEnd){
            drawSymmetricPixel(x,y);
          }
        }
      }
      break;

    case 'circle':
      const radius = Math.round(Math.hypot(x1-x0, y1-y0));
      let cx = x0, cy = y0;
      for(let y=-radius;y<=radius;y++){
        for(let x=-radius;x<=radius;x++){
          if(x*x + y*y <= radius*radius){
            drawSymmetricPixel(cx+x, cy+y);
          }
        }
      }
      break;
  }
}


// =============================
// Symmetry Helper
// =============================

function getSymmetricPoints(x, y) {
  const points = [{x, y}];

  if (symmetryMode === 'vertical' || symmetryMode === 'both') {
    points.push({ x: canvasWidth - 1 - x, y });
  }

  if (symmetryMode === 'horizontal' || symmetryMode === 'both') {
    points.push({ x, y: canvasHeight - 1 - y });
  }

  if (symmetryMode === 'both') {
    points.push({ x: canvasWidth - 1 - x, y: canvasHeight - 1 - y });
  }

  // Remove duplicates
  return points.filter((v,i,a) => a.findIndex(t => t.x === v.x && t.y === v.y) === i);
}


function updateCanvasInfo(){
  const info = document.getElementById('canvasInfo');
  info.textContent = `${canvasWidth}×${canvasHeight} | ${currentTool} | ${primaryColor}`;
}

function savePixelState(){
  const snapshot = pixelData.map(row => [...row]);
  pixelUndoStack.push(snapshot);
  pixelRedoStack = [];
}

function restorePixelState(stackFrom, stackTo){
  if(stackFrom.length === 0) return;
  const snapshot = stackFrom.pop();
  stackTo.push(pixelData.map(row => [...row]));
  pixelData = snapshot.map(row => [...row]);
  renderPixelCanvas();
}

function renderPixelCanvas(){
  for(let y=0; y<canvasHeight; y++){
    for(let x=0; x<canvasWidth; x++){
      const cell = pixelCanvas.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
      if(cell) cell.style.backgroundColor = pixelData[y][x];
    }
  }
}

function getCellFromEvent(e){
  const rect = pixelCanvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left)/cellSize);
  const y = Math.floor((e.clientY - rect.top)/cellSize);
  return {x, y};
}

// =====================
// PIXEL SELECTION & MOVE TOOL
// =====================
let isSelecting = false;
let selectionStart = null;
let selectionData = null;
let isMovingSelection = false;
let moveOffset = {x:0, y:0};

// Start selection
function startSelection(x, y){
  isSelecting = true;
  selectionStart = {x, y};
}

// End selection and store data
function endSelection(x, y){
  if(!isSelecting) return;
  isSelecting = false;
  const x0 = Math.min(selectionStart.x, x);
  const y0 = Math.min(selectionStart.y, y);
  const x1 = Math.max(selectionStart.x, x);
  const y1 = Math.max(selectionStart.y, y);
  selectionData = {x0, y0, x1, y1, data:[]};

  for(let yy=y0; yy<=y1; yy++){
    let row = [];
    for(let xx=x0; xx<=x1; xx++){
      row.push(pixelData[yy][xx]);
    }
    selectionData.data.push(row);
  }
  renderPixelCanvas();
  isMovingSelection = true;
  moveOffset = {x:0, y:0};
}

// Move selection visually
function moveSelection(dx, dy){
  if(!selectionData) return;
  moveOffset.x += dx;
  moveOffset.y += dy;

  // First clear canvas
  renderPixelCanvas();

  const {x0, y0, data} = selectionData;

  // Draw selection as overlay
  for(let yy=0; yy<data.length; yy++){
    for(let xx=0; xx<data[0].length; xx++){
      const px = x0 + xx + moveOffset.x;
      const py = y0 + yy + moveOffset.y;
      if(px>=0 && py>=0 && px<canvasWidth && py<canvasHeight){
        const cell = pixelCanvas.querySelector(`.cell[data-x="${px}"][data-y="${py}"]`);
        if(cell) cell.style.backgroundColor = data[yy][xx];
      }
    }
  }
}


function finalizeSelection(){
  if(!selectionData) return;
  const {x0, y0, data} = selectionData;
  for(let yy=0; yy<data.length; yy++){
    for(let xx=0; xx<data[0].length; xx++){
      const px = x0 + xx + moveOffset.x;
      const py = y0 + yy + moveOffset.y;
      if(px>=0 && py>=0 && px<canvasWidth && py<canvasHeight){
        pixelData[py][px] = data[yy][xx];
      }
    }
  }
  selectionData = null;
  isMovingSelection = false;
  moveOffset = {x:0, y:0};
  renderPixelCanvas();
}


// =====================
// MOUSE EVENTS FOR SELECTION
// =====================
pixelCanvas.addEventListener('mousedown', e=>{
  const {x, y} = getCanvasCoords(e);
  if(currentTool==='select'){
    startSelection(x, y);
    lastMousePos = {x: e.clientX, y: e.clientY};
  } else {
    handlePixelPaint(e);
    renderPixelCanvas();
  }
});

pixelCanvas.addEventListener('mousemove', e=>{
  if(isSelecting){
    const rect = pixelCanvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left)/cellSize);
    const y = Math.floor((e.clientY - rect.top)/cellSize);

    const x0 = Math.min(selectionStart.x, x);
    const y0 = Math.min(selectionStart.y, y);
    const x1 = Math.max(selectionStart.x, x);
    const y1 = Math.max(selectionStart.y, y);

    previewCtx.clearRect(0,0,previewCanvas.width, previewCanvas.height);
    previewCtx.strokeStyle = 'rgba(0,150,255,0.8)';
    previewCtx.lineWidth = 2;
    previewCtx.setLineDash([4,2]);
    previewCtx.strokeRect(
        x0*cellSize,
        y0*cellSize,
        (x1-x0+1)*cellSize,
        (y1-y0+1)*cellSize
    );
} else {
    handlePixelPaint(e);
    renderPixelCanvas();
  }
});

pixelCanvas.addEventListener('mouseup', e=>{
  if(isSelecting){
    const {x, y} = getCanvasCoords(e);
    endSelection(x, y);
    previewCtx.clearRect(0,0,previewCanvas.width, previewCanvas.height); // <<< add this
    lastMousePos = null;
} else if(isMovingSelection){
    finalizeSelection();
    lastMousePos = null;
  }
});


// =====================
// PIXEL TOOL HANDLERS
// =====================
function paintPixel(x, y, color){
  if(x<0||y<0||x>=canvasWidth||y>=canvasHeight) return;
  pixelData[y][x] = color;
}

function handlePixelPaint(e){
  const {x,y} = getCellFromEvent(e);
  let color = primaryColor;

  switch(currentTool){
    case 'pencil':
      paintPixel(x,y,color);
      break;
    case 'eraser':
      paintPixel(x,y,'transparent');
      break;
    case 'symmetricPencil':
      getSymmetricPoints(x,y).forEach(p=>paintPixel(p.x,p.y,color));
      break;
    case 'symmetricEraser':
      getSymmetricPoints(x,y).forEach(p=>paintPixel(p.x,p.y,'transparent'));
      break;
  }

  renderPixelCanvas();
}


// =============================
// Shape Drawing Functions
// =============================

function drawLine(x0, y0, x1, y1, color) {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while(true){
    getSymmetricPoints(x0, y0).forEach(p => setPixel(p.x, p.y, color));
    if (x0 === x1 && y0 === y1) break;
    let e2 = 2 * err;
    if(e2 > -dy){ err -= dy; x0 += sx; }
    if(e2 < dx){ err += dx; y0 += sy; }
  }
}

function drawRect(x0, y0, x1, y1, color, fill=true) {
  const xStart = Math.min(x0, x1);
  const xEnd = Math.max(x0, x1);
  const yStart = Math.min(y0, y1);
  const yEnd = Math.max(y0, y1);

  for(let y = yStart; y <= yEnd; y++){
    for(let x = xStart; x <= xEnd; x++){
      if(fill || y===yStart || y===yEnd || x===xStart || x===xEnd){
        getSymmetricPoints(x, y).forEach(p => setPixel(p.x, p.y, color));
      }
    }
  }
}

function drawCircle(cx, cy, radius, color, fill=true){
  let x = radius;
  let y = 0;
  let err = 0;

  while (x >= y){
    const points = [
      [cx + x, cy + y], [cx + y, cy + x], [cx - y, cy + x], [cx - x, cy + y],
      [cx - x, cy - y], [cx - y, cy - x], [cx + y, cy - x], [cx + x, cy - y]
    ];

    points.forEach(([px, py]) => {
      if(fill){
        // Fill: draw horizontal lines for filled circle
        drawLine(cx, cy, px, py, color);
      } else {
        getSymmetricPoints(px, py).forEach(p => setPixel(p.x, p.y, color));
      }
    });

    y += 1;
    if(err <= 0){
      err += 2*y + 1;
    }
    if(err > 0){
      x -= 1;
      err -= 2*x + 1;
    }
  }
}

// =============================
// Pixel Setter Helper
// =============================
function setPixel(x, y, color){
  if(x<0||y<0||x>=canvasWidth||y>=canvasHeight) return;
  pixelData[y][x] = color;
  const cell = pixelCanvas.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
  if(cell) cell.style.backgroundColor = color;
}

function getCanvasCoords(e, canvasElem = pixelCanvas){
  const rect = canvasElem.getBoundingClientRect();
  return {
    x: Math.floor((e.clientX - rect.left)/cellSize),
    y: Math.floor((e.clientY - rect.top)/cellSize)
  };
}


function getTouchPos(e, canvasElem) {
  const rect = canvasElem.getBoundingClientRect();
  const touch = e.touches[0] || e.changedTouches[0];
  return {
    x: Math.floor((touch.clientX - rect.left) / cellSize),
    y: Math.floor((touch.clientY - rect.top) / cellSize)
  };
}


function saveStateForUndo(){
  const snapshot = pixelData.map(row => [...row]);
  pixelUndoStack.push(snapshot);
  pixelRedoStack = [];
}

// =====================
// EVENT LISTENERS
// =====================

// Mouse Events
let drawingShape = false;
let shapeStart = {x:0, y:0};

pixelCanvas.addEventListener('mousedown', e => {
  const {x, y} = getCanvasCoords(e);
  if(['line','rect','circle'].includes(currentTool)){
    drawingShape = true;
    shapeStart = {x, y};
    saveStateForUndo(); // optional
  } else {
    handlePixelPaint(e);
    renderPixelCanvas();
  }
});

pixelCanvas.addEventListener('mousemove', e => {
  const {x, y} = getCanvasCoords(e);
  if(drawingShape){
    drawPreviewShape(shapeStart.x, shapeStart.y, x, y, currentTool, primaryColor);
  } else {
    handlePixelPaint(e);
    renderPixelCanvas();
  }
});

pixelCanvas.addEventListener('mouseup', e => {
  if(drawingShape){
    drawingShape = false;
    previewCtx.clearRect(0,0,previewCanvas.width, previewCanvas.height); // clear overlay
    const {x, y} = getCanvasCoords(e);
    const color = primaryColor;
    switch(currentTool){
      case 'line': drawLine(shapeStart.x, shapeStart.y, x, y, color); break;
      case 'rect': drawRect(shapeStart.x, shapeStart.y, x, y, color, true); break;
      case 'circle': 
        const r = Math.round(Math.hypot(x - shapeStart.x, y - shapeStart.y));
        drawCircle(shapeStart.x, shapeStart.y, r, color, true);
        break;
    }
  }
});

// Pixel Canvas Touch Events
let lastTouchPos = null;

pixelCanvas.addEventListener('touchstart', e=>{
  e.preventDefault();
  lastTouchPos = getTouchPos(e, pixelCanvas);
  const {x,y} = lastTouchPos;
  if(currentTool==='select') startSelection(x,y);
  else handlePixelPaint({clientX: e.touches[0].clientX, clientY: e.touches[0].clientY});
});

pixelCanvas.addEventListener('touchmove', e=>{
  e.preventDefault();
  const touchPos = getTouchPos(e, pixelCanvas);
  if(isMovingSelection && currentTool==='select' && lastTouchPos){
    const dx = Math.round(touchPos.x - lastTouchPos.x);
    const dy = Math.round(touchPos.y - lastTouchPos.y);
    moveSelection(dx, dy);
} else if(!isSelecting) {
    handlePixelPaint({clientX: e.touches[0].clientX, clientY: e.touches[0].clientY});
    renderPixelCanvas();
  }
  lastTouchPos = touchPos;
});

pixelCanvas.addEventListener('touchend', e=>{
  e.preventDefault();
  if(isSelecting) {
    const {x,y} = getTouchPos(e, pixelCanvas);
    endSelection(x,y);
  } else if(isMovingSelection){
    finalizeSelection();
  }
  lastTouchPos = null;
});


// Sketch Canvas Touch Events
sketchCanvas.addEventListener('touchstart', e => {
  if(currentMode!=='sketch') return;
  e.preventDefault();
  sketchPainting = true;
  sketchCtx.globalAlpha = brushOpacity * brushFlow;
  sketchCtx.strokeStyle = brushColor;
  sketchCtx.lineWidth = brushSize;
  sketchCtx.lineCap = 'round';
  const touch = e.touches[0];
  sketchCtx.beginPath();
  sketchCtx.moveTo(touch.offsetX, touch.offsetY);
  saveSketchState(); // optional undo snapshot
});

sketchCanvas.addEventListener('touchmove', e => {
  if(currentMode!=='sketch'||!sketchPainting) return;
  e.preventDefault();
  const touch = e.touches[0];
  sketchCtx.lineTo(touch.offsetX, touch.offsetY);
  sketchCtx.stroke();
});

sketchCanvas.addEventListener('touchend', e => {
  if(currentMode!=='sketch') return;
  e.preventDefault();
  sketchPainting = false;
});




// Tool Buttons
document.querySelectorAll('.tool-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tool-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentTool = btn.dataset.tool;
  });
});

// Mode Switch
document.querySelectorAll('.mode-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;
    updateModeDisplay();
  });
});

let lastPixelColorIndex = 0; // remember last selected color in pixel mode

function updateModeDisplay(){
  const paletteContainer = document.getElementById('swatches');

  if(currentMode==='pixel'){
    pixelCanvas.style.display='grid';
    sketchCanvas.style.display='none';
    document.querySelectorAll('.pixel-tools').forEach(d=>d.style.display='flex');
    document.querySelectorAll('.sketch-tools').forEach(d=>d.style.display='none');

    paletteContainer.style.display = 'flex';
    colorPickersContainer.style.display = (activePalette === customPalette ? 'flex' : 'none');

    currentColorIndex = lastPixelColorIndex;
    primaryColor = activePalette[currentColorIndex] || builtInPalette[0];

    renderPalette();
    updatePaletteSelector();

  } else {
    pixelCanvas.style.display='none';
    sketchCanvas.style.display='block';
    document.querySelectorAll('.pixel-tools').forEach(d=>d.style.display='none');
    document.querySelectorAll('.sketch-tools').forEach(d=>d.style.display='flex');

    // Show sketch palettes now
    paletteContainer.style.display = 'flex';
    colorPickersContainer.style.display = (sketchActivePalette === sketchCustomPalette ? 'flex' : 'none');

    brushColor = sketchActivePalette[sketchColorIndex] || sketchBuiltInPalette[0];

    renderPalette();
    updatePaletteSelector();

    lastPixelColorIndex = currentColorIndex;
  }
}

// Undo/Redo
document.getElementById('undo').addEventListener('click', ()=>restorePixelState(pixelUndoStack,pixelRedoStack));
document.getElementById('redo').addEventListener('click', ()=>restorePixelState(pixelRedoStack,pixelUndoStack));

// Clear Canvas
document.getElementById('clear').addEventListener('click', ()=>{
  if(currentMode==='pixel'){
    savePixelState();
    createPixelGrid(canvasWidth, canvasHeight);
  } else {
    saveSketchState();
    sketchCtx.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);
  }
});


// Resize Canvas
document.getElementById('resizeCanvas').addEventListener('click', ()=>{
  const w = parseInt(document.getElementById('canvasWidth').value);
  const h = parseInt(document.getElementById('canvasHeight').value);
  if(!isNaN(w) && !isNaN(h)){
    canvasWidth = w;
    canvasHeight = h;

    if(currentMode === 'pixel'){
      createPixelGrid(canvasWidth, canvasHeight);
    } else {
      // Resize sketch canvas
      const imgData = sketchCtx.getImageData(0, 0, sketchCanvas.width, sketchCanvas.height);
      sketchCanvas.width = canvasWidth * cellSize;
      sketchCanvas.style.transform = `scale(${zoomLevel})`;
      sketchCanvas.height = canvasHeight * cellSize;
      const tmpCanvas = document.createElement('canvas');
      tmpCanvas.width = imgData.width;
      tmpCanvas.height = imgData.height;
      tmpCanvas.getContext('2d').putImageData(imgData,0,0);
      sketchCtx.clearRect(0,0,sketchCanvas.width, sketchCanvas.height);
      sketchCtx.drawImage(tmpCanvas,0,0, sketchCanvas.width, sketchCanvas.height);
    }

    updateCanvasInfo();
  }
});


// Color Palette
function renderPalette() {
  const paletteContainer = document.getElementById('swatches');
  if (!paletteContainer) return;

  paletteContainer.innerHTML = '';

  const palette = (currentMode === 'pixel') ? activePalette : sketchActivePalette;
  const index = (currentMode === 'pixel') ? currentColorIndex : sketchColorIndex;

  palette.forEach((color, i) => {
    const sw = document.createElement('div');
    sw.classList.add('swatch');
    sw.style.backgroundColor = color;

    if (i === index) {
      sw.classList.add('selected');
    }

    sw.addEventListener('click', () => {
      if(currentMode === 'pixel'){
        primaryColor = color;
        currentColorIndex = i;
      } else {
        brushColor = color;
        sketchColorIndex = i;
      }
      updateCanvasInfo();
      renderPalette(); // re-render to update selected highlight
    });

    paletteContainer.appendChild(sw);
  });
}



// =====================
// PALETTE HANDLING
// =====================

const paletteSelector = document.getElementById('paletteSelector');

// Populate palette selector
function updatePaletteSelector(){
  paletteSelector.innerHTML = '';

  const builtInOption = document.createElement('option');
  builtInOption.value = 'built-in';
  builtInOption.textContent = 'Built-in Palette';
  paletteSelector.appendChild(builtInOption);

  const customOption = document.createElement('option');
  customOption.value = 'custom';
  customOption.textContent = 'Custom Palette';
  paletteSelector.appendChild(customOption);

  if(currentMode === 'pixel'){
    paletteSelector.value = (activePalette === customPalette) ? 'custom' : 'built-in';
  } else {
    paletteSelector.value = (sketchActivePalette === sketchCustomPalette) ? 'custom' : 'built-in';
  }
}

paletteSelector.addEventListener('change', e=>{
  if(currentMode === 'pixel'){
    activePalette = (e.target.value === 'built-in') ? builtInPalette : customPalette;
  } else {
    sketchActivePalette = (e.target.value === 'built-in') ? sketchBuiltInPalette : sketchCustomPalette;
  }
  renderPalette();
});


// Custom Palette UI
function renderCustomPalette(){
  colorPickersContainer.innerHTML = '';
  for(let i=0; i<8; i++){
    const input = document.createElement('input');
    input.type = 'color';
    input.value = customPalette[i] || '#ffffff';
    input.addEventListener('input', e=>{
      customPalette[i] = e.target.value;
      renderPalette();
    });
    colorPickersContainer.appendChild(input);
  }
}

paletteSelector.addEventListener('change', e=>{
  if(e.target.value === 'built-in'){
    activePalette = builtInPalette;
    colorPickersContainer.style.display = 'none';
  } else {
    activePalette = customPalette;
    colorPickersContainer.style.display = 'flex';
  }
  renderPalette();
});

document.getElementById('saveCustomPalette').addEventListener('click', ()=>{
  renderCustomPalette();
  activePalette = customPalette;
  renderPalette();
});

updatePaletteSelector();
renderCustomPalette();


// Initialize
createPixelGrid(canvasWidth,canvasHeight);
updateCanvasInfo();
renderPalette();
updateModeDisplay();

document.querySelectorAll('.symmetry-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.symmetry-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    symmetryMode = btn.dataset.symmetry;
  });
});


// =====================
// SPRITES HANDLING
// =====================
let sprites = [];
let currentSpriteIndex = -1;

const spriteSelector = document.getElementById('spriteSelector');

function updateSpriteSelector(){
  spriteSelector.innerHTML = '';
  sprites.forEach((s,i)=>{
    const option = document.createElement('option');
    option.value = i;
    option.textContent = s.name || `Sprite ${i+1}`;
    spriteSelector.appendChild(option);
  });
  spriteSelector.value = currentSpriteIndex;
}

function newSprite(){
  const sprite = {
    name: `Sprite ${sprites.length+1}`,
    width: canvasWidth,
    height: canvasHeight,
    data: pixelData.map(row=>[...row])
  };
  sprites.push(sprite);
  currentSpriteIndex = sprites.length-1;
  updateSpriteSelector();
}

function duplicateSprite(){
  if(currentSpriteIndex<0) return;
  const original = sprites[currentSpriteIndex];
  const copy = {
    name: original.name+' Copy',
    width: original.width,
    height: original.height,
    data: original.data.map(row=>[...row])
  };
  sprites.push(copy);
  currentSpriteIndex = sprites.length-1;
  pixelData = copy.data.map(row=>[...row]);
  renderPixelCanvas();
  updateSpriteSelector();
}

function deleteSprite(){
  if(currentSpriteIndex<0) return;
  sprites.splice(currentSpriteIndex,1);
  currentSpriteIndex = sprites.length-1;
  if(currentSpriteIndex>=0){
    pixelData = sprites[currentSpriteIndex].data.map(row=>[...row]);
    renderPixelCanvas();
  } else {
    createPixelGrid(canvasWidth,canvasHeight);
  }
  updateSpriteSelector();
}

// Events
document.getElementById('newSprite').addEventListener('click', newSprite);
document.getElementById('duplicateSprite').addEventListener('click', duplicateSprite);
document.getElementById('deleteSprite').addEventListener('click', deleteSprite);

spriteSelector.addEventListener('change', e=>{
  currentSpriteIndex = parseInt(e.target.value);
  if(currentSpriteIndex>=0){
    pixelData = sprites[currentSpriteIndex].data.map(row=>[...row]);
    renderPixelCanvas();
  }
});


// =====================
// SKETCH MODE HANDLERS
// =====================
sketchCanvas.addEventListener('mousedown', e=>{
  if(currentMode!=='sketch') return;
  sketchPainting = true;
  sketchCtx.globalAlpha = brushOpacity * brushFlow;
  sketchCtx.strokeStyle = brushColor;
  sketchCtx.lineWidth = brushSize;
  sketchCtx.lineCap = 'round';
  sketchCtx.beginPath();
  sketchCtx.moveTo(e.offsetX, e.offsetY);
});

sketchCanvas.addEventListener('mousemove', e=>{
  if(currentMode!=='sketch'||!sketchPainting) return;
  sketchCtx.lineTo(e.offsetX, e.offsetY);
  sketchCtx.stroke();
});

document.addEventListener('mouseup', e=>{
  sketchPainting = false;
});

// Brush Controls
document.getElementById('brushSize').addEventListener('input', e=>{
  brushSize = parseInt(e.target.value);
  document.getElementById('brushSizeLabel').textContent = brushSize;
});

document.getElementById('brushOpacity').addEventListener('input', e=>{
  brushOpacity = parseInt(e.target.value)/100;
  document.getElementById('opacityLabel').textContent = parseInt(e.target.value);
});

document.getElementById('sketchColor').addEventListener('input', e=>{
  brushColor = e.target.value;
});

// Zoom Controls
document.getElementById('zoomIn').addEventListener('click', ()=>{
  zoomLevel *= 1.25;
  sketchCanvas.style.transform = `scale(${zoomLevel})`;
  document.getElementById('zoomIndicator').textContent = Math.round(zoomLevel*100)+'%';
});
document.getElementById('zoomOut').addEventListener('click', ()=>{
  zoomLevel /= 1.25;
  sketchCanvas.style.transform = `scale(${zoomLevel})`;
  document.getElementById('zoomIndicator').textContent = Math.round(zoomLevel*100)+'%';
});
document.getElementById('zoomReset').addEventListener('click', ()=>{
  zoomLevel = 1;
  sketchCanvas.style.transform = `scale(${zoomLevel})`;
  document.getElementById('zoomIndicator').textContent = '100%';
});

// =====================
// SKETCH UNDO / REDO
// =====================
let sketchUndoStack = [];
let sketchRedoStack = [];

function saveSketchState(){
  const snapshot = sketchCanvas.toDataURL();
  sketchUndoStack.push(snapshot);
  sketchRedoStack = [];
}

function restoreSketchState(stackFrom, stackTo){
  if(stackFrom.length===0) return;
  const snapshot = stackFrom.pop();
  stackTo.push(sketchCanvas.toDataURL());
  const img = new Image();
  img.onload = ()=> sketchCtx.drawImage(img,0,0);
  img.src = snapshot;
}

// Buttons
document.getElementById('undoSketch').addEventListener('click', ()=>restoreSketchState(sketchUndoStack, sketchRedoStack));
document.getElementById('redoSketch').addEventListener('click', ()=>restoreSketchState(sketchRedoStack, sketchUndoStack));

// Save state on mouse down
sketchCanvas.addEventListener('mousedown', e=>{
  if(currentMode==='sketch') saveSketchState();
});


// =====================
// EXPORT
// =====================
document.getElementById('exportPNG').addEventListener('click', ()=>{
  if(currentMode==='pixel'){
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const ctx = tempCanvas.getContext('2d');
    for(let y=0;y<canvasHeight;y++){
      for(let x=0;x<canvasWidth;x++){
        ctx.fillStyle = pixelData[y][x]==='transparent'?'#ffffff':pixelData[y][x];
        ctx.fillRect(x, y, 1, 1);
      }
    }
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = tempCanvas.toDataURL();
    link.click();
  } else {
    const link = document.createElement('a');
    link.download = 'sketch.png';
    link.href = sketchCanvas.toDataURL();
    link.click();
  }
});

document.getElementById('exportJSON').addEventListener('click', ()=>{
  if(currentMode==='pixel'){
    const dataStr = JSON.stringify(pixelData);
    const blob = new Blob([dataStr],{type:'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pixel-art.json';
    link.click();
  }
});

// =====================
// NEW PROJECT
// =====================
document.getElementById('newProject').addEventListener('click', ()=>{
  if(currentMode==='pixel') createPixelGrid(canvasWidth,canvasHeight);
  else sketchCtx.clearRect(0,0,sketchCanvas.width,sketchCanvas.height);
});

// =====================
// GRID TOGGLE
// =====================
document.getElementById('gridToggle').addEventListener('change', e=>{
  canvasGrid.style.display = e.target.checked ? 'grid' : 'none';
});

// At the bottom of editor.js
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.error('SW registration failed:', err));
  });
}
