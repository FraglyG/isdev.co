let currentTypeSpeed = 100

String.prototype.replaceAt = function (index, replacement) {
    if (index >= this.length) {
        return this.valueOf();
    }

    var chars = this.split('');
    chars[index] = replacement;
    return chars.join('');
}

function transition(setup, defaultString, elements) {
    let characters = ['!', '"', '#', '$', '%', '\'', '(', ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '=', '?', '@', '[', '[', '\\', ']', ']', '^', '_', '`', '│', '┤', '╡', '╢', '╖', '╕', '╣', '║', '╗', '╝', '╜', '╛', '┐', '└', '┴', '┬', '├', '─', '┼', '╞', '╟', '╚', '╔', '╩', '╦', '╠', '═', '╬', '╧', '╨', '╤', '╥', '╙', '╘', '╒', '╓', '╫', '╪', '┘', '┌', '█', '▄', '▌', '▐', '▀', 'α', 'ß', 'Γ', 'π', 'Σ', 'σ', 'µ', 'Φ', 'Θ', 'Ω', 'δ', '∞', 'φ', 'ε', '∩', '≡', '±', '≥', '≤', '⌠', '⌡', '≈', '°', '·', '·', '√', 'ⁿ', '■'];

    function changeElements(newText) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = newText;
        }
    }

    function set(at) {
        if (setup == true) {
            var char = characters[Math.floor(characters.length * Math.random())];
            var nStr = elements[0].innerHTML.replaceAt(at, char);
            changeElements(nStr);
        } else {
            var nStr = elements[0].innerHTML.replaceAt(at, defaultString[at]);
            changeElements(nStr);
        }
    }

    var i = 0;
    function myLoop() {
        setTimeout(function () {
            set(i);
            i++;
            if (i < defaultString.length) {
                myLoop();
            }
        }, 50)
    }
    myLoop();
    if (setup == false) { setTimeout(function () { changeElements(defaultString); }, defaultString.length * 50); };
}

const imAArray = [
    "game developer",
    "web developer ",
    "game designer ",
    "programmer    ",
    "web designer  ",
]

function imA(element, index = 0) {
    const text = imAArray[index]

    // transition(true, text, [element]);
    // setTimeout(function () { transition(false, imAArray[index + 1], [element]) }, 500)

    transition(true, text, [element]);
    setTimeout(function () { transition(true, text, [element]) }, 200)
    setTimeout(function () { transition(false, text, [element]) }, 400)

    if (imAArray[index + 1]) {
        setTimeout(() => { imA(element, index + 1) }, 2000)
    } else {
        setTimeout(() => { imA(element, 0) }, 2000)
    }
}

imA(document.getElementById('imaX'))