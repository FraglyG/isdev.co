const burger = document.getElementById('ribbon-burger');
const burgermenu = document.getElementById('ribbon-burger-dropdown');

document.addEventListener("click", (e) => {
    const burgerClicked = burger.contains(e.target);

    const isEnabled = burgermenu.style.display == "block"
    if (isEnabled && !burgerClicked) burgermenu.style.display = "none";
})

burger.addEventListener('click', () => {
    const isEnabled = burgermenu.style.display == "block"
    burgermenu.style.display = isEnabled ? "none" : "block";
});




