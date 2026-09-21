/* Shows one slide at a time.
   Keys: right arrow, space, page down = next.
         left arrow, shift+space, page up = back.
         Home = first slide, End = last slide.
   The slide number is kept in the address (#1, #2, ...) so a refresh
   or a shared link opens the same slide. */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".topbar nav a"));
  var counter = document.getElementById("counter");
  var bar = document.getElementById("progress");
  var backBtn = document.getElementById("back");
  var nextBtn = document.getElementById("next");
  var total = slides.length;
  var current = 0;

  function clamp(i) {
    return Math.max(0, Math.min(total - 1, i));
  }

  function indexFromHash() {
    var n = parseInt(window.location.hash.replace("#", ""), 10);
    return isNaN(n) ? 0 : clamp(n - 1);
  }

  function show(i) {
    current = clamp(i);

    slides.forEach(function (slide, index) {
      slide.classList.toggle("active", index === current);
    });

    var section = slides[current].getAttribute("data-section");
    navLinks.forEach(function (link) {
      var isCurrent = link.getAttribute("data-section") === section;
      link.classList.toggle("current", isCurrent);
      if (isCurrent) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    counter.textContent = (current + 1) + " of " + total;
    bar.style.width = ((current + 1) / total * 100) + "%";
    backBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
    slides[current].scrollTop = 0;
  }

  function go(i) {
    i = clamp(i);
    if (i !== current) {
      window.location.hash = "#" + (i + 1);   // this triggers "hashchange" below
    }
  }

  window.addEventListener("hashchange", function () {
    show(indexFromHash());
  });

  backBtn.addEventListener("click", function () { go(current - 1); });
  nextBtn.addEventListener("click", function () { go(current + 1); });

  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) { return; }
    var tag = e.target && e.target.tagName;
    var onControl = tag === "BUTTON" || tag === "A";

    if (e.key === " " && e.shiftKey) {
      e.preventDefault(); go(current - 1);
    } else if (e.key === " " && !onControl) {
      e.preventDefault(); go(current + 1);
    } else if (e.key === "ArrowRight" || e.key === "PageDown") {
      e.preventDefault(); go(current + 1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault(); go(current - 1);
    } else if (e.key === "Home") {
      e.preventDefault(); go(0);
    } else if (e.key === "End") {
      e.preventDefault(); go(total - 1);
    }
  });

  /* Swipe left or right on a touch screen */
  var startX = 0, startY = 0;
  document.addEventListener("touchstart", function (e) {
    startX = e.changedTouches[0].clientX;
    startY = e.changedTouches[0].clientY;
  }, { passive: true });
  document.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      go(dx < 0 ? current + 1 : current - 1);
    }
  }, { passive: true });

  show(indexFromHash());
})();
