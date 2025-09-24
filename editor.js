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
    
    // Temporary canvas for pixel shape previews
    this.tempPixelCanvas = document.createElement('canvas');
    this.tempPixelCtx = this.tempPixelCanvas.getContext('2d');
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
      'exportPNG', 'saveProject'
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
    if (this.state.sketch.layers.length === 0) {
      this.state.sketch.layers = [this.createSketchLayer('Layer 1')];
    }
    
    // Initialize temporary pixel canvas size
    this.tempPixelCanvas.width = this.state.pixel.width;
    this.tempPixelCanvas.height = this.state.pixel.height;
  }

  updatePixelCanvasSize() {
    const { width, height, cellSize } = this.state.pixel;

    this.elements.pixelCanvas.width = width;
    this.elements.pixelCanvas.height = height;
    
    this.tempPixelCanvas.width = width;
    this.tempPixelCanvas.height = height;

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
    const { width, height, cellSize } = this.state.pixel;
    this.elements.canvasGrid.innerHTML = '';
    
    // Update grid container size
    this.elements.canvasGrid.style.width = `${width * cellSize}px`;
    this.elements.canvasGrid.style.height = `${height * cellSize}px`;
    this.elements.canvasGrid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    this.elements.canvasGrid.style.gridTemplateRows = `repeat(${height}, 1fr)`;

    // Only render grid lines if the grid is toggled on and zoom is appropriate
    if (this.state.pixel.showGrid && cellSize >= 10) {
      for (let i = 0; i < width * height; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        this.elements.canvasGrid.appendChild(cell);
      }
    }
    
    this.elements.canvasGrid.style.display = 
      (this.state.mode === 'pixel' && this.state.pixel.showGrid) ? 'grid' : 'none';
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

    // Draw checkerboard background if no layers are visible or active layer is empty
    if (layers.every(l => !l.visible) || layers.length === 0) {
      this.drawCheckerboard(ctx, width, height, 10);
    }
    
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
  
  drawCheckerboard(ctx, width, height, size) {
    ctx.save();
    ctx.fillStyle = '#ccc';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#eee';
    for (let x = 0; x < width; x += size) {
      for (let y = 0; y < height; y += size) {
        if ((x / size) % 2 === (y / size) % 2) {
          ctx.fillRect(x, y, size, size);
        }
      }
    }
    ctx.restore();
  }
}

// ===============================
// Unified Drawing Manager
// ===============================
class DrawingManager {
  constructor(state, canvas) {
    this.state = state;
    this.canvas = canvas;

    this.prevX = null;
    this.prevY = null;
    this.isDrawing = false;
  }

  // -------------------------------
  // General Input Handlers
  // -------------------------------
  start(x, y, button) {
    this.state.isDrawing = true;
    this.prevX = x;
    this.prevY = y;
    this.state.toolStartPos = { x, y };
    this.state.lastPos = { x, y };

    if (this.state.mode === 'sketch') this.handleSketchStart(x, y);
    else if (this.state.mode === 'pixel') this.handlePixelStart(x, y, button);
  }

  move(x, y) {
    if (!this.state.isDrawing) return;

    if (this.state.mode === 'sketch') this.handleSketchMove(x, y);
    else if (this.state.mode === 'pixel') this.handlePixelMove(x, y);

    this.prevX = x;
    this.prevY = y;
  }

  end() {
    if (!this.state.isDrawing) return;
    
    if (this.state.mode === 'pixel') this.commitPixelTempLayer(this.prevX, this.prevY);
    
    this.state.isDrawing = false;
    this.prevX = null;
    this.prevY = null;
    this.state.lastPos = { x: 0, y: 0 };
    this.state.toolStartPos = { x: 0, y: 0 };
  }

  // ===============================
  // Sketch Mode
  // ===============================
  handleSketchStart(x, y) {
    const { activeLayer, layers, activeTool } = this.state.sketch;
    const layer = layers[activeLayer];
    if (!layer) return;
    
    this.state.history.pushHistory('Sketch Stroke Start');

    // For tools that draw immediately (dots, spray, smudge)
    if (['brush', 'pen', 'marker', 'pencilSketch', 'charcoal', 'eraser', 'sprayPaint', 'smudge'].includes(activeTool)) {
      this.drawSketchStroke(layer.ctx, x, y, x, y, activeTool);
    }
    
    // Shape tools (rectSketch, circleSketch) will use the start point for reference
    if (['rectSketch', 'circleSketch', 'lineSketch'].includes(activeTool)) {
        // Clear selection overlay for new shape
        this.canvas.elements.overlayCtx.clearRect(0, 0, this.state.sketch.width, this.state.sketch.height);
    }
  }

  handleSketchMove(x, y) {
    const { activeLayer, layers, activeTool } = this.state.sketch;
    const layer = layers[activeLayer];
    if (!layer) return;

    if (['brush', 'pen', 'marker', 'pencilSketch', 'charcoal', 'eraser', 'sprayPaint', 'smudge'].includes(activeTool)) {
      this.drawSketchStroke(layer.ctx, this.prevX, this.prevY, x, y, activeTool);
      this.canvas.drawSketchCanvas();
    } else if (['rectSketch', 'circleSketch', 'lineSketch'].includes(activeTool)) {
      // Draw preview on overlay
      this.canvas.elements.overlayCtx.clearRect(0, 0, this.state.sketch.width, this.state.sketch.height);
      this.drawSketchShapePreview(this.canvas.elements.overlayCtx, this.state.toolStartPos.x, this.state.toolStartPos.y, x, y, activeTool);
    }
  }
  
  drawSketchShapePreview(ctx, startX, startY, endX, endY, tool) {
    const { color } = this.state.sketch;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.lineCap = 'butt';
    ctx.globalAlpha = 1;
    ctx.beginPath();
    
    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);
    const width = maxX - minX;
    const height = maxY - minY;

