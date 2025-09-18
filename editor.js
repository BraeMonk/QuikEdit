// =============================
// Light/Dark Mode
// =============================
const isLightMode = true; // false = dark mode

// =============================
// Palettes
// =============================
const palettes = {
  default: isLightMode
    ? ['transparent','#FFF2E0','#FFE0B3','#FFD8A6','#FFCB88','#E6B273','#C4945E','#A9745B','#8B5E3C','#6B4226','#4A2B17']
    : ['transparent','#E0ECFA','#C2DAF7','#9CC7F0','#6FA6E0','#4A90E2','#2B6FB2','#1F5FBF','#173F80','#0D264D','#08162B'],
  candy: isLightMode
    ? ['transparent','#FF6B6B','#FFA94D','#FFD93D','#6BCB77','#4D96FF','#9D4EDD','#FF8FAB','#FFB5E8','#FFDEE9','#FFFFFF']
    : ['transparent','#FF8787','#FFB86B','#FFE066','#8CE99A','#74C0FC','#B197FC','#FF99C8','#FFB3DE','#FFC2E5','#F8F9FA'],
  retroPixel: isLightMode
    ? ['transparent','#FFFFFF','#FFD800','#FF8C00','#FF0000','#C000C0','#0000FF','#008080','#00C000','#404040','#000000']
    : ['transparent','#E0E0E0','#E0C000','#D07000','#C00000','#A000A0','#0000A0','#006060','#00A000','#303030','#000000'],
  ocean: isLightMode
    ? ['transparent','#A2D2FF','#80C0FF','#5AA9FA','#4682B4','#2E5984','#1B3B5F','#0F2A44','#082136','#041626','#000814']
    : ['transparent','#90C8F8','#66AEEF','#3D91E0','#2E6FA3','#1D4E72','#103552','#0A2438','#061C2B','#03111B','#000814'],
  ember: isLightMode
    ? ['transparent','#FFF3B0','#FFD93D','#FFA200','#FF6B35','#E63946','#B51709','#800F00','#4D0600','#260300','#0D0000']
    : ['transparent','#FFE066','#FFC300','#FF8C00','#FF5733','#C70039','#900C3F','#581845','#2C0B27','#160513','#0B0208'],
  meadow: isLightMode
    ? ['transparent','#E0F7E9','#B2F2BB','#8CE99A','#69DB7C','#38D9A9','#20C997','#12B886','#0CA678','#087F5B','#045040']
    : ['transparent','#C3F5D5','#96E6A8','#70D78B','#4CB372','#31A67F','#24916B','#1A7257','#115745','#0A3A2D','#041E16'],
  neon: isLightMode
    ? ['transparent','#FF00FF','#FF1493','#FF4500','#FFD700','#ADFF2F','#00FF7F','#00FFFF','#1E90FF','#8A2BE2','#FFFFFF']
    : ['transparent','#FF4DFF','#FF69B4','#FF6347','#FFE066','#C0FF66','#66FFB2','#66FFFF','#66A3FF','#B266FF','#F8F9FA'],
  pastel: isLightMode
    ? ['transparent','#FFB5E8','#FFDEB4','#FFF5BA','#B5EAD7','#C7CEEA','#E0BBE4','#FEC8D8','#D8E2DC','#F1F0C0','#FFFFFF']
    : ['transparent','#FF99CC','#FFCC99','#FFF2A8','#99E2C3','#A8B9E6','#C7A9D6','#F5A3C7','#CFCFCF','#EAE6B8','#F8F9FA'],
  gothic: isLightMode
    ? ['transparent','#1A1A1A','#2E2E2E','#444444','#5E2750','#87255B','#D90368','#FF6F61','#C9ADA7','#EAEAEA','#FFFFFF']
    : ['transparent','#000000','#1A1A1A','#333333','#5E2750','#7A1E48','#B30C5C','#FF4F5E','#A99A93','#D6D6D6','#F5F5F5'],
  aurora: isLightMode
    ? ['transparent','#A5FFD6','#82FFC7','#5DFDCB','#3EDBF0','#3B9AE1','#6F69AC','#9D4EDD','#FF5D8F','#FF87AB','#FFFFFF']
    : ['transparent','#7DFFBF','#5AF7B0','#32E1B5','#1EB7D8','#2070B0','#514080','#7A29C6','#FF4D7A','#FF6F9F','#F8F9FA'],
  fantasySprite: isLightMode
    ? ['transparent','#F0EAD6','#C2B280','#8E735B','#5C4B3B','#3B2F2F','#6B8E23','#4682B4','#9370DB','#FFD700','#000000']
    : ['transparent','#D8D2BE','#A89C6E','#6E5B45','#44362C','#2C2222','#556B2F','#36648B','#7A5DC7','#E6C200','#000000']

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
  saveToLocalStorage();
});

renderCustomPalettePickers();

// =============================
// Export / Import JSON (Updated for Jerry Upload)
// =============================
document.getElementById('exportJSON').addEventListener('click', ()=> {
  allSprites[currentSpriteIndex] = array.map(r => r.slice());

  const exportData = {
    sprite: {
      name: `Sprite ${currentSpriteIndex+1}`,
      category: 'jerry', // or let the user specify if you want
      data: allSprites[currentSpriteIndex]
    },
    theme: {
      name: paletteSelector.value === 'default' ? 'customTheme' : paletteSelector.value,
      data: colors
    }
  };

  const jsonStr = JSON.stringify(exportData, null, 2);
  document.getElementById('output').textContent = jsonStr;

  // Optional: download as file
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
