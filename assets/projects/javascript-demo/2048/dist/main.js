/*==============
  main()
==============*/

let ctx = document.querySelector("#canvas").getContext("2d");

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

let state = init();
render(state);
let newState = state;

window.addEventListener("keydown", function(e) {
  if (e.code == "ArrowUp" ||
      e.code == "ArrowDown" ||
      e.code == "ArrowLeft" ||
      e.code == "ArrowRight") {
    state = newState;
    newState = merge(state, e.code);
    if (!isFull(newState) && !isNoMerge(newState, state)) {
      newState = newBorn(newState);
    }
    render(newState);
  }
});


/*======================
  helper functions
======================*/

function isNoMerge(newS, oldS) {
  let noMerge = true;
  for (let i = 0; i < newS.length; i++) {
    if (newS[i] != oldS[i]) {
      noMerge = false;
      break;
    }
  }
  return noMerge;
}

function isFull(state) {
  let full = true;
  for (let ele of state) {
    if (ele == 0) {
      full = false;
      break;
    }
  }
  return full;
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

function newBorn(state) {
  let newState = [...state], born;
  do {
    born = Math.floor(Math.random() * 16);
  } while (newState[born] != 0);
  newState[born] = 2;
  return newState;
}

function render(state) {
  ctx.clearRect(0, 0, 600, 600);
  ctx.fillStyle = "#8F959A";
  ctx.fillRect(0,0,600,600);
  let gap = 20;
  let x = gap;
  let y = gap;
  let width = 125;
  let radius = 10;
  let i = 0;
  while (i < state.length) {
    // get styling information by number value
    let info = styleConfig[Math.log2(state[i]||1)];
    roundedRect(ctx, x, y, x+width, y+width, radius, info.background);
    // set up number position and color
    if (state[i] != 0) {
      ctx.fillStyle = info.color;
      ctx.font = info.font;
      ctx.fillText(state[i], x+width/2+info.pos[0], y+width/2+info.pos[1]);
    }
    // update next block position
    x += width + gap;
    i++;
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

function merge(s, key) {
  let newState = [];
  let sequence = {
    ArrowUp: {row: [0, 4, 8, 12], col: 1},
    ArrowDown: {row: [12, 8, 4, 0], col: 1},
    ArrowLeft: {row: [0, 1, 2, 3], col: 4},
    ArrowRight: {row: [3, 2, 1, 0], col: 4}
  };
  // a helper function to clear the 0 in a row
  function elimiZero(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == 0) {
        arr.splice(i, 1);
        i--;
      }
    }
  }
  // generate a new State array
  for (let i = 0; i < 4; i++) {
    let mergeArr = [];
    // get a row of state based on key
    for (let index of sequence[key].row) {
      mergeArr.push(s[index + i * sequence[key].col]);
    }
    // eliminate all zero
    elimiZero(mergeArr);
    // merge array
    let newRow = [];
    for (let i = 0; i < mergeArr.length; i++) {
      if (mergeArr[i] != mergeArr[i+1]) {
        newRow.push(mergeArr[i]);
      } else {
        newRow.push(mergeArr[i] * 2);
        i++;
      }
    }
    while (newRow.length != 4) {
      newRow.push(0);
    }
    // copy it to newState array
    for (let index of sequence[key].row) {
      newState[index + i * sequence[key].col] = newRow.shift();
    }
  }
  console.log(newState);
  return newState;
}
