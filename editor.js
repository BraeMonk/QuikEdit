// =================================================================================================
// editor.js - Jerry Editor (Complete Functional Version)
// Implements: Pixel & Sketch Modes, Symmetry, Sprite/Layer Management, Palettes, I/O, PWA Storage
// =================================================================================================

// Theme check for palette defaults
const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;

// =====================
// PALETTE DATA
// =====================
const BUILT_IN_PALETTES = {
    default: isLightMode
        ? ['transparent', '#FFFFFF', '#C0C0C0', '#808080', '#404040', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#C0FF00', '#FFC000', '#8000FF', '#0080FF']
        : ['transparent', '#1a1a1a', '#333333', '#555555', '#777777', '#FFFFFF', '#FF3333', '#33FF33', '#3333FF', '#FFFF33', '#FF33FF', '#33FFFF', '#CCFF33', '#FFCC33', '#9933FF', '#3399FF'],
    pico8: ['transparent', '#000000', '#1D2B53', '#7E2553', '#008751', '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8', '#FF004D', '#FFA300', '#FFEC27', '#00E436', '#29ADFF', '#83769C', '#FF77A8'],
    gb: ['transparent', '#0f380f', '#306230', '#8bac0f', '#9bbc0f'],
    nes: ['transparent', '#000000', '#212121', '#4D4D4D', '#787878', '#A3A3A3', '#D3D3D3', '#FFFFFF', '#C75500', '#D32A00', '#AB002A', '#83004F', '#4F0078', '#002A83', '#0055C7', '#0083D3']
};

const DEFAULT_CUSTOM_PALETTE = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080'];
const CUSTOM_PALETTE_KEY = 'jerryEditorCustomPalette';

// =====================
// STATE MANAGEMENT
// =====================
const state = {
    mode: 'pixel', // 'pixel' or 'sketch'
    
    // Pixel Mode State
    pixel: {
        width: 16,
        height: 16,
        cellSize: 30,
        zoom: 100,
        sprites: [{ id: 1, data: new Array(16 * 16).fill('transparent') }],
        currentFrame: 0,
        primaryColor: '#000000',
        secondaryColor: '#ffffff',
        activeTool: 'pencil',
        symmetry: 'none',
        history: [],
        historyIndex: -1,
        selection: null,
        showGrid: true
    },
    
    // Sketch Mode State
    sketch: {
        width: 800,
        height: 600,
        layers: [],
        activeLayer: 0,
        color: '#000000',
        size: 10,
        opacity: 100,
        hardness: 100,
        flow: 100,
        activeTool: 'brush',
        history: [],
        historyIndex: -1,
        zoom: 100
    },
    
    // General State
    isDrawing: false,
    lastPos: { x: 0, y: 0 },
    toolStartPos: { x: 0, y: 0 },
    customPalette: JSON.parse(localStorage.getItem(CUSTOM_PALETTE_KEY)) || DEFAULT_CUSTOM_PALETTE,
    isShiftPressed: false,
    isCtrlPressed: false,
};

// =====================
// DOM ELEMENTS
// =====================
let elements = {};

// =====================
// INITIALIZATION
// =====================
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    initializeCanvases();
    initializeState();
    attachEventListeners();
    setMode('pixel');
    
    // PWA registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js').catch(err => 
            console.log('Service Worker registration failed:', err)
        );
    }
});

function initializeElements() {
    const ids = [
        'canvas', 'sketchCanvas', 'selectionOverlay', 'canvasGrid', 'canvasInfo', 'zoomIndicator',
        'primaryColor', 'secondaryColor', 'paletteSelector', 'swatches', 'colorPickers', 'saveCustomPalette',
        'brushSizeLabel', 'brushSize', 'brushOpacity', 'opacityLabel', 'brushHardness', 'hardnessLabel', 
        'brushFlow', 'flowLabel', 'brushPreview', 'sketchColor',
        'symmetryInfo', 'rotateLeft', 'rotate180', 'rotateRight', 'flipHorizontal', 'flipVertical',
        'canvasWidth', 'canvasHeight', 'resizeCanvas', 'zoomOut', 'zoomReset', 'zoomIn', 
        'undo', 'redo', 'clear', 'gridToggle',
        'spriteSelector', 'newSprite', 'duplicateSprite', 'deleteSprite',
        'layerList', 'layerOpacity', 'layerOpacityLabel', 'blendMode', 'addLayer',
        'exportJSON', 'exportPNG2', 'output', 'importFile', 'newProject', 'saveProject', 'exportPNG'
    ];
    
    ids.forEach(id => {
        elements[id] = document.getElementById(id);
    });
    
    // Create pixel drawing canvas
    elements.pixelCanvas = document.createElement('canvas');
    elements.pixelCanvas.style.imageRendering = 'pixelated';
    elements.canvas.appendChild(elements.pixelCanvas);
    
    elements.pixelCtx = elements.pixelCanvas.getContext('2d');
    elements.sketchCtx = elements.sketchCanvas.getContext('2d');
    elements.overlayCtx = elements.selectionOverlay.getContext('2d');
}

function initializeCanvases() {
    // Initialize pixel canvas
    updatePixelCanvasSize();
    renderPixelGrid();
    
    // Initialize sketch canvas
    elements.sketchCanvas.width = state.sketch.width;
    elements.sketchCanvas.height = state.sketch.height;
    elements.selectionOverlay.width = state.sketch.width;
    elements.selectionOverlay.height = state.sketch.height;
}