    switch (tool) {
      case 'lineSketch':
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        break;
      case 'rectSketch':
        ctx.rect(minX, minY, width, height);
        break;
      case 'circleSketch':
        const radius = Math.sqrt(width * width + height * height) / 2;
        const centerX = startX + (endX - startX) / 2;
        const centerY = startY + (endY - startY) / 2;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        break;
    }
    
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash
  }

  commitSketchShape(endX, endY) {
    const { activeLayer, layers, activeTool, size, color } = this.state.sketch;
    const layer = layers[activeLayer];
    if (!layer) return;
    
    // Clear overlay
    this.canvas.elements.overlayCtx.clearRect(0, 0, this.state.sketch.width, this.state.sketch.height);
    
    // Draw final shape to layer
    const ctx = layer.ctx;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'butt';
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    
    const startX = this.state.toolStartPos.x;
    const startY = this.state.toolStartPos.y;
    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);
    const width = maxX - minX;
    const height = maxY - minY;

    switch (activeTool) {
      case 'lineSketch':
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        break;
      case 'rectSketch':
        // Outline or Filled (Shift key for filled)
        if (this.state.isShiftPressed) {
          ctx.fillStyle = color;
          ctx.fillRect(minX, minY, width, height);
        } else {
          ctx.strokeRect(minX, minY, width, height);
        }
        break;
      case 'circleSketch':
        const radius = Math.sqrt(width * width + height * height) / 2;
        const centerX = startX + (endX - startX) / 2;
        const centerY = startY + (endY - startY) / 2;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        // Outline or Filled
        if (this.state.isShiftPressed) {
          ctx.fillStyle = color;
          ctx.fill();
        } else {
          ctx.stroke();
        }
        break;
    }
    
    this.canvas.drawSketchCanvas();
    this.state.history.pushHistory(`Draw ${activeTool}`);
  }

  drawSketchStroke(ctx, startX, startY, endX, endY, tool) {
    const { size, opacity, flow, color } = this.state.sketch;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    switch (tool) {
      case 'brush':
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        ctx.globalAlpha = (opacity / 100) * (flow / 100);
        ctx.globalCompositeOperation = 'source-over';
        ctx.stroke();
        break;
        
      case 'eraser':
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = size;
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'destination-out'; // Erase effect
        ctx.stroke();
        break;

      case 'pen':
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = Math.max(1, size * 0.7);
        ctx.strokeStyle = color;
        ctx.globalAlpha = (opacity / 100) * (flow / 100);
        ctx.lineCap = 'square';
        ctx.globalCompositeOperation = 'source-over';
        ctx.stroke();
        break;

      case 'marker':
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = size * 2;
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.2;
        ctx.globalCompositeOperation = 'multiply';
        ctx.stroke();
        break;

      case 'pencilSketch':
        const jitterStartX = startX + (Math.random() - 0.5) * 1.5;
        const jitterStartY = startY + (Math.random() - 0.5) * 1.5;
        const jitterEndX = endX + (Math.random() - 0.5) * 1.5;
        const jitterEndY = endY + (Math.random() - 0.5) * 1.5;
        ctx.beginPath();
        ctx.moveTo(jitterStartX, jitterStartY);
        ctx.lineTo(jitterEndX, jitterEndY);
        ctx.lineWidth = Math.max(1, size * 0.6);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.5;
        ctx.globalCompositeOperation = 'source-over';
        ctx.stroke();
        break;

      case 'charcoal':
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = size * 1.5;
        ctx.strokeStyle = '#222';
        ctx.globalAlpha = 0.25;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#000';
        ctx.globalCompositeOperation = 'multiply';
        ctx.stroke();
        break;

      case 'sprayPaint':
        this.drawSprayPaint(ctx, endX, endY);
        break;

      case 'smudge':
        this.drawSmudge(ctx, endX, endY);
        break;

      case 'blur':
        // Blur is complex to implement on a single layer context effectively during draw, 
        // A simple pass-through to show stroke is used, real blur would require image data manipulation/filters.
        ctx.save();
        ctx.filter = `blur(${Math.max(1, size / 10)}px)`; 
        ctx.globalAlpha = opacity / 100;
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();
        break;
    }
  }

  drawSprayPaint(ctx, x, y) {
    const { size, opacity, color } = this.state.sketch;
    const density = 25;
    ctx.globalAlpha = (opacity / 100) * 0.15;
    ctx.fillStyle = color;
    ctx.globalCompositeOperation = 'source-over';

    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * (size / 2);
      const sprayX = x + Math.cos(angle) * distance;
      const sprayY = y + Math.sin(angle) * distance;
      ctx.beginPath();
      ctx.arc(sprayX, sprayY, Math.random() * 2 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawSmudge(ctx, x, y) {
    const { size, opacity } = this.state.sketch;
    const smudgeRadius = size * 1.5;
    const pixelatedSize = 2; // Read in pixelated chunks for smudging
    
    // Get the image data around the cursor
    const sourceData = ctx.getImageData(x - smudgeRadius, y - smudgeRadius, smudgeRadius * 2, smudgeRadius * 2);
    const data = sourceData.data;

    // A very basic smudge simulation: average colors and move them slightly
    for (let i = 0; i < data.length; i += 4 * pixelatedSize) {
        // Simple shift/blur
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Smudge effect by blending current pixel with neighbor
        const neighborIndex = i + 4 * pixelatedSize;
        if (neighborIndex < data.length) {
            data[i] = (r * (1 - opacity / 100)) + (data[neighborIndex] * (opacity / 100));
            data[i + 1] = (g * (1 - opacity / 100)) + (data[neighborIndex + 1] * (opacity / 100));
            data[i + 2] = (b * (1 - opacity / 100)) + (data[neighborIndex + 2] * (opacity / 100));
        }
    }
    
    ctx.putImageData(sourceData, x - smudgeRadius, y - smudgeRadius);
  }

  // ===============================
  // Pixel Mode
  // ===============================
  handlePixelStart(x, y, button) {
    const { activeTool } = this.state.pixel;
    const isPrimary = button === 0;

    if (['pencil', 'eraser', 'symmetricPencil', 'symmetricEraser'].includes(activeTool)) {
      this.state.history.pushHistory('Draw Stroke');
      this.drawPixelLine(x, y, x, y, isPrimary);
    } else if (activeTool === 'fill' || activeTool === 'symmetricFill') {
      this.state.history.pushHistory('Fill');
      this.tools.handlePixelFill(x, y, isPrimary, activeTool.includes('symmetric'));
      this.state.isDrawing = false; // Fill is a single click action
    } else if (activeTool === 'eyedropper') {
      this.tools.handlePixelEyedropper(x, y, isPrimary);
      this.state.isDrawing = false;
    } else if (['line', 'rect', 'circle', 'rectFilled', 'circleFilled'].includes(activeTool)) {
      // Shape tools need a temporary canvas to draw the preview
      this.canvas.tempPixelCtx.clearRect(0, 0, this.state.pixel.width, this.state.pixel.height);
      this.canvas.tempPixelCtx.drawImage(this.canvas.elements.pixelCanvas, 0, 0);
    }
  }

  handlePixelMove(x, y) {
    const { activeTool } = this.state.pixel;
    const isPrimary = true; // Mouse down button 

    if (['pencil', 'eraser', 'symmetricPencil', 'symmetricEraser'].includes(activeTool)) {
      // Freeform drawing (uses Bresenham's line algorithm in drawPixelLine)
      this.drawPixelLine(this.prevX, this.prevY, x, y, isPrimary, activeTool.includes('symmetric'));
    } else if (['line', 'rect', 'circle', 'rectFilled', 'circleFilled'].includes(activeTool)) {
      // Shape preview - restore original canvas state and draw preview shape
      this.canvas.elements.pixelCtx.clearRect(0, 0, this.state.pixel.width, this.state.pixel.height);
      this.canvas.elements.pixelCtx.drawImage(this.canvas.tempPixelCanvas, 0, 0);

      const color = this.state.pixel.primaryColor;
      const startX = this.state.toolStartPos.x;
      const startY = this.state.toolStartPos.y;
      const filled = activeTool.includes('Filled') || this.state.isShiftPressed; // Shift for filled preview

      if (activeTool.includes('line')) {
        this.drawPixelShape(startX, startY, x, y, color, 'line');
      } else if (activeTool.includes('rect')) {
        this.drawPixelShape(startX, startY, x, y, color, 'rect', filled);
      } else if (activeTool.includes('circle')) {
        this.drawPixelShape(startX, startY, x, y, color, 'circle', filled);
      }
    }
    
    // Update lastPos
    this.state.lastPos = { x, y };
  }

  commitPixelTempLayer(endX, endY) {
    const { activeTool, primaryColor } = this.state.pixel;
    
    if (['line', 'rect', 'circle', 'rectFilled', 'circleFilled'].includes(activeTool)) {
      this.state.history.pushHistory(`Draw ${activeTool}`);
      
      const startX = this.state.toolStartPos.x;
      const startY = this.state.toolStartPos.y;
      const color = primaryColor;
      const filled = activeTool.includes('Filled') || this.state.isShiftPressed;

      // Draw the final shape directly to the sprite data
      if (activeTool.includes('line')) {
        this.drawPixelShape(startX, startY, endX, endY, color, 'line', false, true);
      } else if (activeTool.includes('rect')) {
        this.drawPixelShape(startX, startY, endX, endY, color, 'rect', filled, true);
      } else if (activeTool.includes('circle')) {
        this.drawPixelShape(startX, startY, endX, endY, color, 'circle', filled, true);
      }
      
      // The canvas is redrawn inside drawPixelShape when commit=true
      
      // Clear temp canvas
      this.canvas.tempPixelCtx.clearRect(0, 0, this.state.pixel.width, this.state.pixel.height);
    }
  }

  // ===============================
  // Pixel Drawing Functions
  // ===============================
  drawPixel(x, y, color) {
    const { width, height, sprites, currentFrame, activeTool, symmetry } = this.state.pixel;
    const data = sprites[currentFrame].data;
    
    const commitDraw = (px, py, c) => {
      if (px >= 0 && px < width && py >= 0 && py < height) {
        const idx = py * width + px;
        data[idx] = activeTool.includes('eraser') ? 'transparent' : c;
      }
    };
    
    // 1. Draw at (x, y)
    commitDraw(x, y, color);
    
    // 2. Apply Symmetry if a symmetric tool is used
    if (activeTool.includes('symmetric') && symmetry !== 'none') {
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Calculate symmetric points
      const symPoints = [];
      if (symmetry === 'horizontal' || symmetry === 'both') {
        const symX = width - 1 - x;
        if (symX !== x) symPoints.push({ x: symX, y: y });
      }
      if (symmetry === 'vertical' || symmetry === 'both') {
        const symY = height - 1 - y;
        if (symY !== y) symPoints.push({ x: x, y: symY });
      }
      
      if (symmetry === 'both' && width % 2 !== 0 && height % 2 !== 0) {
        // Diagonal point for odd sizes
        const symX = width - 1 - x;
        const symY = height - 1 - y;
        if (symX !== x && symY !== y) symPoints.push({ x: symX, y: symY });
      }

      // Draw symmetric points
      symPoints.forEach(p => commitDraw(p.x, p.y, color));
    }
  }

  drawPixelLine(startX, startY, endX, endY, isPrimary, isSymmetric = false) {
    const color = isPrimary ? this.state.pixel.primaryColor : this.state.pixel.secondaryColor;
    
    let dx = Math.abs(endX - startX);
    let dy = Math.abs(endY - startY);
    let sx = startX < endX ? 1 : -1;
    let sy = startY < endY ? 1 : -1;
    let err = dx - dy;
    let x = startX;
    let y = startY;

    while (true) {
      this.drawPixel(x, y, color);
      
      if (x === endX && y === endY) break;
      let e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x += sx; }
      if (e2 < dx) { err += dx; y += sy; }
    }

    this.canvas.drawPixelCanvas();
  }

  /**
   * Universal function for drawing pixel shapes (line, rect, circle).
   * @param {number} startX - Start X coordinate.
   * @param {number} startY - Start Y coordinate.
   * @param {number} endX - End X coordinate.
   * @param {number} endY - End Y coordinate.
   * @param {string} color - Hex color string.
   * @param {string} shape - 'line', 'rect', or 'circle'.
   * @param {boolean} filled - Whether the shape should be filled (for rect/circle).
   * @param {boolean} commit - If true, draws to sprite data; otherwise, draws to live canvas for preview.
   */
  drawPixelShape(startX, startY, endX, endY, color, shape, filled = false, commit = false) {
    // If committing, the canvas's data array is modified, which is the final step.
    // If not committing, the shape is drawn directly onto the visible canvas for a real-time preview.
    
    const spriteData = this.state.pixel.sprites[this.state.pixel.currentFrame].data;
    const { width, height } = this.state.pixel;

    const plotPixel = (x, y, c) => {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        const index = y * width + x;
        if (commit) {
          spriteData[index] = c;
        } else {
          // Draw directly to visible canvas for preview
          this.canvas.elements.pixelCtx.fillStyle = c;
          this.canvas.elements.pixelCtx.fillRect(x, y, 1, 1);
        }
      }
    };
    
    const drawLine = (x0, y0, x1, y1, c) => {
      let dx = Math.abs(x1 - x0);
      let dy = Math.abs(y1 - y0);
      let sx = (x0 < x1) ? 1 : -1;
      let sy = (y0 < y1) ? 1 : -1;
      let err = dx - dy;

      while (true) {
        plotPixel(x0, y0, c);
        if (x0 === x1 && y0 === y1) break;
        let e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
      }
    };

    if (shape === 'line') {
      drawLine(startX, startY, endX, endY, color);
      
    } else if (shape === 'rect') {
      const minX = Math.min(startX, endX);
      const maxX = Math.max(startX, endX);
      const minY = Math.min(startY, endY);
      const maxY = Math.max(startY, endY);

      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          if (filled || x === minX || x === maxX || y === minY || y === maxY) {
            plotPixel(x, y, color);
          }
        }
      }
      
    } else if (shape === 'circle') {
      const centerX = startX;
      const centerY = startY;
      const radius = Math.round(Math.sqrt(Math.pow(endX - centerX, 2) + Math.pow(endY - centerY, 2)));

      for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
          const distance = Math.sqrt(x * x + y * y);
          const isOutline = !filled && (Math.abs(distance - radius) < 1.0); // 1.0 is tolerance for 'line' thickness
          const isFilled = filled && distance <= radius;
          
          if (isFilled || isOutline) {
            plotPixel(centerX + x, centerY + y, color);
          }
        }
      }
    }
    
    // Final render if committing the change
    if (commit) {
      this.canvas.drawPixelCanvas();
    }
  }
}

