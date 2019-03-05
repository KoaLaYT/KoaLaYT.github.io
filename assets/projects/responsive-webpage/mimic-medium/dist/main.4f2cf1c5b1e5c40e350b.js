(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "+5i3":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "/OMX":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/94a5cdaf9d9263f59ce8e0591625a58d.png";

/***/ }),

/***/ "1s3J":
/***/ (function(module, exports) {

(function () {
  "use strict";

  /**
   * Header nav-button handlers
   */

  window.addEventListener("load", () => {
    throttle("resize", "optimizedResize");

    const navLeftBtn  = document.querySelector(".navigation-bar__left-btn");
    const navRightBtn = document.querySelector(".navigation-bar__right-btn");
    const navLinks    = document.querySelectorAll(".nav-link");
    const navBar = document.querySelector(".navigation-bar .nav");

    let navBarWidth;
    let totalWidth = 0;
    navLinks.forEach(li => {
      totalWidth += li.getBoundingClientRect().width;
    });

    updateBtnVisibility();
    window.addEventListener("optimizedResize", updateBtnVisibility);


    function updatePos(event) {
      let btn
      = event.target.classList.contains("navigation-bar__left-btn") ?
        "left" : "right";
      let moved = Number(navLinks[0].style.transform.slice(11, -3)) || 0;

      if (btn == "left" && moved >= 0) {
        navLeftBtn.classList.add("js-is-disabled");
        return;
      } else if (btn == "right" && Math.abs(moved) >= totalWidth - navBarWidth) {
        navRightBtn.classList.add("js-is-disabled");
        return;
      } else {
        navLeftBtn.classList.remove("js-is-disabled");
        navRightBtn.classList.remove("js-is-disabled");
        let factor = btn == "left" ? 1 : -1;
        let nextMove = btn == "left" ?
          Math.min(
            navBarWidth * 0.9,
            Math.abs(moved)
          ) : Math.min(
            navBarWidth * 0.9,
            totalWidth - navBarWidth - Math.abs(moved)
          );
        navLinks.forEach(li => {
          li.style.transform = `translateX(${moved + factor * nextMove}px)`;
        });
      }
    }

    function updateBtnVisibility() {
      navBarWidth = navBar.getBoundingClientRect().width;
      if (navBarWidth > totalWidth) {
        navLeftBtn.classList.add("js-is-hidden");
        navRightBtn.classList.add("js-is-hidden");

        navLinks.forEach(li => {
          li.style.transform = "translateX(0)";
        });

        navLeftBtn.removeEventListener("click", updatePos);
        navRightBtn.removeEventListener("click", updatePos);
      } else {
        navLeftBtn.classList.remove("js-is-hidden");
        navRightBtn.classList.remove("js-is-hidden");

        navLeftBtn.addEventListener("click", updatePos);
        navRightBtn.addEventListener("click", updatePos);
      }
    }
  });





  /**
   * Header notification, profile, search button handlers
   */

  window.addEventListener("load", () => {
    const threshold = 768;
    const headerBtns = document.querySelectorAll(".header-btn-img");
    const searchBtn  = document.querySelector(".search-btn-img");

    if (window.innerWidth > threshold) {
      document.querySelector(".upgrade-btn").classList.remove("js-is-hidden");
      document.querySelector(".search-btn").classList.remove("js-is-slider-hidden");
      document.querySelector(".search-btn").style.transition
      = "transform 250ms ease-out";
    } else {
      document.querySelector(".upgrade-btn").classList.add("js-is-hidden");
      document.querySelector(".search-btn").classList.add("js-is-slider-hidden");
    }

    searchBtn.addEventListener("click", () => {
      if (window.innerWidth < threshold) {
        return;
      } else {
        let searchClass = document.querySelector(".search-btn").classList;
        if (searchClass.contains("js-is-slider-in")) {
          searchClass.remove("js-is-slider-in");
          searchClass.add("js-is-slider-out");
        }
      }
    });

    headerBtns.forEach(btn => {
      btn.addEventListener("click", (event) => {
        let popup = event.target.nextElementSibling;
        if (popup.classList.contains("js-is-hidden")) {
          popup.classList.remove("js-is-hidden");
          if (window.innerWidth < threshold) {
            popup.parentElement.classList.add("js-is-popup-expand");
            document.body.classList.add("js-is-popup-expand");
          } else {
            popup.parentElement.classList.add("js-is-popup");
          }
          headerBtns.forEach(btn => {
            if (btn != event.target) {
              btn.nextElementSibling.classList.add("js-is-hidden");
              btn.parentElement.classList.remove("js-is-popup", "js-is-popup-expand");
            }
          });
        } else {
          popup.classList.add("js-is-hidden");
          popup.parentElement.classList.remove("js-is-popup", "js-is-popup-expand");
          document.body.classList.remove("js-is-popup-expand");
        }
      });
    });

    window.addEventListener("optimizedResize", () => {
      if (window.innerWidth > threshold) {
        document.querySelectorAll(".js-is-popup-expand").forEach(ele => {
          ele.classList.remove("js-is-popup-expand");
          document.body.classList.remove("js-is-popup-expand");
          ele.classList.add("js-is-popup");
        });
        document.querySelector(".upgrade-btn").classList.remove("js-is-hidden");
        document.querySelector(".search-btn").classList.remove("js-is-slider-hidden");
        document.querySelector(".search-btn").style.transition
        = "transform 250ms ease-out";
      } else {
        document.querySelectorAll(".js-is-popup").forEach(ele => {
          ele.classList.remove("js-is-popup");
          ele.classList.add("js-is-popup-expand");
          document.body.classList.add("js-is-popup-expand");
        });
        document.querySelector(".upgrade-btn").classList.add("js-is-hidden");
        document.querySelector(".search-btn").classList.add("js-is-slider-hidden");
        document.querySelector(".search-btn").style.transition
        = "";
      }
    });

    window.addEventListener("click", (event) => {
      let classLists = event.target.classList;
      if (!classLists.contains("header-btn-img") &&
          !classLists.contains("info-popup") &&
          !classLists.contains("search-btn") &&
          !classLists.contains("search-btn-img") &&
          !classLists.contains("search-bar") &&
          !classLists.contains("bookmark-info") &&
          !classLists.contains("fa-ellipsis-h")) {
        document.querySelectorAll(".header-btn-img").forEach(btn => {
          btn.nextElementSibling.classList.add("js-is-hidden");
          btn.parentElement.classList.remove("js-is-popup", "js-is-popup-expand");
          document.body.classList.remove("js-is-popup-expand");
        });
        let searchClass = document.querySelector(".search-btn").classList;
        searchClass.remove("js-is-slider-out");
        searchClass.add("js-is-slider-in");
        let popupedBookmark = document.querySelector(".js-is-bookmark-popup");
        if (popupedBookmark) {
          popupedBookmark.classList.add("js-is-hidden");
          popupedBookmark.classList.remove("js-is-bookmark-popup");
        }
      }
    });
  });

  // bookmark handlers
  window.addEventListener("load", () => {
    const bookmarks = document.querySelectorAll(".fa-bookmark");
    const bookmarkPopups = document.querySelectorAll(".bookmark-info");

    bookmarks.forEach(bm => {
      bm.addEventListener("click", (event) => {
        if (event.target.classList.contains("far")) {
          event.target.classList.remove("far");
          event.target.classList.add("fas");
        } else {
          event.target.classList.remove("fas");
          event.target.classList.add("far");
        }
        event.stopPropagation();
      });
    });

    bookmarkPopups.forEach(bmp => {
      bmp.addEventListener("click", (event) => {
        let popupClassList = event.target.nextElementSibling.classList;
        if (popupClassList.contains("js-is-hidden")) {
          popupClassList.remove("js-is-hidden");
          popupClassList.add("js-is-bookmark-popup");
        } else {
          popupClassList.add("js-is-hidden");
          popupClassList.remove("js-is-bookmark-popup");
        }
        event.stopPropagation();
      });
    });
  });


  // aside list handlers
  window.addEventListener("load", () => {
    throttle("resize", "optimizedResize");
    let threshold2 = 1087;

    resizeSecondaryLayout();

    window.addEventListener("optimizedResize", resizeSecondaryLayout);

    function resizeSecondaryLayout() {
      if (window.innerWidth > threshold2) {
        if (document.querySelector(".aside-list")) return;
        let articleList = document.querySelector(".article-infinite-list");
        let aside = document.createElement("aside");
        aside.classList.add("aside-list");
        document.querySelectorAll(".asides").forEach(as => {
          let newAs = document.createElement("div");
          newAs = as.cloneNode(true);
          articleList.removeChild(as);
          aside.appendChild(newAs);
        });
        let footer = document.createElement("footer");
        footer.classList.add("site-footer");
        footer.innerHTML = `
        <ul class="site-footer__nav">
          <li class="site-footer__link"><a href="#">Help</a></li>
          <li class="site-footer__link"><a href="#">Status</a></li>
          <li class="site-footer__link"><a href="#">Writer</a></li>
          <li class="site-footer__link"><a href="#">Blog</a></li>
          <li class="site-footer__link"><a href="#">Careers</a></li>
          <li class="site-footer__link"><a href="#">Privacy</a></li>
          <li class="site-footer__link"><a href="#">Terms</a></li>
          <li class="site-footer__link"><a href="#">About</a></li>
        </ul>
        `;
        aside.appendChild(footer);
        document.querySelector(".secondary-content").appendChild(aside);

        // set init transform for aside list
        let asideInfo = aside.getBoundingClientRect();
        let infiniteInfo = articleList.getBoundingClientRect();

        if (infiniteInfo.top < 0) {
          let transformY = -infiniteInfo.top + window.innerHeight - (asideInfo.bottom - asideInfo.top);
          transformY = Math.max(0, transformY);
          aside.style.transform = `translateY(${transformY}px)`;
        }

        let lastScrollY = window.pageYOffset;


        // add aside-list scroll sticky effect
        throttle("scroll", "optimizedScroll");

        window.addEventListener("optimizedScroll", () => {
          lastScrollY = recalPosition(
            aside,
            articleList,
            lastScrollY);
        });
      } else {
        let aside = document.querySelector(".aside-list");
        if (!aside) return;
        let articleList = document.querySelector(".article-infinite-list");
        let articles = document.querySelectorAll(".infinite-article");
        document.querySelectorAll(".asides").forEach((as, index) => {
          let newAs = document.createElement("div");
          newAs = as.cloneNode(true);
          aside.removeChild(as);
          articleList.insertBefore(newAs, articles[15 + index * 5]);
        });
        document.querySelector(".secondary-content").removeChild(aside);
        window.removeEventListener("optimizedScroll", recalPosition);
      }

      function recalPosition(
        aside,
        articleList,
        lastScrollY) {
        let direction = window.pageYOffset - lastScrollY > 0 ? "down" : "up";
        
        if (direction == "down" && aside.getBoundingClientRect().bottom - window.innerHeight <= 0) {
          let lastTransform = Number(aside.style.transform.slice(11, -3)) || 0;
          aside.style.transform = `translateY(${lastTransform + window.pageYOffset - lastScrollY}px)`;
        } else if (direction == "up" && aside.getBoundingClientRect().top >= 0) {
          let newPos = Math.min(articleList.getBoundingClientRect().top - 32, 0);
          aside.style.transform = `translateY(${-newPos}px)`;
        }
        return window.pageYOffset;
      }
    }
  });





  /**
   * helper functions
   */

  function throttle(type, name, obj) {
    obj = obj || window;
    let running = false;
    let func = function() {
      if (running) return;
      running = true;
      requestAnimationFrame(() => {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  }

})();


/***/ }),

/***/ "2F2u":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/64c25333d5e7d1358a7b6bfd2ef8c132.png";

/***/ }),

/***/ "2gco":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./avatar.svg": "ogUF",
	"./envelope.svg": "7btg",
	"./featured-collection.png": "b7gm",
	"./featured-collection0.png": "2F2u",
	"./featured-collection1.png": "ZtqH",
	"./featured-collection2.png": "Rsqs",
	"./featured-cover-middle.png": "GLNj",
	"./featured-cover-middle0.png": "nFs1",
	"./featured-cover-middle1.png": "IfBt",
	"./featured-cover-middle2.png": "zfgG",
	"./featured-cover-middle3.png": "iX+N",
	"./featured-cover-middle4.png": "/OMX",
	"./featured-cover-middle5.png": "wrwy",
	"./featured-cover-middle6.png": "MW//",
	"./featured-cover-middle7.png": "LSHT",
	"./featured-cover0.png": "HFNR",
	"./featured-cover1.png": "4XbQ",
	"./featured-cover2.png": "Vyqo",
	"./magnifying-glass.svg": "Xrfg",
	"./medium-large.png": "B10F",
	"./medium-small.svg": "hHDd",
	"./new-from-network.png": "bpyY",
	"./profile.png": "r1sf",
	"./profile0.png": "zoaq",
	"./profile1.png": "3eP+",
	"./profile2.png": "FRvb",
	"./profile3.png": "hI5F",
	"./reading-list.png": "7mMz"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "2gco";

/***/ }),

