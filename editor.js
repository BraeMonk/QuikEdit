// Jerry Editor - Complete JavaScript Implementation with Sketch Mode
class JerryEditor {
    constructor() {
        // Core state
        this.currentMode = 'pixel'; // 'pixel' or 'sketch'
        this.isInitialized = false;
        
        // Pixel mode state (keeping existing structure)
        this.pixelState = {
            currentTool: 'pencil',
            colors: null,
            customTheme: Array(10).fill('#ffffff'),
            primaryColor: 5,
            secondaryColor: 1,
            array: [],
            canvasWidth: 16,
            canvasHeight: 16,
            undoStack: [],
            redoStack: [],
            allSprites: [],
            currentSpriteIndex: 0,
            zoomLevel: 1,
            isPainting: false,
            isRightClick: false,
            gridVisible: true,
            symmetryMode: 'none',
            symmetryAxis: { x: 8, y: 8 },
            selectionBounds: null,
            selectionArray: null,
            selectionStart: null,
            selectionEnd: null,
            shapeStart: null,
            previewArray: null,
            moveStart: null,
            touchMoveStart: null,
            moveOffset: { dx: 0, dy: 0 },
            marchingAntsPhase: 0
        };
        
        // Sketch mode state
        this.sketchState = {
            currentTool: 'brush',
            canvas: null,
            ctx: null,
            layers: [],
            currentLayer: 0,
            brushSize: 10,
            brushOpacity: 100,
            brushHardness: 100,
            brushFlow: 100,
            layerOpacity: 100,
            blendMode: 'source-over',
            isDrawing: false,
            lastX: 0,
            lastY: 0,
            undoStack: [],
            redoStack: [],
            pressure: 1,
            zoomLevel: 1,
            panX: 0,
            panY: 0
        };
        this.saveTimeout = null;
        this.init();
    }

    init() {
        this.setupPalettes();
        this.setupDOM();
        this.setupEventListeners();
        this.loadFromLocalStorage();
        this.switchToPixelMode();
        this.isInitialized = true;
        console.log('Jerry Editor initialized with dual modes!');
    }

