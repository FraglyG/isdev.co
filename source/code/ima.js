let currentTypeSpeed = 100;

const stringReplaceAt = (str, index, replacement) => {
    if (index >= str.length) {
        return str.valueOf();
    }
    const chars = str.split('');
    chars[index] = replacement;
    return chars.join('');
}

const changeElements = (newText, elements) => {
    elements.forEach(element => element.innerHTML = newText);
}

const set = (setup, at, defaultString, characters, elements) => {
    let nStr;
    if (setup) {
        const char = characters[Math.floor(characters.length * Math.random())];
        nStr = stringReplaceAt(elements[0].innerHTML, at, char);
    } else {
        nStr = stringReplaceAt(elements[0].innerHTML, at, defaultString[at]);
    }
    changeElements(nStr, elements);
}

const transition = (setup, defaultString, elements) => {
    const characters = ['!', '"', '#', '$', '%', '\'', '(', ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '=', '?', '@', '[', '[', '\\', ']', ']', '^', '_', '`', '│', '┤', '╡', '╢', '╖', '╕', '╣', '║', '╗', '╝', '╜', '╛', '┐', '└', '┴', '┬', '├', '─', '┼', '╞', '╟', '╚', '╔', '╩', '╦', '╠', '═', '╬', '╧', '╨', '╤', '╥', '╙', '╘', '╒', '╓', '╫', '╪', '┘', '┌', '█', '▄', '▌', '▐', '▀', 'α', 'ß', 'Γ', 'π', 'Σ', 'σ', 'µ', 'Φ', 'Θ', 'Ω', 'δ', '∞', 'φ', 'ε', '∩', '≡', '±', '≥', '≤', '⌠', '⌡', '≈', '°', '·', '·', '√', 'ⁿ', '■'];;
    const loopThroughChars = async (i = 0) => {
        if (i < defaultString.length) {
            set(setup, i, defaultString, characters, elements);
            setTimeout(() => loopThroughChars(i + 1), 50);
        }
    }
    loopThroughChars();
    if (!setup) {
        setTimeout(() => { changeElements(defaultString, elements); }, defaultString.length * 50);
    };
}

const imAArray = ["game developer", "web developer ", "game designer ", "programmer    ", "web designer  "];

const imA = (element, index = 0) => {
    const text = imAArray[index]

    transition(true, text, [element]);
    setTimeout(() => transition(true, text, [element]), 200);
    setTimeout(() => transition(false, text, [element]), 400);

    setTimeout(() => {
        if (imAArray[index + 1]) {
            imA(element, index + 1)
        } else {
            imA(element, 0)
        }
    }, 2000);
}

imA(document.getElementById('imaX'));