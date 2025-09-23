// ==========================
// editor.js — Full Pixel & Sketch Editor
// ==========================

// ------------------------
// Canvas Setup
// ------------------------
const pixelCanvas = document.getElementById('pixelCanvas');
const sketchCanvas = document.getElementById('sketchCanvas');
const pixelCtx = pixelCanvas.getContext('2d');
const sketchCtx = sketchCanvas.getContext('2d');

const state = {
    width: 32,
    height: 32,
    cellSize: 20,
    mode: 'pixel', // 'pixel' or 'sketch'
    currentTool: 'pencil',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    symmetry: 'none',
    grid: true,
    isDrawing: false,
    startX: 0,
    startY: 0,
    selection: null,
    selectionData: null,
    undoStack: [],
    redoStack: [],
    layers: [],
    activeLayer: 0
};

// ------------------------
// Layer Management
// ------------------------
function createLayer(name) {
    const canvas = document.createElement('canvas');
    canvas.width = state.width * state.cellSize;
    canvas.height = state.height * state.cellSize;
    canvas.style.position = 'absolute';
    canvas.style.top = pixelCanvas.offsetTop + 'px';
    canvas.style.left = pixelCanvas.offsetLeft + 'px';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    state.layers.push({ name, canvas, ctx, visible: true });
    updateLayerVisibility();
    return state.layers.length - 1;
}

function getActiveLayer() { return state.layers[state.activeLayer]; }

function updateLayerVisibility() {
    state.layers.forEach((layer, i) => layer.canvas.style.display = layer.visible && i === state.activeLayer ? 'block' : 'none');
}

// ------------------------
// Palette Setup
// ------------------------
const colors = ['#000000','#FF0000','#00FF00','#0000FF','#FFFF00','#FF00FF','#00FFFF','#FFFFFF'];
const paletteEl = document.getElementById('palette');
colors.forEach(color => {
    const c = document.createElement('div');
    c.className = 'color';
    c.style.background = color;
    c.addEventListener('click', () => state.primaryColor = color);
    paletteEl.appendChild(c);
});

// ------------------------
// Canvas Initialization
// ------------------------
function initCanvas() {
    pixelCanvas.width = state.width * state.cellSize;
    pixelCanvas.height = state.height * state.cellSize;
    sketchCanvas.width = pixelCanvas.width;
    sketchCanvas.height = pixelCanvas.height;
    createLayer('Layer 1'); // initial layer
    drawGrid();
    sketchCanvas.style.display = 'none';
}

// ------------------------
// Grid
// ------------------------
function drawGrid() {
    const ctx = pixelCtx;
    ctx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
    if (!state.grid) return;
    ctx.strokeStyle = '#ccc';
    for (let x = 0; x <= state.width; x++) {
        ctx.beginPath();
        ctx.moveTo(x * state.cellSize, 0);
        ctx.lineTo(x * state.cellSize, state.height * state.cellSize);
        ctx.stroke();
    }
    for (let y = 0; y <= state.height; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * state.cellSize);
        ctx.lineTo(state.width * state.cellSize, y * state.cellSize);
        ctx.stroke();
    }
}

// ------------------------
// Undo / Redo
// ------------------------
function saveUndo() {
    const ctx = getCtx();
    state.undoStack.push(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
    state.redoStack = [];
}

function undo() {
    const ctx = getCtx();
    if (!state.undoStack.length) return;
    const data = state.undoStack.pop();
    state.redoStack.push(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
    ctx.putImageData(data, 0, 0);
}

function redo() {
    const ctx = getCtx();
    if (!state.redoStack.length) return;
    const data = state.redoStack.pop();
    state.undoStack.push(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
    ctx.putImageData(data, 0, 0);
}

// ------------------------
// Helpers
// ------------------------
function getCanvas() { return state.mode === 'pixel' ? pixelCanvas : sketchCanvas; }
function getCtx() { return getActiveLayer().ctx; }

function getCell(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / state.cellSize);
    const y = Math.floor((e.clientY - rect.top) / state.cellSize);
    return { x, y };
}

// ------------------------
// Pixel Drawing
// ------------------------
function drawPixel(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * state.cellSize, y * state.cellSize, state.cellSize, state.cellSize);
    applySymmetry(ctx, x, y, color);
}

function applySymmetry(ctx, x, y, color) {
    const w = state.width;
    const h = state.height;
    if (state.symmetry === 'horizontal' || state.symmetry === 'both') drawPixelSingle(ctx, w - 1 - x, y, color);
    if (state.symmetry === 'vertical' || state.symmetry === 'both') drawPixelSingle(ctx, x, h - 1 - y, color);
    if (state.symmetry === 'both') drawPixelSingle(ctx, w - 1 - x, h - 1 - y, color);
}

function drawPixelSingle(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * state.cellSize, y * state.cellSize, state.cellSize, state.cellSize);
}