class DrawingTools {
  constructor(state, canvas, ui) {
    this.state = state;
    this.canvas = canvas;
    this.ui = ui;
  }

  getPixelCoords(e) {
    const rect = this.canvas.elements.canvas.getBoundingClientRect();
    const scaleX = this.state.pixel.width / rect.width;
    const scaleY = this.state.pixel.height / rect.height;
    
    return {
      x: Math.floor((e.clientX - rect.left) * scaleX),
      y: Math.floor((e.clientY - rect.top) * scaleY)
    };
  }

  getSketchCoords(e) {
    const rect = this.canvas.elements.sketchCanvas.getBoundingClientRect();
    const zoomFactor = this.state.sketch.zoom / 100;
    
    return {
      x: (e.clientX - rect.left) / zoomFactor,
      y: (e.clientY - rect.top) / zoomFactor
    };
  }

  handlePixelFill(x, y, isPrimary, isSymmetric = false) {
    const { width, height, sprites, currentFrame, primaryColor, secondaryColor, symmetry } = this.state.pixel;
    const data = sprites[currentFrame].data;
    const index = y * width + x;
    const targetColor = data[index];
    const fillColor = isPrimary ? primaryColor : secondaryColor;

    if (targetColor === fillColor) return;

    // Recursive or iterative flood fill
    const fill = (startX, startY) => {
      const stack = [[startX, startY]];
      while (stack.length > 0) {
        const [cx, cy] = stack.pop();
        if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;
        
        const i = cy * width + cx;
        if (data[i] !== targetColor) continue;

        data[i] = fillColor;
        stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
      }
    };
    
    // 1. Fill at (x, y)
    fill(x, y);
    
    // 2. Apply Symmetric Fill if required
    if (isSymmetric && symmetry !== 'none') {
      // Logic for calculating symmetric points and calling fill() for each
      const symPoints = [];
      
      if (symmetry === 'horizontal' || symmetry === 'both') {
        const symX = width - 1 - x;
        if (symX !== x) symPoints.push({ x: symX, y: y });
      }
      if (symmetry === 'vertical' || symmetry === 'both') {
        const symY = height - 1 - y;
        if (symY !== y) symPoints.push({ x: x, y: symY });
      }
      if (symmetry === 'both' && width % 2 !== 0 && height % 2 !== 0) {
        const symX = width - 1 - x;
        const symY = height - 1 - y;
        if (symX !== x && symY !== y) symPoints.push({ x: symX, y: symY });
      }

      symPoints.forEach(p => {
        const target = data[p.y * width + p.x];
        if (target !== fillColor) {
          fill(p.x, p.y);
        }
      });
    }

    this.canvas.drawPixelCanvas();
  }
  