/***/ "3eP+":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/8c8e9abe4b714f15788be235895718d9.png";

/***/ }),

/***/ "4XbQ":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/04825276ea42be96549cd4843ee36d41.png";

/***/ }),

/***/ "7btg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/4d9e5a2040325df11d9757258a7c9ba5.svg";

/***/ }),

/***/ "7mMz":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/d0a4def64d22e557a0c942e1175650dd.png";

/***/ }),

/***/ "B10F":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/2e57f51d7cb324677cf8cfc724f61c2f.png";

/***/ }),

/***/ "FRvb":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/740469d84fd8b7ad29b5516414412f5b.png";

/***/ }),

/***/ "GLNj":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/5c424bc3494cff33813eca2695c365b3.png";

/***/ }),

/***/ "HFNR":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/f2787ce97346f5f08ca9128af8ef4d66.png";

/***/ }),

/***/ "IfBt":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/b5f8ddf7dfb1b335c17de009ebe55c24.png";

/***/ }),

/***/ "LSHT":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/b6e3b52625a6ec57d48775af8e7b3501.png";

/***/ }),

/***/ "MW//":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/59e9e2af078b820b326673584f0b0f64.png";

/***/ }),

/***/ "Rsqs":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/2f088cd2874284bf45d7cd32fa4a41ab.png";

