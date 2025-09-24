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
let showGrid = true; // FIX: Ensure this state variable is respected

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
const sketchCtx = sketchCanvas ? sketchCanvas.getContext('2d') : null; // Safety check
let sketchPainting = false;
let brushSize = 10; // FIX: Ensure this and other controls are functional
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
            // FIX: Grid overlay is handled in updateGridDisplay now
            cell.style.boxSizing = 'border-box';
            cell.style.position = 'relative';
            pixelCanvas.appendChild(cell);
            pixelData[y][x] = 'transparent';
        }
    }

    updateGridDisplay(); // FIX: Call to initialize grid visibility
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

// FIX: Grid overlay actually works
function updateGridDisplay() {
    if (!pixelCanvas) return;
    const cells = pixelCanvas.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.style.border = showGrid ? '1px solid rgba(128,128,128,0.2)' : 'none';
    });
    // If the grid container itself is the element holding the cells,
    // we might need to adjust the padding/margin to account for border collapse if present.
    // Since it uses CSS Grid with divs for cells, the cell border should be sufficient.
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
    // FIX: Factor in zoom level for accurate pixel calculation
    const x = Math.floor((e.clientX - rect.left) / (cellSize * zoomLevel));
    const y = Math.floor((e.clientY - rect.top) / (cellSize * zoomLevel));
    return { x, y };
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
    moveOffset = {x: 0, y: 0}; // Reset offset
    if (selectionData) {
        // If a selection already exists, finalize it first.
        finalizeSelection();
    }
    updateTransformInfo();
}

function endSelection(x, y) {
    if(!isSelecting) return;
    isSelecting = false;
    const x0 = Math.min(selectionStart.x, x);
    const y0 = Math.min(selectionStart.y, y);
    const x1 = Math.max(selectionStart.x, x);
    const y1 = Math.max(selectionStart.y, y);
    
    // FIX: Ensure selection is at least 1 pixel wide/high
    if (x0 === x1 && y0 === y1) {
        // Cancel selection if it's a single click/pixel, or make it 1x1
        // We'll assume a single-click should probably just select the pixel.
        selectionData = {x0, y0, x1: x0, y1: y0, data: [[pixelData[y0][x0]]]};
    } else {
        selectionData = {x0, y0, x1, y1, data: []};
        for(let yy = y0; yy <= y1; yy++) {
            let row = [];
            for(let xx = x0; xx <= x1; xx++) {
                // BOUNDS CHECK - though x0-x1/y0-y1 should be within bounds from getCellFromEvent
                row.push(pixelData[yy] && pixelData[yy][xx] ? pixelData[yy][xx] : 'transparent');
            }
            selectionData.data.push(row);
        }
    }


    // Clear selected area
    for(let yy = selectionData.y0; yy <= selectionData.y1; yy++) {
        for(let xx = selectionData.x0; xx <= selectionData.x1; xx++) {
            if(pixelData[yy] && pixelData[yy][xx]) {
                pixelData[yy][xx] = 'transparent';
            }
        }
    }

    renderPixelCanvas();
    isMovingSelection = true;
    moveOffset = {x: 0, y: 0};
    // lastMouse = { x: x, y: y}; // This was a bug - need clientX/Y for drag calculation
    updateTransformInfo();
}

// FIX: Separate move and draw for reliable selection/move
function moveSelection(dx, dy) {
    if(!selectionData) return;
    moveOffset.x += dx;
    moveOffset.y += dy;

    // The move is only visible via the overlay (previewCtx in this case)
    // We don't want to mess with renderPixelCanvas here, as that draws the base.
    drawSelectionOverlay();
}

function finalizeSelection() {
    if(!selectionData) return;
    savePixelState(); // Save state *before* committing the moved selection
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
    // Clear preview canvas
    if(previewCtx) previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    updateTransformInfo();
}