function initializeState() {
    // Initialize pixel sprites
    state.pixel.sprites = [{ 
        id: 1, 
        data: new Array(state.pixel.width * state.pixel.height).fill('transparent') 
    }];
    
    // Initialize sketch layers
    state.sketch.layers = [createSketchLayer('Layer 1')];
    
    // Setup palettes
    loadCustomPalette();
    populatePaletteSelector();
    renderPaletteSwatches();
    renderCustomPalette();
    
    // Update UI
    updateSpriteSelector();
    updateLayersList();
    updateCanvasInfo();
    updateToolControls();
    updateSketchControls();
    updateSymmetryDisplay();
    
    // Initial history snapshot
    pushHistory('Initial');
}

// =====================
// MODE MANAGEMENT
// =====================
function setMode(newMode) {
    if (state.mode === newMode) return;
    state.mode = newMode;

    // Update mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === newMode);
    });

    // Show/hide appropriate UI elements
    const pixelUI = document.querySelectorAll('.pixel-controls, .pixel-tools');
    const sketchUI = document.querySelectorAll('.sketch-controls, .sketch-tools');
    
    pixelUI.forEach(el => {
        el.style.display = newMode === 'pixel' ? 
            (el.classList.contains('pixel-tools') ? 'flex' : 'block') : 'none';
    });
    
    sketchUI.forEach(el => {
        el.style.display = newMode === 'sketch' ? 
            (el.classList.contains('sketch-tools') ? 'flex' : 'block') : 'none';
    });

    // Show/hide canvases
    elements.canvas.style.display = newMode === 'pixel' ? 'grid' : 'none';
    elements.sketchCanvas.style.display = newMode === 'sketch' ? 'block' : 'none';
    elements.selectionOverlay.style.display = newMode === 'sketch' ? 'block' : 'none';
    
    // Update grid visibility
    elements.canvasGrid.style.display = 
        (newMode === 'pixel' && state.pixel.showGrid) ? 'grid' : 'none';

    updateCanvasDisplay();
    updateCanvasInfo();
    updateToolControls();
}

// =====================
// PIXEL MODE FUNCTIONS
// =====================
function updatePixelCanvasSize() {
    const { width, height } = state.pixel;
    
    elements.pixelCanvas.width = width;
    elements.pixelCanvas.height = height;
    
    const displayWidth = width * state.pixel.cellSize;
    const displayHeight = height * state.pixel.cellSize;
    
    elements.canvas.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    elements.canvas.style.gridTemplateRows = `repeat(${height}, 1fr)`;
    elements.canvas.style.width = `${displayWidth}px`;
    elements.canvas.style.height = `${displayHeight}px`;
    
    elements.pixelCanvas.style.width = `${displayWidth}px`;
    elements.pixelCanvas.style.height = `${displayHeight}px`;
}

function renderPixelGrid() {
    const { width, height } = state.pixel;
    elements.canvasGrid.innerHTML = '';
    elements.canvasGrid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    elements.canvasGrid.style.gridTemplateRows = `repeat(${height}, 1fr)`;

    for (let i = 0; i < width * height; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        elements.canvasGrid.appendChild(cell);
    }
}

function drawPixelCanvas() {
    const { width, height, sprites, currentFrame } = state.pixel;
    const ctx = elements.pixelCtx;
    const spriteData = sprites[currentFrame].data;

    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = false;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = y * width + x;
            const color = spriteData[index];
            if (color && color !== 'transparent') {
                ctx.fillStyle = color;
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }
}

function getPixelCoords(e) {
    const rect = elements.canvas.getBoundingClientRect();
    const scaleX = state.pixel.width / rect.width;
    const scaleY = state.pixel.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    return { x, y };
}

function handlePixelDraw(x, y, isPrimary = true) {
    if (x < 0 || y < 0 || x >= state.pixel.width || y >= state.pixel.height) return;
    
    const { width, sprites, currentFrame, activeTool, primaryColor, secondaryColor } = state.pixel;
    const color = isPrimary ? primaryColor : secondaryColor;
    const spriteData = sprites[currentFrame].data;
    const index = y * width + x;
    
    let newColor;
    if (activeTool === 'eraser' || activeTool.includes('Eraser')) {
        newColor = 'transparent';
    } else if (activeTool === 'eyedropper') {
        const pickedColor = spriteData[index];
        if (pickedColor && pickedColor !== 'transparent') {
            if (isPrimary) {
                state.pixel.primaryColor = pickedColor;
                elements.primaryColor.style.background = pickedColor;
            } else {
                state.pixel.secondaryColor = pickedColor;
                elements.secondaryColor.style.background = pickedColor;
            }
            updateCanvasInfo();
        }
        return;
    } else {
        newColor = color;
    }

    if (spriteData[index] === newColor) return;
    spriteData[index] = newColor;

    // Apply symmetry for symmetric tools
    if (activeTool.includes('symmetric') || activeTool.includes('Symmetric')) {
        applySymmetry(x, y, newColor);
    }

    drawPixelCanvas();
}

