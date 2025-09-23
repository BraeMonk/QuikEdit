// =====================
// JERRY EDITOR.JS COMPLETE
// =====================

// ---------------------
// GLOBALS & STATE
// ---------------------
let currentMode = 'pixel'; // 'pixel' or 'sketch'
let currentTool = 'pencil';
let symmetryMode = 'none';
let isPainting = false;
let startX = 0, startY = 0;
let zoomLevel = 1;

// Pixel canvas
const canvas = document.getElementById('canvas');
const canvasGrid = document.getElementById('canvasGrid');
let canvasWidth = 16;
let canvasHeight = 16;
let pixelData = [];
let undoStack = [];
let redoStack = [];

// Sketch canvas
const sketchCanvas = document.getElementById('sketchCanvas');
const sketchCtx = sketchCanvas.getContext('2d');
let sketchLayers = [];
let activeLayer = 0;

// Colors
let primaryColor = '#000000';
let secondaryColor = '#ffffff';
let palette = ['#000000','#ffffff','#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff','#00ffff'];

// Brush settings (Sketch)
let brushSize = 10;
let brushOpacity = 1;
let brushFlow = 1;
let brushHardness = 1;
let brushColor = '#000000';

// Selection (pixel)
let selection = null;

// Sprites
let spriteList = [];
let activeSprite = null;

// ---------------------
// INIT
// ---------------------
function init() {
    initPixelCanvas();
    initSketchCanvas();
    initUI();
    drawCanvas();
    drawSketch();
}

// ---------------------
// PIXEL CANVAS
// ---------------------
function initPixelCanvas() {
    canvasWidth = parseInt(document.getElementById('canvasWidth').value) || 16;
    canvasHeight = parseInt(document.getElementById('canvasHeight').value) || 16;
    pixelData = Array.from({ length: canvasHeight }, () => Array(canvasWidth).fill('#ffffff'));
    canvas.innerHTML = '';
    canvas.style.gridTemplateColumns = `repeat(${canvasWidth}, 1fr)`;
    canvas.style.gridTemplateRows = `repeat(${canvasHeight}, 1fr)`;

    for(let y=0; y<canvasHeight; y++){
        for(let x=0; x<canvasWidth; x++){
            const cell = document.createElement('div');
            cell.classList.add('pixel-cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.style.background = pixelData[y][x];
            cell.addEventListener('mousedown', pixelStart);
            cell.addEventListener('mouseenter', pixelDraw);
            cell.addEventListener('mouseup', pixelEnd);
            canvas.appendChild(cell);
        }
    }
}

function drawCanvas(){
    for(let y=0; y<canvasHeight; y++){
        for(let x=0; x<canvasWidth; x++){
            const cell = canvas.querySelector(`.pixel-cell[data-x='${x}'][data-y='${y}']`);
            if(cell) cell.style.background = pixelData[y][x];
        }
    }
}

// ---------------------
// PIXEL TOOLS
// ---------------------
function pixelStart(e){
    if(currentMode !== 'pixel') return;
    isPainting = true;
    const x = parseInt(e.target.dataset.x);
    const y = parseInt(e.target.dataset.y);
    startX = x;
    startY = y;
    saveUndo();
    handlePixelTool(x,y);
}

function pixelDraw(e){
    if(!isPainting || currentMode !== 'pixel') return;
    const x = parseInt(e.target.dataset.x);
    const y = parseInt(e.target.dataset.y);
    handlePixelTool(x,y);
}

function pixelEnd(e){
    if(!isPainting || currentMode !== 'pixel') return;
    isPainting = false;
    drawCanvas();
}

function handlePixelTool(x,y){
    let color = currentTool === 'eraser' ? '#ffffff' : primaryColor;
    switch(currentTool){
        case 'pencil': setPixelSymmetric(x,y,color); break;
        case 'eraser': setPixelSymmetric(x,y,'#ffffff'); break;
        case 'eyedropper':
            primaryColor = pixelData[y][x];
            document.getElementById('primaryColor').style.background = primaryColor;
            break;
        case 'fill': floodFillSymmetric(x,y,color); break;
        case 'line': drawLineSymmetric(startX,startY,x,y,color); break;
        case 'rect': drawRectSymmetric(startX,startY,x,y,color); break;
        case 'circle': drawCircleSymmetric(startX,startY,x,y,color); break;
        case 'select': selection = getSelection(startX,startY,x,y); break;
        case 'move': if(selection) moveSelection(x-startX,y-startY); break;
    }
}

function setPixel(x,y,color){
    if(x<0||y<0||x>=canvasWidth||y>=canvasHeight) return;
    pixelData[y][x] = color;
    const cell = canvas.querySelector(`.pixel-cell[data-x='${x}'][data-y='${y}']`);
    if(cell) cell.style.background = color;
}

// ---------------------
// SYMMETRY
// ---------------------
function setPixelSymmetric(x, y, color){
    const positions = [[x, y]];
    if(symmetryMode==='horizontal'||symmetryMode==='both') positions.push([canvasWidth-1-x,y]);
    if(symmetryMode==='vertical'||symmetryMode==='both') positions.push([x,canvasHeight-1-y]);
    if(symmetryMode==='both') positions.push([canvasWidth-1-x,canvasHeight-1-y]);
    positions.forEach(([px,py])=>{
        if(px>=0&&py>=0&&px<canvasWidth&&py<canvasHeight){
            pixelData[py][px]=color;
            const cell = canvas.querySelector(`.pixel-cell[data-x='${px}'][data-y='${py}']`);
            if(cell) cell.style.background=color;
        }
    });
}

function floodFill(x,y,color){
    const target=pixelData[y][x];
    if(target===color) return;
    const stack=[[x,y]];
    while(stack.length){
        const [cx,cy]=stack.pop();
        if(cx<0||cy<0||cx>=canvasWidth||cy>=canvasHeight) continue;
        if(pixelData[cy][cx]!==target) continue;
        setPixel(cx,cy,color);
        stack.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]);
    }
}
function floodFillSymmetric(x,y,color){
    const target=pixelData[y][x];
    if(target===color) return;
    const stack=[[x,y]];
    while(stack.length){
        const [cx,cy]=stack.pop();
        if(cx<0||cy<0||cx>=canvasWidth||cy>=canvasHeight) continue;
        if(pixelData[cy][cx]!==target) continue;
        setPixelSymmetric(cx,cy,color);
        stack.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]);
    }
}

