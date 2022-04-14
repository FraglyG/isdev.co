var secondImgActive = false;

function onScroll() {
  // first image \\
  var yOff = window.pageYOffset;
  var img = document.getElementById("firstImg");
  var img2 = document.getElementById("secondImg");
  var mheader = document.getElementById("mainHeader");

  if (yOff != 0) {
    img.classList.add("offScreen");

    img2.classList.remove("secondImgOff");
    img2.classList.add("secondImgOn");

    mheader.classList.remove("active")

    secondImgActive = true;
  } else {
    img.classList.remove("offScreen");

    img2.classList.remove("secondImgOn");
    img2.classList.add("secondImgOff");

    mheader.classList.remove("active")

    secondImgActive = false;
  }
  // second image \\
  if ((yOff/window.innerHeight) >= 0.6 && secondImgActive == true) {
    img.classList.remove("offScreen");

    img2.classList.remove("secondImgOn");
    img2.classList.add("secondImgOff");

    secondImgActive == false;

    mheader.classList.add("active");
  }
}

window.addEventListener("scroll", onScroll);