function applySymmetry(x, y, color) {
    const { width, height, symmetry, sprites, currentFrame } = state.pixel;
    const spriteData = sprites[currentFrame].data;
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);

    if (symmetry === 'horizontal' || symmetry === 'both') {
        const mirrorX = width - 1 - x;
        if (mirrorX >= 0 && mirrorX < width) {
            const mirrorIndex = y * width + mirrorX;
            spriteData[mirrorIndex] = color;
        }
    }

    if (symmetry === 'vertical' || symmetry === 'both') {
        const mirrorY = height - 1 - y;
        if (mirrorY >= 0 && mirrorY < height) {
            const mirrorIndex = mirrorY * width + x;
            spriteData[mirrorIndex] = color;
        }
    }

    if (symmetry === 'both') {
        const mirrorX = width - 1 - x;
        const mirrorY = height - 1 - y;
        if (mirrorX >= 0 && mirrorX < width && mirrorY >= 0 && mirrorY < height) {
            const mirrorIndex = mirrorY * width + mirrorX;
            spriteData[mirrorIndex] = color;
        }
    }
}

function handlePixelFill(startX, startY, isPrimary = true) {
    const { width, height, sprites, currentFrame, primaryColor, secondaryColor } = state.pixel;
    const spriteData = sprites[currentFrame].data;
    const targetColor = spriteData[startY * width + startX];
    const fillColor = isPrimary ? primaryColor : secondaryColor;
    
    if (targetColor === fillColor) return;

    const stack = [[startX, startY]];
    const visited = new Set();

    while (stack.length) {
        const [x, y] = stack.pop();
        const key = `${x},${y}`;
        
        if (visited.has(key)) continue;
        if (x < 0 || x >= width || y < 0 || y >= height) continue;
        
        const index = y * width + x;
        if (spriteData[index] !== targetColor) continue;
        
        visited.add(key);
        spriteData[index] = fillColor;

        // Add adjacent cells
        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    drawPixelCanvas();
}

// =====================
// SKETCH MODE FUNCTIONS
// =====================
function createSketchLayer(name) {
    const canvas = document.createElement('canvas');
    canvas.width = state.sketch.width;
    canvas.height = state.sketch.height;
    
    return {
        id: Date.now() + Math.random(),
        name: name,
        canvas: canvas,
        ctx: canvas.getContext('2d'),
        opacity: 100,
        blendMode: 'source-over',
        visible: true
    };
}

function getSketchCoords(e) {
    const rect = elements.sketchCanvas.getBoundingClientRect();
    const scaleX = state.sketch.width / rect.width;
    const scaleY = state.sketch.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return { x, y };
}

function drawSketchCanvas() {
    const ctx = elements.sketchCtx;
    const { width, height, layers } = state.sketch;
    
    ctx.clearRect(0, 0, width, height);
    
    layers.forEach(layer => {
        if (layer.visible) {
            ctx.globalAlpha = layer.opacity / 100;
            ctx.globalCompositeOperation = layer.blendMode;
            ctx.drawImage(layer.canvas, 0, 0);
        }
    });
    
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
}

function handleSketchDraw(x, y) {
    const { activeLayer, layers, activeTool, color, size, opacity } = state.sketch;
    const layer = layers[activeLayer];
    if (!layer) return;
    
    const ctx = layer.ctx;
    
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = opacity / 100;
    
    if (activeTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
    }
    
    if (!state.isDrawing) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    
    drawSketchCanvas();
}

// =====================
// CANVAS INTERACTION
// =====================
function handlePointerDown(e) {
    e.preventDefault();
    state.isDrawing = true;
    
    if (state.mode === 'pixel') {
        const { x, y } = getPixelCoords(e);
        state.lastPos = state.toolStartPos = { x, y };
        
        const isPrimary = e.button === 0;
        const { activeTool } = state.pixel;
        
        if (activeTool === 'fill' || activeTool === 'symmetricFill') {
            pushHistory('Fill');
            handlePixelFill(x, y, isPrimary);
            state.isDrawing = false;
        } else if (activeTool.includes('pencil') || activeTool.includes('eraser') || 
                   activeTool.includes('Pencil') || activeTool.includes('Eraser')) {
            pushHistory('Draw Stroke');
            handlePixelDraw(x, y, isPrimary);
        }
    } else if (state.mode === 'sketch') {
        const { x, y } = getSketchCoords(e);
        state.lastPos = { x, y };
        pushHistory('Sketch Stroke');
        handleSketchDraw(x, y);
    }
}

function handlePointerMove(e) {
    if (!state.isDrawing) return;
    
    if (state.mode === 'pixel') {
        const { x, y } = getPixelCoords(e);
        const { activeTool } = state.pixel;
        
        if (activeTool.includes('pencil') || activeTool.includes('eraser') ||
            activeTool.includes('Pencil') || activeTool.includes('Eraser')) {
            
            // Draw line between last position and current position
            const dx = Math.abs(x - state.lastPos.x);
            const dy = Math.abs(y - state.lastPos.y);
            const sx = state.lastPos.x < x ? 1 : -1;
            const sy = state.lastPos.y < y ? 1 : -1;
            let err = dx - dy;
            
            let currentX = state.lastPos.x;
            let currentY = state.lastPos.y;
            
            while (true) {
                handlePixelDraw(currentX, currentY, e.buttons === 1);
                if (currentX === x && currentY === y) break;
                
                const e2 = 2 * err;
                if (e2 > -dy) {
                    err -= dy;
                    currentX += sx;
                }
                if (e2 < dx) {
                    err += dx;
                    currentY += sy;
                }
            }
            
            state.lastPos = { x, y };
        }
    } else if (state.mode === 'sketch') {
        const { x, y } = getSketchCoords(e);
        handleSketchDraw(x, y);
        state.lastPos = { x, y };
    }
}

function handlePointerUp(e) {
    if (state.isDrawing && state.mode === 'sketch') {
        const layer = state.sketch.layers[state.sketch.activeLayer];
        if (layer) {
            layer.ctx.closePath();
        }
    }
    state.isDrawing = false;
}

// =====================
// HISTORY SYSTEM
// =====================
function pushHistory(action) {
    const historyState = state[state.mode];
    
    // Clear redo history
    historyState.history.splice(historyState.historyIndex + 1);
    
    let snapshot;
    if (state.mode === 'pixel') {
        snapshot = {
            action,
            sprites: state.pixel.sprites.map(sprite => ({
                ...sprite,
                data: [...sprite.data]
            })),
            currentFrame: state.pixel.currentFrame
        };
    } else {
        snapshot = {
            action,
            layers: state.sketch.layers.map(layer => ({
                ...layer,
                imageData: layer.canvas.toDataURL()
            })),
            activeLayer: state.sketch.activeLayer
        };
    }
    
    historyState.history.push(snapshot);
    historyState.historyIndex = historyState.history.length - 1;
    
    // Limit history size
    if (historyState.history.length > 50) {
        historyState.history.shift();
        historyState.historyIndex--;
    }
}

function applyHistorySnapshot(snapshot) {
    if (state.mode === 'pixel') {
        state.pixel.sprites = snapshot.sprites.map(sprite => ({
            ...sprite,
            data: [...sprite.data]
        }));
        state.pixel.currentFrame = snapshot.currentFrame;
        updateSpriteSelector();
        drawPixelCanvas();
    } else {
        // Restore sketch layers
        state.sketch.layers = snapshot.layers.map(layerData => {
            const layer = createSketchLayer(layerData.name);
            layer.id = layerData.id;
            layer.opacity = layerData.opacity;
            layer.blendMode = layerData.blendMode;
            layer.visible = layerData.visible;
            
            const img = new Image();
            img.onload = () => {
                layer.ctx.drawImage(img, 0, 0);
                drawSketchCanvas();
            };
            img.src = layerData.imageData;
            
            return layer;
        });
        
        state.sketch.activeLayer = snapshot.activeLayer;
        updateLayersList();
        drawSketchCanvas();
    }
}

function undo() {
    const historyState = state[state.mode];
    if (historyState.historyIndex > 0) {
        historyState.historyIndex--;
        applyHistorySnapshot(historyState.history[historyState.historyIndex]);
    }
}

function redo() {
    const historyState = state[state.mode];
    if (historyState.historyIndex < historyState.history.length - 1) {
        historyState.historyIndex++;
        applyHistorySnapshot(historyState.history[historyState.historyIndex]);
    }
}

// =====================
// SPRITE MANAGEMENT
// =====================
function updateSpriteSelector() {
    elements.spriteSelector.innerHTML = '';
    state.pixel.sprites.forEach((sprite, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `Frame ${index + 1}`;
        option.selected = index === state.pixel.currentFrame;
        elements.spriteSelector.appendChild(option);
    });
}

function newSprite() {
    const { width, height } = state.pixel;
    const newSprite = {
        id: Date.now(),
        data: new Array(width * height).fill('transparent')
    };
    
    state.pixel.sprites.push(newSprite);
    state.pixel.currentFrame = state.pixel.sprites.length - 1;
    
    updateSpriteSelector();
    drawPixelCanvas();
    pushHistory('New Sprite');
}

function duplicateSprite() {
    const { sprites, currentFrame } = state.pixel;
    const currentSprite = sprites[currentFrame];
    
    const newSprite = {
        id: Date.now(),
        data: [...currentSprite.data]
    };
    
    sprites.splice(currentFrame + 1, 0, newSprite);
    state.pixel.currentFrame = currentFrame + 1;
    
    updateSpriteSelector();
    drawPixelCanvas();
    pushHistory('Duplicate Sprite');
}

function deleteSprite() {
    if (state.pixel.sprites.length <= 1) {
        alert('Cannot delete the last sprite.');
        return;
    }
    
    state.pixel.sprites.splice(state.pixel.currentFrame, 1);
    state.pixel.currentFrame = Math.max(0, state.pixel.currentFrame - 1);
    
    updateSpriteSelector();
    drawPixelCanvas();
    pushHistory('Delete Sprite');
}

// =====================
// LAYER MANAGEMENT
// =====================
function updateLayersList() {
    if (!elements.layerList) return;
    
    elements.layerList.innerHTML = '';
    
    state.sketch.layers.forEach((layer, index) => {
        const item = document.createElement('div');
        item.className = `layer-item ${index === state.sketch.activeLayer ? 'active' : ''}`;
        item.dataset.index = index;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = layer.visible;
        checkbox.onclick = (e) => {
            e.stopPropagation();
            layer.visible = checkbox.checked;
            drawSketchCanvas();
        };
        
        const span = document.createElement('span');
        span.textContent = layer.name;
        
        item.appendChild(checkbox);
        item.appendChild(span);
        
        item.onclick = () => {
            state.sketch.activeLayer = index;
            updateLayersList();
            updateSketchControls();
        };
        
        elements.layerList.appendChild(item);
    });
}

function addLayer() {
    const newLayer = createSketchLayer(`Layer ${state.sketch.layers.length + 1}`);
    state.sketch.layers.push(newLayer);
    state.sketch.activeLayer = state.sketch.layers.length - 1;
    
    updateLayersList();
    pushHistory('Add Layer');
}

// =====================
// PALETTE MANAGEMENT
// =====================
function loadCustomPalette() {
    const stored = localStorage.getItem(CUSTOM_PALETTE_KEY);
    if (stored) {
        try {
            state.customPalette = JSON.parse(stored);
        } catch (e) {
            state.customPalette = DEFAULT_CUSTOM_PALETTE;
        }
    }
}

function populatePaletteSelector() {
    elements.paletteSelector.innerHTML = '';
    
    Object.keys(BUILT_IN_PALETTES).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        elements.paletteSelector.appendChild(option);
    });
    
    const customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.textContent = 'Custom';
    elements.paletteSelector.appendChild(customOption);
}

