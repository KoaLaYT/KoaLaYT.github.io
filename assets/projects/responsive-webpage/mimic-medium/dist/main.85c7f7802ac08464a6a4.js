(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "+5i3":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

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
          let transformY = -infiniteInfo.top + window.innerHeight - asideInfo.height;
          transformY = Math.max(0, transformY);
          aside.style.transform = `translateY(${transformY}px)`;
        }

        let lastScrollY = window.scrollY;


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
        let direction = window.scrollY - lastScrollY > 0 ? "down" : "up";

        if (direction == "down" && aside.getBoundingClientRect().bottom - window.innerHeight <= 0) {
          let lastTransform = Number(aside.style.transform.slice(11, -3)) || 0;
          aside.style.transform = `translateY(${lastTransform + window.scrollY - lastScrollY}px)`;
        } else if (direction == "up" && aside.getBoundingClientRect().top >= 0) {
          let newPos = Math.min(articleList.getBoundingClientRect().top - 32, 0);
          aside.style.transform = `translateY(${-newPos}px)`;
        }
        return window.scrollY;
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

/***/ "2gco":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./avatar.svg": "ogUF",
	"./envelope.svg": "7btg",
	"./featured-collection.png": "b7gm",
	"./featured-cover-middle.png": "GLNj",
	"./featured-cover-small.png": "p7qD",
	"./featured-cover.png": "e1BP",
	"./magnifying-glass.svg": "Xrfg",
	"./medium-large.png": "B10F",
	"./medium-small.svg": "hHDd",
	"./new-from-network.png": "bpyY",
	"./profile.png": "r1sf",
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

/***/ "GLNj":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/5c424bc3494cff33813eca2695c365b3.png";

/***/ }),

/***/ "Xrfg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/2e5a42b67203585d06c669540238ed4d.svg";

/***/ }),

/***/ "b7gm":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/fb38db658316f38f1bf9697a2005008a.png";

/***/ }),

/***/ "bpyY":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/572f82b0a87f283af7fc471375db984d.png";

/***/ }),

/***/ "e1BP":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/5ddbb4998ba354be4358546ea4ed6cb6.png";

/***/ }),

/***/ "hHDd":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/28f2c2485119be240dd2343bbde37645.svg";

/***/ }),

/***/ "ogUF":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/625b6e018904b734004cd2e5187f2a41.svg";

/***/ }),

/***/ "p7qD":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/4bce9413eac6d479535334473fc38f3e.png";

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
  if (classLists.contains("most-featured") ||
      classLists.contains("second-featured")) {
    img.src = images["./featured-cover.png"];
  } else {
    img.src = images["./featured-cover-middle.png"];
  }
});


// load infinite article images
document.querySelectorAll(".infinite-article__cover > img").forEach(img => {
  img.src = images["./featured-cover-middle.png"];
});


// load featured collection images
document.querySelectorAll(".collection__cover").forEach(img => {
  img.src = images["./featured-collection.png"];
});

// load aside images
document.querySelector(".news-aside__header__cover").src = images["./new-from-network.png"];
document.querySelector(".reading-list-aside__header__cover").src = images["./reading-list.png"];
document.querySelectorAll(".news-aside__list__article__cover").forEach(img => {
  img.src = images["./profile.png"];
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
              img.src = images["./featured-cover-middle.png"];
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


/***/ })

},[["tjUo",1]]]);