// ---------------------
// SHAPES
// ---------------------
function drawLineSymmetric(x0,y0,x1,y1,color){ drawLine(x0,y0,x1,y1,color); }
function drawRectSymmetric(x0,y0,x1,y1,color){ drawRect(x0,y0,x1,y1,color); }
function drawCircleSymmetric(x0,y0,x1,y1,color){ drawCircle(x0,y0,x1,y1,color); }

function drawLine(x0,y0,x1,y1,color){
    let dx=Math.abs(x1-x0), dy=Math.abs(y1-y0);
    let sx=x0<x1?1:-1, sy=y0<y1?1:-1, err=dx-dy;
    while(true){
        setPixelSymmetric(x0,y0,color);
        if(x0===x1 && y0===y1) break;
        let e2=2*err;
        if(e2>-dy){err-=dy;x0+=sx;}
        if(e2<dx){err+=dx;y0+=sy;}
    }
}

function drawRect(x0,y0,x1,y1,color){
    const minX=Math.min(x0,x1), maxX=Math.max(x0,x1);
    const minY=Math.min(y0,y1), maxY=Math.max(y0,y1);
    for(let x=minX;x<=maxX;x++){setPixelSymmetric(x,minY,color); setPixelSymmetric(x,maxY,color);}
    for(let y=minY;y<=maxY;y++){setPixelSymmetric(minX,y,color); setPixelSymmetric(maxX,y,color);}
}

