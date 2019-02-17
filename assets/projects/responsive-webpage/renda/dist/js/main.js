(function() {
  let btn = document.querySelector(".hamburger");
  let menu = document.querySelector(".expand");
  let first = true;

  btn.addEventListener("click", function() {
    let status = menu.getAttribute("class");

    if (first === true) {
      menu.style.transition = "transform 200ms ease-in-out 50ms";
      first = false;
    }

    if (status === "expand") {
      menu.setAttribute("class", "expand close");
    } else {
      menu.setAttribute("class", "expand");
    }
  });

  let leftBtn = document.querySelector(".arrowLeft");
  let rigtBtn = document.querySelector(".arrowRight");

  let pic = [document.querySelector(".leftPic"),
             document.querySelector(".midPic"),
             document.querySelector(".rightPic")];

  function getSize(wid) {
    let size;
    if (wid > 1200) {
      size = 1140;
    } else if (wid > 1000) {
      size = 940;
    } else if (wid > 768) {
      size = 750;
    } else {
      size = wid-28;
    }
    return [`-${size}px`, "0px", `${size}px`];
  }

  let width = window.innerWidth;
  let pos = getSize(width);
  setPosition();

  function setZIndex(array, test) {
    for (let picture of array) {
      if (test(picture)) {
        picture.style.zIndex = "-1";
      } else {
        picture.style.zIndex = "0";
      }
    }
  }

  function setPosition() {
    for (let i = 0; i < pic.length; i++) {
      pic[i].style.left = pos[i];
    }
  }

  leftBtn.addEventListener("click", function() {
    setZIndex(pic, p => {
      let s = p.style.left;
      return Number(s.slice(0, -2)) > 0;
    });
    pos.push(pos.shift());
    setPosition();
  });

  rigtBtn.addEventListener("click", function() {
    setZIndex(pic, p => {
      let s = p.style.left;
      return Number(s.slice(0, -2)) < 0;
    });
    pos.unshift(pos.pop());
    setPosition();
  });

  window.onresize = function() {
    menu.style.transition = "";
    first = true;
    width = window.innerWidth;
    pos = getSize(width);
    for (let p of pic) {
      let s = p.style.left;
      let num = Number(s.slice(0, -2));
      if (num > 0) {
        p.style.zIndex = -1;
        p.style.left = pos[2];
      } else if (num < 0) {
        p.style.zIndex = -1;
        p.style.left = pos[0];
      } else {
        p.style.zIndex = 0;
      }
    }
  }

})();
