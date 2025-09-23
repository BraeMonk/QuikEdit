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

let primaryColor = '#000000';
let secondaryColor = '#FFFFFF';
let builtInPalette = ['#000000','#FFFFFF','#FF0000','#00FF00','#0000FF','#FFFF00','#FF00FF','#00FFFF'];
let customPalette = [];
let activePalette = builtInPalette;
let currentColorIndex = 0;

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
// PIXEL TOOL HANDLERS
// =====================
function paintPixel(x, y, color){
  if(x<0||y<0||x>=canvasWidth||y>=canvasHeight) return;
  pixelData[y][x] = color;
}

function handlePixelPaint(e){
  const {x,y} = getCellFromEvent(e);
  if(currentTool==='pencil') paintPixel(x,y,primaryColor);
  else if(currentTool==='eraser') paintPixel(x,y,'transparent');
  renderPixelCanvas();
}

// =====================
// EVENT LISTENERS
// =====================

// Mouse Events
pixelCanvas.addEventListener('mousedown', e=>{
  if(currentMode!=='pixel') return;
  isPainting = true;
  savePixelState();
  handlePixelPaint(e);
});

pixelCanvas.addEventListener('mousemove', e=>{
  if(currentMode!=='pixel'||!isPainting) return;
  handlePixelPaint(e);
});

document.addEventListener('mouseup', e=>{
  isPainting = false;
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

function updateModeDisplay(){
  if(currentMode==='pixel'){
    pixelCanvas.style.display='grid';
    sketchCanvas.style.display='none';
    document.querySelectorAll('.pixel-tools').forEach(d=>d.style.display='flex');
    document.querySelectorAll('.sketch-tools').forEach(d=>d.style.display='none');
  } else {
    pixelCanvas.style.display='none';
    sketchCanvas.style.display='block';
    document.querySelectorAll('.pixel-tools').forEach(d=>d.style.display='none');
    document.querySelectorAll('.sketch-tools').forEach(d=>d.style.display='flex');
  }
}

// Undo/Redo
document.getElementById('undo').addEventListener('click', ()=>restorePixelState(pixelUndoStack,pixelRedoStack));
document.getElementById('redo').addEventListener('click', ()=>restorePixelState(pixelRedoStack,pixelUndoStack));

// Clear Canvas
document.getElementById('clear').addEventListener('click', ()=>{
  savePixelState();
  createPixelGrid(canvasWidth,canvasHeight);
});

// Resize Canvas
document.getElementById('resizeCanvas').addEventListener('click', ()=>{
  const w = parseInt(document.getElementById('canvasWidth').value);
  const h = parseInt(document.getElementById('canvasHeight').value);
  if(!isNaN(w)&&!isNaN(h)){
    canvasWidth = w;
    canvasHeight = h;
    createPixelGrid(canvasWidth,canvasHeight);
    updateCanvasInfo();
  }
});

// Color Palette
function renderPalette(){
  paletteContainer.innerHTML = '';
  activePalette.forEach((c,i)=>{
    const sw = document.createElement('div');
    sw.classList.add('swatch');
    sw.style.backgroundColor = c;
    if(i===currentColorIndex) sw.classList.add('selected');
    sw.addEventListener('click', ()=>{
      primaryColor = c;
      currentColorIndex = i;
      updateCanvasInfo();
      renderPalette();
    });
    paletteContainer.appendChild(sw);
  });
}

// Initialize
createPixelGrid(canvasWidth,canvasHeight);
updateCanvasInfo();
renderPalette();
updateModeDisplay();

// =====================
// SKETCH MODE HANDLERS
// =====================
sketchCanvas.addEventListener('mousedown', e=>{
  if(currentMode!=='sketch') return;
  sketchPainting = true;
  sketchCtx.globalAlpha = brushOpacity;
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