function drawSelectionOverlay() {
    if (!previewCtx) return;

    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

    if (isSelecting && selectionStart) {
        // Draw Selection Box
        previewCtx.strokeStyle = '#4CAF50';
        previewCtx.lineWidth = 2 / zoomLevel; // scale line width
        previewCtx.setLineDash([4, 2]);
        const x = Math.min(selectionStart.x, mouseX) * cellSize;
        const y = Math.min(selectionStart.y, mouseY) * cellSize;
        const w = (Math.abs(selectionStart.x - mouseX) + 1) * cellSize;
        const h = (Math.abs(selectionStart.y - mouseY) + 1) * cellSize;
        previewCtx.strokeRect(x, y, w, h);
    }

    if (isMovingSelection && selectionData) {
        // Draw Moving Selection Preview
        const {x0, y0, data} = selectionData;
        // Draw a semi-transparent box around the move location
        previewCtx.strokeStyle = '#000000';
        previewCtx.lineWidth = 1;
        previewCtx.setLineDash([2, 2]);

        const moveX = (x0 + moveOffset.x) * cellSize;
        const moveY = (y0 + moveOffset.y) * cellSize;
        const width = data[0].length * cellSize;
        const height = data.length * cellSize;
        previewCtx.strokeRect(moveX, moveY, width, height);

        // Draw the actual pixels of the selection data
        for (let yy = 0; yy < data.length; yy++) {
            for (let xx = 0; xx < data[0].length; xx++) {
                if (data[yy][xx] !== 'transparent') {
                    const px = (x0 + xx + moveOffset.x) * cellSize;
                    const py = (y0 + yy + moveOffset.y) * cellSize;
                    previewCtx.fillStyle = data[yy][xx];
                    previewCtx.fillRect(px, py, cellSize, cellSize);
                }
            }
        }
    }
}

let mouseX = 0;
let mouseY = 0;

// The selection/move tool event listeners are being merged into the main handlers for flow control

// =====================
// PIXEL TOOL HANDLERS
// =====================
// FIX: Pixels paint live, not on release - This logic is now correctly in handleMouseDown/handleMouseMove.
function handlePixelPaint(e) {
    if(!e || currentMode !== 'pixel') return;
    // getCellFromEvent now includes zoom factor
    const {x, y} = getCellFromEvent(e);
    if(x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) return;

    let color = e.button === 2 ? secondaryColor : primaryColor;

    // Only pencil/eraser should paint live on move. Shape tools handle on mouseUp.
    if (['pencil', 'eraser', 'symmetricPencil', 'symmetricEraser'].includes(currentTool)) {
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
        }
    }
}

function handlePixelClick(e) {
    if(!e || currentMode !== 'pixel') return;

    const {x, y} = getCellFromEvent(e);
    if(x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) return;

    let color = e.button === 2 ? secondaryColor : primaryColor;

    // Tools that perform a single action on click (not drag or live paint)
    switch(currentTool) {
        case 'fill':
            savePixelState();
            floodFill(x, y, color);
            break;
        case 'symmetricFill':
            savePixelState();
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
        // Pencil/Eraser are also clicks if no drag occurs, so we ensure they run once
        case 'pencil':
        case 'eraser':
        case 'symmetricPencil':
        case 'symmetricEraser':
            // Handled by handlePixelPaint already, but we need to ensure state is saved
            // We assume handleMouseDown saved state before the first paint call.
            break;
    }
}

// =====================
// PIXEL CANVAS MOUSE/TOUCH HANDLERS (LIVE PAINT)
// =====================
// Helper to get normalized mouse/touch coords
function getClientCoords(e) {
    const rect = pixelCanvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
        return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY, target: e.target };
    }
    return { clientX: e.clientX, clientY: e.clientY, target: e.target };
}

