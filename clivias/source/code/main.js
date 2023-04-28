const serverURL = "https://xcliviabackend-production.up.railway.app"
const apiURL = serverURL + "/api"

// CONFIG 

const web_intro_time = 1200 // ms
const popup_time = 250 // ms
const random_image_swap_time = 200 //ms
const random_image_swap_interval = 30 * 1000 // ms

// 

let header_maximized = true


var API_KEY = "" // received later
var CLIVIA_LIST = []

var cache = {
    current_hold_track: null,
    has_moved: false,
    current_popup_closest: null,
}

async function postAPI(command, payload) {
    const data = {
        command: command,
        apikey: API_KEY,
        payload: payload
    }

    return await axios.post(apiURL, data)
}

async function getAPI(command) {
    return await axios.get(apiURL, { headers: { apikey: API_KEY, command: command } })
}

function buildFeaturedCard(title, imgSrc, info) {
    var imgBox = document.createElement("div");
    imgBox.classList.add("img_box");

    var img = document.createElement("img");
    img.setAttribute("draggable", "false");
    img.classList.add("track_image");
    img.setAttribute("src", imgSrc);
    imgBox.appendChild(img);

    var infoBox = document.createElement("div");
    infoBox.classList.add("clivia_info");
    imgBox.appendChild(infoBox);

    var titleBox = document.createElement("div");
    titleBox.classList.add("clivia_title");
    var h4 = document.createElement("h4");
    h4.innerText = title;
    titleBox.appendChild(h4);
    infoBox.appendChild(titleBox);

    var infoList = document.createElement("ul");
    infoList.classList.add("clivia_info_ul");
    infoBox.appendChild(infoList);

    for (var i = 0; i < info.length; i++) {
        var listItem = document.createElement("li");
        listItem.innerText = info[i];
        infoList.appendChild(listItem);
    }

    return imgBox;
}

function getClassExamples() {
    const classExamples = [];
    const seenClasses = new Set();

    for (const obj of CLIVIA_LIST) {
        if (!seenClasses.has(obj.class)) {
            classExamples.push({ class: obj.class, example: obj });
            seenClasses.add(obj.class);
        }
    }

    return classExamples;
}

function scroll_track(track, from, to) {
    const mouseDelta = parseFloat(from) - to
    const maxDelta = window.innerWidth / 2

    const old_percentage = parseFloat(track.dataset.prevPercentage)
    const new_percentage = (mouseDelta / maxDelta) * -100

    const percentage = Math.min(Math.max(old_percentage + new_percentage, -100), 0)

    track.dataset.currentPercentage = percentage
    track.animate({
        transform: `translate(${percentage}%, 0%)`
    }, { duration: 1200, fill: "forwards" });

    for (const image of track.getElementsByClassName("track_image")) {
        const box = image.getBoundingClientRect()
        const imageX = (box.left + box.right) / 2
        const localPercentage = imageX / window.innerWidth * 100

        const normalized = Math.min(Math.max(localPercentage, 0), 100)

        image.animate({
            objectPosition: `${normalized}% center`
        }, { duration: 1200, fill: "forwards" });
    }
}

window.addEventListener('DOMContentLoaded', async (event) => {
    const randomInfoContainer = document.getElementById("random_clivia")
    const featured_images = document.getElementById("featured_images").getElementsByClassName("image_track")[0]
    const results = await getAPI("get_clivia")
    CLIVIA_LIST = results.data.payload

    console.log(results)

    for (let i = 0; i < CLIVIA_LIST.length; i++) {
        const clivia = CLIVIA_LIST[i]

        const nameValue = clivia.Name
        const descriptionValue = clivia.Description

        const mainImageValue = clivia.Image0
        const extraImg1Value = clivia.Image1
        const extraImg2Value = clivia.Image2

        const classNameValue = clivia.Class
        const fatherNameValue = clivia.FatherName
        const motherNameValue = clivia.MotherName
        const showsWonValue = clivia.ShowsWon

        const purchaseableValue = clivia.Purchaseable
        const featuredValue = clivia.Featured

        if (featuredValue == true) {
            const title = nameValue
            const image = mainImageValue
            const info = [`${classNameValue}`, `${fatherNameValue} x ${motherNameValue}`, `${(purchaseableValue == true) && ("For Sale") || ("Not For Sale")}`]

            featured_images.appendChild(buildFeaturedCard(title, image, info))
        }
    }

    for (const track of document.getElementsByClassName("image_track")) {
        setTimeout(() => {
            const intro_time = web_intro_time * ((Math.random() + 1) / 2)
            const trackWidth = track.clientWidth
            const offset = (window.innerWidth / 2) / trackWidth * -100

            track.dataset.prevPercentage = offset

            for (const image of track.getElementsByClassName("track_image")) {
                const imagebox = image.getBoundingClientRect()
                const trackbox = track.getBoundingClientRect()

                const trackX = trackbox.left
                const imageX = (imagebox.left + imagebox.right) / 2

                const localPercentage = (imageX - trackX) / window.innerWidth * 100
                const normalized = Math.min(Math.max(localPercentage, 0), 100)

                image.animate({
                    objectPosition: `${normalized}% 50%`
                }, { duration: intro_time, fill: "forwards" });
            }

            track.animate({
                transform: `translate(${offset}%, 0%)`
            }, { duration: intro_time, fill: "forwards" });
        }, Math.random() * 100);
    }

    const random_image = document.getElementById("random_image")
    const random_name = document.getElementById("random_name")

    const randomClivia = CLIVIA_LIST[Math.floor(Math.random() * CLIVIA_LIST.length)]

    random_image.src = randomClivia.Image0
    random_name.innerHTML = randomClivia.Name

    setInterval(() => {
        randomInfoContainer.animate({
            transform: `translate(100%, 0%)`
        }, { duration: random_image_swap_time, fill: "forwards" });

        const randomClivia = CLIVIA_LIST[Math.floor(Math.random() * CLIVIA_LIST.length)]

        random_image.src = randomClivia.Image0
        random_name.innerHTML = randomClivia.Name

        setTimeout(() => {
            randomInfoContainer.animate({
                transform: `translate(0%, 0%)`
            }, { duration: random_image_swap_time, fill: "forwards" });

        }, random_image_swap_time * 1.5)
    }, random_image_swap_interval);
});