/***/ }),

/***/ "Vyqo":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/2d6a5d563331748971281f7f2a2bb926.png";

/***/ }),

/***/ "Xrfg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/2e5a42b67203585d06c669540238ed4d.svg";

/***/ }),

/***/ "ZtqH":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/6df5e60222855fef61beb2d86179b942.png";

/***/ }),

/***/ "b7gm":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/fb38db658316f38f1bf9697a2005008a.png";

/***/ }),

/***/ "bpyY":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/572f82b0a87f283af7fc471375db984d.png";

/***/ }),

/***/ "hHDd":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/28f2c2485119be240dd2343bbde37645.svg";

/***/ }),

/***/ "hI5F":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/ad607e9b184a910a153a09ea23afef7f.png";

/***/ }),

/***/ "iX+N":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/bd436c6ba5a1cedcdc9ff485db29c9bc.png";

/***/ }),

/***/ "nFs1":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/45a369e4f2c05be1af93d1bd42919bbc.png";

/***/ }),

/***/ "ogUF":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/625b6e018904b734004cd2e5187f2a41.svg";

/***/ }),

/***/ "r1sf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/879582fda8432b0d665e18da0e1c945d.png";

/***/ }),

/***/ "tjUo":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("+5i3");
/* harmony import */ var _styles_main_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_styles_main_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _js_button_handles_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("1s3J");
/* harmony import */ var _js_button_handles_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_js_button_handles_js__WEBPACK_IMPORTED_MODULE_1__);



