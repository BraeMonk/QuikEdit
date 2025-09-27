// Jerry Editor - Professional Pixel & Sketch Art Editor
class JerryEditor {
    constructor() {
        this.mode = 'pixel';
        this.currentTool = 'pencil';
        this.symmetryMode = 'none';
        this.primaryColor = '#000000';
        this.secondaryColor = '#ffffff';
        this.zoom = 1;
        this.isDrawing = false;
        this.lastPos = null;
        this.undoStack = [];
        this.redoStack = [];
        this.maxUndoSteps = 50;
        
        // Pixel art properties
        this.canvasWidth = 16;
        this.canvasHeight = 16;
        this.pixelSize = 20;
        this.grid = [];
        this.sprites = [{ name: 'Sprite 1', data: null }];
        this.currentSprite = 0;
        
        // Sketch art properties
        this.layers = [];
        this.currentLayer = 0;
        this.brushSize = 10;
        this.brushOpacity = 100;
        this.brushHardness = 100;
        this.brushFlow = 100;
        this.blendMode = 'source-over';
        
        // Selection properties
        this.selection = null;
        this.selectionData = null;
        this.selectionStart = null;
        this.selecting = false;
        
        // Shape drawing
        this.shapeStartPos = null;
        this.tempCanvas = null;
        this.tempCtx = null;
        
        // Movement
        this.movingSelection = false;
        this.moveStartPos = null;
        
        this.init();
    }
    
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.loadPalettes();
        this.initializeCanvas();
        this.switchMode('pixel');  // builds pixel canvas fully
        this.loadProject();
        this.updateUI();
        this.initializePanels();

        // Force initial tool visibility update safely
        const pixelTools = document.querySelector('.pixel-tools');
        const sketchTools = document.querySelector('.sketch-tools');
        if (pixelTools) {
            pixelTools.classList.add('active');
            // Remove any conflicting inline styles
            pixelTools.style.display = '';
        }
        if (sketchTools) {
            sketchTools.classList.remove('active');
        }

        // ENABLE GRID BY DEFAULT
        this.showGrid = true;

        // ensure the overlay exists then make it grid (important: use 'grid' not 'block')
        if (this.canvasGrid) {
            this.canvasGrid.style.display = 'grid'; // use grid so grid-template-* works
        }

        // Sync the UI toggle
        const gridToggle = document.getElementById('gridToggle');
        if (gridToggle) gridToggle.checked = true;

