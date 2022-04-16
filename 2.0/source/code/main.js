var secondImgActive = false;

String.prototype.replaceAt = function(index, replacement) {
    if (index >= this.length) {
        return this.valueOf();
    }

    var chars = this.split('');
    chars[index] = replacement;
    return chars.join('');
}

function onScroll() {
  // first image \\
  var yOff = window.pageYOffset;
  var scrollPercentage = (yOff/window.innerHeight);
  var img = document.getElementById("firstImg");
  var img2 = document.getElementById("secondImg");
  var mheader = document.getElementById("mainHeader");
  var otherInf = document.getElementById("otherInfo");

  if (yOff != 0) {
    // removes first image and brings up second image \\
    img.classList.add("offScreen");

    img2.classList.remove("secondImgOff");
    img2.classList.add("secondImgOn");

    mheader.classList.remove("active")

    if (secondImgActive == false)  {
      transition(true, "Fragly", [document.getElementById("FraglyTitle2")]);
      setTimeout(function(){transition(true, "Fragly", [document.getElementById("FraglyTitle2")])},500)

      setTimeout(function(){transition(false, "Fragly", [document.getElementById("FraglyTitle2")])},1000)
    }

    secondImgActive = true;
  } else {
    // removes second image and brings up first image \\
    img.classList.remove("offScreen");

    img2.classList.remove("secondImgOn");
    img2.classList.add("secondImgOff");

    mheader.classList.remove("active")

    if (secondImgActive == true)  {
      setTimeout(function(){
        transition(true, "theFragly.com", [document.getElementById("title1"),document.getElementById("title2")]);
        setTimeout(function(){transition(false, "theFragly.com", [document.getElementById("title1"),document.getElementById("title2")])},300)
      }, 1000)
    }

    secondImgActive = false;
  }
  // second image \\
  if (scrollPercentage >= 0.6) {
    // removes second image and brings up the other page \\
    img.classList.remove("offScreen");

    img2.classList.remove("secondImgOn");
    img2.classList.add("secondImgOff");

    otherInf.classList.remove("hidden")

    secondImgActive == false;

    mheader.classList.add("active");
  } else {
    otherInf.classList.add("hidden")
  }
}

window.addEventListener("scroll", onScroll);

function transition(setup, defaultString, elements) {
  let characters = ['!','"','#','$','%','&','\'','(',')','*','+',',','-','.','/','0','1','2','3','4','5','6','7','8','9',':',';','<','=','>','?','@','[','[','\\',']',']','^','_','`','░','▒','▓','│','┤','╡','╢','╖','╕','╣','║','╗','╝','╜','╛','┐','└','┴','┬','├','─','┼','╞','╟','╚','╔','╩','╦','╠','═','╬','╧','╨','╤','╥','╙','╘','╒','╓','╫','╪','┘','┌','█','▄','▌','▐','▀','α','ß','Γ','π','Σ','σ','µ','τ','Φ','Θ','Ω','δ','∞','φ','ε','∩','≡','±','≥','≤','⌠','⌡','≈','°','·','·','√','ⁿ','■'];

  function changeElements(newText) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].innerHTML = newText;
    }
  }

  function set(at){
    if (setup==true) {
      var char = characters[Math.floor(characters.length*Math.random())];
      var nStr = elements[0].innerHTML.replaceAt(at, char);
      changeElements(nStr);
    } else {
      var nStr = elements[0].innerHTML.replaceAt(at, defaultString[at]);
      changeElements(nStr);
    }
  }

  var i = 0;
  function myLoop() {
    setTimeout(function() {
      set(i);
      i++;
      if (i < defaultString.length) {
        myLoop();
      }
    }, 50)
  }
  myLoop();
  if (setup == false) { setTimeout(function() { changeElements(defaultString); }, defaultString.length*50); };
}

transition(true, "theFragly.com", [document.getElementById("title1"),document.getElementById("title2")]);
setTimeout(function(){transition(false, "theFragly.com", [document.getElementById("title1"),document.getElementById("title2")])},300)
