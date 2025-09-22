    // =============================
    // Core State & Configuration
    // =============================
    const isLightMode = false;
    
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

    // State variables
    let currentTool = 'pencil';
    let colors = palettes.default;
    let customTheme = Array(10).fill('#ffffff');
    let primaryColor = 5; // black
    let secondaryColor = 1; // white
    let array = [];
    let canvasWidth = 16;
    let canvasHeight = 16;
    let undoStack = [];
    let redoStack = [];
    let allSprites = [];
    let currentSpriteIndex = 0;
    let zoomLevel = 1;
    let isPainting = false;
    let isRightClick = false;
    let gridVisible = true;
    let shapeStart = null;
    let previewArray = null;
    let moveStart = null;
    let moveOffset = { dx: 0, dy: 0 };
    let selectionStart = null;
    let selectionEnd = null;
    let selectionBounds = null;
    let selectionArray = null;
    let marchingAntsPhase = 0;
    setInterval(() => {
      marchingAntsPhase = (marchingAntsPhase + 1) % 2;
      if (selectionBounds) renderPreview(previewArray || array);
    }, 300); // every 300ms toggle

    // DOM elements
    const canvas = document.getElementById('canvas');
    const canvasGrid = document.getElementById('canvasGrid');
    const paletteSelector = document.getElementById('paletteSelector');
    const spriteSelector = document.getElementById('spriteSelector');
    const canvasInfo = document.getElementById('canvasInfo');
    const zoomIndicator = document.getElementById('zoomIndicator');
    const gridToggle = document.getElementById('gridToggle');

    // =============================
    // Tool System
    // =============================
    const tools = {
      pencil: {
        cursor: 'crosshair',
        onStart: (x, y) => paintCell(x, y, primaryColor),
        onDrag: (x, y) => paintCell(x, y, primaryColor),
        onRightClick: (x, y) => paintCell(x, y, secondaryColor)
      },
      eraser: {
        cursor: 'crosshair',
        onStart: (x, y) => paintCell(x, y, 0),
        onDrag: (x, y) => paintCell(x, y, 0)
      },
      eyedropper: {
        cursor: 'crosshair',
        onStart: (x, y) => {
          const color = array[y][x];
          primaryColor = color;
          updateColorDisplay();
          setTool('pencil');
        },
        onRightClick: (x, y) => {
          const color = array[y][x];
          secondaryColor = color;
          updateColorDisplay();
        }
      },
      fill: {
        cursor: 'crosshair',
        onStart: (x, y) => floodFill(x, y, primaryColor),
        onRightClick: (x, y) => floodFill(x, y, secondaryColor)
      }
    };

    // ------------------- SELECT TOOL -------------------
    tools.select = {
      cursor: 'crosshair',
      onStart: (x, y) => {
        selectionStart = { x, y };
        selectionEnd = { x, y };
        previewArray = array.map(row => row.slice());
      },
      onDrag: (x, y) => {
        if (!selectionStart) return;
    
        selectionEnd = { x, y };
        previewArray = array.map(row => row.slice());
    
        const x0 = Math.min(selectionStart.x, x);
        const x1 = Math.max(selectionStart.x, x);
        const y0 = Math.min(selectionStart.y, y);
        const y1 = Math.max(selectionStart.y, y);
    
        // draw border only
        for (let i = y0; i <= y1; i++) {
          for (let j = x0; j <= x1; j++) {
            if (i === y0 || i === y1 || j === x0 || j === x1) {
              previewArray[i][j] = -1; // marker for "selection border"
            }
          }
        }
    
        renderPreview(previewArray);
      },
      onEnd: (x, y) => {
        if (!selectionStart) return;
    
        const x0 = Math.min(selectionStart.x, x);
        const x1 = Math.max(selectionStart.x, x);
        const y0 = Math.min(selectionStart.y, y);
        const y1 = Math.max(selectionStart.y, y);
    
        selectionBounds = { x0, y0, x1, y1 };
    
        // Copy pixels into selection array
        selectionArray = [];
        for (let i = y0; i <= y1; i++) {
          selectionArray.push(array[i].slice(x0, x1 + 1));
        }
    
        selectionStart = null;
        previewArray = null;
      }
    };
    
    // ------------------- MOVE TOOL -------------------
    
    tools.move = {
  cursor: 'move',

  onStart: (x, y) => {
    // Use entire canvas if no selection
    if (!selectionBounds || !selectionArray) {
      selectionBounds = { x0: 0, y0: 0, x1: canvasWidth - 1, y1: canvasHeight - 1 };
      selectionArray = array.map(row => row.slice());
    }

    // Only start if clicked inside selection
    if (
      x >= selectionBounds.x0 && x <= selectionBounds.x1 &&
      y >= selectionBounds.y0 && y <= selectionBounds.y1
    ) {
      moveStart = { x, y };
      moveOffset = { dx: 0, dy: 0 };
    }
  },

  onDrag: (x, y) => {
    if (!moveStart || !selectionArray) return;

    moveOffset.dx = x - moveStart.x;
    moveOffset.dy = y - moveStart.y;

    // Copy canvas to preview
    previewArray = array.map(row => row.slice());

    // Paste selection at dragged position
    for (let i = 0; i < selectionArray.length; i++) {
      for (let j = 0; j < selectionArray[i].length; j++) {
        const ny = selectionBounds.y0 + moveOffset.dy + i;
        const nx = selectionBounds.x0 + moveOffset.dx + j;
        if (ny >= 0 && ny < canvasHeight && nx >= 0 && nx < canvasWidth) {
          previewArray[ny][nx] = selectionArray[i][j];
        }
      }
    }

    renderPreview(previewArray);
  },

  onEnd: (x, y) => {
    if (!moveStart || !selectionArray) return;

    const dx = moveOffset.dx;
    const dy = moveOffset.dy;

    // Move selection to new location
    for (let i = 0; i < selectionArray.length; i++) {
      for (let j = 0; j < selectionArray[i].length; j++) {
        const ny = selectionBounds.y0 + dy + i;
        const nx = selectionBounds.x0 + dx + j;
        if (ny >= 0 && ny < canvasHeight && nx >= 0 && nx < canvasWidth) {
          paintCell(nx, ny, selectionArray[i][j]);
        }
      }
    }

    // Clear original area
    for (let i = selectionBounds.y0; i <= selectionBounds.y1; i++) {
      for (let j = selectionBounds.x0; j <= selectionBounds.x1; j++) {
        if (i >= 0 && i < canvasHeight && j >= 0 && j < canvasWidth) {
          paintCell(j, i, null);
        }
      }
    }

    // Update selection bounds
    selectionBounds.x0 += dx;
    selectionBounds.x1 += dx;
    selectionBounds.y0 += dy;
    selectionBounds.y1 += dy;

    moveStart = null;
    moveOffset = { dx: 0, dy: 0 };
    previewArray = null;
    renderCanvas(); // refresh canvas fully
  }
};

    // ------------------- RECTANGLE TOOL -------------------
    tools.rect = {
      cursor: 'crosshair',
      onStart: (x, y) => {
        shapeStart = { x, y };
        previewArray = array.map(row => row.slice());
      },
      onDrag: (x, y) => {
        if (!shapeStart) return;
    
        previewArray = array.map(row => row.slice());
    
        const x0 = Math.min(shapeStart.x, x);
        const x1 = Math.max(shapeStart.x, x);
        const y0 = Math.min(shapeStart.y, y);
        const y1 = Math.max(shapeStart.y, y);
    
        for (let i = y0; i <= y1; i++) {
          for (let j = x0; j <= x1; j++) {
            previewArray[i][j] = primaryColor;
          }
        }
    
        renderPreview(previewArray);
      },
      onEnd: (x, y) => {
        if (!shapeStart) return;
    
        const x0 = Math.min(shapeStart.x, x);
        const x1 = Math.max(shapeStart.x, x);
        const y0 = Math.min(shapeStart.y, y);
        const y1 = Math.max(shapeStart.y, y);
    
        for (let i = y0; i <= y1; i++) {
          for (let j = x0; j <= x1; j++) {
            paintCell(j, i, primaryColor);
          }
        }
    
        shapeStart = null;
        previewArray = null;
      }
    };
    
    // ------------------- LINE TOOL -------------------
    tools.line = {
      cursor: 'crosshair',
      onStart: (x, y) => {
        shapeStart = { x, y };
        previewArray = array.map(row => row.slice());
      },
      onDrag: (x, y) => {
        if (!shapeStart) return;
    
        previewArray = array.map(row => row.slice());
    
        const x0 = shapeStart.x;
        const y0 = shapeStart.y;
        const dx = Math.abs(x - x0);
        const dy = Math.abs(y - y0);
        const sx = x0 < x ? 1 : -1;
        const sy = y0 < y ? 1 : -1;
        let err = dx - dy;
        let cx = x0;
        let cy = y0;
    
        while (true) {
          previewArray[cy][cx] = primaryColor;
          if (cx === x && cy === y) break;
          const e2 = 2 * err;
          if (e2 > -dy) { err -= dy; cx += sx; }
          if (e2 < dx) { err += dx; cy += sy; }
        }
    
        renderPreview(previewArray);
      },
      onEnd: (x, y) => {
        if (!shapeStart) return;
    
        const x0 = shapeStart.x;
        const y0 = shapeStart.y;
        const dx = Math.abs(x - x0);
        const dy = Math.abs(y - y0);
        const sx = x0 < x ? 1 : -1;
        const sy = y0 < y ? 1 : -1;
        let err = dx - dy;
        let cx = x0;
        let cy = y0;
    
        while (true) {
          paintCell(cx, cy, primaryColor);
          if (cx === x && cy === y) break;
          const e2 = 2 * err;
          if (e2 > -dy) { err -= dy; cx += sx; }
          if (e2 < dx) { err += dx; cy += sy; }
        }
    
        shapeStart = null;
        previewArray = null;
      }
    };
    
    // ------------------- CIRCLE/ELLIPSE TOOL -------------------
    tools.circle = {
      cursor: 'crosshair',
      onStart: (x, y) => {
        shapeStart = { x, y };
        previewArray = array.map(row => row.slice());
      },
      onDrag: (x, y) => {
        if (!shapeStart) return;
    
        previewArray = array.map(row => row.slice());
    
        const cx = Math.floor((shapeStart.x + x) / 2);
        const cy = Math.floor((shapeStart.y + y) / 2);
        const rx = Math.abs(x - shapeStart.x) / 2;
        const ry = Math.abs(y - shapeStart.y) / 2;
    
        for (let i = Math.floor(cy - ry); i <= Math.ceil(cy + ry); i++) {
          for (let j = Math.floor(cx - rx); j <= Math.ceil(cx + rx); j++) {
            if (j < 0 || j >= canvasWidth || i < 0 || i >= canvasHeight) continue;
            if (((j - cx) ** 2) / (rx ** 2) + ((i - cy) ** 2) / (ry ** 2) <= 1) {
              previewArray[i][j] = primaryColor;
            }
          }
        }
    
        renderPreview(previewArray);
      },
      onEnd: (x, y) => {
        if (!shapeStart) return;
    
        const cx = Math.floor((shapeStart.x + x) / 2);
        const cy = Math.floor((shapeStart.y + y) / 2);
        const rx = Math.abs(x - shapeStart.x) / 2;
        const ry = Math.abs(y - shapeStart.y) / 2;
    
        for (let i = Math.floor(cy - ry); i <= Math.ceil(cy + ry); i++) {
          for (let j = Math.floor(cx - rx); j <= Math.ceil(cx + rx); j++) {
            if (j < 0 || j >= canvasWidth || i < 0 || i >= canvasHeight) continue;
            if (((j - cx) ** 2) / (rx ** 2) + ((i - cy) ** 2) / (ry ** 2) <= 1) {
              paintCell(j, i, primaryColor);
            }
          }
        }
    
        shapeStart = null;
        previewArray = null;
      }
    };

    function setTool(toolName) {
      currentTool = toolName;
      document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tool === toolName);
      });
      canvas.style.cursor = tools[toolName]?.cursor || 'default';
      updateCanvasInfo();
    }

    // =============================
    // Canvas Management
    // =============================
    function initCanvas(width = 16, height = 16) {
      canvasWidth = width;
      canvasHeight = height;
      array = Array.from({length: canvasHeight}, () => Array(canvasWidth).fill(0));
      allSprites = [array.map(r => r.slice())];
      currentSpriteIndex = 0;
      updateSpriteSelector();
      renderCanvas();
      saveToLocalStorage();

      // Add a zoom handler
      canvas.parentElement.addEventListener('wheel', (e) => {
        e.preventDefault(); // prevent page scrolling
        
        const zoomStep = 0.1; // 10% per scroll
        if (e.deltaY < 0) {
            zoomLevel = Math.min(zoomLevel + zoomStep, 5); // max 500%
        } else {
            zoomLevel = Math.max(zoomLevel - zoomStep, 0.2); // min 20%
        }
        
        renderCanvas(); // re-render everything
      });
    }

    function renderCanvas() {
        const cellSize = Math.max(8, Math.floor(400 / Math.max(canvasWidth, canvasHeight)) * zoomLevel);
    
        canvas.innerHTML = '';
        canvasGrid.innerHTML = '';
    
        // Calculate canvas pixel dimensions
        const canvasPixelWidth = canvasWidth * cellSize;
        const canvasPixelHeight = canvasHeight * cellSize;
    
        // Set canvas size and grid layout
        canvas.style.width = `${canvasPixelWidth}px`;
        canvas.style.height = `${canvasPixelHeight}px`;
        canvas.style.gridTemplateColumns = `repeat(${canvasWidth}, ${cellSize}px)`;
        canvas.style.gridTemplateRows = `repeat(${canvasHeight}, ${cellSize}px)`;
    
        // Fill canvas with cells
        for (let y = 0; y < canvasHeight; y++) {
            for (let x = 0; x < canvasWidth; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.dataset.value = array[y][x];
                cell.style.width = `${cellSize}px`;
                cell.style.height = `${cellSize}px`;
                cell.style.background = colors[array[y][x]] || 'transparent';
    
                // Event listeners
                cell.addEventListener('mousedown', handleCellMouseDown);
                cell.addEventListener('mouseenter', handleCellMouseEnter);
                cell.addEventListener('mouseleave', handleCellMouseLeave);
                cell.addEventListener('mouseup', handleCellMouseUp);
                cell.addEventListener('contextmenu', e => e.preventDefault());
                cell.addEventListener('touchstart', handleCellTouchStart);
                cell.addEventListener('touchmove', handleCellTouchMove);
    
                canvas.appendChild(cell);
            }
        }
    
        // Update and align grid overlay
        canvasGrid.style.position = 'absolute';
        canvasGrid.style.top = canvas.offsetTop + 'px';
        canvasGrid.style.left = canvas.offsetLeft + 'px';
        canvasGrid.style.width = `${canvasPixelWidth}px`;
        canvasGrid.style.height = `${canvasPixelHeight}px`;
        canvasGrid.style.gridTemplateColumns = `repeat(${canvasWidth}, ${cellSize}px)`;
        canvasGrid.style.gridTemplateRows = `repeat(${canvasHeight}, ${cellSize}px)`;
        canvasGrid.style.pointerEvents = 'none';
    
        // Fill grid cells
        for (let y = 0; y < canvasHeight; y++) {
            for (let x = 0; x < canvasWidth; x++) {
                const gridCell = document.createElement('div');
                gridCell.className = 'grid-cell';
                gridCell.style.width = `${cellSize}px`;
                gridCell.style.height = `${cellSize}px`;
                canvasGrid.appendChild(gridCell);
            }
        }
    
        // Center canvas + grid inside wrapper
        const wrapper = canvas.parentElement;
        wrapper.style.display = 'flex';
        wrapper.style.justifyContent = 'center';
        wrapper.style.alignItems = 'center';
        wrapper.style.overflow = 'hidden';
    
        updateCanvasInfo();
        updateZoomIndicator();
    }




    function renderPreview(tempArray) {
      document.querySelectorAll('.cell').forEach(cell => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        const colorIndex = tempArray[y][x];
    
        if (colorIndex === -1) {
          cell.style.background = 'transparent';
          cell.style.outline = `1px dashed ${marchingAntsPhase ? '#000' : '#fff'}`;
        } else if (colorIndex === null) {
          cell.style.background = 'transparent';
          cell.style.outline = 'none';
        } else {
          cell.style.background = colors[colorIndex] || 'transparent';
          cell.style.outline = 'none';
        }
      });
    }

    // =============================
    // Event Handlers
    // =============================
    function handleCellMouseDown(e) {
      e.preventDefault();
      const x = parseInt(e.target.dataset.x);
      const y = parseInt(e.target.dataset.y);
      
      isRightClick = e.button === 2;
      isPainting = true;
      
      saveState();
      
      if (isRightClick && tools[currentTool].onRightClick) {
        tools[currentTool].onRightClick(x, y);
      } else if (tools[currentTool].onStart) {
        tools[currentTool].onStart(x, y);
      }
    }

    function handleCellMouseEnter(e) {
      const x = parseInt(e.target.dataset.x);
      const y = parseInt(e.target.dataset.y);
      
      // Show preview
      if (currentTool === 'pencil' || currentTool === 'eraser') {
        const previewColor = currentTool === 'eraser' ? 'transparent' : colors[primaryColor];
        e.target.style.boxShadow = `inset 0 0 0 2px ${previewColor === 'transparent' ? '#ff0000' : previewColor}`;
      }
      
      if (isPainting && tools[currentTool].onDrag) {
        tools[currentTool].onDrag(x, y);
      }
      
      updateCanvasInfo(x, y);
    }

    function handleCellMouseLeave(e) {
      e.target.style.boxShadow = '';
    }

    function handleCellMouseUp() {
      isPainting = false;
      isRightClick = false;
    }

    function handleCellTouchStart(e) {
      e.preventDefault();
      const x = parseInt(e.target.dataset.x);
      const y = parseInt(e.target.dataset.y);
      
      saveState();
      if (tools[currentTool].onStart) {
        tools[currentTool].onStart(x, y);
      }
    }

    function handleCellTouchMove(e) {
      e.preventDefault();
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (target && target.classList.contains('cell')) {
        const x = parseInt(target.dataset.x);
        const y = parseInt(target.dataset.y);
        
        if (tools[currentTool].onDrag) {
          tools[currentTool].onDrag(x, y);
        }
      }
    }

    // =============================
    // Drawing Functions
    // =============================
    function paintCell(x, y, colorIndex) {
      if (x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight) return;
      
      array[y][x] = colorIndex;
      const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
      if (cell) {
        cell.dataset.value = colorIndex;
        cell.style.background = colors[colorIndex] || 'transparent';
      }
      
      allSprites[currentSpriteIndex] = array.map(r => r.slice());
      saveToLocalStorage();
    }

    function floodFill(startX, startY, newColor) {
      const targetColor = array[startY][startX];
      if (targetColor === newColor) return;
      
      const stack = [[startX, startY]];
      const visited = new Set();
      
      while (stack.length > 0) {
        const [x, y] = stack.pop();
        const key = `${x},${y}`;
        
        if (visited.has(key) || x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight) continue;
        if (array[y][x] !== targetColor) continue;
        
        visited.add(key);
        paintCell(x, y, newColor);
        
        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
    }

    // =============================
    // State Management
    // =============================
    function saveState() {
      undoStack.push(array.map(r => r.slice()));
      if (undoStack.length > 50) undoStack.shift();
      redoStack = [];
    }

    function undo() {
      if (undoStack.length > 0) {
        redoStack.push(array.map(r => r.slice()));
        array = undoStack.pop();
        renderCanvas();
        allSprites[currentSpriteIndex] = array.map(r => r.slice());
        saveToLocalStorage();
      }
    }

    function redo() {
      if (redoStack.length > 0) {
        undoStack.push(array.map(r => r.slice()));
        array = redoStack.pop();
        renderCanvas();
        allSprites[currentSpriteIndex] = array.map(r => r.slice());
        saveToLocalStorage();
      }
    }

    // =============================
    // Color Management
    // =============================
    function renderSwatches() {
      const swatchesDiv = document.getElementById('swatches');
      swatchesDiv.innerHTML = '';
      
      colors.forEach((color, index) => {
        const swatch = document.createElement('div');
        swatch.className = 'swatch';
        if (index === primaryColor) swatch.classList.add('selected');
        swatch.style.background = color;
        swatch.addEventListener('click', (e) => {
          if (e.shiftKey) {
            secondaryColor = index;
          } else {
            primaryColor = index;
          }
          updateColorDisplay();
        });
        swatch.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          secondaryColor = index;
          updateColorDisplay();
        });
        swatchesDiv.appendChild(swatch);
      });
    }

    function updateColorDisplay() {
      document.getElementById('primaryColor').style.background = colors[primaryColor];
      document.getElementById('secondaryColor').style.background = colors[secondaryColor];
      renderSwatches();
      updateCanvasInfo();
    }

    function renderCustomPalettePickers() {
      const colorPickersDiv = document.getElementById('colorPickers');
      colorPickersDiv.innerHTML = '';
      
      for (let i = 0; i < 10; i++) {
        const input = document.createElement('input');
        input.type = 'color';
        input.value = customTheme[i] || '#ffffff';
        input.style.width = '24px';
        input.style.height = '24px';
        input.style.border = '2px solid #444';
        input.style.borderRadius = '3px';
        input.style.cursor = 'pointer';
        input.addEventListener('input', (e) => {
          customTheme[i] = e.target.value;
        });
        colorPickersDiv.appendChild(input);
      }
    }

    // =============================
    // Sprite Management
    // =============================
    function updateSpriteSelector() {
      spriteSelector.innerHTML = '';
      allSprites.forEach((_, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Sprite ${i + 1}`;
        spriteSelector.appendChild(opt);
      });
      spriteSelector.value = currentSpriteIndex;
    }

    function loadSprite(index) {
      if (!allSprites[index]) return;
      array = allSprites[index].map(r => r.slice());
      canvasHeight = array.length;
      canvasWidth = array[0].length;
      undoStack = [];
      redoStack = [];
      renderCanvas();
      currentSpriteIndex = index;
      document.getElementById('canvasWidth').value = canvasWidth;
      document.getElementById('canvasHeight').value = canvasHeight;
      saveToLocalStorage();
    }

    function addNewSprite() {
      const newSprite = Array.from({length: canvasHeight}, () => Array(canvasWidth).fill(0));
      allSprites.push(newSprite);
      updateSpriteSelector();
      loadSprite(allSprites.length - 1);
    }

    function duplicateSprite() {
      const duplicated = array.map(r => r.slice());
      allSprites.push(duplicated);
      updateSpriteSelector();
      loadSprite(allSprites.length - 1);
    }

    function deleteSprite() {
      if (allSprites.length <= 1) return;
      allSprites.splice(currentSpriteIndex, 1);
      if (currentSpriteIndex >= allSprites.length) {
        currentSpriteIndex = allSprites.length - 1;
      }
      updateSpriteSelector();
      loadSprite(currentSpriteIndex);
    }

    // =============================
    // Canvas Operations
    // =============================
    function resizeCanvas() {
      const newWidth = parseInt(document.getElementById('canvasWidth').value);
      const newHeight = parseInt(document.getElementById('canvasHeight').value);
      
      if (newWidth < 1 || newWidth > 128 || newHeight < 1 || newHeight > 128) {
        alert('Canvas size must be between 1x1 and 128x128');
        return;
      }
      
      saveState();
      
      const newArray = Array.from({length: newHeight}, () => Array(newWidth).fill(0));
      for (let y = 0; y < Math.min(newHeight, canvasHeight); y++) {
        for (let x = 0; x < Math.min(newWidth, canvasWidth); x++) {
          newArray[y][x] = array[y][x];
        }
      }
      
      array = newArray;
      canvasWidth = newWidth;
      canvasHeight = newHeight;
      allSprites[currentSpriteIndex] = array.map(r => r.slice());
      
      renderCanvas();
      saveToLocalStorage();
    }

    function clearCanvas() {
      if (confirm('Are you sure you want to clear the canvas?')) {
        saveState();
        array = Array.from({length: canvasHeight}, () => Array(canvasWidth).fill(0));
        allSprites[currentSpriteIndex] = array.map(r => r.slice());
        renderCanvas();
        saveToLocalStorage();
      }
    }

    gridToggle.addEventListener('change', () => {
      if (gridToggle.checked) {
        canvasGrid.style.display = 'grid';
      } else {
        canvasGrid.style.display = 'none';
      }
    });

    // =============================
    // Zoom Controls
    // =============================
    function zoomCanvas(factor) {
      zoomLevel = Math.max(0.25, Math.min(8, zoomLevel * factor));
      renderCanvas();
    }

    function resetZoom() {
      zoomLevel = 1;
      renderCanvas();
    }

    function updateZoomIndicator() {
      zoomIndicator.textContent = `${Math.round(zoomLevel * 100)}%`;
    }

    // =============================
    // UI Updates
    // =============================
    function updateCanvasInfo(x = null, y = null) {
      const pos = x !== null ? ` | ${x},${y}` : '';
      const color = colors[primaryColor] || 'transparent';
      canvasInfo.textContent = `${canvasWidth}×${canvasHeight} | ${currentTool}${pos} | ${color}`;
    }

    function updateCanvasColors() {
      document.querySelectorAll('.cell').forEach(cell => {
        const colorIndex = parseInt(cell.dataset.value);
        cell.style.background = colors[colorIndex] || 'transparent';
      });
    }

    // =============================
    // Export/Import
    // =============================
    function exportPNG() {
      const cellSize = Math.max(1, Math.floor(512 / Math.max(canvasWidth, canvasHeight)));
      const offCanvas = document.createElement('canvas');
      offCanvas.width = canvasWidth * cellSize;
      offCanvas.height = canvasHeight * cellSize;
      const ctx = offCanvas.getContext('2d');
      
      ctx.clearRect(0, 0, offCanvas.width, offCanvas.height);
      
      for (let y = 0; y < canvasHeight; y++) {
        for (let x = 0; x < canvasWidth; x++) {
          const color = colors[array[y][x]];
          if (color && color !== 'transparent') {
            ctx.fillStyle = color;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }
      }
      
      const link = document.createElement('a');
      link.download = `jerry-sprite-${Date.now()}.png`;
      link.href = offCanvas.toDataURL();
      link.click();
    }

    function exportJSON() {
      allSprites[currentSpriteIndex] = array.map(r => r.slice());
      
      const exportData = {
        sprite: {
          name: `Sprite ${currentSpriteIndex + 1}`,
          category: 'jerry',
          data: allSprites[currentSpriteIndex]
        }
      };
      
      if (paletteSelector.value === 'customTheme') {
        exportData.theme = {
          name: 'theme',
          data: colors
        };
      }
      
      const jsonStr = JSON.stringify(exportData, null, 2);
      document.getElementById('output').value = jsonStr;
      
      const blob = new Blob([jsonStr], {type: 'application/json'});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `jerry-sprite-${Date.now()}.json`;
      link.click();
    }

    function importJSON(file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          const importedData = JSON.parse(evt.target.result);
          
          if (importedData.sprite && Array.isArray(importedData.sprite.data)) {
            const spriteData = importedData.sprite.data.map(r => r.slice());
            allSprites.push(spriteData);
            updateSpriteSelector();
            loadSprite(allSprites.length - 1);
            
            if (importedData.theme && Array.isArray(importedData.theme.data)) {
              const themeName = importedData.theme.name || 'imported';
              palettes[themeName] = importedData.theme.data.slice();
              
              if (!document.querySelector(`option[value="${themeName}"]`)) {
                const opt = document.createElement('option');
                opt.value = themeName;
                opt.textContent = themeName;
                paletteSelector.appendChild(opt);
              }
              
              paletteSelector.value = themeName;
              colors = palettes[themeName].slice();
              customTheme = palettes[themeName].slice();
              updateColorDisplay();
              updateCanvasColors();
            }
          } else if (Array.isArray(importedData)) {
            if (Array.isArray(importedData[0]) && typeof importedData[0][0] === 'number') {
              allSprites.push(importedData.map(r => r.slice()));
              updateSpriteSelector();
              loadSprite(allSprites.length - 1);
            }
          }
          
          saveToLocalStorage();
        } catch (err) {
          alert('Invalid JSON file: ' + err.message);
        }
      };
      reader.readAsText(file);
    }

    // =============================
    // Local Storage
    // =============================
    function saveToLocalStorage() {
      localStorage.setItem('jerryEditor_sprites', JSON.stringify(allSprites));
      localStorage.setItem('jerryEditor_current', currentSpriteIndex);
      localStorage.setItem('jerryEditor_customTheme', JSON.stringify(customTheme));
      localStorage.setItem('jerryEditor_primaryColor', primaryColor);
      localStorage.setItem('jerryEditor_secondaryColor', secondaryColor);
    }

    function loadFromLocalStorage() {
      const savedSprites = localStorage.getItem('jerryEditor_sprites');
      const savedCustom = localStorage.getItem('jerryEditor_customTheme');
      const savedPrimary = localStorage.getItem('jerryEditor_primaryColor');
      const savedSecondary = localStorage.getItem('jerryEditor_secondaryColor');
      
      if (savedSprites) {
        allSprites = JSON.parse(savedSprites);
        currentSpriteIndex = parseInt(localStorage.getItem('jerryEditor_current') || 0);
        loadSprite(currentSpriteIndex);
        updateSpriteSelector();
      } else {
        initCanvas();
      }
      
      if (savedCustom) {
        customTheme = JSON.parse(savedCustom);
      }
      
      if (savedPrimary) primaryColor = parseInt(savedPrimary);
      if (savedSecondary) secondaryColor = parseInt(savedSecondary);
    }

    // =============================
    // Event Listeners
    // =============================
    
    // Tool selection
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', () => setTool(btn.dataset.tool));
    });

    // Panel collapse/expand
    document.querySelectorAll('.panel-header').forEach(header => {
      header.addEventListener('click', () => {
        const panel = header.parentElement;
        panel.classList.toggle('collapsed');
        const arrow = header.querySelector('span');
        arrow.textContent = panel.classList.contains('collapsed') ? '▶' : '▼';
      });
    });

    // Color selection
    document.getElementById('primaryColor').addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'color';
      input.value = colors[primaryColor];
      input.addEventListener('change', (e) => {
        colors[primaryColor] = e.target.value;
        updateColorDisplay();
        updateCanvasColors();
      });
      input.click();
    });

    document.getElementById('secondaryColor').addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'color';
      input.value = colors[secondaryColor];
      input.addEventListener('change', (e) => {
        colors[secondaryColor] = e.target.value;
        updateColorDisplay();
        updateCanvasColors();
      });
      input.click();
    });

    // Palette selection
    paletteSelector.addEventListener('change', () => {
      colors = palettes[paletteSelector.value].slice();
      primaryColor = Math.min(primaryColor, colors.length - 1);
      secondaryColor = Math.min(secondaryColor, colors.length - 1);
      updateColorDisplay();
      updateCanvasColors();
    });

    // Sprite management
    spriteSelector.addEventListener('change', () => {
      loadSprite(parseInt(spriteSelector.value));
    });

    // Button events
    document.getElementById('newProject').addEventListener('click', () => {
      if (confirm('Create new project? Unsaved changes will be lost.')) {
        initCanvas(16, 16);
      }
    });

    document.getElementById('saveProject').addEventListener('click', () => {
      exportJSON();
    });

    document.getElementById('exportPNG').addEventListener('click', exportPNG);
    document.getElementById('exportPNG2').addEventListener('click', exportPNG);
    document.getElementById('exportJSON').addEventListener('click', exportJSON);

    document.getElementById('newSprite').addEventListener('click', addNewSprite);
    document.getElementById('duplicateSprite').addEventListener('click', duplicateSprite);
    document.getElementById('deleteSprite').addEventListener('click', deleteSprite);

    document.getElementById('resizeCanvas').addEventListener('click', resizeCanvas);
    document.getElementById('clear').addEventListener('click', clearCanvas);

    document.getElementById('undo').addEventListener('click', undo);
    document.getElementById('redo').addEventListener('click', redo);

    document.getElementById('zoomIn').addEventListener('click', () => zoomCanvas(1.25));
    document.getElementById('zoomOut').addEventListener('click', () => zoomCanvas(0.8));
    document.getElementById('zoomReset').addEventListener('click', resetZoom);

    document.getElementById('saveCustomPalette').addEventListener('click', () => {
      colors = customTheme.slice();
      palettes['customTheme'] = customTheme.slice();
      
      if (!document.querySelector('option[value="customTheme"]')) {
        const opt = document.createElement('option');
        opt.value = 'customTheme';
        opt.textContent = 'Custom Theme';
        paletteSelector.appendChild(opt);
      }
      
      paletteSelector.value = 'customTheme';
      updateColorDisplay();
      updateCanvasColors();
      saveToLocalStorage();
    });

    document.getElementById('importFile').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) importJSON(file);
    });

    // Global event listeners
    document.addEventListener('mouseup', (e) => {
      if (tools[currentTool]?.onEnd) {
        const x = parseInt(e.target.dataset.x);
        const y = parseInt(e.target.dataset.y);
        if (!isNaN(x) && !isNaN(y)) tools[currentTool].onEnd(x, y);
      }
      isPainting = false;
      isRightClick = false;
    });

    function handleCellTouchEnd(e) {
      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target && target.classList.contains('cell') && tools[currentTool]?.onEnd) {
        const x = parseInt(target.dataset.x);
        const y = parseInt(target.dataset.y);
        tools[currentTool].onEnd(x, y);
      }
    }

    document.addEventListener('touchend', handleCellTouchEnd);

    document.addEventListener('contextmenu', (e) => {
      if (e.target.classList.contains('cell')) {
        e.preventDefault();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch(e.key.toLowerCase()) {
        case 'b': setTool('pencil'); break;
        case 'e': setTool('eraser'); break;
        case 'i': setTool('eyedropper'); break;
        case 'g': setTool('fill'); break;
        case 'm': setTool('select'); break;
        case 'v': setTool('move'); break;
        case 'l': setTool('line'); break;
        case 'r': setTool('rect'); break;
        case 'o': setTool('circle'); break;
        case 'z': 
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (e.shiftKey) redo(); else undo();
          }
          break;
        case 'y':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            redo();
          }
          break;
        case '+': 
        case '=': 
          zoomCanvas(1.25); 
          break;
        case '-': 
          zoomCanvas(0.8); 
          break;
        case '0':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            resetZoom();
          }
          break;
        case 'delete':
        case 'backspace':
          e.preventDefault();
          clearCanvas();
          break;
      }
      
      // Number keys for color selection
      const num = parseInt(e.key);
      if (num >= 0 && num <= 9 && num < colors.length) {
        if (e.shiftKey) {
          secondaryColor = num;
        } else {
          primaryColor = num;
        }
        updateColorDisplay();
      }
    });

    // =============================
    // Initialization
    // =============================
    function init() {
      // Setup palette selector
      for (let theme in palettes) {
        const opt = document.createElement('option');
        opt.value = theme;
        opt.textContent = theme.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        paletteSelector.appendChild(opt);
      }
      paletteSelector.value = 'default';

      // Load data
      loadFromLocalStorage();
      renderCustomPalettePickers();
      updateColorDisplay();
      renderCanvas();
      
      // Set initial tool
      setTool('pencil');
      
      console.log('Jerry Pixel Art Editor initialized!');
    }

    // Start the application
    init();

    // =============================
    // Service Worker Registration
    // =============================
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then(registration => {
            console.log("Service Worker registered with scope:", registration.scope);
          })
          .catch(err => {
            console.error("Service Worker registration failed:", err);
          });
      });
    }

