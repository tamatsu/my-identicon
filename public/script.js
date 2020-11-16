
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const canvas1 = document.getElementById('canvas1')
const canvas2 = document.getElementById('canvas2')
const ctx1 = canvas1.getContext('2d')
const ctx2 = canvas2.getContext('2d')

const seed = document.getElementById('seed')

  
function createFile(element, canvasId, suffix) {
  const dataURL = document.getElementById(canvasId).toDataURL('image/png').replace('image/png', 'image/octet-stream')
  const filename = seed.value.replace(/[^a-zA-Z0-9_-]/g, '')

  // SET BLOB URL
  element.setAttribute("download", `${filename}-${suffix}.png`)
  element.setAttribute("href", dataURL)
}
  


function hash(text) {
  const a = text.split('').map(v => v.charCodeAt(0))
  const m = 13466917
  const lcg = (a, b) => a * b % m
  
  return a.reduce(lcg, 1000)
}

function* sequence(seed) {
  const lcg = (a, b) => a * b % 13466917
  
  while(true) {  
    seed = lcg(seed, 86243)
    yield seed
  }
}

function draw(text) {
  const h = sequence(hash(text))

  // DRAW
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const opt = {
    saturation: 50,
    lightness: 50
  }

  drawRect(ctx, h.next().value, opt)
  drawRect(ctx, h.next().value, opt)
  drawRect(ctx, h.next().value, opt)

  // RESIZE
  ctx1.clearRect(0, 0, canvas1.width, canvas1.height)
  ctx1.drawImage(canvas, 0, 0, 512, 512, 0, 0, 192, 192)

  // RESIZE
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
  ctx2.drawImage(canvas, 0, 0, 512, 512, 0, 0, 96, 96)
}

function drawRect(ctx, seed, {hue, saturation, lightness}) {
  const seq = sequence(seed)

  hue = hue ? hue : seq.next().value % 360
  saturation = saturation ? saturation : seq.next().value % 100
  lightness = lightness ? lightness : seq.next().value % 100
  
  const x1 = seq.next().value % 512
  const y1 = seq.next().value % 512
  const w = seq.next().value % 512 - 256
  const h = seq.next().value % 512 - 256
  
  ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.5)`
  ctx.fillRect(x1, y1, w, h)
}

function _log(v, s) {
  if (s) 
    console.log(v, s)
  else
    console.log(v)
  return v
}
// UPDATE
seed.onkeyup = e => {
  draw(e.target.value)
}

// INIT
seed.value = 'hello'
draw(seed.value)

