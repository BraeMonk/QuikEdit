// =====================
// editor.js - Jerry Editor (Complete Fixed Version)
// =====================
let isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;

const palettes = {
  default: isLightMode
    ? ['transparent','#FFFFFF','#C0C0C0','#808080','#404040','#000000','#FF0000','#00FF00','#0000FF','#FFFF00','#FF00FF']
    : ['transparent','#F8F8F8','#D0D0D0','#808080','#404040','#000000','#FF4444','#44FF44','#4444FF','#FFFF44','#FF44FF'],
  retro8bit: isLightMode
    ? ['transparent','#F4F4F4','#E8E8E8','#BCBCBC','#7C7C7C','#A00000','#FF6A00','#FFD500','#00A844','#0047AB','#000000']
    : ['transparent','#FFFFFF','#E0E0E0','#A8A8A8','#606060','#C00000','#FF8533','#FFE033','#33B855','#3366CC','#000000'],
  gameboyClassic: isLightMode
    ? ['transparent','#E0F8D0','#88C070','#346856','#081820','#9BBB0F','#8BAC0F','#306230','#0F380F','#155015','#071821']
    : ['transparent','#9BBB0F','#8BAC0F','#306230','#0F380F','#C4D82F','#A2B84F','#4F7F4F','#2F4F2F','#1F3F1F','#0F1F0F'],
  synthwave: isLightMode
    ? ['transparent','#FF00FF','#FF0080','#FF4080','#FF8000','#FFFF00','#80FF00','#00FFFF','#0080FF','#8000FF','#2D1B69']
    : ['transparent','#FF44FF','#FF4499','#FF6699','#FF9944','#FFFF44','#99FF44','#44FFFF','#4499FF','#9944FF','#1A1A2E'],
  earthTones: isLightMode
    ? ['transparent','#FFF8DC','#D2B48C','#CD853F','#A0522D','#8B4513','#654321','#556B2F','#8FBC8F','#2F4F4F','#191970']
    : ['transparent','#F5E6D3','#C8A882','#B8860B','#8B4513','#654321','#3E2723','#4A5D23','#6B8E5A','#2E3B2E','#1C1C3A'],
  crystalIce: isLightMode
    ? ['transparent','#F0F8FF','#E6F3FF','#B3D9FF','#80BFFF','#4DA6FF','#1A8CFF','#0066CC','#004C99','#003366','#001A33']
    : ['transparent','#E6F7FF','#CCF0FF','#99E0FF','#66D0FF','#33C0FF','#00B0FF','#0099CC','#007399','#004D66','#002633'],
  moltenCore: isLightMode
    ? ['transparent','#FFFACD','#FFE4B5','#FFA500','#FF6347','#FF4500','#DC143C','#B22222','#8B0000','#4B0000','#000000']
    : ['transparent','#FFF5E1','#FFCC80','#FF8F00','#FF5722','#D84315','#BF360C','#8D2635','#5D1A1D','#3E1317','#1A0A0B'],
  enchantedForest: isLightMode
    ? ['transparent','#F0FFF0','#E6FFE6','#CCFFCC','#99FF99','#66CC66','#339933','#228B22','#006400','#004400','#002200']
    : ['transparent','#E8F5E8','#C8E6C8','#A8D8A8','#88C488','#68B068','#489848','#387438','#285028','#183018','#081808'],
  nesClassic: isLightMode
    ? ['transparent','#FFFFFF','#FCFCFC','#F8F8F8','#BCBCBC','#7C7C7C','#A4E4FC','#3CBCFC','#0078F8','#0000FC','#000000']
    : ['transparent','#FCFCFC','#F8F8F8','#E4E4E4','#A8A8A8','#585858','#94D4E4','#28A8D8','#0060C4','#0000A8','#000000'],
  cyberpunk: isLightMode
    ? ['transparent','#00FFFF','#00E6E6','#00CCCC','#00B3B3','#FF00FF','#E600E6','#CC00CC','#B300B3','#4D0080','#0D001A']
    : ['transparent','#66FFFF','#33F0F0','#00E0E0','#00C8C8','#FF66FF','#E633E6','#CC00CC','#A800A8','#6600AA','#1A0033'],
  desertSands: isLightMode
    ? ['transparent','#FFF8DC','#F5DEB3','#DEB887','#D2B48C','#BC9A6A','#A0522D','#8B4513','#654321','#3E2723','#2E1A14']
    : ['transparent','#F0E68C','#E6D875','#DCC95E','#B8A248','#8B7A32','#6B5B28','#4A3C1D','#3A2F17','#2A2212','#1A150C'],
  deepOcean: isLightMode
    ? ['transparent','#E0F6FF','#B3E5FC','#4FC3F7','#29B6F6','#03A9F4','#0288D1','#0277BD','#01579B','#01447A','#002F5A']
    : ['transparent','#B3E5FC','#81D4FA','#4FC3F7','#29B6F6','#0288D1','#0277BD','#01579B','#003C71','#002952','#001635'],
  cosmicVoid: isLightMode
    ? ['transparent','#E1BEE7','#CE93D8','#BA68C8','#AB47BC','#8E24AA','#7B1FA2','#6A1B9A','#4A148C','#38006B','#1A0033']
    : ['transparent','#E1BEE7','#CE93D8','#BA68C8','#9C27B0','#8E24AA','#7B1FA2','#6A1B9A','#4A148C','#38006B','#1A0033'],
  inkWash: isLightMode
    ? ['transparent','#FFFFFF','#F5F5F5','#E0E0E0','#BDBDBD','#9E9E9E','#757575','#424242','#212121','#FF5722','#000000']
    : ['transparent','#F5F5F5','#E8E8E8','#D0D0D0','#A8A8A8','#808080','#585858','#383838','#181818','#FF6B3D','#000000'],
  autumnLeaves: isLightMode
    ? ['transparent','#FFF8E7','#FFE0B3','#FFCC80','#FF8F65','#FF7043','#F4511E','#E65100','#BF360C','#8D2F00','#5D1F00']
    : ['transparent','#FFE8CC','#FFCC80','#FFB74D','#FF8A65','#FF7043','#F4511E','#E65100','#CC4400','#B33300','#802200'],
  sakuraBloom: isLightMode
    ? ['transparent','#FFF0F5','#FFE4E1','#FFC0CB','#FFB6C1','#FF91A4','#FF69B4','#E91E63','#C2185B','#AD1457','#880E4F']
    : ['transparent','#FFEBEE','#FFCDD2','#F8BBD9','#F48FB1','#F06292','#EC407A','#E91E63','#C2185B','#AD1457','#880E4F']
};

// =====================
// GLOBAL STATE
// =====================
let currentMode = 'pixel';
let currentTool = 'pencil';
let symmetryMode = 'none';
let isPainting = false;
let drawingShape = false;
let shapeStart = {x: 0, y: 0};
let startX = 0, startY = 0;
let canvasWidth = 16, canvasHeight = 16;
let pixelData = [];
let cellSize = 20;
let lastMousePos = null;
let currentPaletteName = 'default';
let currentPalette = palettes[currentPaletteName];
let selectedColorIndex = 1;
let userPalettes = [];
let showGrid = true;

try {
    userPalettes = JSON.parse(localStorage.getItem('userPalettes') || '[]');
} catch(e) {
    console.warn('Could not load user palettes');
}

// Add a new user palette
function addUserPalette(name, colors) {
    if (!name || !colors || !colors.length) return;
    const palette = { name, colors };
    userPalettes.push(palette);
    localStorage.setItem('userPalettes', JSON.stringify(userPalettes));

    // automatically set this palette as active
    setPalette(name, true);
}

// Set active palette by name (built-in or user)
function setPaletteByName(name) {
    let palette;
    let isUserPalette = false;
    
    // 1. Pixel & sketch built-ins
    if (currentMode === 'pixel' && palettes[name]) {
        palette = palettes[name];
    } else if (currentMode === 'sketch' && sketchBuiltInPalette[name]) {
        palette = sketchBuiltInPalette[name];
    }
    // 2. User-saved palettes
    else {
        const userPalette = userPalettes.find(p => p.name === name);
        if (userPalette) {
            palette = userPalette.colors;
            isUserPalette = true;
        }
        // 3. Custom palettes
        else if (name === 'custom') {
            palette = currentMode === 'pixel' ? customPalette : sketchCustomPalette;
        } else {
            console.warn(`Palette not found: ${name}`);
            return;
        }
    }

    // Apply palette depending on mode
    if (currentMode === 'pixel') {
        activePalette = palette;
        currentPalette = palette; // keep in sync
        currentPaletteName = name;
        currentColorIndex = Math.min(currentColorIndex, palette.length - 1);
        primaryColor = activePalette[currentColorIndex];
        currentColor = primaryColor;
    } else {
        sketchActivePalette = palette;
        sketchPaletteName = name;
        sketchColorIndex = Math.min(sketchColorIndex, palette.length - 1);
        brushColor = sketchActivePalette[sketchColorIndex];
    }

    renderPalette();
    
    // Show/hide color pickers for custom/user
    if (colorPickersContainer) {
        colorPickersContainer.style.display = (name === 'custom' || isUserPalette) ? 'flex' : 'none';
    }
}


// Add a single color to current palette (user only)
function addCustomColor(color) {
    if (!color) return;
    activePalette.push(color);
    currentColorIndex = activePalette.length - 1;
    primaryColor = color;
    renderPalette();
}

// Reset to default built-in palette
function resetPalette() {
    activePalette = palettes.default;
    currentColorIndex = 1;
    primaryColor = activePalette[currentColorIndex];
    renderPalette();
}

