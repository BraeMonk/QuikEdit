// =================================================================================================
// editor.js - Jerry Editor (Complete Fixed Version)
// Implements: Pixel & Sketch Modes, Symmetry, Sprite/Layer Mgmt, Palettes, I/O, PWA Storage
// =================================================================================================

// --- Theme Check (for palette defaults) ---
const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;

// =====================
// PALETTE DATA
// =====================
const BUILT_IN_PALETTES = {
    // Pixel/General Palettes (adapted for light/dark)
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
let symmetryMode = 'none'; // 'none', 'horizontal', 'vertical', 'both'
let isPainting = false;
let drawingShape = false;
let shapeStart = { x: 0, y: 0 };
let startX = 0, startY = 0;
let canvasWidth = 32, canvasHeight = 32; // Default starting size
let cellSize = 20;
let zoomLevel = 1;
let lastMousePos = null;
let showGrid = true;
let selection = null; // {x, y, w, h}

// --- Pixel Editor State ---
let pixelData = []; // The main grid data (array of arrays, stores colors)
let pixelUndoStack = [];
let pixelRedoStack = [];
let sprites = [
    { name: 'Frame 1', data: initializePixelData(canvasWidth, canvasHeight) }
];
let activeSpriteIndex = 0;
let primaryColor = BUILT_IN_PALETTES.default[1];
let secondaryColor = BUILT_IN_PALETTES.default[2];
let currentColor = primaryColor;

// --- Palette State ---
let userPalettes = loadUserPalettes();
let activePalette = BUILT_IN_PALETTES.default;
let currentPaletteName = 'default';
let selectedColorIndex = 1;
let customPalette = ['#000000', '#111111', '#222222', '#333333', '#444444', '#555555', '#666666', '#777777'];


// --- Sketch Editor State ---
const SKETCH_CANVAS_WIDTH = 800;
const SKETCH_CANVAS_HEIGHT = 600;
let sketchUndoStack = [];
let sketchRedoStack = [];
let sketchPainting = false;
let brushSize = 10;
let brushOpacity = 100; // 0-100
let brushHardness = 100; // 0-100
let brushFlow = 100; // 0-100
let brushColor = '#000000';
let sketchLayers = [
    { id: 0, name: 'Background', opacity: 1, blendMode: 'source-over', visible: true, canvas: createCanvasElement(SKETCH_CANVAS_WIDTH, SKETCH_CANVAS_HEIGHT) },
    { id: 1, name: 'Layer 1', opacity: 1, blendMode: 'source-over', visible: true, canvas: createCanvasElement(SKETCH_CANVAS_WIDTH, SKETCH_CANVAS_HEIGHT) }
];
let activeLayerIndex = 1;

// --- Initialize Pixel Data ---
function initializePixelData(width, height, color = 'transparent') {
    return Array(height).fill(0).map(() => Array(width).fill(color));
}

// --- PWA Storage Functions ---
function loadUserPalettes() {
    try {
        return JSON.parse(localStorage.getItem('userPalettes') || '[]');
    } catch (e) {
        console.warn('Could not load user palettes', e);
        return [];
    }
}

function saveUserPalettes() {
    localStorage.setItem('userPalettes', JSON.stringify(userPalettes));
}

// =====================
// CANVAS ELEMENTS & CONTEXTS
// =====================
const pixelCanvas = document.getElementById('canvas');
const canvasGrid = document.getElementById('canvasGrid');
const paletteContainer = document.getElementById('swatches');
const colorPickersContainer = document.getElementById('colorPickers');
const primarySwatch = document.getElementById('primaryColor');
const secondarySwatch = document.getElementById('secondaryColor');
const canvasWrapper = document.querySelector('.canvas-wrapper');
const paletteSelector = document.getElementById('paletteSelector');
const spriteSelector = document.getElementById('spriteSelector');

const sketchCanvas = document.getElementById('sketchCanvas');
const sketchCtx = sketchCanvas.getContext('2d');
const selectionOverlay = document.getElementById('selectionOverlay');
const selectionCtx = selectionOverlay.getContext('2d');

let previewCanvas = createCanvasElement(canvasWidth * cellSize, canvasHeight * cellSize);
let previewCtx = previewCanvas.getContext('2d');
if (canvasWrapper) {
    previewCanvas.style.position = 'absolute';
    previewCanvas.style.top = '0';
    previewCanvas.style.left = '0';
    previewCanvas.style.pointerEvents = 'none';
    previewCanvas.style.zIndex = '10';
    canvasWrapper.appendChild(previewCanvas);
}

function createCanvasElement(w, h) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    return canvas;
}

// =====================
// UI SETUP & RENDERING
// =====================

function setupPalettes() {
    paletteSelector.innerHTML = '';

    // Add Built-in Palettes
    for (const name in BUILT_IN_PALETTES) {
        const option = new Option(name.charAt(0).toUpperCase() + name.slice(1), name);
        paletteSelector.add(option);
    }

    // Add User Palettes
    userPalettes.forEach(p => {
        const option = new Option(`[User] ${p.name}`, `user-${p.name}`);
        paletteSelector.add(option);
    });

    // Add Custom Picker Palette
    paletteSelector.add(new Option('Custom Colors', 'custom'));

    setPaletteByName(currentPaletteName);
}

function renderPalette() {
    paletteContainer.innerHTML = '';
    const currentPalette = currentPaletteName === 'custom' ? customPalette :
                           currentPaletteName.startsWith('user-') ? userPalettes.find(p => p.name === currentPaletteName.substring(5))?.colors || [] :
                           activePalette;

    // Render Swatches
    currentPalette.forEach((color, index) => {
        const swatch = document.createElement('div');
        swatch.classList.add('swatch');
        swatch.dataset.color = color;
        swatch.dataset.index = index;
        swatch.style.backgroundColor = color;
        if (index === selectedColorIndex) {
            swatch.classList.add('selected');
        }
        swatch.addEventListener('click', () => {
            selectedColorIndex = index;
            currentColor = color;
            primarySwatch.style.backgroundColor = currentColor;
            renderPalette();
            updateCanvasInfo();
        });
        paletteContainer.appendChild(swatch);
    });

    // Render Custom Color Pickers
    colorPickersContainer.innerHTML = '';
    if (currentPaletteName === 'custom' || currentPaletteName.startsWith('user-')) {
        const targetPalette = currentPaletteName === 'custom' ? customPalette :
                              userPalettes.find(p => p.name === currentPaletteName.substring(5))?.colors || [];

        targetPalette.forEach((color, index) => {
            const picker = document.createElement('input');
            picker.type = 'color';
            picker.value = color;
            picker.classList.add('color-picker-input');
            picker.addEventListener('input', (e) => {
                targetPalette[index] = e.target.value;
                if (index === selectedColorIndex) {
                    currentColor = e.target.value;
                    primarySwatch.style.backgroundColor = currentColor;
                }
                renderPalette();
            });
            colorPickersContainer.appendChild(picker);
        });
    }

    // Set primary/secondary display
    primarySwatch.style.backgroundColor = primaryColor;
    secondarySwatch.style.backgroundColor = secondaryColor;
}