  handlePixelEyedropper(x, y, isPrimary) {
    const { width, sprites, currentFrame } = this.state.pixel;
    const data = sprites[currentFrame].data;
    
    if (x >= 0 && x < width && y >= 0 && y < this.state.pixel.height) {
      const index = y * width + x;
      const color = data[index];
      
      if (color) {
        if (isPrimary) {
          this.state.pixel.primaryColor = color;
          this.canvas.elements.primaryColor.style.backgroundColor = color;
        } else {
          this.state.pixel.secondaryColor = color;
          this.canvas.elements.secondaryColor.style.backgroundColor = color;
        }
        this.ui.updateCanvasInfo();
      }
    }
  }

  // NOTE: drawWithBrush is now handled in DrawingManager
}

// =====================
// HISTORY MANAGEMENT
// =====================
class HistoryManager {
  // ... (No changes needed in HistoryManager)
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
            id: layer.id,
            name: layer.name,
            opacity: layer.opacity,
            blendMode: layer.blendMode,
            visible: layer.visible,
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
      this.canvas.drawPixelCanvas(); // Redraw pixel canvas in case of partial sprite data in snapshot
    }
  }
  
  redo() {
    const historyState = this.state[this.state.mode];
    if (historyState.historyIndex < historyState.history.length - 1) {
      historyState.historyIndex++;
      this.applyHistorySnapshot(historyState.history[historyState.historyIndex]);
      this.canvas.drawPixelCanvas();
    }
  }
}

