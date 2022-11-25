const config = {
  "titleShiftStrength": 0.5
}

let currentPage = 0

String.prototype.replaceAt = function(index, replacement) {
  if (index >= this.length) {
      return this.valueOf();
  }

  var chars = this.split('');
  chars[index] = replacement;
  return chars.join('');
}

function transition(setup, defaultString, elements) {
  let characters = ['!','"','#','$','%','\'','(',')','*','+',',','-','.','/','0','1','2','3','4','5','6','7','8','9',':',';','=','?','@','[','[','\\',']',']','^','_','`','│','┤','╡','╢','╖','╕','╣','║','╗','╝','╜','╛','┐','└','┴','┬','├','─','┼','╞','╟','╚','╔','╩','╦','╠','═','╬','╧','╨','╤','╥','╙','╘','╒','╓','╫','╪','┘','┌','█','▄','▌','▐','▀','α','ß','Γ','π','Σ','σ','µ','Φ','Θ','Ω','δ','∞','φ','ε','∩','≡','±','≥','≤','⌠','⌡','≈','°','·','·','√','ⁿ','■'];

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

const title = document.getElementById("title")
const fragly = document.getElementById("fragly")
const programmer = document.getElementById("programmer")

transition(true, "theFragly.com", [title]);
setTimeout(function(){transition(false, "theFragly.com", [title])},300)

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY
  const scrollP = scrollY/window.innerHeight

  if (scrollP == 0 && currentPage != 0) {
    currentPage = 0

    transition(true, "theFragly.com", [title]);
    setTimeout(function(){transition(false, "theFragly.com", [title])},300)
  } else if (scrollP > 0.5 && scrollP < 1 && currentPage != 1) {
    currentPage = 1
    
    transition(true, "Fragly", [fragly]);
    setTimeout(function(){transition(true, "Fragly", [fragly])},500)
    setTimeout(function(){transition(false, "Fragly", [fragly])},1000)
  } else if (scrollP > 1.5 && currentPage != 2) {
    currentPage = 2
    
    transition(true, "programmer", [programmer]);
    setTimeout(function(){transition(true, "programmer", [programmer])},500)
    setTimeout(function(){transition(false, "programmer", [programmer])},1000)
  }
})

document.body.addEventListener("mousemove", (mouse) => {
  let windowX = window.innerWidth
  let windowY = window.innerHeight

  if (windowX < windowY) { return }

  let ratio = windowX / windowY
  let stengthX = config.titleShiftStrength
  let stengthY = config.titleShiftStrength * ratio

  let textPosX = 3
  let textPosY = 10

  let pivotX = -windowX * 0.1
  let pivotY = -windowY * 0.1

  let mousePosX = mouse.pageX
  let mousePosY = mouse.pageY

  let distance = Math.sqrt((mousePosY - pivotY) ^ 2 + (mousePosX - pivotX) ^ 2)

  let angleRad = Math.atan2((mousePosY - pivotY), (mousePosX - pivotX))
  let addX = Math.cos(angleRad) * stengthX
  let addY = Math.sin(angleRad) * stengthY

  title.style.left = textPosX + addX + "vw"
  title.style.top = textPosY + addY + "vh"
})
