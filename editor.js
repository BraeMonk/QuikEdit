// =================================================================================================
// Jerry Editor - Optimized Complete Version
// Pixel Art & Sketch Editor with Symmetry, Sprites, Layers, Palettes, and Export/Import
// =================================================================================================

// =================================================================================================
// CONSTANTS
// =================================================================================================
const CANVAS_LIMITS = {
  MIN_SIZE: 1,
  MAX_SIZE: 128,
  MIN_ZOOM: 25,
  MAX_ZOOM: 800,
  DEFAULT_CELL_SIZE: 30
};

const HISTORY_LIMITS = {
  MAX_ENTRIES: 50
};

const SKETCH_LIMITS = {
  MIN_BRUSH_SIZE: 1,
  MAX_BRUSH_SIZE: 100,
  DEFAULT_WIDTH: 800,
  DEFAULT_HEIGHT: 600
};

// Theme detection for palette defaults
const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;

// =====================
// PALETTE DEFINITIONS
// =====================
const BUILT_IN_PALETTES = {
  default: isLightMode
    ? ['transparent','#FFFFFF','#C0C0C0','#808080','#404040','#000000','#FF0000','#00FF00','#0000FF','#FFFF00','#FF00FF']
    : ['transparent','#F8F8F8','#D0D0D0','#808080','#404040','#000000','#FF4444','#44FF44','#4444FF','#FFFF44','#FF44FF'],
  retro8bit: ['transparent','#F4F4F4','#E8E8E8','#BCBCBC','#7C7C7C','#A00000','#FF6A00','#FFD500','#00A844','#0047AB','#000000'],
  gameboyClassic: ['transparent','#E0F8D0','#88C070','#346856','#081820','#9BBB0F','#8BAC0F','#306230','#0F380F'],
  synthwave: ['transparent','#FF00FF','#FF0080','#FF4080','#FF8000','#FFFF00','#80FF00','#00FFFF','#0080FF','#8000FF','#2D1B69'],
  earthTones: ['transparent','#FFF8DC','#D2B48C','#CD853F','#A0522D','#8B4513','#654321','#556B2F','#8FBC8F','#2F4F4F']
};

const DEFAULT_CUSTOM_PALETTE = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080'];
const CUSTOM_PALETTE_KEY = 'jerryEditorCustomPalette';

