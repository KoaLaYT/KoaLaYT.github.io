"use strict";

let ctx = document.querySelector("#canvas").getContext("2d");

const baseColor = "#8F959A";

const styleConfig = [
  {background: "#C7CAD4"}, //0
  {background: "#BFC3A0", color: "black", font: "50px serif", pos: [-12, 18]}, //2
  {background: "#D2DA89", color: "black", font: "50px serif", pos: [-12, 18]}, //4
  {background: "#F2D85A", color: "white", font: "50px serif", pos: [-12, 18]}, //8
  {background: "#F5CE0F", color: "white", font: "50px serif", pos: [-26, 18]}, //16
  {background: "#F5A80F", color: "white", font: "50px serif", pos: [-26, 18]}, //32
  {background: "#F5720F", color: "white", font: "50px serif", pos: [-26, 18]}, //64
  {background: "#F5350F", color: "white", font: "40px serif", pos: [-32, 14]}, //128
  {background: "#0FBFF5", color: "white", font: "40px serif", pos: [-32, 14]}, //256
  {background: "#0F89F5", color: "white", font: "40px serif", pos: [-32, 14]}, //512
  {background: "#720FF5", color: "white", font: "30px serif", pos: [-30, 10]}, //1024
  {background: "#ED0FF5", color: "white", font: "30px serif", pos: [-30, 10]}  //2048
];

drawBase();
let STATE = init();

window.addEventListener("keydown", move);

function move(event) {
  if (event.code == "ArrowUp" ||
      event.code == "ArrowDown" ||
      event.code == "ArrowLeft" ||
      event.code == "ArrowRight") {
        window.removeEventListener("keydown", move);
        STATE = merge(STATE, event.code);
      }
}

/*====================
 * helper function *
 *====================*/

function merge(state, key) {
  let oldState  = state,
      collision = [],   // record blocks have collision
      newState  = [],    // after merge
      distance  = [];    // define how far each block will go

  const seq = {
    ArrowUp: { index: [0, 4, 8, 12], step: 1 },
    ArrowDown: { index: [12, 8, 4, 0], step: 1 },
    ArrowLeft: { index: [0, 1, 2, 3], step: 4 },
    ArrowRight: { index: [3, 2, 1, 0], step: 4 }
  };

  // split the state array into four rows
  // according to the key direction
  for (let r = 0; r < 4; r++) {
    // get current row
    let row = [];
    for (let s of seq[key].index) {
      row.push(state[s + r * seq[key].step]);
    }

    let disRow = [0, 0, 0, 0];    // store current row's distance information
    let midRow = [];    // store current row's midState information
    // first round: move
    // oldState --> midState
    for (let i = 0; i < 4; i++) {
      if (row[i] == 0) { // every non-zero elements after a zero element will plus 1 in distance
        for (let j = i + 1; j < 4; j++) {
          if (row[j] != 0) {
            disRow[j]++;
          }
        }
      } else { // for non-zero elements
        midRow.push(row[i]);
      }
    }
    // use zero to fill empty midRow[] slot
    while (midRow.length < 4) {
      midRow.push(0);
    }
    // second round: collision
    // midState --> newState
    // calculate distance[] first
    for (let i = 0; i < 4; i++) {
      if (row[i] == 0) continue;    // skip zero
      // find next non-zero element
      let k = i + 1;
      while (k < 4 && row[k] == 0) {
        k++;
      }
      if (row[i] == row[k]) {     // every non-zero elements after two equal element will plus 1 in distance
        for (let j = k; j < 4; j++) {
          if (row[j] != 0) {
            disRow[j]++;
          }
        }
        k++;
      }
      i = k - 1;
    }
    // then calculate newState[]
    // and collision[]
    let newRow = [],
        colRow = [false, false, false, false];
    for (let i = 0; i < 4; i++) {
      if (midRow[i] == 0) break;
      if (midRow[i] == midRow[i + 1]) {
        newRow.push(midRow[i] * 2);
        colRow[i] = true;
        i++;
      } else {
        newRow.push(midRow[i]);
      }
    }
    while (newRow.length < 4) {
      newRow.push(0);
    }
    // copy newRow[] --> newState[]
    //      disRow[] --> distance[]
    //      colRow[] --> collision[]
    for (let s of seq[key].index) {
      distance[s + r * seq[key].step] = disRow.shift();
      newState[s + r * seq[key].step] = newRow.shift();
      collision[s + r * seq[key].step] = colRow.shift();
    }
  }
  // add animation during movement and collision
  let frame  = 10,
      width  = 125,
      gap    = 20,
      radius = 10;
  let speed = (width + gap) / frame;
  let currentFrame = 0;
  let raf;
  let size = 30;
  function animationMove() {
    if (currentFrame <= frame) { // during the movement
      drawBase();
      for (let i = 0; i < state.length; i++) {
        if (state[i] == 0) continue; // skip zero
        let x = (i % 4 + 1) * gap + width * (i % 4);
        let y = (Math.floor(i / 4) + 1) * gap + width * Math.floor(i / 4);
        // calculate movement according to the key
        let delta = speed * currentFrame * distance[i];
        if (key == "ArrowUp") {
          y -= delta;
        } else if (key == "ArrowDown") {
          y += delta;
        } else if (key == "ArrowLeft") {
          x -= delta;
        } else if (key == "ArrowRight") {
          x += delta;
        }
        // draw block and text
        let info = styleConfig[Math.log2(state[i] || 1)];
        roundedRect(ctx, x, y, x + width, y + width, radius, info.background);
        ctx.fillStyle = info.color;
        ctx.font = info.font;
        ctx.fillText(state[i], x+width/2+info.pos[0], y+width/2+info.pos[1]);
      }
      currentFrame++;
    } else { // during the collision
      drawBase();
      if (size >= 0) {
        for (let i = 0; i < newState.length; i++) {
          if (newState[i] == 0) continue; // skip zero
          let x = (i % 4 + 1) * gap + width * (i % 4);
          let y = (Math.floor(i / 4) + 1) * gap + width * Math.floor(i / 4);
          let info = styleConfig[Math.log2(newState[i] || 1)];
          let delta, ratio;
          if (collision[i]) {
            delta = size;
          } else {
            delta = 0;
          }
          ratio = (width + delta) / width;
          roundedRect(ctx,
                      x - delta/2, y - delta/2,
                      x + width + delta/2, y + width + delta/2,
                      radius, info.background);
          ctx.fillStyle = info.color;
          ctx.font = info.font;
          ctx.fillText(newState[i], x+width/2+info.pos[0], y+width/2+info.pos[1]);
        }
      }
      if (size == 0) {
        STATE = newBorn(newState);
        window.cancelAnimationFrame(raf);
        window.addEventListener("keydown", move);
        return;
      }
      size -= 5;
    }
    raf = window.requestAnimationFrame(animationMove);
  }
  // check if merge has happen, then do the animation;
  if (!isNoChange(state, newState)) {
    raf = window.requestAnimationFrame(animationMove);
  } else { // add the addEventListener back
    window.addEventListener("keydown", move);
  }

  return newState;
}

