// ----------------------------
// Light/Dark mode toggle
// ----------------------------
const isLightMode = true; // set false for dark

// ----------------------------
// Palettes (inline arrays)
// ----------------------------
const palettes = {
  default: isLightMode
    ? [
        'transparent',
        '#FFF2E0', '#FFE0B3', '#FFD8A6',
        '#FFCB88', '#E6B273', '#C4945E',
        '#A9745B', '#8B5E3C', '#6B4226', '#4A2B17'
      ]
    : [
        'transparent',
        '#E0ECFA', '#C2DAF7', '#9CC7F0',
        '#6FA6E0', '#4A90E2', '#2B6FB2',
        '#1F5FBF', '#173F80', '#0D264D', '#08162B'
      ],
  candy: isLightMode
    ? [
        'transparent',
        '#FF6B6B', '#FFA94D', '#FFD93D',
        '#6BCB77', '#4D96FF', '#9D4EDD',
        '#FF8FAB', '#FFB5E8', '#FFDEE9', '#FFFFFF'
      ]
    : [
        'transparent',
        '#FF8787', '#FFB86B', '#FFE066',
        '#8CE99A', '#74C0FC', '#B197FC',
        '#FF99C8', '#FFB3DE', '#FFC2E5', '#F8F9FA'
      ],
  desert: isLightMode
    ? [
        'transparent',
        '#F4E1D2', '#E2B07E', '#D89C5C',
        '#C97B3D', '#A0522D', '#8B5E3C',
        '#6B4226', '#4B2E1F', '#2E1A12', '#000000'
      ]
    : [
        'transparent',
        '#E6CBB3', '#D4A373', '#BF8040',
        '#A0522D', '#7B4B24', '#5C3720',
        '#3E2414', '#24140D', '#120A06', '#000000'
      ],
  ocean: isLightMode
    ? [
        'transparent',
        '#A2D2FF', '#80C0FF', '#5AA9FA',
        '#4682B4', '#2E5984', '#1B3B5F',
        '#0F2A44', '#082136', '#041626', '#000814'
      ]
    : [
        'transparent',
        '#90C8F8', '#66AEEF', '#3D91E0',
        '#2E6FA3', '#1D4E72', '#103552',
        '#0A2438', '#061C2B', '#03111B', '#000814'
      ],
  ember: isLightMode
    ? [
        'transparent',
        '#FFF3B0', '#FFD93D', '#FFA200',
        '#FF6B35', '#E63946', '#B51709',
        '#800F00', '#4D0600', '#260300', '#0D0000'
      ]
    : [
        'transparent',
        '#FFE066', '#FFC300', '#FF8C00',
        '#FF5733', '#C70039', '#900C3F',
        '#581845', '#2C0B27', '#160513', '#0B0208'
      ],
  meadow: isLightMode
    ? [
        'transparent',
        '#E0F7E9', '#B2F2BB', '#8CE99A',
        '#69DB7C', '#38D9A9', '#20C997',
        '#12B886', '#0CA678', '#087F5B', '#045040'
      ]
    : [
        'transparent',
        '#C3F5D5', '#96E6A8', '#70D78B',
        '#4CB372', '#31A67F', '#24916B',
        '#1A7257', '#115745', '#0A3A2D', '#041E16'
      ],
  neon: isLightMode
    ? [
        'transparent',
        '#FF00FF', '#FF1493', '#FF4500',
        '#FFD700', '#ADFF2F', '#00FF7F',
        '#00FFFF', '#1E90FF', '#8A2BE2', '#FFFFFF'
      ]
    : [
        'transparent',
        '#FF4DFF', '#FF69B4', '#FF6347',
        '#FFE066', '#C0FF66', '#66FFB2',
        '#66FFFF', '#66A3FF', '#B266FF', '#F8F9FA'
      ],
  pastel: isLightMode
    ? [
        'transparent',
        '#FFB5E8', '#FFDEB4', '#FFF5BA',
        '#B5EAD7', '#C7CEEA', '#E0BBE4',
        '#FEC8D8', '#D8E2DC', '#F1F0C0', '#FFFFFF'
      ]
    : [
        'transparent',
        '#FF99CC', '#FFCC99', '#FFF2A8',
        '#99E2C3', '#A8B9E6', '#C7A9D6',
        '#F5A3C7', '#CFCFCF', '#EAE6B8', '#F8F9FA'
      ],
  gothic: isLightMode
    ? [
        'transparent',
        '#1A1A1A', '#2E2E2E', '#444444',
        '#5E2750', '#87255B', '#D90368',
        '#FF6F61', '#C9ADA7', '#EAEAEA', '#FFFFFF'
      ]
    : [
        'transparent',
        '#000000', '#1A1A1A', '#333333',
        '#5E2750', '#7A1E48', '#B30C5C',
        '#FF4F5E', '#A99A93', '#D6D6D6', '#F5F5F5'
      ],
  aurora: isLightMode
    ? [
        'transparent',
        '#A5FFD6', '#82FFC7', '#5DFDCB',
        '#3EDBF0', '#3B9AE1', '#6F69AC',
        '#9D4EDD', '#FF5D8F', '#FF87AB', '#FFFFFF'
      ]
    : [
        'transparent',
        '#7DFFBF', '#5AF7B0', '#32E1B5',
        '#1EB7D8', '#2070B0', '#514080',
        '#7A29C6', '#FF4D7A', '#FF6F9F', '#F8F9FA'
      ],
  clay: isLightMode
    ? [
        'transparent',
        '#F5E0C0', '#E0C097', '#CC9B6D',
        '#B0724A', '#8C4A2F', '#6E3923',
        '#4E2817', '#321B10', '#1A0D08', '#000000'
      ]
    : [
        'transparent',
        '#EAD2B0', '#D1A374', '#B97849',
        '#8E5432', '#6B3C24', '#502C1A',
        '#361E12', '#22120B', '#120805', '#000000'
      ],
};

