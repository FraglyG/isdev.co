setInterval(function() {
	if (window.scrollX != 0) { window.scrollTo(0, window.scrollY) }
}, 1000)

const loadedY = window.scrollY

var htmlCodeDatabase = [
"Who worked as a cleaner before helping scientists create an atomic bomb.",
"Who escaped from a prison by making the prison's head of staff blow himself up using the man's own cigar ashes.",
"Who has met more presidents than he has owned pets.",
"Who has retired twice at the same place.",
];

const chronological = [4,7,9,11,13,16,18,20,23,26,28,1,2,3,5,6,8,10,12,14,15,17,19,21,22,24,25,27,29,30]

const chapters_about = [
	// [
		// date at end 
		// short summary 
		// long summary 
		// characters array
	// ]
	[	
		1924,
		"Allan is born into a Swedish family, his father soon died in war and his mother was left alone with her son",
		"longer summary",
		["Allan Karlson", "Allan's Mother", "Allan's Father"],
	],
	[	
		1924,
		"chapter 2 short summary",
		"longer summary",
		["Allan Karlson", "Allan's Mother", "Allan's Father"],
	],
	[	
		1924,
		"chapter 3 short summary",
		"longer summary",
		["Allan Karlson", "Allan's Mother", "Allan's Father"],
	],
	[	
		1924,
		"chapter 4 short summary",
		"longer summary",
		["Allan Karlson", "Allan's Mother", "Allan's Father"],
	],
	[	
		1924,
		"chapter 5 short summary",
		"longer summary",
		["Allan Karlson", "Allan's Mother", "Allan's Father"],
	],
]

var appear1 = document.getElementsByClassName("chapter");

for (let i = 0; i < appear1.length; i++) {
	var el = appear1[i];		
	el.innerHTML = "Chapter "+(i+1)
	
	let children = el.parentElement.children 

	for (var ii = 0; ii < children.length; ii++) {
		var child = children[ii];
		if (child.id == "information") {
			let children2 = child.children 
			
			for (var iii = 0; iii < children2.length; iii++) {
				var child2 = children2[iii];
				
				if (child2.id == "shortSummary") {
					child2.innerHTML = "Short Summary: " + chapters_about[i][1] 
				}
				if (child2.id == "characters") {
					child2.innerHTML = "Characters: " + chapters_about[i][3] 
				}
			}
		}
	}
	
};

var appear1 = document.getElementsByClassName("autoText");

for (let i = 0; i < appear1.length; i++) {
	var el = appear1[i];		
	if (el.id == "shortSummary") {
		el.innerHTML = chapters_about[el.innerHTML-1][1]
	}
};


var htmlCode = document.getElementsByClassName("htmlCode");
function htmlCodeFn() {
	for (let i = 0; i < htmlCode.length; i++) {
	  var el = htmlCode[i];
	  el.innerHTML = htmlCodeDatabase[Math.floor(Math.random()*htmlCodeDatabase.length)];
	};
}
htmlCodeFn();
setInterval(htmlCodeFn, 5000);

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

const titleText = document.getElementById("titlePageText")
const titleText2 = document.getElementById("titlePageText2")
const cloud1 = document.getElementById("cloud1")
const cloud2 = document.getElementById("cloud2")
const oldman = document.getElementById("oldman")
document.body.addEventListener("mousemove", (e) => {
  if (window.pageYOffset==0&&window.innerWidth>window.innerHeight) {
    var pageX = e.pageX - (window.innerWidth / 2);
    var pageY = e.pageY - (window.innerHeight / 2);
    var x = (-pageX/50);
    var y = (-pageY/50);
    titleText.style.backgroundPositionX = (x- (window.innerWidth / 100))*4 + "px";
    titleText.style.backgroundPositionY = (y- (window.innerHeight/ 100))*4 + "px";
	
	cloud1.style.left = 55+(x- (window.innerWidth / 100))/4 + "vw";
    cloud1.style.top = 55+(y- (window.innerHeight/ 100))/4 + "vh";
	
	cloud2.style.left = 80+(x- (window.innerWidth / 100))/4 + "vw";
    cloud2.style.top = 30+(y- (window.innerHeight/ 100))/4 + "vh";
	
	oldman.style.left = 65+(x- (window.innerWidth / 100))/10 + "vw";
	
	titleText2.style.left = 10+(x- (window.innerWidth / 100))/4 + "vw";
    titleText2.style.top = 55+(y- (window.innerHeight/ 100))/4 + "vh";
  }
})


document.addEventListener("scroll", function(){overlayFn();appearDiv()})