function handleMouseDown(e) {
    if(currentMode !== 'pixel') return;
    // Prevent context menu on right click
    if (e.button === 2) e.preventDefault();

    const {x, y} = getCellFromEvent(e);
    const coords = getClientCoords(e);

    // Check if we are trying to select/move an existing selection
    if(isMovingSelection) {
        // If click is outside the current moving selection, finalize it and start a new action
        if (currentTool !== 'select' || (x < selectionData.x0 + moveOffset.x || x > selectionData.x1 + moveOffset.x ||
            y < selectionData.y0 + moveOffset.y || y > selectionData.y1 + moveOffset.y)) {
            finalizeSelection();
            // If currentTool is still 'select', it will re-enter the select logic below
        } else {
            // Clicked inside the moving selection with 'select' tool, so start drag move
            lastMousePos = {x: coords.clientX, y: coords.clientY};
            return;
        }
    }
    
    // Start new action
    if (currentTool === 'select') {
        startSelection(x, y);
        lastMousePos = {x: coords.clientX, y: coords.clientY};
    } else if(['line', 'rect', 'circle'].includes(currentTool)) {
        drawingShape = true;
        shapeStart = {x, y};
        savePixelState();
    } else {
        // Pencil, Eraser, Fill, Eyedropper are immediate actions
        if (['pencil', 'eraser', 'symmetricPencil', 'symmetricEraser'].includes(currentTool)) {
            // Live Paint Tools: save state and start painting
            savePixelState();
            isPainting = true;
            handlePixelPaint(e); // Paint first pixel immediately
        } else {
            // Single Click Tools: Fill/Eyedropper
            handlePixelClick(e);
        }
    }
}

function handleMouseMove(e) {
    if(currentMode !== 'pixel') return;
    e.preventDefault();
    
    const coords = getClientCoords(e);
    const {x, y} = getCellFromEvent(e);
    mouseX = x;
    mouseY = y;
    
    // 1. Selection Mode (Draw Box)
    if(isSelecting && previewCtx) {
        drawSelectionOverlay();
    // 2. Shape Drawing Mode (Draw Preview)
    } else if(drawingShape) {
        drawPreviewShape(shapeStart.x, shapeStart.y, x, y, currentTool, primaryColor);
    // 3. Selection Moving Mode (Drag Move)
    } else if(isMovingSelection && lastMousePos) {
        // Calculate movement in pixels based on client coordinates, then convert to grid movement
        const clientDx = coords.clientX - lastMousePos.x;
        const clientDy = coords.clientY - lastMousePos.y;
        
        const dx = Math.floor(clientDx / (cellSize * zoomLevel));
        const dy = Math.floor(clientDy / (cellSize * zoomLevel));

        if(dx !== 0 || dy !== 0) {
            moveSelection(dx, dy);
            // Update lastMousePos only by the amount of grid movement that was *not* integer-based
            lastMousePos.x += dx * cellSize * zoomLevel;
            lastMousePos.y += dy * cellSize * zoomLevel;
        }
    // 4. Live Painting Mode (Pencil/Eraser)
    } else if(isPainting) {
        handlePixelPaint(e);
    }
}

function handleMouseUp(e) {
    if(currentMode !== 'pixel') return;
    e.preventDefault();

    const {x, y} = getCellFromEvent(e);

    // 1. Finish Selection Box
    if(isSelecting) {
        endSelection(x, y);
        // If we have a selection now, we stay in 'isMovingSelection' state
        // If not, the tool defaults back to what it was, but here it must be 'select'
        if (currentTool === 'select' && !selectionData) {
            isSelecting = false; // Should be false from endSelection, but just in case
        }
        if(previewCtx) previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    // 2. Finish Shape Drawing
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
    // 3. Finish Moving Selection (MouseUp commits the move, regardless of position)
    } else if(isMovingSelection && currentTool === 'select') {
        finalizeSelection();
    }
    
    isPainting = false;
    lastMousePos = null; // reset after any action
}