function setPaletteByName(name) {
    let palette;
    let isUser = name.startsWith('user-');
    let paletteKey = isUser ? name.substring(5) : name;

    if (BUILT_IN_PALETTES[paletteKey]) {
        palette = BUILT_IN_PALETTES[paletteKey];
    } else if (isUser) {
        palette = userPalettes.find(p => p.name === paletteKey)?.colors;
    } else if (paletteKey === 'custom') {
        palette = customPalette;
    }

    if (!palette) {
        console.warn(`Palette not found: ${name}`);
        return;
    }

    currentPaletteName = name;
    activePalette = palette;
    selectedColorIndex = Math.min(selectedColorIndex, palette.length > 1 ? 1 : 0);
    currentColor = activePalette[selectedColorIndex];
    primaryColor = currentColor;

    renderPalette();
    paletteSelector.value = name;

    const saveCustomBtn = document.getElementById('saveCustomPalette');
    if (saveCustomBtn) {
        saveCustomBtn.style.display = (name === 'custom' || isUser) ? 'inline-block' : 'none';
    }
}

function updateToolActiveState(tool) {
    currentTool = tool;
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tool-btn[data-tool="${tool}"]`)?.classList.add('active');
    updateCanvasInfo();
}

function updateSymmetryActiveState(mode) {
    symmetryMode = mode;
    document.querySelectorAll('.symmetry-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.symmetry-btn[data-symmetry="${mode}"]`)?.classList.add('active');
    document.getElementById('symmetryInfo').textContent = `Mode: ${mode.toUpperCase()} | Use symmetric tools (⚌) to draw with this mode.`;
}

function updateCanvasInfo() {
    const info = document.getElementById('canvasInfo');
    if (!info) return;

    let colorInfo = currentMode === 'pixel' ? currentColor : brushColor;
    let sizeInfo = currentMode === 'pixel' ? `${canvasWidth}×${canvasHeight}` : `${sketchCanvas.width}×${sketchCanvas.height}`;

    info.textContent = `${sizeInfo} | ${currentTool} | ${colorInfo}`;
}

// =====================
// CANVAS MANAGEMENT (PIXEL)
// =====================

function createPixelGrid(width, height) {
    if (!pixelCanvas) return;

    pixelCanvas.innerHTML = '';
    pixelCanvas.style.gridTemplateColumns = `repeat(${width}, ${cellSize}px)`;
    pixelCanvas.style.gridTemplateRows = `repeat(${height}, ${cellSize}px)`;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.style.boxSizing = 'border-box';
            pixelCanvas.appendChild(cell);
        }
    }
    renderPixelCanvas();
    updatePixelCanvasTransform();
}

function renderPixelCanvas() {
    // Save current active sprite data
    sprites[activeSpriteIndex].data = pixelData;
    // Load active sprite data
    pixelData = sprites[activeSpriteIndex].data;
    canvasWidth = pixelData[0].length;
    canvasHeight = pixelData.length;

    // Redraw the visual cells based on pixelData
    for (let y = 0; y < canvasHeight; y++) {
        for (let x = 0; x < canvasWidth; x++) {
            const cell = pixelCanvas.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
            if (cell) cell.style.backgroundColor = pixelData[y][x];
        }
    }
    updateGridDisplay();
    updateCanvasInfo();
    updatePixelCanvasTransform();
}

function updatePixelCanvasTransform() {
    const container = document.querySelector('.canvas-area');
    if (!container || !pixelCanvas) return;

    // Apply zoom
    pixelCanvas.style.transform = `scale(${zoomLevel})`;
    if (previewCanvas) previewCanvas.style.transform = `scale(${zoomLevel})`;

    // Center the grid
    const canvasWidthPx = canvasWidth * cellSize * zoomLevel;
    const canvasHeightPx = canvasHeight * cellSize * zoomLevel;
    const containerRect = container.getBoundingClientRect();
    pixelCanvas.style.marginLeft = `${Math.max(0, (containerRect.width - canvasWidthPx) / 2)}px`;
    pixelCanvas.style.marginTop = `${Math.max(0, (containerRect.height - canvasHeightPx) / 2)}px`;

    // Resize preview canvas
    if (previewCanvas) {
        previewCanvas.width = canvasWidth * cellSize;
        previewCanvas.height = canvasHeight * cellSize;
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    }
}

function updateGridDisplay() {
    const cells = pixelCanvas.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.style.border = showGrid ? '1px solid rgba(128,128,128,0.2)' : 'none';
    });
}

function getCellFromEvent(e) {
    const rect = pixelCanvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (cellSize * zoomLevel));
    const y = Math.floor((e.clientY - rect.top) / (cellSize * zoomLevel));
    return { x, y };
}

function setPixel(x, y, color) {
    if (x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) return;
    pixelData[y][x] = color;
    const cell = pixelCanvas.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    if (cell) {
        cell.style.backgroundColor = color;
    }
}

// =====================
// UNDO/REDO & STATE
// =====================

function savePixelState() {
    // Save a deep copy of the current sprite data
    const snapshot = sprites.map(sprite => ({
        ...sprite,
        data: sprite.data.map(row => [...row])
    }));
    pixelUndoStack.push(snapshot);
    pixelRedoStack = [];
    if (pixelUndoStack.length > 50) pixelUndoStack.shift(); // Limit history
}