function renderPaletteSwatches() {
    const selectedValue = elements.paletteSelector.value;
    const palette = selectedValue === 'custom' ? 
        state.customPalette : 
        BUILT_IN_PALETTES[selectedValue] || BUILT_IN_PALETTES.default;
    
    elements.swatches.innerHTML = '';
    
    palette.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = color;
        swatch.dataset.color = color;
        swatch.onclick = (e) => handleSwatchClick(e);
        swatch.oncontextmenu = (e) => {
            e.preventDefault();
            handleSwatchClick(e, true);
        };
        elements.swatches.appendChild(swatch);
    });
}

function renderCustomPalette() {
    elements.colorPickers.innerHTML = '';
    
    state.customPalette.forEach((color, index) => {
        const input = document.createElement('input');
        input.type = 'color';
        input.className = 'color-picker';
        input.value = color;
        input.dataset.index = index;
        input.onchange = () => {
            state.customPalette[index] = input.value;
            localStorage.setItem(CUSTOM_PALETTE_KEY, JSON.stringify(state.customPalette));
            if (elements.paletteSelector.value === 'custom') {
                renderPaletteSwatches();
            }
        };
        elements.colorPickers.appendChild(input);
    });
}

function handleSwatchClick(e, isSecondary = false) {
    const color = e.target.dataset.color;
    if (!color) return;
    
    if (state.mode === 'pixel') {
        if (isSecondary) {
            state.pixel.secondaryColor = color;
            elements.secondaryColor.style.backgroundColor = color;
        } else {
            state.pixel.primaryColor = color;
            elements.primaryColor.style.backgroundColor = color;
        }
    } else if (state.mode === 'sketch') {
        state.sketch.color = color;
        elements.sketchColor.value = color;
    }
    
    updateCanvasInfo();
}

