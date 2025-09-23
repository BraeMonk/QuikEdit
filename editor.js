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
    let touchMoveStart = null;
    let moveOffset = { dx: 0, dy: 0 };
    let symmetryMode = 'none'; // 'none', 'horizontal', 'vertical', 'both'
    let symmetryAxis = { x: 8, y: 8 };
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

    // =============================
    // Symmetric Tools
    // =============================
    tools.symmetricPencil = {
        cursor: 'crosshair',
        onStart: (x, y) => paintWithSymmetry(x, y, primaryColor),
        onDrag: (x, y) => paintWithSymmetry(x, y, primaryColor),
        onRightClick: (x, y) => paintWithSymmetry(x, y, secondaryColor)
    };
    
    tools.symmetricEraser = {
        cursor: 'crosshair',
        onStart: (x, y) => paintWithSymmetry(x, y, 0),
        onDrag: (x, y) => paintWithSymmetry(x, y, 0)
    };
    
    tools.symmetricFill = {
        cursor: 'crosshair',
        onStart: (x, y) => {
            floodFill(x, y, primaryColor);
            if (symmetryMode !== 'none') {
                if (symmetryMode === 'horizontal' || symmetryMode === 'both') {
                    const mirrorY = symmetryAxis.y * 2 - y;
                    if (mirrorY >= 0 && mirrorY < canvasHeight && mirrorY !== y) {
                        floodFill(x, mirrorY, primaryColor);
                    }
                }
                if (symmetryMode === 'vertical' || symmetryMode === 'both') {
                    const mirrorX = symmetryAxis.x * 2 - x;
                    if (mirrorX >= 0 && mirrorX < canvasWidth && mirrorX !== x) {
                        floodFill(mirrorX, y, primaryColor);
                    }
                }
                if (symmetryMode === 'both') {
                    const mirrorX = symmetryAxis.x * 2 - x;
                    const mirrorY = symmetryAxis.y * 2 - y;
                    if (mirrorX >= 0 && mirrorX < canvasWidth && 
                        mirrorY >= 0 && mirrorY < canvasHeight && 
                        (mirrorX !== x || mirrorY !== y)) {
                        floodFill(mirrorX, mirrorY, primaryColor);
                    }
                }
            }
        },
        onRightClick: (x, y) => {
            floodFill(x, y, secondaryColor);
            if (symmetryMode !== 'none') {
                if (symmetryMode === 'horizontal' || symmetryMode === 'both') {
                    const mirrorY = symmetryAxis.y * 2 - y;
                    if (mirrorY >= 0 && mirrorY < canvasHeight && mirrorY !== y) {
                        floodFill(x, mirrorY, secondaryColor);
                    }
                }
                if (symmetryMode === 'vertical' || symmetryMode === 'both') {
                    const mirrorX = symmetryAxis.x * 2 - x;
                    if (mirrorX >= 0 && mirrorX < canvasWidth && mirrorX !== x) {
                        floodFill(mirrorX, y, secondaryColor);
                    }
                }
                if (symmetryMode === 'both') {
                    const mirrorX = symmetryAxis.x * 2 - x;
                    const mirrorY = symmetryAxis.y * 2 - y;
                    if (mirrorX >= 0 && mirrorX < canvasWidth && 
                        mirrorY >= 0 && mirrorY < canvasHeight && 
                        (mirrorX !== x || mirrorY !== y)) {
                        floodFill(mirrorX, mirrorY, secondaryColor);
                    }
                }
            }
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
            if (selectionBounds && selectionArray) {
                // Check if click is inside selection bounds
                if (x >= selectionBounds.x0 && x <= selectionBounds.x1 &&
                    y >= selectionBounds.y0 && y <= selectionBounds.y1) {
                    moveStart = { x, y };
                    moveOffset = { dx: 0, dy: 0 };
                    
                    // Create preview array with selection area cleared
                    previewArray = array.map(row => row.slice());
                    
                    // Clear the selection area in preview
                    for (let i = selectionBounds.y0; i <= selectionBounds.y1; i++) {
                        for (let j = selectionBounds.x0; j <= selectionBounds.x1; j++) {
                            previewArray[i][j] = 0; // Clear to transparent/background
                        }
                    }
                    return;
                }
            }
            
            // If no selection or click outside selection, deselect
            selectionBounds = null;
            selectionArray = null;
            previewArray = null;
            renderCanvas();
        },
    
        onDrag: (x, y) => {
            if (!moveStart || !selectionBounds || !selectionArray) return;
    
            const dx = x - moveStart.x;
            const dy = y - moveStart.y;
            
            // Update move offset
            moveOffset = { dx, dy };
    
            // Create fresh preview with original array but selection cleared
            previewArray = array.map(row => row.slice());
            
            // Clear original selection area
            for (let i = selectionBounds.y0; i <= selectionBounds.y1; i++) {
                for (let j = selectionBounds.x0; j <= selectionBounds.x1; j++) {
                    previewArray[i][j] = 0; // Clear to background
                }
            }
    
            // Draw selection at new position
            for (let i = 0; i < selectionArray.length; i++) {
                for (let j = 0; j < selectionArray[i].length; j++) {
                    const newY = selectionBounds.y0 + dy + i;
                    const newX = selectionBounds.x0 + dx + j;
                    
                    // Only draw if within canvas bounds and pixel is not transparent
                    if (newY >= 0 && newY < canvasHeight && 
                        newX >= 0 && newX < canvasWidth && 
                        selectionArray[i][j] !== 0) {
                        previewArray[newY][newX] = selectionArray[i][j];
                    }
                }
            }
    
            renderPreview(previewArray);
        },
    
        onEnd: (x, y) => {
            if (!moveStart || !selectionBounds || !selectionArray) return;
    
            const dx = x - moveStart.x;
            const dy = y - moveStart.y;
    
            // Apply the move to the actual array
            // First clear the original selection area
            for (let i = selectionBounds.y0; i <= selectionBounds.y1; i++) {
                for (let j = selectionBounds.x0; j <= selectionBounds.x1; j++) {
                    paintCell(j, i, 0);
                }
            }
    
            // Then place selection at new position
            for (let i = 0; i < selectionArray.length; i++) {
                for (let j = 0; j < selectionArray[i].length; j++) {
                    const newY = selectionBounds.y0 + dy + i;
                    const newX = selectionBounds.x0 + dx + j;
                    
                    if (newY >= 0 && newY < canvasHeight && 
                        newX >= 0 && newX < canvasWidth && 
                        selectionArray[i][j] !== 0) {
                        paintCell(newX, newY, selectionArray[i][j]);
                    }
                }
            }
    
            // Update selection bounds
            selectionBounds.x0 += dx;
            selectionBounds.x1 += dx;
            selectionBounds.y0 += dy;
            selectionBounds.y1 += dy;
    
            // Keep selection active for potential additional moves
            moveStart = null;
            moveOffset = { dx: 0, dy: 0 };
            previewArray = null;
            renderCanvas();
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
                cell.addEventListener('touchstart', handleCellTouchStart, { passive: false });
                cell.addEventListener('touchmove', handleCellTouchMove, { passive: false });
                cell.addEventListener('touchend', handleCellTouchEnd, { passive: false });
    
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
        renderSymmetryGuides();
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

    // =============================
    // Extra Touch Handlers
    // =============================

    function handleCellTouchStart(e) {
      e.preventDefault();
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);

      if (target && target.classList.contains('cell')) {
        const x = parseInt(target.dataset.x);
        const y = parseInt(target.dataset.y);

        isPainting = true;
        saveState();

        if (currentTool === 'move') {
          // record both cell + pixel start
          touchMoveStart = { clientX: touch.clientX, clientY: touch.clientY, x, y };
        }

        if (tools[currentTool].onStart) {
          tools[currentTool].onStart(x, y);
        }
      }
    }

    function handleCellTouchMove(e) {
      e.preventDefault();
      if (!isPainting) return;

      const touch = e.touches[0];

      if (currentTool === 'move' && touchMoveStart) {
        // compute pixel deltas → convert to cell deltas
        const dxPixels = touch.clientX - touchMoveStart.clientX;
        const dyPixels = touch.clientY - touchMoveStart.clientY;
        const dxCells = Math.round(dxPixels / cellSize);
        const dyCells = Math.round(dyPixels / cellSize);

        tools.move.onDrag(touchMoveStart.x, touchMoveStart.y, dxCells, dyCells);
        return;
      }

      // --- fallback for paint/shape tools (still cell-based) ---
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target && target.classList.contains('cell')) {
        const x = parseInt(target.dataset.x);
        const y = parseInt(target.dataset.y);

        if (tools[currentTool].onDrag) {
          tools[currentTool].onDrag(x, y);
        }
      }
    }

    function handleCellTouchEnd(e) {
      e.preventDefault();
      isPainting = false;

      const touch = e.changedTouches[0];

      if (currentTool === 'move' && touchMoveStart) {
        const dxPixels = touch.clientX - touchMoveStart.clientX;
        const dyPixels = touch.clientY - touchMoveStart.clientY;
        const dxCells = Math.round(dxPixels / cellSize);
        const dyCells = Math.round(dyPixels / cellSize);

        tools.move.onEnd(touchMoveStart.x, touchMoveStart.y, dxCells, dyCells);
        touchMoveStart = null;
        return;
      }

      // --- fallback for paint/shape tools ---
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target && target.classList.contains('cell')) {
        const x = parseInt(target.dataset.x);
        const y = parseInt(target.dataset.y);

        if (tools[currentTool].onEnd) {
          tools[currentTool].onEnd(x, y);
        }
      }
    }

    // =============================
    // Transform Functions
    // =============================
    function rotateSelection(degrees) {
        if (!selectionBounds || !selectionArray) {
            alert('Please select an area first');
            return;
        }
        
        saveState();
        
        const width = selectionArray[0].length;
        const height = selectionArray.length;
        let rotatedArray;
        
        switch (degrees) {
            case 90:
                // Rotate 90 degrees clockwise
                rotatedArray = Array(width).fill().map(() => Array(height).fill(0));
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        rotatedArray[x][height - 1 - y] = selectionArray[y][x];
                    }
                }
                break;
            case 180:
                // Rotate 180 degrees
                rotatedArray = Array(height).fill().map(() => Array(width).fill(0));
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        rotatedArray[height - 1 - y][width - 1 - x] = selectionArray[y][x];
                    }
                }
                break;
            case 270:
                // Rotate 270 degrees clockwise (90 counterclockwise)
                rotatedArray = Array(width).fill().map(() => Array(height).fill(0));
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        rotatedArray[width - 1 - x][y] = selectionArray[y][x];
                    }
                }
                break;
            default:
                return;
        }
        
        // Clear original selection
        for (let i = selectionBounds.y0; i <= selectionBounds.y1; i++) {
            for (let j = selectionBounds.x0; j <= selectionBounds.x1; j++) {
                paintCell(j, i, 0);
            }
        }
        
        // Place rotated selection back
        selectionArray = rotatedArray;
        const newHeight = rotatedArray.length;
        const newWidth = rotatedArray[0].length;
        
        // Update bounds (center the rotated selection)
        const centerX = (selectionBounds.x0 + selectionBounds.x1) / 2;
        const centerY = (selectionBounds.y0 + selectionBounds.y1) / 2;
        
        selectionBounds.x0 = Math.floor(centerX - newWidth / 2);
        selectionBounds.x1 = selectionBounds.x0 + newWidth - 1;
        selectionBounds.y0 = Math.floor(centerY - newHeight / 2);
        selectionBounds.y1 = selectionBounds.y0 + newHeight - 1;
        
        // Draw rotated selection
        for (let i = 0; i < newHeight; i++) {
            for (let j = 0; j < newWidth; j++) {
                const x = selectionBounds.x0 + j;
                const y = selectionBounds.y0 + i;
                if (x >= 0 && x < canvasWidth && y >= 0 && y < canvasHeight && rotatedArray[i][j] !== 0) {
                    paintCell(x, y, rotatedArray[i][j]);
                }
            }
        }
    }
    
    function flipSelection(direction) {
        if (!selectionBounds || !selectionArray) {
            alert('Please select an area first');
            return;
        }
        
        saveState();
        
        const width = selectionArray[0].length;
        const height = selectionArray.length;
        const flippedArray = Array(height).fill().map(() => Array(width).fill(0));
        
        if (direction === 'horizontal') {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    flippedArray[y][width - 1 - x] = selectionArray[y][x];
                }
            }
        } else if (direction === 'vertical') {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    flippedArray[height - 1 - y][x] = selectionArray[y][x];
                }
            }
        }
        
        // Clear original selection
        for (let i = selectionBounds.y0; i <= selectionBounds.y1; i++) {
            for (let j = selectionBounds.x0; j <= selectionBounds.x1; j++) {
                paintCell(j, i, 0);
            }
        }
        
        // Place flipped selection back
        selectionArray = flippedArray;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const x = selectionBounds.x0 + j;
                const y = selectionBounds.y0 + i;
                if (x >= 0 && x < canvasWidth && y >= 0 && y < canvasHeight && flippedArray[i][j] !== 0) {
                    paintCell(x, y, flippedArray[i][j]);
                }
            }
        }
    }

    // =============================
    // Symmetrical Drawing
    // =============================
    function setSymmetryMode(mode) {
        symmetryMode = mode;
        // Update symmetry axis to canvas center
        symmetryAxis.x = Math.floor(canvasWidth / 2);
        symmetryAxis.y = Math.floor(canvasHeight / 2);
        
        // Update UI
        document.querySelectorAll('.symmetry-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.symmetry === mode);
        });
        
        updateCanvasInfo();
        renderSymmetryGuides();
    }
    
    function renderSymmetryGuides() {
        // Remove existing guides
        document.querySelectorAll('.symmetry-guide').forEach(guide => guide.remove());
        
        if (symmetryMode === 'none') return;
        
        const canvasRect = canvas.getBoundingClientRect();
        const cellSize = Math.max(8, Math.floor(400 / Math.max(canvasWidth, canvasHeight)) * zoomLevel);
        
        if (symmetryMode === 'horizontal' || symmetryMode === 'both') {
            const guide = document.createElement('div');
            guide.className = 'symmetry-guide horizontal';
            guide.style.position = 'absolute';
            guide.style.left = '0';
            guide.style.right = '0';
            guide.style.top = (symmetryAxis.y * cellSize) + 'px';
            guide.style.height = '1px';
            guide.style.backgroundColor = '#ff00ff';
            guide.style.pointerEvents = 'none';
            guide.style.zIndex = '10';
            canvas.parentElement.appendChild(guide);
        }
        
        if (symmetryMode === 'vertical' || symmetryMode === 'both') {
            const guide = document.createElement('div');
            guide.className = 'symmetry-guide vertical';
            guide.style.position = 'absolute';
            guide.style.top = '0';
            guide.style.bottom = '0';
            guide.style.left = (symmetryAxis.x * cellSize) + 'px';
            guide.style.width = '1px';
            guide.style.backgroundColor = '#ff00ff';
            guide.style.pointerEvents = 'none';
            guide.style.zIndex = '10';
            canvas.parentElement.appendChild(guide);
        }
    }
    
    function paintWithSymmetry(x, y, colorIndex) {
        // Paint the original point
        paintCell(x, y, colorIndex);
        
        if (symmetryMode === 'none') return;
        
        if (symmetryMode === 'horizontal' || symmetryMode === 'both') {
            const mirrorY = symmetryAxis.y * 2 - y;
            if (mirrorY >= 0 && mirrorY < canvasHeight && mirrorY !== y) {
                paintCell(x, mirrorY, colorIndex);
            }
        }
        
        if (symmetryMode === 'vertical' || symmetryMode === 'both') {
            const mirrorX = symmetryAxis.x * 2 - x;
            if (mirrorX >= 0 && mirrorX < canvasWidth && mirrorX !== x) {
                paintCell(mirrorX, y, colorIndex);
            }
        }
        
        if (symmetryMode === 'both') {
            const mirrorX = symmetryAxis.x * 2 - x;
            const mirrorY = symmetryAxis.y * 2 - y;
            if (mirrorX >= 0 && mirrorX < canvasWidth && 
                mirrorY >= 0 && mirrorY < canvasHeight && 
                (mirrorX !== x || mirrorY !== y)) {
                paintCell(mirrorX, mirrorY, colorIndex);
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
      
      // Show if using symmetric tool
      const isSymmetricTool = currentTool.startsWith('symmetric');
      const toolDisplay = isSymmetricTool ? currentTool.replace('symmetric', '') + ' (Symmetric)' : currentTool;
      
      // Show symmetry mode when using symmetric tools or when symmetry mode is active
      const symmetryInfo = (isSymmetricTool && symmetryMode !== 'none') ? ` | Mode: ${symmetryMode}` : '';
      
      canvasInfo.textContent = `${canvasWidth}×${canvasHeight} | ${toolDisplay}${pos} | ${color}${symmetryInfo}`;
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

    // Transform buttons
    document.getElementById('rotateLeft').addEventListener('click', () => rotateSelection(270));
    document.getElementById('rotate180').addEventListener('click', () => rotateSelection(180));
    document.getElementById('rotateRight').addEventListener('click', () => rotateSelection(90));
    document.getElementById('flipHorizontal').addEventListener('click', () => flipSelection('horizontal'));
    document.getElementById('flipVertical').addEventListener('click', () => flipSelection('vertical'));
    
    // Symmetry buttons
    document.querySelectorAll('.symmetry-btn').forEach(btn => {
      btn.addEventListener('click', () => setSymmetryMode(btn.dataset.symmetry));
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
        // Regular tools
        case 'b': 
          if (e.shiftKey) {
            setTool('symmetricPencil');
          } else {
            setTool('pencil');
          }
          break;
        case 'e': 
          if (e.shiftKey) {
            setTool('symmetricEraser');
          } else {
            setTool('eraser');
          }
          break;
        case 'g': 
          if (e.shiftKey) {
            setTool('symmetricFill');
          } else {
            setTool('fill');
          }
          break;
        case 'i': setTool('eyedropper'); break;
        case 'm': setTool('select'); break;
        case 'v': setTool('move'); break;
        case 'l': setTool('line'); break;
        case 'r': setTool('rect'); break;
        case 'o': setTool('circle'); break;
        
        // Symmetry modes
        case 'q': setSymmetryMode('none'); break;
        case 'w': setSymmetryMode('horizontal'); break;
        case 'a': setSymmetryMode('vertical'); break;
        case 's': setSymmetryMode('both'); break;
        
        // Transform operations
        case '[': rotateSelection(270); break; // Rotate left
        case ']': rotateSelection(90); break;  // Rotate right
        case 'h': 
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            flipSelection('horizontal');
          }
          break;
        case 'j':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            flipSelection('vertical');
          }
          break;
        
        // Undo/Redo
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
        
        // Zoom
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
        
        // Clear
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