function restorePixelState(stackFrom, stackTo) {
    if (stackFrom.length === 0) return;
    const currentSnapshot = sprites.map(sprite => ({
        ...sprite,
        data: sprite.data.map(row => [...row])
    }));
    stackTo.push(currentSnapshot);

    const snapshot = stackFrom.pop();
    sprites = snapshot.map(sprite => ({
        ...sprite,
        data: sprite.data.map(row => [...row])
    }));
    activeSpriteIndex = Math.min(activeSpriteIndex, sprites.length - 1);
    pixelData = sprites[activeSpriteIndex].data;
    
    // Check for size change
    if (pixelData[0].length !== canvasWidth || pixelData.length !== canvasHeight) {
        canvasWidth = pixelData[0].length;
        canvasHeight = pixelData.length;
        document.getElementById('canvasWidth').value = canvasWidth;
        document.getElementById('canvasHeight').value = canvasHeight;
        createPixelGrid(canvasWidth, canvasHeight);
    } else {
        renderPixelCanvas();
    }
    updateSpriteSelector();
}

// =====================
// PIXEL DRAWING LOGIC
// =====================

function drawPixel(x, y) {
    if (x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) return;

    const paintColor = currentTool === 'eraser' ? 'transparent' : currentColor;

    if (currentTool.includes('symmetric')) {
        getSymmetricPoints(x, y).forEach(p => setPixel(p.x, p.y, paintColor));
    } else {
        setPixel(x, y, paintColor);
    }
}

function drawLine(x0, y0, x1, y1, color) {
    // Bresenham's line algorithm
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
        if (currentTool.includes('symmetric')) {
            getSymmetricPoints(x0, y0).forEach(p => setPixel(p.x, p.y, color));
        } else {
            setPixel(x0, y0, color);
        }

        if (x0 === x1 && y0 === y1) break;
        let e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
    }
}

function drawShapePreview(x0, y0, x1, y1, type) {
    if (!previewCtx) return;
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewCtx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    previewCtx.lineWidth = 1;
    previewCtx.setLineDash([2, 2]);

    const cellScale = cellSize;

    if (type === 'rect') {
        const x = Math.min(x0, x1) * cellScale;
        const y = Math.min(y0, y1) * cellScale;
        const w = Math.abs(x1 - x0) * cellScale + cellScale;
        const h = Math.abs(y1 - y0) * cellScale + cellScale;
        previewCtx.strokeRect(x, y, w, h);
    } else if (type === 'circle') {
        const cx = (x0 + x1 + 1) / 2 * cellScale;
        const cy = (y0 + y1 + 1) / 2 * cellScale;
        const radiusX = Math.abs(x1 - x0) / 2 * cellScale + cellScale / 2;
        const radiusY = Math.abs(y1 - y0) / 2 * cellScale + cellScale / 2;
        previewCtx.beginPath();
        previewCtx.ellipse(cx, cy, radiusX, radiusY, 0, 0, 2 * Math.PI);
        previewCtx.stroke();
    } else if (type === 'line') {
        previewCtx.beginPath();
        previewCtx.moveTo(x0 * cellScale + cellScale / 2, y0 * cellScale + cellScale / 2);
        previewCtx.lineTo(x1 * cellScale + cellScale / 2, y1 * cellScale + cellScale / 2);
        previewCtx.stroke();
    }
}

function drawFinalShape(x0, y0, x1, y1, tool) {
    savePixelState();
    const color = currentColor;
    const isFilled = !tool.endsWith('Outline');

    if (tool.includes('rect')) {
        drawRect(x0, y0, x1, y1, color, isFilled);
    } else if (tool.includes('circle')) {
        // Approximate circle drawing based on bounding box
        const xMin = Math.min(x0, x1);
        const xMax = Math.max(x0, x1);
        const yMin = Math.min(y0, y1);
        const yMax = Math.max(y0, y1);
        const centerX = (xMin + xMax) / 2;
        const centerY = (yMin + yMax) / 2;
        const radiusX = (xMax - xMin) / 2;
        const radiusY = (yMax - yMin) / 2;

        for (let y = yMin; y <= yMax; y++) {
            for (let x = xMin; x <= xMax; x++) {
                const nx = (x - centerX) / radiusX;
                const ny = (y - centerY) / radiusY;
                const dist = nx * nx + ny * ny;

                if (isFilled) {
                    if (dist <= 1.0) setPixel(x, y, color);
                } else {
                    if (dist > 0.8 && dist <= 1.0) setPixel(x, y, color);
                }
            }
        }
    } else if (tool.includes('line')) {
        drawLine(x0, y0, x1, y1, color);
    }
    renderPixelCanvas();
    if (previewCtx) previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
}