function saveCustomPalette() {
    localStorage.setItem(CUSTOM_PALETTE_KEY, JSON.stringify(state.customPalette));
    alert('Custom palette saved!');
}

// =====================
// SYMMETRY FUNCTIONS
// =====================
function setSymmetryMode(mode) {
    state.pixel.symmetry = mode;
    updateSymmetryDisplay();
}

function updateSymmetryDisplay() {
    document.querySelectorAll('.symmetry-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.symmetry === state.pixel.symmetry);
    });
    
    const mode = state.pixel.symmetry;
    const info = mode === 'none' ? 'No symmetry active' : 
                 mode === 'horizontal' ? 'Horizontal symmetry active' :
                 mode === 'vertical' ? 'Vertical symmetry active' :
                 mode === 'both' ? 'Both axes symmetry active' : 'Unknown symmetry';
    
    if (elements.symmetryInfo) {
        elements.symmetryInfo.textContent = info;
    }
    
    // Show symmetry guides
    updateSymmetryGuides();
}

function updateSymmetryGuides() {
    const wrapper = elements.canvas.parentElement;
    
    // Remove existing guides
    wrapper.querySelectorAll('.symmetry-guide').forEach(el => el.remove());
    
    const mode = state.pixel.symmetry;
    if (mode === 'none') return;
    
    if (mode === 'horizontal' || mode === 'both') {
        const guide = document.createElement('div');
        guide.className = 'symmetry-guide horizontal';
        guide.style.top = '50%';
        wrapper.appendChild(guide);
    }
    
    if (mode === 'vertical' || mode === 'both') {
        const guide = document.createElement('div');
        guide.className = 'symmetry-guide vertical';
        guide.style.left = '50%';
        wrapper.appendChild(guide);
    }
}

// =====================
// TRANSFORM FUNCTIONS
// =====================
function transformSelection(type, value) {
    if (state.mode !== 'pixel') return;
    
    pushHistory(`Transform ${type}`);
    
    const { width, height, sprites, currentFrame } = state.pixel;
    const spriteData = sprites[currentFrame].data;
    const newData = new Array(width * height).fill('transparent');
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const oldIndex = y * width + x;
            const color = spriteData[oldIndex];
            if (color === 'transparent') continue;
            
            let newX = x, newY = y;
            
            if (type === 'flip') {
                if (value === 'H') newX = width - 1 - x;
                if (value === 'V') newY = height - 1 - y;
            } else if (type === 'rotate') {
                if (value === 90) {
                    newX = height - 1 - y;
                    newY = x;
                } else if (value === 180) {
                    newX = width - 1 - x;
                    newY = height - 1 - y;
                } else if (value === -90) {
                    newX = y;
                    newY = width - 1 - x;
                }
            }
            
            if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                const newIndex = newY * width + newX;
                newData[newIndex] = color;
            }
        }
    }
    
    sprites[currentFrame].data = newData;
    drawPixelCanvas();
}

