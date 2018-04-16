// Show modal function

function showModal(tabModal, tabSeparator, tabContent, tabOverlay, tabModalSize) {
  // global variables
  var modal = document.querySelectorAll("[" + tabModal + "]")[0];
  var separator = document.querySelectorAll("[" + tabSeparator + "]")[0];
  var content = document.querySelectorAll("[" + tabContent + "]")[0];
  var overlay = document.querySelectorAll("[" + tabOverlay + "]")[0];
  
  // CSS timing function mapping
  BezierEasing.css = {
    "ease":        BezierEasing(0.25, 0.10, 0.25, 1.00),
    "linear":      BezierEasing(0.00, 0.00, 1.00, 1.00),
    "ease-in":     BezierEasing(0.42, 0.00, 1.00, 1.00),
    "ease-out":    BezierEasing(0.00, 0.00, 0.58, 1.00),
    "ease-in-out": BezierEasing(0.42, 0.00, 0.58, 1.00),
    "photon":      BezierEasing(0.07, 0.95, 0.00, 1.00)
  };

  // set variable for timing function
  var timingFunction = "photon";

  // check if modal is already open
  if (modal.classList.contains("open")) {
    TweenLite.set(modal, {className: '-=open'});
    TweenLite.to(modal, 0.2, {
      height: 32,
      left: 324,
      width: 720,
      ease: new Ease(BezierEasing.css[timingFunction]),
      delay: 0.05
    });
    TweenLite.to(overlay, 0.2, {
      opacity: 0,
      ease: new Ease(BezierEasing.css[timingFunction]),
      delay: 0.05
    });
    TweenLite.to(separator, 0.1, {
      css: {
        transform: "scaleX(0)",
        visibility: "hidden"
      },
      ease: new Ease(BezierEasing.css[timingFunction])
    });
  } else {
    TweenLite.set(modal, {className: '+=open'});
    TweenLite.to(modal, 0.2, {
      height: tabModalSize,
      width: 600,
      left: 384,
      ease: new Ease(BezierEasing.css[timingFunction])
    });
    TweenLite.to(overlay, 1, {
      css: {
        opacity: "1"
      },
      ease: new Ease(BezierEasing.css[timingFunction])
    });
    TweenLite.to(separator, 0.2, {
      css: {
        transform: "scaleX(1)",
        visibility: "visible"
      },
      ease: new Ease(BezierEasing.css[timingFunction]),
      delay: 0.1
    });
  }
}

// Show small modal function

function showSmallModal(tabModal, tabSeparator, tabContent, tabOverlay, tabModalSize) {
  // global variables
  var modal = document.querySelectorAll("[" + tabModal + "]")[0];
  var separator = document.querySelectorAll("[" + tabSeparator + "]")[0];
  var content = document.querySelectorAll("[" + tabContent + "]")[0];
  var overlay = document.querySelectorAll("[" + tabOverlay + "]")[0];
  
  // CSS timing function mapping
  BezierEasing.css = {
    "ease":        BezierEasing(0.25, 0.10, 0.25, 1.00),
    "linear":      BezierEasing(0.00, 0.00, 1.00, 1.00),
    "ease-in":     BezierEasing(0.42, 0.00, 1.00, 1.00),
    "ease-out":    BezierEasing(0.00, 0.00, 0.58, 1.00),
    "ease-in-out": BezierEasing(0.42, 0.00, 0.58, 1.00),
    "photon":      BezierEasing(0.07, 0.95, 0.00, 1.00)
  };

  // set variable for timing function
  var timingFunction = "photon";

  // check if modal is already open
  if (modal.classList.contains("open")) {
    TweenLite.set(modal, {className: '-=open'});
    TweenLite.to(modal, 0.2, {
      height: 32,
      left: 190,
      width: 236,
      ease: new Ease(BezierEasing.css[timingFunction]),
      delay: 0.05
    });
    TweenLite.to(overlay, 0.2, {
      opacity: 0,
      ease: new Ease(BezierEasing.css[timingFunction]),
      delay: 0.05
    });
    TweenLite.to(separator, 0.1, {
      css: {
        transform: "scaleX(0)",
        visibility: "hidden"
      },
      ease: new Ease(BezierEasing.css[timingFunction])
    });
  } else {
    TweenLite.set(modal, {className: '+=open'});
    TweenLite.to(modal, 0.2, {
      height: tabModalSize,
      width: 320,
      left: 132,
      ease: new Ease(BezierEasing.css[timingFunction])
    });
    TweenLite.to(overlay, 1, {
      css: {
        opacity: "1"
      },
      ease: new Ease(BezierEasing.css[timingFunction])
    });
    TweenLite.to(separator, 0.2, {
      css: {
        transform: "scaleX(1)",
        visibility: "visible"
      },
      ease: new Ease(BezierEasing.css[timingFunction]),
      delay: 0.1
    });
  }
}