// Flood Fill Algorithm
function floodFill(startX, startY, newColor) {
    if (startX < 0 || startY < 0 || startX >= canvasWidth || startY >= canvasHeight) return;
    savePixelState();
    const startColor = pixelData[startY][startX];
    if (startColor === newColor) return;

    const stack = [[startX, startY]];
    const pointsToFill = [];

    while (stack.length > 0) {
        const [x, y] = stack.pop();

        if (x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) continue;
        if (pixelData[y][x] !== startColor) continue;

        // Perform fill and check neighbors
        pointsToFill.push({ x, y });

        // Add neighbors to stack
        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    pointsToFill.forEach(({ x, y }) => {
        if (currentTool.includes('symmetric')) {
            getSymmetricPoints(x, y).forEach(p => setPixel(p.x, p.y, newColor));
        } else {
            setPixel(x, y, newColor);
        }
    });

    renderPixelCanvas();
}

function getSymmetricPoints(x, y) {
    const points = [{ x, y }];

    if (symmetryMode === 'vertical' || symmetryMode === 'both') {
        points.push({ x: canvasWidth - 1 - x, y });
    }

    if (symmetryMode === 'horizontal' || symmetryMode === 'both') {
        points.push({ x, y: canvasHeight - 1 - y });
    }

    if (symmetryMode === 'both') {
        points.push({ x: canvasWidth - 1 - x, y: canvasHeight - 1 - y });
    }

    // Filter duplicates
    return points.filter((v, i, a) => a.findIndex(t => t.x === v.x && t.y === v.y) === i);
}

// =====================
// PIXEL EVENT HANDLERS
// =====================

function onPixelCanvasMouseDown(e) {
    if (currentMode !== 'pixel') return;
    isPainting = true;
    const { x, y } = getCellFromEvent(e);
    startX = x;
    startY = y;
    shapeStart = { x, y };
    lastMousePos = { x, y };

    if (currentTool === 'pencil' || currentTool === 'eraser' || currentTool.includes('symmetric')) {
        savePixelState();
        drawPixel(x, y);
    } else if (currentTool === 'fill' || currentTool.includes('symmetricFill')) {
        savePixelState();
        const paintColor = currentTool === 'eraser' ? 'transparent' : currentColor;
        floodFill(x, y, paintColor);
        isPainting = false; // Stop painting immediately after fill
    } else if (currentTool === 'eyedropper') {
        const color = pixelData[y][x] || 'transparent';
        if (color === 'transparent') {
            alert('Eyedropper picked transparent.');
        } else {
            primaryColor = color;
            currentColor = color;
            primarySwatch.style.backgroundColor = primaryColor;
            // Find in palette or switch to custom
            let foundIndex = activePalette.indexOf(color);
            if (foundIndex !== -1) {
                selectedColorIndex = foundIndex;
                renderPalette();
            } else {
                // If color not in current palette, switch to custom and add it
                setPaletteByName('custom');
                customPalette.push(color);
                selectedColorIndex = customPalette.length - 1;
                renderPalette();
            }
        }
        updateToolActiveState('pencil'); // Switch back to pencil
        isPainting = false;
    } else if (currentTool === 'line' || currentTool === 'rect' || currentTool === 'circle') {
        drawingShape = true;
    }
}

function onPixelCanvasMouseMove(e) {
    if (currentMode !== 'pixel') return;
    const { x, y } = getCellFromEvent(e);
    
    // Update live coordinates in info panel (can be improved)
    // console.log(`Current: ${x}, ${y}`);

    if (isPainting && (currentTool === 'pencil' || currentTool === 'eraser' || currentTool.includes('symmetricPencil') || currentTool.includes('symmetricEraser'))) {
        drawLine(lastMousePos.x, lastMousePos.y, x, y, currentTool === 'eraser' ? 'transparent' : currentColor);
        lastMousePos = { x, y };
    } else if (drawingShape) {
        if (currentTool === 'line') drawShapePreview(shapeStart.x, shapeStart.y, x, y, 'line');
        else if (currentTool === 'rect') drawShapePreview(shapeStart.x, shapeStart.y, x, y, 'rect');
        else if (currentTool === 'circle') drawShapePreview(shapeStart.x, shapeStart.y, x, y, 'circle');
    }
}

function onPixelCanvasMouseUp(e) {
    if (currentMode !== 'pixel') return;
    isPainting = false;

    if (drawingShape) {
        drawingShape = false;
        const { x, y } = getCellFromEvent(e);
        drawFinalShape(shapeStart.x, shapeStart.y, x, y, currentTool);
        if (previewCtx) previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    }
}

function onPixelCanvasMouseLeave() {
    isPainting = false;
    if (drawingShape && previewCtx) {
        // Cancel shape drawing and clear preview if mouse leaves canvas
        drawingShape = false;
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    }
}

// =====================
// SPRITE MANAGEMENT (PIXEL MODE)
// =====================

function updateSpriteSelector() {
    spriteSelector.innerHTML = '';
    sprites.forEach((sprite, index) => {
        const option = new Option(sprite.name, index);
        if (index === activeSpriteIndex) option.selected = true;
        spriteSelector.add(option);
    });
}

function addSprite() {
    savePixelState(); // Save current work before switching/adding
    const newIndex = sprites.length;
    const newSprite = {
        name: `Frame ${newIndex + 1}`,
        data: initializePixelData(canvasWidth, canvasHeight)
    };
    sprites.push(newSprite);
    activeSpriteIndex = newIndex;
    updateSpriteSelector();
    renderPixelCanvas();
    savePixelState();
}

function duplicateSprite() {
    savePixelState(); // Save current work
    const currentData = sprites[activeSpriteIndex].data.map(row => [...row]);
    const newIndex = activeSpriteIndex + 1;
    const newSprite = {
        name: `${sprites[activeSpriteIndex].name} Copy`,
        data: currentData
    };
    sprites.splice(newIndex, 0, newSprite);
    activeSpriteIndex = newIndex;
    updateSpriteSelector();
    renderPixelCanvas();
    savePixelState();
}

function deleteSprite() {
    if (sprites.length <= 1) {
        alert("Cannot delete the last remaining sprite/frame.");
        return;
    }
    savePixelState(); // Save current state before deletion
    sprites.splice(activeSpriteIndex, 1);
    if (activeSpriteIndex >= sprites.length) {
        activeSpriteIndex = sprites.length - 1;
    }
    updateSpriteSelector();
    renderPixelCanvas();
    savePixelState();
}

function switchSprite(index) {
    index = parseInt(index);
    if (index === activeSpriteIndex) return;
    savePixelState(); // Save work on old frame
    activeSpriteIndex = index;
    renderPixelCanvas(); // Load new frame
}

// =====================
// TRANSFORMATION (PIXEL MODE)
// =====================

function transformSprite(transformType) {
    savePixelState();
    let oldData = sprites[activeSpriteIndex].data;
    let newWidth = canvasWidth;
    let newHeight = canvasHeight;
    let newData;

    if (transformType === 'rotateLeft' || transformType === 'rotateRight') {
        newWidth = canvasHeight;
        newHeight = canvasWidth;
        newData = initializePixelData(newWidth, newHeight);

        for (let y = 0; y < canvasHeight; y++) {
            for (let x = 0; x < canvasWidth; x++) {
                let newX, newY;
                if (transformType === 'rotateLeft') {
                    newX = y;
                    newY = canvasWidth - 1 - x;
                } else { // rotateRight
                    newX = canvasHeight - 1 - y;
                    newY = x;
                }
                newData[newY][newX] = oldData[y][x];
            }
        }
    } else if (transformType === 'rotate180') {
        newData = initializePixelData(canvasWidth, canvasHeight);
        for (let y = 0; y < canvasHeight; y++) {
            for (let x = 0; x < canvasWidth; x++) {
                newData[canvasHeight - 1 - y][canvasWidth - 1 - x] = oldData[y][x];
            }
        }
    } else if (transformType === 'flipHorizontal') {
        newData = oldData.map(row => [...row].reverse());
    } else if (transformType === 'flipVertical') {
        newData = [...oldData].reverse();
    } else {
        return;
    }

    // Apply new data and resize if needed
    sprites[activeSpriteIndex].data = newData;
    canvasWidth = newWidth;
    canvasHeight = newHeight;
    document.getElementById('canvasWidth').value = canvasWidth;
    document.getElementById('canvasHeight').value = canvasHeight;
    createPixelGrid(canvasWidth, canvasHeight);
    renderPixelCanvas();
    savePixelState();
}

// Canvas Resize
function resizePixelCanvas() {
    const newWidth = parseInt(document.getElementById('canvasWidth').value);
    const newHeight = parseInt(document.getElementById('canvasHeight').value);

    if (isNaN(newWidth) || isNaN(newHeight) || newWidth < 1 || newHeight < 1) {
        alert("Invalid canvas size.");
        return;
    }

    savePixelState();

    const oldData = sprites[activeSpriteIndex].data;
    const newPixelData = initializePixelData(newWidth, newHeight);

    // Copy old pixels to the new grid
    for (let y = 0; y < Math.min(canvasHeight, newHeight); y++) {
        for (let x = 0; x < Math.min(canvasWidth, newWidth); x++) {
            newPixelData[y][x] = oldData[y][x];
        }
    }

    canvasWidth = newWidth;
    canvasHeight = newHeight;
    sprites.forEach(sprite => {
        // Apply resize to all frames
        const newFrameData = initializePixelData(newWidth, newHeight);
        for (let y = 0; y < Math.min(sprite.data.length, newHeight); y++) {
            for (let x = 0; x < Math.min(sprite.data[0].length, newWidth); x++) {
                newFrameData[y][x] = sprite.data[y][x];
            }
        }
        sprite.data = newFrameData;
    });

    pixelData = newPixelData;
    createPixelGrid(canvasWidth, canvasHeight);
    renderPixelCanvas();
    savePixelState();
}

// =====================
// CANVAS MANAGEMENT (SKETCH)
// =====================

function drawSketchLayer() {
    // Clear the main sketch canvas
    sketchCtx.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);

    // Draw all visible layers
    sketchLayers.forEach(layer => {
        if (layer.visible) {
            sketchCtx.globalAlpha = layer.opacity;
            sketchCtx.globalCompositeOperation = layer.blendMode;
            sketchCtx.drawImage(layer.canvas, 0, 0);
        }
    });

    // Reset context
    sketchCtx.globalAlpha = 1;
    sketchCtx.globalCompositeOperation = 'source-over';
}