// =====================
// CANVAS UTILITIES
// =====================
function updateCanvasDisplay() {
    if (state.mode === 'pixel') {
        const zoomFactor = state.pixel.zoom / 100;
        const cellSize = Math.floor(30 * zoomFactor);
        state.pixel.cellSize = cellSize;
        
        updatePixelCanvasSize();
        renderPixelGrid();
        drawPixelCanvas();
    } else if (state.mode === 'sketch') {
        const zoomFactor = state.sketch.zoom / 100;
        elements.sketchCanvas.style.transform = `scale(${zoomFactor})`;
        elements.selectionOverlay.style.transform = `scale(${zoomFactor})`;
    }
    
    elements.zoomIndicator.textContent = `${state[state.mode].zoom}%`;
}

function updateCanvasInfo() {
    const { mode } = state;
    let info = '';
    
    if (mode === 'pixel') {
        const { width, height, activeTool, primaryColor } = state.pixel;
        info = `${width}×${height} | ${activeTool} | ${primaryColor}`;
    } else if (mode === 'sketch') {
        const { width, height, activeTool, color } = state.sketch;
        info = `${width}×${height} | ${activeTool} | ${color}`;
    }
    
    elements.canvasInfo.textContent = info;
}

function updateToolControls() {
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('active');
        
        const tool = btn.dataset.tool;
        if (state.mode === 'pixel' && tool === state.pixel.activeTool) {
            btn.classList.add('active');
        } else if (state.mode === 'sketch' && tool === state.sketch.activeTool) {
            btn.classList.add('active');
        }
    });
}

function updateSketchControls() {
    const { size, opacity, hardness, flow } = state.sketch;
    
    if (elements.brushSize) elements.brushSize.value = size;
    if (elements.brushSizeLabel) elements.brushSizeLabel.textContent = size;
    if (elements.brushOpacity) elements.brushOpacity.value = opacity;
    if (elements.opacityLabel) elements.opacityLabel.textContent = opacity;
    if (elements.brushHardness) elements.brushHardness.value = hardness;
    if (elements.hardnessLabel) elements.hardnessLabel.textContent = hardness;
    if (elements.brushFlow) elements.brushFlow.value = flow;
    if (elements.flowLabel) elements.flowLabel.textContent = flow;
    
    // Update brush preview
    if (elements.brushPreview) {
        elements.brushPreview.style.width = `${size}px`;
        elements.brushPreview.style.height = `${size}px`;
        elements.brushPreview.style.backgroundColor = state.sketch.color;
        elements.brushPreview.style.opacity = opacity / 100;
    }
}

function adjustZoom(delta) {
    const currentState = state[state.mode];
    let newZoom;
    
    if (delta === 'reset') {
        newZoom = 100;
    } else {
        newZoom = currentState.zoom + delta;
        newZoom = Math.max(25, Math.min(800, newZoom));
    }
    
    currentState.zoom = newZoom;
    updateCanvasDisplay();
}

function clearCanvas() {
    if (!confirm('Clear the entire canvas? This cannot be undone.')) return;
    
    pushHistory('Clear Canvas');
    
    if (state.mode === 'pixel') {
        const { sprites, currentFrame, width, height } = state.pixel;
        sprites[currentFrame].data.fill('transparent');
        drawPixelCanvas();
    } else if (state.mode === 'sketch') {
        const layer = state.sketch.layers[state.sketch.activeLayer];
        if (layer) {
            layer.ctx.clearRect(0, 0, state.sketch.width, state.sketch.height);
            drawSketchCanvas();
        }
    }
}

function resizeCanvas() {
    const newWidth = parseInt(elements.canvasWidth.value);
    const newHeight = parseInt(elements.canvasHeight.value);
    
    if (newWidth < 1 || newHeight > 128 || newHeight < 1 || newWidth > 128) {
        alert('Canvas size must be between 1×1 and 128×128');
        return;
    }
    
    pushHistory('Resize Canvas');
    
    if (state.mode === 'pixel') {
        const oldWidth = state.pixel.width;
        const oldHeight = state.pixel.height;
        
        state.pixel.width = newWidth;
        state.pixel.height = newHeight;
        
        // Resize all sprites
        state.pixel.sprites.forEach(sprite => {
            const oldData = sprite.data;
            const newData = new Array(newWidth * newHeight).fill('transparent');
            
            // Copy existing data
            for (let y = 0; y < Math.min(oldHeight, newHeight); y++) {
                for (let x = 0; x < Math.min(oldWidth, newWidth); x++) {
                    const oldIndex = y * oldWidth + x;
                    const newIndex = y * newWidth + x;
                    newData[newIndex] = oldData[oldIndex];
                }
            }
            
            sprite.data = newData;
        });
        
        updatePixelCanvasSize();
        renderPixelGrid();
        drawPixelCanvas();
    }
    
    updateCanvasInfo();
}

// =====================
// I/O FUNCTIONS
// =====================
function newProject() {
    if (!confirm('Start a new project? All unsaved work will be lost.')) return;
    
    // Reset pixel state
    state.pixel = {
        width: 16,
        height: 16,
        cellSize: 30,
        zoom: 100,
        sprites: [{ id: 1, data: new Array(16 * 16).fill('transparent') }],
        currentFrame: 0,
        primaryColor: '#000000',
        secondaryColor: '#ffffff',
        activeTool: 'pencil',
        symmetry: 'none',
        history: [],
        historyIndex: -1,
        selection: null,
        showGrid: true
    };
    
    // Reset sketch state
    state.sketch = {
        width: 800,
        height: 600,
        layers: [createSketchLayer('Layer 1')],
        activeLayer: 0,
        color: '#000000',
        size: 10,
        opacity: 100,
        hardness: 100,
        flow: 100,
        activeTool: 'brush',
        history: [],
        historyIndex: -1,
        zoom: 100
    };
    
    elements.canvasWidth.value = 16;
    elements.canvasHeight.value = 16;
    
    setMode('pixel');
    updateSpriteSelector();
    updateLayersList();
    updateCanvasDisplay();
    pushHistory('New Project');
}