// ------------------------
// Tools
// ------------------------
function startDraw(e) {
    state.isDrawing = true;
    const canvas = getCanvas();
    const ctx = getCtx();
    const { x, y } = getCell(e, canvas);
    state.startX = x;
    state.startY = y;
    saveUndo();

    if (['fill', 'select'].includes(state.currentTool)) {
        if (state.currentTool === 'fill') floodFill(ctx, x, y, state.primaryColor);
    }
}

function draw(e) {
    if (!state.isDrawing) return;
    const canvas = getCanvas();
    const ctx = getCtx();
    const { x, y } = getCell(e, canvas);

    switch (state.currentTool) {
        case 'pencil': case 'eraser':
            drawToolPixel(ctx, x, y);
            break;
        case 'line': case 'rectangle': case 'circle':
            renderTempShape(ctx, x, y);
            break;
        case 'select':
            drawSelection(ctx, x, y);
            break;
    }
}

function endDraw(e) {
    if (!state.isDrawing) return;
    const canvas = getCanvas();
    const ctx = getCtx();
    const { x, y } = getCell(e, canvas);

    if (state.currentTool === 'line') drawLine(ctx, state.startX, state.startY, x, y, state.primaryColor);
    if (state.currentTool === 'rectangle') drawRect(ctx, state.startX, state.startY, x, y, state.primaryColor);
    if (state.currentTool === 'circle') drawCircle(ctx, state.startX, state.startY, x, y, state.primaryColor);

    state.isDrawing = false;
    clearTempCanvas();
}

// Pencil/Eraser
function drawToolPixel(ctx, x, y) {
    const color = state.currentTool === 'pencil' ? state.primaryColor : '#ffffff';
    drawPixel(ctx, x, y, color);
}

// ------------------------
// Flood Fill
// ------------------------
function floodFill(ctx, x, y, fillColor) {
    const imgData = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
    const width = imgData.width, height = imgData.height;
    const data = imgData.data;
    const index = (y * width + x) * 4;
    const targetColor = [data[index], data[index+1], data[index+2], data[index+3]];
    const fillRGB = hexToRgb(fillColor);
    if(colorsMatch(targetColor, fillRGB)) return;

    const stack = [{x,y}];
    while(stack.length){
        const {x,y} = stack.pop();
        const i = (y*width + x)*4;
        if(x>=0 && y>=0 && x<width && y<height && colorsMatch([data[i],data[i+1],data[i+2],data[i+3]], targetColor)){
            data[i]=fillRGB[0]; data[i+1]=fillRGB[1]; data[i+2]=fillRGB[2]; data[i+3]=255;
            stack.push({x:x+1,y}); stack.push({x:x-1,y}); stack.push({x,y:y+1}); stack.push({x,y:y-1});
        }
    }
    ctx.putImageData(imgData,0,0);
}

function hexToRgb(hex){
    const bigint = parseInt(hex.slice(1),16);
    return [(bigint>>16)&255, (bigint>>8)&255, bigint&255];
}
function colorsMatch(a,b){ return a[0]===b[0] && a[1]===b[1] && a[2]===b[2]; }

// ------------------------
// Shapes: Line, Rect, Circle
// ------------------------
function drawLine(ctx, x0, y0, x1, y1, color) {
    const dx = Math.abs(x1-x0), sx = x0<x1?1:-1;
    const dy = Math.abs(y1-y0), sy = y0<y1?1:-1;
    let err = dx-dy;
    while(true){
        drawPixel(ctx, x0, y0, color);
        if(x0===x1 && y0===y1) break;
        let e2 = 2*err;
        if(e2 > -dy){ err -= dy; x0 += sx; }
        if(e2 < dx){ err += dx; y0 += sy; }
    }
}

function drawRect(ctx, x0, y0, x1, y1, color) {
    const [sx, ex] = [Math.min(x0, x1), Math.max(x0, x1)];
    const [sy, ey] = [Math.min(y0, y1), Math.max(y0, y1)];
    for(let x=sx;x<=ex;x++){ drawPixel(ctx,x,sy,color); drawPixel(ctx,x,ey,color);}
    for(let y=sy;y<=ey;y++){ drawPixel(ctx,sx,y,color); drawPixel(ctx,ex,y,color);}
}