function selectColor(index) {
  if (index >= 0 && index < currentPalette.length) {
    selectedColorIndex = index;
    currentColor = currentPalette[index];
  }
}

// ACTIVE PALETTE FIX
let activePalette = palettes.default;
let currentColorIndex = 1; // skip transparent
let customPalette = ['#000000','#111111','#222222','#333333','#444444','#555555','#666666','#777777'];

// Ensure currentColor is synced
let primaryColor = activePalette[currentColorIndex];
let secondaryColor = '#FFFFFF';
let currentColor = primaryColor;

// Sketch palettes
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
// CANVAS ELEMENTS
// =====================
const pixelCanvas = document.getElementById('canvas');
const canvasGrid = document.getElementById('canvasGrid');
const paletteContainer = document.getElementById('swatches');
const colorPickersContainer = document.getElementById('colorPickers');

let previewCanvas = null;
let previewCtx = null;

const canvasWrapper = document.querySelector('.canvas-wrapper');
if (canvasWrapper) {
    previewCanvas = document.createElement('canvas');
    previewCanvas.width = canvasWidth * cellSize;
    previewCanvas.height = canvasHeight * cellSize;
    previewCanvas.style.position = 'absolute';
    previewCanvas.style.top = '0';
    previewCanvas.style.left = '0';
    previewCanvas.style.pointerEvents = 'none';
    previewCanvas.style.zIndex = '10';
    canvasWrapper.appendChild(previewCanvas);
    previewCtx = previewCanvas.getContext('2d');
} else {
    console.warn("Canvas wrapper not found - preview functionality disabled");
}

// Sketch canvas
const sketchCanvas = document.getElementById('sketchCanvas');
const sketchCtx = sketchCanvas.getContext('2d');
let sketchPainting = false;
let brushSize = 10;
let brushOpacity = 1;
let brushFlow = 1;
let brushHardness = 100;
let brushColor = '#000000';
let zoomLevel = 1;
let sketchLayers = [{ id: 0, name: 'Layer 1', opacity: 1, visible: true, data: null }];
let activeLayer = 0;

const canvas = pixelCanvas; 
const toolButtons = document.querySelectorAll('.tool-btn') || [];

