// =============================
// Light/Dark Mode
// =============================
const isLightMode = true; // false = dark mode

// =============================
// Palettes
// =============================
const palettes = {
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

// =============================
// State
// =============================
let colors = palettes.default;
let customTheme = ['transparent','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff'];
let array = [];
let canvasWidth = 16;
let canvasHeight = 16;
let selectedColor = 0;
let undoStack = [];
let redoStack = [];
let allSprites = [];
let currentSpriteIndex = 0;
let zoomLevel = 1;

const canvas = document.getElementById('canvas');
const paletteSelector = document.getElementById('paletteSelector');
const spriteSelector = document.getElementById('spriteSelector');
let isPainting = false;

// =============================
// Canvas Init + Storage
// =============================
function initCanvas(width=16, height=16){
  canvasWidth = width;
  canvasHeight = height;
  array = Array.from({length:canvasHeight},()=>Array(canvasWidth).fill(0));
  allSprites = [array.map(r=>r.slice())];
  currentSpriteIndex = 0;
  spriteSelector.innerHTML = '<option value="0">Sprite 1</option>';
  renderCanvas();
  saveToLocalStorage();
}

function saveToLocalStorage(){
  localStorage.setItem('spriteEditorSprites', JSON.stringify(allSprites));
  localStorage.setItem('spriteEditorCurrent', currentSpriteIndex);
  localStorage.setItem('spriteEditorCustomTheme', JSON.stringify(customTheme));
}

function loadFromLocalStorage(){
  const savedSprites = localStorage.getItem('spriteEditorSprites');
  const savedCustom = localStorage.getItem('spriteEditorCustomTheme');
  if(savedSprites){
    allSprites = JSON.parse(savedSprites);
    currentSpriteIndex = parseInt(localStorage.getItem('spriteEditorCurrent') || 0);
    loadSprite(currentSpriteIndex);
    spriteSelector.innerHTML = '';
    allSprites.forEach((_, i)=>{
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `Sprite ${i+1}`;
      spriteSelector.appendChild(opt);
    });
    spriteSelector.value = currentSpriteIndex;
  } else {
    initCanvas();
  }
  if(savedCustom){
    customTheme = JSON.parse(savedCustom);
  }
}

// =============================
// Swatches
// =============================
function renderSwatches(){
  const swatchesDiv = document.getElementById('swatches');
  swatchesDiv.innerHTML='';
  colors.forEach((color, index)=>{
    const swatch = document.createElement('div');
    swatch.className='swatch';
    if(index===selectedColor) swatch.classList.add('selected');
    swatch.style.background=color;
    swatch.addEventListener('click',()=>{ selectedColor=index; renderSwatches(); });
    swatchesDiv.appendChild(swatch);
  });
}

// =============================
// Painting & State
// =============================
function saveState(){
  undoStack.push(array.map(r=>r.slice()));
  if(undoStack.length>50) undoStack.shift();
  redoStack=[];
}

function paintCell(cell){
  saveState();
  const x = parseInt(cell.dataset.x);
  const y = parseInt(cell.dataset.y);
  array[y][x] = selectedColor;
  cell.dataset.value = selectedColor;
  cell.style.background = colors[selectedColor];
  allSprites[currentSpriteIndex] = array.map(r=>r.slice());
  saveToLocalStorage();
}

function renderCanvas(){
  canvas.innerHTML='';
  const cellSize = Math.floor(Math.min(480, window.innerWidth-20)/Math.max(canvasWidth, canvasHeight) * zoomLevel);
  canvas.style.gridTemplateColumns = `repeat(${canvasWidth}, ${cellSize}px)`;
  canvas.style.gridTemplateRows = `repeat(${canvasHeight}, ${cellSize}px)`;

  for(let y=0;y<canvasHeight;y++){
    for(let x=0;x<canvasWidth;x++){
      const cell = document.createElement('div');
      cell.className='cell';
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.dataset.value = array[y][x];
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;
      cell.style.background = colors[array[y][x]];

      cell.addEventListener('mousedown',()=>{ isPainting=true; paintCell(cell); });
      cell.addEventListener('mouseenter',()=>{ if(isPainting) paintCell(cell); });
      cell.addEventListener('mouseup',()=>{ isPainting=false; });

      cell.addEventListener('touchstart', (e)=>{ paintCell(cell); e.preventDefault(); });
      cell.addEventListener('touchmove', (e)=>{
        const t = e.touches[0];
        const target = document.elementFromPoint(t.clientX, t.clientY);
        if(target && target.classList.contains('cell')) paintCell(target);
        e.preventDefault();
      });

      canvas.appendChild(cell);
    }
  }

  renderSwatches();
    document.body.addEventListener('mouseup',()=>isPainting=false);
}

// Update canvas colors (e.g., when palette changes)
function updateCanvasColors(){
  document.querySelectorAll('.cell').forEach(cell=>{
    cell.style.background = colors[parseInt(cell.dataset.value)];
  });
}

// =============================
// Sprites
// =============================
function loadSprite(index){
  if(!allSprites[index]) return;
  array = allSprites[index].map(r=>r.slice());
  canvasHeight = array.length;
  canvasWidth = array[0].length;
  undoStack = [];
  redoStack = [];
  renderCanvas();
  currentSpriteIndex = index;
  saveToLocalStorage();
}

function addNewSprite(){
  const newSprite = Array.from({length:canvasHeight},()=>Array(canvasWidth).fill(0));
  allSprites.push(newSprite);
  const opt = document.createElement('option');
  opt.value = allSprites.length-1;
  opt.textContent = `Sprite ${allSprites.length}`;
  spriteSelector.appendChild(opt);
  spriteSelector.value = allSprites.length-1;
  loadSprite(allSprites.length-1);
}

// =============================
// Undo / Redo
// =============================
function undo(){
  if(undoStack.length){
    redoStack.push(array.map(r=>r.slice()));
    array = undoStack.pop();
    renderCanvas();
    allSprites[currentSpriteIndex] = array.map(r=>r.slice());
    saveToLocalStorage();
  }
}

function redo(){
  if(redoStack.length){
    undoStack.push(array.map(r=>r.slice()));
    array = redoStack.pop();
    renderCanvas();
    allSprites[currentSpriteIndex] = array.map(r=>r.slice());
    saveToLocalStorage();
  }
}

// =============================
// Resize Canvas
// =============================
function resizeCanvas() {
  // Temporarily disable painting intercepts
  let prevIsPainting = isPainting;
  isPainting = false;

  // Use prompt for width/height
  const w = parseInt(window.prompt("Enter new width:", canvasWidth));
  const h = parseInt(window.prompt("Enter new height:", canvasHeight));

  if (!w || !h) {
    isPainting = prevIsPainting;
    return;
  }

  // Create new array with new dimensions
  const newArray = Array.from({ length: h }, () => Array(w).fill(0));
  for (let y = 0; y < Math.min(h, canvasHeight); y++) {
    for (let x = 0; x < Math.min(w, canvasWidth); x++) {
      newArray[y][x] = array[y][x];
    }
  }

  array = newArray;
  canvasWidth = w;
  canvasHeight = h;
  allSprites[currentSpriteIndex] = array.map(r => r.slice());

  renderCanvas();
  saveToLocalStorage();

  // Restore painting state
  isPainting = prevIsPainting;
}

function exportPNG(){
  // Dynamically calculate cell size to fit within 512px max for width/height
  const maxDimension = 512;
  const cellSize = Math.floor(Math.min(maxDimension / canvasWidth, maxDimension / canvasHeight));

  const offCanvas = document.createElement('canvas');
  offCanvas.width = canvasWidth * cellSize;
  offCanvas.height = canvasHeight * cellSize;
  const ctx = offCanvas.getContext('2d');

  // Ensure fully transparent background
  ctx.clearRect(0, 0, offCanvas.width, offCanvas.height);

  for(let y=0; y<canvasHeight; y++){
    for(let x=0; x<canvasWidth; x++){
      const color = colors[array[y][x]];
      if(color !== 'transparent'){
        ctx.fillStyle = color;
        ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
      }
    }
  }

  const link = document.createElement('a');
  link.download = `sprite-${Date.now()}.png`;
  link.href = offCanvas.toDataURL();
  link.click();
}

// =============================
// Zoom
// =============================
function zoomCanvas(factor){
  zoomLevel = Math.max(0.25, Math.min(5, zoomLevel * factor));
  renderCanvas();
}

// =============================
// Custom Palette
// =============================
const colorPickersDiv = document.getElementById('colorPickers');

function renderCustomPalettePickers(){
  colorPickersDiv.innerHTML='';
  for(let i=0;i<10;i++){
    const input = document.createElement('input');
    input.type='color';
    input.value = customTheme[i] || '#ffffff';
    input.dataset.index = i;
    input.addEventListener('input', e=>{
      customTheme[i] = e.target.value;
    });
    colorPickersDiv.appendChild(input);
  }
}

document.getElementById('saveCustomPalette').addEventListener('click', ()=>{
  colors = customTheme.slice();
  renderSwatches();
  updateCanvasColors();

  // Add custom palette to palettes object
  palettes['customTheme'] = customTheme.slice();

  // Select it in the dropdown so export check passes
  paletteSelector.value = 'customTheme';

  saveToLocalStorage();
});

renderCustomPalettePickers();

// =============================
// Export / Import JSON (Updated for Jerry Upload)
// =============================
document.getElementById('exportJSON').addEventListener('click', () => {
  // Save the current sprite
  allSprites[currentSpriteIndex] = array.map(r => r.slice());

  // Base export with sprite only
  const exportData = {
    sprite: {
      name: `Sprite ${currentSpriteIndex + 1}`,
      category: 'jerry',
      data: allSprites[currentSpriteIndex]
    }
  };

  // Include theme under "theme" if the current palette is custom
  if (paletteSelector.value === 'customTheme') {
    exportData.theme = {
      name: 'theme', // exactly "theme"
      data: colors    // current custom palette colors
    };
  }

  // Convert to JSON string
  const jsonStr = JSON.stringify(exportData, null, 2);
  document.getElementById('output').textContent = jsonStr;

  // Trigger download
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `jerrySprite_${Date.now()}.json`;
  link.click();
});

// =============================
// Import JSON (Handles Sprite + Theme or Raw Arrays)
// =============================
document.getElementById('importFile').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      let importedData = JSON.parse(evt.target.result);

      // --- Case 1: New structured format ---
      if (importedData.sprite && Array.isArray(importedData.sprite.data)) {
        const spriteName = importedData.sprite.name || `Sprite ${allSprites.length+1}`;
        const spriteData = importedData.sprite.data.map(r => r.slice());

        // Add sprite to list
        allSprites.push(spriteData);
        const opt = document.createElement('option');
        opt.value = allSprites.length - 1;
        opt.textContent = spriteName;
        spriteSelector.appendChild(opt);

        // Load it immediately
        loadSprite(allSprites.length - 1);
        spriteSelector.value = allSprites.length - 1;

        // Add custom theme if present
        if (importedData.theme && Array.isArray(importedData.theme.data)) {
          const themeName = importedData.theme.name || 'Custom Theme';
          if (!palettes[themeName]) {
            palettes[themeName] = importedData.theme.data.slice();
            const themeOpt = document.createElement('option');
            themeOpt.value = themeName;
            themeOpt.textContent = themeName;
            paletteSelector.appendChild(themeOpt);
          }
          paletteSelector.value = themeName;
          colors = palettes[themeName].slice();
          customTheme = palettes[themeName].slice();
          renderSwatches();
          updateCanvasColors();
        }

      // --- Case 2: Raw array(s) ---
      } else if (Array.isArray(importedData)) {
        // Single sprite (2D array)
        if (Array.isArray(importedData[0]) && typeof importedData[0][0] === 'number') {
          allSprites.push(importedData.map(r => r.slice()));
        }
        // Multiple sprites (3D array)
        else {
          importedData.forEach(spr => {
            if (Array.isArray(spr) && Array.isArray(spr[0])) {
              allSprites.push(spr.map(r => r.slice()));
            }
          });
        }

        // Rebuild dropdown
        spriteSelector.innerHTML = '';
        allSprites.forEach((_, i) => {
          const opt = document.createElement('option');
          opt.value = i;
          opt.textContent = `Sprite ${i+1}`;
          spriteSelector.appendChild(opt);
        });
        loadSprite(allSprites.length - 1);
        spriteSelector.value = allSprites.length - 1;

      } else {
        throw new Error("Unsupported JSON format");
      }

      saveToLocalStorage();
    } catch (err) {
      alert('Invalid JSON file: ' + err.message);
    }
  };
  reader.readAsText(file);
});