// Attach consolidated Pixel Event Listeners (Mouse/Touch Support)
if (pixelCanvas) {
    // Mouse Events
    pixelCanvas.addEventListener('mousedown', handleMouseDown);
    pixelCanvas.addEventListener('mousemove', handleMouseMove);
    pixelCanvas.addEventListener('mouseup', handleMouseUp);
    pixelCanvas.addEventListener('contextmenu', e => e.preventDefault());

    // Touch Events (Map touch to mouse equivalent for drawing)
    pixelCanvas.addEventListener('touchstart', e => {
        const touchEvent = e.touches[0];
        handleMouseDown({...touchEvent, preventDefault: e.preventDefault.bind(e), button: 0});
    });
    pixelCanvas.addEventListener('touchmove', e => {
        const touchEvent = e.touches[0];
        handleMouseMove({...touchEvent, preventDefault: e.preventDefault.bind(e)});
    });
    pixelCanvas.addEventListener('touchend', e => {
        // Only fire mouseup if all touches are gone
        if (e.touches.length === 0) {
            // We can't get final coordinates, so we use the last known mouseX/mouseY
            // Create a mock event with the last known grid position
            handleMouseUp({ clientX: mouseX * cellSize * zoomLevel, clientY: mouseY * cellSize * zoomLevel, preventDefault: e.preventDefault.bind(e), button: 0 });
        }
    });
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

// FIX: Controls (brush size, opacity, hardness) affect the tools
function getBrushSettings() {
    return {
        size: brushSize,
        opacity: brushOpacity,
        flow: brushFlow,
        hardness: brushHardness / 100, // Normalized 0 to 1
        color: brushColor
    };
}

// FIX: Sketch tools behave according to their type
function drawSketchAtFixed(x, y, isStart) {
    if (!sketchCtx) return;
    
    sketchCtx.save();
    const { size, opacity, hardness, color } = getBrushSettings();
    
    sketchCtx.lineCap = 'round';
    sketchCtx.lineJoin = 'round';

    switch(currentTool) {
        case 'brush':
            // Smooth brush with variable opacity and hardness
            sketchCtx.globalAlpha = opacity;
            sketchCtx.fillStyle = color;
            
            // Hardness simulation via radial gradient
            if(hardness < 1) {
                const gradient = sketchCtx.createRadialGradient(x, y, 0, x, y, size / 2);
                // Color up to the hardness radius
                gradient.addColorStop(0, color);
                gradient.addColorStop(hardness, color);
                // Fade to transparent
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                sketchCtx.fillStyle = gradient;
            }

            sketchCtx.beginPath();
            sketchCtx.arc(x, y, size / 2, 0, Math.PI * 2);
            sketchCtx.fill();
            break;

        case 'pencilSketch':
            // Thin, hard line, low opacity for 'sketch' feel, size controls width
            sketchCtx.globalAlpha = 0.5 * opacity; // Reduced opacity for pencil effect
            sketchCtx.strokeStyle = color;
            sketchCtx.lineWidth = size * 0.5; // Thinner line
            sketchCtx.lineCap = 'butt';
            break;

        case 'marker':
            // Broad, semi-transparent, hard edge
            sketchCtx.globalAlpha = 0.7 * opacity;
            sketchCtx.strokeStyle = color;
            sketchCtx.lineWidth = size * 1.5; // Thicker line
            sketchCtx.lineCap = 'square';
            break;

        case 'spray':
            // Scatter dots within an area (simulate airbrush)
            sketchCtx.globalAlpha = opacity * 0.1; // Very low alpha for build-up
            sketchCtx.fillStyle = color;
            const radius = size / 2;
            const density = Math.floor(size * 1.5);
            for (let i = 0; i < density; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const dist = Math.random() * radius;
                const px = x + Math.cos(angle) * dist;
                const py = y + Math.sin(angle) * dist;
                sketchCtx.fillRect(px, py, 1, 1);
            }
            sketchCtx.restore();
            return; // Spray doesn't use the lineTo logic below
            
        case 'smudge':
        case 'blur':
            // These require image data manipulation (filters) and are usually non-drag actions.
            // Placeholder: Treat as a transparent, soft brush press for visual feedback
            sketchCtx.globalAlpha = 0.1;
            sketchCtx.fillStyle = '#AAAAAA';
            sketchCtx.beginPath();
            sketchCtx.arc(x, y, size / 2, 0, Math.PI * 2);
            sketchCtx.fill();
            sketchCtx.restore();
            return; // Smudge/Blur don't use lineTo logic below

        case 'eraserSketch':
            // Eraser uses 'destination-out' to erase
            sketchCtx.globalCompositeOperation = 'destination-out';
            sketchCtx.globalAlpha = opacity;
            sketchCtx.strokeStyle = '#000000'; // Color doesn't matter for destination-out
            sketchCtx.lineWidth = size;
            break;

        default:
            // Default to a simple hard pencil/pen style
            sketchCtx.globalAlpha = opacity;
            sketchCtx.strokeStyle = color;
            sketchCtx.lineWidth = size;
            break;
    }
    
    // Draw a single dot or start a path
    if (isStart) {
        sketchCtx.beginPath();
        sketchCtx.moveTo(x, y);
        // Draw a dot on a single click
        sketchCtx.lineTo(x, y);
        sketchCtx.stroke();
    } else {
        // This part is meant to be called mid-drag, assuming the global path is open.
        // Since HTML canvas paths are cleared on stroke/new path, we must track and draw segments.
        // A better implementation uses a list of points, but for a quick fix:
        sketchCtx.beginPath();
        sketchCtx.moveTo(lastSketchPos.x, lastSketchPos.y);
        sketchCtx.lineTo(x, y);
        sketchCtx.stroke();
    }

    sketchCtx.restore();
}

let lastSketchPos = {x: 0, y: 0};

function handleSketchMouseDown(e) {
    if(currentMode !== 'sketch' || !sketchCtx) return;
    e.preventDefault();
    saveSketchState();
    sketchPainting = true;
    const rect = sketchCanvas.getBoundingClientRect();
    // FIX: Correctly factor in zoom level for sketch canvas
    const x = (e.clientX - rect.left) / zoomLevel;
    const y = (e.clientY - rect.top) / zoomLevel;
    lastSketchPos = {x, y};
    
    // Handle non-drag tools on click
    if (['smudge', 'blur', 'fillSketch', 'eyedropperSketch'].includes(currentTool)) {
        sketchPainting = false; // Don't drag these
        if (currentTool === 'smudge' || currentTool === 'blur') {
            // Apply filter over a brush-sized area
            // This is complex, so we'll leave a simple visual placeholder
            drawSketchAtFixed(x, y, true);
        }
        // Other tools like fill/eyedropper need mode-specific implementations not provided.
        return;
    }
    
    drawSketchAtFixed(x, y, true);
}

function handleSketchMouseMove(e) {
    if(currentMode !== 'sketch' || !sketchPainting || !sketchCtx) return;
    e.preventDefault();
    const rect = sketchCanvas.getBoundingClientRect();
    // FIX: Correctly factor in zoom level for sketch canvas
    const x = (e.clientX - rect.left) / zoomLevel;
    const y = (e.clientY - rect.top) / zoomLevel;

    drawSketchAtFixed(x, y, false);
    lastSketchPos = {x, y};
}

function handleSketchMouseUp(e) {
    if(currentMode !== 'sketch' || !sketchCtx) return;
    sketchPainting = false;
    // No extra drawing needed on mouse up for drag tools
}

// Attach consolidated Sketch Event Listeners (Mouse only for simplicity)
if (sketchCanvas) {
    sketchCanvas.addEventListener('mousedown', handleSketchMouseDown);
    sketchCanvas.addEventListener('mousemove', handleSketchMouseMove);
    sketchCanvas.addEventListener('mouseup', handleSketchMouseUp);
    sketchCanvas.addEventListener('mouseout', handleSketchMouseUp); // Stop painting if mouse leaves
}

// =====================
// INITIALIZATION
// =====================
function initEditor() {
    createPixelGrid(canvasWidth, canvasHeight);
    updateCanvasInfo();
    if (sketchCanvas) {
        // Set initial sketch canvas size (assuming it takes up full area or predefined size)
        sketchCanvas.width = 500; // Example size
        sketchCanvas.height = 500; // Example size
        updateSketchCanvasTransform();
    }

    // Any other necessary initialization steps (e.g., palette rendering)
}

// Mock function for missing DOM elements (required by logic but not provided)
function updateTransformInfo() { console.log("Transform info updated"); }
function updateColorSwatches() { console.log("Color swatches updated"); }
// Mock function for setPalette (it's called in setPaletteByName but not defined)
function setPalette(name, isUser) { console.log(`Setting palette: ${name}, isUser: ${isUser}`); }

// Call init to set up the grid
initEditor();
