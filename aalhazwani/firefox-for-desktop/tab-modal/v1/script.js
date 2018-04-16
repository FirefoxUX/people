// function showModal(modalClass, animationClass, animationDuration) {
//   var modal = document.getElementsByClassName(modalClass)[0];
//   if (modal.classList.contains(animationClass)) {
//     modal.style.animationPlayState = "running";
//     setTimeout (function() {
//       modal.classList.remove(animationClass);
//       modal.style.animationDirection = "normal";
//     }, animationDuration);
//   } else {
//     modal.classList.add(animationClass);
//     setTimeout (function() {
//       modal.style.animationPlayState = "paused";
//       modal.style.animationDirection = "reverse";
//     }, animationDuration);
//   }
// }

// showModal("modal-one", "animation-one", 249);

function showModalOne() {
  var modal = document.getElementsByClassName("modal-one")[0];
  if (modal.classList.contains("animation-one")) {
    modal.style.animationPlayState = "running";
    setTimeout (function() {
      modal.classList.remove("animation-one");
      modal.style.animationDirection = "normal";
    }, 249);
  } else {
    modal.classList.add("animation-one");
    setTimeout (function() {
      modal.style.animationPlayState = "paused";
      modal.style.animationDirection = "reverse";
    }, 249);
  }
}

function showModalThree() {
  var modal = document.getElementsByClassName("modal-three")[0];
  if (modal.classList.contains("animation-three")) {
    modal.style.animationPlayState = "running";
    setTimeout (function() {
      modal.classList.remove("animation-three");
      modal.style.animationDirection = "normal";
    }, 249);
  } else {
    modal.classList.add("animation-three");
    setTimeout (function() {
      modal.style.animationPlayState = "paused";
      modal.style.animationDirection = "reverse";
    }, 249);
  }
}

function showModalFour() {
  var modal = document.getElementsByClassName("modal-four")[0];
  var separator = document.getElementsByClassName("modal-four-separator")[0];
  var content = document.getElementsByClassName("modal-four-content")[0];
  var overlay = document.getElementsByClassName("modal-four-overlay")[0];
  if (modal.classList.contains("animation-four")) {
    modal.style.animationPlayState = "running";
    setTimeout (function() {
      content.classList.remove("transition-four-content");
    }, 199);
    setTimeout (function() {
      separator.classList.remove("transition-four-separator");
    }, 229);
    setTimeout (function() {
      modal.classList.remove("animation-four");
      overlay.classList.remove("transition-four-overlay");
      modal.style.animationDirection = "normal";
    }, 249);
  } else {
    modal.classList.add("animation-four");
    overlay.classList.add("transition-four-overlay");
    setTimeout (function() {
      content.classList.add("transition-four-content");
    }, 99);
    setTimeout (function() {
      separator.classList.add("transition-four-separator");
    }, 199);
    setTimeout (function() {
      modal.style.animationPlayState = "paused";
      modal.style.animationDirection = "reverse";
    }, 249);
  }
}