        // finally redraw (this-updateGrid respects this.showGrid)
        this.updateGrid();
    }
    
    setupElements() {
        // Canvas elements
        this.pixelCanvas = document.getElementById('canvas');
        this.sketchCanvas = document.getElementById('sketchCanvas');
        this.sketchCtx = this.sketchCanvas.getContext('2d');
        this.selectionOverlay = document.getElementById('selectionOverlay');
        this.selectionCtx = this.selectionOverlay.getContext('2d');
        this.canvasGrid = document.getElementById('canvasGrid');
        // <--- ADD THIS LINE: reference the wrapper the code expects
        this.canvasWrapper = document.querySelector('.canvas-wrapper');
        // UI elements
        this.canvasInfo = document.getElementById('canvasInfo');
        this.zoomIndicator = document.getElementById('zoomIndicator');
        this.primaryColorEl = document.getElementById('primaryColor');
        this.secondaryColorEl = document.getElementById('secondaryColor');
        this.paletteSelector = document.getElementById('paletteSelector');
        this.swatchesContainer = document.getElementById('swatches');
        this.colorPickers = document.getElementById('colorPickers');
        
        // Controls
        this.canvasWidthInput = document.getElementById('canvasWidth');
        this.canvasHeightInput = document.getElementById('canvasHeight');
        this.spriteSelector = document.getElementById('spriteSelector');
        this.brushSizeSlider = document.getElementById('brushSize');
        this.brushOpacitySlider = document.getElementById('brushOpacity');
        this.brushHardnessSlider = document.getElementById('brushHardness');
        this.brushFlowSlider = document.getElementById('brushFlow');
        this.sketchColorPicker = document.getElementById('sketchColor');
        this.layerList = document.getElementById('layerList');
        this.layerOpacitySlider = document.getElementById('layerOpacity');
        this.blendModeSelect = document.getElementById('blendMode');
    }
    
    setupEventListeners() {
        // Mode switching
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelector('.mode-btn.active').classList.remove('active');
                btn.classList.add('active');
                this.switchMode(btn.dataset.mode);
            });
        });
        
        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const toolGroup = btn.closest('.tool-group');
                toolGroup.querySelector('.tool-btn.active')?.classList.remove('active');
                btn.classList.add('active');
                this.currentTool = btn.dataset.tool;
                this.updateCanvasInfo();
            });
        });

        document.querySelectorAll('.panel-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const panel = header.closest('.panel');
                const content = panel.querySelector('.panel-content');
                
                panel.classList.toggle('collapsed');
                
                if (panel.classList.contains('collapsed')) {
                    content.style.maxHeight = '0';
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    
                    // Reset max-height after animation to allow dynamic content
                    setTimeout(() => {
                        if (!panel.classList.contains('collapsed')) {
                            content.style.maxHeight = 'none';
                        }
                    }, 300);
                }
            });
        });
        
        // Symmetry controls
        document.querySelectorAll('.symmetry-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelector('.symmetry-btn.active').classList.remove('active');
                btn.classList.add('active');
                this.symmetryMode = btn.dataset.symmetry;
            });
        });
        
        // Canvas interactions
        this.setupCanvasEvents();
        
        // Header buttons
        document.getElementById('newProject').addEventListener('click', () => this.newProject());
        document.getElementById('saveProject').addEventListener('click', () => this.saveProject());
        document.getElementById('exportPNG').addEventListener('click', () => this.exportPNG());
        
        // Canvas controls
        document.getElementById('resizeCanvas').addEventListener('click', () => this.resizeCanvas());
        document.getElementById('zoomIn').addEventListener('click', () => this.adjustZoom(1.5));
        document.getElementById('zoomOut').addEventListener('click', () => this.adjustZoom(0.75));
        document.getElementById('zoomReset').addEventListener('click', () => this.setZoom(1));
        document.getElementById('undo').addEventListener('click', () => this.undo());
        document.getElementById('redo').addEventListener('click', () => this.redo());
        document.getElementById('clear').addEventListener('click', () => this.clearCanvas());
        document.getElementById('gridToggle').addEventListener('change', (e) => {
            this.showGrid = e.target.checked; // checked = show, unchecked = hide
            this.canvasGrid.style.display = this.showGrid ? 'grid' : 'none';
        });
        
        // Transform controls
        document.getElementById('rotateLeft').addEventListener('click', () => this.rotate(-90));
        document.getElementById('rotateRight').addEventListener('click', () => this.rotate(90));
        document.getElementById('rotate180').addEventListener('click', () => this.rotate(180));
        document.getElementById('flipHorizontal').addEventListener('click', () => this.flip('horizontal'));
        document.getElementById('flipVertical').addEventListener('click', () => this.flip('vertical'));
        
        // Sprite controls
        document.getElementById('newSprite').addEventListener('click', () => this.newSprite());
        document.getElementById('duplicateSprite').addEventListener('click', () => this.duplicateSprite());
        document.getElementById('deleteSprite').addEventListener('click', () => this.deleteSprite());
        this.spriteSelector?.addEventListener('change', (e) => {
            this.switchSprite(parseInt(e.target.value));
        });
        
        // Color controls
        this.primaryColorEl.addEventListener('click', () => this.openColorPicker('primary'));
        this.secondaryColorEl.addEventListener('click', () => this.openColorPicker('secondary'));
        this.paletteSelector?.addEventListener('change', (e) => this.loadPalette(e.target.value));
        
        // Sketch controls
        this.brushSizeSlider?.addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
            document.getElementById('brushSizeLabel').textContent = this.brushSize;
            this.updateBrushPreview();
        });
        
        this.brushOpacitySlider?.addEventListener('input', (e) => {
            this.brushOpacity = parseInt(e.target.value);
            document.getElementById('opacityLabel').textContent = this.brushOpacity;
            this.updateBrushPreview();
        });
        
        this.brushHardnessSlider?.addEventListener('input', (e) => {
            this.brushHardness = parseInt(e.target.value);
            document.getElementById('hardnessLabel').textContent = this.brushHardness;
            this.updateBrushPreview();
        });
        
        this.brushFlowSlider?.addEventListener('input', (e) => {
            this.brushFlow = parseInt(e.target.value);
            document.getElementById('flowLabel').textContent = this.brushFlow;
        });
        
        this.sketchColorPicker?.addEventListener('change', (e) => {
            this.primaryColor = e.target.value;
            this.primaryColorEl.style.background = this.primaryColor;
        });
        
        // Layer controls
        document.getElementById('addLayer')?.addEventListener('click', () => this.addLayer());
        this.layerOpacitySlider?.addEventListener('input', (e) => {
            if (this.layers[this.currentLayer]) {
                this.layers[this.currentLayer].opacity = parseInt(e.target.value) / 100;
                document.getElementById('layerOpacityLabel').textContent = e.target.value;
                this.redrawLayers();
            }
        });
        
        this.blendModeSelect?.addEventListener('change', (e) => {
            if (this.layers[this.currentLayer]) {
                this.layers[this.currentLayer].blendMode = e.target.value;
                this.redrawLayers();
            }
        });
        
        // Export/Import
        document.getElementById('exportJSON')?.addEventListener('click', () => this.exportJSON());
        document.getElementById('exportPNG2')?.addEventListener('click', () => this.exportPNG());
        document.getElementById('importFile')?.addEventListener('change', (e) => this.importFile(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Palette management
        document.getElementById('saveCustomPalette')?.addEventListener('click', () => this.saveCustomPalette());
        
        // Canvas size presets for sketch mode
        document.querySelectorAll('[data-size]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const [width, height] = e.target.dataset.size.split('x').map(Number);
                this.resizeSketchCanvas(width, height);
            });
        });
        
        // Auto-save
        setInterval(() => this.autoSave(), 30000);
    }

    initializePanels() {
        document.querySelectorAll('.panel-content').forEach(content => {
            content.style.maxHeight = 'none';
        });
    }
    
    // Replace the setupCanvasEvents method in your JerryEditor class

    setupCanvasEvents() {
        const canvasWrapper = document.querySelector('.canvas-wrapper');
    
        // pointerdown - works for mouse, touch, pen
        canvasWrapper.addEventListener('pointerdown', (e) => {
            // only left mouse, or any touch/pen
            if (e.pointerType === 'mouse' && e.button !== 0) return;
    
            e.preventDefault();
            canvasWrapper.setPointerCapture(e.pointerId);
            this._activePointerId = e.pointerId;
            this.startDrawing(e);
        });
    
        // pointermove
        canvasWrapper.addEventListener('pointermove', (e) => {
            if (this._activePointerId !== e.pointerId) return;
    
            // skip hover when no mouse button pressed
            if (e.pointerType === 'mouse' && e.buttons === 0) return;
    
            this.draw(e);
        });
    
        // pointerup
        canvasWrapper.addEventListener('pointerup', (e) => {
            if (this._activePointerId === e.pointerId) {
                try { canvasWrapper.releasePointerCapture(e.pointerId); } catch {}
                this._activePointerId = null;
            }
            this.stopDrawing(e);
        });
    
        // pointercancel (touch interruptions)
        canvasWrapper.addEventListener('pointercancel', (e) => {
            if (this._activePointerId === e.pointerId) {
                try { canvasWrapper.releasePointerCapture(e.pointerId); } catch {}
                this._activePointerId = null;
            }
            this.stopDrawing(e);
        });
    
        // zoom with wheel
        canvasWrapper.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            this.adjustZoom(zoomFactor);
        }, { passive: false });
    
        // block touch scrolling inside canvas
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.canvas-wrapper')) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    
    // Also add this improved startDrawing method
    startDrawing(e) {
        this.isDrawing = true;
    
        // Get position based on current mode
        const pos = this.mode === 'pixel' ? this.getPixelPos(e) : this.getCanvasPos(e);
        this.lastPos = pos;
    
        // Initialize stroke path
        this.strokePath = [pos];
        this.strokeStartTime = Date.now();
    
        // ----- PIXEL SELECTION -----
        if (this.currentTool === 'select' && this.mode === 'pixel') {
            this.startPixelSelection(pos);
            return;
        }
    
        // ----- PIXEL MOVE -----
        if (this.currentTool === 'move' && this.mode === 'pixel') {
            this.startPixelMove(pos);
            return;
        }
    
        // ----- SKETCH SHAPES -----
        if (this.mode === 'sketch' && ['lineSketch', 'rectSketch', 'circleSketch'].includes(this.currentTool)) {
            this.shapeStartPos = pos;
            this.saveShapeState(); // optional: store canvas state for preview
            return;
        }
    
        // ----- PIXEL SHAPES -----
        if (this.mode === 'pixel' && ['line', 'rect', 'circle'].includes(this.currentTool)) {
            this.isDrawingShape = true;
            this.shapeStartPos = pos;
            this.originalGrid = this.cloneGrid(this.grid); // store grid for live preview
            return;
        }
    
        // ----- REGULAR TOOLS -----
        this.saveState(); // save current state for undo
    
        if (this.mode === 'pixel') {
            const rightClick = e.buttons === 2;
            this.handlePixelTool(pos, rightClick, false, false);
        } else {
            this.handleSketchTool(pos, e);
        }
    }

    
    draw(e) {
        const pos = this.mode === 'pixel' ? this.getPixelPos(e) : this.getCanvasPos(e);

        if (!this.isDrawing) {
            if (this.mode === 'sketch' && ['brush','pen','marker','pencilSketch','charcoal','eraser'].includes(this.currentTool)) {
                this.showBrushPreview(pos);
            }
            return;
        }

        if (this.strokePath) this.strokePath.push(pos);

        // ----- PIXEL SELECTION -----
        if (this.currentTool === 'select' && this.mode === 'pixel') {
            this.updatePixelSelection(pos);
            return;
        }

        // ----- PIXEL MOVE -----
        if (this.currentTool === 'move' && this.mode === 'pixel') {
            this.updatePixelMove(pos);
            return;
        }

        // ----- SKETCH SHAPES -----
        if (this.mode === 'sketch' && ['lineSketch','rectSketch','circleSketch'].includes(this.currentTool) && this.shapeStartPos) {
            this.clearShapePreview();
            this.previewShape(this.shapeStartPos, pos);
            return;
        }

        // ----- PIXEL / SKETCH TOOLS -----
        if (this.mode === 'pixel') {
            const rightClick = e.buttons === 2;
            this.handlePixelTool(pos, rightClick, false, false);
        } else {
            this.handleSketchTool(pos, e);
        }

        // update lastPos only AFTER drawing
        this.lastPos = pos;
    }

    // Add this method to improve getCanvasPos for better coordinate calculation
    getCanvasPos(e) {
        const canvas = this.mode === 'pixel' ? this.pixelCanvas : this.sketchCanvas;
        const rect = canvas.getBoundingClientRect();
        
        // Account for canvas wrapper padding and zoom
        const canvasWrapper = document.querySelector('.canvas-wrapper');
        const wrapperRect = canvasWrapper.getBoundingClientRect();
        const wrapperStyle = window.getComputedStyle(canvasWrapper);
        const padding = parseInt(wrapperStyle.padding) || 20;
        
        // Calculate position relative to actual canvas
        const x = (e.clientX - rect.left) / this.zoom;
        const y = (e.clientY - rect.top) / this.zoom;
        
        return { x, y };
    }
    
    switchMode(mode) {
        this.mode = mode;

        const pixelTools = document.querySelector('.pixel-tools');
        const sketchTools = document.querySelector('.sketch-tools');

        if (pixelTools) {
            if (mode === 'pixel') {
                pixelTools.classList.add('active');
                pixelTools.style.display = ''; // Remove inline style to let CSS handle it
            } else {
                pixelTools.classList.remove('active');
            }
        }
        if (sketchTools) {
            if (mode === 'sketch') {
                sketchTools.classList.add('active');
                sketchTools.style.display = ''; // Remove inline style to let CSS handle it
            } else {
                sketchTools.classList.remove('active');
            }
        }

        // ----- CONTROLS -----
        const pixelControls = document.querySelector('.pixel-controls');
        const sketchControls = document.querySelector('.sketch-controls');

        if (pixelControls) {
            pixelControls.style.display = mode === 'pixel' ? 'block' : 'none';
        }
        if (sketchControls) {
            sketchControls.style.display = mode === 'sketch' ? 'block' : 'none';
        }
        
        // ----- CANVASES -----
        this.pixelCanvas.style.display = mode === 'pixel' ? 'grid' : 'none';
        this.sketchCanvas.style.display = mode === 'sketch' ? 'block' : 'none';
        if (mode === 'pixel') {
            this.canvasGrid.style.display = this.showGrid ? 'grid' : 'none';
        }
        this.selectionOverlay.style.display = mode === 'sketch' ? 'block' : 'none';

        // ----- INITIALIZE MODE -----
        if (mode === 'pixel') {
            this.currentTool = 'pencil';
            this.pixelCanvas.style.gridTemplateColumns = `repeat(${this.canvasWidth}, ${this.pixelSize}px)`;
            this.pixelCanvas.style.gridTemplateRows = `repeat(${this.canvasHeight}, ${this.pixelSize}px)`;
            this.updatePixelCanvas();
            this.updateGrid();
            this.lastPos = null;
            this.strokePath = [];
        } else {
            this.currentTool = 'brush';
            this.initializeSketchMode();
            this.lastPos = null;
            this.strokePath = [];
        }

        // ----- UPDATE UI -----
        this.updateUI();
    }


    
    initializeCanvas() {
        if (this.mode === 'pixel') {
            this.initializeGrid();
            this.updatePixelCanvas();
            this.updateGrid();
        } else {
            this.initializeSketchMode();
        }
    }
    
    initializeGrid() {
        this.grid = [];
        for (let y = 0; y < this.canvasHeight; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.canvasWidth; x++) {
                this.grid[y][x] = 'transparent';
            }
        }
    }
    
    initializeSketchMode() {
        this.sketchCanvas.width = 800;
        this.sketchCanvas.height = 600;
        this.selectionOverlay.width = 800;
        this.selectionOverlay.height = 600;
        
        // Configure canvas for smooth drawing
        this.sketchCtx.lineCap = 'round';
        this.sketchCtx.lineJoin = 'round';
        this.sketchCtx.imageSmoothingEnabled = true;
        
        if (this.layers.length === 0) {
            this.addLayer();
            // Fill background with white
            this.layers[0].ctx.fillStyle = '#ffffff';
            this.layers[0].ctx.fillRect(0, 0, this.sketchCanvas.width, this.sketchCanvas.height);
        }
        
        // Setup temporary canvas for shape previews
        this.tempCanvas = document.createElement('canvas');
        this.tempCanvas.width = this.sketchCanvas.width;
        this.tempCanvas.height = this.sketchCanvas.height;
        this.tempCtx = this.tempCanvas.getContext('2d');
        this.tempCtx.lineCap = 'round';
        this.tempCtx.lineJoin = 'round';
        
        this.updateLayerList();
        this.updateBrushPreview();
    }
    
    updatePixelCanvas() {
        this.pixelCanvas.innerHTML = '';
    
        const canvasWidthPx = this.canvasWidth * this.pixelSize;
        const canvasHeightPx = this.canvasHeight * this.pixelSize;
    
        // Set pixel canvas dimensions
        this.pixelCanvas.style.display = 'grid';
        this.pixelCanvas.style.width = `${canvasWidthPx}px`;
        this.pixelCanvas.style.height = `${canvasHeightPx}px`;
        this.pixelCanvas.style.gridTemplateColumns = `repeat(${this.canvasWidth}, ${this.pixelSize}px)`;
        this.pixelCanvas.style.gridTemplateRows = `repeat(${this.canvasHeight}, ${this.pixelSize}px)`;
        this.pixelCanvas.style.backgroundColor = 'transparent';
        this.pixelCanvas.style.position = 'relative';
        this.pixelCanvas.style.top = '0';
        this.pixelCanvas.style.left = '0';
        this.pixelCanvas.style.transform = 'none'; // remove old scaling
    
        // Update wrapper CSS variables (checkerboard/grid support)
        this.canvasWrapper.style.setProperty('--cellSize', `${this.pixelSize}px`);
        this.canvasWrapper.style.setProperty('--halfCell', `${this.pixelSize / 2}px`);
        this.canvasWrapper.style.setProperty('--cols', this.canvasWidth);
        this.canvasWrapper.style.setProperty('--rows', this.canvasHeight);
    
        // Update grid overlay to match exactly
        this.canvasGrid.style.width = `${canvasWidthPx}px`;
        this.canvasGrid.style.height = `${canvasHeightPx}px`;
        this.canvasGrid.style.setProperty('--cols', this.canvasWidth);
        this.canvasGrid.style.setProperty('--rows', this.canvasHeight);
        this.canvasGrid.style.setProperty('--cellSize', `${this.pixelSize}px`);
        this.canvasGrid.style.transform = 'translate(-50%, -50%)'; // ensure grid stays centered
    
        // Populate pixels
        for (let y = 0; y < this.canvasHeight; y++) {
            for (let x = 0; x < this.canvasWidth; x++) {
                const pixel = document.createElement('div');
                pixel.className = 'pixel';
                pixel.style.width = `${this.pixelSize}px`;
                pixel.style.height = `${this.pixelSize}px`;
                const color = this.grid[y][x];
                pixel.style.backgroundColor = color === 'transparent' ? 'transparent' : color;
                pixel.dataset.x = x;
                pixel.dataset.y = y;
                this.pixelCanvas.appendChild(pixel);
            }
        }
    }
    
    updateGrid() {
        if (this.mode !== 'pixel') return;

        const grid = this.canvasGrid;

        // Set size to match canvas exactly
        grid.style.width = `${this.canvasWidth * this.pixelSize}px`;
        grid.style.height = `${this.canvasHeight * this.pixelSize}px`;

        // Center grid in wrapper
        grid.style.position = 'absolute';
        grid.style.top = '50%';
        grid.style.left = '50%';
        grid.style.transform = 'translate(-50%, -50%)';
        grid.style.pointerEvents = 'none';
        grid.style.zIndex = '10';

        const lineColor = 'rgba(255, 255, 255, 0.2)';
        const offset = 0.5;

        grid.style.backgroundImage = `
            repeating-linear-gradient(
                to right,
                transparent,
                transparent ${this.pixelSize - offset}px,
                ${lineColor} ${this.pixelSize - offset}px,
                ${lineColor} ${this.pixelSize}px
            ),
            repeating-linear-gradient(
                to bottom,
                transparent,
                transparent ${this.pixelSize - offset}px,
                ${lineColor} ${this.pixelSize - offset}px,
                ${lineColor} ${this.pixelSize}px
            )
        `;
        grid.style.backgroundSize = `${this.pixelSize}px ${this.pixelSize}px`;
        grid.style.backgroundPosition = `${offset}px ${offset}px`;
    }
    
    getCanvasPos(e) {
        const rect = (this.mode === 'pixel' ? this.pixelCanvas : this.sketchCanvas).getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / this.zoom,
            y: (e.clientY - rect.top) / this.zoom
        };
    }
    
    getPixelPos(e) {
        const rect = this.pixelCanvas.getBoundingClientRect();
    
        const scaleX = rect.width / (this.canvasWidth * this.pixelSize);
        const scaleY = rect.height / (this.canvasHeight * this.pixelSize);
    
        const x = Math.floor((e.clientX - rect.left) / (this.pixelSize * scaleX));
        const y = Math.floor((e.clientY - rect.top) / (this.pixelSize * scaleY));
    
        return { x, y };
    }

    
    stopDrawing() {
        if (!this.isDrawing) return;
    
        // ----- PIXEL SELECTION -----
        if (this.currentTool === 'select' && this.mode === 'pixel') {
            this.finalizePixelSelection();
        }
    
        // ----- PIXEL MOVE -----
        if (this.currentTool === 'move' && this.mode === 'pixel') {
            this.finalizePixelMove();
        }
    
        // ----- Sketch shapes -----
        if (this.mode === 'sketch' && ['lineSketch','rectSketch','circleSketch'].includes(this.currentTool) && this.shapeStartPos) {
            this.finalizeShape();
            this.shapeStartPos = null;
            this.clearShapePreview();
        }
    
        // ----- Pixel shapes -----
        if (this.mode === 'pixel' && ['line','rect','circle'].includes(this.currentTool) && this.isDrawingShape) {
            this.handlePixelTool(this.lastPos, false, false, true); // commit
            this.isDrawingShape = false;
            this.shapeStartPos = null;
            this.originalGrid = null;
        }

        if (this.mode === 'sketch' && ['brush','pen','marker','pencilSketch','charcoal','eraser','smudge','blur','sprayPaint'].includes(this.currentTool)) {
            this.saveState(); // commit freehand strokes to undo history
        }
    
        this.isDrawing = false;
        this.lastPos = null;
        this.strokePath = null;
    }

    
    // ----- PIXEL SELECTION METHODS -----
    startPixelSelection(pos) {
        this.clearPixelSelection();
        this.pixelSelection = {
            startX: pos.x,
            startY: pos.y,
            endX: pos.x,
            endY: pos.y,
            active: true
        };
        this.selecting = true;
    }
    
    updatePixelSelection(pos) {
        if (!this.pixelSelection) return;
        this.pixelSelection.endX = pos.x;
        this.pixelSelection.endY = pos.y;
        this.drawPixelSelectionOverlay();
    }
    
    finalizePixelSelection() {
        if (!this.pixelSelection) return;
        
        const minX = Math.min(this.pixelSelection.startX, this.pixelSelection.endX);
        const maxX = Math.max(this.pixelSelection.startX, this.pixelSelection.endX);
        const minY = Math.min(this.pixelSelection.startY, this.pixelSelection.endY);
        const maxY = Math.max(this.pixelSelection.startY, this.pixelSelection.endY);
        
        if (maxX > minX || maxY > minY) {
            // Store selected pixels
            this.pixelSelectionData = [];
            for (let y = minY; y <= maxY; y++) {
                this.pixelSelectionData[y - minY] = [];
                for (let x = minX; x <= maxX; x++) {
                    this.pixelSelectionData[y - minY][x - minX] = this.grid[y] ? this.grid[y][x] : 'transparent';
                }
            }
            this.pixelSelection.finalized = true;
        }
        this.selecting = false;
    }
    
    drawPixelSelectionOverlay() {
        this.clearPixelSelection();
        if (!this.pixelSelection) return;
        
        const minX = Math.min(this.pixelSelection.startX, this.pixelSelection.endX);
        const maxX = Math.max(this.pixelSelection.startX, this.pixelSelection.endX);
        const minY = Math.min(this.pixelSelection.startY, this.pixelSelection.endY);
        const maxY = Math.max(this.pixelSelection.startY, this.pixelSelection.endY);
        
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const pixel = this.pixelCanvas.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                if (pixel) {
                    pixel.style.outline = '2px dashed #fff';
                    pixel.style.outlineOffset = '-1px';
                }
            }
        }
    }
    
    clearPixelSelection() {
        this.pixelCanvas.querySelectorAll('[data-x]').forEach(pixel => {
            pixel.style.outline = '';
            pixel.style.outlineOffset = '';
        });
    }
    
    // ----- PIXEL MOVE METHODS -----
    startPixelMove(pos) {
        if (!this.pixelSelection || !this.pixelSelection.finalized) return;
    
        const minX = Math.min(this.pixelSelection.startX, this.pixelSelection.endX);
        const maxX = Math.max(this.pixelSelection.startX, this.pixelSelection.endX);
        const minY = Math.min(this.pixelSelection.startY, this.pixelSelection.endY);
        const maxY = Math.max(this.pixelSelection.startY, this.pixelSelection.endY);
    
        if (pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY) {
            this.movingPixelSelection = true;
            this.pixelMoveStart = pos;
            this.originalPixelSelection = { ...this.pixelSelection };
    
            // Copy original selection pixels (don't clear grid yet)
            this.movingPixelData = [];
            for (let y = 0; y <= maxY - minY; y++) {
                this.movingPixelData[y] = [];
                for (let x = 0; x <= maxX - minX; x++) {
                    this.movingPixelData[y][x] = this.grid[minY + y][minX + x];
                    // Temporarily clear the grid for ghost effect
                    this.grid[minY + y][minX + x] = 'transparent';
                }
            }
    
            this.updatePixelCanvas();
        }
    }
    
    updatePixelMove(pos) {
        if (!this.movingPixelSelection || !this.pixelMoveStart) return;
    
        const dx = pos.x - this.pixelMoveStart.x;
        const dy = pos.y - this.pixelMoveStart.y;
    
        this.pixelSelection.startX = this.originalPixelSelection.startX + dx;
        this.pixelSelection.endX = this.originalPixelSelection.endX + dx;
        this.pixelSelection.startY = this.originalPixelSelection.startY + dy;
        this.pixelSelection.endY = this.originalPixelSelection.endY + dy;
    
        this.drawMovedPixels();
        this.drawPixelSelectionOverlay();
    }
    
    drawMovedPixels() {
        if (!this.pixelSelection || !this.movingPixelData) return;
    
        // Clear and redraw entire canvas
        this.updatePixelCanvas();
    
        const startX = Math.min(this.pixelSelection.startX, this.pixelSelection.endX);
        const startY = Math.min(this.pixelSelection.startY, this.pixelSelection.endY);
    
        // Draw the "ghost" selection without committing to grid
        for (let y = 0; y < this.movingPixelData.length; y++) {
            for (let x = 0; x < this.movingPixelData[y].length; x++) {
                const newX = startX + x;
                const newY = startY + y;
    
                if (newX >= 0 && newX < this.canvasWidth &&
                    newY >= 0 && newY < this.canvasHeight) {
                    if (this.movingPixelData[y][x] !== 'transparent') {
                        const pixel = this.pixelCanvas.querySelector(`[data-x="${newX}"][data-y="${newY}"]`);
                        if (pixel) pixel.style.backgroundColor = this.movingPixelData[y][x];
                    }
                }
            }
        }
    }
    
    finalizePixelMove() {
        if (!this.pixelSelection || !this.movingPixelData) return;
    
        const startX = Math.min(this.pixelSelection.startX, this.pixelSelection.endX);
        const startY = Math.min(this.pixelSelection.startY, this.pixelSelection.endY);
    
        // Commit moved pixels to grid
        for (let y = 0; y < this.movingPixelData.length; y++) {
            for (let x = 0; x < this.movingPixelData[y].length; x++) {
                const newX = startX + x;
                const newY = startY + y;
                if (newX >= 0 && newX < this.canvasWidth &&
                    newY >= 0 && newY < this.canvasHeight) {
                    this.grid[newY][newX] = this.movingPixelData[y][x];
                }
            }
        }
    
        this.movingPixelSelection = false;
        this.pixelMoveStart = null;
        this.originalPixelSelection = null;
        this.movingPixelData = null;
    
        this.updatePixelCanvas();
    }

    
    handlePixelTool(pos, rightClick = false, filled = false, isDragEnd = false) {
        if (pos.x < 0 || pos.x >= this.canvasWidth || pos.y < 0 || pos.y >= this.canvasHeight) return;
    
        const color = rightClick ? this.secondaryColor : this.primaryColor;
        const shapeTools = ['line', 'rect', 'circle'];
    
        if (shapeTools.includes(this.currentTool)) {
            // Initialize original grid for preview
            if (!this.originalGrid) {
                this.originalGrid = this.cloneGrid(this.grid);
                return;
            }
    
            // Restore grid to original for live preview
            this.grid = this.cloneGrid(this.originalGrid);
    
            const start = this.shapeStartPos;
    
            switch (this.currentTool) {
                case 'line':
                    this.drawLine(start.x, start.y, pos.x, pos.y, color);
                    break;
                case 'rect':
                    this.drawRect(start.x, start.y, pos.x, pos.y, color, filled);
                    break;
                case 'circle':
                    this.drawCircle(start.x, start.y, pos.x, pos.y, color, filled);
                    break;
            }
    
            // Apply symmetry if active
            if (this.symmetryMode !== 'none') {
                this.applyShapeSymmetry(start, pos, color, filled);
            }
    
            // Commit final shape at drag end
            if (isDragEnd) {
                this.originalGrid = null;
                this.shapeStartPos = null;
            }
        } else {
            // Regular pixel tools
            switch (this.currentTool) {
                case 'pencil':
                case 'symmetricPencil':
                    this.drawPixel(pos.x, pos.y, color);
                    if (this.currentTool === 'symmetricPencil') this.applySymmetry(pos.x, pos.y, color);
                    break;
    
                case 'eraser':
                case 'symmetricEraser':
                    this.drawPixel(pos.x, pos.y, 'transparent');
                    if (this.currentTool === 'symmetricEraser') this.applySymmetry(pos.x, pos.y, 'transparent');
                    break;
    
                case 'eyedropper':
                    const pickedColor = this.grid[pos.y][pos.x];
                    if (pickedColor !== 'transparent') {
                        if (rightClick) {
                            this.secondaryColor = pickedColor;
                            this.secondaryColorEl.style.background = pickedColor;
                        } else {
                            this.primaryColor = pickedColor;
                            this.primaryColorEl.style.background = pickedColor;
                            if (this.sketchColorPicker) this.sketchColorPicker.value = pickedColor;
                        }
                    }
                    break;
    
                case 'fill':
                case 'symmetricFill':
                    this.floodFill(pos.x, pos.y, color);
                    if (this.currentTool === 'symmetricFill') {
                        const symPositions = this.getSymmetryPositions(pos.x, pos.y);
                        symPositions.forEach(sPos => this.floodFill(sPos.x, sPos.y, color));
                    }
                    break;
            }
        }
    
        this.updatePixelCanvas();
    }

    
    // Helper methods for live preview
    restorePixelGridFromTemp() {
        if (!this.tempGrid) return;
        for (let y = 0; y < this.canvasHeight; y++) {
            for (let x = 0; x < this.canvasWidth; x++) {
                this.grid[y][x] = this.tempGrid[y][x];
            }
        }
    }
    
    commitTempGridToMain() {
        if (!this.tempGrid) this.tempGrid = this.cloneGrid(this.grid);
        else for (let y = 0; y < this.canvasHeight; y++)
            for (let x = 0; x < this.canvasWidth; x++)
                this.tempGrid[y][x] = this.grid[y][x];
    }
    
    cloneGrid(grid) {
        return grid.map(row => [...row]);
    }



    // Add this new method for pixel line drawing
    drawPixelLine(x0, y0, x1, y1, color) {
        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);
        let sx = (x0 < x1) ? 1 : -1;
        let sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;
    
        while (true) {
            this.drawPixel(x0, y0, color);
    
            if (x0 === x1 && y0 === y1) break;
            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
    }

    applyShapeSymmetry(start, end, color, filled) {
        const symStart = this.getSymmetryPositions(start.x, start.y);
        const symEnd = this.getSymmetryPositions(end.x, end.y);
        
        for (let i = 0; i < symStart.length; i++) {
            switch (this.currentTool) {
                case 'line':
                    this.drawLine(symStart[i].x, symStart[i].y, symEnd[i].x, symEnd[i].y, color);
                    break;
                case 'rect':
                    this.drawRect(symStart[i].x, symStart[i].y, symEnd[i].x, symEnd[i].y, color, filled);
                    break;
                case 'circle':
                    this.drawCircle(symStart[i].x, symStart[i].y, symEnd[i].x, symEnd[i].y, color, filled);
                    break;
            }
        }
    }
    
    handleSketchTool(pos, e) {
        if (!this.layers[this.currentLayer]) return;
        
        const ctx = this.layers[this.currentLayer].ctx;
        const color = this.primaryColor;
        
        // Set base properties but don't save/restore
        ctx.globalAlpha = (this.brushOpacity / 100) * (this.brushFlow / 100);
        ctx.globalCompositeOperation = this.currentTool === 'eraser' ? 'destination-out' : this.layers[this.currentLayer].blendMode;
        
        switch (this.currentTool) {
            case 'brush':
                this.drawSmoothBrush(ctx, pos, color);
                break;
                
            case 'pen':
                this.drawSmoothPen(ctx, pos, color);
                break;
                
            case 'marker':
                this.drawSmoothMarker(ctx, pos, color);
                break;
                
            case 'pencilSketch':
                this.drawTexturedPencil(ctx, pos, color);
                break;
                
            case 'charcoal':
                this.drawTexturedCharcoal(ctx, pos, color);
                break;
                
            case 'eraser':
                this.drawSmoothBrush(ctx, pos, color);
                break;
                
            case 'smudge':
                this.smudge(ctx, pos);
                break;
                
            case 'blur':
                this.blur(ctx, pos);
                break;
                
            case 'sprayPaint':
                this.drawSprayPaint(ctx, pos, color);
                break;
        }
        
        this.redrawLayers();
    }
    
    // Shape preview and finalization for sketch mode
    saveShapeState() {
        if (this.layers[this.currentLayer]) {
            this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
            this.tempCtx.drawImage(this.layers[this.currentLayer].canvas, 0, 0);
        }
    }
    
    previewShape(start, end) {
        if (!this.layers[this.currentLayer]) return;
        
        // Restore original layer state
        this.layers[this.currentLayer].ctx.clearRect(0, 0, this.layers[this.currentLayer].canvas.width, this.layers[this.currentLayer].canvas.height);
        this.layers[this.currentLayer].ctx.drawImage(this.tempCanvas, 0, 0);
        
        // Draw preview shape
        const ctx = this.layers[this.currentLayer].ctx;
        ctx.save();
        ctx.strokeStyle = this.primaryColor;
        ctx.lineWidth = this.brushSize;
        ctx.lineCap = 'round';
        ctx.globalAlpha = this.brushOpacity / 100;
        
        switch (this.currentTool) {
            case 'lineSketch':
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
                break;
                
            case 'rectSketch':
                ctx.strokeRect(
                    Math.min(start.x, end.x),
                    Math.min(start.y, end.y),
                    Math.abs(end.x - start.x),
                    Math.abs(end.y - start.y)
                );
                break;
                
            case 'circleSketch':
                const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
                ctx.beginPath();
                ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
                ctx.stroke();
                break;
        }
        
        ctx.restore();
        this.redrawLayers();
    }
    
    finalizeShape() {
        // Shape is already drawn in preview, just clear the temp canvas
        this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
    }
    
    clearShapePreview() {
        // Already handled in finalizeShape
    }
    
    showBrushPreview(pos) {
        // Clear previous preview
        this.selectionCtx.clearRect(0, 0, this.selectionOverlay.width, this.selectionOverlay.height);
        
        // Draw brush preview
        this.selectionCtx.save();
        this.selectionCtx.strokeStyle = '#ffffff';
        this.selectionCtx.setLineDash([2, 2]);
        this.selectionCtx.lineWidth = 1;
        this.selectionCtx.globalAlpha = 0.8;
        this.selectionCtx.beginPath();
        this.selectionCtx.arc(pos.x, pos.y, this.brushSize / 2, 0, 2 * Math.PI);
        this.selectionCtx.stroke();
        this.selectionCtx.restore();
    }
    
    drawPixel(x, y, color) {
        if (x < 0 || y < 0 || x >= this.canvasWidth || y >= this.canvasHeight) return;
        this.grid[y][x] = color;
    
        // Update the DOM pixel element for immediate feedback
        const selector = `.pixel[data-x="${x}"][data-y="${y}"]`;
        const el = this.pixelCanvas.querySelector(selector);
        if (el) {
            // Allow 'transparent' to be shown as empty
            el.style.backgroundColor = (color === 'transparent') ? 'transparent' : color;
        }
    }

    
    applySymmetry(x, y, color) {
        const positions = this.getSymmetryPositions(x, y);
        positions.forEach(pos => this.drawPixel(pos.x, pos.y, color));
    }
    
    getSymmetryPositions(x, y) {
        const positions = [];
    
        switch (this.symmetryMode) {
            case 'horizontal':
                // Mirror across the horizontal center line (flip Y)
                positions.push({ x, y: this.canvasHeight - 1 - y });
                break;
    
            case 'vertical':
                // Mirror across the vertical center line (flip X)
                positions.push({ x: this.canvasWidth - 1 - x, y });
                break;
    
            case 'both':
                // Mirror across both axes
                positions.push(
                    { x, y: this.canvasHeight - 1 - y },                 // horizontal mirror
                    { x: this.canvasWidth - 1 - x, y },                  // vertical mirror
                    { x: this.canvasWidth - 1 - x, y: this.canvasHeight - 1 - y } // diagonal mirror
                );
                break;
        }
    
        return positions;
    }

    
    floodFill(startX, startY, fillColor) {
        const targetColor = this.grid[startY][startX];
        if (targetColor === fillColor) return;
        
        const stack = [{ x: startX, y: startY }];
        
        while (stack.length > 0) {
            const { x, y } = stack.pop();
            
            if (x < 0 || x >= this.canvasWidth || y < 0 || y >= this.canvasHeight) continue;
            if (this.grid[y][x] !== targetColor) continue;
            
            this.grid[y][x] = fillColor;
            
            stack.push(
                { x: x + 1, y },
                { x: x - 1, y },
                { x, y: y + 1 },
                { x, y: y - 1 }
            );
        }
    }
    
    drawLine(x0, y0, x1, y1, color) {
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;
        
        while (true) {
            this.drawPixel(x0, y0, color);
            
            if (x0 === x1 && y0 === y1) break;
            
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
    }
    
    drawRect(x0, y0, x1, y1, color, filled = false) {
        const minX = Math.min(x0, x1);
        const maxX = Math.max(x0, x1);
        const minY = Math.min(y0, y1);
        const maxY = Math.max(y0, y1);
        
        if (filled) {
            for (let y = minY; y <= maxY; y++) {
                for (let x = minX; x <= maxX; x++) {
                    this.drawPixel(x, y, color);
                }
            }
        } else {
            for (let x = minX; x <= maxX; x++) {
                this.drawPixel(x, minY, color);
                this.drawPixel(x, maxY, color);
            }
            for (let y = minY; y <= maxY; y++) {
                this.drawPixel(minX, y, color);
                this.drawPixel(maxX, y, color);
            }
        }
    }
    
    drawCircle(x0, y0, x1, y1, color, filled = false) {
        const radius = Math.floor(Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)));
        
        if (filled) {
            for (let y = -radius; y <= radius; y++) {
                for (let x = -radius; x <= radius; x++) {
                    if (x * x + y * y <= radius * radius) {
                        this.drawPixel(x0 + x, y0 + y, color);
                    }
                }
            }
        } else {
            let x = radius;
            let y = 0;
            let err = 0;
            
            while (x >= y) {
                this.drawPixel(x0 + x, y0 + y, color);
                this.drawPixel(x0 + y, y0 + x, color);
                this.drawPixel(x0 - y, y0 + x, color);
                this.drawPixel(x0 - x, y0 + y, color);
                this.drawPixel(x0 - x, y0 - y, color);
                this.drawPixel(x0 - y, y0 - x, color);
                this.drawPixel(x0 + y, y0 - x, color);
                this.drawPixel(x0 + x, y0 - y, color);
                
                if (err <= 0) {
                    y += 1;
                    err += 2 * y + 1;
                }
                
                if (err > 0) {
                    x -= 1;
                    err -= 2 * x + 1;
                }
            }
        }
    }
    
    // Layer management
    addLayer() {
        const canvas = document.createElement('canvas');
        canvas.width = this.sketchCanvas.width;
        canvas.height = this.sketchCanvas.height;
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.imageSmoothingEnabled = true;
        
        const layer = {
            canvas: canvas,
            ctx: ctx,
            visible: true,
            opacity: 1,
            blendMode: 'source-over',
            name: `Layer ${this.layers.length + 1}`
        };
        
        this.layers.push(layer);
        this.currentLayer = this.layers.length - 1;
        this.updateLayerList();
        this.redrawLayers();
    }
    
    updateLayerList() {
        if (!this.layerList) return;
        
        this.layerList.innerHTML = '';
        
        for (let i = this.layers.length - 1; i >= 0; i--) {
            const layer = this.layers[i];
            const layerEl = document.createElement('div');
            layerEl.className = `layer-item ${i === this.currentLayer ? 'active' : ''}`;
            layerEl.innerHTML = `
                <span class="layer-name">${layer.name}</span>
                <button class="layer-toggle ${layer.visible ? 'visible' : 'hidden'}" data-layer="${i}">👁</button>
                <button class="layer-delete" data-layer="${i}">🗑</button>
            `;
            
            layerEl.addEventListener('click', (e) => {
                if (!e.target.classList.contains('layer-toggle') && !e.target.classList.contains('layer-delete')) {
                    this.currentLayer = i;
                    this.updateLayerList();
                    this.updateLayerControls();
                }
            });
            
            layerEl.querySelector('.layer-toggle').addEventListener('click', (e) => {
                e.stopPropagation();
                layer.visible = !layer.visible;
                this.updateLayerList();
                this.redrawLayers();
            });
            
            layerEl.querySelector('.layer-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.layers.length > 1) {
                    this.layers.splice(i, 1);
                    if (this.currentLayer >= this.layers.length) {
                        this.currentLayer = this.layers.length - 1;
                    }
                    this.updateLayerList();
                    this.updateLayerControls();
                    this.redrawLayers();
                }
            });
            
            this.layerList.appendChild(layerEl);
        }
    }
    
    updateLayerControls() {
        if (!this.layers[this.currentLayer]) return;
        
        const layer = this.layers[this.currentLayer];
        if (this.layerOpacitySlider) {
            this.layerOpacitySlider.value = layer.opacity * 100;
            document.getElementById('layerOpacityLabel').textContent = Math.round(layer.opacity * 100);
        }
        
        if (this.blendModeSelect) {
            this.blendModeSelect.value = layer.blendMode;
        }
    }
    
    redrawLayers() {
        // Clear main canvas
        this.sketchCtx.clearRect(0, 0, this.sketchCanvas.width, this.sketchCanvas.height);
        
        // Composite all visible layers
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            if (layer.visible) {
                this.sketchCtx.save();
                this.sketchCtx.globalAlpha = layer.opacity;
                this.sketchCtx.globalCompositeOperation = layer.blendMode;
                this.sketchCtx.drawImage(layer.canvas, 0, 0);
                this.sketchCtx.restore();
            }
        }
    }
    
    rotatePixelCanvas(degrees) {
        const newGrid = [];
        
        // For 90-degree rotations, we can do exact pixel rotation
        if (degrees === 90 || degrees === -270) {
            for (let x = 0; x < this.canvasWidth; x++) {
                newGrid[x] = [];
                for (let y = 0; y < this.canvasHeight; y++) {
                    newGrid[x][y] = this.grid[this.canvasHeight - 1 - y][x];
                }
            }
        } else if (degrees === -90 || degrees === 270) {
            for (let x = 0; x < this.canvasWidth; x++) {
                newGrid[x] = [];
                for (let y = 0; y < this.canvasHeight; y++) {
                    newGrid[x][y] = this.grid[y][this.canvasWidth - 1 - x];
                }
            }
        } else if (degrees === 180 || degrees === -180) {
            for (let y = 0; y < this.canvasHeight; y++) {
                newGrid[y] = [];
                for (let x = 0; x < this.canvasWidth; x++) {
                    newGrid[y][x] = this.grid[this.canvasHeight - 1 - y][this.canvasWidth - 1 - x];
                }
            }
        }
        
        this.grid = newGrid;
        this.saveState();
        this.updatePixelCanvas();
    }
    
    rotateSketchCanvas(degrees) {
        const layer = this.layers[this.currentLayer];
        if (!layer) return;
        
        this.saveState();
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = layer.canvas.width;
        tempCanvas.height = layer.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.save();
        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        tempCtx.rotate((degrees * Math.PI) / 180);
        tempCtx.translate(-tempCanvas.width / 2, -tempCanvas.height / 2);
        tempCtx.drawImage(layer.canvas, 0, 0);
        tempCtx.restore();
        
        layer.ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
        layer.ctx.drawImage(tempCanvas, 0, 0);
        
        this.redrawLayers();
    }
    
    drawSprayPaint(ctx, pos, color) {
        const currentAlpha = ctx.globalAlpha;
        
        // Spray paint creates a cloud of varied-sized dots
        const sprayDensity = Math.floor(this.brushSize * 3);
        const sprayRadius = this.brushSize * 1.5;
        
        ctx.fillStyle = color;
        
        for (let i = 0; i < sprayDensity; i++) {
            // Gaussian distribution for more natural spray pattern
            const angle = Math.random() * Math.PI * 2;
            const distance = this.gaussianRandom() * sprayRadius;
            const x = pos.x + Math.cos(angle) * distance;
            const y = pos.y + Math.sin(angle) * distance;
            
            // Varying dot sizes and opacity
            const dotSize = Math.random() * 2.5 + 0.5;
            const opacity = currentAlpha * 0.15 * (Math.random() * 0.8 + 0.2);
            
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        ctx.globalAlpha = currentAlpha;
    }

    // Corrected smooth drawing methods
    // Add these improved drawing methods to your JerryEditor class

    drawSmoothBrush(ctx, pos, color) {
        // Determine effective alpha
        let alpha = this.currentTool === 'eraser' ? 1 : (this.brushOpacity / 100) * (this.brushFlow / 100);
    
        if (!this.lastPos || !this.isDrawing) {
            // Initial dot
            const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, this.brushSize / 2);
            gradient.addColorStop(0, this.hexToRgba(color, alpha));
            gradient.addColorStop(this.brushHardness / 100, this.hexToRgba(color, alpha * 0.7));
            gradient.addColorStop(1, this.hexToRgba(color, 0));
    
            ctx.fillStyle = gradient;
    
            if (this.currentTool === 'eraser') {
                ctx.globalCompositeOperation = 'destination-out';
            }
    
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.brushSize / 2, 0, 2 * Math.PI);
            ctx.fill();
    
            if (this.currentTool === 'eraser') ctx.globalCompositeOperation = this.layers[this.currentLayer].blendMode;
            return;
        }
    
        // Calculate distance for smooth interpolation
        const distance = Math.hypot(pos.x - this.lastPos.x, pos.y - this.lastPos.y);
    
        if (distance > 1) {
            const steps = Math.max(1, Math.ceil(distance / 2));
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const x = this.lastPos.x + (pos.x - this.lastPos.x) * t;
                const y = this.lastPos.y + (pos.y - this.lastPos.y) * t;
    
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.brushSize / 2);
                gradient.addColorStop(0, this.hexToRgba(color, alpha));
                gradient.addColorStop(this.brushHardness / 100, this.hexToRgba(color, alpha * 0.7));
                gradient.addColorStop(1, this.hexToRgba(color, 0));
    
                ctx.fillStyle = gradient;
    
                if (this.currentTool === 'eraser') {
                    ctx.globalCompositeOperation = 'destination-out';
                }
    
                ctx.beginPath();
                ctx.arc(x, y, this.brushSize / 2, 0, 2 * Math.PI);
                ctx.fill();
    
                if (this.currentTool === 'eraser') ctx.globalCompositeOperation = this.layers[this.currentLayer].blendMode;
            }
        }
    }

    
    drawSmoothPen(ctx, pos, color) {
        if (!this.lastPos || !this.isDrawing) {
            // Initial dot
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.brushSize / 2, 0, 2 * Math.PI);
            ctx.fill();
            return;
        }
        
        // Calculate pressure based on speed for natural variation
        const distance = Math.sqrt(Math.pow(pos.x - this.lastPos.x, 2) + Math.pow(pos.y - this.lastPos.y, 2));
        const speed = Math.min(distance, 50); // Cap speed for calculation
        const pressure = Math.max(0.3, Math.min(1.5, 20 / (speed + 10))); // More dynamic pressure
        
        // Use quadratic curves for smoother lines
        ctx.strokeStyle = color;
        ctx.lineWidth = this.brushSize * pressure;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        const midX = (this.lastPos.x + pos.x) / 2;
        const midY = (this.lastPos.y + pos.y) / 2;
        
        ctx.moveTo(this.lastPos.x, this.lastPos.y);
        ctx.quadraticCurveTo(this.lastPos.x, this.lastPos.y, midX, midY);
        ctx.stroke();
    }

    drawSmoothMarker(ctx, pos, color) {
        const currentAlpha = ctx.globalAlpha;
        ctx.globalAlpha = currentAlpha * 0.6; // Marker transparency
        
        if (this.lastPos && this.isDrawing) {
            ctx.strokeStyle = color;
            ctx.lineWidth = this.brushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            const jitter = this.brushSize * 0.1;
            const x1 = this.lastPos.x + (Math.random() - 0.5) * jitter;
            const y1 = this.lastPos.y + (Math.random() - 0.5) * jitter;
            const x2 = pos.x + (Math.random() - 0.5) * jitter;
            const y2 = pos.y + (Math.random() - 0.5) * jitter;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        } else {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.brushSize / 2, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        ctx.globalAlpha = currentAlpha;
    }
    
    drawTexturedPencil(ctx, pos, color) {
        const currentAlpha = ctx.globalAlpha;
        
        if (!this.lastPos || !this.isDrawing) {
            this.drawPencilTexture(ctx, pos, color, 1.0);
            return;
        }
        
        // Calculate distance and create smooth interpolation
        const distance = Math.sqrt(Math.pow(pos.x - this.lastPos.x, 2) + Math.pow(pos.y - this.lastPos.y, 2));
        const steps = Math.max(1, Math.ceil(distance / 1.5)); // Denser steps for texture
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = this.lastPos.x + (pos.x - this.lastPos.x) * t;
            const y = this.lastPos.y + (pos.y - this.lastPos.y) * t;
            
            // Vary pressure along the stroke
            const pressure = 0.6 + Math.random() * 0.4;
            this.drawPencilTexture(ctx, {x, y}, color, pressure);
        }
    }
    
    drawPencilTexture(ctx, pos, color, pressure) {
        const currentAlpha = ctx.globalAlpha;
        const intensity = pressure * (this.brushOpacity / 100);
        const radius = (this.brushSize / 2) * pressure;
        
        // Create multiple overlapping strokes for texture
        const strokes = Math.floor(radius * 3) + 5; // More strokes for better texture
        
        for (let i = 0; i < strokes; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius;
            const x = pos.x + Math.cos(angle) * distance;
            const y = pos.y + Math.sin(angle) * distance;
            
            const strokeAlpha = intensity * (0.15 + Math.random() * 0.3); // Varied opacity
            const strokeWidth = 0.3 + Math.random() * 1.2;
            
            ctx.globalAlpha = strokeAlpha;
            ctx.strokeStyle = color;
            ctx.lineWidth = strokeWidth;
            ctx.lineCap = 'round';
            
            // Create small textured strokes
            const strokeLength = 0.5 + Math.random() * 2;
            const strokeAngle = Math.random() * Math.PI * 2;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(
                x + Math.cos(strokeAngle) * strokeLength, 
                y + Math.sin(strokeAngle) * strokeLength
            );
            ctx.stroke();
        }
        
        ctx.globalAlpha = currentAlpha;
    }
    
    drawTexturedCharcoal(ctx, pos, color) {
        const currentAlpha = ctx.globalAlpha;
        
        if (!this.lastPos || !this.isDrawing) {
            this.drawCharcoalTexture(ctx, pos, color, 1.0);
            return;
        }
        
        // Smooth interpolation for charcoal
        const distance = Math.sqrt(Math.pow(pos.x - this.lastPos.x, 2) + Math.pow(pos.y - this.lastPos.y, 2));
        const steps = Math.max(1, Math.ceil(distance / 2));
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = this.lastPos.x + (pos.x - this.lastPos.x) * t;
            const y = this.lastPos.y + (pos.y - this.lastPos.y) * t;
            
            const pressure = 0.7 + Math.random() * 0.3;
            this.drawCharcoalTexture(ctx, {x, y}, color, pressure);
        }
    }
    
    drawCharcoalTexture(ctx, pos, color, pressure) {
        const currentAlpha = ctx.globalAlpha;
        const intensity = pressure * (this.brushOpacity / 100);
        const radius = this.brushSize * pressure;
        
        // Main charcoal particles
        const particles = Math.floor(radius * 4) + 10; // More particles for better texture
        ctx.fillStyle = color;
        
        for (let i = 0; i < particles; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius * 0.8; // Tighter distribution
            const x = pos.x + Math.cos(angle) * distance;
            const y = pos.y + Math.sin(angle) * distance;
            
            const particleSize = 0.3 + Math.random() * 3;
            const alpha = intensity * (0.1 + Math.random() * 0.4);
            
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            
            // Replace ellipse with arc for better compatibility
            if (Math.random() > 0.6) {
                const scaleX = 0.5 + Math.random() * 1.5;
                const scaleY = 0.5 + Math.random() * 1.5;
                
                // Use transform to create ellipse effect with arc
                ctx.save();
                ctx.translate(x, y);
                ctx.scale(scaleX, scaleY);
                ctx.arc(0, 0, particleSize, 0, 2 * Math.PI);
                ctx.restore();
            } else {
                ctx.arc(x, y, particleSize, 0, 2 * Math.PI);
            }
            ctx.fill();
        }
        
        // Add smudge effect around edges
        const smudges = Math.floor(radius * 0.8);
        for (let i = 0; i < smudges; i++) {
            const smudgeRadius = radius * (0.5 + Math.random() * 0.5);
            const angle = Math.random() * Math.PI * 2;
            const distance = radius * (0.7 + Math.random() * 0.3);
            const x = pos.x + Math.cos(angle) * distance;
            const y = pos.y + Math.sin(angle) * distance;
            
            ctx.globalAlpha = intensity * 0.05;
            ctx.beginPath();
            ctx.arc(x, y, smudgeRadius * 0.3, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        ctx.globalAlpha = currentAlpha;
    }
    
    // ----- SKETCH BLUR TOOL -----
    blur(ctx, pos) {
        if (!this.lastPos) return;
        
        const radius = Math.max(2, Math.floor(this.brushSize / 2));
        
        try {
            // Get image data around brush area
            const x = Math.max(0, pos.x - radius);
            const y = Math.max(0, pos.y - radius);
            const width = Math.min(radius * 2, ctx.canvas.width - x);
            const height = Math.min(radius * 2, ctx.canvas.height - y);
            
            const imageData = ctx.getImageData(x, y, width, height);
            const blurred = this.gaussianBlur(imageData, Math.floor(radius / 2));
            
            ctx.putImageData(blurred, x, y);
        } catch (e) {
            console.warn('Blur failed:', e);
        }
    }
    
    // ----- SKETCH SMUDGE TOOL -----
    smudge(ctx, pos) {
        if (!this.lastPos) return;
    
        const radius = Math.max(2, Math.floor(this.brushSize / 2));
        const alpha = this.brushOpacity / 100;
    
        try {
            // Get source area around last position
            const sx = Math.max(0, this.lastPos.x - radius);
            const sy = Math.max(0, this.lastPos.y - radius);
            const sw = Math.min(radius * 2, ctx.canvas.width - sx);
            const sh = Math.min(radius * 2, ctx.canvas.height - sy);
    
            const imageData = ctx.getImageData(sx, sy, sw, sh);
            const data = imageData.data;
    
            // Calculate movement vector
            const dx = pos.x - this.lastPos.x;
            const dy = pos.y - this.lastPos.y;
    
            // Blend pixels in the direction of movement
            const strength = 0.3; // fraction of movement applied per frame
            const offsetX = Math.round(dx * strength);
            const offsetY = Math.round(dy * strength);
    
            const temp = new Uint8ClampedArray(data); // copy original pixels
    
            for (let y = 0; y < sh; y++) {
                for (let x = 0; x < sw; x++) {
                    const srcIdx = (y * sw + x) * 4;
                    const destX = x + offsetX;
                    const destY = y + offsetY;
    
                    if (destX >= 0 && destX < sw && destY >= 0 && destY < sh) {
                        const destIdx = (destY * sw + destX) * 4;
    
                        // Blend original into destination
                        data[destIdx]     = temp[srcIdx] * alpha + data[destIdx] * (1 - alpha);
                        data[destIdx + 1] = temp[srcIdx + 1] * alpha + data[destIdx + 1] * (1 - alpha);
                        data[destIdx + 2] = temp[srcIdx + 2] * alpha + data[destIdx + 2] * (1 - alpha);
                        // Keep alpha channel unchanged
                    }
                }
            }
    
            ctx.putImageData(imageData, sx, sy);
        } catch (e) {
            console.warn('Smudge failed:', e);
        }
    }

    
    // Helper for blur
    gaussianBlur(imageData, radius) {
        const data = new Uint8ClampedArray(imageData.data);
        const width = imageData.width;
        const height = imageData.height;
        
        // Simple box blur approximation
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0, a = 0, count = 0;
                
                for (let dy = -radius; dy <= radius; dy++) {
                    for (let dx = -radius; dx <= radius; dx++) {
                        const nx = x + dx;
                        const ny = y + dy;
                        
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            const idx = (ny * width + nx) * 4;
                            r += imageData.data[idx];
                            g += imageData.data[idx + 1];
                            b += imageData.data[idx + 2];
                            a += imageData.data[idx + 3];
                            count++;
                        }
                    }
                }
                
                const idx = (y * width + x) * 4;
                data[idx] = r / count;
                data[idx + 1] = g / count;
                data[idx + 2] = b / count;
                data[idx + 3] = a / count;
            }
        }
        
        return new ImageData(data, width, height);
    }

    gaussianRandom() {
        // Box-Muller transform for gaussian distribution
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
    
    drawSketchLine(ctx, start, end, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = this.brushSize;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }
    
    drawSketchRect(ctx, start, end, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = this.brushSize;
        ctx.strokeRect(
            Math.min(start.x, end.x),
            Math.min(start.y, end.y),
            Math.abs(end.x - start.x),
            Math.abs(end.y - start.y)
        );
    }
    
    drawSketchCircle(ctx, start, end, color) {
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        ctx.strokeStyle = color;
        ctx.lineWidth = this.brushSize;
        ctx.beginPath();
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    
    mergeCurrentStroke() {
        // This would typically merge the current stroke to the layer
        // For now, strokes are drawn directly to layer canvas
    }
    
    // Utility methods
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    updateBrushPreview() {
        const preview = document.getElementById('brushPreview');
        if (!preview) return;
        
        preview.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.width = 60;
        canvas.height = 60;
        const ctx = canvas.getContext('2d');
        
        // Draw brush preview
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const previewSize = Math.min(this.brushSize, 25);
        
        if (this.brushHardness < 100) {
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, previewSize / 2);
            gradient.addColorStop(0, this.primaryColor);
            gradient.addColorStop(this.brushHardness / 100, this.primaryColor);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = this.primaryColor;
        }
        
        ctx.globalAlpha = this.brushOpacity / 100;
        ctx.beginPath();
        ctx.arc(centerX, centerY, previewSize / 2, 0, 2 * Math.PI);
        ctx.fill();
        
        preview.appendChild(canvas);
    }
    
    // Transform operations
    rotate(degrees) {
        if (this.mode === 'pixel') {
            this.rotatePixelCanvas(degrees);
        } else {
            this.rotateSketchCanvas(degrees);
        }
    }
    
    rotatePixelCanvas(degrees) {
        const newGrid = [];
        const radians = (degrees * Math.PI) / 180;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        
        // For 90-degree rotations, we can do exact pixel rotation
        if (degrees === 90 || degrees === -270) {
            for (let x = 0; x < this.canvasWidth; x++) {
                newGrid[x] = [];
                for (let y = 0; y < this.canvasHeight; y++) {
                    newGrid[x][y] = this.grid[this.canvasHeight - 1 - y][x];
                }
            }
        } else if (degrees === -90 || degrees === 270) {
            for (let x = 0; x < this.canvasWidth; x++) {
                newGrid[x] = [];
                for (let y = 0; y < this.canvasHeight; y++) {
                    newGrid[x][y] = this.grid[y][this.canvasWidth - 1 - x];
                }
            }
        } else if (degrees === 180 || degrees === -180) {
            for (let y = 0; y < this.canvasHeight; y++) {
                newGrid[y] = [];
                for (let x = 0; x < this.canvasWidth; x++) {
                    newGrid[y][x] = this.grid[this.canvasHeight - 1 - y][this.canvasWidth - 1 - x];
                }
            }
        }
        
        this.grid = newGrid;
        this.updatePixelCanvas();
    }
    
    rotateSketchCanvas(degrees) {
        const layer = this.layers[this.currentLayer];
        if (!layer) return;
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = layer.canvas.width;
        tempCanvas.height = layer.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.save();
        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        tempCtx.rotate((degrees * Math.PI) / 180);
        tempCtx.translate(-tempCanvas.width / 2, -tempCanvas.height / 2);
        tempCtx.drawImage(layer.canvas, 0, 0);
        tempCtx.restore();
        
        layer.ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
        layer.ctx.drawImage(tempCanvas, 0, 0);
        
        this.redrawLayers();
    }
    
    flip(direction) {
        if (this.mode === 'pixel') {
            this.flipPixelCanvas(direction);
        } else {
            this.flipSketchCanvas(direction);
        }
    }
    
    flipPixelCanvas(direction) {
        const newGrid = JSON.parse(JSON.stringify(this.grid));
        
        if (direction === 'horizontal') {
            for (let y = 0; y < this.canvasHeight; y++) {
                for (let x = 0; x < this.canvasWidth; x++) {
                    newGrid[y][x] = this.grid[y][this.canvasWidth - 1 - x];
                }
            }
        } else if (direction === 'vertical') {
            for (let y = 0; y < this.canvasHeight; y++) {
                for (let x = 0; x < this.canvasWidth; x++) {
                    newGrid[y][x] = this.grid[this.canvasHeight - 1 - y][x];
                }
            }
        }
        
        this.grid = newGrid;
        this.updatePixelCanvas();
    }
    
    flipSketchCanvas(direction) {
        const layer = this.layers[this.currentLayer];
        if (!layer) return;
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = layer.canvas.width;
        tempCanvas.height = layer.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.save();
        if (direction === 'horizontal') {
            tempCtx.scale(-1, 1);
            tempCtx.translate(-tempCanvas.width, 0);
        } else {
            tempCtx.scale(1, -1);
            tempCtx.translate(0, -tempCanvas.height);
        }
        tempCtx.drawImage(layer.canvas, 0, 0);
        tempCtx.restore();
        
        layer.ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
        layer.ctx.drawImage(tempCanvas, 0, 0);
        
        this.redrawLayers();
    }
    
    // ----------------------
    // Canvas operations
    // ----------------------
    resizeCanvas() {
        const newWidth = parseInt(this.canvasWidthInput.value);
        const newHeight = parseInt(this.canvasHeightInput.value);
    
        if (this.mode === 'pixel') {
            this.resizePixelCanvas(newWidth, newHeight);
        }
    }
    
    resizePixelCanvas(newWidth, newHeight) {
        // --- 1. Preserve existing pixels in a new grid ---
        const newGrid = [];
        for (let y = 0; y < newHeight; y++) {
            newGrid[y] = [];
            for (let x = 0; x < newWidth; x++) {
                newGrid[y][x] = (y < this.canvasHeight && x < this.canvasWidth)
                    ? this.grid[y][x]
                    : 'transparent';
            }
        }
        this.grid = newGrid;
        this.canvasWidth = newWidth;
        this.canvasHeight = newHeight;
    
        // --- 2. Calculate uniform pixel size for square pixels ---
        const maxDisplaySize = 512; // Maximum display size in px
        this.pixelSize = Math.floor(maxDisplaySize / Math.max(newWidth, newHeight));
    
        // --- 3. Update wrapper CSS variables for scaling/checkerboard ---
        const wrapper = this.canvasWrapper;
        wrapper.style.setProperty('--cellSize', `${this.pixelSize}px`);
        wrapper.style.setProperty('--halfCell', `${this.pixelSize / 2}px`);
        wrapper.style.setProperty('--cols', this.canvasWidth);
        wrapper.style.setProperty('--rows', this.canvasHeight);
    
        // --- 4. Update canvas and grid overlay ---
        this.updatePixelCanvas();
        this.updateGrid();
        this.updateCanvasInfo();
    
        // --- 5. Center canvas inside wrapper ---
        this.pixelCanvas.style.margin = '0 auto';
        this.canvasGrid.style.transform = 'none';
    }


    
    resizeSketchCanvas(width, height) {
        this.sketchCanvas.width = width;
        this.sketchCanvas.height = height;
        this.selectionOverlay.width = width;
        this.selectionOverlay.height = height;
        
        // Resize all layers
        this.layers.forEach(layer => {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width;
            tempCanvas.height = height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(layer.canvas, 0, 0);
            
            layer.canvas.width = width;
            layer.canvas.height = height;
            layer.ctx.drawImage(tempCanvas, 0, 0);
        });
        
        this.redrawLayers();
        this.updateCanvasInfo();
    }
    
    clearCanvas() {
        if (confirm('Clear the entire canvas? This cannot be undone.')) {
            this.saveState();
            
            if (this.mode === 'pixel') {
                this.initializeGrid();
                this.updatePixelCanvas();
            } else {
                const layer = this.layers[this.currentLayer];
                if (layer) {
                    layer.ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
                    this.redrawLayers();
                }
            }
        }
    }
    
    // Zoom operations
    adjustZoom(factor) {
        this.setZoom(this.zoom * factor);
    }
    
    setZoom(zoom) {
        this.zoom = Math.max(0.25, Math.min(8, zoom));
        
        const canvasWrapper = document.querySelector('.canvas-wrapper');
        canvasWrapper.style.transform = `scale(${this.zoom})`;
        
        this.zoomIndicator.textContent = `${Math.round(this.zoom * 100)}%`;
        this.updateGrid();
    }
    
    // Undo/Redo system
    saveState() {
        if (this.mode === 'pixel') {
            const state = {
                grid: JSON.parse(JSON.stringify(this.grid)),
                canvasWidth: this.canvasWidth,
                canvasHeight: this.canvasHeight
            };
            
            this.undoStack.push(state);
            if (this.undoStack.length > this.maxUndoSteps) {
                this.undoStack.shift();
            }
            this.redoStack = [];
        } else {
            // For sketch mode, save layer states
            const state = this.layers.map(layer => {
                const canvas = document.createElement('canvas');
                canvas.width = layer.canvas.width;
                canvas.height = layer.canvas.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(layer.canvas, 0, 0);
                return {
                    canvas: canvas,
                    visible: layer.visible,
                    opacity: layer.opacity,
                    blendMode: layer.blendMode,
                    name: layer.name
                };
            });
            
            this.undoStack.push(state);
            if (this.undoStack.length > this.maxUndoSteps) {
                this.undoStack.shift();
            }
            this.redoStack = [];
        }
    }
    
    undo() {
        if (this.undoStack.length === 0) return;
        
        if (this.mode === 'pixel') {
            const currentState = {
                grid: JSON.parse(JSON.stringify(this.grid)),
                canvasWidth: this.canvasWidth,
                canvasHeight: this.canvasHeight
            };
            this.redoStack.push(currentState);
            
            const prevState = this.undoStack.pop();
            this.grid = prevState.grid;
            this.canvasWidth = prevState.canvasWidth;
            this.canvasHeight = prevState.canvasHeight;
            
            this.canvasWidthInput.value = this.canvasWidth;
            this.canvasHeightInput.value = this.canvasHeight;
            this.updatePixelCanvas();
            this.updateGrid();
        } else {
            // Save current state to redo stack
            const currentState = this.layers.map(layer => {
                const canvas = document.createElement('canvas');
                canvas.width = layer.canvas.width;
                canvas.height = layer.canvas.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(layer.canvas, 0, 0);
                return {
                    canvas: canvas,
                    visible: layer.visible,
                    opacity: layer.opacity,
                    blendMode: layer.blendMode,
                    name: layer.name
                };
            });
            this.redoStack.push(currentState);
            
            // Restore previous state
            const prevState = this.undoStack.pop();
            this.layers = prevState.map(layerState => {
                const canvas = document.createElement('canvas');
                canvas.width = layerState.canvas.width;
                canvas.height = layerState.canvas.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(layerState.canvas, 0, 0);
                
                return {
                    canvas: canvas,
                    ctx: ctx,
                    visible: layerState.visible,
                    opacity: layerState.opacity,
                    blendMode: layerState.blendMode,
                    name: layerState.name
                };
            });
            
            this.updateLayerList();
            this.updateLayerControls();
            this.redrawLayers();
        }
        
        this.updateCanvasInfo();
    }
    
    redo() {
        if (this.redoStack.length === 0) return;
        
        if (this.mode === 'pixel') {
            const currentState = {
                grid: JSON.parse(JSON.stringify(this.grid)),
                canvasWidth: this.canvasWidth,
                canvasHeight: this.canvasHeight
            };
            this.undoStack.push(currentState);
            
            const nextState = this.redoStack.pop();
            this.grid = nextState.grid;
            this.canvasWidth = nextState.canvasWidth;
            this.canvasHeight = nextState.canvasHeight;
            
            this.canvasWidthInput.value = this.canvasWidth;
            this.canvasHeightInput.value = this.canvasHeight;
            this.updatePixelCanvas();
            this.updateGrid();
        } else {
            // Save current state to undo stack
            const currentState = this.layers.map(layer => {
                const canvas = document.createElement('canvas');
                canvas.width = layer.canvas.width;
                canvas.height = layer.canvas.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(layer.canvas, 0, 0);
                return {
                    canvas: canvas,
                    visible: layer.visible,
                    opacity: layer.opacity,
                    blendMode: layer.blendMode,
                    name: layer.name
                };
            });
            this.undoStack.push(currentState);
            
            // Restore next state
            const nextState = this.redoStack.pop();
            this.layers = nextState.map(layerState => {
                const canvas = document.createElement('canvas');
                canvas.width = layerState.canvas.width;
                canvas.height = layerState.canvas.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(layerState.canvas, 0, 0);
                
                return {
                    canvas: canvas,
                    ctx: ctx,
                    visible: layerState.visible,
                    opacity: layerState.opacity,
                    blendMode: layerState.blendMode,
                    name: layerState.name
                };
            });
            
            this.updateLayerList();
            this.updateLayerControls();
            this.redrawLayers();
        }
        
        this.updateCanvasInfo();
    }
    
    // Sprite management
    newSprite() {
        const spriteName = prompt('Enter sprite name:', `Sprite ${this.sprites.length + 1}`);
        if (!spriteName) return;
        
        this.sprites.push({ name: spriteName, data: null });
        this.updateSpriteSelector();
    }
    
    duplicateSprite() {
        const currentSprite = this.sprites[this.currentSprite];
        const newName = prompt('Enter new sprite name:', `${currentSprite.name} Copy`);
        if (!newName) return;
        
        this.sprites.push({
            name: newName,
            data: JSON.parse(JSON.stringify(this.grid))
        });
        this.updateSpriteSelector();
    }
    
    deleteSprite() {
        if (this.sprites.length <= 1) {
            alert('Cannot delete the last sprite.');
            return;
        }
        
        if (confirm(`Delete sprite "${this.sprites[this.currentSprite].name}"?`)) {
            this.sprites.splice(this.currentSprite, 1);
            if (this.currentSprite >= this.sprites.length) {
                this.currentSprite = this.sprites.length - 1;
            }
            this.switchSprite(this.currentSprite);
            this.updateSpriteSelector();
        }
    }
    
    switchSprite(index) {
        // Save current sprite data
        this.sprites[this.currentSprite].data = JSON.parse(JSON.stringify(this.grid));
        
        // Switch to new sprite
        this.currentSprite = index;
        const spriteData = this.sprites[index].data;
        
        if (spriteData) {
            this.grid = JSON.parse(JSON.stringify(spriteData));
            this.canvasWidth = this.grid[0].length;
            this.canvasHeight = this.grid.length;
            this.canvasWidthInput.value = this.canvasWidth;
            this.canvasHeightInput.value = this.canvasHeight;
        } else {
            this.initializeGrid();
        }
        
        this.updatePixelCanvas();
        this.updateGrid();
        this.updateCanvasInfo();
    }
    
    updateSpriteSelector() {
        if (!this.spriteSelector) return;
        
        this.spriteSelector.innerHTML = '';
        this.sprites.forEach((sprite, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = sprite.name;
            option.selected = index === this.currentSprite;
            this.spriteSelector.appendChild(option);
        });
    }
    
    // Color palette management
    loadPalettes() {
        const palettes = {
            'default': ['transparent','#FFFFFF','#C0C0C0','#808080','#404040','#000000','#FF0000','#00FF00','#0000FF','#FFFF00','#FF00FF'],
            'retro8bit': ['transparent','#F4F4F4','#E8E8E8','#BCBCBC','#7C7C7C','#A00000','#FF6A00','#FFD500','#00A844','#0047AB','#000000'],
            'gameboyClassic': ['transparent','#E0F8D0','#88C070','#346856','#081820','#9BBB0F','#8BAC0F','#306230','#0F380F','#155015','#071821'],
            'synthwave': ['transparent','#FF00FF','#FF0080','#FF4080','#FF8000','#FFFF00','#80FF00','#00FFFF','#0080FF','#8000FF','#2D1B69'],
            'earthTones': ['transparent','#FFF8DC','#D2B48C','#CD853F','#A0522D','#8B4513','#654321','#556B2F','#8FBC8F','#2F4F4F','#191970'],
            'crystalIce': ['transparent','#F0F8FF','#E6F3FF','#B3D9FF','#80BFFF','#4DA6FF','#1A8CFF','#0066CC','#004C99','#003366','#001A33'],
            'moltenCore': ['transparent','#FFFACD','#FFE4B5','#FFA500','#FF6347','#FF4500','#DC143C','#B22222','#8B0000','#4B0000','#000000'],
            'enchantedForest': ['transparent','#F0FFF0','#E6FFE6','#CCFFCC','#99FF99','#66CC66','#339933','#228B22','#006400','#004400','#002200'],
            'nesClassic': ['transparent','#FFFFFF','#FCFCFC','#F8F8F8','#BCBCBC','#7C7C7C','#A4E4FC','#3CBCFC','#0078F8','#0000FC','#000000'],
            'cyberpunk': ['transparent','#00FFFF','#00E6E6','#00CCCC','#00B3B3','#FF00FF','#E600E6','#CC00CC','#B300B3','#4D0080','#0D001A'],
            'desertSands': ['transparent','#FFF8DC','#F5DEB3','#DEB887','#D2B48C','#BC9A6A','#A0522D','#8B4513','#654321','#3E2723','#2E1A14'],
            'deepOcean': ['transparent','#E0F6FF','#B3E5FC','#4FC3F7','#29B6F6','#03A9F4','#0288D1','#0277BD','#01579B','#01447A','#002F5A'],
            'cosmicVoid': ['transparent','#E1BEE7','#CE93D8','#BA68C8','#AB47BC','#8E24AA','#7B1FA2','#6A1B9A','#4A148C','#38006B','#1A0033'],
            'inkWash': ['transparent','#FFFFFF','#F5F5F5','#E0E0E0','#BDBDBD','#9E9E9E','#757575','#424242','#212121','#FF5722','#000000'],
            'autumnLeaves': ['transparent','#FFF8E7','#FFE0B3','#FFCC80','#FF8F65','#FF7043','#F4511E','#E65100','#BF360C','#8D2F00','#5D1F00'],
            'sakuraBloom': ['transparent','#FFF0F5','#FFE4E1','#FFC0CB','#FFB6C1','#FF91A4','#FF69B4','#E91E63','#C2185B','#AD1457','#880E4F']
        };
        
        if (this.paletteSelector) {
            Object.keys(palettes).forEach(paletteName => {
                const option = document.createElement('option');
                option.value = paletteName;
                option.textContent = paletteName.charAt(0).toUpperCase() + paletteName.slice(1);
                this.paletteSelector.appendChild(option);
            });
        }
        
        this.palettes = palettes;
        this.loadSavedPalettes();
        this.loadPalette('default');
        this.setupColorPickers();
    }
    loadPalette(paletteName) {
        const colors = this.palettes[paletteName] || this.palettes.default;

        const swatchesContainer = document.getElementById('swatches');
        if (swatchesContainer) {
            swatchesContainer.innerHTML = '';
            colors.forEach(color => {
                const swatch = document.createElement('div');
                swatch.className = 'color-swatch';
                swatch.style.backgroundColor = color;
                swatch.title = color;
                swatch.addEventListener('click', (e) => {
                    this.primaryColor = color;
                    this.primaryColorEl.style.background = color;
                    if (this.sketchColorPicker) this.sketchColorPicker.value = color;
                });
                swatch.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.secondaryColor = color;
                    this.secondaryColorEl.style.background = color;
                });
                swatchesContainer.appendChild(swatch);
            });
        }
    }
    
    setupColorPickers() {
        if (!this.colorPickers) return;
        
        for (let i = 0; i < 8; i++) {
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.className = 'color-picker';
            colorInput.value = '#000000';
            colorInput.addEventListener('change', (e) => {
                this.updateCustomPalette();
            });
            this.colorPickers.appendChild(colorInput);
        }
    }
    
    updateCustomPalette() {
        const customColors = Array.from(this.colorPickers.querySelectorAll('.color-picker'))
            .map(input => input.value);
        this.palettes.custom = customColors;
    }
    
    saveCustomPalette() {
        this.updateCustomPalette();
        const paletteName = prompt('Enter palette name:', 'Custom Palette');
        if (paletteName) {
            this.palettes[paletteName.toLowerCase()] = [...this.palettes.custom];
            
            // Add to selector if not already there
            if (!Array.from(this.paletteSelector.options).some(opt => opt.value === paletteName.toLowerCase())) {
                const option = document.createElement('option');
                option.value = paletteName.toLowerCase();
                option.textContent = paletteName;
                this.paletteSelector.appendChild(option);
            }
            
            this.savePalettes();
        }
    }
    
    savePalettes() {
        localStorage.setItem('jerryEditor_palettes', JSON.stringify(this.palettes));
    }
    
    loadSavedPalettes() {
        const saved = localStorage.getItem('jerryEditor_palettes');
        if (saved) {
            const savedPalettes = JSON.parse(saved);
            Object.assign(this.palettes, savedPalettes);
        }
    }
    
    openColorPicker(type) {
        const input = document.createElement('input');
        input.type = 'color';
        input.value = type === 'primary' ? this.primaryColor : this.secondaryColor;
        input.addEventListener('change', (e) => {
            if (type === 'primary') {
                this.primaryColor = e.target.value;
                this.primaryColorEl.style.background = e.target.value;
                if (this.sketchColorPicker) this.sketchColorPicker.value = e.target.value;
            } else {
                this.secondaryColor = e.target.value;
                this.secondaryColorEl.style.background = e.target.value;
            }
        });
        input.click();
    }
    
    // Project management
    newProject() {
        if (confirm('Create a new project? Unsaved changes will be lost.')) {
            this.initializeGrid();
            this.sprites = [{ name: 'Sprite 1', data: null }];
            this.currentSprite = 0;
            
            if (this.mode === 'sketch') {
                this.layers = [];
                this.addLayer();
                // Fill background with white
                this.layers[0].ctx.fillStyle = '#ffffff';
                this.layers[0].ctx.fillRect(0, 0, this.sketchCanvas.width, this.sketchCanvas.height);
            }
            
            this.undoStack = [];
            this.redoStack = [];
            
            this.updatePixelCanvas();
            this.updateGrid();
            this.updateSpriteSelector();
            this.updateLayerList();
            this.redrawLayers();
            this.updateCanvasInfo();
        }
    }
    
    saveProject() {
        const project = this.getProjectData();
        localStorage.setItem('jerryEditor_project', JSON.stringify(project));
        
        // Visual feedback
        const btn = document.getElementById('saveProject');
        const originalText = btn.textContent;
        btn.textContent = 'Saved!';
        btn.classList.add('success');
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('success');
        }, 1000);
    }
    
    loadProject() {
        const saved = localStorage.getItem('jerryEditor_project');
        if (saved) {
            try {
                const project = JSON.parse(saved);
                this.loadProjectData(project);
            } catch (e) {
                console.error('Failed to load project:', e);
            }
        }
    }
    
    autoSave() {
        const project = this.getProjectData();
        localStorage.setItem('jerryEditor_autosave', JSON.stringify(project));
    }
    
    getProjectData() {
        const project = {
            mode: this.mode,
            canvasWidth: this.canvasWidth,
            canvasHeight: this.canvasHeight,
            sprites: this.sprites,
            currentSprite: this.currentSprite,
            grid: this.grid,
            primaryColor: this.primaryColor,
            secondaryColor: this.secondaryColor,
            symmetryMode: this.symmetryMode,
            showGrid: this.showGrid,
            version: '1.0'
        };
        
        if (this.mode === 'sketch') {
            project.sketchCanvas = {
                width: this.sketchCanvas.width,
                height: this.sketchCanvas.height
            };
            project.layers = this.layers.map(layer => ({
                data: layer.canvas.toDataURL(),
                visible: layer.visible,
                opacity: layer.opacity,
                blendMode: layer.blendMode,
                name: layer.name
            }));
            project.currentLayer = this.currentLayer;
        }
        
        return project;
    }
    
    loadProjectData(project) {
        this.mode = project.mode || 'pixel';
        this.canvasWidth = project.canvasWidth || 16;
        this.canvasHeight = project.canvasHeight || 16;
        this.sprites = project.sprites || [{ name: 'Sprite 1', data: null }];
        this.currentSprite = project.currentSprite || 0;
        this.grid = project.grid || [];
        this.primaryColor = project.primaryColor || '#000000';
        this.secondaryColor = project.secondaryColor || '#ffffff';
        this.symmetryMode = project.symmetryMode || 'none';
        this.showGrid = project.showGrid !== undefined ? project.showGrid : true;
        
        // Update UI elements
        this.canvasWidthInput.value = this.canvasWidth;
        this.canvasHeightInput.value = this.canvasHeight;
        this.primaryColorEl.style.background = this.primaryColor;
        this.secondaryColorEl.style.background = this.secondaryColor;
        document.getElementById('gridToggle').addEventListener('change', (e) => {
            this.showGrid = e.target.checked;
            this.updateGrid();
        });
        
        // Set symmetry mode
        document.querySelectorAll('.symmetry-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.symmetry === this.symmetryMode);
        });
        
        if (project.mode === 'sketch' && project.layers) {
            this.sketchCanvas.width = project.sketchCanvas.width;
            this.sketchCanvas.height = project.sketchCanvas.height;
            this.selectionOverlay.width = project.sketchCanvas.width;
            this.selectionOverlay.height = project.sketchCanvas.height;
            
            this.layers = [];
            this.currentLayer = project.currentLayer || 0;
            
            const loadPromises = project.layers.map((layerData, index) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = this.sketchCanvas.width;
                        canvas.height = this.sketchCanvas.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        
                        this.layers[index] = {
                            canvas: canvas,
                            ctx: ctx,
                            visible: layerData.visible,
                            opacity: layerData.opacity,
                            blendMode: layerData.blendMode,
                            name: layerData.name
                        };
                        resolve();
                    };
                    img.src = layerData.data;
                });
            });
            
            Promise.all(loadPromises).then(() => {
                this.updateLayerList();
                this.updateLayerControls();
                this.redrawLayers();
            });
        }
        
        // Switch to correct mode
        this.switchMode(this.mode);
        
        if (this.grid.length === 0) {
            this.initializeGrid();
        }
        
        this.updatePixelCanvas();
        this.updateGrid();
        this.updateSpriteSelector();
        this.updateCanvasInfo();
    }
    
    // Export/Import
    exportJSON() {
        const project = this.getProjectData();
        const dataStr = JSON.stringify(project, null, 2);
        const output = document.getElementById('output');
        
        if (output) {
            output.style.display = 'block';
            output.value = dataStr;
            output.select();
        }
        
        // Also trigger download
        this.downloadFile('jerry-project.json', dataStr);
    }
    
    exportPNG() {
        let canvas, filename;
        
        if (this.mode === 'pixel') {
            // Create a clean export canvas without grid
            canvas = document.createElement('canvas');
            canvas.width = this.canvasWidth;
            canvas.height = this.canvasHeight;
            const ctx = canvas.getContext('2d');
            
            // Disable image smoothing for pixel art
            ctx.imageSmoothingEnabled = false;
            
            const imageData = ctx.createImageData(this.canvasWidth, this.canvasHeight);
            
            for (let y = 0; y < this.canvasHeight; y++) {
                for (let x = 0; x < this.canvasWidth; x++) {
                    const color = this.grid[y][x];
                    const index = (y * this.canvasWidth + x) * 4;
                    
                    if (color === 'transparent') {
                        imageData.data[index + 3] = 0; // Alpha = 0
                    } else {
                        const rgb = this.hexToRgb(color);
                        imageData.data[index] = rgb.r;
                        imageData.data[index + 1] = rgb.g;
                        imageData.data[index + 2] = rgb.b;
                        imageData.data[index + 3] = 255;
                    }
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            filename = 'pixel-art.png';
        } else {
            canvas = this.sketchCanvas;
            filename = 'sketch-art.png';
        }
        
        // Download the image
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
    
    importFile(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const project = JSON.parse(event.target.result);
                if (confirm('Import this project? Current work will be lost.')) {
                    this.loadProjectData(project);
                }
            } catch (error) {
                alert('Invalid project file.');
            }
        };
        reader.readAsText(file);
    }
    
    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }
    
    // Keyboard shortcuts
    handleKeyboard(e) {
        // Prevent shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        const key = e.key.toLowerCase();
        const ctrl = e.ctrlKey || e.metaKey;
        const shift = e.shiftKey;
        
        // Global shortcuts
        if (ctrl && key === 'n') {
            e.preventDefault();
            this.newProject();
            return;
        }
        
        if (ctrl && key === 's') {
            e.preventDefault();
            this.saveProject();
            return;
        }
        
        if (ctrl && key === 'e') {
            e.preventDefault();
            this.exportPNG();
            return;
        }
        
        if (ctrl && key === 'z' && !shift) {
            e.preventDefault();
            this.undo();
            return;
        }
        
        if ((ctrl && key === 'y') || (ctrl && shift && key === 'z')) {
            e.preventDefault();
            this.redo();
            return;
        }
        
        if (ctrl && key === 'h') {
            e.preventDefault();
            this.flip('horizontal');
            return;
        }
        
        if (ctrl && key === 'j') {
            e.preventDefault();
            this.flip('vertical');
            return;
        }
        
        // Tool shortcuts
        const toolMap = {
            'b': this.mode === 'pixel' ? 'pencil' : 'brush',
            'e': 'eraser',
            'i': 'eyedropper',
            'g': this.mode === 'pixel' ? 'fill' : null,
            'm': this.mode === 'pixel' ? 'select' : 'marker',
            'v': 'move',
            'l': this.mode === 'pixel' ? 'line' : 'lineSketch',
            'r': this.mode === 'pixel' ? 'rect' : 'rectSketch',
            'o': this.mode === 'pixel' ? 'circle' : 'circleSketch',
            'p': this.mode === 'sketch' ? 'pen' : null,
            'c': this.mode === 'sketch' ? 'pencilSketch' : null,
            'h': this.mode === 'sketch' ? 'charcoal' : null,
            's': this.mode === 'sketch' ? 'smudge' : null,
            'u': this.mode === 'sketch' ? 'blur' : null,
            'y': this.mode === 'sketch' ? 'sprayPaint' : null
        };
        
        if (toolMap[key] && toolMap[key] !== null) {
            e.preventDefault();
            this.currentTool = shift && this.mode === 'pixel' ? 
                this.getSymmetricTool(toolMap[key]) : 
                (shift && ['rect', 'circle', 'rectSketch', 'circleSketch'].includes(toolMap[key]) ? 
                    toolMap[key] + 'Filled' : toolMap[key]);
            
            const toolGroup = document.querySelector(`.${this.mode}-tools`);
            toolGroup.querySelector('.tool-btn.active')?.classList.remove('active');
            toolGroup.querySelector(`.tool-btn[data-tool="${this.currentTool}"]`)?.classList.add('active');
            
            this.updateCanvasInfo();
        }
        
        // Symmetry shortcuts
        const symmetryMap = {
            'q': 'none',
            'w': 'horizontal',
            'a': 'vertical',
            's': 'both'
        };
        
        if (symmetryMap[key] && this.mode === 'pixel') {
            e.preventDefault();
            this.symmetryMode = symmetryMap[key];
            document.querySelectorAll('.symmetry-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.symmetry === this.symmetryMode);
            });
        }
        
        // Transform shortcuts
        if (key === '[') {
            e.preventDefault();
            this.rotate(-90);
        }
        
        if (key === ']') {
            e.preventDefault();
            this.rotate(90);
        }
        
        // Zoom shortcuts
        if (key === '=' || key === '+') {
            e.preventDefault();
            this.adjustZoom(1.5);
        }
        
        if (key === '-') {
            e.preventDefault();
            this.adjustZoom(0.75);
        }
        
        if (key === '0') {
            e.preventDefault();
            this.setZoom(1);
        }
    }
    
    getSymmetricTool(tool) {
        const symmetricMap = {
            'pencil': 'symmetricPencil',
            'eraser': 'symmetricEraser',
            'fill': 'symmetricFill'
        };
        return symmetricMap[tool] || tool;
    }
    
    // UI updates
    updateCanvasInfo() {
        if (!this.canvasInfo) return;
        
        const size = this.mode === 'pixel' ? 
            `${this.canvasWidth}×${this.canvasHeight}` : 
            `${this.sketchCanvas.width}×${this.sketchCanvas.height}`;
        
        const tool = this.currentTool.charAt(0).toUpperCase() + this.currentTool.slice(1);
        
        this.canvasInfo.textContent = `${size} | ${tool} | ${this.primaryColor}`;
    }
    
    updateUI() {
        this.updateCanvasInfo();
        this.updateSpriteSelector();
        
        if (this.mode === 'sketch') {
            this.updateLayerList();
            this.updateLayerControls();
            this.updateBrushPreview();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.jerryEditor = new JerryEditor();
});
    
// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            // Remove the service worker registration since you don't have the file
            console.log('Service worker registration skipped - file not provided');
        } catch (error) {
            console.log('SW registration failed: ', error);
        }
    });
}
