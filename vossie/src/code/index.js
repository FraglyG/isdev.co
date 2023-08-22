// Function to set a cookie
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Function to get a cookie value
function getCookie(name) {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName)) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return null;
}

// Check for LOGGED IN
const userToken = getCookie("VOSSIE_TOKEN");
if (!userToken) {
    // redirect to login page
    window.location.href += "login";
}

function generateEventList(dayArray, day) {
    let eventList = "<ul class='eventlist'>";

    const dayData = dayArray[day - 1]
    const events = dayData ? dayData.events : []

    for (let i = 0; i < events.length; i++) {
        eventList += `<li>${events[i].name}</li>`;
    }

    return eventList + "</ul>";
}

function populateSchedule(dayArray, day) {
    const schedule = document.getElementById("schedule")
    schedule.innerHTML = ""
    const dayData = dayArray[day - 1]
    const events = dayData ? dayData.events : []

    for (let i = 0; i < events.length; i++) {
        const event = events[i];

        const eventStart = event.timestart
        const eventDuration = event.timeduration
        const eventEnd = eventStart + eventDuration

        const evenEndTimeDate = new Date(eventEnd)
        const eventEndTime = evenEndTimeDate.getHours() + ":" + evenEndTimeDate.getMinutes()

        const eventClass = document.createElement("div");
        eventClass.classList.add("event");
        eventClass.innerHTML = `<div class="time">${eventEndTime}</div><div class="title">${event.name}</div>`;
        schedule.appendChild(eventClass);
    }

    if (events.length == 0) {
        const eventClass = document.createElement("div");
        eventClass.classList.add("event");
        eventClass.innerHTML = `<div class="title">No Events Today</div>`;
        schedule.appendChild(eventClass);
    }
}

function openEventPopup(day) {
    const popup = document.getElementById("eventPopup");
    // ... Logic to populate event details in the popup ...

    popup.style.display = "block";
}

function closeEventPopup() {
    const popup = document.getElementById("eventPopup");
    popup.style.display = "none";
}

async function populateCalendar(dummyLoad) {
    // Clear existing calendar days
    const currentMonthElement = document.getElementById("currentMonth");
    const calendarDays = document.querySelector(".calendar-days");

    const dayArrayRaw = !dummyLoad ? (await fetch("https://vossie.isdev.co/calendar?token=" + userToken)) : null
    const dayArray = dayArrayRaw ? (await dayArrayRaw.json()) : []

    calendarDays.innerHTML = `<div class="day-label">Sun</div>
    <div class="day-label">Mon</div>
    <div class="day-label">Tue</div>
    <div class="day-label">Wed</div>
    <div class="day-label">Thu</div>
    <div class="day-label">Fri</div>
    <div class="day-label">Sat</div>`;

    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const daysInMonth = new Date(year, month, 0).getDate()
    const daysInPreviousMonth = new Date(year, month - 1, 0).getDate();

    const weekDayOfFirstDay = new Date(year, month, 1).getDay();
    const weekDayOfLastDay = new Date(year, month, daysInMonth).getDay()

    const prefillDayCount = weekDayOfFirstDay
    const postfillDayCount = 6 - weekDayOfLastDay

    // fill out the previous month days
    for (let i = 0; i < prefillDayCount; i++) {
        const dayElement = document.createElement("div");
        dayElement.classList.add("day-filler");
        dayElement.textContent = daysInPreviousMonth - (prefillDayCount - i) + 1;
        calendarDays.appendChild(dayElement);
    }

    // fill out the current month days
    for (let day = 1; day < daysInMonth + 1; day++) {
        const dayElement = document.createElement("div");
        dayElement.classList.add("day");
        dayElement.innerHTML = `${day}${generateEventList(dayArray, day)}`;
        dayElement.addEventListener("click", () => openEventPopup(day));
        calendarDays.appendChild(dayElement);

        // if is today then add day-today class
        if (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
            dayElement.classList.add("day-today");
            populateSchedule(dayArray, day)
        }

    }

    // fill out the next month days
    for (let i = 0; i < postfillDayCount; i++) {
        const dayElement = document.createElement("div");
        dayElement.classList.add("day-filler");
        dayElement.textContent = i + 1;
        calendarDays.appendChild(dayElement);
    }

    // Update current month label
    const currentMonth = new Date().toLocaleString("default", { month: "long" });
    currentMonthElement.textContent = currentMonth + " " + year;
}

document.addEventListener("DOMContentLoaded", function () {
    const prevButton = document.getElementById("prevBtn");
    const nextButton = document.getElementById("nextBtn");

    prevButton.addEventListener("click", showPreviousMonth);
    nextButton.addEventListener("click", showNextMonth);

    // Initial data for the example
    const eventsData = [
        // ... Populate events data here ...
    ];

    // Initialize the calendar
    renderCalendar();

    async function renderCalendar() {
        await populateCalendar(true)
        populateCalendar(false)
    }

    function showPreviousMonth() {
        // ... Logic to show previous month ...
        renderCalendar();
    }

    function showNextMonth() {
        // ... Logic to show next month ...
        renderCalendar();
    }

    const closePopupButton = document.getElementById("closePopup");
    closePopupButton.addEventListener("click", closeEventPopup);
});