// =====================
// UI MANAGER
// =====================
class UIManager {
  // ... (No changes needed in UIManager, logic is sound)
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
    const colorPickers = this.canvas.elements.colorPickers;
    if (!colorPickers) return;
    
    colorPickers.innerHTML = '';
    
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
      colorPickers.appendChild(input);
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
      if (this.canvas.elements.sketchColor) this.canvas.elements.sketchColor.value = color;
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
    
    // Update layer opacity/blend mode controls for the active layer
    const activeLayer = this.state.sketch.layers[this.state.sketch.activeLayer];
    if (activeLayer && this.canvas.elements.layerOpacity && this.canvas.elements.blendMode) {
      this.canvas.elements.layerOpacity.value = activeLayer.opacity;
      this.canvas.elements.layerOpacityLabel.textContent = activeLayer.opacity;
      this.canvas.elements.blendMode.value = activeLayer.blendMode;
    }
  }
  
  updateCanvasInfo() {
    const canvasInfo = this.canvas.elements.canvasInfo;
    if (!canvasInfo) return;
    
    const { mode } = this.state;
    let info = '';
    
    if (mode === 'pixel') {
      const { width, height, activeTool, primaryColor } = this.state.pixel;
      info = `${width}×${height} | ${activeTool} | ${primaryColor}`;
      
      if (this.canvas.elements.canvasWidth) this.canvas.elements.canvasWidth.value = width;
      if (this.canvas.elements.canvasHeight) this.canvas.elements.canvasHeight.value = height;
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
      const displaySize = Math.max(8, size); // Minimum size for visibility
      brushPreview.style.width = `${displaySize}px`;
      brushPreview.style.height = `${displaySize}px`;
      brushPreview.style.backgroundColor = this.state.sketch.color;
      brushPreview.style.opacity = opacity / 100;
      brushPreview.style.borderRadius = elements.brushHardness.value < 50 ? '50%' : '0';
    }
    
    this.updateLayersList(); // To ensure active layer controls are correct
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
    
    // 💡 CRITICAL FIX: Initialize HistoryManager BEFORE UIManager.
    // The UIManager constructor calls updateUI(), which immediately
    // tries to access this.history.
    this.history = new HistoryManager(this.state, this.canvas);
    
    this.ui = new UIManager(this.state, this.canvas, this.history);
    
    this.tools = new DrawingTools(this.state, this.canvas, this.ui);
    
    this.drawingManager = new DrawingManager(this.state, this.canvas);
    
    this.attachEventListeners();
    this.setMode('pixel');
    
    // This is Fix #1: Ensures the canvas display runs correctly.
    // It should run *after* all managers are set up.
    this.updateCanvasDisplay(); 
    
    // Initial history snapshot
    this.history.pushHistory('Initial');
    
    // PWA registration... (rest of the constructor)
    // ...

    
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

    // Show/hide pixel and sketch UI
    const pixelUI = document.querySelectorAll('.pixel-controls, .pixel-tools');
    const sketchUI = document.querySelectorAll('.sketch-controls, .sketch-tools');

    pixelUI.forEach(el => {
      el.style.display = newMode === 'pixel' ? (el.classList.contains('pixel-tools') ? 'flex' : 'block') : 'none';
    });

    sketchUI.forEach(el => {
      el.style.display = newMode === 'sketch' ? 
        (el.classList.contains('sketch-tools') ? 'flex' : 'block') : 'none';
    });

    // Show/hide canvases
    const canvasWrapper = this.canvas.elements.canvas.parentElement;
    canvasWrapper.style.overflow = newMode === 'sketch' ? 'auto' : 'hidden'; // Enable scrolling for sketch
    
    this.canvas.elements.canvas.style.display = newMode === 'pixel' ? 'grid' : 'none';
    this.canvas.elements.sketchCanvas.style.display = newMode === 'sketch' ? 'block' : 'none';
    this.canvas.elements.selectionOverlay.style.display = newMode === 'sketch' ? 'block' : 'none';

    // Update grid visibility
    this.canvas.elements.canvasGrid.style.display = 
        (newMode === 'pixel' && this.state.pixel.showGrid) ? 'grid' : 'none';

    // Refresh canvas and UI info
    this.updateCanvasDisplay();
    this.ui.updateCanvasInfo();
    this.ui.updateToolControls();
  }

  updateCanvasDisplay() {
    if (this.state.mode === 'pixel') {
      const zoomFactor = this.state.pixel.zoom / 100;
      // Calculate cellSize based on zoom and a default size, but enforce minimum 1
      const cellSize = Math.max(1, Math.round(CANVAS_LIMITS.DEFAULT_CELL_SIZE * zoomFactor)); 
      this.state.pixel.cellSize = cellSize;
      
      this.canvas.updatePixelCanvasSize();
      this.canvas.renderPixelGrid(); // Re-render grid to update cell size
      this.canvas.drawPixelCanvas();
    } else if (this.state.mode === 'sketch') {
      const zoomFactor = this.state.sketch.zoom / 100;
      this.canvas.elements.sketchCanvas.style.transform = `scale(${zoomFactor})`;
      this.canvas.elements.selectionOverlay.style.transform = `scale(${zoomFactor})`;
      this.canvas.drawSketchCanvas();
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
      const { sprites, currentFrame } = this.state.pixel;
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
    
    const targetWidth = (type === 'rotate' && Math.abs(value) === 90) ? height : width;
    const targetHeight = (type === 'rotate' && Math.abs(value) === 90) ? width : height;

    // Temporarily swap dimensions for 90/270 degree rotations
    const isDimensionSwap = (type === 'rotate' && Math.abs(value) === 90);

    // If rotating 90/270, we need to resize the canvas
    if (isDimensionSwap) {
        this.state.pixel.width = targetWidth;
        this.state.pixel.height = targetHeight;
        this.canvas.updatePixelCanvasSize();
    }
    
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
          if (value === 90) { // Clockwise
            newX = y;
            newY = targetHeight - 1 - x;
          } else if (value === 180) {
            newX = width - 1 - x;
            newY = height - 1 - y;
          } else if (value === -90) { // Counter-clockwise
            newX = targetWidth - 1 - y;
            newY = x;
          }
        }
        
        if (newX >= 0 && newX < targetWidth && newY >= 0 && newY < targetHeight) {
          const newIndex = newY * targetWidth + newX;
          newData[newIndex] = color;
        }
      }
    }
    
    // Apply new data, ensuring the new array size matches the new dimensions
    if (isDimensionSwap) {
        sprites[currentFrame].data = new Array(targetWidth * targetHeight).fill('transparent');
        sprites[currentFrame].data = newData;
        this.canvas.renderPixelGrid(); // Re-render grid after size change
    } else {
        sprites[currentFrame].data = newData;
    }
    
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
    
    // Reinitialize canvases and UI
    this.canvas.initializeCanvases();
    this.canvas.elements.primaryColor.style.backgroundColor = this.state.pixel.primaryColor;
    this.canvas.elements.secondaryColor.style.backgroundColor = this.state.pixel.secondaryColor;
    
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
    if (this.canvas.elements.output) this.canvas.elements.output.value = json;
    
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
    
    // Create a temporary, composited canvas for export
    const exportCanvas = document.createElement('canvas');
    let width, height;

    if (this.state.mode === 'pixel') {
        width = this.state.pixel.width;
        height = this.state.pixel.height;
        exportCanvas.width = width;
        exportCanvas.height = height;
        const ctx = exportCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        
        // Draw all sprites of the current frame
        const spriteData = this.state.pixel.sprites[this.state.pixel.currentFrame]?.data || [];
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
        filename = 'pixel_art.png';
    } else {
        width = this.state.sketch.width;
        height = this.state.sketch.height;
        exportCanvas.width = width;
        exportCanvas.height = height;
        const ctx = exportCanvas.getContext('2d');
        
        // Draw all layers onto the export canvas
        this.state.sketch.layers.forEach(layer => {
            if (layer.visible) {
                ctx.globalAlpha = layer.opacity / 100;
                ctx.globalCompositeOperation = layer.blendMode;
                ctx.drawImage(layer.canvas, 0, 0);
            }
        });
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        filename = 'sketch.png';
    }
    
    const scale = parseInt(prompt('Export scale (1-10):', '4')) || 4;
    
    // Create scaled canvas
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = width * scale;
    scaledCanvas.height = height * scale;
    const ctx = scaledCanvas.getContext('2d');
    
    if (this.state.mode === 'pixel') {
      ctx.imageSmoothingEnabled = false;
    }
    
    ctx.drawImage(exportCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
    
    // Download
    const url = scaledCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      // Ensure data array size is correct, filling with transparent if mismatch occurs
      this.state.pixel.sprites = (data.pixel.sprites || []).map(s => ({
          ...s,
          data: s.data.slice(0, s.width * s.height || 256) // Simple size safety
      }));
      if (this.state.pixel.sprites.length === 0) {
           this.state.pixel.sprites = [{ id: 1, name: 'Frame 1', data: new Array(this.state.pixel.width * this.state.pixel.height).fill('transparent') }];
      }
      
      this.state.pixel.primaryColor = data.pixel.primaryColor || '#000000';
      this.state.pixel.secondaryColor = data.pixel.secondaryColor || '#ffffff';
      this.state.pixel.currentFrame = 0;
      
      if (this.canvas.elements.canvasWidth) this.canvas.elements.canvasWidth.value = this.state.pixel.width;
      if (this.canvas.elements.canvasHeight) this.canvas.elements.canvasHeight.value = this.state.pixel.height;
      if (this.canvas.elements.primaryColor) this.canvas.elements.primaryColor.style.backgroundColor = this.state.pixel.primaryColor;
      if (this.canvas.elements.secondaryColor) this.canvas.elements.secondaryColor.style.backgroundColor = this.state.pixel.secondaryColor;
    }
    
    if (data.sketch && data.sketch.layers) {
      this.state.sketch.width = data.sketch.width || 800;
      this.state.sketch.height = data.sketch.height || 600;
      this.state.sketch.layers = [];
      
      // Update sketch canvas sizes before loading layers
      this.canvas.elements.sketchCanvas.width = this.state.sketch.width;
      this.canvas.elements.sketchCanvas.height = this.state.sketch.height;
      this.canvas.elements.selectionOverlay.width = this.state.sketch.width;
      this.canvas.elements.selectionOverlay.height = this.state.sketch.height;
      
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
      
      this.state.sketch.activeLayer = Math.min(0, this.state.sketch.layers.length - 1);
    }
    
    this.setMode(data.mode || 'pixel');
    this.ui.updateUI();
    this.updateCanvasDisplay();
    this.history.pushHistory('Import Project');
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
    
    // Primary/Secondary Color pickers
    if (this.canvas.elements.primaryColor) {
      this.canvas.elements.primaryColor.onclick = () => {
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = this.state.pixel.primaryColor;
        colorInput.onchange = () => {
          this.state.pixel.primaryColor = colorInput.value;
          this.canvas.elements.primaryColor.style.backgroundColor = colorInput.value;
          this.ui.updateCanvasInfo();
        };
        colorInput.click();
      };
    }
    
    if (this.canvas.elements.secondaryColor) {
      this.canvas.elements.secondaryColor.onclick = () => {
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = this.state.pixel.secondaryColor;
        colorInput.onchange = () => {
          this.state.pixel.secondaryColor = colorInput.value;
          this.canvas.elements.secondaryColor.style.backgroundColor = colorInput.value;
          this.ui.updateCanvasInfo();
        };
        colorInput.click();
      };
    }

    // ----------------------------
    // Canvas input handlers
    // ----------------------------
    const canvasContainer = document.querySelector('.canvas-wrapper');
  
    const getCanvasCoords = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        let offsetX = clientX - rect.left;
        let offsetY = clientY - rect.top;

        if (this.state.mode === 'pixel') {
          // FIX: Remove redundant division by zoomFactor.
          // cellSize already incorporates the zoom for correct display scaling.
          const cellSize = this.state.pixel.cellSize;
            
          // Calculate the pixel index using the current display cell size
          const pixelX = Math.floor(offsetX / cellSize); 
          const pixelY = Math.floor(offsetY / cellSize);
          return { x: pixelX, y: pixelY, button: e.button };
        } else {
          const zoomFactor = this.state.sketch.zoom / 100;
          // Sketch is a direct pixel-to-pixel map with scaling applied via CSS transform
          const sketchX = offsetX / zoomFactor;
          const sketchY = offsetY / zoomFactor;
          return { x: sketchX, y: sketchY, button: e.button };
        }


    // Pointer events (desktop + stylus)
    canvasContainer.onpointerdown = (e) => {
        e.preventDefault();
        const { x, y, button } = getCanvasCoords(e);
        this.drawingManager.start(x, y, button);
    };
    canvasContainer.onpointermove = (e) => {
        e.preventDefault();
        const { x, y } = getCanvasCoords(e);
        this.drawingManager.move(x, y);
    };
    canvasContainer.onpointerup = (e) => {
        e.preventDefault();
        this.drawingManager.end();
    };

    canvasContainer.oncontextmenu = (e) => e.preventDefault();
  
    // Touch events (mobile) - already handled by pointer events on modern browsers, 
    // but the fallback below ensures smooth operation.
    canvasContainer.ontouchstart = (e) => {
        e.preventDefault();
        const { x, y, button } = getCanvasCoords(e);
        this.drawingManager.start(x, y, 0); // Simulate left click for touch
    };
    canvasContainer.ontouchmove = (e) => {
        e.preventDefault();
        const { x, y } = getCanvasCoords(e);
        this.drawingManager.move(x, y);
    };
    canvasContainer.ontouchend = (e) => {
        e.preventDefault();
        this.drawingManager.end();
    };
  
    // ----------------------------
    // Global pointerup (outside canvas)
    // ----------------------------
    document.onpointerup = () => this.drawingManager?.end();
  
    // ----------------------------
    // Control Handlers
    // ----------------------------
    if (this.canvas.elements.newProject) this.canvas.elements.newProject.onclick = () => this.newProject();
    if (this.canvas.elements.saveProject) this.canvas.elements.saveProject.onclick = () => this.exportJSON(); // Use JSON export as 'Save'
    if (this.canvas.elements.exportPNG) this.canvas.elements.exportPNG.onclick = () => this.exportPNG();
    if (this.canvas.elements.undo) this.canvas.elements.undo.onclick = () => this.history.undo();
    if (this.canvas.elements.redo) this.canvas.elements.redo.onclick = () => this.history.redo();
    if (this.canvas.elements.clear) this.canvas.elements.clear.onclick = () => this.clearCanvas();
    if (this.canvas.elements.resizeCanvas) this.canvas.elements.resizeCanvas.onclick = () => this.resizeCanvas();
  
    if (this.canvas.elements.zoomIn) this.canvas.elements.zoomIn.onclick = () => this.adjustZoom(25);
    if (this.canvas.elements.zoomOut) this.canvas.elements.zoomOut.onclick = () => this.adjustZoom(-25);
    if (this.canvas.elements.zoomReset) this.canvas.elements.zoomReset.onclick = () => this.adjustZoom('reset');
  
    if (this.canvas.elements.gridToggle) {
      this.canvas.elements.gridToggle.onchange = () => {
        this.state.pixel.showGrid = this.canvas.elements.gridToggle.checked;
        this.canvas.renderPixelGrid();
      };
    }
  
    if (this.canvas.elements.sketchColor) {
      this.canvas.elements.sketchColor.oninput = () => {
        this.state.sketch.color = this.canvas.elements.sketchColor.value;
        this.ui.updateCanvasInfo();
        this.ui.updateSketchControls();
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
        
        // Push history before resizing layers
        this.history.pushHistory('Resize Sketch Canvas');
        
        this.state.sketch.width = width;
        this.state.sketch.height = height;
        
        this.canvas.elements.sketchCanvas.width = width;
        this.canvas.elements.sketchCanvas.height = height;
        this.canvas.elements.selectionOverlay.width = width;
        this.canvas.elements.selectionOverlay.height = height;
        
        // Update all layers to new size (content is preserved if smaller)
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
        this.ui.updateCanvasInfo();
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
          this.history.pushHistory('Change Blend Mode');
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
        
        if (content.style.display === 'none' || content.style.display === '') {
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
      this.state.isShiftPressed = e.shiftKey;
      this.state.isCtrlPressed = e.ctrlKey || e.metaKey;
      
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
            this.exportJSON(); // Save project (as JSON)
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
          'l': 'line', 'r': 'rect', 'o': 'circle'
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
          let tool = pixelTools[e.key];
          if (tool) {
            // Check for Shift+Tool for symmetric tools
            if (e.shiftKey && (tool === 'pencil' || tool === 'eraser' || tool === 'fill')) {
                tool = `symmetric${tool.charAt(0).toUpperCase()}${tool.slice(1)}`;
            }
            // Check for Shift+Tool for filled shapes
            if (e.shiftKey && (tool === 'rect' || tool === 'circle')) {
                tool = `${tool}Filled`;
            }
            
            this.state.pixel.activeTool = tool;
            this.ui.updateToolControls();
            this.ui.updateCanvasInfo();
            e.preventDefault();
          } else if (symmetryKeys[e.key]) {
            this.setSymmetryMode(symmetryKeys[e.key]);
            e.preventDefault();
          }
        } else if (this.state.mode === 'sketch' && sketchTools[e.key]) {
          this.state.sketch.activeTool = sketchTools[e.key];
          this.ui.updateToolControls();
          this.ui.updateCanvasInfo();
          e.preventDefault();
        }
        
        // Transform shortcuts (pixel mode)
        if (this.state.mode === 'pixel') {
          if (e.key === '[' || e.key === ']') e.preventDefault();
          if (e.key === '[') this.transformSelection('rotate', -90);
          if (e.key === ']') this.transformSelection('rotate', 90);
        }
        
        // Brush size adjustment (sketch mode)
        if (this.state.mode === 'sketch') {
          if (e.key === '[' || e.key === ']') e.preventDefault();
          if (e.key === '[') {
            this.state.sketch.size = Math.max(SKETCH_LIMITS.MIN_BRUSH_SIZE, this.state.sketch.size - 1);
            this.ui.updateSketchControls();
          }
          if (e.key === ']') {
            this.state.sketch.size = Math.min(SKETCH_LIMITS.MAX_BRUSH_SIZE, this.state.sketch.size + 1);
            this.ui.updateSketchControls();
          }
        }
      }
    };
    
    document.onkeyup = (e) => {
      this.state.isShiftPressed = e.shiftKey;
      this.state.isCtrlPressed = e.ctrlKey || e.metaKey;
    };
    
    // Prevent scrolling on touch devices when drawing
    document.addEventListener('touchmove', (e) => {
      if (e.target.closest('.canvas-area') && this.state.isDrawing) {
        e.preventDefault();
      }
    }, { passive: false });
  }
}