function drawCircle(ctx, x0, y0, x1, y1, color) {
    const radius = Math.round(Math.hypot(x1-x0, y1-y0));
    let f=1-radius, dx=0, dy=-2*radius, x=0, y=radius;
    drawPixel(ctx,x0,y0+radius,color); drawPixel(ctx,x0,y0-radius,color);
    drawPixel(ctx,x0+radius,y0,color); drawPixel(ctx,x0-radius,y0,color);
    while(x<y){
        if(f>=0){ y--; dy+=2; f+=dy;}
        x++; dx+=2; f+=dx+1;
        [[x,y],[-x,y],[x,-y],[-x,-y],[y,x],[-y,x],[y,-x],[-y,-x]].forEach(([dx,dy])=>drawPixel(ctx,x0+dx,y0+dy,color));
    }
}

// ------------------------
// Temp Canvas for Shape Preview
// ------------------------
let tempCanvas = document.createElement('canvas');
tempCanvas.width = pixelCanvas.width;
tempCanvas.height = pixelCanvas.height;
let tempCtx = tempCanvas.getContext('2d');
document.body.appendChild(tempCanvas);
tempCanvas.style.position='absolute';
tempCanvas.style.pointerEvents='none';
tempCanvas.style.top=pixelCanvas.offsetTop+'px';
tempCanvas.style.left=pixelCanvas.offsetLeft+'px';
tempCanvas.style.display='none';

function renderTempShape(ctx, x, y) {
    tempCtx.clearRect(0,0,tempCanvas.width,tempCanvas.height);
    tempCanvas.style.display='block';
    if(state.currentTool==='line') drawLine(tempCtx,state.startX,state.startY,x,y,state.primaryColor);
    if(state.currentTool==='rectangle') drawRect(tempCtx,state.startX,state.startY,x,y,state.primaryColor);
    if(state.currentTool==='circle') drawCircle(tempCtx,state.startX,state.startY,x,y,state.primaryColor);
}

function clearTempCanvas(){ tempCtx.clearRect(0,0,tempCanvas.width,tempCanvas.height); tempCanvas.style.display='none'; }

// ------------------------
// Selection / Move Tool
// ------------------------
function drawSelection(ctx, x, y) {
    if(!state.selection){
        state.selection = { startX: state.startX, startY: state.startY, endX: x, endY: y };
        tempCtx.clearRect(0,0,tempCanvas.width,tempCanvas.height);
        tempCtx.strokeStyle='red';
        tempCtx.strokeRect(state.selection.startX*state.cellSize,state.selection.startY*state.cellSize,(x-state.selection.startX)*state.cellSize,(y-state.selection.startY)*state.cellSize);
    }
}

// ------------------------
// Mouse / Touch Events
// ------------------------
[pixelCanvas, sketchCanvas].forEach(canvas=>{
    canvas.addEventListener('mousedown',startDraw);
    canvas.addEventListener('mousemove',draw);
    canvas.addEventListener('mouseup',endDraw);
    canvas.addEventListener('mouseleave',endDraw);
    canvas.addEventListener('touchstart',e=>{e.preventDefault(); startDraw(e.touches[0]);});
    canvas.addEventListener('touchmove',e=>{e.preventDefault(); draw(e.touches[0]);});
    canvas.addEventListener('touchend',e=>{e.preventDefault(); endDraw(e.changedTouches[0]);});
});

// ------------------------
// Tool Buttons
// ------------------------
document.querySelectorAll('[data-tool]').forEach(btn=>{
    btn.addEventListener('click',()=>state.currentTool=btn.dataset.tool);
});

// Undo/Redo
document.getElementById('undoBtn').addEventListener('click',undo);
document.getElementById('redoBtn').addEventListener('click',redo);

// Grid Toggle
document.getElementById('gridBtn').addEventListener('click',()=>{
    state.grid = !state.grid;
    drawGrid();
});

// Symmetry
document.getElementById('symmetrySelect').addEventListener('change',e=>state.symmetry=e.target.value);

// Mode Switch
document.getElementById('modeSelect').addEventListener('change',e=>{
    state.mode = e.target.value;
    pixelCanvas.style.display = state.mode==='pixel'?'block':'none';
    sketchCanvas.style.display = state.mode==='sketch'?'block':'none';
});

// Initialize Editor
initCanvas();