function exportJSON() {
    const projectData = {
        version: '1.0',
        mode: state.mode,
        pixel: {
            width: state.pixel.width,
            height: state.pixel.height,
            sprites: state.pixel.sprites,
            primaryColor: state.pixel.primaryColor,
            secondaryColor: state.pixel.secondaryColor
        },
        sketch: {
            width: state.sketch.width,
            height: state.sketch.height,
            layers: state.sketch.layers.map(layer => ({
                id: layer.id,
                name: layer.name,
                opacity: layer.opacity,
                blendMode: layer.blendMode,
                visible: layer.visible,
                imageData: layer.canvas.toDataURL()
            }))
        }
    };
    
    const json = JSON.stringify(projectData, null, 2);
    elements.output.value = json;
    
    // Download file
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jerry_project.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportPNG(canvasElement) {
    let canvas, filename;
    
    if (state.mode === 'pixel') {
        canvas = elements.pixelCanvas;
        filename = 'pixel_art.png';
    } else {
        canvas = elements.sketchCanvas;
        filename = 'sketch.png';
    }
    
    const scale = parseInt(prompt('Export scale (1-10):', '4')) || 4;
    
    // Create scaled canvas
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = canvas.width * scale;
    scaledCanvas.height = canvas.height * scale;
    const ctx = scaledCanvas.getContext('2d');
    
    if (state.mode === 'pixel') {
        ctx.imageSmoothingEnabled = false;
    }
    
    ctx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
    
    // Download
    const url = scaledCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importProject(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            loadProjectData(data);
            alert('Project imported successfully!');
        } catch (error) {
            alert('Error importing project: Invalid file format.');
            console.error(error);
        }
    };
    reader.readAsText(file);
}

function loadProjectData(data) {
    if (data.pixel) {
        state.pixel.width = data.pixel.width || 16;
        state.pixel.height = data.pixel.height || 16;
        state.pixel.sprites = data.pixel.sprites || [{ id: 1, data: new Array(256).fill('transparent') }];
        state.pixel.primaryColor = data.pixel.primaryColor || '#000000';
        state.pixel.secondaryColor = data.pixel.secondaryColor || '#ffffff';
        state.pixel.currentFrame = 0;
        
        elements.canvasWidth.value = state.pixel.width;
        elements.canvasHeight.value = state.pixel.height;
        elements.primaryColor.style.backgroundColor = state.pixel.primaryColor;
        elements.secondaryColor.style.backgroundColor = state.pixel.secondaryColor;
    }
    
    if (data.sketch && data.sketch.layers) {
        state.sketch.width = data.sketch.width || 800;
        state.sketch.height = data.sketch.height || 600;
        state.sketch.layers = [];
        
        data.sketch.layers.forEach(layerData => {
            const layer = createSketchLayer(layerData.name);
            layer.id = layerData.id;
            layer.opacity = layerData.opacity;
            layer.blendMode = layerData.blendMode;
            layer.visible = layerData.visible;
            
            if (layerData.imageData) {
                const img = new Image();
                img.onload = () => {
                    layer.ctx.drawImage(img, 0, 0);
                    drawSketchCanvas();
                };
                img.src = layerData.imageData;
            }
            
            state.sketch.layers.push(layer);
        });
        
        state.sketch.activeLayer = 0;
    }
    
    setMode(data.mode || 'pixel');
    updateSpriteSelector();
    updateLayersList();
    updateCanvasDisplay();
    pushHistory('Import Project');
}

