setInterval(function() {
	if (window.scrollX != 0) { window.scrollTo(0, window.scrollY) }
}, 1000)

const loadedY = window.scrollY

var htmlCodeDatabase = [
"<xmp><html>\n  <p>Hello daar!</p>\n</html></xmp>",
"<xmp><div>\n  <h1>Alles wat jy hoef te weet van HTML</h1>\n</div></xmp>",
"<xmp><html>\n  <div>\n    <h1>HTML in a neutedop</h1>\n    <p>HTML + CSS + JS = Awesome!</p>\n    </div>\n  <p>skryf jou eerste website vandag!</p>\n  <div>\n    <p>Hi daar!!</p>\n</html></xmp>",
"<xmp><html>\n  <head>\n    <title>Hello daar!</title>\n  </head>\n  <body>\n    <p>Hello daar!</p>\n  </body>\n</html></xmp>",
];

var htmlCode = document.getElementsByClassName("htmlCode");
function htmlCodeFn() {
	for (let i = 0; i < htmlCode.length; i++) {
	  var el = htmlCode[i];
	  el.innerHTML = htmlCodeDatabase[Math.floor(Math.random()*htmlCodeDatabase.length)];
	};
}
htmlCodeFn();
setInterval(htmlCodeFn, 1000);

var appear1 = document.getElementsByClassName("appear1");
var elements = [];
function appearDiv() {
	for (let i = 0; i < appear1.length; i++) {
	  var el = appear1[i];		
		if (el.offsetTop < window.scrollY) {el.classList.add("appeared")} else {el.classList.remove("appeared");};
	};
}

const overlay = document.getElementById("overlay")
var position = 100
var previous = 0
function overlayFn() {
	var dif = window.scrollY-previous
	var vh = window.scrollY/window.innerHeight
	var change = position

	if (dif > 0) {
		change = -vh*5 + position
	} else {
		change = position -vh*5
	}
	overlay.style.top = change+"vh"

	previous = window.scrollY
}

window.addEventListener('load', function () {
  appearDiv();
})


document.addEventListener("scroll", function(){overlayFn();appearDiv()})