function drawCircle(x0,y0,x1,y1,color){
    const r=Math.floor(Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2)));
    let x=r, y=0, err=0;
    while(x>=y){
        const pts=[[x0+x,y0+y],[x0+y,y0+x],[x0-y,y0+x],[x0-x,y0+y],[x0-x,y0-y],[x0-y,y0-x],[x0+y,y0-x],[x0+x,y0-y]];
        pts.forEach(([px,py])=>setPixelSymmetric(px,py,color));
        y++; if(err<=0) err+=2*y+1;
        if(err>0) {x--; err-=2*x+1;}
    }
}

// ---------------------
// SELECTION / MOVE
// ---------------------
function getSelection(x0,y0,x1,y1){
    const minX=Math.min(x0,x1), maxX=Math.max(x0,x1);
    const minY=Math.min(y0,y1), maxY=Math.max(y0,y1);
    const data=[];
    for(let y=minY;y<=maxY;y++){
        const row=[];
        for(let x=minX;x<=maxX;x++){ row.push(pixelData[y][x]); }
        data.push(row);
    }
    return {x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1,data};
}

function moveSelection(dx, dy){
    if(!selection) return;
    saveUndo();
    for(let y=0;y<selection.h;y++){
        for(let x=0;x<selection.w;x++){
            const px=selection.x+x, py=selection.y+y;
            if(px>=0 && py>=0 && px<canvasWidth && py<canvasHeight) setPixel(px,py,'#ffffff');
        }
    }
    selection.x+=dx; selection.y+=dy;
    for(let y=0;y<selection.h;y++){
        for(let x=0;x<selection.w;x++){
            const px=selection.x+x, py=selection.y+y;
            if(px>=0 && py>=0 && px<canvasWidth && py<canvasHeight) setPixel(px,py,selection.data[y][x]);
        }
    }
}

// ---------------------
// SKETCH CANVAS
// ---------------------
function initSketchCanvas(){
    sketchCanvas.width=800; sketchCanvas.height=600;
    sketchCtx.fillStyle='#ffffff';
    sketchCtx.fillRect(0,0,sketchCanvas.width,sketchCanvas.height);
    sketchLayers=[{canvas:sketchCanvas,ctx:sketchCtx,opacity:1,blend:'source-over'}];
    activeLayer=0;
}

function drawSketch(){
    sketchCtx.clearRect(0,0,sketchCanvas.width,sketchCanvas.height);
    sketchLayers.forEach(layer=>{
        sketchCtx.globalAlpha=layer.opacity;
        sketchCtx.globalCompositeOperation=layer.blend;
        sketchCtx.drawImage(layer.canvas,0,0);
    });
    sketchCtx.globalAlpha=1;
    sketchCtx.globalCompositeOperation='source-over';
}

