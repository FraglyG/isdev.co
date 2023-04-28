const serverURL = "https://xcliviabackend-production.up.railway.app"
const apiURL = serverURL + "/api"

// CONFIG 

const web_intro_time = 1200 // ms
const popup_time = 250 // ms
const random_image_swap_time = 200 //ms
const random_image_swap_interval = 30 * 1000 // ms
const amountPerPage = 5

// 
let urlSearchParams = new URLSearchParams(window.location.search);

let header_maximized = true

urlSearchParams.forEach((value, key) => {
    if (!value) {
        urlSearchParams.delete(key);
    }
});

let currentPage = urlSearchParams.get("page") | 1

const popup = document.getElementById("popup")
const popupClose = document.getElementById("popup-close")
const popupBody = document.getElementById("popup-body")
const popupInfo = document.getElementById("popup-info")
const popupHide = document.getElementById("IMG_HIDE_BUTTON")
const popupOpen = document.getElementById("IMG_OPEN_BUTTON")
const popupBg = document.getElementById("popup-background")

popupBg.addEventListener("click", (e) => {
    popup.classList.replace("active", "inactive")
    popupBg.style.display = "none"
})

popupClose.addEventListener("click", (e) => {
    //popup.style.display = "none"
    popup.classList.replace("active", "inactive")
    popupBg.style.display = "none"
})

popupHide.addEventListener("click", (e) => {
    if (popupHide.innerHTML == "HIDE") {
        popupHide.innerHTML = "SHOW"
        popupInfo.style.display = "none"
        const blackout = popupBody.getElementsByClassName("blackout")[0]
        blackout.style.display = "none"
    } else if (popupHide.innerHTML == "SHOW") {
        popupHide.innerHTML = "HIDE"
        popupInfo.style.display = "block"
        const blackout = popupBody.getElementsByClassName("blackout")[0]
        blackout.style.display = "block"
    }
})

popupOpen.addEventListener("click", (e) => {
    const bgImg = popupImage.style.backgroundImage.slice(5, -2)
    window.open(bgImg, "_Blank")
})

let API_KEY = "" // received later
let CLIVIA_LIST = []
let ACTIVE_LIST = []