function updateSketchCanvasTransform() {
    if (!sketchCanvas) return;
    sketchCanvas.style.transform = `scale(${zoomLevel})`;
    selectionOverlay.style.transform = `scale(${zoomLevel})`;

    const container = document.querySelector('.canvas-area');
    if (container) {
        const containerRect = container.getBoundingClientRect();
        const canvasWidthPx = sketchCanvas.width * zoomLevel;
        const canvasHeightPx = sketchCanvas.height * zoomLevel;
        const marginLeft = Math.max(0, (containerRect.width - canvasWidthPx) / 2);
        const marginTop = Math.max(0, (containerRect.height - canvasHeightPx) / 2);
        sketchCanvas.style.marginLeft = `${marginLeft}px`;
        sketchCanvas.style.marginTop = `${marginTop}px`;
        selectionOverlay.style.marginLeft = `${marginLeft}px`;
        selectionOverlay.style.marginTop = `${marginTop}px`;
        
        selectionOverlay.width = sketchCanvas.width;
        selectionOverlay.height = sketchCanvas.height;
    }
}

function saveSketchState() {
    const snapshot = sketchLayers.map(layer => ({
        id: layer.id,
        name: layer.name,
        opacity: layer.opacity,
        blendMode: layer.blendMode,
        visible: layer.visible,
        dataURL: layer.canvas.toDataURL()
    }));
    sketchUndoStack.push(snapshot);
    sketchRedoStack = [];
    if (sketchUndoStack.length > 50) sketchUndoStack.shift();
}

function restoreSketchState(stackFrom, stackTo) {
    if (stackFrom.length === 0) return;
    
    // Create current state for redo stack
    const currentSnapshot = sketchLayers.map(layer => ({
        id: layer.id,
        name: layer.name,
        opacity: layer.opacity,
        blendMode: layer.blendMode,
        visible: layer.visible,
        dataURL: layer.canvas.toDataURL()
    }));
    stackTo.push(currentSnapshot);

    const snapshot = stackFrom.pop();
    
    sketchLayers = snapshot.map(layerSnapshot => {
        const layer = sketchLayers.find(l => l.id === layerSnapshot.id) || { canvas: createCanvasElement(sketchCanvas.width, sketchCanvas.height) };
        layer.name = layerSnapshot.name;
        layer.opacity = layerSnapshot.opacity;
        layer.blendMode = layerSnapshot.blendMode;
        layer.visible = layerSnapshot.visible;
        
        const img = new Image();
        img.onload = () => {
            const ctx = layer.canvas.getContext('2d');
            ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
            ctx.drawImage(img, 0, 0);
            drawSketchLayer();
        };
        img.src = layerSnapshot.dataURL;
        return layer;
    });
    
    // Ensure active layer is still valid
    activeLayerIndex = Math.min(activeLayerIndex, sketchLayers.length - 1);
    renderLayerList();
    drawSketchLayer();
}

// =====================
// SKETCH DRAWING LOGIC
// =====================

function getSketchCoordinates(e) {
    const rect = sketchCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoomLevel;
    const y = (e.clientY - rect.top) / zoomLevel;
    return { x, y };
}

function getBrushTexture(tool) {
    // This is a placeholder. Real implementation requires image textures or complex algorithms.
    switch (tool) {
        case 'pen':
            return {
                globalCompositeOperation: 'source-over',
                lineCap: 'butt',
                lineJoin: 'miter',
                shadowBlur: 0,
                shadowColor: 'transparent',
                alphaMultiplier: 1.0,
            };
        case 'pencilSketch':
            return {
                globalCompositeOperation: 'source-over',
                lineCap: 'round',
                lineJoin: 'round',
                shadowBlur: brushSize * (1 - brushHardness / 100) * 0.5,
                shadowColor: brushColor,
                alphaMultiplier: 0.2 + 0.8 * (brushFlow / 100), // Simulate low flow/texture
            };
        case 'charcoal':
            return {
                globalCompositeOperation: 'source-over',
                lineCap: 'square',
                lineJoin: 'bevel',
                shadowBlur: brushSize * 0.2,
                shadowColor: brushColor,
                alphaMultiplier: 0.1 + 0.9 * (brushFlow / 100), // Very textured/low flow
            };
        case 'marker':
            return {
                globalCompositeOperation: 'multiply',
                lineCap: 'square',
                lineJoin: 'bevel',
                shadowBlur: 0,
                shadowColor: 'transparent',
                alphaMultiplier: 0.5, // Semi-transparent effect
            };
        case 'eraser':
            return {
                globalCompositeOperation: 'destination-out',
                lineCap: 'round',
                lineJoin: 'round',
                shadowBlur: brushSize * (1 - brushHardness / 100) * 0.5,
                shadowColor: 'transparent',
                alphaMultiplier: 1.0,
            };
        // Default (Brush/Smudge/Blur)
        default:
            return {
                globalCompositeOperation: 'source-over',
                lineCap: 'round',
                lineJoin: 'round',
                shadowBlur: brushSize * (1 - brushHardness / 100),
                shadowColor: brushColor,
                alphaMultiplier: 1.0,
            };
    }
}