function init() {
   let state = [
     0,0,0,0,
     0,0,0,0,
     0,0,0,0,
     0,0,0,0
   ];
   state = newBorn(newBorn(state));
   return state;
 }

function isNoChange(oldState, newState) {
  let isNoChange = true;
  for (let i = 0; i < oldState.length; i++) {
    if (oldState[i] != newState[i]) {
      isNoChange = false;
      break;
    }
  }
  return isNoChange;
}

function isFull(state) {
   let isFull = true;
   for (let s of state) {
     if (s == 0) {
       isFull = false;
       break;
     }
   }
   return isFull;
 }

function newBorn(state) {
  if (isFull(state)) return;

  let newState = [...state], born;
  do {
    born = Math.floor(Math.random() * 16);
  } while (newState[born] != 0);
  newState[born] = 2;

  // add animation
  let gap = 20;
  let x = (born % 4 + 1) * gap + (born % 4) * 125 + 125 / 2;
  let y = (Math.floor(born / 4) + 1) * gap + Math.floor(born / 4) * 125 + 125 / 2;
  let size = 0;
  let raf;
  function animationBorn() {
    if (size > 125) {
      ctx.clearRect(x - size/2, y - size/2, size, size);
      ctx.fillStyle = "#8F959A";
      ctx.fillRect(x - size/2 - 1, y - size/2 - 1, size + 2, size + 2);
    }
    if (size < 125) {
      size += 15;
    } else {
      size -= 5;
    }

    let info = styleConfig[1];
    roundedRect(ctx, x - size/2, y - size/2, x + size/2, y + size/2 , 10, info.background);
    ctx.fillStyle = info.color;
    let ratio = size / 125;
    ctx.font = info.font.slice(0, 2) * ratio + "px serif";
    ctx.fillText(2, x + info.pos[0] * ratio, y + info.pos[1] * ratio);

    if (size == 125) {
      window.cancelAnimationFrame(raf);
      return;
    }

    raf = window.requestAnimationFrame(animationBorn);
  }
  raf = window.requestAnimationFrame(animationBorn);

  return newState;
}

function drawBase() {
  ctx.clearRect(0, 0, 600, 600);
  ctx.fillStyle = baseColor;
  ctx.fillRect(0,0,600,600);
  let gap = 20;
  let x = gap;
  let y = gap;
  let width = 125;
  let radius = 10;
  let color = styleConfig[0].background;
  let i = 0;
  while (i < 16) {
    roundedRect(ctx, x, y, x+width, y+width, radius, color);
    x += width + gap;
    i++;
    // start a new line
    if (i % 4 == 0) {
      x = gap;
      y += width + gap;
    }
  }
}

function roundedRect(c, x1, y1, x2, y2, r, color) {
  c.beginPath();
  c.arc(x1+r, y1+r, r, Math.PI, Math.PI*1.5);
  c.lineTo(x2-r, y1);
  c.arc(x2-r, y1+r, r, Math.PI*1.5, Math.PI*2);
  c.lineTo(x2, y2-r);
  c.arc(x2-r, y2-r, r, 0, Math.PI*0.5);
  c.lineTo(x1+r, y2);
  c.arc(x1+r, y2-r, r, Math.PI*0.5, Math.PI);
  c.lineTo(x1, y1+r);
  c.closePath();
  c.fillStyle = color;
  c.fill();
}