const resources = __webpack_require__("2gco");
const images = importAll(resources);
const threshold = 768;

// load header images
let siteIcon = document.querySelector(".secondary-bar__icon img");
chooseSiteIcon();

document.querySelectorAll(".secondary-bar__btns img").forEach(el => {
  addImageSRC(
    el,
    images[`./${el.id}`],
    { width: "1.5em", height: "1.5em" }
  );
});

window.addEventListener("optimizedResize", chooseSiteIcon);


// load featured content images
document.querySelectorAll(".featured-article__cover > img").forEach(img => {
  let classLists = img.parentElement.parentElement.classList;
  if (classLists.contains("most-featured")) {
    let dice = Math.floor(Math.random() * 3);
    img.src = images[`./featured-cover${dice}.png`];
  } else if (classLists.contains("second-featured")) {
    let dice = Math.floor(Math.random() * 3);
    img.src = images[`./featured-cover${dice}.png`];
  }
  else {
    let dice = Math.floor(Math.random() * 8);
    img.src = images[`./featured-cover-middle${dice}.png`];
  }
});


// load infinite article images
document.querySelectorAll(".infinite-article__cover > img").forEach(img => {
  let dice = Math.floor(Math.random() * 8);
  img.src = images[`./featured-cover-middle${dice}.png`];
});


// load featured collection images
document.querySelectorAll(".collection__cover").forEach((img, index) => {
  img.src = images[`./featured-collection${index}.png`];
});

// load aside images
document.querySelector(".news-aside__header__cover").src = images["./new-from-network.png"];
document.querySelector(".reading-list-aside__header__cover").src = images["./reading-list.png"];
document.querySelectorAll(".news-aside__list__article__cover").forEach((img, index) => {
  img.src = images[`./profile${index}.png`];
});