function onDown(e, position) {
    const closestImageTrack = e.target.closest(".image_track");

    if (!closestImageTrack) { return }

    closestImageTrack.dataset.mouseDownAt = position

    cache.current_hold_track = closestImageTrack

    cache.has_moved = false
}

function onMove(e, position) {
    if (cache.current_hold_track == null) { return }

    const track = cache.current_hold_track

    if (track.dataset.mouseDownAt == position) { return }

    scroll_track(track, track.dataset.mouseDownAt, position)

    cache.has_moved = true
}

function onUp(e) {
    if (!cache.current_hold_track) { return }

    cache.current_hold_track.dataset.prevPercentage = cache.current_hold_track.dataset.currentPercentage || cache.current_hold_track.dataset.prevPercentage

    if (cache.has_moved == false) {
        const closest = e.target.closest(".img_box")

        if (closest) {
            togglePopup("open", closest)

            current_popup_closest = closest
        } else {
            console.log("none found")
        }

    }

    cache.current_hold_track = null
}

window.onmousedown = (e) => { if (e.button != 0) { return } onDown(e, e.clientX) }
window.onmousemove = (e) => { if (e.button != 0) { return } onMove(e, e.clientX) }
window.onmouseup = (e) => { if (e.button != 0) { return } onUp(e) }

window.ontouchstart = (e) => { onDown(e, e.changedTouches[0].clientX) }
window.ontouchmove = (e) => { onMove(e, e.changedTouches[0].clientX) }
window.ontouchend = (e) => { onUp(e) }

const backgroundOverlay = document.getElementById("overlay_background_99")
const info_popup = document.getElementById("cliva_info_popup")

backgroundOverlay.addEventListener("pointerdown", (e) => {
    if (e.button != 0) { return }
    if (!current_popup_closest) { return }
    togglePopup("close", current_popup_closest)

    current_popup_closest = null
})

function togglePopup(state, origin) {
    var popup = document.getElementById("cliva_info_popup");

    var rect = origin.getBoundingClientRect();
    var originX = (rect.left + rect.right) / 2 + window.scrollX;
    var originY = (rect.top + rect.bottom) / 2 + window.scrollY;
    var originWidth = origin.offsetWidth;
    var originHeight = origin.offsetHeight;

    const popupDisplay = window.getComputedStyle(popup).getPropertyValue("display")

    if (state === "open" && popupDisplay == "none") {
        backgroundOverlay.style.display = "block"

        // Set the popup data
        const plantName = origin.getElementsByClassName("clivia_title")[0].firstChild.innerHTML
        const index = CLIVIA_LIST.findIndex(obj => obj.Name == plantName)
        if (index >= 0) {
            const clivia = CLIVIA_LIST[index]

            const titleElement = document.getElementById("popup_title")
            const imageElement = document.getElementById("popup_image")

            titleElement.innerHTML = clivia.Name
            imageElement.src = clivia.Image0
        }

        // Set the position and size of the popup to match the origin element
        popup.style.left = originX + "px";
        popup.style.top = originY + "px";
        popup.style.width = originWidth + "px";
        popup.style.height = originHeight + "px";

        // Show the popup
        popup.style.display = "block";

        let smallestSize = window.innerHeight;
        if (window.innerWidth < window.innerHeight) { smallestSize = window.innerWidth }

        popup.animate(
            [
                {
                    left: originX + "px",
                    top: originY + "px",
                    width: originWidth + "px",
                    height: originHeight + "px",
                    opacity: 0
                },
                {
                    left: window.innerWidth / 2 + "px",
                    top: window.innerHeight / 2 + "px",
                    width: (0.7 * smallestSize) + "px",
                    height: (0.5 * smallestSize) + "px",
                    opacity: 1
                }
            ], { duration: popup_time, fill: "forwards", easing: "ease-in-out" })

    } else if (state === "close" && popupDisplay == "block") {
        backgroundOverlay.style.display = "none"

        popup.animate({
            left: originX + "px",
            top: originY + "px",
            width: originWidth + "px",
            height: originHeight + "px",
            opacity: 0
        }, { duration: popup_time, fill: "forwards", easing: "ease-in-out" });

        setTimeout(() => {
            if (cache.current_popup_closest) { return }
            popup.style.display = "none"
        }, popup_time);
    }
}

$(document).on('click', '[data-scroll]', function (e) {
    e.preventDefault();
    var target = $(this).attr('href');
    $('body').animate({
        scrollTop: $(target).offset().top
    }, 1000);
});