function applyBrush(x,y){
    if(!sketchLayers[activeLayer]) return;
    const ctx = sketchLayers[activeLayer].ctx;
    ctx.fillStyle = brushColor;
    ctx.globalAlpha = brushOpacity*brushFlow;
    ctx.beginPath();
    ctx.arc(x,y,brushSize/2,0,Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
    drawSketch();
}

// ---------------------
// UNDO / REDO
// ---------------------
function saveUndo(){
    if(currentMode==='pixel') undoStack.push(JSON.parse(JSON.stringify(pixelData)));
    else undoStack.push(sketchCanvas.toDataURL());
    redoStack=[];
}
function undo(){
    if(!undoStack.length) return;
    redoStack.push(currentMode==='pixel'?JSON.parse(JSON.stringify(pixelData)):sketchCanvas.toDataURL());
    if(currentMode==='pixel'){ pixelData = undoStack.pop(); drawCanvas(); }
    else{
        const img=new Image(); img.src=undoStack.pop();
        img.onload=()=>{sketchCtx.clearRect(0,0,sketchCanvas.width,sketchCanvas.height); sketchCtx.drawImage(img,0,0);}
    }
}
function redo(){
    if(!redoStack.length) return;
    undoStack.push(currentMode==='pixel'?JSON.parse(JSON.stringify(pixelData)):sketchCanvas.toDataURL());
    if(currentMode==='pixel'){ pixelData = redoStack.pop(); drawCanvas(); }
    else{
        const img=new Image(); img.src=redoStack.pop();
        img.onload=()=>{sketchCtx.clearRect(0,0,sketchCanvas.width,sketchCanvas.height); sketchCtx.drawImage(img,0,0);}
    }
}

// ---------------------
// ZOOM
// ---------------------
function setZoom(z){
    zoomLevel=z;
    canvas.style.transform=`scale(${zoomLevel})`;
    sketchCanvas.style.transform=`scale(${zoomLevel})`;
    document.getElementById('zoomIndicator').innerText=Math.round(zoomLevel*100)+'%';
}

// ---------------------
// UI / MODE SWITCH
// ---------------------
function initUI(){
    document.querySelectorAll('.mode-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{
            currentMode=btn.dataset.mode;
            updateModeUI();
        });
    });
    document.querySelectorAll('.tool-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{
            document.querySelectorAll('.tool-btn').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
            currentTool = btn.dataset.tool;
        });
    });
    document.querySelectorAll('.symmetry-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{
            document.querySelectorAll('.symmetry-btn').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
            symmetryMode = btn.dataset.symmetry;
        });
    });
    document.getElementById('zoomIn').addEventListener('click',()=>setZoom(zoomLevel*1.25));
    document.getElementById('zoomOut').addEventListener('click',()=>setZoom(zoomLevel/1.25));
    document.getElementById('zoomReset').addEventListener('click',()=>setZoom(1));
    document.getElementById('undo').addEventListener('click',undo);
    document.getElementById('redo').addEventListener('click',redo);
    document.getElementById('primaryColor').addEventListener('click',()=>pickColor('primary'));
    document.getElementById('secondaryColor').addEventListener('click',()=>pickColor('secondary'));
    document.getElementById('resizeCanvas').addEventListener('click',()=>{
        canvasWidth=parseInt(document.getElementById('canvasWidth').value);
        canvasHeight=parseInt(document.getElementById('canvasHeight').value);
        initPixelCanvas();
    });
}

function updateModeUI(){
    document.querySelectorAll('.mode-btn').forEach(btn=>btn.classList.remove('active'));
    document.querySelector(`.mode-btn[data-mode='${currentMode}']`).classList.add('active');
    document.querySelector('.pixel-tools').style.display = currentMode==='pixel'?'block':'none';
    document.querySelector('.sketch-tools').style.display = currentMode==='sketch'?'block':'none';
}

// ---------------------
// COLOR PICKER
// ---------------------
function pickColor(type){
    const input=document.createElement('input');
    input.type='color'; input.click();
    input.addEventListener('input',()=>{
        if(type==='primary'){ primaryColor=input.value; document.getElementById('primaryColor').style.background=primaryColor; }
        else{ secondaryColor=input.value; document.getElementById('secondaryColor').style.background=secondaryColor; brushColor=secondaryColor;}
    });
}

// ---------------------
// EXPORT
// ---------------------
document.getElementById('exportJSON').addEventListener('click',()=>{
    const data={pixelData,palette};
    document.getElementById('output').value=JSON.stringify(data,null,2);
});
document.getElementById('exportPNG2').addEventListener('click',()=>{
    const exportCanvas=document.createElement('canvas');
    exportCanvas.width=currentMode==='pixel'?canvasWidth:sketchCanvas.width;
    exportCanvas.height=currentMode==='pixel'?canvasHeight:sketchCanvas.height;
    const ctx=exportCanvas.getContext('2d');
    if(currentMode==='pixel'){
        for(let y=0;y<canvasHeight;y++){
            for(let x=0;x<canvasWidth;x++){
                ctx.fillStyle=pixelData[y][x]; ctx.fillRect(x,y,1,1);
            }
        }
    } else ctx.drawImage(sketchCanvas,0,0);
    const link=document.createElement('a');
    link.download='export.png';
    link.href=exportCanvas.toDataURL();
    link.click();
});

// ---------------------
// SERVICE WORKER
// ---------------------
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
    .then(()=>console.log('Service Worker registered'))
    .catch(err=>console.error(err));
}

// ---------------------
// INIT
// ---------------------
init();
