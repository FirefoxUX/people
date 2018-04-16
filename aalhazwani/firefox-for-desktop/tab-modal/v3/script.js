// Show modal function

function showModal(tabModal, tabSeparator, tabContent, tabOverlay, tabModalOpenHeight) {
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
    TweenLite.to(content, 0.1, {
      css: {
        top: "24",
        opacity: "0",
        visibility: "hidden"
      },
      ease: new Ease(BezierEasing.css[timingFunction])
    });
  } else {
    TweenLite.set(modal, {className: '+=open'});
    TweenLite.to(modal, 0.2, {
      height: tabModalOpenHeight,
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
    TweenLite.to(content, 0.2, {
      css: {
        top: "48px",
        opacity: "1",
        visibility: "visible"
      },
      ease: new Ease(BezierEasing.css[timingFunction])
    });
  }
}
