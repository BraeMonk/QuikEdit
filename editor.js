// ----------------------------
// Light/Dark mode toggle
// ----------------------------
const isLightMode = true; // set false for dark

// ----------------------------
// Palettes (inline arrays)
// ----------------------------
const palettes = {
  default: isLightMode
    ? ['transparent', '#FFF2E0', '#FFE0B3', '#FFD8A6', '#FFCB88', '#E6B273', '#C4945E', '#A9745B', '#8B5E3C', '#6B4226', '#4A2B17']
    : ['transparent', '#E0ECFA', '#C2DAF7', '#9CC7F0', '#6FA6E0', '#4A90E2', '#2B6FB2', '#1F5FBF', '#173F80', '#0D264D', '#08162B'],
  // ... include other palettes you already had
};

// ----------------------------
// State
// ----------------------------
let colors = palettes.default;
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
}

function loadFromLocalStorage() {
  const savedSprites = localStorage.getItem('spriteEditorSprites');
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
  const cellSize=Math.floor(Math.min(480, window.innerWidth-20)/Math.max(canvasWidth,canvasHeight));
  canvas.style.gridTemplateColumns=`repeat(${canvasWidth},${cellSize}px)`;
  canvas.style.gridTemplateRows=`repeat(${canvasHeight},${cellSize}px)`;

  for(let y=0;y<canvasHeight;y++){
    for(let x=0;x<canvasWidth;x++){
      const cell=document.createElement('div');
      cell.className='cell';
      cell.dataset.x=x;
      cell.dataset.y=y;
      cell.dataset.value=array[y][x];
      cell.style.width=`${cellSize}px`;
      cell.style.height=`${cellSize}px`;
      cell.style.background=colors[array[y][x]];

      cell.addEventListener('mousedown',()=>{ isPainting=true; paintCell(cell); });
      cell.addEventListener('mouseenter',()=>{ if(isPainting) paintCell(cell); });
      cell.addEventListener('mouseup',()=>{ isPainting=false; });

      cell.addEventListener('touchstart',(e)=>{ paintCell(cell); e.preventDefault(); });
      cell.addEventListener('touchmove',(e)=>{
        const t=e.touches[0];
        const target=document.elementFromPoint(t.clientX,t.clientY);
        if(target && target.classList.contains('cell')) paintCell(target);
        e.preventDefault();
      });

      canvas.appendChild(cell);
    }
  }
  renderSwatches();
  document.body.addEventListener('mouseup',()=>isPainting=false);
}

function updateCanvasColors(){
  document.querySelectorAll('.cell').forEach(cell=>{
    cell.style.background=colors[parseInt(cell.dataset.value)];
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
// Export PNG
// ----------------------------
function exportPNG() {
  const cellSize = 16;
  const offCanvas = document.createElement('canvas');
  offCanvas.width = canvasWidth * cellSize;
  offCanvas.height = canvasHeight * cellSize;
  const ctx = offCanvas.getContext('2d');
  
  for (let y=0;y<canvasHeight;y++){
    for (let x=0;x<canvasWidth;x++){
      const color = colors[array[y][x]];
      if (color !== 'transparent') {
        ctx.fillStyle = color;
        ctx.fillRect(x*cellSize,y*cellSize,cellSize,cellSize);
      }
    }
  }
  const link = document.createElement('a');
  link.download = `sprite-${Date.now()}.png`;
  link.href = offCanvas.toDataURL();
  link.click();
}

// ----------------------------
// Resize
// ----------------------------
function resizeCanvas() {
  const w = parseInt(prompt("Enter new width:", canvasWidth));
  const h = parseInt(prompt("Enter new height:", canvasHeight));
  if (!w || !h) return;

  const newArray = Array.from({length:h},()=>Array(w).fill(0));
  for (let y=0;y<Math.min(h, canvasHeight);y++){
    for (let x=0;x<Math.min(w, canvasWidth);x++){
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
// Init + Event Listeners
// ----------------------------
for(let theme in palettes){
  const opt = document.createElement('option');
  opt.value = theme;
  opt.textContent = theme;
  paletteSelector.appendChild(opt);
}
paletteSelector.value='default';

paletteSelector.addEventListener('change',()=>{
  colors = palettes[paletteSelector.value];
  selectedColor = 0;
  renderSwatches();
  updateCanvasColors();
});

spriteSelector.addEventListener('change',()=>{
  loadSprite(parseInt(spriteSelector.value));
});

document.getElementById('newSprite').addEventListener('click',addNewSprite);
document.getElementById('resize').addEventListener('click',resizeCanvas);

document.getElementById('undo').addEventListener('click',()=>{
  if(undoStack.length){
    redoStack.push(array.map(r=>r.slice()));
    array = undoStack.pop().map(r=>r.slice());
    renderCanvas();
    saveToLocalStorage();
  }
});
document.getElementById('redo').addEventListener('click',()=>{
  if(redoStack.length){
    undoStack.push(array.map(r=>r.slice()));
    array = redoStack.pop().map(r=>r.slice());
    renderCanvas();
    saveToLocalStorage();
  }
});
document.getElementById('clear').addEventListener('click',()=>{
  saveState();
  array=Array.from({length:canvasHeight},()=>Array(canvasWidth).fill(0));
  renderCanvas();
  saveToLocalStorage();
});

// Export JSON
document.getElementById('export').addEventListener('click',()=>{
  allSprites[currentSpriteIndex] = array.map(r=>r.slice());
  document.getElementById('output').textContent=JSON.stringify(allSprites,null,4);
});

// Export PNG
document.getElementById('exportPNG').addEventListener('click', exportPNG);

// Import JSON
document.getElementById('importFile').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      let importedData = JSON.parse(evt.target.result);
      if (!Array.isArray(importedData) && typeof importedData === 'object') {
        importedData = Object.values(importedData);
      }
      allSprites = importedData.map(spr => spr.map(r=>r.slice()));
      loadSprite(0);
      spriteSelector.innerHTML = '';
      allSprites.forEach((_, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Sprite ${i+1}`;
        spriteSelector.appendChild(opt);
      });
      spriteSelector.value = 0;
      saveToLocalStorage();
    } catch (err) {
      alert('Invalid JSON file: ' + err);
    }
  };
  reader.readAsText(file);
});

// ----------------------------
// Keyboard Shortcuts
// ----------------------------
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'z') {
    document.getElementById('undo').click();
  } else if (e.ctrlKey && e.key === 'y') {
    document.getElementById('redo').click();
  } else if (e.key === 'Delete') {
    document.getElementById('clear').click();
  }
});

// ----------------------------
// Start
// ----------------------------
loadFromLocalStorage();