    setupPalettes() {
        const isLightMode = false;
        this.palettes = {
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
    }

    setupDOM() {
        // Get DOM elements
        this.elements = {
            canvas: document.getElementById('canvas'),
            canvasGrid: document.getElementById('canvasGrid'),
            sketchCanvas: document.getElementById('sketchCanvas'),
            paletteSelector: document.getElementById('paletteSelector'),
            spriteSelector: document.getElementById('spriteSelector'),
            canvasInfo: document.getElementById('canvasInfo'),
            zoomIndicator: document.getElementById('zoomIndicator'),
            gridToggle: document.getElementById('gridToggle'),
            brushSize: document.getElementById('brushSize'),
            brushSizeLabel: document.getElementById('brushSizeLabel'),
            brushOpacity: document.getElementById('brushOpacity'),
            opacityLabel: document.getElementById('opacityLabel'),
            brushHardness: document.getElementById('brushHardness'),
            hardnessLabel: document.getElementById('hardnessLabel'),
            brushFlow: document.getElementById('brushFlow'),
            flowLabel: document.getElementById('flowLabel'),
            brushPreview: document.getElementById('brushPreview'),
            layerOpacity: document.getElementById('layerOpacity'),
            layerOpacityLabel: document.getElementById('layerOpacityLabel'),
            blendMode: document.getElementById('blendMode')
        };
        
        // Setup sketch canvas
        this.sketchState.canvas = this.elements.sketchCanvas;
        this.sketchState.ctx = this.sketchState.canvas.getContext('2d');
        
        // Initialize with one layer
        this.addSketchLayer();
    }

    setupEventListeners() {
        // Mode toggle
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
        });

        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setTool(btn.dataset.tool));
        });

        // Sketch canvas events
        this.setupSketchCanvasEvents();
        
        // Brush controls
        this.setupBrushControls();
        
        // Pixel mode events (existing functionality)
        this.setupPixelModeEvents();
        
        // Global events
        this.setupGlobalEvents();
    }

    setupSketchCanvasEvents() {
        const canvas = this.sketchState.canvas;
        
        // Mouse events
        canvas.addEventListener('mousedown', (e) => this.handleSketchMouseDown(e));
        canvas.addEventListener('mousemove', (e) => this.handleSketchMouseMove(e));
        canvas.addEventListener('mouseup', (e) => this.handleSketchMouseUp(e));
        canvas.addEventListener('mouseleave', (e) => this.handleSketchMouseUp(e));
        
        // Touch events
        canvas.addEventListener('touchstart', (e) => this.handleSketchTouchStart(e));
        canvas.addEventListener('touchmove', (e) => this.handleSketchTouchMove(e));
        canvas.addEventListener('touchend', (e) => this.handleSketchTouchEnd(e));
        
        // Prevent context menu
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Zoom with wheel
        canvas.addEventListener('wheel', (e) => {
            if (this.currentMode === 'sketch') {
                e.preventDefault();
                // Implement sketch zoom if needed
            }
        });
    }

    setupBrushControls() {

        // Sketch color picker
        const sketchColor = document.getElementById('sketchColor');
        if (sketchColor) {
            sketchColor.addEventListener('change', () => {
                // Color changed, no additional action needed
                // getCurrentColor() will read the new value
            });
}
        // Brush size
        if (this.elements.brushSize) {
            this.elements.brushSize.addEventListener('input', (e) => {
                this.sketchState.brushSize = parseInt(e.target.value);
                this.elements.brushSizeLabel.textContent = this.sketchState.brushSize;
                this.updateBrushPreview();
            });
        }
        
        // Brush opacity
        if (this.elements.brushOpacity) {
            this.elements.brushOpacity.addEventListener('input', (e) => {
                this.sketchState.brushOpacity = parseInt(e.target.value);
                this.elements.opacityLabel.textContent = this.sketchState.brushOpacity;
                this.updateBrushPreview();
            });
        }
        
        // Brush hardness
        if (this.elements.brushHardness) {
            this.elements.brushHardness.addEventListener('input', (e) => {
                this.sketchState.brushHardness = parseInt(e.target.value);
                this.elements.hardnessLabel.textContent = this.sketchState.brushHardness;
                this.updateBrushPreview();
            });
        }
        
        // Brush flow
        if (this.elements.brushFlow) {
            this.elements.brushFlow.addEventListener('input', (e) => {
                this.sketchState.brushFlow = parseInt(e.target.value);
                this.elements.flowLabel.textContent = this.sketchState.brushFlow;
                this.updateBrushPreview();
            });
        }
        
        // Layer opacity
        if (this.elements.layerOpacity) {
            this.elements.layerOpacity.addEventListener('input', (e) => {
                this.sketchState.layerOpacity = parseInt(e.target.value);
                this.elements.layerOpacityLabel.textContent = this.sketchState.layerOpacity;
                this.updateLayerOpacity();
            });
        }
        
        // Blend mode
        if (this.elements.blendMode) {
            this.elements.blendMode.addEventListener('change', (e) => {
                this.sketchState.blendMode = e.target.value;
            });
        }
        
        // Canvas size buttons
        document.querySelectorAll('[data-size]').forEach(btn => {
            btn.addEventListener('click', () => {
                const [width, height] = btn.dataset.size.split('x').map(Number);
                this.resizeSketchCanvas(width, height);
            });
        });
        
        // Add layer button
        const addLayerBtn = document.getElementById('addLayer');
        if (addLayerBtn) {
            addLayerBtn.addEventListener('click', () => this.addSketchLayer());
        }
    }

    updateBrushPreview() {
        if (!this.elements.brushPreview) return;
        
        const preview = this.elements.brushPreview;
        const size = Math.min(50, this.sketchState.brushSize);
        const opacity = this.sketchState.brushOpacity / 100;
        const hardness = this.sketchState.brushHardness / 100;
        
        preview.style.width = size + 'px';
        preview.style.height = size + 'px';
        preview.style.borderRadius = '50%';
        
        if (hardness < 1) {
            const gradient = `radial-gradient(circle, 
                rgba(0,0,0,${opacity}) 0%, 
                rgba(0,0,0,${opacity * hardness}) ${hardness * 50}%, 
                rgba(0,0,0,0) 100%)`;
            preview.style.background = gradient;
        } else {
            preview.style.background = `rgba(0,0,0,${opacity})`;
        }
    }

    updateLayerOpacity() {
        if (this.sketchState.layers[this.sketchState.currentLayer]) {
            this.sketchState.layers[this.sketchState.currentLayer].canvas.style.opacity = 
                this.sketchState.layerOpacity / 100;
        }
    }

    addSketchLayer() {
        const layerCanvas = document.createElement('canvas');
        layerCanvas.width = this.sketchState.canvas.width;
        layerCanvas.height = this.sketchState.canvas.height;
        layerCanvas.style.position = 'absolute';
        layerCanvas.style.top = '0';
        layerCanvas.style.left = '0';
        layerCanvas.style.pointerEvents = 'none';
        
        const layer = {
            canvas: layerCanvas,
            ctx: layerCanvas.getContext('2d'),
            visible: true,
            opacity: 100,
            blendMode: 'source-over',
            name: `Layer ${this.sketchState.layers.length + 1}`
        };
        
        this.sketchState.layers.push(layer);
        this.sketchState.currentLayer = this.sketchState.layers.length - 1;
        
        // Insert layer canvas into DOM
        const canvasWrapper = this.sketchState.canvas.parentElement;
        canvasWrapper.appendChild(layerCanvas);
        
        this.updateLayerList();
        return layer;
    }

    updateLayerList() {
        const layerList = document.getElementById('layerList');
        if (!layerList) return;
        
        layerList.innerHTML = '';
        
        this.sketchState.layers.forEach((layer, index) => {
            const layerItem = document.createElement('div');
            layerItem.className = 'layer-item';
            if (index === this.sketchState.currentLayer) {
                layerItem.classList.add('active');
            }
            
            layerItem.innerHTML = `
                <input type="checkbox" ${layer.visible ? 'checked' : ''}>
                <span>${layer.name}</span>
            `;
            
            // Click to select layer
            layerItem.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    this.sketchState.currentLayer = index;
                    this.updateLayerList();
                }
            });
            
            // Toggle visibility
            const checkbox = layerItem.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                layer.visible = checkbox.checked;
                layer.canvas.style.display = layer.visible ? 'block' : 'none';
            });
            
            layerList.appendChild(layerItem);
        });
    }

    resizeSketchCanvas(width, height) {
        this.sketchState.canvas.width = width;
        this.sketchState.canvas.height = height;
        
        // Resize all layer canvases
        this.sketchState.layers.forEach(layer => {
            const imageData = layer.ctx.getImageData(0, 0, layer.canvas.width, layer.canvas.height);
            layer.canvas.width = width;
            layer.canvas.height = height;
            layer.ctx.putImageData(imageData, 0, 0);
        });
    }

    // Sketch Mode Drawing Handlers
    handleSketchMouseDown(e) {
        if (this.currentMode !== 'sketch') return;
        
        this.sketchState.isDrawing = true;
        const rect = this.sketchState.canvas.getBoundingClientRect();
        this.sketchState.lastX = e.clientX - rect.left;
        this.sketchState.lastY = e.clientY - rect.top;
        
        this.saveSketchState();
        this.startSketchStroke(this.sketchState.lastX, this.sketchState.lastY);
    }

    handleSketchMouseMove(e) {
        if (this.currentMode !== 'sketch' || !this.sketchState.isDrawing) return;
        
        const rect = this.sketchState.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.continueSketchStroke(x, y);
        
        this.sketchState.lastX = x;
        this.sketchState.lastY = y;
    }

    handleSketchMouseUp(e) {
        if (this.currentMode !== 'sketch') return;
        
        this.sketchState.isDrawing = false;
        this.endSketchStroke();
    }

    handleSketchTouchStart(e) {
        if (this.currentMode !== 'sketch') return;
        
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.sketchState.canvas.getBoundingClientRect();
        
        this.sketchState.isDrawing = true;
        this.sketchState.lastX = touch.clientX - rect.left;
        this.sketchState.lastY = touch.clientY - rect.top;
        
        this.saveSketchState();
        this.startSketchStroke(this.sketchState.lastX, this.sketchState.lastY);
    }

    handleSketchTouchMove(e) {
        if (this.currentMode !== 'sketch' || !this.sketchState.isDrawing) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.sketchState.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        this.continueSketchStroke(x, y);
        
        this.sketchState.lastX = x;
        this.sketchState.lastY = y;
    }

    handleSketchTouchEnd(e) {
        if (this.currentMode !== 'sketch') return;
        
        e.preventDefault();
        this.sketchState.isDrawing = false;
        this.endSketchStroke();
    }

    // Sketch Drawing Methods
    startSketchStroke(x, y) {
        const layer = this.sketchState.layers[this.sketchState.currentLayer];
        if (!layer) return;
        
        const ctx = layer.ctx;
        this.setupBrushContext(ctx);
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        
        // Draw initial dot
        this.drawBrushStroke(ctx, x, y, x, y);
    }

    continueSketchStroke(x, y) {
        const layer = this.sketchState.layers[this.sketchState.currentLayer];
        if (!layer) return;
        
        const ctx = layer.ctx;
        this.drawBrushStroke(ctx, this.sketchState.lastX, this.sketchState.lastY, x, y);
    }

    endSketchStroke() {
        // Finalize stroke if needed
    }

    drawBrushStroke(ctx, x1, y1, x2, y2) {
        const tool = this.sketchState.currentTool;
        
        switch (tool) {
            case 'brush':
                this.drawBrush(ctx, x1, y1, x2, y2);
                break;
            case 'pen':
                this.drawPen(ctx, x1, y1, x2, y2);
                break;
            case 'marker':
                this.drawMarker(ctx, x1, y1, x2, y2);
                break;
            case 'pencilSketch':
                this.drawPencil(ctx, x1, y1, x2, y2);
                break;
            case 'charcoal':
                this.drawCharcoal(ctx, x1, y1, x2, y2);
                break;
            case 'eraser':
                this.drawEraser(ctx, x1, y1, x2, y2);
                break;
            case 'smudge':
                this.drawSmudge(ctx, x1, y1, x2, y2);
                break;
            case 'blur':
                this.drawBlur(ctx, x1, y1, x2, y2);
                break;
            case 'sprayPaint':
                this.drawSprayPaint(ctx, x1, y1, x2, y2);
                break;
            default:
                this.drawBrush(ctx, x1, y1, x2, y2);
        }
    }

    setupBrushContext(ctx) {
        const color = this.getCurrentColor();
        const opacity = this.sketchState.brushOpacity / 100;
        const size = this.sketchState.brushSize;
        
        ctx.globalCompositeOperation = this.sketchState.blendMode;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = opacity;
    }

    drawBrush(ctx, x1, y1, x2, y2) {
        const hardness = this.sketchState.brushHardness / 100;
        const size = this.sketchState.brushSize;
        
        if (hardness < 1) {
            // Soft brush with gradient
            const gradient = ctx.createRadialGradient(x2, y2, 0, x2, y2, size / 2);
            gradient.addColorStop(0, this.getCurrentColor());
            gradient.addColorStop(hardness, this.getCurrentColor());
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x2, y2, size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Hard brush
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    drawPen(ctx, x1, y1, x2, y2) {
        ctx.lineWidth = Math.max(1, this.sketchState.brushSize * 0.3);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    drawMarker(ctx, x1, y1, x2, y2) {
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = this.sketchState.brushSize * 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    drawPencil(ctx, x1, y1, x2, y2) {
        // Simulate pencil texture with multiple thin lines
        const size = this.sketchState.brushSize;
        ctx.globalAlpha = 0.3;
        
        for (let i = 0; i < 3; i++) {
            ctx.lineWidth = Math.max(0.5, size * 0.2);
            ctx.beginPath();
            const offsetX = (Math.random() - 0.5) * 2;
            const offsetY = (Math.random() - 0.5) * 2;
            ctx.moveTo(x1 + offsetX, y1 + offsetY);
            ctx.lineTo(x2 + offsetX, y2 + offsetY);
            ctx.stroke();
        }
    }

    drawCharcoal(ctx, x1, y1, x2, y2) {
        // Simulate charcoal with scattered dots
        const size = this.sketchState.brushSize;
        ctx.globalAlpha = 0.4;
        
        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const steps = Math.max(1, distance / 3);
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = x1 + (x2 - x1) * t;
            const y = y1 + (y2 - y1) * t;
            
            for (let j = 0; j < 5; j++) {
                const offsetX = (Math.random() - 0.5) * size;
                const offsetY = (Math.random() - 0.5) * size;
                ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
            }
        }
    }

    drawEraser(ctx, x1, y1, x2, y2) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    drawSmudge(ctx, x1, y1, x2, y2) {
        // Simple smudge effect
        const imageData = ctx.getImageData(x1 - 10, y1 - 10, 20, 20);
        ctx.putImageData(imageData, x2 - 10, y2 - 10);
    }

    drawBlur(ctx, x1, y1, x2, y2) {
        // Simple blur effect (simplified)
        const size = this.sketchState.brushSize;
        const imageData = ctx.getImageData(x2 - size/2, y2 - size/2, size, size);
        // Apply blur filter would require complex implementation
        ctx.putImageData(imageData, x2 - size/2, y2 - size/2);
    }

    drawSprayPaint(ctx, x1, y1, x2, y2) {
        const size = this.sketchState.brushSize;
        const density = 20;
        
        for (let i = 0; i < density; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * size / 2;
            const x = x2 + Math.cos(angle) * radius;
            const y = y2 + Math.sin(angle) * radius;
            
            ctx.fillRect(x, y, 1, 1);
        }
    }

    getCurrentColor() {
        if (this.currentMode === 'pixel') {
            return this.pixelState.colors[this.pixelState.primaryColor] || '#000000';
        } else {
            const colorPicker = document.getElementById('sketchColor');
            return colorPicker ? colorPicker.value : '#000000';
        }
    }

    saveSketchState() {
        // Only save the current layer instead of compositing all layers
        const currentLayer = this.sketchState.layers[this.sketchState.currentLayer];
        if (!currentLayer) return;
        
        this.sketchState.undoStack.push({
            layerIndex: this.sketchState.currentLayer,
            imageData: currentLayer.canvas.toDataURL()
        });
        
        if (this.sketchState.undoStack.length > 20) {
            this.sketchState.undoStack.shift();
        }
        this.sketchState.redoStack = [];
    }

    // Mode Switching
    switchMode(mode) {
        if (mode === this.currentMode) return;
        
        this.currentMode = mode;
        
        // Update UI
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        if (mode === 'pixel') {
            this.switchToPixelMode();
        } else if (mode === 'sketch') {
            this.switchToSketchMode();
        }
    }

    switchToPixelMode() {
        this.currentMode = 'pixel';
        
        // Show pixel tools and hide sketch tools
        document.querySelectorAll('.pixel-tools').forEach(el => el.style.display = 'block');
        document.querySelectorAll('.sketch-tools').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.pixel-controls').forEach(el => el.style.display = 'block');
        document.querySelectorAll('.sketch-controls').forEach(el => el.style.display = 'none');
        
        // Show pixel canvas, hide sketch canvas
        this.elements.canvas.style.display = 'grid';
        this.elements.canvasGrid.style.display = this.pixelState.gridVisible ? 'grid' : 'none';
        this.elements.sketchCanvas.style.display = 'none';
        
        // Hide layer canvases
        this.sketchState.layers.forEach(layer => {
            layer.canvas.style.display = 'none';
        });
        
        // Set pixel tool
        this.setTool(this.pixelState.currentTool);
        
        // Initialize pixel mode if not done
        if (!this.pixelState.colors) {
            this.initPixelMode();
        }
    }

    switchToSketchMode() {
        this.currentMode = 'sketch';
        
        // Hide pixel tools and show sketch tools
        document.querySelectorAll('.pixel-tools').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.sketch-tools').forEach(el => el.style.display = 'block');
        document.querySelectorAll('.pixel-controls').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.sketch-controls').forEach(el => el.style.display = 'block');
        
        // Hide pixel canvas, show sketch canvas
        this.elements.canvas.style.display = 'none';
        this.elements.canvasGrid.style.display = 'none';
        this.elements.sketchCanvas.style.display = 'block';
        
        // Show layer canvases
        this.sketchState.layers.forEach(layer => {
            layer.canvas.style.display = 'block';
        });
        
        // Set sketch tool
        this.setTool(this.sketchState.currentTool);
        
        // Update brush preview
        this.updateBrushPreview();
        this.updateLayerList();
    }

    setTool(toolName) {
        if (this.currentMode === 'pixel') {
            this.pixelState.currentTool = toolName;
        } else {
            this.sketchState.currentTool = toolName;
        }
        
        // Update UI
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === toolName);
        });
        
        // Update cursor
        if (this.currentMode === 'pixel') {
            this.elements.canvas.style.cursor = this.pixelTools[toolName]?.cursor || 'default';
        } else {
            this.elements.sketchCanvas.style.cursor = 'crosshair';
        }
        
        this.updateCanvasInfo();
    }

    // Initialize pixel mode (existing functionality)
    initPixelMode() {
        this.pixelState.colors = this.palettes.default.slice();
        this.pixelState.array = Array.from({length: this.pixelState.canvasHeight}, () => 
            Array(this.pixelState.canvasWidth).fill(0));
        this.pixelState.allSprites = [this.pixelState.array.map(r => r.slice())];
        
        this.setupPixelPalettes();
        this.updateSpriteSelector();
        this.renderPixelCanvas();
        this.updateColorDisplay();
        
        // Start marching ants animation
        setInterval(() => {
            this.pixelState.marchingAntsPhase = (this.pixelState.marchingAntsPhase + 1) % 2;
            if (this.pixelState.selectionBounds) {
                this.renderPreview(this.pixelState.previewArray || this.pixelState.array);
            }
        }, 300);
    }

    setupPixelPalettes() {
        const paletteSelector = this.elements.paletteSelector;
        paletteSelector.innerHTML = '';
        
        for (let theme in this.palettes) {
            const opt = document.createElement('option');
            opt.value = theme;
            opt.textContent = theme.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            paletteSelector.appendChild(opt);
        }
        paletteSelector.value = 'default';
        
        paletteSelector.addEventListener('change', () => {
            this.pixelState.colors = this.palettes[paletteSelector.value].slice();
            this.pixelState.primaryColor = Math.min(this.pixelState.primaryColor, this.pixelState.colors.length - 1);
            this.pixelState.secondaryColor = Math.min(this.pixelState.secondaryColor, this.pixelState.colors.length - 1);
            this.updateColorDisplay();
            this.updateCanvasColors();
        });
    }

    // Pixel Mode Tools (existing functionality)
    get pixelTools() {
        return {
            pencil: {
                cursor: 'crosshair',
                onStart: (x, y) => this.paintCell(x, y, this.pixelState.primaryColor),
                onDrag: (x, y) => this.paintCell(x, y, this.pixelState.primaryColor),
                onRightClick: (x, y) => this.paintCell(x, y, this.pixelState.secondaryColor)
            },
            eraser: {
                cursor: 'crosshair',
                onStart: (x, y) => this.paintCell(x, y, 0),
                onDrag: (x, y) => this.paintCell(x, y, 0)
            },
            eyedropper: {
                cursor: 'crosshair',
                onStart: (x, y) => {
                    const color = this.pixelState.array[y][x];
                    this.pixelState.primaryColor = color;
                    this.updateColorDisplay();
                    this.setTool('pencil');
                },
                onRightClick: (x, y) => {
                    const color = this.pixelState.array[y][x];
                    this.pixelState.secondaryColor = color;
                    this.updateColorDisplay();
                }
            },
            fill: {
                cursor: 'crosshair',
                onStart: (x, y) => this.floodFill(x, y, this.pixelState.primaryColor),
                onRightClick: (x, y) => this.floodFill(x, y, this.pixelState.secondaryColor)
            },
            symmetricPencil: {
                cursor: 'crosshair',
                onStart: (x, y) => this.paintWithSymmetry(x, y, this.pixelState.primaryColor),
                onDrag: (x, y) => this.paintWithSymmetry(x, y, this.pixelState.primaryColor),
                onRightClick: (x, y) => this.paintWithSymmetry(x, y, this.pixelState.secondaryColor)
            },
            symmetricEraser: {
                cursor: 'crosshair',
                onStart: (x, y) => this.paintWithSymmetry(x, y, 0),
                onDrag: (x, y) => this.paintWithSymmetry(x, y, 0)
            },
            symmetricFill: {
                cursor: 'crosshair',
                onStart: (x, y) => this.symmetricFloodFill(x, y, this.pixelState.primaryColor),
                onRightClick: (x, y) => this.symmetricFloodFill(x, y, this.pixelState.secondaryColor)
            },
            select: {
                cursor: 'crosshair',
                onStart: (x, y) => this.startSelection(x, y),
                onDrag: (x, y) => this.updateSelection(x, y),
                onEnd: (x, y) => this.endSelection(x, y)
            },
            move: {
                cursor: 'move',
                onStart: (x, y) => this.startMove(x, y),
                onDrag: (x, y, dxOverride, dyOverride) => this.updateMove(x, y, dxOverride, dyOverride),
                onEnd: (x, y, dxOverride, dyOverride) => this.endMove(x, y, dxOverride, dyOverride)
            },
            line: {
                cursor: 'crosshair',
                onStart: (x, y) => this.startShape('line', x, y),
                onDrag: (x, y) => this.updateLine(x, y),
                onEnd: (x, y) => this.endLine(x, y)
            },
            rect: {
                cursor: 'crosshair',
                onStart: (x, y) => this.startShape('rect', x, y),
                onDrag: (x, y) => this.updateRect(x, y),
                onEnd: (x, y) => this.endRect(x, y)
            },
            circle: {
                cursor: 'crosshair',
                onStart: (x, y) => this.startShape('circle', x, y),
                onDrag: (x, y) => this.updateCircle(x, y),
                onEnd: (x, y) => this.endCircle(x, y)
            }
        };
    }

    setupPixelModeEvents() {
        // Pixel canvas mouse events
        if (this.elements.canvas) {
            this.elements.canvas.addEventListener('wheel', (e) => {
                if (this.currentMode === 'pixel') {
                    e.preventDefault();
                    const zoomStep = 0.1;
                    if (e.deltaY < 0) {
                        this.pixelState.zoomLevel = Math.min(this.pixelState.zoomLevel + zoomStep, 5);
                    } else {
                        this.pixelState.zoomLevel = Math.max(this.pixelState.zoomLevel - zoomStep, 0.2);
                    }
                    this.renderPixelCanvas();
                }
            });
        }

        // Button events
        this.setupPixelButtons();
        
        // Color events
        this.setupColorEvents();
        
        // Sprite events
        this.setupSpriteEvents();
        
        // Transform events
        this.setupTransformEvents();
        
        // Canvas size events
        this.setupCanvasSizeEvents();
    }

    setupPixelButtons() {
        const buttons = {
            newProject: () => {
                if (confirm('Create new project? Unsaved changes will be lost.')) {
                    this.initPixelCanvas(16, 16);
                }
            },
            saveProject: () => this.exportJSON(),
            exportPNG: () => this.exportPNG(),
            exportPNG2: () => this.exportPNG(),
            exportJSON: () => this.exportJSON(),
            newSprite: () => this.addNewSprite(),
            duplicateSprite: () => this.duplicateSprite(),
            deleteSprite: () => this.deleteSprite(),
            resizeCanvas: () => this.resizePixelCanvas(),
            clear: () => this.clearPixelCanvas(),
            undo: () => this.pixelUndo(),
            redo: () => this.pixelRedo(),
            // In setupPixelButtons(), replace these lines:
            // zoomIn: () => this.zoomPixelCanvas(1.25),
            // zoomOut: () => this.zoomPixelCanvas(0.8),
            // zoomReset: () => this.resetPixelZoom()

            // With these:
            zoomIn: () => {
                if (this.currentMode === 'pixel') {
                    this.zoomPixelCanvas(1.25);
                } else {
                    this.zoomSketchCanvas(1.25);
                }
            },
            zoomOut: () => {
                if (this.currentMode === 'pixel') {
                    this.zoomPixelCanvas(0.8);
                } else {
                    this.zoomSketchCanvas(0.8);
                }
            },
            zoomReset: () => {
                if (this.currentMode === 'pixel') {
                    this.resetPixelZoom();
                } else {
                    this.resetSketchZoom();
                }
            }
        };

        Object.keys(buttons).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', buttons[id]);
            }
        });

        // Grid toggle
        if (this.elements.gridToggle) {
            this.elements.gridToggle.addEventListener('change', () => {
                this.pixelState.gridVisible = this.elements.gridToggle.checked;
                if (this.currentMode === 'pixel') {
                    this.elements.canvasGrid.style.display = this.pixelState.gridVisible ? 'grid' : 'none';
                }
            });
        }
    }

    setupColorEvents() {
        const primaryColor = document.getElementById('primaryColor');
        const secondaryColor = document.getElementById('secondaryColor');
        
        if (primaryColor) {
            primaryColor.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'color';
                input.value = this.pixelState.colors[this.pixelState.primaryColor];
                input.addEventListener('change', (e) => {
                    this.pixelState.colors[this.pixelState.primaryColor] = e.target.value;
                    this.updateColorDisplay();
                    this.updateCanvasColors();
                });
                input.click();
            });
        }

        if (secondaryColor) {
            secondaryColor.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'color';
                input.value = this.pixelState.colors[this.pixelState.secondaryColor];
                input.addEventListener('change', (e) => {
                    this.pixelState.colors[this.pixelState.secondaryColor] = e.target.value;
                    this.updateColorDisplay();
                    this.updateCanvasColors();
                });
                input.click();
            });
        }
    }

    setupSpriteEvents() {
        if (this.elements.spriteSelector) {
            this.elements.spriteSelector.addEventListener('change', () => {
                this.loadSprite(parseInt(this.elements.spriteSelector.value));
            });
        }
    }

    setupTransformEvents() {
        const transforms = {
            rotateLeft: () => this.rotateSelection(270),
            rotate180: () => this.rotateSelection(180),
            rotateRight: () => this.rotateSelection(90),
            flipHorizontal: () => this.flipSelection('horizontal'),
            flipVertical: () => this.flipSelection('vertical')
        };

        Object.keys(transforms).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', transforms[id]);
            }
        });

        // Symmetry buttons
        document.querySelectorAll('.symmetry-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setSymmetryMode(btn.dataset.symmetry));
        });
    }

    setupCanvasSizeEvents() {
        const canvasWidth = document.getElementById('canvasWidth');
        const canvasHeight = document.getElementById('canvasHeight');
        
        if (canvasWidth && canvasHeight) {
            canvasWidth.value = this.pixelState.canvasWidth;
            canvasHeight.value = this.pixelState.canvasHeight;
        }
    }

    setupGlobalEvents() {
        // Global mouse up
        document.addEventListener('mouseup', () => {
            if (this.currentMode === 'pixel') {
                this.pixelState.isPainting = false;
                this.pixelState.isRightClick = false;
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Panel collapse
        document.querySelectorAll('.panel-header').forEach(header => {
            header.addEventListener('click', () => {
                const panel = header.parentElement;
                panel.classList.toggle('collapsed');
                const arrow = header.querySelector('span');
                if (arrow) {
                    arrow.textContent = panel.classList.contains('collapsed') ? '▶' : '▼';
                }
            });
        });

        // Import file
        const importFile = document.getElementById('importFile');
        if (importFile) {
            importFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) this.importJSON(file);
            });
        }
    }

    handleKeydown(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key.toLowerCase()) {
            case 'b': 
                if (this.currentMode === 'pixel') {
                    this.setTool(e.shiftKey ? 'symmetricPencil' : 'pencil');
                } else {
                    this.setTool('brush');
                }
                break;
            case 'e': 
                if (this.currentMode === 'pixel') {
                    this.setTool(e.shiftKey ? 'symmetricEraser' : 'eraser');
                } else {
                    this.setTool('eraser');
                }
                break;
            case 'g': 
                if (this.currentMode === 'pixel') {
                    this.setTool(e.shiftKey ? 'symmetricFill' : 'fill');
                }
                break;
            case 'i': 
                if (this.currentMode === 'pixel') {
                    this.setTool('eyedropper');
                }
                break;
            case 'm': 
                if (this.currentMode === 'pixel') {
                    this.setTool('select');
                } else {
                    this.setTool('marker');
                }
                break;
            case 'v': 
                if (this.currentMode === 'pixel') {
                    this.setTool('move');
                }
                break;
            case 'l': this.setTool('line'); break;
            case 'r': this.setTool('rect'); break;
            case 'o': this.setTool('circle'); break;
            case 'p': 
                if (this.currentMode === 'sketch') {
                    this.setTool('pen');
                }
                break;
            case 'c': 
                if (this.currentMode === 'sketch') {
                    this.setTool('pencilSketch');
                }
                break;
            case 'h': 
                if (this.currentMode === 'sketch') {
                    this.setTool('charcoal');
                } else if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.flipSelection('horizontal');
                }
                break;
            case 's':
                if (this.currentMode === 'sketch') {
                    this.setTool('smudge');
                } else if (this.currentMode === 'pixel') {
                    this.setSymmetryMode('both');
                }
                break;
            case 'u': 
                if (this.currentMode === 'sketch') {
                    this.setTool('blur');
                }
                break;
            case 'y': 
                if (this.currentMode === 'sketch') {
                    this.setTool('sprayPaint');
                } else if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.currentMode === 'pixel' ? this.pixelRedo() : this.sketchRedo();
                }
                break;
            
            // Symmetry modes (pixel only)
            case 'q': 
                if (this.currentMode === 'pixel') {
                    this.setSymmetryMode('none');
                }
                break;
            case 'w': 
                if (this.currentMode === 'pixel') {
                    this.setSymmetryMode('horizontal');
                }
                break;
            case 'a': 
                if (this.currentMode === 'pixel') {
                    this.setSymmetryMode('vertical');
                }
                break;
            
            // Transform operations
            case '[': 
                if (this.currentMode === 'pixel') {
                    this.rotateSelection(270);
                }
                break;
            case ']': 
                if (this.currentMode === 'pixel') {
                    this.rotateSelection(90);
                }
                break;
            case 'j':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.flipSelection('vertical');
                }
                break;
            
            // Undo/Redo
            case 'z': 
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.currentMode === 'pixel' ? this.pixelRedo() : this.sketchRedo();
                    } else {
                        this.currentMode === 'pixel' ? this.pixelUndo() : this.sketchUndo();
                    }
                }
                break;
            
            // Zoom
            case '+': 
            case '=': 
                if (this.currentMode === 'pixel') {
                    this.zoomPixelCanvas(1.25);
                }
                break;
            case '-': 
                if (this.currentMode === 'pixel') {
                    this.zoomPixelCanvas(0.8);
                }
                break;
            case '0':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    if (this.currentMode === 'pixel') {
                        this.resetPixelZoom();
                    }
                }
                break;
            
            // Clear
            case 'delete':
            case 'backspace':
                e.preventDefault();
                if (this.currentMode === 'pixel') {
                    this.clearPixelCanvas();
                } else {
                    this.clearSketchCanvas();
                }
                break;
        }
        
        // Number keys for color selection (pixel mode only)
        if (this.currentMode === 'pixel') {
            const num = parseInt(e.key);
            if (num >= 0 && num <= 9 && num < this.pixelState.colors.length) {
                if (e.shiftKey) {
                    this.pixelState.secondaryColor = num;
                } else {
                    this.pixelState.primaryColor = num;
                }
                this.updateColorDisplay();
            }
        }
    }

    // Pixel Mode Canvas Methods
    initPixelCanvas(width = 16, height = 16) {
        this.pixelState.canvasWidth = width;
        this.pixelState.canvasHeight = height;
        this.pixelState.array = Array.from({length: height}, () => Array(width).fill(0));
        this.pixelState.allSprites = [this.pixelState.array.map(r => r.slice())];
        this.pixelState.currentSpriteIndex = 0;
        this.updateSpriteSelector();
        this.renderPixelCanvas();
        this.saveToLocalStorage();
    }

    renderPixelCanvas() {
        if (this.currentMode !== 'pixel') return;
        
        const cellSize = Math.max(8, Math.floor(400 / Math.max(this.pixelState.canvasWidth, this.pixelState.canvasHeight)) * this.pixelState.zoomLevel);
        
        this.elements.canvas.innerHTML = '';
        this.elements.canvasGrid.innerHTML = '';
        
        const canvasPixelWidth = this.pixelState.canvasWidth * cellSize;
        const canvasPixelHeight = this.pixelState.canvasHeight * cellSize;
        
        // Set canvas size and grid layout
        this.elements.canvas.style.width = `${canvasPixelWidth}px`;
        this.elements.canvas.style.height = `${canvasPixelHeight}px`;
        this.elements.canvas.style.gridTemplateColumns = `repeat(${this.pixelState.canvasWidth}, ${cellSize}px)`;
        this.elements.canvas.style.gridTemplateRows = `repeat(${this.pixelState.canvasHeight}, ${cellSize}px)`;
        
        // Fill canvas with cells
        for (let y = 0; y < this.pixelState.canvasHeight; y++) {
            for (let x = 0; x < this.pixelState.canvasWidth; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.dataset.value = this.pixelState.array[y][x];
                cell.style.width = `${cellSize}px`;
                cell.style.height = `${cellSize}px`;
                cell.style.background = this.pixelState.colors[this.pixelState.array[y][x]] || 'transparent';
                
                // Event listeners
                cell.addEventListener('mousedown', (e) => this.handlePixelCellMouseDown(e));
                cell.addEventListener('mouseenter', (e) => this.handlePixelCellMouseEnter(e));
                cell.addEventListener('mouseleave', (e) => this.handlePixelCellMouseLeave(e));
                cell.addEventListener('mouseup', (e) => this.handlePixelCellMouseUp(e));
                cell.addEventListener('contextmenu', e => e.preventDefault());
                cell.addEventListener('touchstart', (e) => this.handlePixelCellTouchStart(e), { passive: false });
                cell.addEventListener('touchmove', (e) => this.handlePixelCellTouchMove(e), { passive: false });
                cell.addEventListener('touchend', (e) => this.handlePixelCellTouchEnd(e), { passive: false });
                
                this.elements.canvas.appendChild(cell);
            }
        }
        
        // Update grid overlay
        this.elements.canvasGrid.style.position = 'absolute';
        this.elements.canvasGrid.style.top = this.elements.canvas.offsetTop + 'px';
        this.elements.canvasGrid.style.left = this.elements.canvas.offsetLeft + 'px';
        this.elements.canvasGrid.style.width = `${canvasPixelWidth}px`;
        this.elements.canvasGrid.style.height = `${canvasPixelHeight}px`;
        this.elements.canvasGrid.style.gridTemplateColumns = `repeat(${this.pixelState.canvasWidth}, ${cellSize}px)`;
        this.elements.canvasGrid.style.gridTemplateRows = `repeat(${this.pixelState.canvasHeight}, ${cellSize}px)`;
        this.elements.canvasGrid.style.pointerEvents = 'none';
        
        // Fill grid cells
        for (let y = 0; y < this.pixelState.canvasHeight; y++) {
            for (let x = 0; x < this.pixelState.canvasWidth; x++) {
                const gridCell = document.createElement('div');
                gridCell.className = 'grid-cell';
                gridCell.style.width = `${cellSize}px`;
                gridCell.style.height = `${cellSize}px`;
                this.elements.canvasGrid.appendChild(gridCell);
            }
        }
        
        // Center canvas + grid inside wrapper
        const wrapper = this.elements.canvas.parentElement;
        wrapper.style.display = 'flex';
        wrapper.style.justifyContent = 'center';
        wrapper.style.alignItems = 'center';
        wrapper.style.overflow = 'hidden';
        
        this.updateCanvasInfo();
        this.updateZoomIndicator();
        this.renderSymmetryGuides();
        this.updateColorDisplay();
        this.setupPalettes();
    }

    // Pixel Event Handlers
    handlePixelCellMouseDown(e) {
        if (this.currentMode !== 'pixel') return;
        
        e.preventDefault();
        const x = parseInt(e.target.dataset.x);
        const y = parseInt(e.target.dataset.y);
        
        this.pixelState.isRightClick = e.button === 2;
        this.pixelState.isPainting = true;
        
        this.savePixelState();
        
        const tool = this.pixelTools[this.pixelState.currentTool];
        if (this.pixelState.isRightClick && tool.onRightClick) {
            tool.onRightClick(x, y);
        } else if (tool.onStart) {
            tool.onStart(x, y);
        }
    }

    handlePixelCellMouseEnter(e) {
        if (this.currentMode !== 'pixel') return;
        
        const x = parseInt(e.target.dataset.x);
        const y = parseInt(e.target.dataset.y);
        
        // Show preview
        if (this.pixelState.currentTool === 'pencil' || this.pixelState.currentTool === 'eraser') {
            const previewColor = this.pixelState.currentTool === 'eraser' ? 'transparent' : this.pixelState.colors[this.pixelState.primaryColor];
            e.target.style.boxShadow = `inset 0 0 0 2px ${previewColor === 'transparent' ? '#ff0000' : previewColor}`;
        }
        
        if (this.pixelState.isPainting) {
            const tool = this.pixelTools[this.pixelState.currentTool];
            if (tool.onDrag) {
                tool.onDrag(x, y);
            }
        }
        
        this.updateCanvasInfo(x, y);
    }

    handlePixelCellMouseLeave(e) {
        e.target.style.boxShadow = '';
    }

    handlePixelCellMouseUp() {
        if (this.currentMode !== 'pixel') return;
        this.pixelState.isPainting = false;
        this.pixelState.isRightClick = false;
    }

    handlePixelCellTouchStart(e) {
        if (this.currentMode !== 'pixel') return;
        
        e.preventDefault();
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (target && target.classList.contains('cell')) {
            const x = parseInt(target.dataset.x);
            const y = parseInt(target.dataset.y);
            
            this.pixelState.isPainting = true;
            this.savePixelState();
            
            if (this.pixelState.currentTool === 'move') {
                if (!this.pixelState.selectionBounds || !this.pixelState.selectionArray) {
                    this.pixelState.selectionBounds = { 
                        x0: 0, y0: 0, 
                        x1: this.pixelState.canvasWidth - 1, 
                        y1: this.pixelState.canvasHeight - 1 
                    };
                    this.pixelState.selectionArray = this.pixelState.array.map(row => row.slice());
                }
                this.pixelState.touchMoveStart = { 
                    clientX: touch.clientX, 
                    clientY: touch.clientY, 
                    x, y 
                };
            }
            
            const tool = this.pixelTools[this.pixelState.currentTool];
            if (tool.onStart) {
                tool.onStart(x, y);
            }
        }
    }

    handlePixelCellTouchMove(e) {
        if (this.currentMode !== 'pixel' || !this.pixelState.isPainting) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        
        if (this.pixelState.currentTool === 'move' && this.pixelState.touchMoveStart) {
            const cellSize = Math.max(8, Math.floor(400 / Math.max(this.pixelState.canvasWidth, this.pixelState.canvasHeight)) * this.pixelState.zoomLevel);
            const dxPixels = touch.clientX - this.pixelState.touchMoveStart.clientX;
            const dyPixels = touch.clientY - this.pixelState.touchMoveStart.clientY;
            const dxCells = Math.round(dxPixels / cellSize);
            const dyCells = Math.round(dyPixels / cellSize);
            
            const tool = this.pixelTools[this.pixelState.currentTool];
            if (tool.onDrag) {
                tool.onDrag(this.pixelState.touchMoveStart.x, this.pixelState.touchMoveStart.y, dxCells, dyCells);
            }
            
            if (this.pixelState.previewArray) {
                this.renderPreview(this.pixelState.previewArray);
            }
            return;
        }
        
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.classList.contains('cell')) {
            const x = parseInt(target.dataset.x);
            const y = parseInt(target.dataset.y);
            
            const tool = this.pixelTools[this.pixelState.currentTool];
            if (tool.onDrag) {
                tool.onDrag(x, y);
            }
        }
    }

    handlePixelCellTouchEnd(e) {
        if (this.currentMode !== 'pixel') return;
        
        e.preventDefault();
        this.pixelState.isPainting = false;
        
        const touch = e.changedTouches[0];
        
        if (this.pixelState.currentTool === 'move' && this.pixelState.touchMoveStart) {
            const cellSize = Math.max(8, Math.floor(400 / Math.max(this.pixelState.canvasWidth, this.pixelState.canvasHeight)) * this.pixelState.zoomLevel);
            const dxPixels = touch.clientX - this.pixelState.touchMoveStart.clientX;
            const dyPixels = touch.clientY - this.pixelState.touchMoveStart.clientY;
            const dxCells = Math.round(dxPixels / cellSize);
            const dyCells = Math.round(dyPixels / cellSize);
            
            const tool = this.pixelTools[this.pixelState.currentTool];
            if (tool.onEnd) {
                tool.onEnd(this.pixelState.touchMoveStart.x, this.pixelState.touchMoveStart.y, dxCells, dyCells);
            }
            this.pixelState.touchMoveStart = null;
            return;
        }
        
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.classList.contains('cell')) {
            const x = parseInt(target.dataset.x);
            const y = parseInt(target.dataset.y);
            
            const tool = this.pixelTools[this.pixelState.currentTool];
            if (tool.onEnd) {
                tool.onEnd(x, y);
            }
        }
    }

    // Pixel Drawing Methods
    paintCell(x, y, colorIndex) {
        if (x < 0 || x >= this.pixelState.canvasWidth || y < 0 || y >= this.pixelState.canvasHeight) return;
        
        // Only update if color actually changed
        if (this.pixelState.array[y][x] === colorIndex) return;
        
        this.pixelState.array[y][x] = colorIndex;
        
        // Update only the specific cell instead of re-rendering everything
        const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        if (cell) {
            cell.dataset.value = colorIndex;
            cell.style.background = this.pixelState.colors[colorIndex] || 'transparent';
        }
        
        this.pixelState.allSprites[this.pixelState.currentSpriteIndex] = this.pixelState.array.map(r => r.slice());
        
        // Debounce localStorage saves
        if (this.saveTimeout) clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => this.saveToLocalStorage(), 500);
    }

    floodFill(startX, startY, newColor) {
        const targetColor = this.pixelState.array[startY][startX];
        if (targetColor === newColor) return;
        
        const stack = [[startX, startY]];
        const visited = new Set();
        
        while (stack.length > 0) {
            const [x, y] = stack.pop();
            const key = `${x},${y}`;
            
            if (visited.has(key) || x < 0 || x >= this.pixelState.canvasWidth || y < 0 || y >= this.pixelState.canvasHeight) continue;
            if (this.pixelState.array[y][x] !== targetColor) continue;
            
            visited.add(key);
            this.paintCell(x, y, newColor);
            
            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }
    }

    // Symmetry Methods
    setSymmetryMode(mode) {
        this.pixelState.symmetryMode = mode;
        this.pixelState.symmetryAxis.x = Math.floor(this.pixelState.canvasWidth / 2);
        this.pixelState.symmetryAxis.y = Math.floor(this.pixelState.canvasHeight / 2);
        
        document.querySelectorAll('.symmetry-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.symmetry === mode);
        });
        
        this.updateCanvasInfo();
        this.renderSymmetryGuides();
    }

    renderSymmetryGuides() {
        document.querySelectorAll('.symmetry-guide').forEach(guide => guide.remove());
        
        if (this.currentMode !== 'pixel' || this.pixelState.symmetryMode === 'none') return;
        
        const cellSize = Math.max(8, Math.floor(400 / Math.max(this.pixelState.canvasWidth, this.pixelState.canvasHeight)) * this.pixelState.zoomLevel);
        
        if (this.pixelState.symmetryMode === 'horizontal' || this.pixelState.symmetryMode === 'both') {
            const guide = document.createElement('div');
            guide.className = 'symmetry-guide horizontal';
            guide.style.position = 'absolute';
            guide.style.left = '0';
            guide.style.right = '0';
            guide.style.top = (this.pixelState.symmetryAxis.y * cellSize) + 'px';
            guide.style.height = '1px';
            guide.style.backgroundColor = '#ff00ff';
            guide.style.pointerEvents = 'none';
            guide.style.zIndex = '10';
            this.elements.canvas.parentElement.appendChild(guide);
        }
        
        if (this.pixelState.symmetryMode === 'vertical' || this.pixelState.symmetryMode === 'both') {
            const guide = document.createElement('div');
            guide.className = 'symmetry-guide vertical';
            guide.style.position = 'absolute';
            guide.style.top = '0';
            guide.style.bottom = '0';
            guide.style.left = (this.pixelState.symmetryAxis.x * cellSize) + 'px';
            guide.style.width = '1px';
            guide.style.backgroundColor = '#ff00ff';
            guide.style.pointerEvents = 'none';
            guide.style.zIndex = '10';
            this.elements.canvas.parentElement.appendChild(guide);
        }
    }

    paintWithSymmetry(x, y, colorIndex) {
        this.paintCell(x, y, colorIndex);
        
        if (this.pixelState.symmetryMode === 'none') return;
        
        if (this.pixelState.symmetryMode === 'horizontal' || this.pixelState.symmetryMode === 'both') {
            const mirrorY = this.pixelState.symmetryAxis.y * 2 - y;
            if (mirrorY >= 0 && mirrorY < this.pixelState.canvasHeight && mirrorY !== y) {
                this.paintCell(x, mirrorY, colorIndex);
            }
        }
        
        if (this.pixelState.symmetryMode === 'vertical' || this.pixelState.symmetryMode === 'both') {
            const mirrorX = this.pixelState.symmetryAxis.x * 2 - x;
            if (mirrorX >= 0 && mirrorX < this.pixelState.canvasWidth && mirrorX !== x) {
                this.paintCell(mirrorX, y, colorIndex);
            }
        }
        
        if (this.pixelState.symmetryMode === 'both') {
            const mirrorX = this.pixelState.symmetryAxis.x * 2 - x;
            const mirrorY = this.pixelState.symmetryAxis.y * 2 - y;
            if (mirrorX >= 0 && mirrorX < this.pixelState.canvasWidth && 
                mirrorY >= 0 && mirrorY < this.pixelState.canvasHeight && 
                (mirrorX !== x || mirrorY !== y)) {
                this.paintCell(mirrorX, mirrorY, colorIndex);
            }
        }
    }

    symmetricFloodFill(x, y, newColor) {
        this.floodFill(x, y, newColor);
        
        if (this.pixelState.symmetryMode !== 'none') {
            if (this.pixelState.symmetryMode === 'horizontal' || this.pixelState.symmetryMode === 'both') {
                const mirrorY = this.pixelState.symmetryAxis.y * 2 - y;
                if (mirrorY >= 0 && mirrorY < this.pixelState.canvasHeight && mirrorY !== y) {
                    this.floodFill(x, mirrorY, newColor);
                }
            }
            if (this.pixelState.symmetryMode === 'vertical' || this.pixelState.symmetryMode === 'both') {
                const mirrorX = this.pixelState.symmetryAxis.x * 2 - x;
                if (mirrorX >= 0 && mirrorX < this.pixelState.canvasWidth && mirrorX !== x) {
                    this.floodFill(mirrorX, y, newColor);
                }
            }
            if (this.pixelState.symmetryMode === 'both') {
                const mirrorX = this.pixelState.symmetryAxis.x * 2 - x;
                const mirrorY = this.pixelState.symmetryAxis.y * 2 - y;
                if (mirrorX >= 0 && mirrorX < this.pixelState.canvasWidth && 
                    mirrorY >= 0 && mirrorY < this.pixelState.canvasHeight && 
                    (mirrorX !== x || mirrorY !== y)) {
                    this.floodFill(mirrorX, mirrorY, newColor);
                }
            }
        }
    }

    // Selection Methods
    startSelection(x, y) {
        this.pixelState.selectionStart = { x, y };
        this.pixelState.selectionEnd = { x, y };
        this.pixelState.previewArray = this.pixelState.array.map(row => row.slice());
    }

    updateSelection(x, y) {
        if (!this.pixelState.selectionStart) return;

        this.pixelState.selectionEnd = { x, y };
        this.pixelState.previewArray = this.pixelState.array.map(row => row.slice());

        const x0 = Math.min(this.pixelState.selectionStart.x, x);
        const x1 = Math.max(this.pixelState.selectionStart.x, x);
        const y0 = Math.min(this.pixelState.selectionStart.y, y);
        const y1 = Math.max(this.pixelState.selectionStart.y, y);

        for (let i = y0; i <= y1; i++) {
            for (let j = x0; j <= x1; j++) {
                if (i === y0 || i === y1 || j === x0 || j === x1) {
                    this.pixelState.previewArray[i][j] = -1;
                }
            }
        }

        this.renderPreview(this.pixelState.previewArray);
    }

    endSelection(x, y) {
        if (!this.pixelState.selectionStart) return;

        const x0 = Math.min(this.pixelState.selectionStart.x, x);
        const x1 = Math.max(this.pixelState.selectionStart.x, x);
        const y0 = Math.min(this.pixelState.selectionStart.y, y);
        const y1 = Math.max(this.pixelState.selectionStart.y, y);

        this.pixelState.selectionBounds = { x0, y0, x1, y1 };

        this.pixelState.selectionArray = [];
        for (let i = y0; i <= y1; i++) {
            this.pixelState.selectionArray.push(this.pixelState.array[i].slice(x0, x1 + 1));
        }

        this.pixelState.selectionStart = null;
        this.pixelState.previewArray = null;
    }

    // Move Methods
    startMove(x, y) {
        if (this.pixelState.selectionBounds && this.pixelState.selectionArray) {
            if (x >= this.pixelState.selectionBounds.x0 && x <= this.pixelState.selectionBounds.x1 &&
                y >= this.pixelState.selectionBounds.y0 && y <= this.pixelState.selectionBounds.y1) {
                this.pixelState.moveStart = { x, y };
                this.pixelState.moveOffset = { dx: 0, dy: 0 };
                
                this.pixelState.previewArray = this.pixelState.array.map(row => row.slice());
                
                for (let i = this.pixelState.selectionBounds.y0; i <= this.pixelState.selectionBounds.y1; i++) {
                    for (let j = this.pixelState.selectionBounds.x0; j <= this.pixelState.selectionBounds.x1; j++) {
                        this.pixelState.previewArray[i][j] = 0;
                    }
                }
                return;
            }
        }
        
        this.pixelState.selectionBounds = null;
        this.pixelState.selectionArray = null;
        this.pixelState.previewArray = null;
        this.renderPixelCanvas();
    }

    updateMove(x, y, dxOverride = null, dyOverride = null) {
        if (!this.pixelState.moveStart || !this.pixelState.selectionBounds || !this.pixelState.selectionArray) return;

        const dx = dxOverride !== null ? dxOverride : (x - this.pixelState.moveStart.x);
        const dy = dyOverride !== null ? dyOverride : (y - this.pixelState.moveStart.y);
        
        this.pixelState.moveOffset = { dx, dy };

        this.pixelState.previewArray = this.pixelState.array.map(row => row.slice());
        
        for (let i = this.pixelState.selectionBounds.y0; i <= this.pixelState.selectionBounds.y1; i++) {
            for (let j = this.pixelState.selectionBounds.x0; j <= this.pixelState.selectionBounds.x1; j++) {
                this.pixelState.previewArray[i][j] = 0;
            }
        }

        for (let i = 0; i < this.pixelState.selectionArray.length; i++) {
            for (let j = 0; j < this.pixelState.selectionArray[i].length; j++) {
                const newY = this.pixelState.selectionBounds.y0 + dy + i;
                const newX = this.pixelState.selectionBounds.x0 + dx + j;
                
                if (newY >= 0 && newY < this.pixelState.canvasHeight && 
                    newX >= 0 && newX < this.pixelState.canvasWidth && 
                    this.pixelState.selectionArray[i][j] !== 0) {
                    this.pixelState.previewArray[newY][newX] = this.pixelState.selectionArray[i][j];
                }
            }
        }

        this.renderPreview(this.pixelState.previewArray);
    }

    endMove(x, y, dxOverride = null, dyOverride = null) {
        if (!this.pixelState.moveStart || !this.pixelState.selectionBounds || !this.pixelState.selectionArray) return;

        const dx = dxOverride !== null ? dxOverride : (x - this.pixelState.moveStart.x);
        const dy = dyOverride !== null ? dyOverride : (y - this.pixelState.moveStart.y);

        for (let i = this.pixelState.selectionBounds.y0; i <= this.pixelState.selectionBounds.y1; i++) {
            for (let j = this.pixelState.selectionBounds.x0; j <= this.pixelState.selectionBounds.x1; j++) {
                this.paintCell(j, i, 0);
            }
        }

        for (let i = 0; i < this.pixelState.selectionArray.length; i++) {
            for (let j = 0; j < this.pixelState.selectionArray[i].length; j++) {
                const newY = this.pixelState.selectionBounds.y0 + dy + i;
                const newX = this.pixelState.selectionBounds.x0 + dx + j;
                
                if (newY >= 0 && newY < this.pixelState.canvasHeight && 
                    newX >= 0 && newX < this.pixelState.canvasWidth && 
                    this.pixelState.selectionArray[i][j] !== 0) {
                    this.paintCell(newX, newY, this.pixelState.selectionArray[i][j]);
                }
            }
        }

        this.pixelState.selectionBounds.x0 += dx;
        this.pixelState.selectionBounds.x1 += dx;
        this.pixelState.selectionBounds.y0 += dy;
        this.pixelState.selectionBounds.y1 += dy;

        this.pixelState.moveStart = null;
        this.pixelState.moveOffset = { dx: 0, dy: 0 };
        this.pixelState.previewArray = null;
        this.renderPixelCanvas();
    }

    // Shape Methods
    startShape(type, x, y) {
        this.pixelState.shapeStart = { x, y, type };
        this.pixelState.previewArray = this.pixelState.array.map(row => row.slice());
    }

    updateLine(x, y) {
        if (!this.pixelState.shapeStart) return;

        this.pixelState.previewArray = this.pixelState.array.map(row => row.slice());

        const x0 = this.pixelState.shapeStart.x;
        const y0 = this.pixelState.shapeStart.y;
        const dx = Math.abs(x - x0);
        const dy = Math.abs(y - y0);
        const sx = x0 < x ? 1 : -1;
        const sy = y0 < y ? 1 : -1;
        let err = dx - dy;
        let cx = x0;
        let cy = y0;

        while (true) {
            this.pixelState.previewArray[cy][cx] = this.pixelState.primaryColor;
            if (cx === x && cy === y) break;
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; cx += sx; }
            if (e2 < dx) { err += dx; cy += sy; }
        }

        this.renderPreview(this.pixelState.previewArray);
    }

    endLine(x, y) {
        if (!this.pixelState.shapeStart) return;

        const x0 = this.pixelState.shapeStart.x;
        const y0 = this.pixelState.shapeStart.y;
        const dx = Math.abs(x - x0);
        const dy = Math.abs(y - y0);
        const sx = x0 < x ? 1 : -1;
        const sy = y0 < y ? 1 : -1;
        let err = dx - dy;
        let cx = x0;
        let cy = y0;

        while (true) {
            this.paintCell(cx, cy, this.pixelState.primaryColor);
            if (cx === x && cy === y) break;
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; cx += sx; }
            if (e2 < dx) { err += dx; cy += sy; }
        }

        this.pixelState.shapeStart = null;
        this.pixelState.previewArray = null;
    }

    updateRect(x, y) {
        if (!this.pixelState.shapeStart) return;

        this.pixelState.previewArray = this.pixelState.array.map(row => row.slice());

        const x0 = Math.min(this.pixelState.shapeStart.x, x);
        const x1 = Math.max(this.pixelState.shapeStart.x, x);
        const y0 = Math.min(this.pixelState.shapeStart.y, y);
        const y1 = Math.max(this.pixelState.shapeStart.y, y);

        for (let i = y0; i <= y1; i++) {
            for (let j = x0; j <= x1; j++) {
                this.pixelState.previewArray[i][j] = this.pixelState.primaryColor;
            }
        }

        this.renderPreview(this.pixelState.previewArray);
    }

    endRect(x, y) {
        if (!this.pixelState.shapeStart) return;

        const x0 = Math.min(this.pixelState.shapeStart.x, x);
        const x1 = Math.max(this.pixelState.shapeStart.x, x);
        const y0 = Math.min(this.pixelState.shapeStart.y, y);
        const y1 = Math.max(this.pixelState.shapeStart.y, y);

        for (let i = y0; i <= y1; i++) {
            for (let j = x0; j <= x1; j++) {
                this.paintCell(j, i, this.pixelState.primaryColor);
            }
        }

        this.pixelState.shapeStart = null;
        this.pixelState.previewArray = null;
    }

    updateCircle(x, y) {
        if (!this.pixelState.shapeStart) return;

        this.pixelState.previewArray = this.pixelState.array.map(row => row.slice());

        const cx = Math.floor((this.pixelState.shapeStart.x + x) / 2);
        const cy = Math.floor((this.pixelState.shapeStart.y + y) / 2);
        const rx = Math.abs(x - this.pixelState.shapeStart.x) / 2;
        const ry = Math.abs(y - this.pixelState.shapeStart.y) / 2;

        for (let i = Math.floor(cy - ry); i <= Math.ceil(cy + ry); i++) {
            for (let j = Math.floor(cx - rx); j <= Math.ceil(cx + rx); j++) {
                if (j < 0 || j >= this.pixelState.canvasWidth || i < 0 || i >= this.pixelState.canvasHeight) continue;
                if (((j - cx) ** 2) / (rx ** 2) + ((i - cy) ** 2) / (ry ** 2) <= 1) {
                    this.pixelState.previewArray[i][j] = this.pixelState.primaryColor;
                }
            }
        }

        this.renderPreview(this.pixelState.previewArray);
    }

    endCircle(x, y) {
        if (!this.pixelState.shapeStart) return;

        const cx = Math.floor((this.pixelState.shapeStart.x + x) / 2);
        const cy = Math.floor((this.pixelState.shapeStart.y + y) / 2);
        const rx = Math.abs(x - this.pixelState.shapeStart.x) / 2;
        const ry = Math.abs(y - this.pixelState.shapeStart.y) / 2;

        for (let i = Math.floor(cy - ry); i <= Math.ceil(cy + ry); i++) {
            for (let j = Math.floor(cx - rx); j <= Math.ceil(cx + rx); j++) {
                if (j < 0 || j >= this.pixelState.canvasWidth || i < 0 || i >= this.pixelState.canvasHeight) continue;
                if (((j - cx) ** 2) / (rx ** 2) + ((i - cy) ** 2) / (ry ** 2) <= 1) {
                    this.paintCell(j, i, this.pixelState.primaryColor);
                }
            }
        }

        this.pixelState.shapeStart = null;
        this.pixelState.previewArray = null;
    }

    renderPreview(tempArray) {
        document.querySelectorAll('.cell').forEach(cell => {
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            const colorIndex = tempArray[y][x];

            if (colorIndex === -1) {
                cell.style.background = 'transparent';
                cell.style.outline = `1px dashed ${this.pixelState.marchingAntsPhase ? '#000' : '#fff'}`;
            } else if (colorIndex === null) {
                cell.style.background = 'transparent';
                cell.style.outline = 'none';
            } else {
                cell.style.background = this.pixelState.colors[colorIndex] || 'transparent';
                cell.style.outline = 'none';
            }
        });
    }

    // Transform Methods
    rotateSelection(degrees) {
        if (!this.pixelState.selectionBounds || !this.pixelState.selectionArray) {
            alert('Please select an area first');
            return;
        }
        
        this.savePixelState();
        
        const width = this.pixelState.selectionArray[0].length;
        const height = this.pixelState.selectionArray.length;
        let rotatedArray;
        
        switch (degrees) {
            case 90:
                rotatedArray = Array(width).fill().map(() => Array(height).fill(0));
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        rotatedArray[x][height - 1 - y] = this.pixelState.selectionArray[y][x];
                    }
                }
                break;
            case 180:
                rotatedArray = Array(height).fill().map(() => Array(width).fill(0));
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        rotatedArray[height - 1 - y][width - 1 - x] = this.pixelState.selectionArray[y][x];
                    }
                }
                break;
            case 270:
                rotatedArray = Array(width).fill().map(() => Array(height).fill(0));
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        rotatedArray[width - 1 - x][y] = this.pixelState.selectionArray[y][x];
                    }
                }
                break;
            default:
                return;
        }
        
        for (let i = this.pixelState.selectionBounds.y0; i <= this.pixelState.selectionBounds.y1; i++) {
            for (let j = this.pixelState.selectionBounds.x0; j <= this.pixelState.selectionBounds.x1; j++) {
                this.paintCell(j, i, 0);
            }
        }
        
        this.pixelState.selectionArray = rotatedArray;
        const newHeight = rotatedArray.length;
        const newWidth = rotatedArray[0].length;
        
        const centerX = (this.pixelState.selectionBounds.x0 + this.pixelState.selectionBounds.x1) / 2;
        const centerY = (this.pixelState.selectionBounds.y0 + this.pixelState.selectionBounds.y1) / 2;
        
        this.pixelState.selectionBounds.x0 = Math.floor(centerX - newWidth / 2);
        this.pixelState.selectionBounds.x1 = this.pixelState.selectionBounds.x0 + newWidth - 1;
        this.pixelState.selectionBounds.y0 = Math.floor(centerY - newHeight / 2);
        this.pixelState.selectionBounds.y1 = this.pixelState.selectionBounds.y0 + newHeight - 1;
        
        for (let i = 0; i < newHeight; i++) {
            for (let j = 0; j < newWidth; j++) {
                const x = this.pixelState.selectionBounds.x0 + j;
                const y = this.pixelState.selectionBounds.y0 + i;
                if (x >= 0 && x < this.pixelState.canvasWidth && y >= 0 && y < this.pixelState.canvasHeight && rotatedArray[i][j] !== 0) {
                    this.paintCell(x, y, rotatedArray[i][j]);
                }
            }
        }
    }

    flipSelection(direction) {
        if (!this.pixelState.selectionBounds || !this.pixelState.selectionArray) {
            alert('Please select an area first');
            return;
        }
        
        this.savePixelState();
        
        const width = this.pixelState.selectionArray[0].length;
        const height = this.pixelState.selectionArray.length;
        const flippedArray = Array(height).fill().map(() => Array(width).fill(0));
        
        if (direction === 'horizontal') {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    flippedArray[y][width - 1 - x] = this.pixelState.selectionArray[y][x];
                }
            }
        } else if (direction === 'vertical') {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    flippedArray[height - 1 - y][x] = this.pixelState.selectionArray[y][x];
                }
            }
        }
        
        for (let i = this.pixelState.selectionBounds.y0; i <= this.pixelState.selectionBounds.y1; i++) {
            for (let j = this.pixelState.selectionBounds.x0; j <= this.pixelState.selectionBounds.x1; j++) {
                this.paintCell(j, i, 0);
            }
        }
        
        this.pixelState.selectionArray = flippedArray;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const x = this.pixelState.selectionBounds.x0 + j;
                const y = this.pixelState.selectionBounds.y0 + i;
                if (x >= 0 && x < this.pixelState.canvasWidth && y >= 0 && y < this.pixelState.canvasHeight && flippedArray[i][j] !== 0) {
                    this.paintCell(x, y, flippedArray[i][j]);
                }
            }
        }
    }

    // Pixel State Management
    savePixelState() {
        this.pixelState.undoStack.push(this.pixelState.array.map(r => r.slice()));
        if (this.pixelState.undoStack.length > 50) this.pixelState.undoStack.shift();
        this.pixelState.redoStack = [];
    }

    pixelUndo() {
        if (this.pixelState.undoStack.length > 0) {
            this.pixelState.redoStack.push(this.pixelState.array.map(r => r.slice()));
            this.pixelState.array = this.pixelState.undoStack.pop();
            this.renderPixelCanvas();
            this.pixelState.allSprites[this.pixelState.currentSpriteIndex] = this.pixelState.array.map(r => r.slice());
            this.saveToLocalStorage();
        }
    }

    pixelRedo() {
        if (this.pixelState.redoStack.length > 0) {
            this.pixelState.undoStack.push(this.pixelState.array.map(r => r.slice()));
            this.pixelState.array = this.pixelState.redoStack.pop();
            this.renderPixelCanvas();
            this.pixelState.allSprites[this.pixelState.currentSpriteIndex] = this.pixelState.array.map(r => r.slice());
            this.saveToLocalStorage();
        }
    }

    // Sketch State Management
    sketchUndo() {
        if (this.sketchState.undoStack.length > 0) {
            const currentLayer = this.sketchState.layers[this.sketchState.currentLayer];
            if (!currentLayer) return;
            
            // Save current state to redo stack
            this.sketchState.redoStack.push({
                layerIndex: this.sketchState.currentLayer,
                imageData: currentLayer.canvas.toDataURL()
            });
            
            // Restore from undo stack
            const undoState = this.sketchState.undoStack.pop();
            const img = new Image();
            img.onload = () => {
                const targetLayer = this.sketchState.layers[undoState.layerIndex];
                if (targetLayer) {
                    targetLayer.ctx.clearRect(0, 0, targetLayer.canvas.width, targetLayer.canvas.height);
                    targetLayer.ctx.drawImage(img, 0, 0);
                }
            };
            img.src = undoState.imageData;
        }
    }

    sketchRedo() {
        if (this.sketchState.redoStack.length > 0) {
            // Save current state to undo stack
            const compositeCanvas = document.createElement('canvas');
            compositeCanvas.width = this.sketchState.canvas.width;
            compositeCanvas.height = this.sketchState.canvas.height;
            const compositeCtx = compositeCanvas.getContext('2d');
            
            this.sketchState.layers.forEach(layer => {
                if (layer.visible) {
                    compositeCtx.drawImage(layer.canvas, 0, 0);
                }
            });
            
            this.sketchState.undoStack.push(compositeCanvas.toDataURL());
            
            // Restore from redo stack
            const redoData = this.sketchState.redoStack.pop();
            const img = new Image();
            img.onload = () => {
                // Clear all layers
                this.sketchState.layers.forEach(layer => {
                    layer.ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
                });
                
                // Restore to current layer
                if (this.sketchState.layers[this.sketchState.currentLayer]) {
                    this.sketchState.layers[this.sketchState.currentLayer].ctx.drawImage(img, 0, 0);
                }
            };
            img.src = redoData;
        }
    }

    clearSketchCanvas() {
        if (confirm('Clear the canvas? This cannot be undone.')) {
            this.saveSketchState();
            this.sketchState.layers.forEach(layer => {
                layer.ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
            });
        }
    }

    // Zoom and Canvas Info Methods
    zoomPixelCanvas(factor) {
        this.pixelState.zoomLevel = Math.max(0.2, Math.min(5, this.pixelState.zoomLevel * factor));
        this.renderPixelCanvas();
    }

    resetPixelZoom() {
        this.pixelState.zoomLevel = 1;
        this.renderPixelCanvas();
    }

    // Add these methods after your resetPixelZoom() method:
    zoomSketchCanvas(factor) {
        this.sketchState.zoomLevel = Math.max(0.1, Math.min(5, this.sketchState.zoomLevel * factor));
        this.applySketchTransform();
    }

    resetSketchZoom() {
        this.sketchState.zoomLevel = 1;
        this.sketchState.panX = 0;
        this.sketchState.panY = 0;
        this.applySketchTransform();
    }

    applySketchTransform() {
        const container = this.sketchState.canvas.parentElement;
        const transform = `scale(${this.sketchState.zoomLevel}) translate(${this.sketchState.panX}px, ${this.sketchState.panY}px)`;
        
        this.sketchState.canvas.style.transform = transform;
        this.sketchState.layers.forEach(layer => {
            layer.canvas.style.transform = transform;
        });
        
        // Update zoom indicator
        const zoomBtn = document.getElementById('zoomReset');
        if (zoomBtn) {
            zoomBtn.textContent = `${Math.round(this.sketchState.zoomLevel * 100)}%`;
        }
    }

    updateZoomIndicator() {
        if (this.elements.zoomIndicator) {
            this.elements.zoomIndicator.textContent = `${Math.round(this.pixelState.zoomLevel * 100)}%`;
        }
    }

    updateCanvasInfo(x = null, y = null) {
        if (!this.elements.canvasInfo) return;
        
        let info = '';
        
        if (this.currentMode === 'pixel') {
            info = `${this.pixelState.canvasWidth}×${this.pixelState.canvasHeight} | ${this.pixelState.currentTool}`;
            
            if (x !== null && y !== null) {
                const color = this.pixelState.colors[this.pixelState.array[y][x]];
                info += ` | (${x},${y}) ${color || 'transparent'}`;
            } else {
                const color = this.pixelState.colors[this.pixelState.primaryColor];
                info += ` | ${color || 'transparent'}`;
            }
            
            if (this.pixelState.symmetryMode !== 'none') {
                info += ` | Symmetry: ${this.pixelState.symmetryMode}`;
            }
        } else {
            info = `${this.sketchState.canvas.width}×${this.sketchState.canvas.height} | ${this.sketchState.currentTool} | Size: ${this.sketchState.brushSize}px`;
            
            if (x !== null && y !== null) {
                info += ` | (${Math.round(x)},${Math.round(y)})`;
            }
        }
        
        this.elements.canvasInfo.textContent = info;
    }

    // Color Display Methods
    updateColorDisplay() {
        const primaryColor = document.getElementById('primaryColor');
        const secondaryColor = document.getElementById('secondaryColor');
        
        if (primaryColor) {
            primaryColor.style.background = this.pixelState.colors[this.pixelState.primaryColor] || 'transparent';
        }
        
        if (secondaryColor) {
            secondaryColor.style.background = this.pixelState.colors[this.pixelState.secondaryColor] || 'transparent';
        }
        
        this.updatePaletteDisplay();
    }

    updatePaletteDisplay() {
        const swatches = document.getElementById('swatches');
        if (!swatches) return;
        
        swatches.innerHTML = '';
        
        this.pixelState.colors.forEach((color, index) => {
            const swatch = document.createElement('div');
            swatch.className = 'swatch';
            swatch.style.background = color === 'transparent' ? 'transparent' : color;
            swatch.dataset.index = index;
            
            if (index === this.pixelState.primaryColor) {
                swatch.classList.add('selected');
            }
            if (index === this.pixelState.secondaryColor) {
                swatch.classList.add('secondary-selected');
            }
            
            swatch.addEventListener('click', (e) => {
                if (e.shiftKey) {
                    this.pixelState.secondaryColor = index;
                } else {
                    this.pixelState.primaryColor = index;
                }
                this.updateColorDisplay();
            });
            
            swatch.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.pixelState.secondaryColor = index;
                this.updateColorDisplay();
            });
            
            swatches.appendChild(swatch);
        });
        
        // Update custom color pickers
        this.updateCustomColorPickers();
    }

    updateCustomColorPickers() {
        const colorPickers = document.getElementById('colorPickers');
        if (!colorPickers) return;
        
        colorPickers.innerHTML = '';
        
        this.pixelState.customTheme.forEach((color, index) => {
            const picker = document.createElement('input');
            picker.type = 'color';
            picker.value = color;
            picker.className = 'color-picker';
            
            picker.addEventListener('change', (e) => {
                this.pixelState.customTheme[index] = e.target.value;
                this.saveToLocalStorage();
            });
            
            colorPickers.appendChild(picker);
        });
    }

    updateCanvasColors() {
        if (this.currentMode === 'pixel') {
            this.renderPixelCanvas();
        }
    }

    // Canvas Operations
    clearPixelCanvas() {
        if (confirm('Clear the canvas? This cannot be undone.')) {
            this.savePixelState();
            this.pixelState.array = Array.from({length: this.pixelState.canvasHeight}, () => 
                Array(this.pixelState.canvasWidth).fill(0));
            this.renderPixelCanvas();
            this.pixelState.allSprites[this.pixelState.currentSpriteIndex] = this.pixelState.array.map(r => r.slice());
            this.saveToLocalStorage();
        }
    }

    resizePixelCanvas() {
        const width = parseInt(document.getElementById('canvasWidth').value);
        const height = parseInt(document.getElementById('canvasHeight').value);
        
        if (width < 1 || width > 128 || height < 1 || height > 128) {
            alert('Canvas size must be between 1 and 128 pixels');
            return;
        }
        
        if (confirm('Resize canvas? Current content may be lost.')) {
            this.savePixelState();
            
            const newArray = Array.from({length: height}, () => Array(width).fill(0));
            
            // Copy existing content
            const minWidth = Math.min(width, this.pixelState.canvasWidth);
            const minHeight = Math.min(height, this.pixelState.canvasHeight);
            
            for (let y = 0; y < minHeight; y++) {
                for (let x = 0; x < minWidth; x++) {
                    newArray[y][x] = this.pixelState.array[y][x];
                }
            }
            
            this.pixelState.canvasWidth = width;
            this.pixelState.canvasHeight = height;
            this.pixelState.array = newArray;
            
            this.renderPixelCanvas();
            this.pixelState.allSprites[this.pixelState.currentSpriteIndex] = this.pixelState.array.map(r => r.slice());
            this.saveToLocalStorage();
        }
    }

    // Sprite Management
    addNewSprite() {
        const newSprite = Array.from({length: this.pixelState.canvasHeight}, () => 
            Array(this.pixelState.canvasWidth).fill(0));
        this.pixelState.allSprites.push(newSprite);
        this.pixelState.currentSpriteIndex = this.pixelState.allSprites.length - 1;
        this.updateSpriteSelector();
        this.loadSprite(this.pixelState.currentSpriteIndex);
    }

    duplicateSprite() {
        const currentSprite = this.pixelState.array.map(r => r.slice());
        this.pixelState.allSprites.push(currentSprite);
        this.pixelState.currentSpriteIndex = this.pixelState.allSprites.length - 1;
        this.updateSpriteSelector();
        this.loadSprite(this.pixelState.currentSpriteIndex);
    }

    deleteSprite() {
        if (this.pixelState.allSprites.length <= 1) {
            alert('Cannot delete the last sprite');
            return;
        }
        
        if (confirm('Delete current sprite?')) {
            this.pixelState.allSprites.splice(this.pixelState.currentSpriteIndex, 1);
            this.pixelState.currentSpriteIndex = Math.min(this.pixelState.currentSpriteIndex, this.pixelState.allSprites.length - 1);
            this.updateSpriteSelector();
            this.loadSprite(this.pixelState.currentSpriteIndex);
        }
    }

    updateSpriteSelector() {
        if (!this.elements.spriteSelector) return;
        
        this.elements.spriteSelector.innerHTML = '';
        this.pixelState.allSprites.forEach((sprite, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Sprite ${index + 1}`;
            if (index === this.pixelState.currentSpriteIndex) {
                option.selected = true;
            }
            this.elements.spriteSelector.appendChild(option);
        });
    }

    loadSprite(index) {
        if (index < 0 || index >= this.pixelState.allSprites.length) return;
        
        this.pixelState.currentSpriteIndex = index;
        this.pixelState.array = this.pixelState.allSprites[index].map(r => r.slice());
        this.renderPixelCanvas();
        this.updateSpriteSelector();
        this.saveToLocalStorage();
    }

    // Export/Import Methods
    exportPNG() {
        let canvas, ctx;
        
        if (this.currentMode === 'pixel') {
            // Create export canvas for pixel art
            const scale = 10; // Scale up for export
            canvas = document.createElement('canvas');
            canvas.width = this.pixelState.canvasWidth * scale;
            canvas.height = this.pixelState.canvasHeight * scale;
            ctx = canvas.getContext('2d');
            
            // Disable image smoothing for crisp pixels
            ctx.imageSmoothingEnabled = false;
            
            for (let y = 0; y < this.pixelState.canvasHeight; y++) {
                for (let x = 0; x < this.pixelState.canvasWidth; x++) {
                    const colorIndex = this.pixelState.array[y][x];
                    const color = this.pixelState.colors[colorIndex];
                    if (color && color !== 'transparent') {
                        ctx.fillStyle = color;
                        ctx.fillRect(x * scale, y * scale, scale, scale);
                    }
                }
            }
        } else {
            // Create export canvas for sketch
            canvas = document.createElement('canvas');
            canvas.width = this.sketchState.canvas.width;
            canvas.height = this.sketchState.canvas.height;
            ctx = canvas.getContext('2d');
            
            // Composite all visible layers
            this.sketchState.layers.forEach(layer => {
                if (layer.visible) {
                    ctx.drawImage(layer.canvas, 0, 0);
                }
            });
        }
        
        // Download
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `jerry-${this.currentMode}-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    exportJSON() {
        const data = {
            version: '1.0',
            mode: this.currentMode,
            timestamp: Date.now(),
            pixelData: {
                colors: this.pixelState.colors,
                customTheme: this.pixelState.customTheme,
                allSprites: this.pixelState.allSprites,
                currentSpriteIndex: this.pixelState.currentSpriteIndex,
                canvasWidth: this.pixelState.canvasWidth,
                canvasHeight: this.pixelState.canvasHeight
            }
        };
        
        const jsonString = JSON.stringify(data, null, 2);
        const output = document.getElementById('output');
        if (output) {
            output.value = jsonString;
        }
        
        // Also download as file
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jerry-project-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importJSON(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.pixelData) {
                    this.pixelState.colors = data.pixelData.colors || this.palettes.default.slice();
                    this.pixelState.customTheme = data.pixelData.customTheme || Array(10).fill('#ffffff');
                    this.pixelState.allSprites = data.pixelData.allSprites || [Array.from({length: 16}, () => Array(16).fill(0))];
                    this.pixelState.currentSpriteIndex = data.pixelData.currentSpriteIndex || 0;
                    this.pixelState.canvasWidth = data.pixelData.canvasWidth || 16;
                    this.pixelState.canvasHeight = data.pixelData.canvasHeight || 16;
                    
                    this.pixelState.array = this.pixelState.allSprites[this.pixelState.currentSpriteIndex];
                    
                    // Update UI
                    document.getElementById('canvasWidth').value = this.pixelState.canvasWidth;
                    document.getElementById('canvasHeight').value = this.pixelState.canvasHeight;
                    
                    this.updateSpriteSelector();
                    this.updateColorDisplay();
                    this.renderPixelCanvas();
                    this.saveToLocalStorage();
                    
                    alert('Project imported successfully!');
                }
            } catch (error) {
                alert('Error importing file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    // Local Storage Methods
    saveToLocalStorage() {
        try {
            const data = {
                pixelState: this.pixelState,
                currentMode: this.currentMode
            };
            localStorage.setItem('jerryEditor', JSON.stringify(data));
        } catch (error) {
            console.warn('Could not save to localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('jerryEditor');
            if (saved) {
                const data = JSON.parse(saved);
                
                if (data.pixelState) {
                    Object.assign(this.pixelState, data.pixelState);
                    // Ensure we have valid arrays
                    if (!this.pixelState.allSprites || this.pixelState.allSprites.length === 0) {
                        this.pixelState.allSprites = [Array.from({length: this.pixelState.canvasHeight}, () => 
                            Array(this.pixelState.canvasWidth).fill(0))];
                    }
                    this.pixelState.array = this.pixelState.allSprites[this.pixelState.currentSpriteIndex] || this.pixelState.allSprites[0];
                }
                
                if (data.currentMode) {
                    this.currentMode = data.currentMode;
                }
            }
        } catch (error) {
            console.warn('Could not load from localStorage:', error);
            // Initialize with defaults
            this.initPixelMode();
        }
    }
}

// Initialize the editor when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.jerryEditor = new JerryEditor();
});

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
