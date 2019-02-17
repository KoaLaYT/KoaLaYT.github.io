(function(){
  "use strict";

  let level       = document.querySelector("#level"),
      startBtn    = document.querySelector("#start"),
      battleField = document.querySelector(".battlefield"),
      ctxTime     = document.querySelector("#canvas-time").getContext("2d"),
      ctxMines    = document.querySelector("#canvas-mines").getContext("2d");

  const profile = {
         easy: { width: 9, height: 9, mines: 10 },
       medium: { width: 16, height: 16, mines: 40 },
         hard: { width: 30, height: 16, mines: 99 },
    customise: { }
  };

  let over = false;

  level.addEventListener("change", () => {
    let width  = document.querySelector("#width"),
        height = document.querySelector("#height"),
        mines  = document.querySelector("#mines");
    if (level.value != "customise") {
      for (let input of [width, height, mines]) {
        input.setAttribute("placeholder", profile[level.value][input.id]);
        input.setAttribute("disabled", "");
        input.value = "";  // ??? input.removeAttribute("value") and input.setAttribute("value", "")
                           // ??? can not clear the input
      }
    } else {
       width.removeAttribute("disabled");
      height.removeAttribute("disabled");
       mines.removeAttribute("disabled");
    }
  });

  startBtn.addEventListener("click", start);

/*=====================================
 * helper function
  ===================================*/

  function start(event) {
    over = false;
    let width, height, mines;
    if (level.value == "customise") {
      profile.customise.width  = Number(document.querySelector("#width").value) || 30;
      profile.customise.height = Number(document.querySelector("#height").value) || 16;
      profile.customise.mines  = Number(document.querySelector("#mines").value) || 99;
    }

    ({ width, height, mines } = profile[level.value]);
    // initial mines information
    let distribute = initial(width, height, mines);
    // inital user checked information
    // and flaged information
    let checked = [],
        flaged  = [];
    for (let i = 0; i < height + 2; i++) {
      checked[i] = [];
      flaged[i] = [];
      for (let j = 0; j < width + 2; j++) {
        if (i == 0 || i == height + 1 || j == 0 || j == width + 1) {
          checked[i].push(true);
          flaged[i].push(true);
        } else {
          checked[i].push(false);
          flaged[i].push(false);
        }
      }
    }
    let left = width * height - mines;
    render(width, height, distribute, checked, flaged, left);

    // add timer animation
    let rafTime, start, currentTime = "00:00";
    rafTime = window.requestAnimationFrame(drawTime);

    // add mines count
    let rafMines, lastMines;

    rafMines = window.requestAnimationFrame(drawMines);

    function drawMines() {
      if (over) {
        window.cancelAnimationFrame(rafMines);
        return;
      }
      let currentMines = profile[level.value].mines;
      if (lastMines != currentMines && currentMines >= 0) {
        ctxMines.clearRect(0, 0, 150, 50);
        ctxMines.fillStyle = "black";
        ctxMines.fillRect(0, 0, 150, 50);
        ctxMines.fillStyle = "red";
        ctxMines.font = "30px sans-serif";
        ctxMines.fillText(currentMines, 13, 35);
        lastMines = currentMines;
      }
      rafMines = window.requestAnimationFrame(drawMines);
    }

    function drawTime(time) {
      if (over) {
        window.cancelAnimationFrame(rafTime);
        return;
      }
      if (start == null) {
        start = time;
      } else if (time - start > 1000) {
        start = time;
        let mins = Number(currentTime.slice(0, 2)),
            secs = Number(currentTime.slice(3));
        console.log(currentTime);
        secs++;
        if (secs == 60) {
          secs = "00";
          mins++;
        } else if (secs < 10) {
          secs = "0" + secs;
        }
        if (mins < 10) {
          mins = "0" + mins;
        }

        currentTime = `${mins}:${secs}`;
      }
      ctxTime.clearRect(0, 0, 150, 50);
      ctxTime.fillStyle = "black";
      ctxTime.fillRect(0, 0, 150, 50);
      ctxTime.fillStyle = "red";
      ctxTime.font = "30px sans-serif";
      ctxTime.fillText(currentTime, 13, 35);
      rafTime = window.requestAnimationFrame(drawTime);
    }
  }

  function initial(width, height, mines) {
    // record mines information
    let distribute = [];
    // a 2d array
    for (let i = 0; i < height + 2; i++) {
        distribute.push([]);
    }
    // deploy mines
    for (let i = 0; i < mines; i++) {
        deploy(width, height);
    }
    // count every cells' surrounding mine number
    for (let i = 1; i <= height; i++) {
        for (let j = 1; j <= width; j++) {
            if   (distribute[i][j] == -1) continue;
            else count(i, j);
        }
    }

    return distribute;

    function count(i, j) {
        let mineNum = 0;
        for (let row = i - 1; row <= i + 1; row++) {
            for (let col = j - 1; col <= j + 1; col++) {
                if (distribute[row][col] == -1) mineNum++;
            }
        }
        distribute[i][j] = mineNum;
    }

    function deploy(width, height) {
        let i, j;
        do {
            i = Math.floor(Math.random() * height + 1);
            j = Math.floor(Math.random() * width + 1);
        } while (distribute[i][j] == -1);
        distribute[i][j] = -1;
    }
  }

  function render(width, height, distribute, checked, flaged, left) {
    // delete previous divs
    while (battleField.hasChildNodes()) {
      battleField.removeChild(battleField.firstChild);
    }
    // render new divs
    battleField.style.gridTemplateColumns = `repeat(${width}, 20px)`;
    let num = width * height;
    centerGrid(width);
    for (let i = 0; i < num; i++) {
      let div = document.createElement("div");
      div.className = `row-${Math.floor(i/width) + 1} col-${i % width + 1}`;
      battleField.appendChild(div);
      div.addEventListener("contextmenu", flag);
      div.addEventListener("click", check);
    }

    function flag(event) {
      event.preventDefault();

      let div = event.target,
          info = div.className.split(" "),
          x = Number(info[0].slice(4)),
          y = Number(info[1].slice(4));

      if (event.button == 2) {
        if (!flaged[x][y]) {
          flaged[x][y] = true;
          div.removeEventListener("click", check);
          div.appendChild(document.createTextNode("🚩"));
          profile[level.value].mines--;
        } else if(div.textContent == "🚩"){
          profile[level.value].mines++;
          div.textContent = "?";
        } else {
          flaged[x][y] = false;
          div.addEventListener("click", check);
          div.textContent = "";
        }
      }
    }

    function check(event) {
      let div = event.target;
      if (event.button == 0) {
        examin(div);
      }

      function examin(div) {
        div.removeEventListener("click", check);
        div.removeEventListener("contextmenu", flag);

        let info = div.className.split(" "),
            x = Number(info[0].slice(4)),
            y = Number(info[1].slice(4)),
            mines = distribute[x][y];

        checked[x][y] = true;
        if (mines == -1) {
          gameover(x, y);
          over = true;
        } else {
          left--;
          div.style.border = "2px inset #81D1F9";
          div.style.backgroundColor = "silver";
          if (mines != 0) {
            div.appendChild(document.createTextNode(mines));
            div.addEventListener("mousedown", revealAll);
            div.addEventListener("contextmenu", prevent);
          } else {
            for (let [i, j] of surround(x, y)) {
              if (checked[i][j] == false && distribute[i][j] != -1) {
                examin(document.querySelector(`.row-${i}.col-${j}`));
              }
            }
          }
        }
        if (left == 0) {
          /* win information */
          over = true;
        }
      }

      function gameover(x, y) {
        div.style.border = "2px inset #81D1F9";
        div.style.backgroundColor = "red";
        div.appendChild(document.createTextNode("💣"));

        // remove all click event of all divs
        for (let i = 1; i <= height; i++) {
          for (let j = 1; j <= width; j++) {
            if (checked[i][j] == false) {
              let div = document.querySelector(`.row-${i}.col-${j}`);
              div.removeEventListener("click", check);
              div.removeEventListener("contextmenu", flag);
            }
          }
        }

        let searched = [];
        for (let i = 0; i < height + 2; i++) {
          searched[i] = [];
          for (let j = 0; j < width + 2; j++) {
            if (i == 0 || i == height + 1 || j == 0 || j == width + 1) {
              searched[i].push(true);
            } else {
              searched[i].push(false);
            }
          }
        }
        searched[x][y] = true;
        search(x, y);

        function search(x, y) {
          for (let [i, j] of surround(x, y)) {
            if (searched[i][j] == false) {
              if (!flaged[i][j] && distribute[i][j] && distribute[i][j] == -1) {
                let mineDiv = document.querySelector(`.row-${i}.col-${j}`);
                mineDiv.style.border = "2px inset #81D1F9";
                mineDiv.style.backgroundColor = "silver";
                let raf, start;
                raf = window.requestAnimationFrame(explode);

                function explode(timestamp) {
                  if (start == null) {
                    start = timestamp
                    mineDiv.appendChild(document.createTextNode("💣"));
                  } else if (timestamp - start > 250) {
                    mineDiv.textContent = "💥";
                    window.cancelAnimationFrame(raf);
                  }
                  raf = window.requestAnimationFrame(explode);
                }

              } else if (flaged[i][j] && distribute[i][j] && distribute[i][j] != -1){
                  let mineDiv = document.querySelector(`.row-${i}.col-${j}`);
                  mineDiv.style.border = "2px inset #81D1F9";
                  mineDiv.style.backgroundColor = "silver";
                  mineDiv.textContent = "❌"
              }
              searched[i][j] = true;
              window.setTimeout(search, 100, i, j);
            }
          }
        }
      }
    }

    function revealAll(event) {
      if (event.buttons == 3) {
        let info = event.target.className.split(" "),
            x = Number(info[0].slice(4)),
            y = Number(info[1].slice(4));

        let flags = 0;
        for (let [i, j] of surround(x, y)) {
          if (!checked[i][j]) {
            if (flaged[i][j] && document.querySelector(`.row-${i}.col-${j}`).textContent == "🚩") {
              flags++;
            } else if (flaged[i][j] && document.querySelector(`.row-${i}.col-${j}`).textContent == "?") {
              flags = -1;
              break;
            }
          }
        }

        if (flags == event.target.textContent) {
          for (let [i, j] of surround(x, y)) {
            if (distribute[i][j] != undefined && !flaged[i][j])
            document.querySelector(`.row-${i}.col-${j}`).dispatchEvent(new MouseEvent("click"));
          }
        } else {
          for (let [i, j] of surround(x, y)) {
            if (!checked[i][j]) {
              document.querySelector(`.row-${i}.col-${j}`).style.border = "2px inset #81D1F9";
              setTimeout(() => {
                document.querySelector(`.row-${i}.col-${j}`).style.border = "2px outset #81D1F9";
              }, 200);
            }
          }
        }
      }
    }

    function prevent(event) {
      if (event.button == 2) {
        event.preventDefault();
      }
    }
  }

  function surround(x, y) {
    let sur = [];
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        sur.push([i, j]);
      }
    }
    return sur;
  }

  function centerGrid(width) {
    let viewport = window.innerWidth;
    battleField.style.width = `${width * 20}px`;
    if (viewport <= width * 20) {
      battleField.style.marginLeft = battleField.style.marginRight = "";
    } else {
      battleField.style.marginLeft = `${(viewport - 32 - width * 20) / 2}px`;
    }
  }

})();