// =====================
// AUTO SAVE FUNCTIONS
// =====================
function autoSave() {
  if (typeof jerryEditor !== 'undefined' && jerryEditor.state) {
    try {
      // Save full project state as JSON
      const projectData = {
          mode: jerryEditor.state.mode,
          pixel: {
            width: jerryEditor.state.pixel.width,
            height: jerryEditor.state.pixel.height,
            sprites: jerryEditor.state.pixel.sprites,
          },
          sketch: {
            width: jerryEditor.state.sketch.width,
            height: jerryEditor.state.sketch.height,
            layers: jerryEditor.state.sketch.layers.map(layer => ({
              id: layer.id,
              name: layer.name,
              opacity: layer.opacity,
              blendMode: layer.blendMode,
              visible: layer.visible,
              imageData: layer.canvas.toDataURL()
            }))
          }
      };
      localStorage.setItem('jerryProjectAutoSave', JSON.stringify(projectData));
    } catch (error) {
      // Catch quota errors
      if (error.name === 'QuotaExceededError') {
        console.warn('Auto-save failed: Storage quota exceeded.');
      } else {
        console.warn('Auto-save failed:', error);
      }
    }
  }
}

function restoreSave() {
  if (typeof jerryEditor === 'undefined' || !jerryEditor.state) return;
  
  try {
    const data = localStorage.getItem('jerryProjectAutoSave');
    if (data) {
      const projectData = JSON.parse(data);
      if (confirm('A previous auto-saved project was found. Would you like to restore it?')) {
        jerryEditor.loadProjectData(projectData);
        jerryEditor.history.pushHistory('Restore Auto-Save');
        return true;
      }
    }
  } catch (error) {
    console.warn('Restore save failed:', error);
  }
  return false;
}

// Set up auto-save interval
setInterval(autoSave, 15000); // Auto-save every 15 seconds

// =====================
// INITIALIZE APPLICATION
// =====================
let jerryEditor;

document.addEventListener('DOMContentLoaded', () => {
  jerryEditor = new JerryEditor();
  
  // Restore auto-saved data after initialization, but before the initial history push
  if (restoreSave()) {
    // If restored, re-push the state to clear the redo stack and log the restore
    jerryEditor.history.pushHistory('Project Restored');
  } else {
    // Initial history push if not restored (already done in constructor, but left here as a safety)
    jerryEditor.history.pushHistory('Initial Project');
  }
  
  // Prevent default touch behaviors that interfere with drawing
  document.addEventListener('touchstart', (e) => {
    if (e.target.closest('.canvas-area')) {
      // Allow multi-touch for zoom/pan if implemented, but prevent default single-touch scroll
      if (e.touches.length === 1 && jerryEditor.state.isDrawing) {
        e.preventDefault();
      }
    }
  }, { passive: false });
  
  document.addEventListener('touchmove', (e) => {
    if (e.target.closest('.canvas-area') && jerryEditor.state.isDrawing) {
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
