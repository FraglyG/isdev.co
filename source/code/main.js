const container = document.querySelector('#header_div');

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
    "web developer",
    "game desginer",
    "programmer",
    "          ",
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
    }
}

function typeElements(elements, index = 0) {
    if (index >= elements.length) { return }
    const { element, text } = elements[index];
    let charIndex = 0;

    if (element.id == "mainDescriptiveParagraph") {
        currentTypeSpeed = false
    }

    if (currentTypeSpeed == false) {
        element.classList.add("faded-in")
        setTimeout(() => { typeElements(elements, index + 1); }, 200);
        return
    }

    function typeChar() {
        if (charIndex < text.length) {
            element.textContent += text[charIndex++];
            setTimeout(typeChar, currentTypeSpeed);
        } else {
            if (element.id == "ImAText") {
                setTimeout(() => { 
                    typeElements(elements, index + 1); 
                    
                }, imAArray.length * 2000)
                imA(element)
                // transition(true, "Bsc IT Student", [element]);
                // setTimeout(function () { transition(false, "Game Developer", [element]) }, 500)
                // setTimeout(function () { transition(false, "Programmer", [element]) }, 1500)
            } else {
                setTimeout(() => { typeElements(elements, index + 1); }, 200);
            }
        }
    }

    typeChar();
}

function typingText() {
    let textArray = []
    let done = false

    container.querySelectorAll('h1, h2, h3, h4, p').forEach(element => {
        const text = element.innerHTML
        textArray.push({ element: element, text: text })
        if (element.id == "mainDescriptiveParagraph") { done = true }
        if (!done) { element.innerHTML = "" }
    })

    typeElements(textArray)

    // for (let i = 0; i < textArray.length; i++) {
    //     const { element, text } = textArray[i]

    //     let index = 0;
    //     const intervalId = setInterval(() => {
    //         if (index < text.length) {
    //             element.textContent += text[index++];
    //         } else {
    //             clearInterval(intervalId);
    //         }
    //     }, 100);
    // }
}

window.addEventListener("DOMContentLoaded", () => {
    typingText()
})