// =====================
// EVENT LISTENERS
// =====================
function attachEventListeners() {
    // Mode toggle
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.onclick = () => setMode(btn.dataset.mode);
    });
    
    // Tool selection
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.onclick = () => {
            const tool = btn.dataset.tool;
            if (state.mode === 'pixel') {
                state.pixel.activeTool = tool;
            } else {
                state.sketch.activeTool = tool;
            }
            updateToolControls();
            updateCanvasInfo();
        };
    });
    
    // Canvas interaction
    const canvases = [elements.canvas, elements.sketchCanvas, elements.selectionOverlay];
    canvases.forEach(canvas => {
        if (canvas) {
            canvas.onpointerdown = handlePointerDown;
            canvas.ontouchstart = (e) => e.preventDefault();
        }
    });
    
    document.onpointermove = handlePointerMove;
    document.onpointerup = handlePointerUp;
    
    // UI Controls
    if (elements.undo) elements.undo.onclick = undo;
    if (elements.redo) elements.redo.onclick = redo;
    if (elements.clear) elements.clear.onclick = clearCanvas;
    if (elements.resizeCanvas) elements.resizeCanvas.onclick = resizeCanvas;
    
    // Zoom controls
    if (elements.zoomIn) elements.zoomIn.onclick = () => adjustZoom(25);
    if (elements.zoomOut) elements.zoomOut.onclick = () => adjustZoom(-25);
    if (elements.zoomReset) elements.zoomReset.onclick = () => adjustZoom('reset');
    
    // Grid toggle
    if (elements.gridToggle) {
        elements.gridToggle.onchange = () => {
            state.pixel.showGrid = elements.gridToggle.checked;
            elements.canvasGrid.style.display = 
                (state.mode === 'pixel' && state.pixel.showGrid) ? 'grid' : 'none';
        };
    }
    
    // Color controls
    if (elements.primaryColor) {
        elements.primaryColor.onclick = () => {
            const temp = state.pixel.primaryColor;
            state.pixel.primaryColor = state.pixel.secondaryColor;
            state.pixel.secondaryColor = temp;
            elements.primaryColor.style.backgroundColor = state.pixel.primaryColor;
            elements.secondaryColor.style.backgroundColor = state.pixel.secondaryColor;
            updateCanvasInfo();
        };
    }
    
    // Palette controls
    if (elements.paletteSelector) elements.paletteSelector.onchange = renderPaletteSwatches;
    if (elements.saveCustomPalette) elements.saveCustomPalette.onclick = saveCustomPalette;
    
    // Sprite controls
    if (elements.spriteSelector) {
        elements.spriteSelector.onchange = (e) => {
            state.pixel.currentFrame = parseInt(e.target.value);
            drawPixelCanvas();
        };
    }
    if (elements.newSprite) elements.newSprite.onclick = newSprite;
    if (elements.duplicateSprite) elements.duplicateSprite.onclick = duplicateSprite;
    if (elements.deleteSprite) elements.deleteSprite.onclick = deleteSprite;
    
    // Symmetry controls
    document.querySelectorAll('.symmetry-btn').forEach(btn => {
        btn.onclick = () => setSymmetryMode(btn.dataset.symmetry);
    });
    
    // Transform controls
    if (elements.rotateLeft) elements.rotateLeft.onclick = () => transformSelection('rotate', -90);
    if (elements.rotate180) elements.rotate180.onclick = () => transformSelection('rotate', 180);
    if (elements.rotateRight) elements.rotateRight.onclick = () => transformSelection('rotate', 90);
    if (elements.flipHorizontal) elements.flipHorizontal.onclick = () => transformSelection('flip', 'H');
    if (elements.flipVertical) elements.flipVertical.onclick = () => transformSelection('flip', 'V');
    
    // Sketch controls
    if (elements.sketchColor) {
        elements.sketchColor.oninput = () => {
            state.sketch.color = elements.sketchColor.value;
            updateCanvasInfo();
        };
    }
    
    const sketchInputs = ['brushSize', 'brushOpacity', 'brushHardness', 'brushFlow'];
    sketchInputs.forEach(id => {
        const element = elements[id];
        if (element) {
            element.oninput = () => {
                const value = parseInt(element.value);
                const property = id.replace('brush', '').toLowerCase();
                state.sketch[property === 'size' ? 'size' : property] = value;
                updateSketchControls();
            };
        }
    });
    
    // Layer controls
    if (elements.addLayer) elements.addLayer.onclick = addLayer;
    if (elements.layerOpacity) {
        elements.layerOpacity.oninput = () => {
            const layer = state.sketch.layers[state.sketch.activeLayer];
            if (layer) {
                layer.opacity = parseInt(elements.layerOpacity.value);
                elements.layerOpacityLabel.textContent = layer.opacity;
                drawSketchCanvas();
            }
        };
    }
    if (elements.blendMode) {
        elements.blendMode.onchange = () => {
            const layer = state.sketch.layers[state.sketch.activeLayer];
            if (layer) {
                layer.blendMode = elements.blendMode.value;
                drawSketchCanvas();
            }
        };
    }
    
    // I/O controls
    if (elements.newProject) elements.newProject.onclick = newProject;
    if (elements.exportJSON) elements.exportJSON.onclick = exportJSON;
    if (elements.exportPNG) elements.exportPNG.onclick = () => exportPNG();
    if (elements.exportPNG2) elements.exportPNG2.onclick = () => exportPNG();
    if (elements.importFile) elements.importFile.onchange = importProject;
    
    // Keyboard shortcuts
    document.onkeydown = (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) redo(); else undo();
                    break;
                case 'y':
                    e.preventDefault();
                    redo();
                    break;
                case 's':
                    e.preventDefault();
                    exportJSON();
                    break;
                case 'n':
                    e.preventDefault();
                    newProject();
                    break;
            }
        } else {
            // Tool shortcuts
            const tools = {
                'b': 'pencil', 'e': 'eraser', 'i': 'eyedropper', 'f': 'fill',
                'l': 'line', 'r': 'rect', 'o': 'circle', 'm': 'select', 'v': 'move'
            };
            
            if (tools[e.key] && state.mode === 'pixel') {
                state.pixel.activeTool = tools[e.key];
                updateToolControls();
                updateCanvasInfo();
            }
        }
        
        state.isShiftPressed = e.shiftKey;
        state.isCtrlPressed = e.ctrlKey || e.metaKey;
    };
    
    document.onkeyup = (e) => {
        state.isShiftPressed = e.shiftKey;
        state.isCtrlPressed = e.ctrlKey || e.metaKey;
    };
    
    // Prevent context menu on canvas
    canvases.forEach(canvas => {
        if (canvas) {
            canvas.oncontextmenu = (e) => e.preventDefault();
        }
    });
    
    // Handle panel collapse
    document.querySelectorAll('.panel-header').forEach(header => {
        header.onclick = () => {
            const panel = header.parentElement;
            panel.classList.toggle('collapsed');
            const arrow = header.querySelector('span');
            if (arrow) {
                arrow.textContent = panel.classList.contains('collapsed') ? '▶' : '▼';
            }
        };
    });
}