// ----------------------------
// State
// ----------------------------
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

const canvas = document.getElementById('canvas');
const paletteSelector = document.getElementById('paletteSelector');
const spriteSelector = document.getElementById('spriteSelector');
let isPainting = false;

// ----------------------------
// Init + Storage
// ----------------------------
function initCanvas(width=16,height=16){
  canvasWidth=width;
  canvasHeight=height;
  array = Array.from({length:canvasHeight},()=>Array(canvasWidth).fill(0));
  allSprites = [array.map(r=>r.slice())];
  spriteSelector.innerHTML='<option value="0">Sprite 1</option>';
  currentSpriteIndex = 0;
  renderCanvas();
  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem('spriteEditorSprites', JSON.stringify(allSprites));
  localStorage.setItem('spriteEditorCurrent', currentSpriteIndex);
  localStorage.setItem('spriteEditorCustomTheme', JSON.stringify(customTheme));
}

function loadFromLocalStorage() {
  const savedSprites = localStorage.getItem('spriteEditorSprites');
  const savedCustom = localStorage.getItem('spriteEditorCustomTheme');
  if (savedSprites) {
    allSprites = JSON.parse(savedSprites);
    currentSpriteIndex = parseInt(localStorage.getItem('spriteEditorCurrent') || 0);
    loadSprite(currentSpriteIndex);
    spriteSelector.innerHTML = '';
    allSprites.forEach((_, i) => {
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

// ----------------------------
// Swatches
// ----------------------------
function renderSwatches(){
  const swatchesDiv = document.getElementById('swatches');
  swatchesDiv.innerHTML='';
  colors.forEach((color,index)=>{
    const swatch = document.createElement('div');
    swatch.className='swatch';
    if(index===selectedColor) swatch.classList.add('selected');
    swatch.style.background=color;
    swatch.addEventListener('click',()=>{ selectedColor=index; renderSwatches(); });
    swatchesDiv.appendChild(swatch);
  });
}

// ----------------------------
// Painting + State
// ----------------------------
function saveState(){
  undoStack.push(array.map(r=>r.slice()));
  if(undoStack.length>50) undoStack.shift();
  redoStack=[];
}

function paintCell(cell){
  saveState();
  const x=parseInt(cell.dataset.x);
  const y=parseInt(cell.dataset.y);
  array[y][x]=selectedColor;
  cell.dataset.value=selectedColor;
  cell.style.background=colors[selectedColor];
  allSprites[currentSpriteIndex] = array.map(r=>r.slice());
  saveToLocalStorage();
}

function renderCanvas(){
  canvas.innerHTML='';
  const cellSize = Math.floor(Math.min(480, window.innerWidth-20)/Math.max(canvasWidth,canvasHeight));
  canvas.style.gridTemplateColumns = `repeat(${canvasWidth}, ${cellSize}px)`;
  canvas.style.gridTemplateRows = `repeat(${canvasHeight}, ${cellSize}px)`;

  for(let y=0; y<canvasHeight; y++){
    for(let x=0; x<canvasWidth; x++){
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.dataset.value = array[y][x];
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;
      cell.style.background = colors[array[y][x]];

      cell.addEventListener('mousedown', () => { isPainting=true; paintCell(cell); });
      cell.addEventListener('mouseenter', () => { if(isPainting) paintCell(cell); });
      cell.addEventListener('mouseup', () => { isPainting=false; });

      cell.addEventListener('touchstart', (e) => { paintCell(cell); e.preventDefault(); });
      cell.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        const target = document.elementFromPoint(t.clientX, t.clientY);
        if(target && target.classList.contains('cell')) paintCell(target);
        e.preventDefault();
      });

      canvas.appendChild(cell);
    }
  }

  renderSwatches();
  document.body.addEventListener('mouseup', ()=>isPainting=false);
}

function updateCanvasColors(){
  document.querySelectorAll('.cell').forEach(cell=>{
    cell.style.background = colors[parseInt(cell.dataset.value)];
  });
}

// ----------------------------
// Sprites
// ----------------------------
function loadSprite(index){
  if(!allSprites[index]) return;
  array = allSprites[index].map(r=>r.slice());
  canvasHeight = array.length;
  canvasWidth = array[0].length;
  undoStack=[];
  redoStack=[];
  renderCanvas();
  currentSpriteIndex=index;
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

// ----------------------------
// Undo/Redo
// ----------------------------
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

// ----------------------------
// Resize
// ----------------------------
function resizeCanvas(){
  const w = parseInt(prompt("Enter new width:", canvasWidth));
  const h = parseInt(prompt("Enter new height:", canvasHeight));
  if(!w || !h) return;

  const newArray = Array.from({length:h}, ()=>Array(w).fill(0));
  for(let y=0; y<Math.min(h, canvasHeight); y++){
    for(let x=0; x<Math.min(w, canvasWidth); x++){
      newArray[y][x] = array[y][x];
    }
  }
  array = newArray;
  canvasWidth=w;
  canvasHeight=h;
  allSprites[currentSpriteIndex] = array.map(r=>r.slice());
  renderCanvas();
  saveToLocalStorage();
}

// ----------------------------
// Export PNG
// ----------------------------
function exportPNG() {
  const cellSize = 16;
  const offCanvas = document.createElement('canvas');
  offCanvas.width = canvasWidth * cellSize;
  offCanvas.height = canvasHeight * cellSize;
  const ctx = offCanvas.getContext('2d');

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

// ----------------------------
// Custom Palette Builder
// ----------------------------
const colorPickersDiv = document.getElementById('colorPickers');
function renderCustomPalettePickers(){
  colorPickersDiv.innerHTML='';
  for(let i=0; i<10; i++){
    const input = document.createElement('input');
    input.type='color';
    input.value = customTheme[i] || '#ffffff';
    input.dataset.index = i;
    input.addEventListener('input', (e) => {
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

// ----------------------------
// Event Listeners + Init
// ----------------------------
for(let theme in palettes){
  const opt = document.createElement('option');
  opt.value = theme;
  opt.textContent = theme;
  paletteSelector.appendChild(opt);
}
paletteSelector.value='default';

paletteSelector.addEventListener('change', ()=>{
  colors = palettes[paletteSelector.value];
  selectedColor=0;
  renderSwatches();
  updateCanvasColors();
});

spriteSelector.addEventListener('change', ()=>{
  loadSprite(parseInt(spriteSelector.value));
});

document.getElementById('newSprite').addEventListener('click', addNewSprite);
document.getElementById('resize').addEventListener('click', resizeCanvas);
document.getElementById('undo').addEventListener('click', undo);
document.getElementById('redo').addEventListener('click', redo);
document.getElementById('exportPNG').addEventListener('click', exportPNG);

// Initialize
loadFromLocalStorage();