let cache = {
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

function updateTag(tag, value) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    if (tag !== undefined && value !== undefined) {
        urlSearchParams.set(tag, value);
    }

    const newUrl = `${window.location.pathname}?${urlSearchParams.toString()}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
}

function buildFeaturedCard(title, imgSrc, info, plant) {
    let imgBox = document.createElement("div");
    imgBox.classList.add("img_box");

    let infoBox = document.createElement("div");
    infoBox.classList.add("clivia_info");
    imgBox.appendChild(infoBox);

    let titleBox = document.createElement("div");
    titleBox.classList.add("clivia_title");
    let h4 = document.createElement("h4");
    h4.innerText = title;
    titleBox.appendChild(h4);
    infoBox.appendChild(titleBox);

    let infoList = document.createElement("ul");
    infoList.classList.add("clivia_info_ul");
    infoBox.appendChild(infoList);

    let img = document.createElement("img");
    img.setAttribute("draggable", "false");
    img.classList.add("track_image");
    img.setAttribute("src", imgSrc);
    infoBox.appendChild(img);

    for (let i = 0; i < info.length; i++) {
        let listItem = document.createElement("li");
        listItem.innerText = info[i];
        infoList.appendChild(listItem);
    }

    imgBox.addEventListener("click", (e) => {
        //popup.style.display = "block"
        popup.classList.replace("inactive", "active")
        popupBg.style.display = "block"

        const img = document.getElementById("popup-img")
        img.style.backgroundImage = `url(${imgSrc})`

        const imageHolders = img.getElementsByClassName("img_holder")
        imageHolders[0].innerHTML = imgSrc
        imageHolders[1].innerHTML = plant.extraImages[0]
        imageHolders[2].innerHTML = plant.extraImages[1]

        const noNullValues = plant.extraImages.filter(item => item !== null);
        const pageCount = 1 + noNullValues.length
        imgPageTotal.innerHTML = pageCount

        imgPageNumb.innerHTML = 1

        const pClose = popupClose.getElementsByTagName("p")[0]
        if (window.innerWidth > window.innerHeight) {
            pClose.innerHTML = "CLOSE"
        } else {
            pClose.innerHTML = "X"
        }

        const blackout = popupBody.getElementsByClassName("blackout")[0]
        blackout.style.display = "block"

        const titleEl = popupInfo.getElementsByTagName("h1")[0]
        titleEl.innerHTML = title

        const descEl = popupInfo.getElementsByTagName("p")[0]
        descEl.innerHTML = `${plant.description}<br><br>Shows Won: ${plant.showsWon}<br><br>∘ ${info.join("<br>∘ ")}`
    })

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

function loadClivias() {
    const cliviaGallery = document.getElementById("clivia-gallery")
    const start = (currentPage - 1) * amountPerPage
    const stop = start + amountPerPage


    cliviaGallery.innerHTML = ""

    for (let i = start; i < stop; i++) {
        const clivia = ACTIVE_LIST[i]

        if (!clivia) { break }

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

        //if (featuredValue == true) {
        const title = nameValue
        const image = mainImageValue
        const info = [`${classNameValue}`, `${fatherNameValue} x ${motherNameValue}`, `${(purchaseableValue == true) && ("For Sale") || ("Not For Sale")}`]

        cliviaGallery.appendChild(buildFeaturedCard(title, image, info, {
            description: descriptionValue,
            extraImages: [extraImg1Value, extraImg2Value],
            showsWon: showsWonValue
        }))
        // }
    }
}

const imgLeftArrow = document.getElementById("IMG_LEFT_ARROW")
const imgRightArrow = document.getElementById("IMG_RIGHT_ARROW")
const imgPageNumb = document.getElementById("IMG_PAGE_NUMB")
const imgPageTotal = document.getElementById("IMG_PAGE_TOTAL")
const popupImage = document.getElementById("popup-img")

imgLeftArrow.addEventListener("click", async () => {
    const images = popupImage.getElementsByClassName("img_holder")
    const currentPageNumb = +imgPageNumb.innerHTML
    if (currentPageNumb > 1) {
        imgPageNumb.innerHTML = currentPageNumb - 1
        const imgSrc = images[currentPageNumb - 2].innerHTML
        popupImage.style.backgroundImage = `url(${imgSrc})`
    }
})

imgRightArrow.addEventListener("click", async () => {
    const images = popupImage.getElementsByClassName("img_holder")
    const currentPageNumb = +imgPageNumb.innerHTML
    if (currentPageNumb < 3 && images[currentPageNumb].innerHTML) {
        imgPageNumb.innerHTML = currentPageNumb + 1
        const imgSrc = images[currentPageNumb].innerHTML
        popupImage.style.backgroundImage = `url(${imgSrc})`
    }
})

const leftArrow = document.getElementById("LEFT_ARROW")
const rightArrow = document.getElementById("RIGHT_ARROW")
const pageNumb = document.getElementById("PAGE_NUMB")
const pageTotal = document.getElementById("PAGE_TOTAL")

const resultMessage = document.getElementById("results-message")

pageNumb.innerHTML = currentPage

leftArrow.addEventListener("click", async () => {
    if (currentPage > 1) {
        currentPage--
        pageNumb.innerHTML = currentPage
        updateTag("page", currentPage)
        loadClivias()
    }
})

rightArrow.addEventListener("click", async () => {
    if (currentPage < Math.ceil(ACTIVE_LIST.length / amountPerPage)) {
        currentPage++
        pageNumb.innerHTML = currentPage
        updateTag("page", currentPage)
        loadClivias()
    }
})

async function loadPage() {
    console.log("loading page")
    const cliviaGallery = document.getElementById("clivia-gallery")

    const searchTag = urlSearchParams.get("search") || null
    const classTag = urlSearchParams.get("class") || null
    const purchaseableTag = urlSearchParams.get("purchaseable") || null

    ACTIVE_LIST = CLIVIA_LIST
    if (searchTag != null) { ACTIVE_LIST = ACTIVE_LIST.filter(obj => obj.Name.includes(searchTag)) }
    if (classTag != null) { ACTIVE_LIST = ACTIVE_LIST.filter(obj => obj.Class == classTag) }
    if (purchaseableTag != null) { ACTIVE_LIST = ACTIVE_LIST.filter(obj => obj.Purchaseable.toString() == purchaseableTag) }

    const gallery_messanger = document.getElementById("clivia-gallery-message")
    if (ACTIVE_LIST.length == 0) {
        gallery_messanger.style.display = "block"
    } else {
        gallery_messanger.style.display = "none"
    }
    if (currentPage > Math.ceil(ACTIVE_LIST.length / amountPerPage)) {
        currentPage = Math.ceil(ACTIVE_LIST.length / amountPerPage);
        pageNumb.innerHTML = currentPage;
        updateTag("page", currentPage)
    }
    pageTotal.innerHTML = Math.ceil(ACTIVE_LIST.length / amountPerPage)
    resultMessage.innerHTML = `${searchTag ? `Search-${searchTag} ` : ""}${classTag ? `Class-${classTag} ` : ""}${purchaseableTag ? `OnlyPurchasableOnes` : ""}`
    if (resultMessage.innerHTML == "") { resultMessage.innerHTML = "All" }

    loadClivias();
}

function checkForm() {
    urlSearchParams = new URLSearchParams(window.location.search);
    const form = document.querySelector('form');

    // Loop through each input in the form
    form.querySelectorAll('input, select').forEach(input => {
        const name = input.getAttribute('name');
        const value = urlSearchParams.get(name);

        if (value !== null) {
            if (input.type === 'checkbox') {
                input.checked = true;
            } else {
                input.value = value;
            }
        }
    });

    // Add event listener to the form
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        urlSearchParams = new URLSearchParams();
        form.querySelectorAll('input, select').forEach(input => {
            const name = input.getAttribute('name');
            const value = input.type === 'checkbox' ? input.checked : input.value;
            if (value) {
                urlSearchParams.set(name, value);
            }
        });

        currentPage = 1
        pageNumb.innerHTML = currentPage
        urlSearchParams.set("page", currentPage)

        const newUrl = `${window.location.pathname}?${urlSearchParams.toString()}`;
        window.history.pushState({ path: newUrl }, '', newUrl);

        console.log("reloading page")
        await loadPage()
    });
}

window.addEventListener('DOMContentLoaded', async (event) => {
    const results = await getAPI("get_clivia")
    CLIVIA_LIST = results.data.payload

    let classes = []

    CLIVIA_LIST.forEach(clivia => {
        if (!classes.includes(clivia.Class)) { classes.push(clivia.Class) }
    })

    const select = document.getElementById("class");

    classes.forEach((className) => {
        const option = document.createElement("option");
        option.value = className;
        option.text = className;
        select.appendChild(option);
    });

    const randomInfoContainer = document.getElementById("random_clivia")
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

    console.log(results)

    checkForm();
    await loadPage()
});

$(document).on('click', '[data-scroll]', function (e) {
    e.preventDefault();
    let target = $(this).attr('href');
    $('body').animate({
        scrollTop: $(target).offset().top
    }, 1000);
});