// load additional article
window.addEventListener("load", () => {
  throttle("scroll", "optimizedScroll");
  window.addEventListener("optimizedScroll", addArticles);

  function addArticles() {
    if (window.scrollY + window.innerHeight >
        document.body.getBoundingClientRect().height * 0.95) {
      window.removeEventListener("optimizedScroll", addArticles);
      __webpack_require__.e(/* import() */ 2).then(__webpack_require__.bind(null, "3O4D"))  /* eslint-disable-line */
        .then(response => response.articles)
        .then(articles => {
          let articleList = document.querySelector(".article-infinite-list");
          for (const article of articles) {
            let artElement = document.createElement("article");
            artElement.classList.add("infinite-article", "basic-article");
            artElement.innerHTML = `
            <div class="infinite-article__cover">
              <img src="" alt="cover">
            </div>
            <div class="infinite-article-content-wrapper">
              <span class="infinite-article__category">${article.category}</span>
              <h2 class="infinite-article__title">
                ${article.title}
              </h2>
              <p class="infinite-article__preview">
                ${article.preview}
              </p>
              <div class="infinite-article__info  article-info">
                <span class="bookmark">
                  <i class="far fa-bookmark"></i>
                  <span class="bookmark-info">
                    <i class="fas fa-ellipsis-h">
                    </i>
                    <span class="bookmark-popup  js-is-hidden">
                      Show fewer stories like this
                    </span>
                  </span>
                </span>
                <span class="article-info__author">${article.author}</span>
                <span class="article-info__date">${article.date}</span>
                <span class="article-info__read">${article.read}</span>
              </div>
            </div>
            `;
            document.querySelectorAll(".infinite-article__cover > img").forEach(img => {
              let dice = Math.floor(Math.random() * 8);
              img.src = images[`./featured-cover-middle${dice}.png`];
            });
            articleList.appendChild(artElement);
          }
          const bookmarks = document.querySelectorAll(".fa-bookmark");
          const bookmarkPopups = document.querySelectorAll(".bookmark-info");

          bookmarks.forEach(bm => {
            bm.addEventListener("click", (event) => {
              if (event.target.classList.contains("far")) {
                event.target.classList.remove("far");
                event.target.classList.add("fas");
              } else {
                event.target.classList.remove("fas");
                event.target.classList.add("far");
              }
              event.stopPropagation();
            });
          });

          bookmarkPopups.forEach(bmp => {
            bmp.addEventListener("click", (event) => {
              let popupClassList = event.target.nextElementSibling.classList;
              if (popupClassList.contains("js-is-hidden")) {
                popupClassList.remove("js-is-hidden");
                popupClassList.add("js-is-bookmark-popup");
              } else {
                popupClassList.add("js-is-hidden");
                popupClassList.remove("js-is-bookmark-popup");
              }
              event.stopPropagation();
            });
          });
          addArticles();
          window.addEventListener("optimizedScroll", addArticles);
        });
    }
  }
});





/**
 * Helper functions
 * 1. import all images
 * 2. add images to element
 */

function throttle(type, name, obj) {
  obj = obj || window;
  let running = false;
  let func = function() {
    if (running) return;
    running = true;
    requestAnimationFrame(() => {
      obj.dispatchEvent(new CustomEvent(name));
      running = false;
    });
  };
  obj.addEventListener(type, func);
}

function chooseSiteIcon() {
  if (window.innerWidth > threshold) {
    addImageSRC(
      siteIcon,
      images["./medium-large.png"],
      { width: "auto", height: "2.5em" }
    );
  } else {
    addImageSRC(
      siteIcon,
      images["./medium-small.svg"],
      { width: "2.5em", height: "2.5em" }
    );
  }
}

function addImageSRC(element, url, configs) { /* [2] */
  element.src = url;
  for (const prop in configs) {
    element.style[prop] = configs[prop];
  }
}

function importAll(r) { /* [1] */
  let outputs = {};

  r.keys().forEach(key => {
    outputs[key] = r(key);
  });

  return outputs;
}


/***/ }),

/***/ "wrwy":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/8a070f438a076f2abc85410feacc1d66.png";

/***/ }),

/***/ "zfgG":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/da42c8072997fd7a8ef1669c35ec50c7.png";

/***/ }),

/***/ "zoaq":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/49cf43da4609c4f8382c2cb58bc42f78.png";

/***/ })

},[["tjUo",1]]]);