// =====================
// APPLICATION STATE
// =====================
class EditorState {
  constructor() {
    this.mode = 'pixel';
    this.isDrawing = false;
    this.lastPos = { x: 0, y: 0 };
    this.toolStartPos = { x: 0, y: 0 };
    this.customPalette = this.loadCustomPalette();
    this.isShiftPressed = false;
    this.isCtrlPressed = false;
    
    // Pixel Mode State
    this.pixel = {
      width: 16,
      height: 16,
      cellSize: 30,
      zoom: 100,
      sprites: [{ id: 1, name: 'Sprite 1', data: new Array(16 * 16).fill('transparent') }],
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
    
    // Sketch Mode State  
    this.sketch = {
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
    };
  }
  
  loadCustomPalette() {
  try {
    const stored = localStorage.getItem(CUSTOM_PALETTE_KEY);
    const palette = stored ? JSON.parse(stored) : DEFAULT_CUSTOM_PALETTE;
    
    // Validate palette
    if (!Array.isArray(palette) || palette.length !== 10) {
      console.warn('Invalid custom palette, using default');
      return DEFAULT_CUSTOM_PALETTE;
    }
    
    return palette;
  } catch (error) {
    console.error('Failed to load custom palette:', error);
    return DEFAULT_CUSTOM_PALETTE;
  }
}

saveCustomPalette() {
  try {
    if (!Array.isArray(this.customPalette)) {
      throw new Error('Invalid palette data');
    }
    localStorage.setItem(CUSTOM_PALETTE_KEY, JSON.stringify(this.customPalette));
  } catch (error) {
    console.error('Failed to save custom palette:', error);
    alert('Failed to save palette. Storage may be full.');
  }
}

// =====================
// CANVAS MANAGEMENT
// =====================
class CanvasManager {
  constructor(state) {
    this.state = state;
    this.elements = {};
    this.initializeElements();
    this.initializeCanvases();
  }
  
  initializeElements() {
  const requiredIds = [
    'canvas', 'sketchCanvas', 'selectionOverlay', 'canvasGrid', 'canvasInfo', 'zoomIndicator',
    'primaryColor', 'secondaryColor', 'paletteSelector', 'swatches'
  ];
  
  const optionalIds = [
    'colorPickers', 'saveCustomPalette', 'brushSizeLabel', 'brushSize', 'brushOpacity', 
    'opacityLabel', 'brushHardness', 'hardnessLabel', 'brushFlow', 'flowLabel', 'brushPreview', 
    'sketchColor', 'symmetryInfo', 'rotateLeft', 'rotate180', 'rotateRight', 'flipHorizontal', 
    'flipVertical', 'canvasWidth', 'canvasHeight', 'resizeCanvas', 'zoomOut', 'zoomReset', 
    'zoomIn', 'undo', 'redo', 'clear', 'gridToggle', 'spriteSelector', 'newSprite', 
    'duplicateSprite', 'deleteSprite', 'layerList', 'layerOpacity', 'layerOpacityLabel', 
    'blendMode', 'addLayer', 'exportJSON', 'exportPNG2', 'output', 'importFile', 'newProject', 
    'exportPNG'
  ];
  
  // Check required elements
  requiredIds.forEach(id => {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Required element not found: ${id}`);
    }
    this.elements[id] = element;
  });
  
  // Get optional elements
  optionalIds.forEach(id => {
    this.elements[id] = document.getElementById(id);
  });
  
  // Create pixel drawing canvas
  this.elements.pixelCanvas = document.createElement('canvas');
  this.elements.pixelCanvas.style.imageRendering = 'pixelated';
  this.elements.canvas.appendChild(this.elements.pixelCanvas);
  
  this.elements.pixelCtx = this.elements.pixelCanvas.getContext('2d');
  this.elements.sketchCtx = this.elements.sketchCanvas.getContext('2d');
  this.elements.overlayCtx = this.elements.selectionOverlay.getContext('2d');
}
  
  initializeCanvases() {
    this.updatePixelCanvasSize();
    this.renderPixelGrid();
    
    this.elements.sketchCanvas.width = this.state.sketch.width;
    this.elements.sketchCanvas.height = this.state.sketch.height;
    this.elements.selectionOverlay.width = this.state.sketch.width;
    this.elements.selectionOverlay.height = this.state.sketch.height;
    
    // Initialize sketch layers
    this.state.sketch.layers = [this.createSketchLayer('Layer 1')];
  }
  
  updatePixelCanvasSize() {
    const { width, height, cellSize } = this.state.pixel;
    
    this.elements.pixelCanvas.width = width;
    this.elements.pixelCanvas.height = height;
    
    const displayWidth = width * cellSize;
    const displayHeight = height * cellSize;
    
    this.elements.canvas.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    this.elements.canvas.style.gridTemplateRows = `repeat(${height}, 1fr)`;
    this.elements.canvas.style.width = `${displayWidth}px`;
    this.elements.canvas.style.height = `${displayHeight}px`;
    
    this.elements.pixelCanvas.style.width = `${displayWidth}px`;
    this.elements.pixelCanvas.style.height = `${displayHeight}px`;
  }
  
  renderPixelGrid() {
    const { width, height } = this.state.pixel;
    this.elements.canvasGrid.innerHTML = '';
    this.elements.canvasGrid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    this.elements.canvasGrid.style.gridTemplateRows = `repeat(${height}, 1fr)`;

    for (let i = 0; i < width * height; i++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-cell');
      this.elements.canvasGrid.appendChild(cell);
    }
  }
  
  drawPixelCanvas() {
    const { width, height, sprites, currentFrame } = this.state.pixel;
    const ctx = this.elements.pixelCtx;
    const spriteData = sprites[currentFrame]?.data || [];

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
  
  createSketchLayer(name) {
    const canvas = document.createElement('canvas');
    canvas.width = this.state.sketch.width;
    canvas.height = this.state.sketch.height;
    
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
  
  drawSketchCanvas() {
    const ctx = this.elements.sketchCtx;
    const { width, height, layers } = this.state.sketch;
    
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
}

// =====================
// DRAWING TOOLS
// =====================
class DrawingTools {
  constructor(state, canvasManager) {
    this.state = state;
    this.canvas = canvasManager;
  }
  
  getPixelCoords(e) {
    const rect = this.canvas.elements.canvas.getBoundingClientRect();
    const scaleX = this.state.pixel.width / rect.width;
    const scaleY = this.state.pixel.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    return { x, y };
  }
  
  getSketchCoords(e) {
    const rect = this.canvas.elements.sketchCanvas.getBoundingClientRect();
    const scaleX = this.state.sketch.width / rect.width;
    const scaleY = this.state.sketch.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return { x, y };
  }
  
  handlePixelDraw(x, y, isPrimary = true) {
    if (x < 0 || y < 0 || x >= this.state.pixel.width || y >= this.state.pixel.height) return;
    
    const { width, sprites, currentFrame, activeTool, primaryColor, secondaryColor } = this.state.pixel;
    const color = isPrimary ? primaryColor : secondaryColor;
    const spriteData = sprites[currentFrame]?.data || [];
    const index = y * width + x;
    
    let newColor;
    if (activeTool === 'eraser' || activeTool.includes('Eraser')) {
      newColor = 'transparent';
    } else if (activeTool === 'eyedropper') {
      const pickedColor = spriteData[index];
      if (pickedColor && pickedColor !== 'transparent') {
        if (isPrimary) {
          this.state.pixel.primaryColor = pickedColor;
          this.canvas.elements.primaryColor.style.backgroundColor = pickedColor;
        } else {
          this.state.pixel.secondaryColor = pickedColor;
          this.canvas.elements.secondaryColor.style.backgroundColor = pickedColor;
        }
      }
      return;
    } else {
      newColor = color;
    }

    if (spriteData[index] === newColor) return;
    spriteData[index] = newColor;

    // Apply symmetry for symmetric tools
    if (activeTool.includes('symmetric') || activeTool.includes('Symmetric')) {
      this.applySymmetry(x, y, newColor);
    }

    this.canvas.drawPixelCanvas();
  }
  
  applySymmetry(x, y, color) {
    const { width, height, symmetry, sprites, currentFrame } = this.state.pixel;
    const spriteData = sprites[currentFrame]?.data || [];

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
  
  handlePixelFill(startX, startY, isPrimary = true) {
    const { width, height, sprites, currentFrame, primaryColor, secondaryColor } = this.state.pixel;
    const spriteData = sprites[currentFrame]?.data || [];
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

    this.canvas.drawPixelCanvas();
  }
  
  handleSketchDraw(x, y) {
    const { activeLayer, layers, activeTool, color, size, opacity } = this.state.sketch;
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
    
    if (!this.state.isDrawing) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    
    this.canvas.drawSketchCanvas();
  }
}

// =====================
// HISTORY MANAGEMENT
// =====================
class HistoryManager {
  constructor(state, canvasManager) {
    this.state = state;
    this.canvas = canvasManager;
  }
  
  pushHistory(action) {
  if (!action || typeof action !== 'string') {
    console.warn('Invalid history action:', action);
    return;
  }
  
  const historyState = this.state[this.state.mode];
  
  if (!historyState) {
    console.error('Invalid mode for history:', this.state.mode);
    return;
  }
  
  // Clear redo history
  historyState.history.splice(historyState.historyIndex + 1);
  
  let snapshot;
  try {
    if (this.state.mode === 'pixel') {
      snapshot = {
        action,
        sprites: this.state.pixel.sprites.map(sprite => ({
          ...sprite,
          data: [...sprite.data]
        })),
        currentFrame: this.state.pixel.currentFrame
      };
    } else {
      snapshot = {
        action,
        layers: this.state.sketch.layers.map(layer => ({
          ...layer,
          imageData: layer.canvas.toDataURL()
        })),
        activeLayer: this.state.sketch.activeLayer
      };
    }
  } catch (error) {
    console.error('Failed to create history snapshot:', error);
    return;
  }
  
  historyState.history.push(snapshot);
  historyState.historyIndex = historyState.history.length - 1;
  
  // Limit history size
  if (historyState.history.length > HISTORY_LIMITS.MAX_ENTRIES) {
    historyState.history.shift();
    historyState.historyIndex--;
  }
}
  
  applyHistorySnapshot(snapshot) {
    if (this.state.mode === 'pixel') {
      this.state.pixel.sprites = snapshot.sprites.map(sprite => ({
        ...sprite,
        data: [...sprite.data]
      }));
      this.state.pixel.currentFrame = snapshot.currentFrame;
      this.canvas.drawPixelCanvas();
    } else {
      // Restore sketch layers
      this.state.sketch.layers = snapshot.layers.map(layerData => {
        const layer = this.canvas.createSketchLayer(layerData.name);
        layer.id = layerData.id;
        layer.opacity = layerData.opacity;
        layer.blendMode = layerData.blendMode;
        layer.visible = layerData.visible;
        
        const img = new Image();
        img.onload = () => {
          layer.ctx.drawImage(img, 0, 0);
          this.canvas.drawSketchCanvas();
        };
        img.src = layerData.imageData;
        
        return layer;
      });
      
      this.state.sketch.activeLayer = snapshot.activeLayer;
      this.canvas.drawSketchCanvas();
    }
  }
  
  undo() {
    const historyState = this.state[this.state.mode];
    if (historyState.historyIndex > 0) {
      historyState.historyIndex--;
      this.applyHistorySnapshot(historyState.history[historyState.historyIndex]);
    }
  }
  
  redo() {
    const historyState = this.state[this.state.mode];
    if (historyState.historyIndex < historyState.history.length - 1) {
      historyState.historyIndex++;
      this.applyHistorySnapshot(historyState.history[historyState.historyIndex]);
    }
  }
}

// =====================
// UI MANAGER
// =====================
class UIManager {
  constructor(state, canvasManager, historyManager) {
    this.state = state;
    this.canvas = canvasManager;
    this.history = historyManager;
    this.setupPalettes();
    this.updateUI();
  }
  
  setupPalettes() {
    this.populatePaletteSelector();
    this.renderPaletteSwatches();
    this.renderCustomPalette();
  }
  
  populatePaletteSelector() {
    this.canvas.elements.paletteSelector.innerHTML = '';
    
    Object.keys(BUILT_IN_PALETTES).forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
      this.canvas.elements.paletteSelector.appendChild(option);
    });
    
    const customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.textContent = 'Custom';
    this.canvas.elements.paletteSelector.appendChild(customOption);
  }
  
  renderPaletteSwatches() {
    const selectedValue = this.canvas.elements.paletteSelector.value;
    const palette = selectedValue === 'custom' ? 
      this.state.customPalette : 
      BUILT_IN_PALETTES[selectedValue] || BUILT_IN_PALETTES.default;
    
    this.canvas.elements.swatches.innerHTML = '';
    
    palette.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'swatch';
      swatch.style.backgroundColor = color;
      swatch.dataset.color = color;
      swatch.onclick = (e) => this.handleSwatchClick(e);
      swatch.oncontextmenu = (e) => {
        e.preventDefault();
        this.handleSwatchClick(e, true);
      };
      this.canvas.elements.swatches.appendChild(swatch);
    });
  }
  
  renderCustomPalette() {
    this.canvas.elements.colorPickers.innerHTML = '';
    
    this.state.customPalette.forEach((color, index) => {
      const input = document.createElement('input');
      input.type = 'color';
      input.className = 'color-picker';
      input.value = color;
      input.dataset.index = index;
      input.onchange = () => {
        this.state.customPalette[index] = input.value;
        this.state.saveCustomPalette();
        if (this.canvas.elements.paletteSelector.value === 'custom') {
          this.renderPaletteSwatches();
        }
      };
      this.canvas.elements.colorPickers.appendChild(input);
    });
  }
  
  handleSwatchClick(e, isSecondary = false) {
    const color = e.target.dataset.color;
    if (!color) return;
    
    if (this.state.mode === 'pixel') {
      if (isSecondary) {
        this.state.pixel.secondaryColor = color;
        this.canvas.elements.secondaryColor.style.backgroundColor = color;
      } else {
        this.state.pixel.primaryColor = color;
        this.canvas.elements.primaryColor.style.backgroundColor = color;
      }
    } else if (this.state.mode === 'sketch') {
      this.state.sketch.color = color;
      this.canvas.elements.sketchColor.value = color;
    }
    
    this.updateCanvasInfo();
  }
  
  updateSpriteSelector() {
  const selector = this.canvas.elements.spriteSelector;
  if (!selector) return;
  
  selector.innerHTML = '';
  this.state.pixel.sprites.forEach((sprite, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = sprite.name || `Frame ${index + 1}`;
    option.selected = index === this.state.pixel.currentFrame;
    selector.appendChild(option);
  });
}
  
  updateLayersList() {
  const layerList = this.canvas.elements.layerList;
  if (!layerList) return;
  
  layerList.innerHTML = '';
  
  this.state.sketch.layers.forEach((layer, index) => {
    const item = document.createElement('div');
    item.className = `layer-item ${index === this.state.sketch.activeLayer ? 'active' : ''}`;
    item.dataset.index = index;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = layer.visible;
    checkbox.onclick = (e) => {
      e.stopPropagation();
      layer.visible = checkbox.checked;
      this.canvas.drawSketchCanvas();
    };
    
    const span = document.createElement('span');
    span.textContent = layer.name;
    
    item.appendChild(checkbox);
    item.appendChild(span);
    
    item.onclick = () => {
      this.state.sketch.activeLayer = index;
      this.updateLayersList();
      this.updateSketchControls();
    };
    
    layerList.appendChild(item);
  });
}
  
  updateCanvasInfo() {
  const canvasInfo = this.canvas.elements.canvasInfo;
  if (!canvasInfo) return;
  
  const { mode } = this.state;
  let info = '';
  
  if (mode === 'pixel') {
    const { width, height, activeTool, primaryColor } = this.state.pixel;
    info = `${width}×${height} | ${activeTool} | ${primaryColor}`;
  } else if (mode === 'sketch') {
    const { width, height, activeTool, color } = this.state.sketch;
    info = `${width}×${height} | ${activeTool} | ${color}`;
  }
  
  canvasInfo.textContent = info;
}
  
  updateSketchControls() {
  const { size, opacity, hardness, flow } = this.state.sketch;
  
  const elements = this.canvas.elements;
  
  if (elements.brushSize) elements.brushSize.value = size;
  if (elements.brushSizeLabel) elements.brushSizeLabel.textContent = size;
  if (elements.brushOpacity) elements.brushOpacity.value = opacity;
  if (elements.opacityLabel) elements.opacityLabel.textContent = opacity;
  if (elements.brushHardness) elements.brushHardness.value = hardness;
  if (elements.hardnessLabel) elements.hardnessLabel.textContent = hardness;
  if (elements.brushFlow) elements.brushFlow.value = flow;
  if (elements.flowLabel) elements.flowLabel.textContent = flow;
  
  // Update brush preview
  const brushPreview = elements.brushPreview;
  if (brushPreview) {
    brushPreview.style.width = `${size}px`;
    brushPreview.style.height = `${size}px`;
    brushPreview.style.backgroundColor = this.state.sketch.color;
    brushPreview.style.opacity = opacity / 100;
  }
}
  
  updateToolControls() {
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.classList.remove('active');
      
      const tool = btn.dataset.tool;
      if (this.state.mode === 'pixel' && tool === this.state.pixel.activeTool) {
        btn.classList.add('active');
      } else if (this.state.mode === 'sketch' && tool === this.state.sketch.activeTool) {
        btn.classList.add('active');
      }
    });
  }
  
  updateSymmetryDisplay() {
  document.querySelectorAll('.symmetry-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.symmetry === this.state.pixel.symmetry);
  });
  
  const mode = this.state.pixel.symmetry;
  const info = mode === 'none' ? 'No symmetry active' : 
               mode === 'horizontal' ? 'Horizontal symmetry active' :
               mode === 'vertical' ? 'Vertical symmetry active' :
               mode === 'both' ? 'Both axes symmetry active' : 'Unknown symmetry';
  
  const symmetryInfo = this.canvas.elements.symmetryInfo;
  if (symmetryInfo) {
    symmetryInfo.textContent = info;
  }
}
  
  updateUI() {
    this.updateSpriteSelector();
    this.updateLayersList();
    this.updateCanvasInfo();
    this.updateToolControls();
    this.updateSketchControls();
    this.updateSymmetryDisplay();
  }
}

// =====================
// JERRY EDITOR MAIN CLASS
// =====================
class JerryEditor {
  constructor() {
    this.state = new EditorState();
    this.canvas = new CanvasManager(this.state);
    this.tools = new DrawingTools(this.state, this.canvas);
    this.history = new HistoryManager(this.state, this.canvas);
    this.ui = new UIManager(this.state, this.canvas, this.history);
    
    this.attachEventListeners();
    this.setMode('pixel');
    
    // Initial history snapshot
    this.history.pushHistory('Initial');
    
    // PWA registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js').catch(err => 
        console.log('Service Worker registration failed:', err)
      );
    }
  }
  
  setMode(newMode) {
    if (this.state.mode === newMode) return;
    this.state.mode = newMode;

    // Update mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === newMode);
    });

    // Show/hide appropriate UI elements
    const pixelUI = document.querySelectorAll('.pixel-controls, .pixel-tools');
    const sketchUI = document.querySelectorAll('.sketch-controls, .sketch-tools');
    
    pixelUI.forEach(el => {
      el.style.display = newMode === 'pixel' ? 
        (el.classList.contains('sketch-tools') ? 'flex' : 'block') : 'none';
    });

    // Show/hide canvases
    this.canvas.elements.canvas.style.display = newMode === 'pixel' ? 'grid' : 'none';
    this.canvas.elements.sketchCanvas.style.display = newMode === 'sketch' ? 'block' : 'none';
    this.canvas.elements.selectionOverlay.style.display = newMode === 'sketch' ? 'block' : 'none';
    
    // Update grid visibility
    this.canvas.elements.canvasGrid.style.display = 
        (newMode === 'pixel' && this.state.pixel.showGrid) ? 'grid' : 'none';

    this.updateCanvasDisplay();
    this.ui.updateCanvasInfo();
    this.ui.updateToolControls();
  }
  
  updateCanvasDisplay() {
    if (this.state.mode === 'pixel') {
      const zoomFactor = this.state.pixel.zoom / 100;
      const cellSize = Math.floor(30 * zoomFactor);
      this.state.pixel.cellSize = cellSize;
      
      this.canvas.updatePixelCanvasSize();
      this.canvas.renderPixelGrid();
      this.canvas.drawPixelCanvas();
    } else if (this.state.mode === 'sketch') {
      const zoomFactor = this.state.sketch.zoom / 100;
      this.canvas.elements.sketchCanvas.style.transform = `scale(${zoomFactor})`;
      this.canvas.elements.selectionOverlay.style.transform = `scale(${zoomFactor})`;
    }
    
    this.canvas.elements.zoomIndicator.textContent = `${this.state[this.state.mode].zoom}%`;
  }
  
  adjustZoom(delta) {
    const currentState = this.state[this.state.mode];
    let newZoom;
    
    if (delta === 'reset') {
      newZoom = 100;
    } else {
      newZoom = currentState.zoom + delta;
      newZoom = Math.max(25, Math.min(800, newZoom));
    }
    
    currentState.zoom = newZoom;
    this.updateCanvasDisplay();
  }
  
  clearCanvas() {
    if (!confirm('Clear the entire canvas? This cannot be undone.')) return;
    
    this.history.pushHistory('Clear Canvas');
    
    if (this.state.mode === 'pixel') {
      const { sprites, currentFrame, width, height } = this.state.pixel;
      sprites[currentFrame].data.fill('transparent');
      this.canvas.drawPixelCanvas();
    } else if (this.state.mode === 'sketch') {
      const layer = this.state.sketch.layers[this.state.sketch.activeLayer];
      if (layer) {
        layer.ctx.clearRect(0, 0, this.state.sketch.width, this.state.sketch.height);
        this.canvas.drawSketchCanvas();
      }
    }
  }
  
  resizeCanvas() {
  const widthInput = this.canvas.elements.canvasWidth;
  const heightInput = this.canvas.elements.canvasHeight;
  
  if (!widthInput || !heightInput) {
    console.error('Canvas size inputs not found');
    return;
  }
  
  const newWidth = parseInt(widthInput.value);
  const newHeight = parseInt(heightInput.value);
  
  // Validate input
  if (isNaN(newWidth) || isNaN(newHeight)) {
    alert('Please enter valid numbers for canvas size');
    return;
  }
  
  if (newWidth < CANVAS_LIMITS.MIN_SIZE || newWidth > CANVAS_LIMITS.MAX_SIZE ||
      newHeight < CANVAS_LIMITS.MIN_SIZE || newHeight > CANVAS_LIMITS.MAX_SIZE) {
    alert(`Canvas size must be between ${CANVAS_LIMITS.MIN_SIZE}×${CANVAS_LIMITS.MIN_SIZE} and ${CANVAS_LIMITS.MAX_SIZE}×${CANVAS_LIMITS.MAX_SIZE}`);
    return;
  }
  
  this.history.pushHistory('Resize Canvas');
  
  if (this.state.mode === 'pixel') {
    const oldWidth = this.state.pixel.width;
    const oldHeight = this.state.pixel.height;
    
    this.state.pixel.width = newWidth;
    this.state.pixel.height = newHeight;
    
    // Resize all sprites
    this.state.pixel.sprites.forEach(sprite => {
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
    
    this.canvas.updatePixelCanvasSize();
    this.canvas.renderPixelGrid();
    this.canvas.drawPixelCanvas();
  }
  
  this.ui.updateCanvasInfo();
}
  
  newSprite() {
    const { width, height } = this.state.pixel;
    const newSprite = {
      id: Date.now(),
      name: `Frame ${this.state.pixel.sprites.length + 1}`,
      data: new Array(width * height).fill('transparent')
    };
    
    this.state.pixel.sprites.push(newSprite);
    this.state.pixel.currentFrame = this.state.pixel.sprites.length - 1;
    
    this.ui.updateSpriteSelector();
    this.canvas.drawPixelCanvas();
    this.history.pushHistory('New Sprite');
  }
  
  duplicateSprite() {
    const { sprites, currentFrame } = this.state.pixel;
    const currentSprite = sprites[currentFrame];
    
    const newSprite = {
      id: Date.now(),
      name: `${currentSprite.name} Copy`,
      data: [...currentSprite.data]
    };
    
    sprites.splice(currentFrame + 1, 0, newSprite);
    this.state.pixel.currentFrame = currentFrame + 1;
    
    this.ui.updateSpriteSelector();
    this.canvas.drawPixelCanvas();
    this.history.pushHistory('Duplicate Sprite');
  }
  
  deleteSprite() {
    if (this.state.pixel.sprites.length <= 1) {
      alert('Cannot delete the last sprite.');
      return;
    }
    
    this.state.pixel.sprites.splice(this.state.pixel.currentFrame, 1);
    this.state.pixel.currentFrame = Math.max(0, this.state.pixel.currentFrame - 1);
    
    this.ui.updateSpriteSelector();
    this.canvas.drawPixelCanvas();
    this.history.pushHistory('Delete Sprite');
  }
  
  addLayer() {
    const newLayer = this.canvas.createSketchLayer(`Layer ${this.state.sketch.layers.length + 1}`);
    this.state.sketch.layers.push(newLayer);
    this.state.sketch.activeLayer = this.state.sketch.layers.length - 1;
    
    this.ui.updateLayersList();
    this.history.pushHistory('Add Layer');
  }
  
  setSymmetryMode(mode) {
    this.state.pixel.symmetry = mode;
    this.ui.updateSymmetryDisplay();
  }
  
  transformSelection(type, value) {
    if (this.state.mode !== 'pixel') return;
    
    this.history.pushHistory(`Transform ${type}`);
    
    const { width, height, sprites, currentFrame } = this.state.pixel;
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
    this.canvas.drawPixelCanvas();
  }
  
  newProject() {
    if (!confirm('Start a new project? All unsaved work will be lost.')) return;
    
    // Reset pixel state
    this.state.pixel = {
      width: 16,
      height: 16,
      cellSize: 30,
      zoom: 100,
      sprites: [{ id: 1, name: 'Frame 1', data: new Array(16 * 16).fill('transparent') }],
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
    this.state.sketch = {
      width: 800,
      height: 600,
      layers: [this.canvas.createSketchLayer('Layer 1')],
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
    
    this.canvas.elements.canvasWidth.value = 16;
    this.canvas.elements.canvasHeight.value = 16;
    
    this.setMode('pixel');
    this.ui.updateUI();
    this.updateCanvasDisplay();
    this.history.pushHistory('New Project');
  }
  
  exportJSON() {
    const projectData = {
      version: '1.0',
      mode: this.state.mode,
      pixel: {
        width: this.state.pixel.width,
        height: this.state.pixel.height,
        sprites: this.state.pixel.sprites,
        primaryColor: this.state.pixel.primaryColor,
        secondaryColor: this.state.pixel.secondaryColor
      },
      sketch: {
        width: this.state.sketch.width,
        height: this.state.sketch.height,
        layers: this.state.sketch.layers.map(layer => ({
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
    this.canvas.elements.output.value = json;
    
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
  
  exportPNG() {
    let canvas, filename;
    
    if (this.state.mode === 'pixel') {
      canvas = this.canvas.elements.pixelCanvas;
      filename = 'pixel_art.png';
    } else {
      canvas = this.canvas.elements.sketchCanvas;
      filename = 'sketch.png';
    }
    
    const scale = parseInt(prompt('Export scale (1-10):', '4')) || 4;
    
    // Create scaled canvas
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = canvas.width * scale;
    scaledCanvas.height = canvas.height * scale;
    const ctx = scaledCanvas.getContext('2d');
    
    if (this.state.mode === 'pixel') {
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
  
  importProject(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        this.loadProjectData(data);
        alert('Project imported successfully!');
      } catch (error) {
        alert('Error importing project: Invalid file format.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  }
  
  loadProjectData(data) {
    if (data.pixel) {
      this.state.pixel.width = data.pixel.width || 16;
      this.state.pixel.height = data.pixel.height || 16;
      this.state.pixel.sprites = data.pixel.sprites || [{ id: 1, name: 'Frame 1', data: new Array(256).fill('transparent') }];
      this.state.pixel.primaryColor = data.pixel.primaryColor || '#000000';
      this.state.pixel.secondaryColor = data.pixel.secondaryColor || '#ffffff';
      this.state.pixel.currentFrame = 0;
      
      this.canvas.elements.canvasWidth.value = this.state.pixel.width;
      this.canvas.elements.canvasHeight.value = this.state.pixel.height;
      this.canvas.elements.primaryColor.style.backgroundColor = this.state.pixel.primaryColor;
      this.canvas.elements.secondaryColor.style.backgroundColor = this.state.pixel.secondaryColor;
    }
    
    if (data.sketch && data.sketch.layers) {
      this.state.sketch.width = data.sketch.width || 800;
      this.state.sketch.height = data.sketch.height || 600;
      this.state.sketch.layers = [];
      
      data.sketch.layers.forEach(layerData => {
        const layer = this.canvas.createSketchLayer(layerData.name);
        layer.id = layerData.id;
        layer.opacity = layerData.opacity;
        layer.blendMode = layerData.blendMode;
        layer.visible = layerData.visible;
        
        if (layerData.imageData) {
          const img = new Image();
          img.onload = () => {
            layer.ctx.drawImage(img, 0, 0);
            this.canvas.drawSketchCanvas();
          };
          img.src = layerData.imageData;
        }
        
        this.state.sketch.layers.push(layer);
      });
      
      this.state.sketch.activeLayer = 0;
    }
    
    this.setMode(data.mode || 'pixel');
    this.ui.updateUI();
    this.updateCanvasDisplay();
    this.history.pushHistory('Import Project');
  }
  
  attachEventListeners() {
  this.attachModeControls();
  this.attachToolControls();
  this.attachCanvasControls();
  this.attachColorControls();
  this.attachSpriteControls();
  this.attachSketchControls();
  this.attachLayerControls();
  this.attachTransformControls();
  this.attachExportControls();
  this.attachKeyboardShortcuts();
  this.attachCanvasInteraction();
}

attachModeControls() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.onclick = () => this.setMode(btn.dataset.mode);
  });
}

attachToolControls() {
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.onclick = () => {
      const tool = btn.dataset.tool;
      if (this.state.mode === 'pixel') {
        this.state.pixel.activeTool = tool;
      } else {
        this.state.sketch.activeTool = tool;
      }
      this.ui.updateToolControls();
      this.ui.updateCanvasInfo();
    };
  });
}

attachCanvasControls() {
  const controls = {
    undo: () => this.history.undo(),
    redo: () => this.history.redo(),
    clear: () => this.clearCanvas(),
    resizeCanvas: () => this.resizeCanvas(),
    zoomIn: () => this.adjustZoom(25),
    zoomOut: () => this.adjustZoom(-25),
    zoomReset: () => this.adjustZoom('reset')
  };
  
  Object.entries(controls).forEach(([id, handler]) => {
    const element = this.canvas.elements[id];
    if (element) element.onclick = handler;
  });
  
  // Grid toggle
  const gridToggle = this.canvas.elements.gridToggle;
  if (gridToggle) {
    gridToggle.onchange = () => {
      this.state.pixel.showGrid = gridToggle.checked;
      this.canvas.elements.canvasGrid.style.display = 
        (this.state.mode === 'pixel' && this.state.pixel.showGrid) ? 'grid' : 'none';
    };
  }
}

attachColorControls() {
  const elements = this.canvas.elements;
  
  // Palette selector
  if (elements.paletteSelector) {
    elements.paletteSelector.onchange = () => this.ui.renderPaletteSwatches();
  }
  
  // Primary color swap
  if (elements.primaryColor) {
    elements.primaryColor.onclick = () => {
      const temp = this.state.pixel.primaryColor;
      this.state.pixel.primaryColor = this.state.pixel.secondaryColor;
      this.state.pixel.secondaryColor = temp;
      elements.primaryColor.style.backgroundColor = this.state.pixel.primaryColor;
      elements.secondaryColor.style.backgroundColor = this.state.pixel.secondaryColor;
      this.ui.updateCanvasInfo();
    };
  }
  
  // Save custom palette
  if (elements.saveCustomPalette) {
    elements.saveCustomPalette.onclick = () => {
      this.state.saveCustomPalette();
      alert('Custom palette saved!');
    };
  }
}

attachSpriteControls() {
  const elements = this.canvas.elements;
  
  if (elements.spriteSelector) {
    elements.spriteSelector.onchange = (e) => {
      this.state.pixel.currentFrame = parseInt(e.target.value);
      this.canvas.drawPixelCanvas();
    };
  }
  
  const spriteControls = {
    newSprite: () => this.newSprite(),
    duplicateSprite: () => this.duplicateSprite(),
    deleteSprite: () => this.deleteSprite()
  };
  
  Object.entries(spriteControls).forEach(([id, handler]) => {
    if (elements[id]) elements[id].onclick = handler;
  });
  
  // Symmetry controls
  document.querySelectorAll('.symmetry-btn').forEach(btn => {
    btn.onclick = () => this.setSymmetryMode(btn.dataset.symmetry);
  });
}

attachSketchControls() {
  const elements = this.canvas.elements;
  
  // Sketch color
  if (elements.sketchColor) {
    elements.sketchColor.oninput = () => {
      this.state.sketch.color = elements.sketchColor.value;
      this.ui.updateCanvasInfo();
      this.ui.updateSketchControls();
    };
  }
  
  // Brush controls
  const sketchInputs = {
    brushSize: 'size',
    brushOpacity: 'opacity', 
    brushHardness: 'hardness',
    brushFlow: 'flow'
  };
  
  Object.entries(sketchInputs).forEach(([elementId, property]) => {
    const element = elements[elementId];
    if (element) {
      element.oninput = () => {
        this.state.sketch[property] = parseInt(element.value);
        this.ui.updateSketchControls();
      };
    }
  });
}

attachLayerControls() {
  const elements = this.canvas.elements;
  
  if (elements.addLayer) {
    elements.addLayer.onclick = () => this.addLayer();
  }
  
  if (elements.layerOpacity) {
    elements.layerOpacity.oninput = () => {
      const layer = this.state.sketch.layers[this.state.sketch.activeLayer];
      if (layer) {
        layer.opacity = parseInt(elements.layerOpacity.value);
        if (elements.layerOpacityLabel) {
          elements.layerOpacityLabel.textContent = layer.opacity;
        }
        this.canvas.drawSketchCanvas();
      }
    };
  }
  
  if (elements.blendMode) {
    elements.blendMode.onchange = () => {
      const layer = this.state.sketch.layers[this.state.sketch.activeLayer];
      if (layer) {
        layer.blendMode = elements.blendMode.value;
        this.canvas.drawSketchCanvas();
      }
    };
  }
}

attachTransformControls() {
  const transformControls = {
    rotateLeft: () => this.transformSelection('rotate', -90),
    rotate180: () => this.transformSelection('rotate', 180),
    rotateRight: () => this.transformSelection('rotate', 90),
    flipHorizontal: () => this.transformSelection('flip', 'H'),
    flipVertical: () => this.transformSelection('flip', 'V')
  };
  
  Object.entries(transformControls).forEach(([id, handler]) => {
    const element = this.canvas.elements[id];
    if (element) element.onclick = handler;
  });
}

attachExportControls() {
  const exportControls = {
    newProject: () => this.newProject(),
    exportJSON: () => this.exportJSON(),
    exportPNG: () => this.exportPNG(),
    exportPNG2: () => this.exportPNG()
  };
  
  Object.entries(exportControls).forEach(([id, handler]) => {
    const element = this.canvas.elements[id];
    if (element) element.onclick = handler;
  });
  
  if (this.canvas.elements.importFile) {
    this.canvas.elements.importFile.onchange = (e) => this.importProject(e);
  }
}

attachCanvasInteraction() {
  const canvases = [
    this.canvas.elements.canvas, 
    this.canvas.elements.sketchCanvas, 
    this.canvas.elements.selectionOverlay
  ].filter(Boolean);
  
  canvases.forEach(canvas => {
    canvas.onpointerdown = (e) => this.handlePointerDown(e);
    canvas.oncontextmenu = (e) => e.preventDefault();
    canvas.ontouchstart = (e) => e.preventDefault();
  });
  
  document.onpointermove = (e) => this.handlePointerMove(e);
  document.onpointerup = (e) => this.handlePointerUp(e);
}

attachKeyboardShortcuts() {
  document.onkeydown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      this.handleControlShortcuts(e);
    } else {
      this.handleToolShortcuts(e);
    }
    
    this.state.isShiftPressed = e.shiftKey;
    this.state.isCtrlPressed = e.ctrlKey || e.metaKey;
  };
  
  document.onkeyup = (e) => {
    this.state.isShiftPressed = e.shiftKey;
    this.state.isCtrlPressed = e.ctrlKey || e.metaKey;
  };
}

handleControlShortcuts(e) {
  const shortcuts = {
    'z': () => e.shiftKey ? this.history.redo() : this.history.undo(),
    'y': () => this.history.redo(),
    's': () => this.exportJSON(),
    'n': () => this.newProject(),
    'e': () => this.exportPNG()
  };
  
  const handler = shortcuts[e.key];
  if (handler) {
    e.preventDefault();
    handler();
  }
}

handleToolShortcuts(e) {
  const pixelTools = {
    'b': 'pencil', 'e': 'eraser', 'i': 'eyedropper', 'g': 'fill',
    'l': 'line', 'r': 'rect', 'o': 'circle', 'm': 'select', 'v': 'move'
  };
  
  const sketchTools = {
    'b': 'brush', 'p': 'pen', 'm': 'marker', 'c': 'pencilSketch', 
    'h': 'charcoal', 'e': 'eraser', 's': 'smudge', 'u': 'blur'
  };
  
  if (this.state.mode === 'pixel' && pixelTools[e.key]) {
    this.state.pixel.activeTool = pixelTools[e.key];
    this.ui.updateToolControls();
    this.ui.updateCanvasInfo();
  } else if (this.state.mode === 'sketch' && sketchTools[e.key]) {
    this.state.sketch.activeTool = sketchTools[e.key];
    this.ui.updateToolControls();
    this.ui.updateCanvasInfo();
  }
}
  
  handlePointerDown(e) {
    e.preventDefault();
    this.state.isDrawing = true;
    
    if (this.state.mode === 'pixel') {
      const { x, y } = this.tools.getPixelCoords(e);
      this.state.lastPos = this.state.toolStartPos = { x, y };
      
      const isPrimary = e.button === 0;
      const { activeTool } = this.state.pixel;
      
      if (activeTool === 'fill' || activeTool === 'symmetricFill') {
        this.history.pushHistory('Fill');
        this.tools.handlePixelFill(x, y, isPrimary);
        this.state.isDrawing = false;
      } else if (activeTool.includes('pencil') || activeTool.includes('eraser') || 
                 activeTool.includes('Pencil') || activeTool.includes('Eraser')) {
        this.history.pushHistory('Draw Stroke');
        this.tools.handlePixelDraw(x, y, isPrimary);
      }
    } else if (this.state.mode === 'sketch') {
      const { x, y } = this.tools.getSketchCoords(e);
      this.state.lastPos = { x, y };
      this.history.pushHistory('Sketch Stroke');
      this.tools.handleSketchDraw(x, y);
    }
  }
  
  handlePointerMove(e) {
    if (!this.state.isDrawing) return;
    
    if (this.state.mode === 'pixel') {
      const { x, y } = this.tools.getPixelCoords(e);
      const { activeTool } = this.state.pixel;
      
      if (activeTool.includes('pencil') || activeTool.includes('eraser') ||
          activeTool.includes('Pencil') || activeTool.includes('Eraser')) {
        
        // Draw line between last position and current position
        const dx = Math.abs(x - this.state.lastPos.x);
        const dy = Math.abs(y - this.state.lastPos.y);
        const sx = this.state.lastPos.x < x ? 1 : -1;
        const sy = this.state.lastPos.y < y ? 1 : -1;
        let err = dx - dy;
        
        let currentX = this.state.lastPos.x;
        let currentY = this.state.lastPos.y;
        
        while (true) {
          this.tools.handlePixelDraw(currentX, currentY, e.buttons === 1);
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
        
        this.state.lastPos = { x, y };
      }
    } else if (this.state.mode === 'sketch') {
      const { x, y } = this.tools.getSketchCoords(e);
      this.tools.handleSketchDraw(x, y);
      this.state.lastPos = { x, y };
    }
  }
  
  handlePointerUp(e) {
    if (this.state.isDrawing && this.state.mode === 'sketch') {
      const layer = this.state.sketch.layers[this.state.sketch.activeLayer];
      if (layer) {
        layer.ctx.closePath();
      }
    }
    this.state.isDrawing = false;
  }
}

sketchUI.forEach(el => {
      el.style.display = newMode === 'sketch' ? 
        (el.classList.contains('sketch-tools') ? 'flex' : 'block') : 'none';
    });

    // Show/hide canvases
    this.canvas.elements.canvas.style.display = newMode === 'pixel' ? 'grid' : 'none';
    this.canvas.elements.sketchCanvas.style.display = newMode === 'sketch' ? 'block' : 'none';
    this.canvas.elements.selectionOverlay.style.display = newMode === 'sketch' ? 'block' : 'none';
    
    // Update grid visibility
    this.canvas.elements.canvasGrid.style.display = 
        (newMode === 'pixel' && this.state.pixel.showGrid) ? 'grid' : 'none';

    this.updateCanvasDisplay();
    this.ui.updateCanvasInfo();
    this.ui.updateToolControls();
  }
  
  updateCanvasDisplay() {
    if (this.state.mode === 'pixel') {
      const zoomFactor = this.state.pixel.zoom / 100;
      const cellSize = Math.floor(30 * zoomFactor);
      this.state.pixel.cellSize = cellSize;
      
      this.canvas.updatePixelCanvasSize();
      this.canvas.renderPixelGrid();
      this.canvas.drawPixelCanvas();
    } else if (this.state.mode === 'sketch') {
      const zoomFactor = this.state.sketch.zoom / 100;
      this.canvas.elements.sketchCanvas.style.transform = `scale(${zoomFactor})`;
      this.canvas.elements.selectionOverlay.style.transform = `scale(${zoomFactor})`;
    }
    
    this.canvas.elements.zoomIndicator.textContent = `${this.state[this.state.mode].zoom}%`;
  }
  
  adjustZoom(delta) {
  const currentState = this.state[this.state.mode];
  let newZoom;
  
  if (delta === 'reset') {
    newZoom = 100;
  } else {
    newZoom = currentState.zoom + delta;
    newZoom = Math.max(CANVAS_LIMITS.MIN_ZOOM, Math.min(CANVAS_LIMITS.MAX_ZOOM, newZoom));
  }
  
  currentState.zoom = newZoom;
  this.updateCanvasDisplay();
}
  
  clearCanvas() {
    if (!confirm('Clear the entire canvas? This cannot be undone.')) return;
    
    this.history.pushHistory('Clear Canvas');
    
    if (this.state.mode === 'pixel') {
      const { sprites, currentFrame, width, height } = this.state.pixel;
      sprites[currentFrame].data.fill('transparent');
      this.canvas.drawPixelCanvas();
    } else if (this.state.mode === 'sketch') {
      const layer = this.state.sketch.layers[this.state.sketch.activeLayer];
      if (layer) {
        layer.ctx.clearRect(0, 0, this.state.sketch.width, this.state.sketch.height);
        this.canvas.drawSketchCanvas();
      }
    }
  }
  
  resizeCanvas() {
    const newWidth = parseInt(this.canvas.elements.canvasWidth.value);
    const newHeight = parseInt(this.canvas.elements.canvasHeight.value);
    
    if (newWidth < 1 || newHeight > 128 || newHeight < 1 || newWidth > 128) {
      alert('Canvas size must be between 1×1 and 128×128');
      return;
    }
    
    this.history.pushHistory('Resize Canvas');
    
    if (this.state.mode === 'pixel') {
      const oldWidth = this.state.pixel.width;
      const oldHeight = this.state.pixel.height;
      
      this.state.pixel.width = newWidth;
      this.state.pixel.height = newHeight;
      
      // Resize all sprites
      this.state.pixel.sprites.forEach(sprite => {
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
      
      this.canvas.updatePixelCanvasSize();
      this.canvas.renderPixelGrid();
      this.canvas.drawPixelCanvas();
    }
    
    this.ui.updateCanvasInfo();
  }
  
  newSprite() {
    const { width, height } = this.state.pixel;
    const newSprite = {
      id: Date.now(),
      name: `Frame ${this.state.pixel.sprites.length + 1}`,
      data: new Array(width * height).fill('transparent')
    };
    
    this.state.pixel.sprites.push(newSprite);
    this.state.pixel.currentFrame = this.state.pixel.sprites.length - 1;
    
    this.ui.updateSpriteSelector();
    this.canvas.drawPixelCanvas();
    this.history.pushHistory('New Sprite');
  }
  
  duplicateSprite() {
    const { sprites, currentFrame } = this.state.pixel;
    const currentSprite = sprites[currentFrame];
    
    const newSprite = {
      id: Date.now(),
      name: `${currentSprite.name} Copy`,
      data: [...currentSprite.data]
    };
    
    sprites.splice(currentFrame + 1, 0, newSprite);
    this.state.pixel.currentFrame = currentFrame + 1;
    
    this.ui.updateSpriteSelector();
    this.canvas.drawPixelCanvas();
    this.history.pushHistory('Duplicate Sprite');
  }
  
  deleteSprite() {
    if (this.state.pixel.sprites.length <= 1) {
      alert('Cannot delete the last sprite.');
      return;
    }
    
    this.state.pixel.sprites.splice(this.state.pixel.currentFrame, 1);
    this.state.pixel.currentFrame = Math.max(0, this.state.pixel.currentFrame - 1);
    
    this.ui.updateSpriteSelector();
    this.canvas.drawPixelCanvas();
    this.history.pushHistory('Delete Sprite');
  }
  
  addLayer() {
    const newLayer = this.canvas.createSketchLayer(`Layer ${this.state.sketch.layers.length + 1}`);
    this.state.sketch.layers.push(newLayer);
    this.state.sketch.activeLayer = this.state.sketch.layers.length - 1;
    
    this.ui.updateLayersList();
    this.history.pushHistory('Add Layer');
  }
  
  setSymmetryMode(mode) {
    this.state.pixel.symmetry = mode;
    this.ui.updateSymmetryDisplay();
  }
  
  transformSelection(type, value) {
    if (this.state.mode !== 'pixel') return;
    
    this.history.pushHistory(`Transform ${type}`);
    
    const { width, height, sprites, currentFrame } = this.state.pixel;
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
    this.canvas.drawPixelCanvas();
  }
  
  newProject() {
    if (!confirm('Start a new project? All unsaved work will be lost.')) return;
    
    // Reset pixel state
    this.state.pixel = {
      width: 16,
      height: 16,
      cellSize: 30,
      zoom: 100,
      sprites: [{ id: 1, name: 'Frame 1', data: new Array(16 * 16).fill('transparent') }],
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
    this.state.sketch = {
      width: 800,
      height: 600,
      layers: [this.canvas.createSketchLayer('Layer 1')],
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
    
    this.canvas.elements.canvasWidth.value = 16;
    this.canvas.elements.canvasHeight.value = 16;
    
    this.setMode('pixel');
    this.ui.updateUI();
    this.updateCanvasDisplay();
    this.history.pushHistory('New Project');
  }
  
  exportJSON() {
    const projectData = {
      version: '1.0',
      mode: this.state.mode,
      pixel: {
        width: this.state.pixel.width,
        height: this.state.pixel.height,
        sprites: this.state.pixel.sprites,
        primaryColor: this.state.pixel.primaryColor,
        secondaryColor: this.state.pixel.secondaryColor
      },
      sketch: {
        width: this.state.sketch.width,
        height: this.state.sketch.height,
        layers: this.state.sketch.layers.map(layer => ({
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
    this.canvas.elements.output.value = json;
    
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
  
  exportPNG() {
    let canvas, filename;
    
    if (this.state.mode === 'pixel') {
      canvas = this.canvas.elements.pixelCanvas;
      filename = 'pixel_art.png';
    } else {
      canvas = this.canvas.elements.sketchCanvas;
      filename = 'sketch.png';
    }
    
    const scale = parseInt(prompt('Export scale (1-10):', '4')) || 4;
    
    // Create scaled canvas
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = canvas.width * scale;
    scaledCanvas.height = canvas.height * scale;
    const ctx = scaledCanvas.getContext('2d');
    
    if (this.state.mode === 'pixel') {
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
  
  saveProject() {
    this.exportJSON();
  }
  
  importProject(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        this.loadProjectData(data);
        alert('Project imported successfully!');
      } catch (error) {
        alert('Error importing project: Invalid file format.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  }
  
  loadProjectData(data) {
    if (data.pixel) {
      this.state.pixel.width = data.pixel.width || 16;
      this.state.pixel.height = data.pixel.height || 16;
      this.state.pixel.sprites = data.pixel.sprites || [{ id: 1, name: 'Frame 1', data: new Array(256).fill('transparent') }];
      this.state.pixel.primaryColor = data.pixel.primaryColor || '#000000';
      this.state.pixel.secondaryColor = data.pixel.secondaryColor || '#ffffff';
      this.state.pixel.currentFrame = 0;
      
      this.canvas.elements.canvasWidth.value = this.state.pixel.width;
      this.canvas.elements.canvasHeight.value = this.state.pixel.height;
      this.canvas.elements.primaryColor.style.backgroundColor = this.state.pixel.primaryColor;
      this.canvas.elements.secondaryColor.style.backgroundColor = this.state.pixel.secondaryColor;
    }
    
    if (data.sketch && data.sketch.layers) {
      this.state.sketch.width = data.sketch.width || 800;
      this.state.sketch.height = data.sketch.height || 600;
      this.state.sketch.layers = [];
      
      data.sketch.layers.forEach(layerData => {
        const layer = this.canvas.createSketchLayer(layerData.name);
        layer.id = layerData.id;
        layer.opacity = layerData.opacity;
        layer.blendMode = layerData.blendMode;
        layer.visible = layerData.visible;
        
        if (layerData.imageData) {
          const img = new Image();
          img.onload = () => {
            layer.ctx.drawImage(img, 0, 0);
            this.canvas.drawSketchCanvas();
          };
          img.src = layerData.imageData;
        }
        
        this.state.sketch.layers.push(layer);
      });
      
      this.state.sketch.activeLayer = 0;
    }
    
    this.setMode(data.mode || 'pixel');
    this.ui.updateUI();
    this.updateCanvasDisplay();
    this.history.pushHistory('Import Project');
  }
  
  // Enhanced sketch drawing with different brush types
  drawWithBrush(ctx, x, y, tool) {
    const { size, opacity, hardness, flow, color } = this.state.sketch;
    
    ctx.globalAlpha = (opacity / 100) * (flow / 100);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    switch (tool) {
      case 'brush':
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        ctx.globalCompositeOperation = 'source-over';
        break;
        
      case 'pen':
        ctx.lineWidth = Math.max(1, size * 0.7);
        ctx.strokeStyle = color;
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineCap = 'square';
        break;
        
      case 'marker':
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.3;
        break;
        
      case 'pencilSketch':
        ctx.lineWidth = Math.max(1, size * 0.5);
        ctx.strokeStyle = color;
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.6;
        break;
        
      case 'charcoal':
        ctx.lineWidth = size * 1.5;
        ctx.strokeStyle = '#2a2a2a';
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.4;
        break;
        
      case 'sprayPaint':
        this.drawSprayPaint(ctx, x, y);
        return;
    }
    
    if (!this.state.isDrawing) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }
  
  drawSprayPaint(ctx, x, y) {
    const { size, opacity, color } = this.state.sketch;
    const density = 20;
    
    ctx.globalAlpha = opacity / 100 * 0.1;
    ctx.fillStyle = color;
    ctx.globalCompositeOperation = 'source-over';
    
    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * size / 2;
      const sprayX = x + Math.cos(angle) * distance;
      const sprayY = y + Math.sin(angle) * distance;
      
      ctx.beginPath();
      ctx.arc(sprayX, sprayY, Math.random() * 2 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Drawing tools for pixel mode
  drawPixelLine(startX, startY, endX, endY, color) {
    const { width, sprites, currentFrame } = this.state.pixel;
    const spriteData = sprites[currentFrame].data;
    
    const dx = Math.abs(endX - startX);
    const dy = Math.abs(endY - startY);
    const sx = startX < endX ? 1 : -1;
    const sy = startY < endY ? 1 : -1;
    let err = dx - dy;
    
    let x = startX;
    let y = startY;
    
    while (true) {
      if (x >= 0 && x < width && y >= 0 && y < this.state.pixel.height) {
        const index = y * width + x;
        spriteData[index] = color;
      }
      
      if (x === endX && y === endY) break;
      
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
    
    this.canvas.drawPixelCanvas();
  }
  
  drawPixelRect(startX, startY, endX, endY, color, filled = false) {
    const { width, sprites, currentFrame } = this.state.pixel;
    const spriteData = sprites[currentFrame].data;
    
    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);
    
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (filled || x === minX || x === maxX || y === minY || y === maxY) {
          if (x >= 0 && x < width && y >= 0 && y < this.state.pixel.height) {
            const index = y * width + x;
            spriteData[index] = color;
          }
        }
      }
    }
    
    this.canvas.drawPixelCanvas();
  }
  
  drawPixelCircle(centerX, centerY, endX, endY, color, filled = false) {
    const { width, sprites, currentFrame } = this.state.pixel;
    const spriteData = sprites[currentFrame].data;
    
    const radius = Math.round(Math.sqrt(Math.pow(endX - centerX, 2) + Math.pow(endY - centerY, 2)));
    
    for (let y = -radius; y <= radius; y++) {
      for (let x = -radius; x <= radius; x++) {
        const distance = Math.sqrt(x * x + y * y);
        
        if ((filled && distance <= radius) || (!filled && Math.abs(distance - radius) < 0.5)) {
          const pixelX = centerX + x;
          const pixelY = centerY + y;
          
          if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < this.state.pixel.height) {
            const index = pixelY * width + pixelX;
            spriteData[index] = color;
          }
        }
      }
    }
    
    this.canvas.drawPixelCanvas();
  }
  
  // Touch and mobile support
  handleTouchStart(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const pointerEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        button: 0,
        buttons: 1
      };
      this.handlePointerDown(pointerEvent);
    }
  }
  
  handleTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 1 && this.state.isDrawing) {
      const touch = e.touches[0];
      const pointerEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        buttons: 1
      };
      this.handlePointerMove(pointerEvent);
    }
  }
  
  handleTouchEnd(e) {
    e.preventDefault();
    this.handlePointerUp({});
  }
  
  attachEventListeners() {
    // Mode toggle
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.onclick = () => this.setMode(btn.dataset.mode);
    });
    
    // Tool selection
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.onclick = () => {
        const tool = btn.dataset.tool;
        if (this.state.mode === 'pixel') {
          this.state.pixel.activeTool = tool;
        } else {
          this.state.sketch.activeTool = tool;
        }
        this.ui.updateToolControls();
        this.ui.updateCanvasInfo();
      };
    });
    
    // Canvas interaction - Desktop
    const canvases = [this.canvas.elements.canvas, this.canvas.elements.sketchCanvas, this.canvas.elements.selectionOverlay];
    canvases.forEach(canvas => {
      if (canvas) {
        canvas.onpointerdown = (e) => this.handlePointerDown(e);
        canvas.oncontextmenu = (e) => e.preventDefault();
        
        // Touch events for mobile
        canvas.ontouchstart = (e) => this.handleTouchStart(e);
        canvas.ontouchmove = (e) => this.handleTouchMove(e);
        canvas.ontouchend = (e) => this.handleTouchEnd(e);
      }
    });
    
    document.onpointermove = (e) => this.handlePointerMove(e);
    document.onpointerup = (e) => this.handlePointerUp(e);
    
    // Header controls
    if (this.canvas.elements.newProject) this.canvas.elements.newProject.onclick = () => this.newProject();
    if (this.canvas.elements.saveProject) this.canvas.elements.saveProject.onclick = () => this.saveProject();
    if (this.canvas.elements.exportPNG) this.canvas.elements.exportPNG.onclick = () => this.exportPNG();
    
    // Canvas controls
    if (this.canvas.elements.undo) this.canvas.elements.undo.onclick = () => this.history.undo();
    if (this.canvas.elements.redo) this.canvas.elements.redo.onclick = () => this.history.redo();
    if (this.canvas.elements.clear) this.canvas.elements.clear.onclick = () => this.clearCanvas();
    if (this.canvas.elements.resizeCanvas) this.canvas.elements.resizeCanvas.onclick = () => this.resizeCanvas();
    
    // Zoom controls
    if (this.canvas.elements.zoomIn) this.canvas.elements.zoomIn.onclick = () => this.adjustZoom(25);
    if (this.canvas.elements.zoomOut) this.canvas.elements.zoomOut.onclick = () => this.adjustZoom(-25);
    if (this.canvas.elements.zoomReset) this.canvas.elements.zoomReset.onclick = () => this.adjustZoom('reset');
    
    // Grid toggle
    if (this.canvas.elements.gridToggle) {
      this.canvas.elements.gridToggle.onchange = () => {
        this.state.pixel.showGrid = this.canvas.elements.gridToggle.checked;
        this.canvas.elements.canvasGrid.style.display = 
          (this.state.mode === 'pixel' && this.state.pixel.showGrid) ? 'grid' : 'none';
      };
    }
    
    // Color controls
    if (this.canvas.elements.primaryColor) {
      this.canvas.elements.primaryColor.onclick = () => {
        const temp = this.state.pixel.primaryColor;
        this.state.pixel.primaryColor = this.state.pixel.secondaryColor;
        this.state.pixel.secondaryColor = temp;
        this.canvas.elements.primaryColor.style.backgroundColor = this.state.pixel.primaryColor;
        this.canvas.elements.secondaryColor.style.backgroundColor = this.state.pixel.secondaryColor;
        this.ui.updateCanvasInfo();
      };
    }
    
    // Palette controls
    if (this.canvas.elements.paletteSelector) this.canvas.elements.paletteSelector.onchange = () => this.ui.renderPaletteSwatches();
    if (this.canvas.elements.saveCustomPalette) this.canvas.elements.saveCustomPalette.onclick = () => {
      this.state.saveCustomPalette();
      alert('Custom palette saved!');
    };
    
    // Sprite controls
    if (this.canvas.elements.spriteSelector) {
      this.canvas.elements.spriteSelector.onchange = (e) => {
        this.state.pixel.currentFrame = parseInt(e.target.value);
        this.canvas.drawPixelCanvas();
      };
    }
    if (this.canvas.elements.newSprite) this.canvas.elements.newSprite.onclick = () => this.newSprite();
    if (this.canvas.elements.duplicateSprite) this.canvas.elements.duplicateSprite.onclick = () => this.duplicateSprite();
    if (this.canvas.elements.deleteSprite) this.canvas.elements.deleteSprite.onclick = () => this.deleteSprite();
    
    // Symmetry controls
    document.querySelectorAll('.symmetry-btn').forEach(btn => {
      btn.onclick = () => this.setSymmetryMode(btn.dataset.symmetry);
    });
    
    // Transform controls
    if (this.canvas.elements.rotateLeft) this.canvas.elements.rotateLeft.onclick = () => this.transformSelection('rotate', -90);
    if (this.canvas.elements.rotate180) this.canvas.elements.rotate180.onclick = () => this.transformSelection('rotate', 180);
    if (this.canvas.elements.rotateRight) this.canvas.elements.rotateRight.onclick = () => this.transformSelection('rotate', 90);
    if (this.canvas.elements.flipHorizontal) this.canvas.elements.flipHorizontal.onclick = () => this.transformSelection('flip', 'H');
    if (this.canvas.elements.flipVertical) this.canvas.elements.flipVertical.onclick = () => this.transformSelection('flip', 'V');
    
    // Sketch controls
    if (this.canvas.elements.sketchColor) {
      this.canvas.elements.sketchColor.oninput = () => {
        this.state.sketch.color = this.canvas.elements.sketchColor.value;
        this.ui.updateCanvasInfo();
        this.ui.updateSketchControls();
      };
    }
    
    const sketchInputs = ['brushSize', 'brushOpacity', 'brushHardness', 'brushFlow'];
    sketchInputs.forEach(id => {
      const element = this.canvas.elements[id];
      if (element) {
        element.oninput = () => {
          const value = parseInt(element.value);
          const property = id.replace('brush', '').toLowerCase();
          this.state.sketch[property === 'size' ? 'size' : property] = value;
          this.ui.updateSketchControls();
        };
      }
    });
    
    // Canvas size buttons for sketch mode
    document.querySelectorAll('[data-size]').forEach(btn => {
      btn.onclick = () => {
        const [width, height] = btn.dataset.size.split('x').map(Number);
        this.state.sketch.width = width;
        this.state.sketch.height = height;
        
        this.canvas.elements.sketchCanvas.width = width;
        this.canvas.elements.sketchCanvas.height = height;
        this.canvas.elements.selectionOverlay.width = width;
        this.canvas.elements.selectionOverlay.height = height;
        
        // Update all layers to new size
        this.state.sketch.layers.forEach(layer => {
          const oldCanvas = layer.canvas;
          const newCanvas = document.createElement('canvas');
          newCanvas.width = width;
          newCanvas.height = height;
          const newCtx = newCanvas.getContext('2d');
          
          newCtx.drawImage(oldCanvas, 0, 0);
          layer.canvas = newCanvas;
          layer.ctx = newCtx;
        });
        
        this.canvas.drawSketchCanvas();
      };
    });
    
    // Layer controls
    if (this.canvas.elements.addLayer) this.canvas.elements.addLayer.onclick = () => this.addLayer();
    if (this.canvas.elements.layerOpacity) {
      this.canvas.elements.layerOpacity.oninput = () => {
        const layer = this.state.sketch.layers[this.state.sketch.activeLayer];
        if (layer) {
          layer.opacity = parseInt(this.canvas.elements.layerOpacity.value);
          this.canvas.elements.layerOpacityLabel.textContent = layer.opacity;
          this.canvas.drawSketchCanvas();
        }
      };
    }
    if (this.canvas.elements.blendMode) {
      this.canvas.elements.blendMode.onchange = () => {
        const layer = this.state.sketch.layers[this.state.sketch.activeLayer];
        if (layer) {
          layer.blendMode = this.canvas.elements.blendMode.value;
          this.canvas.drawSketchCanvas();
        }
      };
    }
    
    // Export/Import controls
    if (this.canvas.elements.exportJSON) this.canvas.elements.exportJSON.onclick = () => this.exportJSON();
    if (this.canvas.elements.exportPNG2) this.canvas.elements.exportPNG2.onclick = () => this.exportPNG();
    if (this.canvas.elements.importFile) this.canvas.elements.importFile.onchange = (e) => this.importProject(e);
    
    // Panel collapsing
    document.querySelectorAll('.panel-header').forEach(header => {
      header.onclick = () => {
        const content = header.nextElementSibling;
        const arrow = header.querySelector('span');
        
        if (content.style.display === 'none') {
          content.style.display = 'block';
          arrow.textContent = '▼';
        } else {
          content.style.display = 'none';
          arrow.textContent = '▶';
        }
      };
    });
    
    // Keyboard shortcuts
    document.onkeydown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) this.history.redo(); else this.history.undo();
            break;
          case 'y':
            e.preventDefault();
            this.history.redo();
            break;
          case 's':
            e.preventDefault();
            this.saveProject();
            break;
          case 'n':
            e.preventDefault();
            this.newProject();
            break;
          case 'e':
            e.preventDefault();
            this.exportPNG();
            break;
          case 'h':
            e.preventDefault();
            if (this.state.mode === 'pixel') this.transformSelection('flip', 'H');
            break;
          case 'j':
            e.preventDefault();
            if (this.state.mode === 'pixel') this.transformSelection('flip', 'V');
            break;
        }
      } else {
        // Tool shortcuts for pixel mode
        const pixelTools = {
          'b': 'pencil', 'e': 'eraser', 'i': 'eyedropper', 'g': 'fill',
          'l': 'line', 'r': 'rect', 'o': 'circle', 'm': 'select', 'v': 'move'
        };
        
        // Tool shortcuts for sketch mode  
        const sketchTools = {
          'b': 'brush', 'p': 'pen', 'm': 'marker', 'c': 'pencilSketch', 'h': 'charcoal',
          'e': 'eraser', 's': 'smudge', 'u': 'blur', 'l': 'lineSketch', 
          'r': 'rectSketch', 'o': 'circleSketch', 'y': 'sprayPaint'
        };
        
        // Symmetry shortcuts (pixel mode only)
        const symmetryKeys = { 'q': 'none', 'w': 'horizontal', 'a': 'vertical', 's': 'both' };
        
        if (this.state.mode === 'pixel') {
          if (pixelTools[e.key]) {
            const tool = e.shiftKey ? `symmetric${pixelTools[e.key].charAt(0).toUpperCase()}${pixelTools[e.key].slice(1)}` : pixelTools[e.key];
            this.state.pixel.activeTool = tool;
            this.ui.updateToolControls();
            this.ui.updateCanvasInfo();
          } else if (symmetryKeys[e.key]) {
            this.setSymmetryMode(symmetryKeys[e.key]);
          }
        } else if (this.state.mode === 'sketch' && sketchTools[e.key]) {
          this.state.sketch.activeTool = sketchTools[e.key];
          this.ui.updateToolControls();
          this.ui.updateCanvasInfo();
        }
        
        // Transform shortcuts (pixel mode)
        if (this.state.mode === 'pixel') {
          if (e.key === '[') this.transformSelection('rotate', -90);
          if (e.key === ']') this.transformSelection('rotate', 90);
        }
        
        // Brush size adjustment (sketch mode)
        if (this.state.mode === 'sketch') {
          if (e.key === '[') {
            this.state.sketch.size = Math.max(1, this.state.sketch.size - 1);
            this.ui.updateSketchControls();
          }
          if (e.key === ']') {
            this.state.sketch.size = Math.min(100, this.state.sketch.size + 1);
            this.ui.updateSketchControls();
          }
        }
      }
      
      this.state.isShiftPressed = e.shiftKey;
      this.state.isCtrlPressed = e.ctrlKey || e.metaKey;
    };
    
    document.onkeyup = (e) => {
      this.state.isShiftPressed = e.shiftKey;
      this.state.isCtrlPressed = e.ctrlKey || e.metaKey;
    };
    
    // Prevent scrolling on touch devices when drawing
    document.addEventListener('touchmove', (e) => {
      if (this.state.isDrawing) {
        e.preventDefault();
      }
    }, { passive: false });
  }
  
  handlePointerDown(e) {
    e.preventDefault();
    this.state.isDrawing = true;
    
    if (this.state.mode === 'pixel') {
      const { x, y } = this.tools.getPixelCoords(e);
      this.state.lastPos = this.state.toolStartPos = { x, y };
      
      const isPrimary = e.button === 0;
      const { activeTool } = this.state.pixel;
      
      if (activeTool === 'fill' || activeTool === 'symmetricFill') {
        this.history.pushHistory('Fill');
        this.tools.handlePixelFill(x, y, isPrimary);
        this.state.isDrawing = false;
      } else if (activeTool === 'line' || activeTool === 'rect' || activeTool === 'circle') {
        // Shape tools - just set start position, draw on mouse up
        this.previewCanvas = document.createElement('canvas');
        this.previewCanvas.width = this.state.pixel.width;
        this.previewCanvas.height = this.state.pixel.height;
        this.previewCtx = this.previewCanvas.getContext('2d');
        
        // Copy current canvas state for preview
        this.previewCtx.putImageData(
          this.canvas.elements.pixelCtx.getImageData(0, 0, this.state.pixel.width, this.state.pixel.height), 
          0, 0
        );
      } else if (activeTool.includes('pencil') || activeTool.includes('eraser') || 
                 activeTool.includes('Pencil') || activeTool.includes('Eraser')) {
        this.history.pushHistory('Draw Stroke');
        this.tools.handlePixelDraw(x, y, isPrimary);
      } else if (activeTool === 'eyedropper') {
        this.tools.handlePixelDraw(x, y, isPrimary);
        this.state.isDrawing = false;
      }
    } else if (this.state.mode === 'sketch') {
      const { x, y } = this.tools.getSketchCoords(e);
      this.state.lastPos = { x, y };
      this.history.pushHistory('Sketch Stroke');
      
      const layer = this.state.sketch.layers[this.state.sketch.activeLayer];
      if (layer) {
        this.drawWithBrush(layer.ctx, x, y, this.state.sketch.activeTool);
        this.canvas.drawSketchCanvas();
      }
    }
  }
  
  handlePointerMove(e) {
    if (!this.state.isDrawing) return;
    
    if (this.state.mode === 'pixel') {
      const { x, y } = this.tools.getPixelCoords(e);
      const { activeTool } = this.state.pixel;
      
      if (activeTool === 'line' || activeTool === 'rect' || activeTool === 'circle') {
        // Shape preview - restore original canvas and draw preview
        this.canvas.elements.pixelCtx.putImageData(
          this.previewCtx.getImageData(0, 0, this.state.pixel.width, this.state.pixel.height), 
          0, 0
        );
        
        const color = this.state.pixel.primaryColor;
        const startX = this.state.toolStartPos.x;
        const startY = this.state.toolStartPos.y;
        
        if (activeTool === 'line') {
          this.drawPixelLine(startX, startY, x, y, color);
        } else if (activeTool === 'rect') {
          this.drawPixelRect(startX, startY, x, y, color, e.shiftKey);
        } else if (activeTool === 'circle') {
          this.drawPixelCircle(startX, startY, x, y, color, e.shiftKey);
        }
      } else if (activeTool.includes('pencil') || activeTool.includes('eraser') ||
                 activeTool.includes('Pencil') || activeTool.includes('Eraser')) {
        
        // Draw line between last position and current position
        const dx = Math.abs(x - this.state.lastPos.x);
        const dy = Math.abs(y - this.state.lastPos.y);
        const sx = this.state.lastPos.x < x ? 1 : -1;
        const sy = this.state.lastPos.y < y ? 1 : -1;
        let err = dx - dy;
        
        let currentX = this.state.lastPos.x;
        let currentY = this.state.lastPos.y;
        
        while (true) {
          this.tools.handlePixelDraw(currentX, currentY, e.buttons === 1);
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
        
        this.state.lastPos = { x, y };
      }
    } else if (this.state.mode === 'sketch') {
      const { x, y } = this.tools.getSketchCoords(e);
      const layer = this.state.sketch.layers[this.state.sketch.activeLayer];
      
      if (layer) {
        this.drawWithBrush(layer.ctx, x, y, this.state.sketch.activeTool);
        this.canvas.drawSketchCanvas();
      }
      
      this.state.lastPos = { x, y };
    }
  }
  
  handlePointerUp(e) {
    if (this.state.mode === 'pixel') {
      const { activeTool } = this.state.pixel;
      
      if (activeTool === 'line' || activeTool === 'rect' || activeTool === 'circle') {
        this.history.pushHistory(`Draw ${activeTool}`);
        // Final shape is already drawn in handlePointerMove
        this.previewCanvas = null;
        this.previewCtx = null;
      }
    } else if (this.state.mode === 'sketch') {
      const layer = this.state.sketch.layers[this.state.sketch.activeLayer];
      if (layer && layer.ctx) {
        layer.ctx.closePath();
      }
    }
    
    this.state.isDrawing = false;
  }
}

// =====================
// INITIALIZE APPLICATION
// =====================
let jerryEditor;

document.addEventListener('DOMContentLoaded', () => {
  jerryEditor = new JerryEditor();
  
  // Prevent default touch behaviors that interfere with drawing
  document.addEventListener('touchstart', (e) => {
    if (e.target.closest('.canvas-area')) {
      e.preventDefault();
    }
  }, { passive: false });
  
  document.addEventListener('touchmove', (e) => {
    if (e.target.closest('.canvas-area')) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Handle viewport changes for mobile
  const handleResize = () => {
    if (jerryEditor) {
      jerryEditor.updateCanvasDisplay();
    }
  };
  
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 100);
  });
});