// =============================
// Clear Canvas
// =============================
document.getElementById('clear').addEventListener('click', ()=>{
  saveState();
  array = Array.from({length:canvasHeight},()=>Array(canvasWidth).fill(0));
  allSprites[currentSpriteIndex] = array.map(r=>r.slice());
  renderCanvas();
  saveToLocalStorage();
});

// =============================
// Palette & Sprite Selectors
// =============================
for(let theme in palettes){
  const opt = document.createElement('option');
  opt.value = theme;
  opt.textContent = theme;
  paletteSelector.appendChild(opt);
}
paletteSelector.value='default';

paletteSelector.addEventListener('change', ()=>{
  colors = palettes[paletteSelector.value];
  selectedColor = 0;
  renderSwatches();
  updateCanvasColors();
});

spriteSelector.addEventListener('change', ()=>{
  loadSprite(parseInt(spriteSelector.value));
});

// =============================
// Button Events
// =============================
document.getElementById('newSprite').addEventListener('click', addNewSprite);
document.getElementById('resize').addEventListener('click', resizeCanvas);
document.getElementById('undo').addEventListener('click', undo);
document.getElementById('redo').addEventListener('click', redo);
document.getElementById('exportPNG').addEventListener('click', exportPNG);
document.getElementById('zoomIn').addEventListener('click', ()=>zoomCanvas(1.25));
document.getElementById('zoomOut').addEventListener('click', ()=>zoomCanvas(0.8));

// =============================
// Keyboard Shortcuts
// =============================
document.addEventListener('keydown', e=>{
  if(e.ctrlKey && e.key==='z') undo();
  else if(e.ctrlKey && e.key==='y') redo();
  else if(e.key==='Delete') document.getElementById('clear').click();
});

// =============================
// Init
// =============================
loadFromLocalStorage();
renderCanvas();