// =====================
// UTILITY FUNCTIONS
// =====================
function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id '${id}' not found`);
    }
    return element;
}

function createPixelGrid(width, height) {
    if (!pixelCanvas) return;

    pixelCanvas.innerHTML = '';
    pixelData = [];
    pixelCanvas.style.gridTemplateColumns = `repeat(${width}, ${cellSize}px)`;
    pixelCanvas.style.gridTemplateRows = `repeat(${height}, ${cellSize}px)`;
    pixelCanvas.style.position = 'relative';
    pixelCanvas.style.zIndex = '1';

    for (let y = 0; y < height; y++) {
        pixelData[y] = [];
        for (let x = 0; x < width; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.style.backgroundColor = 'transparent';
            cell.style.border = showGrid ? '1px solid rgba(128,128,128,0.3)' : '1px solid transparent';
            cell.style.boxSizing = 'border-box';
            cell.style.position = 'relative';
            pixelCanvas.appendChild(cell);
            pixelData[y][x] = 'transparent';
        }
    }

    updatePixelCanvasTransform();
}

function updatePixelCanvasTransform() {
    const container = document.querySelector('.canvas-area');
    if (!container || !pixelCanvas) return;

    // Apply zoom
    pixelCanvas.style.transform = `scale(${zoomLevel})`;

    // Update preview canvas size and zoom
    if (previewCanvas) {
        previewCanvas.width = canvasWidth * cellSize;
        previewCanvas.height = canvasHeight * cellSize;
        previewCanvas.style.transform = `scale(${zoomLevel})`;
    }

    // Center the grid
    const canvasWidthPx = canvasWidth * cellSize * zoomLevel;
    const canvasHeightPx = canvasHeight * cellSize * zoomLevel;
    const containerRect = container.getBoundingClientRect();
    pixelCanvas.style.marginLeft = `${Math.max(0, (containerRect.width - canvasWidthPx) / 2)}px`;
    pixelCanvas.style.marginTop = `${Math.max(0, (containerRect.height - canvasHeightPx) / 2)}px`;
}

function updateSketchCanvasTransform() {
    if (!sketchCanvas) return;
    sketchCanvas.style.transform = `scale(${zoomLevel})`;
    
    const container = document.querySelector('.canvas-area');
    if (container) {
        const containerRect = container.getBoundingClientRect();
        const canvasWidthPx = sketchCanvas.width * zoomLevel;
        const canvasHeightPx = sketchCanvas.height * zoomLevel;
        sketchCanvas.style.marginLeft = `${Math.max(0, (containerRect.width - canvasWidthPx) / 2)}px`;
        sketchCanvas.style.marginTop = `${Math.max(0, (containerRect.height - canvasHeightPx) / 2)}px`;
    }
}

function updateGridDisplay() {
    const cells = pixelCanvas.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.style.border = showGrid ? '1px solid rgba(128,128,128,0.2)' : 'none';
    });
}

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

    return points.filter((v,i,a) => a.findIndex(t => t.x === v.x && t.y === v.y) === i);
}

function updateCanvasInfo() {
    const info = document.getElementById('canvasInfo');
    if(!info) return; // Gracefully handle missing element
    
    const colorInfo = currentMode === 'pixel' ? primaryColor : brushColor;
    info.textContent = `${canvasWidth}×${canvasHeight} | ${currentTool} | ${colorInfo}`;
}

function savePixelState() {
    const snapshot = pixelData.map(row => [...row]);
    pixelUndoStack.push(snapshot);
    pixelRedoStack = [];
    if(pixelUndoStack.length > 50) pixelUndoStack.shift();
}

function restorePixelState(stackFrom, stackTo) {
    if(stackFrom.length === 0) return;
    const snapshot = stackFrom.pop();
    stackTo.push(pixelData.map(row => [...row]));
    pixelData = snapshot.map(row => [...row]);
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
    const scale = zoomLevel;
    const x = Math.floor((e.clientX - rect.left) / (cellSize * scale));
    const y = Math.floor((e.clientY - rect.top) / (cellSize * scale));
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
    if(cell) {
        cell.style.backgroundColor = color;
    }
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

        if(visited.has(key)) continue;
        if(x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) continue;
        if(pixelData[y][x] !== startColor) continue;

        visited.add(key);
        setPixel(x, y, newColor);

        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
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
        if(currentTool.includes('symmetric')) {
            getSymmetricPoints(x0, y0).forEach(p => setPixel(p.x, p.y, color));
        } else {
            setPixel(x0, y0, color);
        }

        if (x0 === x1 && y0 === y1) break;
        let e2 = 2 * err;
        if(e2 > -dy) { err -= dy; x0 += sx; }
        if(e2 < dx) { err += dx; y0 += sy; }
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
                if(currentTool.includes('symmetric')) {
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
                if(currentTool.includes('symmetric')) {
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
        const points = tool.includes('symmetric') ? getSymmetricPoints(px, py) : [{x: px, y: py}];
        points.forEach(p => {
            if(p.x >= 0 && p.y >= 0 && p.x < canvasWidth && p.y < canvasHeight) {
                previewCtx.fillRect(p.x * scale, p.y * scale, scale, scale);
            }
        });
    }

    switch(tool) {
        case 'line':
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
    updateTransformInfo();
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
            pixelData[yy][xx] = 'transparent';
        }
    }

    renderPixelCanvas();
    isMovingSelection = true;
    moveOffset = {x: 0, y: 0};
    lastMouse = { x: x, y: y};
    updateTransformInfo();
}

function moveSelection(dx, dy) {
    if(!selectionData) return;
    moveOffset.x += dx;
    moveOffset.y += dy;

    renderPixelCanvas(); // draw the base

    const {x0, y0, data} = selectionData;
    for(let yy = 0; yy < data.length; yy++) {
        for(let xx = 0; xx < data[0].length; xx++) {
            const px = x0 + xx + moveOffset.x;
            const py = y0 + yy + moveOffset.y;
            if(px >= 0 && py >= 0 && px < canvasWidth && py < canvasHeight) {
                const cell = pixelCanvas.querySelector(`.cell[data-x="${px}"][data-y="${py}"]`);
                if(cell && data[yy][xx] !== 'transparent') {
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
    updateTransformInfo();
}

function drawSelectionOverlay() {
    const overlay = document.getElementById('selectionOverlay');
    if (!overlay) return;

    overlay.width = canvasWidth * cellSize;
    overlay.height = canvasHeight * cellSize;
    const ctx = overlay.getContext('2d');
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    if (isSelecting && selectionStart) {
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 2]);
        const x = Math.min(selectionStart.x, mouseX) * cellSize;
        const y = Math.min(selectionStart.y, mouseY) * cellSize;
        const w = (Math.abs(selectionStart.x - mouseX) + 1) * cellSize;
        const h = (Math.abs(selectionStart.y - mouseY) + 1) * cellSize;
        ctx.strokeRect(x, y, w, h);
    }

    if (isMovingSelection && selectionData) {
        const {x0, y0, data} = selectionData;
        ctx.fillStyle = 'rgba(76,175,80,0.3)';
        for (let yy = 0; yy < data.length; yy++) {
            for (let xx = 0; xx < data[0].length; xx++) {
                const px = (x0 + xx + moveOffset.x) * cellSize;
                const py = (y0 + yy + moveOffset.y) * cellSize;
                if (data[yy][xx] !== 'transparent') {
                    ctx.fillRect(px, py, cellSize, cellSize);
                }
            }
        }
    }
}

let mouseX = 0;
let mouseY = 0;

pixelCanvas.addEventListener('mousedown', e => {
    const rect = pixelCanvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    if (currentTool === 'select') startSelection(x, y);
});

pixelCanvas.addEventListener('mousemove', e => {
    const rect = pixelCanvas.getBoundingClientRect();
    mouseX = Math.floor((e.clientX - rect.left) / cellSize);
    mouseY = Math.floor((e.clientY - rect.top) / cellSize);

    if (isSelecting) drawSelectionOverlay();
    if (isMovingSelection) moveSelection(mouseX - selectionStart.x, mouseY - selectionStart.y);
});

pixelCanvas.addEventListener('mouseup', e => {
    if (isSelecting) endSelection(mouseX, mouseY);
    if (isMovingSelection) finalizeSelection();
});



// =====================
// PIXEL TOOL HANDLERS
// =====================
function handlePixelPaint(e) {
    if(!e || currentMode !== 'pixel') return;

    const {x, y} = getCellFromEvent(e);
    if(x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) return;

    let color = e.button === 2 ? secondaryColor : primaryColor;

    switch(currentTool) {
        case 'pencil':
            setPixel(x, y, color); // Use setPixel for real-time visual update
            break;
        case 'eraser':
            setPixel(x, y, 'transparent'); // Real-time erase
            break;
        case 'symmetricPencil':
            getSymmetricPoints(x, y).forEach(p => setPixel(p.x, p.y, color));
            break;
        case 'symmetricEraser':
            getSymmetricPoints(x, y).forEach(p => setPixel(p.x, p.y, 'transparent'));
            break;
        case 'fill':
            floodFill(x, y, color);
            break;
        case 'symmetricFill':
            getSymmetricPoints(x, y).forEach(p => {
                if(p.x >= 0 && p.y >= 0 && p.x < canvasWidth && p.y < canvasHeight) {
                    floodFill(p.x, p.y, color);
                }
            });
            break;
        case 'eyedropper':
            if(pixelData[y] && pixelData[y][x]) {
                if(e.button === 2) {
                    secondaryColor = pixelData[y][x];
                } else {
                    primaryColor = pixelData[y][x];
                    currentColor = primaryColor;
                }
                updateCanvasInfo();
                updateColorSwatches();
            }
            break;
    }
}

function handleMouseDown(e) {
    if(currentMode !== 'pixel') return;
    e.preventDefault();
    const {x, y} = getCellFromEvent(e);

    if(currentTool === 'select') {
        startSelection(x, y);
    } else if(['line', 'rect', 'circle'].includes(currentTool)) {
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
}

function handleMouseMove(e) {
    if(currentMode !== 'pixel') return;
    e.preventDefault();
    const {x, y} = getCellFromEvent(e);

    if(isSelecting && previewCtx) {
        const x0 = Math.min(selectionStart.x, x);
        const y0 = Math.min(selectionStart.y, y);
        const x1 = Math.max(selectionStart.x, x);
        const y1 = Math.max(selectionStart.y, y);

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
}

function handleMouseUp(e) {
    if(currentMode !== 'pixel') return;
    e.preventDefault();
    const {x, y} = getCellFromEvent(e);

    if(isSelecting && previewCtx) {
        endSelection(x, y);
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    } else if(drawingShape && previewCtx) {
        drawingShape = false;
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

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
    }

    isPainting = false;
    lastMousePos = null;
}

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

function drawSketchAtFixed(x, y, isStart) {
    if (!sketchCtx) return;
    
    sketchCtx.save();

    switch(currentTool) {
        case 'brush':
            // Smooth brush with variable opacity
            sketchCtx.globalAlpha = brushOpacity * brushFlow;
            sketchCtx.fillStyle = brushColor;
            if(brushHardness < 100) {
                const gradient = sketchCtx.createRadialGradient(x, y, 0, x, y, brushSize / 2);
                gradient.addColorStop(0, brushColor);
                gradient.addColorStop(brushHardness / 100, brushColor);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                sketchCtx.fillStyle = gradient;
            }
            sketchCtx.beginPath();
            sketchCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
            sketchCtx.fill();
            break;

        case 'pen':
            // Hard edge, precise lines
            sketchCtx.globalAlpha = 1;
            sketchCtx.strokeStyle = brushColor;
            sketchCtx.lineWidth = brushSize;
            sketchCtx.lineCap = 'round';
            sketchCtx.lineJoin = 'round';
            
            if (isStart) {
                sketchCtx.beginPath();
                sketchCtx.moveTo(x, y);
            } else {
                sketchCtx.lineTo(x, y);
                sketchCtx.stroke();
            }
            break;

        case 'marker':
            // Semi-transparent, wide strokes
            sketchCtx.globalAlpha = 0.4;
            sketchCtx.fillStyle = brushColor;
            sketchCtx.beginPath();
            sketchCtx.ellipse(x, y, brushSize, brushSize * 0.6, 0, 0, Math.PI * 2);
            sketchCtx.fill();
            break;

        case 'pencilSketch':
            // Textured, variable opacity
            sketchCtx.globalAlpha = brushOpacity * 0.8;
            sketchCtx.strokeStyle = brushColor;
            sketchCtx.lineWidth = Math.max(1, brushSize / 3);
            sketchCtx.lineCap = 'round';
            
            if (isStart) {
                sketchCtx.beginPath();
                sketchCtx.moveTo(x, y);
            } else {
                // Add texture with multiple thin lines
                for(let i = 0; i < 3; i++) {
                    const jitterX = (Math.random() - 0.5) * 2;
                    const jitterY = (Math.random() - 0.5) * 2;
                    sketchCtx.beginPath();
                    sketchCtx.moveTo(x + jitterX, y + jitterY);
                    sketchCtx.lineTo(x + jitterX + 1, y + jitterY + 1);
                    sketchCtx.stroke();
                }
            }
            break;

        case 'charcoal':
            // Multiple overlapping soft circles
            sketchCtx.globalAlpha = 0.15;
            sketchCtx.fillStyle = brushColor;
            
            for (let i = 0; i < 8; i++) {
                const offsetX = (Math.random() - 0.5) * brushSize;
                const offsetY = (Math.random() - 0.5) * brushSize;
                const size = brushSize * (0.5 + Math.random() * 0.5);
                sketchCtx.beginPath();
                sketchCtx.arc(x + offsetX, y + offsetY, size / 2, 0, Math.PI * 2);
                sketchCtx.fill();
            }
            break;

        case 'eraser':
            sketchCtx.globalCompositeOperation = 'destination-out';
            sketchCtx.globalAlpha = 1;
            sketchCtx.beginPath();
            sketchCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
            sketchCtx.fill();
            sketchCtx.globalCompositeOperation = 'source-over';
            break;

        case 'sprayPaint':
            // Random spray pattern
            sketchCtx.globalAlpha = 0.1;
            sketchCtx.fillStyle = brushColor;
            
            for (let i = 0; i < 20; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * brushSize;
                const sprayX = x + Math.cos(angle) * distance;
                const sprayY = y + Math.sin(angle) * distance;
                const dotSize = Math.random() * 3 + 1;
                sketchCtx.beginPath();
                sketchCtx.arc(sprayX, sprayY, dotSize / 2, 0, Math.PI * 2);
                sketchCtx.fill();
            }
            break;

        case 'smudge':
            // Get and redistribute pixels
            const imageData = sketchCtx.getImageData(x - brushSize/2, y - brushSize/2, brushSize, brushSize);
            const data = imageData.data;
            
            for(let i = 0; i < data.length; i += 4) {
                const offset = Math.floor((Math.random() - 0.5) * 16) * 4;
                const targetIndex = Math.max(0, Math.min(data.length - 4, i + offset));
                
                data[i] = (data[i] + data[targetIndex]) / 2;
                data[i + 1] = (data[i + 1] + data[targetIndex + 1]) / 2;
                data[i + 2] = (data[i + 2] + data[targetIndex + 2]) / 2;
            }
            
            sketchCtx.putImageData(imageData, x - brushSize/2, y - brushSize/2);
            break;

        case 'blur':
            const blurSize = Math.floor(brushSize);
            sketchCtx.filter = `blur(${Math.max(1, blurSize/4)}px)`;
            sketchCtx.drawImage(sketchCanvas, 
                x - blurSize/2, y - blurSize/2, blurSize, blurSize,
                x - blurSize/2, y - blurSize/2, blurSize, blurSize);
            sketchCtx.filter = 'none';
            break;
    }

    sketchCtx.restore();
}

function drawSprayPaint(x, y) {
    if (!sketchCtx) return;
    
    sketchCtx.save();
    sketchCtx.globalAlpha = brushOpacity * 0.1;
    sketchCtx.fillStyle = brushColor;
    
    // Create spray pattern
    for (let i = 0; i < Math.floor(brushSize); i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * brushSize;
        const sprayX = x + Math.cos(angle) * distance;
        const sprayY = y + Math.sin(angle) * distance;
        const dotSize = Math.random() * 3 + 1;
        
        sketchCtx.beginPath();
        sketchCtx.arc(sprayX, sprayY, dotSize / 2, 0, Math.PI * 2);
        sketchCtx.fill();
    }
    
    sketchCtx.restore();
}

function drawSoftCircle(x, y, size, hardness = 1) {
    const radius = size / 2;
    
    if(hardness >= 0.99) {
        sketchCtx.beginPath();
        sketchCtx.arc(x, y, radius, 0, Math.PI * 2);
        sketchCtx.fill();
    } else {
        const gradient = sketchCtx.createRadialGradient(x, y, 0, x, y, radius);
        const currentFillStyle = sketchCtx.fillStyle;
        gradient.addColorStop(0, currentFillStyle);
        gradient.addColorStop(hardness, currentFillStyle);
        gradient.addColorStop(1, 'transparent');
        
        const oldFillStyle = sketchCtx.fillStyle;
        sketchCtx.fillStyle = gradient;
        sketchCtx.beginPath();
        sketchCtx.arc(x, y, radius, 0, Math.PI * 2);
        sketchCtx.fill();
        sketchCtx.fillStyle = oldFillStyle;
    }
}

function smudgeAt(x, y, settings) {
    const size = Math.floor(settings.size);
    const imageData = sketchCtx.getImageData(x - size/2, y - size/2, size, size);
    const data = imageData.data;
    
    for(let i = 0; i < data.length; i += 4) {
        const offset = Math.floor((Math.random() - 0.5) * 8);
        const targetIndex = Math.max(0, Math.min(data.length - 4, i + offset * 4));
        
        data[i] = (data[i] + data[targetIndex]) / 2;
        data[i + 1] = (data[i + 1] + data[targetIndex + 1]) / 2;
        data[i + 2] = (data[i + 2] + data[targetIndex + 2]) / 2;
    }
    
    sketchCtx.putImageData(imageData, x - size/2, y - size/2);
}

function blurAt(x, y, settings) {
    const size = Math.floor(settings.size);
    sketchCtx.save();
    sketchCtx.filter = `blur(${Math.max(1, size/8)}px)`;
    sketchCtx.drawImage(sketchCanvas, x - size/2, y - size/2, size, size, x - size/2, y - size/2, size, size);
    sketchCtx.restore();
}

// =====================
// MOUSE EVENTS FOR PIXEL CANVAS
// =====================
if (pixelCanvas) {
    // Remove any existing listeners first
    pixelCanvas.removeEventListener('mousedown', handleMouseDown);
    pixelCanvas.removeEventListener('mousemove', handleMouseMove);
    pixelCanvas.removeEventListener('mouseup', handleMouseUp);
    
    // Add working event listeners
    if (pixelCanvas) {
    pixelCanvas.addEventListener('mousedown', (e) => {
        if(currentMode !== 'pixel') return;
        e.preventDefault();
        const {x, y} = getCellFromEvent(e);

        if(currentTool === 'select') {
            startSelection(x, y);
        } else if(['line', 'rect', 'circle'].includes(currentTool)) {
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

    pixelCanvas.addEventListener('mousemove', (e) => {
        if(currentMode !== 'pixel') return;
        e.preventDefault();
        const {x, y} = getCellFromEvent(e);
        
        if(isSelecting && previewCtx) {
            const x0 = Math.min(selectionStart.x, x);
            const y0 = Math.min(selectionStart.y, y);
            const x1 = Math.max(selectionStart.x, x);
            const y1 = Math.max(selectionStart.y, y);

            previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            previewCtx.strokeStyle = 'rgba(0,150,255,0.8)';
            previewCtx.lineWidth = 2;
            previewCtx.setLineDash([4, 2]);
            previewCtx.strokeRect(
                x0 * cellSize, y0 * cellSize,
                (x1 - x0 + 1) * cellSize, (y1 - y0 + 1) * cellSize
            );
        } else if(drawingShape) {
            drawPreviewShape(shapeStart.x, shapeStart.y, x, y, currentTool, primaryColor);
        } else if(isMovingSelection && lastMousePos) {
            const dx = Math.floor((e.clientX - lastMousePos.x) / (cellSize * zoomLevel));
            const dy = Math.floor((e.clientY - lastMousePos.y) / (cellSize * zoomLevel));
            if(dx !== 0 || dy !== 0) {
                moveSelection(dx, dy);
                lastMousePos = {x: e.clientX, y: e.clientY};
            }
        } else if(isPainting) {
            handlePixelPaint(e);
        }
    });

    pixelCanvas.addEventListener('mouseup', (e) => {
        if(currentMode !== 'pixel') return;
        e.preventDefault();
        const {x, y} = getCellFromEvent(e);
        
        if(isSelecting && previewCtx) {
            endSelection(x, y);
            previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        } else if(drawingShape) {
            drawingShape = false;
            if(previewCtx) previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            
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
        }
        
        isPainting = false;
        lastMousePos = null;
    });
}

  if (pixelCanvas) {
    pixelCanvas.addEventListener('touchstart', e => {
        if(currentMode !== 'pixel') return;
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY,
            button: 0
        });
        pixelCanvas.dispatchEvent(mouseEvent);
    });

    pixelCanvas.addEventListener('touchmove', e => {
        if(currentMode !== 'pixel') return;
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        pixelCanvas.dispatchEvent(mouseEvent);
    });

    pixelCanvas.addEventListener('touchend', e => {
        if(currentMode !== 'pixel') return;
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {
            button: 0
        });
        pixelCanvas.dispatchEvent(mouseEvent);
    });
}
  
// Prevent context menu on canvas
pixelCanvas?.addEventListener('contextmenu', e => e.preventDefault());
sketchCanvas?.addEventListener('contextmenu', e => e.preventDefault());


// =====================
// MOUSE EVENTS FOR SKETCH CANVAS
// =====================
let sketchShapeStart = null;
let isDrawingSketchShape = false;

// Add to sketch canvas mousedown handler
if (sketchCanvas) {
    // Replace existing mousedown handler with this expanded version
    sketchCanvas.removeEventListener('mousedown', handleSketchMouseDown); // Remove if exists
    
    function handleSketchMouseDown(e) {
        if(currentMode !== 'sketch') return;
        e.preventDefault();
        
        const rect = sketchCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoomLevel;
        const y = (e.clientY - rect.top) / zoomLevel;
        
        if (['lineSketch', 'rectSketch', 'circleSketch'].includes(currentTool)) {
            isDrawingSketchShape = true;
            sketchShapeStart = {x, y};
            saveSketchState();
        } else {
            isSketchDrawing = true;
            saveSketchState();
            lastSketchPos = {x, y};
            drawSketchAtFixed(x, y, true);
        }
    }
    
    function handleSketchMouseMove(e) {
        if(currentMode !== 'sketch') return;
        e.preventDefault();

        const rect = sketchCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoomLevel;
        const y = (e.clientY - rect.top) / zoomLevel;

        if (isDrawingSketchShape && sketchShapeStart) {
            // Preview shape drawing (you'd need to implement preview for sketch)
            // For now, just continue to mouseup
        } else if (isSketchDrawing) {
            drawSketchAtFixed(x, y, false);
            lastSketchPos = {x, y};
        }
    }
    
    function handleSketchMouseUp(e) {
        if(currentMode !== 'sketch') return;
        e.preventDefault();
        
        if (isDrawingSketchShape && sketchShapeStart) {
            const rect = sketchCanvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / zoomLevel;
            const y = (e.clientY - rect.top) / zoomLevel;
            
            sketchCtx.strokeStyle = brushColor;
            sketchCtx.lineWidth = brushSize;
            sketchCtx.globalAlpha = brushOpacity;
            
            switch(currentTool) {
                case 'lineSketch':
                    sketchCtx.beginPath();
                    sketchCtx.moveTo(sketchShapeStart.x, sketchShapeStart.y);
                    sketchCtx.lineTo(x, y);
                    sketchCtx.stroke();
                    break;
                    
                case 'rectSketch':
                    const width = x - sketchShapeStart.x;
                    const height = y - sketchShapeStart.y;
                    sketchCtx.strokeRect(sketchShapeStart.x, sketchShapeStart.y, width, height);
                    break;
                    
                case 'circleSketch':
                    const radius = Math.sqrt(
                        Math.pow(x - sketchShapeStart.x, 2) + Math.pow(y - sketchShapeStart.y, 2)
                    );
                    sketchCtx.beginPath();
                    sketchCtx.arc(sketchShapeStart.x, sketchShapeStart.y, radius, 0, Math.PI * 2);
                    sketchCtx.stroke();
                    break;
            }
            
            sketchCtx.globalAlpha = 1;
            isDrawingSketchShape = false;
            sketchShapeStart = null;
        }
        
        isSketchDrawing = false;
        lastSketchPos = null;
    }
  // Apply new handlers
    sketchCanvas.addEventListener('mousedown', handleSketchMouseDown);
    sketchCanvas.addEventListener('mousemove', handleSketchMouseMove);
    sketchCanvas.addEventListener('mouseup', handleSketchMouseUp);
}

    // Touch events for sketch canvas
    sketchCanvas.addEventListener('touchstart', e => {
        if(currentMode !== 'sketch') return;
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        sketchCanvas.dispatchEvent(mouseEvent);
    });

    sketchCanvas.addEventListener('touchmove', e => {
        if(currentMode !== 'sketch') return;
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        sketchCanvas.dispatchEvent(mouseEvent);
    });

    sketchCanvas.addEventListener('touchend', e => {
        if(currentMode !== 'sketch') return;
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        sketchCanvas.dispatchEvent(mouseEvent);
    });
}

// =====================
// TOOL BUTTONS
// =====================
document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTool = btn.dataset.tool;
        
        // Handle move tool specifically
        if (currentTool === 'move' && !selectionData) {
            // Auto-switch to select tool if no selection exists
            currentTool = 'select';
            document.querySelector('[data-tool="select"]').classList.add('active');
            btn.classList.remove('active');
        }
        
        updateCanvasInfo();
        updateSymmetryInfo();
    });
});

// =====================
// MODE SWITCHING
// =====================
let lastPixelColorIndex = 0;

function updateModeDisplay() {
    const paletteContainer = document.getElementById('swatches');
    const pixelControls = document.querySelectorAll('.pixel-controls');
    const sketchControls = document.querySelectorAll('.sketch-controls');
    const pixelTools = document.querySelectorAll('.pixel-tools');
    const sketchTools = document.querySelectorAll('.sketch-tools');

    if(currentMode === 'pixel') {
        pixelCanvas.style.display = 'grid';
        sketchCanvas.style.display = 'none';

        pixelTools.forEach(d => d.style.display = 'flex');
        sketchTools.forEach(d => d.style.display = 'none');
        pixelControls.forEach(d => d.style.display = 'block');
        sketchControls.forEach(d => d.style.display = 'none');

        // Reset to pixel-appropriate tool if current tool is sketch-only
        const sketchOnlyTools = ['brush', 'pen', 'marker', 'pencilSketch', 'charcoal', 'smudge', 'blur', 'lineSketch', 'rectSketch', 'circleSketch', 'sprayPaint'];
        if (sketchOnlyTools.includes(currentTool)) {
            currentTool = 'pencil';
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('[data-tool="pencil"]').classList.add('active');
        }

        primaryColor = activePalette[currentColorIndex] || palettes.default[1];
    } else {
        pixelCanvas.style.display = 'none';
        sketchCanvas.style.display = 'block';

        pixelTools.forEach(d => d.style.display = 'none');
        sketchTools.forEach(d => d.style.display = 'flex');
        pixelControls.forEach(d => d.style.display = 'none');
        sketchControls.forEach(d => d.style.display = 'block');

        // Reset to sketch-appropriate tool if current tool is pixel-only
        const pixelOnlyTools = ['symmetricPencil', 'symmetricEraser', 'symmetricFill', 'select', 'move'];
        if (pixelOnlyTools.includes(currentTool)) {
            currentTool = 'brush';
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('[data-tool="brush"]').classList.add('active');
        }

        brushColor = sketchActivePalette[sketchColorIndex] || sketchBuiltInPalette[0];
        
        // Sync sketch color picker
        if (sketchColorPicker) {
            sketchColorPicker.value = brushColor;
        }
    }

    renderPalette();
    renderCustomPalette();
    updateCanvasInfo();
    updateColorSwatches();
}

document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        updateModeDisplay();
    });
});

// =====================
// PALETTE HANDLING
// =====================
function renderPalette() {
    let palette, index;
    
    try {
        if(currentMode === 'pixel') {
            palette = activePalette || palettes.default;
            index = currentColorIndex;
            currentPalette = palette; // Keep in sync
        } else {
            palette = sketchActivePalette || sketchBuiltInPalette;
            index = sketchColorIndex;
        }

        if(!paletteContainer || !palette) {
            console.warn("Palette container or palette not found");
            return;
        }
        
        paletteContainer.innerHTML = '';
        palette.forEach((color, i) => {
            const swatch = document.createElement('div');
            swatch.classList.add('swatch');
            swatch.style.backgroundColor = color;
            if(i === index) swatch.classList.add('selected');

            swatch.addEventListener('click', (e) => {
                if(currentMode === 'pixel') {
                    currentColorIndex = i;
                    primaryColor = palette[i];
                    currentColor = primaryColor; // Add this line
                } else {
                    sketchColorIndex = i;
                    brushColor = palette[i];
                }
                renderPalette();
                updateColorSwatches();
                updateCanvasInfo();
                console.log('Color selected:', currentMode === 'pixel' ? primaryColor : brushColor);
            });

            paletteContainer.appendChild(swatch);
        });

        updateColorSwatches();
    } catch(error) {
        console.error("Error rendering palette:", error);
    }
}

function updateColorSwatches() {
    const primarySwatch = document.getElementById('primaryColor');
    const secondarySwatch = document.getElementById('secondaryColor');

    if(primarySwatch) {
        primarySwatch.style.backgroundColor = currentMode === 'pixel' ? primaryColor : brushColor;
    }
    if(secondarySwatch) {
        secondarySwatch.style.backgroundColor = secondaryColor;
    }
}

const paletteSelector = document.getElementById('paletteSelector');

function updatePaletteSelector() {
    if(!paletteSelector) return;
    paletteSelector.innerHTML = '';

    // Add built-in palettes
    Object.keys(palettes).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
        paletteSelector.appendChild(option);
    });

    // Add custom option
    const customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.textContent = 'Custom Palette';
    paletteSelector.appendChild(customOption);

    // Add user palettes
    userPalettes.forEach(palette => {
        const option = document.createElement('option');
        option.value = palette.name;
        option.textContent = palette.name;
        paletteSelector.appendChild(option);
    });

    // Set current value
    paletteSelector.value = currentPaletteName || 'default';
}

if(paletteSelector) {
    paletteSelector.addEventListener('change', e => {
        const name = e.target.value;
        
        try {
            setPaletteByName(name);
            
            // Show color pickers for custom palettes
            const isCustom = name === 'custom' || userPalettes.some(p => p.name === name);
            if(colorPickersContainer) {
                colorPickersContainer.style.display = isCustom ? 'flex' : 'none';
            }
        } catch(error) {
            console.error("Error changing palette:", error);
        }
    });
}

// Custom Palette UI
function renderCustomPalette() {
    if(!colorPickersContainer) return;
    colorPickersContainer.innerHTML = '';

    const targetPalette = currentMode === 'pixel' ? customPalette : sketchCustomPalette;

    for(let i = 0; i < 8; i++) {
        const input = document.createElement('input');
        input.type = 'color';
        input.value = targetPalette[i] || '#ffffff';
        input.addEventListener('input', e => {
            targetPalette[i] = e.target.value;
            if(currentPaletteName === 'custom') {
                renderPalette();
            }
        });
        colorPickersContainer.appendChild(input);
    }
}

const saveCustomPaletteBtn = document.getElementById('saveCustomPalette');
if(saveCustomPaletteBtn) {
    saveCustomPaletteBtn.addEventListener('click', () => {
        renderCustomPalette();
        if(currentMode === 'pixel') {
            activePalette = [...customPalette];
            currentPalette = activePalette;
        } else {
            sketchActivePalette = [...sketchCustomPalette];
        }
        renderPalette();
    });
}

// Primary/Secondary color swatches
const primarySwatch = document.getElementById('primaryColor');
const secondarySwatch = document.getElementById('secondaryColor');

if(primarySwatch) {
    primarySwatch.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'color';
        input.value = currentMode === 'pixel' ? primaryColor : brushColor;
        input.addEventListener('change', e => {
            if(currentMode === 'pixel') {
                primaryColor = e.target.value;
                currentColor = primaryColor;
            } else {
                brushColor = e.target.value;
            }
            updateColorSwatches();
            updateCanvasInfo();
        });
        input.click();
    });
}

if(secondarySwatch) {
    secondarySwatch.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'color';
        input.value = secondaryColor;
        input.addEventListener('change', e => {
            secondaryColor = e.target.value;
            updateColorSwatches();
        });
        input.click();
    });
}

// =====================
// SYMMETRY CONTROLS
// =====================
const symmetryButtons = document.querySelectorAll('.symmetry-btn');
const symmetryInfo = document.getElementById('symmetryInfo');

symmetryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active from all buttons
        symmetryButtons.forEach(b => b.classList.remove('active'));
        // Activate clicked button
        btn.classList.add('active');

        // Update symmetry mode
        symmetryMode = btn.dataset.symmetry;
        updateSymmetryInfo();
    });
});

function updateSymmetryInfo() {
    if (!symmetryInfo) return;

    // Determine if current tool supports symmetry
    const symmetricTools = ['pencil', 'brush', 'eraser']; // Replace with your symmetric-capable tools
    const isSymmetricTool = symmetricTools.includes(currentTool);
    const hasSymmetry = symmetryMode && symmetryMode !== 'none';

    if (isSymmetricTool && hasSymmetry) {
        symmetryInfo.textContent = `Active: ${currentTool} with ${symmetryMode} symmetry`;
        symmetryInfo.style.color = '#4CAF50';
    } else if (isSymmetricTool && !hasSymmetry) {
        symmetryInfo.textContent = 'Select a symmetry mode to use symmetric tools';
        symmetryInfo.style.color = '#FF9800';
    } else {
        symmetryInfo.textContent = 'Use symmetric tools (⚌) to draw with active symmetry mode';
        symmetryInfo.style.color = '#666';
    }
}

// Initialize UI on page load
document.addEventListener('DOMContentLoaded', updateSymmetryInfo);

// =====================
// CANVAS CONTROLS
// =====================
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
const clearBtn = document.getElementById('clear');
const resizeBtn = document.getElementById('resizeCanvas');
const gridToggle = document.getElementById('gridToggle');

// --- Undo / Redo ---
undoBtn?.addEventListener('click', () => {
    if(currentMode === 'pixel') {
        restorePixelState(pixelUndoStack, pixelRedoStack);
    } else {
        restoreSketchState(sketchUndoStack, sketchRedoStack);
    }
});

redoBtn?.addEventListener('click', () => {
    if(currentMode === 'pixel') {
        restorePixelState(pixelRedoStack, pixelUndoStack);
    } else {
        restoreSketchState(sketchRedoStack, sketchUndoStack);
    }
});

// --- Clear Canvas ---
clearBtn?.addEventListener('click', () => {
    if(currentMode === 'pixel') {
        savePixelState();
        createPixelGrid(canvasWidth, canvasHeight);
    } else {
        saveSketchState();
        sketchCtx.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);
    }
});

// --- Resize Canvas ---
if(resizeBtn) {
    resizeBtn.removeEventListener('click', handleResize); // Remove any existing handler

    resizeBtn.addEventListener('click', () => {
        const widthInput = document.getElementById('canvasWidth');
        const heightInput = document.getElementById('canvasHeight');
        if(!widthInput || !heightInput) return;

        const w = Math.max(1, Math.min(512, parseInt(widthInput.value) || 16));
        const h = Math.max(1, Math.min(512, parseInt(heightInput.value) || 16));

        widthInput.value = w;
        heightInput.value = h;

        if(w === canvasWidth && h === canvasHeight) return;

        canvasWidth = w;
        canvasHeight = h;

        if(currentMode === 'pixel') {
            savePixelState();
            createPixelGrid(canvasWidth, canvasHeight);
            updatePixelCanvasTransform();
        } else {
            saveSketchState();
            sketchCanvas.width = canvasWidth * cellSize;
            sketchCanvas.height = canvasHeight * cellSize;
            updateSketchCanvasTransform();
        }

        updateCanvasInfo();
    });
}

// --- Quick Canvas Size Buttons (Sketch Mode) ---
document.querySelectorAll('[data-size]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if(currentMode !== 'sketch') return;

        const [w, h] = e.target.dataset.size.split('x').map(Number);
        sketchCanvas.width = w;
        sketchCanvas.height = h;
        updateSketchCanvasTransform();
        updateCanvasInfo();
    });
});

// --- Grid Toggle ---
if(gridToggle) {
    gridToggle.checked = showGrid;
    gridToggle.addEventListener('change', e => {
        showGrid = e.target.checked;
        document.querySelectorAll('#canvas .cell').forEach(cell => {
            cell.style.border = showGrid ? 
                '1px solid rgba(128,128,128,0.3)' : 
                '1px solid transparent';
        });
    });
}

console.log("Canvas controls initialized successfully.");


// =====================
// BRUSH CONTROLS (SKETCH)
// =====================
const brushSizeSlider = document.getElementById('brushSize');
const brushSizeLabel = document.getElementById('brushSizeLabel');
const brushOpacitySlider = document.getElementById('brushOpacity');
const opacityLabel = document.getElementById('opacityLabel');
const brushHardnessSlider = document.getElementById('brushHardness');
const hardnessLabel = document.getElementById('hardnessLabel');
const brushFlowSlider = document.getElementById('brushFlow');
const flowLabel = document.getElementById('flowLabel');
const sketchColorPicker = document.getElementById('sketchColor');

if (brushSizeSlider) {
    brushSizeSlider.addEventListener('input', (e) => {
        brushSize = parseInt(e.target.value);
        if (brushSizeLabel) brushSizeLabel.textContent = brushSize;
        updateBrushPreview();
    });
}

if (brushOpacitySlider) {
    brushOpacitySlider.addEventListener('input', (e) => {
        brushOpacity = parseInt(e.target.value) / 100;
        if (opacityLabel) opacityLabel.textContent = e.target.value;
        updateBrushPreview();
    });
}

if (brushHardnessSlider && hardnessLabel) {
    brushHardnessSlider.addEventListener('input', e => {
        brushHardness = parseInt(e.target.value);
        hardnessLabel.textContent = brushHardness;
        updateBrushPreview();
    });
}

if (brushFlowSlider && flowLabel) {
    brushFlowSlider.addEventListener('input', e => {
        brushFlow = parseInt(e.target.value) / 100;
        flowLabel.textContent = e.target.value;
    });
}

if (sketchColorPicker) {
    sketchColorPicker.addEventListener('input', e => {
        brushColor = e.target.value;

        // Update custom palette if active
        if (currentPaletteName === 'custom' || sketchActivePalette === sketchCustomPalette) {
            sketchActivePalette[sketchColorIndex] = brushColor;
            renderPalette();
        }

        updateCanvasInfo();
        updateBrushPreview();
        updateColorSwatches();
    });
}

// --- Tool-specific textures ---
function applyBrushTexture(ctx, tool) {
    ctx.save();
    if(tool === 'pencil') {
        ctx.globalAlpha = brushOpacity;
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    } else if(tool === 'eraser') {
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    } else if(tool === 'spray') {
        for(let i=0; i<200; i++){
            const angle = Math.random()*2*Math.PI;
            const radius = Math.random()*(brushSize/2);
            const x = 25 + radius*Math.cos(angle);
            const y = 25 + radius*Math.sin(angle);
            ctx.fillStyle = brushColor;
            ctx.globalAlpha = brushOpacity;
            ctx.fillRect(x, y, 1, 1);
        }
    } else if(tool === 'marker') {
        ctx.globalAlpha = brushOpacity*0.7;
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    } else if(tool === 'airbrush') {
        for(let i=0; i<200; i++){
            const angle = Math.random()*2*Math.PI;
            const radius = Math.random()*(brushSize/2);
            const x = 25 + radius*Math.cos(angle);
            const y = 25 + radius*Math.sin(angle);
            ctx.fillStyle = brushColor;
            ctx.globalAlpha = brushOpacity*0.1;
            ctx.fillRect(x, y, 1, 1);
        }
    }
    ctx.restore();
}

// --- Brush Preview ---
function updateBrushPreview() {
    const preview = document.getElementById('brushPreview');
    if(!preview) return;

    preview.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 50, 50);

    const centerX = 25;
    const centerY = 25;
    const previewSize = Math.min(brushSize, 40);

    const points = [{x:centerX, y:centerY}];
    if(symmetryMode === 'vertical' || symmetryMode === 'both') points.push({x:50-centerX, y:centerY});
    if(symmetryMode === 'horizontal' || symmetryMode === 'both') points.push({x:centerX, y:50-centerY});
    if(symmetryMode === 'both') points.push({x:50-centerX, y:50-centerY});

    points.forEach(pt => {
        ctx.save();
        ctx.globalAlpha = brushOpacity;
        if(currentTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0,0,0,1)';
        } else {
            ctx.fillStyle = brushColor;
        }

        if(currentTool === 'spray' || currentTool === 'airbrush') {
            applyBrushTexture(ctx, currentTool, pt.x, pt.y);
        } else {
            if(brushHardness < 100) {
                const gradient = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, previewSize / 2);
                gradient.addColorStop(0, brushColor);
                gradient.addColorStop(brushHardness/100, brushColor);
                gradient.addColorStop(1, brushColor+'00');
                ctx.fillStyle = gradient;
            }
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, previewSize/2, 0, Math.PI*2);
            ctx.fill();
        }

        ctx.restore();
    });

    preview.appendChild(canvas);
}

// =====================
// SYMMETRIC BRUSH DRAWING (SKETCH)
// =====================
let lastX = null, lastY = null;

function drawSymmetricStroke(x, y, prevX, prevY) {
    if (!sketchCtx) return;

    const points = [{x, y}];

    if(symmetryMode === 'vertical' || symmetryMode === 'both') {
        points.push({x: sketchCanvas.width - x, y});
        if(prevX !== null) prevX = sketchCanvas.width - prevX;
    }
    if(symmetryMode === 'horizontal' || symmetryMode === 'both') {
        points.push({x, y: sketchCanvas.height - y});
        if(prevY !== null) prevY = sketchCanvas.height - prevY;
    }
    if(symmetryMode === 'both') {
        points.push({x: sketchCanvas.width - x, y: sketchCanvas.height - y});
    }

    points.forEach(pt => {
        if(currentTool === 'spray' || currentTool === 'airbrush') {
            applyBrushTexture(sketchCtx, currentTool, pt.x, pt.y);
        } else {
            sketchCtx.save();
            sketchCtx.globalAlpha = brushOpacity;

            if(currentTool === 'eraser') {
                sketchCtx.globalCompositeOperation = 'destination-out';
                sketchCtx.strokeStyle = 'rgba(0,0,0,1)';
            } else {
                sketchCtx.strokeStyle = brushColor;
            }

            sketchCtx.lineWidth = brushSize;
            sketchCtx.lineCap = 'round';
            sketchCtx.lineJoin = 'round';

            if(prevX !== null && prevY !== null) {
                sketchCtx.beginPath();
                sketchCtx.moveTo(prevX, prevY);
                sketchCtx.lineTo(pt.x, pt.y);
                sketchCtx.stroke();
            } else {
                sketchCtx.beginPath();
                sketchCtx.arc(pt.x, pt.y, brushSize/2, 0, Math.PI*2);
                sketchCtx.fillStyle = brushColor;
                sketchCtx.fill();
            }
            sketchCtx.restore();
        }
    });
}

function applyBrushTexture(ctx, tool, centerX, centerY) {
    ctx.save();
    if(tool === 'spray') {
        for(let i=0;i<200;i++){
            const angle=Math.random()*2*Math.PI;
            const radius=Math.random()*(brushSize/2);
            const x=centerX+radius*Math.cos(angle);
            const y=centerY+radius*Math.sin(angle);
            ctx.fillStyle=brushColor;
            ctx.globalAlpha=brushOpacity;
            ctx.fillRect(x,y,1,1);
        }
    } else if(tool === 'airbrush') {
        for(let i=0;i<200;i++){
            const angle=Math.random()*2*Math.PI;
            const radius=Math.random()*(brushSize/2);
            const x=centerX+radius*Math.cos(angle);
            const y=centerY+radius*Math.sin(angle);
            ctx.fillStyle=brushColor;
            ctx.globalAlpha=brushOpacity*0.1;
            ctx.fillRect(x,y,1,1);
        }
    }
    ctx.restore();
}

// =====================
// MOUSE EVENTS FOR SKETCH CANVAS
// =====================
sketchCanvas.addEventListener('mousedown', e => {
    isPainting = true;
    const rect = sketchCanvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    drawSymmetricStroke(lastX, lastY, null, null);
});

sketchCanvas.addEventListener('mousemove', e => {
    if(!isPainting) return;
    const rect = sketchCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawSymmetricStroke(x, y, lastX, lastY);
    lastX = x;
    lastY = y;
});

sketchCanvas.addEventListener('mouseup', () => {
    isPainting = false;
    lastX = lastY = null;
    saveSketchState();
});

sketchCanvas.addEventListener('mouseleave', () => {
    isPainting = false;
    lastX = lastY = null;
});

// =====================
// ZOOM CONTROLS
// =====================
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const zoomResetBtn = document.getElementById('zoomReset');
const zoomIndicator = document.getElementById('zoomIndicator');

if(zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
        zoomLevel = Math.min(zoomLevel * 1.25, 5);
        updatePixelCanvasTransform();
        updateSketchCanvasTransform();
        if(zoomIndicator) {
            zoomIndicator.textContent = Math.round(zoomLevel * 100) + '%';
        }
    });
}

if(zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
        zoomLevel = Math.max(zoomLevel / 1.25, 0.1);
        updatePixelCanvasTransform();
        updateSketchCanvasTransform();
        if(zoomIndicator) {
            zoomIndicator.textContent = Math.round(zoomLevel * 100) + '%';
        }
    });
}

if(zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => {
        zoomLevel = 1;
        updatePixelCanvasTransform();
        updateSketchCanvasTransform();
        if(zoomIndicator) {
            zoomIndicator.textContent = '100%';
        }
    });
}

// =====================
// SPRITES HANDLING
// =====================
let sprites = [];
let currentSpriteIndex = -1;
const spriteSelector = document.getElementById('spriteSelector');

function updateSpriteSelector() {
    if(!spriteSelector) return;
    spriteSelector.innerHTML = '';

    sprites.forEach((s, i) => {
        const option = document.createElement('option');
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
        data: pixelData.map(row => [...row])
    };
    sprites.push(sprite);
    currentSpriteIndex = sprites.length - 1;
    updateSpriteSelector();
}

function duplicateSprite() {
    if(currentSpriteIndex < 0) return;
    const original = sprites[currentSpriteIndex];
    const copy = {
        name: original.name + ' Copy',
        width: original.width,
        height: original.height,
        data: original.data.map(row => [...row])
    };
    sprites.push(copy);
    currentSpriteIndex = sprites.length - 1;
    pixelData = copy.data.map(row => [...row]);
    renderPixelCanvas();
    updateSpriteSelector();
}

function deleteSprite() {
    if(currentSpriteIndex < 0) return;
    sprites.splice(currentSpriteIndex, 1);
    currentSpriteIndex = sprites.length - 1;

    if(currentSpriteIndex >= 0) {
        pixelData = sprites[currentSpriteIndex].data.map(row => [...row]);
        renderPixelCanvas();
    } else {
        createPixelGrid(canvasWidth, canvasHeight);
    }

    updateSpriteSelector();
}

const newSpriteBtn = document.getElementById('newSprite');
const duplicateSpriteBtn = document.getElementById('duplicateSprite');
const deleteSpriteBtn = document.getElementById('deleteSprite');

if(newSpriteBtn) newSpriteBtn.addEventListener('click', newSprite);
if(duplicateSpriteBtn) duplicateSpriteBtn.addEventListener('click', duplicateSprite);
if(deleteSpriteBtn) deleteSpriteBtn.addEventListener('click', deleteSprite);

if(spriteSelector) {
    spriteSelector.addEventListener('change', e => {
        currentSpriteIndex = parseInt(e.target.value);
        if(currentSpriteIndex >= 0) {
            pixelData = sprites[currentSpriteIndex].data.map(row => [...row]);
            renderPixelCanvas();
        }
    });
}

// =====================
// TRANSFORM CONTROLS
// =====================
const rotateLeftBtn = document.getElementById('rotateLeft');
const rotate180Btn = document.getElementById('rotate180');
const rotateRightBtn = document.getElementById('rotateRight');
const flipHorizontalBtn = document.getElementById('flipHorizontal');
const flipVerticalBtn = document.getElementById('flipVertical');

function rotatePixelData(degrees) {
    if(!selectionData) {
        // If no selection, rotate entire canvas
        savePixelState();
        let rotated;
        
        switch(degrees) {
            case 90:
                rotated = pixelData[0].map((_, i) => pixelData.map(row => row[i]).reverse());
                break;
            case 180:
                rotated = pixelData.slice().reverse().map(row => row.slice().reverse());
                break;
            case 270:
                rotated = pixelData[0].map((_, i) => pixelData.map(row => row[row.length - 1 - i]));
                break;
        }
        
        pixelData = rotated;
        renderPixelCanvas();
        return;
    }

    const { data } = selectionData;
    let rotated;

    switch(degrees) {
        case 90:
            rotated = data[0].map((_, i) => data.map(row => row[i]).reverse());
            break;
        case 180:
            rotated = data.slice().reverse().map(row => row.slice().reverse());
            break;
        case 270:
            rotated = data[0].map((_, i) => data.map(row => row[row.length - 1 - i]));
            break;
    }

    selectionData.data = rotated;
    moveSelection(0, 0);
}

function flipPixelData(direction) {
    if(!selectionData) {
        // If no selection, flip entire canvas
        savePixelState();
        
        if(direction === 'horizontal') {
            pixelData = pixelData.map(row => row.slice().reverse());
        } else {
            pixelData = pixelData.slice().reverse();
        }
        
        renderPixelCanvas();
        return;
    }

    const { data } = selectionData;

    if(direction === 'horizontal') {
        selectionData.data = data.map(row => row.slice().reverse());
    } else {
        selectionData.data = data.slice().reverse();
    }

    moveSelection(0, 0);
}

if(rotateLeftBtn) rotateLeftBtn.addEventListener('click', () => rotatePixelData(270));
if(rotate180Btn) rotate180Btn.addEventListener('click', () => rotatePixelData(180));
if(rotateRightBtn) rotateRightBtn.addEventListener('click', () => rotatePixelData(90));
if(flipHorizontalBtn) flipHorizontalBtn.addEventListener('click', () => flipPixelData('horizontal'));
if(flipVerticalBtn) flipVerticalBtn.addEventListener('click', () => flipPixelData('vertical'));

function updateTransformInfo() {
    const transformInfo = document.querySelector('.transform-info small');
    if (transformInfo) {
        if (selectionData) {
            transformInfo.textContent = `Selection: ${selectionData.x1 - selectionData.x0 + 1}×${selectionData.y1 - selectionData.y0 + 1} pixels`;
            transformInfo.style.color = '#4CAF50';
        } else {
            transformInfo.textContent = 'Select an area first to use transform tools';
            transformInfo.style.color = '#666';
        }
    }
}

// =====================
// LAYERS HANDLING (SKETCH)
// =====================

function renderLayersToCanvas() {
    if (currentMode !== 'sketch' || !sketchCtx) return;
    
    // Clear canvas
    sketchCtx.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);
    
    // Render all visible layers
    sketchLayers.forEach((layer, index) => {
        if (!layer.visible || !layer.data) return;
        
        const img = new Image();
        img.onload = () => {
            sketchCtx.save();
            sketchCtx.globalAlpha = layer.opacity;
            sketchCtx.drawImage(img, 0, 0);
            sketchCtx.restore();
        };
        img.src = layer.data;
    });
}

// Update layer switching
if(document.getElementById('layerList')) {
    document.addEventListener('click', (e) => {
        if(e.target.classList.contains('layer-visibility')) {
            const layerIndex = parseInt(e.target.dataset.layer);
            if(sketchLayers[layerIndex]) {
                sketchLayers[layerIndex].visible = !sketchLayers[layerIndex].visible;
                updateLayerList();
                renderLayersToCanvas();
            }
        } else if(e.target.closest('.layer-item')) {
            // Save current layer data before switching
            if (activeLayer >= 0 && sketchLayers[activeLayer]) {
                sketchLayers[activeLayer].data = sketchCanvas.toDataURL();
            }
            
            const layerItem = e.target.closest('.layer-item');
            const newLayerIndex = Array.from(layerItem.parentNode.children).indexOf(layerItem);
            
            if (newLayerIndex !== activeLayer) {
                activeLayer = newLayerIndex;
                updateLayerList();
                
                // Load new layer data
                if (sketchLayers[activeLayer] && sketchLayers[activeLayer].data) {
                    const img = new Image();
                    img.onload = () => {
                        sketchCtx.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);
                        sketchCtx.drawImage(img, 0, 0);
                    };
                    img.src = sketchLayers[activeLayer].data;
                } else {
                    sketchCtx.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);
                }
            }
        }
    });
}

function updateLayerList() {
    const layerList = document.getElementById('layerList');
    if(!layerList) return;

    layerList.innerHTML = '';

    sketchLayers.forEach((layer, i) => {
        const layerDiv = document.createElement('div');
        layerDiv.className = 'layer-item' + (i === activeLayer ? ' active' : '');
        layerDiv.innerHTML = `<span class="layer-name">${layer.name}</span> <button class="layer-visibility" data-layer="${i}">${layer.visible ? '👁' : '🙈'}</button>`;

        layerDiv.addEventListener('click', () => {
            activeLayer = i;
            updateLayerList();
        });

        layerList.appendChild(layerDiv);
    });
}

const addLayerBtn = document.getElementById('addLayer');
if(addLayerBtn) {
    addLayerBtn.addEventListener('click', () => {
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

const layerOpacitySlider = document.getElementById('layerOpacity');
const layerOpacityLabel = document.getElementById('layerOpacityLabel');

if(layerOpacitySlider && layerOpacityLabel) {
    layerOpacitySlider.addEventListener('input', e => {
        const opacity = parseInt(e.target.value);
        layerOpacityLabel.textContent = opacity;
        if(sketchLayers[activeLayer]) {
            sketchLayers[activeLayer].opacity = opacity / 100;
        }
    });
}

document.addEventListener('click', (e) => {
    if(e.target.classList.contains('layer-visibility')) {
        const layerIndex = parseInt(e.target.dataset.layer);
        if(sketchLayers[layerIndex]) {
            sketchLayers[layerIndex].visible = !sketchLayers[layerIndex].visible;
            updateLayerList();
        }
    }
});

// =====================
// EXPORT FUNCTIONALITY
// =====================
const exportPNGBtn = document.getElementById('exportPNG');
const exportPNG2Btn = document.getElementById('exportPNG2');
const exportJSONBtn = document.getElementById('exportJSON');

function exportPixelArt() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const ctx = tempCanvas.getContext('2d');

    for(let y = 0; y < canvasHeight; y++) {
        for(let x = 0; x < canvasWidth; x++) {
            ctx.fillStyle = pixelData[y][x] === 'transparent' ? '#ffffff' : pixelData[y][x];
            ctx.fillRect(x, y, 1, 1);
        }
    }

    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = tempCanvas.toDataURL();
    link.click();
}

function exportSketch() {
    const link = document.createElement('a');
    link.download = 'sketch.png';
    link.href = sketchCanvas.toDataURL();
    link.click();
}

function exportJSON() {
    if(currentMode === 'pixel') {
        const data = {
            width: canvasWidth,
            height: canvasHeight,
            pixelData: pixelData,
            sprites: sprites
        };

        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], {type: 'application/json'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'pixel-art.json';
        link.click();

        const output = document.getElementById('output');
        if(output) output.value = dataStr;
    }
}

if(exportPNGBtn) {
    exportPNGBtn.addEventListener('click', () => {
        if(currentMode === 'pixel') {
            exportPixelArt();
        } else {
            exportSketch();
        }
    });
}

if(exportPNG2Btn) {
    exportPNG2Btn.addEventListener('click', () => {
        if(currentMode === 'pixel') {
            exportPixelArt();
        } else {
            exportSketch();
        }
    });
}

if(exportJSONBtn) {
    exportJSONBtn.addEventListener('click', exportJSON);
}

// =====================
// PROJECT MANAGEMENT
// =====================
const newProjectBtn = document.getElementById('newProject');
const saveProjectBtn = document.getElementById('saveProject');

if(newProjectBtn) {
    newProjectBtn.addEventListener('click', () => {
        if(confirm('Create new project? This will clear current work.')) {
            if(currentMode === 'pixel') {
                createPixelGrid(canvasWidth, canvasHeight);
                sprites = [];
                currentSpriteIndex = -1;
                updateSpriteSelector();
            } else {
                sketchCtx.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);
                sketchLayers = [{ id: 0, name: 'Layer 1', opacity: 1, visible: true, data: null }];
                activeLayer = 0;
                updateLayerList();
            }

            pixelUndoStack = [];
            pixelRedoStack = [];
            sketchUndoStack = [];
            sketchRedoStack = [];
        }
    });
}

if(saveProjectBtn) {
    saveProjectBtn.addEventListener('click', () => {
        const projectData = {
            mode: currentMode,
            canvasWidth,
            canvasHeight,
            pixelData: currentMode === 'pixel' ? pixelData : null,
            sketchData: currentMode === 'sketch' ? sketchCanvas.toDataURL() : null,
            sprites,
            currentSpriteIndex,
            primaryColor,
            secondaryColor,
            customPalette,
            sketchCustomPalette
        };

        const dataStr = JSON.stringify(projectData, null, 2);
        const blob = new Blob([dataStr], {type: 'application/json'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'jerry-editor-project.json';
        link.click();
    });
}

// Import functionality
const importFile = document.getElementById('importFile');
if(importFile) {
    importFile.addEventListener('change', e => {
        const file = e.target.files[0];
        if(!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            try {
                const data = JSON.parse(e.target.result);
                
                if(data.pixelData) {
                    // Import pixel art
                    canvasWidth = data.width || canvasWidth;
                    canvasHeight = data.height || canvasHeight;
                    pixelData = data.pixelData;
                    
                    const widthInput = document.getElementById('canvasWidth');
                    const heightInput = document.getElementById('canvasHeight');
                    if(widthInput) widthInput.value = canvasWidth;
                    if(heightInput) heightInput.value = canvasHeight;
                    
                    createPixelGrid(canvasWidth, canvasHeight);
                    renderPixelCanvas();
                    
                    if(data.sprites) {
                        sprites = data.sprites;
                        currentSpriteIndex = data.currentSpriteIndex || -1;
                        updateSpriteSelector();
                    }
                    
                    currentMode = 'pixel';
                    const pixelModeBtn = document.querySelector('[data-mode="pixel"]');
                    if(pixelModeBtn) pixelModeBtn.click();
                }
                
                updateCanvasInfo();
            } catch(error) {
                alert('Error importing file: ' + error.message);
            }
        };
        reader.readAsText(file);
    });
}

// =====================
// KEYBOARD SHORTCUTS
// =====================
document.addEventListener('keydown', e => {
    if(e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'z':
                e.preventDefault();
                if(e.shiftKey) {
                    redoBtn?.click();
                } else {
                    undoBtn?.click();
                }
                break;
            case 'n':
                e.preventDefault();
                newProjectBtn?.click();
                break;
            case 's':
                e.preventDefault();
                saveProjectBtn?.click();
                break;
            case 'h':
            case 'H':
                e.preventDefault();
                flipPixelData('horizontal');
                break;
            case 'j':
            case 'J':
                e.preventDefault();
                flipPixelData('vertical');
                break;
        }
    } else {
        switch(e.key) {
            case 'b':
                document.querySelector('[data-tool="pencil"]')?.click();
                break;
            case 'e':
                document.querySelector('[data-tool="eraser"]')?.click();
                break;
            case 'g':
                document.querySelector('[data-tool="fill"]')?.click();
                break;
            case 'i':
                document.querySelector('[data-tool="eyedropper"]')?.click();
                break;
            case 'l':
                document.querySelector('[data-tool="line"]')?.click();
                break;
            case 'r':
                document.querySelector('[data-tool="rect"]')?.click();
                break;
            case 'o':
                document.querySelector('[data-tool="circle"]')?.click();
                break;
            case 'm':
                document.querySelector('[data-tool="select"]')?.click();
                break;
            case '[':
                rotatePixelData(270);
                break;
            case ']':
                rotatePixelData(90);
                break;
        }
    }
});

// =====================
// INITIALIZATION
// =====================
function initialize() {
    if (!pixelCanvas || !paletteContainer) {
        console.error("Essential elements missing");
        return;
    }
    
    try {
        // Initialize palette references safely
        if (!currentPalette && palettes && palettes.default) {
            currentPalette = palettes.default;
            activePalette = palettes.default;
        }
        
        // Set initial colors safely
        if (!primaryColor && activePalette && activePalette.length > 1) {
            primaryColor = activePalette[1];
            currentColor = primaryColor;
        }

        // Create canvas grid
        createPixelGrid(canvasWidth, canvasHeight);
        
        // Update UI components
        updateCanvasInfo();
        renderPalette();
        updatePaletteSelector();
        updateColorSwatches();
        updateModeDisplay();
        updateBrushPreview();
        updateSpriteSelector();
        updateLayerList();
        updateGridDisplay();
        updateSymmetryInfo();
        updateTransformInfo();
        
        // Set initial tool if none selected
        const firstTool = document.querySelector('.tool-btn');
        if(firstTool && !document.querySelector('.tool-btn.active')) {
            firstTool.classList.add('active');
            currentTool = firstTool.dataset.tool || 'pencil';
        }
        
        // Set initial mode if none selected
        const firstMode = document.querySelector('.mode-btn');
        if(firstMode && !document.querySelector('.mode-btn.active')) {
            firstMode.classList.add('active');
            currentMode = firstMode.dataset.mode || 'pixel';
        }

        console.log("Editor initialized successfully.");
    } catch(error) {
        console.error("Initialization error:", error);
    }
}

// Service Worker registration
if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('Service Worker registered:', reg))
            .catch(err => console.error('SW registration failed:', err));
    });
}

// Prevent touch scrolling on canvas areas
document.body.addEventListener('touchstart', e => {
    if(e.target.closest('#canvas') || e.target.closest('#sketchCanvas')) {
        e.preventDefault();
    }
}, {passive: false});

document.body.addEventListener('touchmove', e => {
    if(e.target.closest('#canvas') || e.target.closest('#sketchCanvas')) {
        e.preventDefault();
    }
}, {passive: false});

// Initialize the app
document.addEventListener('DOMContentLoaded', initialize);