function applyBrushSettings(ctx, tool) {
    const settings = getBrushTexture(tool);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = settings.lineCap;
    ctx.lineJoin = settings.lineJoin;
    ctx.shadowBlur = settings.shadowBlur;
    ctx.shadowColor = settings.shadowColor;
    ctx.globalAlpha = (brushOpacity / 100) * settings.alphaMultiplier;
    ctx.globalCompositeOperation = settings.globalCompositeOperation;
}

function drawSketch(e) {
    if (!sketchPainting) return;
    const { x, y } = getSketchCoordinates(e);
    const activeLayer = sketchLayers[activeLayerIndex];
    const ctx = activeLayer.canvas.getContext('2d');

    applyBrushSettings(ctx, currentTool);

    // Flow simulation for textured tools (e.g., pencil)
    if (currentTool === 'pencilSketch' || currentTool === 'charcoal' || currentTool === 'sprayPaint') {
        const flowStep = 1 + (100 - brushFlow) / 100 * 5; // Higher step for lower flow
        for (let i = 0; i < 5; i++) {
            const offsetX = (Math.random() - 0.5) * brushSize * (1 - brushHardness / 100) * 0.5;
            const offsetY = (Math.random() - 0.5) * brushSize * (1 - brushHardness / 100) * 0.5;
            const drawX = lastMousePos.x + (x - lastMousePos.x) * (i / 5);
            const drawY = lastMousePos.y + (y - lastMousePos.y) * (i / 5);

            if (currentTool === 'sprayPaint') {
                for(let j = 0; j < 10; j++) {
                    const sprayRadius = brushSize * 0.5;
                    const angle = Math.random() * 2 * Math.PI;
                    const radius = Math.random() * sprayRadius;
                    ctx.fillStyle = ctx.strokeStyle;
                    ctx.beginPath();
                    ctx.arc(drawX + radius * Math.cos(angle), drawY + radius * Math.sin(angle), 0.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else {
                // Other textured tools use smaller point draws
                ctx.beginPath();
                ctx.arc(drawX + offsetX, drawY + offsetY, 0.5, 0, Math.PI * 2);
                ctx.fillStyle = ctx.strokeStyle;
                ctx.fill();
            }
        }
    } else {
        // Standard continuous line drawing
        ctx.beginPath();
        ctx.moveTo(lastMousePos.x, lastMousePos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    lastMousePos = { x, y };
    drawSketchLayer(); // Redraw combined image
}

// =====================
// SKETCH LAYERS
// =====================

function renderLayerList() {
    const list = document.getElementById('layerList');
    if (!list) return;

    list.innerHTML = '';
    sketchLayers.slice().reverse().forEach((layer, index) => { // Reverse for display order
        const actualIndex = sketchLayers.length - 1 - index;
        const div = document.createElement('div');
        div.classList.add('layer-item');
        if (actualIndex === activeLayerIndex) div.classList.add('active');

        div.innerHTML = `
            <input type="checkbox" ${layer.visible ? 'checked' : ''} class="layer-visible-toggle" data-index="${actualIndex}">
            <span contenteditable="true" data-index="${actualIndex}" class="layer-name">${layer.name}</span>
            <button class="btn btn-sm delete-layer-btn" data-index="${actualIndex}">🗑️</button>
        `;
        div.addEventListener('click', () => {
            activeLayerIndex = actualIndex;
            renderLayerList();
            // Update controls for active layer
            document.getElementById('layerOpacity').value = layer.opacity * 100;
            document.getElementById('layerOpacityLabel').textContent = Math.round(layer.opacity * 100);
            document.getElementById('blendMode').value = layer.blendMode;
        });
        list.appendChild(div);
    });
}

function addLayer() {
    saveSketchState();
    const newId = sketchLayers.reduce((max, l) => Math.max(max, l.id), -1) + 1;
    const newLayer = {
        id: newId,
        name: `Layer ${newId}`,
        opacity: 1,
        blendMode: 'source-over',
        visible: true,
        canvas: createCanvasElement(sketchCanvas.width, sketchCanvas.height)
    };
    sketchLayers.push(newLayer);
    activeLayerIndex = sketchLayers.length - 1;
    renderLayerList();
    saveSketchState();
}

// =====================
// IMPORT/EXPORT (I/O)
// =====================

function exportProjectJSON() {
    const projectData = {
        mode: currentMode,
        timestamp: new Date().toISOString(),
        pixel: {
            width: canvasWidth,
            height: canvasHeight,
            sprites: sprites.map(s => ({
                name: s.name,
                data: s.data
            })),
            activeSpriteIndex: activeSpriteIndex
        },
        sketch: {
            width: sketchCanvas.width,
            height: sketchCanvas.height,
            layers: sketchLayers.map(l => ({
                id: l.id,
                name: l.name,
                opacity: l.opacity,
                blendMode: l.blendMode,
                visible: l.visible,
                dataURL: l.canvas.toDataURL()
            })),
            activeLayerIndex: activeLayerIndex
        },
        palettes: {
            user: userPalettes
        }
    };
    const json = JSON.stringify(projectData, null, 2);
    document.getElementById('output').value = json;
    downloadFile('jerry_editor_project.json', json, 'application/json');
}

function importProjectJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            loadProjectData(data);
            alert("Project loaded successfully!");
        } catch (error) {
            alert("Error loading project: Invalid JSON file.");
            console.error(error);
        }
    };
    reader.readAsText(file);
}

function loadProjectData(data) {
    // 1. Load Palettes
    if (data.palettes && data.palettes.user) {
        userPalettes = data.palettes.user;
        saveUserPalettes();
        setupPalettes();
    }

    // 2. Load Global Mode/State
    currentMode = data.mode || 'pixel';
    switchMode(currentMode);

    if (currentMode === 'pixel' && data.pixel) {
        // 3. Load Pixel State
        canvasWidth = data.pixel.width;
        canvasHeight = data.pixel.height;
        sprites = data.pixel.sprites.map(s => ({
            name: s.name,
            data: s.data
        }));
        activeSpriteIndex = data.pixel.activeSpriteIndex || 0;
        
        document.getElementById('canvasWidth').value = canvasWidth;
        document.getElementById('canvasHeight').value = canvasHeight;
        
        createPixelGrid(canvasWidth, canvasHeight);
        renderPixelCanvas();
        updateSpriteSelector();
    } else if (currentMode === 'sketch' && data.sketch) {
        // 4. Load Sketch State
        const w = data.sketch.width;
        const h = data.sketch.height;
        sketchCanvas.width = w;
        sketchCanvas.height = h;
        
        sketchLayers = data.sketch.layers.map(l => {
            const canvas = createCanvasElement(w, h);
            const img = new Image();
            img.src = l.dataURL;
            img.onload = () => {
                canvas.getContext('2d').drawImage(img, 0, 0);
                drawSketchLayer();
            };
            return {
                ...l,
                canvas: canvas
            };
        });
        activeLayerIndex = data.sketch.activeLayerIndex || 0;
        renderLayerList();
        updateSketchCanvasTransform();
    }

    // Clear history on import
    pixelUndoStack = [];
    pixelRedoStack = [];
    sketchUndoStack = [];
    sketchRedoStack = [];
}


function exportPNG() {
    let finalCanvas;
    let filename = `jerry_editor_export_${Date.now()}.png`;

    if (currentMode === 'pixel') {
        // Create an off-screen canvas to render the pixel data without zoom/grid
        finalCanvas = createCanvasElement(canvasWidth, canvasHeight);
        const ctx = finalCanvas.getContext('2d');

        for (let y = 0; y < canvasHeight; y++) {
            for (let x = 0; x < canvasWidth; x++) {
                ctx.fillStyle = pixelData[y][x];
                ctx.fillRect(x, y, 1, 1);
            }
        }
    } else {
        // For sketch, the main canvas already holds the composite image
        finalCanvas = sketchCanvas;
    }

    finalCanvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 'image/png');
}

function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// =====================
// MODE SWITCHING
// =====================

function switchMode(mode) {
    currentMode = mode;

    // Toggle button active state
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.mode-btn[data-mode="${mode}"]`)?.classList.add('active');

    // Toggle toolbars and panels
    document.querySelector('.pixel-tools').style.display = mode === 'pixel' ? 'flex' : 'none';
    document.querySelector('.sketch-tools').style.display = mode === 'sketch' ? 'flex' : 'none';
    document.querySelectorAll('.sketch-controls').forEach(el => el.style.display = mode === 'sketch' ? 'block' : 'none');
    document.querySelectorAll('.pixel-controls').forEach(el => el.style.display = mode === 'pixel' ? 'block' : 'none');

    // Toggle canvas visibility
    pixelCanvas.style.display = mode === 'pixel' ? 'grid' : 'none';
    sketchCanvas.style.display = mode === 'sketch' ? 'block' : 'none';
    canvasGrid.style.display = mode === 'pixel' && showGrid ? 'block' : 'none'; // Grid only for pixel

    // Set initial active tool/palette for the new mode
    if (mode === 'pixel') {
        updateToolActiveState('pencil');
        setPaletteByName(currentPaletteName);
        renderPixelCanvas();
        updatePixelCanvasTransform();
    } else { // sketch mode
        updateToolActiveState('brush');
        // Sketch color/palette logic can be added here
        document.getElementById('sketchColor').value = brushColor;
        document.getElementById('sketchColor').dispatchEvent(new Event('input')); // Force UI update
        updateSketchCanvasTransform();
        drawSketchLayer();
    }
    updateCanvasInfo();
}

// =====================
// INITIALIZATION & EVENT LISTENERS
// =====================

function initialize() {
    // Set initial size
    pixelData = sprites[activeSpriteIndex].data;
    canvasWidth = pixelData[0].length;
    canvasHeight = pixelData.length;
    document.getElementById('canvasWidth').value = canvasWidth;
    document.getElementById('canvasHeight').value = canvasHeight;
    sketchCanvas.width = SKETCH_CANVAS_WIDTH;
    sketchCanvas.height = SKETCH_CANVAS_HEIGHT;
    selectionOverlay.width = SKETCH_CANVAS_WIDTH;
    selectionOverlay.height = SKETCH_CANVAS_HEIGHT;

    // Initial setups
    setupPalettes();
    createPixelGrid(canvasWidth, canvasHeight);
    updateSpriteSelector();
    renderLayerList();
    drawSketchLayer();
    
    // Initial save for undo history
    savePixelState();
    saveSketchState();

    // --- Mode Switching ---
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => switchMode(btn.dataset.mode));
    });

    // --- Tool Selection ---
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => updateToolActiveState(btn.dataset.tool));
    });

    // --- Pixel Canvas Events (Real-time drawing) ---
    pixelCanvas.addEventListener('mousedown', onPixelCanvasMouseDown);
    window.addEventListener('mousemove', onPixelCanvasMouseMove);
    window.addEventListener('mouseup', onPixelCanvasMouseUp);
    pixelCanvas.addEventListener('mouseleave', onPixelCanvasMouseLeave);

    // --- Palette/Color Events ---
    paletteSelector.addEventListener('change', (e) => setPaletteByName(e.target.value));
    primarySwatch.addEventListener('click', () => {
        [primaryColor, secondaryColor] = [secondaryColor, primaryColor];
        primarySwatch.style.backgroundColor = primaryColor;
        secondarySwatch.style.backgroundColor = secondaryColor;
        currentColor = primaryColor;
        updateCanvasInfo();
    });
    secondarySwatch.addEventListener('click', () => {
        [primaryColor, secondaryColor] = [secondaryColor, primaryColor];
        primarySwatch.style.backgroundColor = primaryColor;
        secondarySwatch.style.backgroundColor = secondaryColor;
        currentColor = primaryColor;
        updateCanvasInfo();
    });
    document.getElementById('saveCustomPalette').addEventListener('click', () => {
        const name = prompt("Enter a name for your custom palette:");
        if (name) {
            addUserPalette(name, currentPaletteName === 'custom' ? [...customPalette] : [...activePalette]);
            setupPalettes(); // Re-render selector with new palette
            setPaletteByName(`user-${name}`);
        }
    });

    // --- Canvas/Zoom/Grid Controls ---
    document.getElementById('resizeCanvas').addEventListener('click', resizePixelCanvas);
    document.getElementById('gridToggle').addEventListener('change', (e) => {
        showGrid = e.target.checked;
        if (currentMode === 'pixel') updateGridDisplay();
    });
    document.getElementById('zoomIn').addEventListener('click', () => {
        zoomLevel = Math.min(zoomLevel * 1.25, 10);
        document.getElementById('zoomIndicator').textContent = `${Math.round(zoomLevel * 100)}%`;
        if (currentMode === 'pixel') updatePixelCanvasTransform();
        else updateSketchCanvasTransform();
    });
    document.getElementById('zoomOut').addEventListener('click', () => {
        zoomLevel = Math.max(zoomLevel / 1.25, 0.25);
        document.getElementById('zoomIndicator').textContent = `${Math.round(zoomLevel * 100)}%`;
        if (currentMode === 'pixel') updatePixelCanvasTransform();
        else updateSketchCanvasTransform();
    });
    document.getElementById('zoomReset').addEventListener('click', () => {
        zoomLevel = 1;
        document.getElementById('zoomIndicator').textContent = `100%`;
        if (currentMode === 'pixel') updatePixelCanvasTransform();
        else updateSketchCanvasTransform();
    });

    // --- Undo/Redo ---
    document.getElementById('undo').addEventListener('click', () => {
        if (currentMode === 'pixel') restorePixelState(pixelUndoStack, pixelRedoStack);
        else restoreSketchState(sketchUndoStack, sketchRedoStack);
    });
    document.getElementById('redo').addEventListener('click', () => {
        if (currentMode === 'pixel') restorePixelState(pixelRedoStack, pixelUndoStack);
        else restoreSketchState(sketchRedoStack, sketchUndoStack);
    });
    document.getElementById('clear').addEventListener('click', () => {
        if (currentMode === 'pixel') {
            savePixelState();
            sprites[activeSpriteIndex].data = initializePixelData(canvasWidth, canvasHeight);
            renderPixelCanvas();
        } else {
            saveSketchState();
            sketchLayers.forEach(l => l.canvas.getContext('2d').clearRect(0, 0, l.canvas.width, l.canvas.height));
            drawSketchLayer();
        }
    });

    // --- Sprite Controls ---
    spriteSelector.addEventListener('change', (e) => switchSprite(e.target.value));
    document.getElementById('newSprite').addEventListener('click', addSprite);
    document.getElementById('duplicateSprite').addEventListener('click', duplicateSprite);
    document.getElementById('deleteSprite').addEventListener('click', deleteSprite);

    // --- Transform Controls ---
    document.getElementById('rotateLeft').addEventListener('click', () => transformSprite('rotateLeft'));
    document.getElementById('rotate180').addEventListener('click', () => transformSprite('rotate180'));
    document.getElementById('rotateRight').addEventListener('click', () => transformSprite('rotateRight'));
    document.getElementById('flipHorizontal').addEventListener('click', () => transformSprite('flipHorizontal'));
    document.getElementById('flipVertical').addEventListener('click', () => transformSprite('flipVertical'));

    // --- Symmetry Controls ---
    document.querySelectorAll('.symmetry-btn').forEach(btn => {
        btn.addEventListener('click', () => updateSymmetryActiveState(btn.dataset.symmetry));
    });

    // --- I/O Controls ---
    document.getElementById('exportJSON').addEventListener('click', exportProjectJSON);
    document.getElementById('exportPNG').addEventListener('click', exportPNG);
    document.getElementById('exportPNG2').addEventListener('click', exportPNG); // Same function
    document.getElementById('importFile').addEventListener('change', importProjectJSON);

    // --- Sketch Brush Controls ---
    document.getElementById('sketchCanvas').addEventListener('mousedown', (e) => {
        if (currentMode !== 'sketch' || currentTool === 'smudge' || currentTool === 'blur') return; // Smudge/Blur are complex and disabled for this simplified context
        saveSketchState();
        sketchPainting = true;
        lastMousePos = getSketchCoordinates(e);
        drawSketch(e);
    });
    document.getElementById('sketchCanvas').addEventListener('mousemove', drawSketch);
    window.addEventListener('mouseup', () => { sketchPainting = false; });

    document.getElementById('sketchColor').addEventListener('input', (e) => {
        brushColor = e.target.value;
        updateCanvasInfo();
    });
    
    const updateRangeLabel = (id, labelId, suffix = '') => {
        document.getElementById(id).addEventListener('input', (e) => {
            const value = e.target.value;
            document.getElementById(labelId).textContent = value;
            if (id === 'brushSize') brushSize = parseInt(value);
            if (id === 'brushOpacity') brushOpacity = parseInt(value);
            if (id === 'brushHardness') brushHardness = parseInt(value);
            if (id === 'brushFlow') brushFlow = parseInt(value);
            // Re-render preview based on new settings (Advanced feature, simplified here)
        });
    };
    updateRangeLabel('brushSize', 'brushSizeLabel', 'px');
    updateRangeLabel('brushOpacity', 'opacityLabel', '%');
    updateRangeLabel('brushHardness', 'hardnessLabel', '%');
    updateRangeLabel('brushFlow', 'flowLabel', '%');
    
    // --- Sketch Layer Controls ---
    document.getElementById('addLayer').addEventListener('click', addLayer);
    document.getElementById('layerList').addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('delete-layer-btn')) {
            const index = parseInt(target.dataset.index);
            if (sketchLayers.length > 1) {
                saveSketchState();
                sketchLayers.splice(index, 1);
                if (activeLayerIndex >= sketchLayers.length) activeLayerIndex = sketchLayers.length - 1;
                renderLayerList();
                drawSketchLayer();
                saveSketchState();
            } else {
                alert("Cannot delete the last remaining layer.");
            }
        }
        if (target.classList.contains('layer-visible-toggle')) {
            const index = parseInt(target.dataset.index);
            sketchLayers[index].visible = target.checked;
            drawSketchLayer();
        }
    });
    
    document.getElementById('layerOpacity').addEventListener('input', (e) => {
        const opacity = parseInt(e.target.value) / 100;
        document.getElementById('layerOpacityLabel').textContent = e.target.value;
        sketchLayers[activeLayerIndex].opacity = opacity;
        drawSketchLayer();
    });
    
    document.getElementById('blendMode').addEventListener('change', (e) => {
        sketchLayers[activeLayerIndex].blendMode = e.target.value;
        drawSketchLayer();
    });
    
    // Initial UI state and mode
    switchMode('pixel');
}

// Start the editor when the DOM is ready
document.addEventListener('DOMContentLoaded', initialize);

// PWA: Service Worker Registration (Simple check)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
