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

    const events = dayArray[day - 1].events

    for (let i = 0; i < events.length; i++) {
        eventList += `<li>${events[i].name}</li>`;
    }

    return eventList + "</ul>";
}

function populateSchedule(dayArray, day) {
    const schedule = document.getElementById("schedule")
    const events = dayArray[day - 1].events

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

document.addEventListener("DOMContentLoaded", function () {
    const currentMonthElement = document.getElementById("currentMonth");
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
        // Clear existing calendar days
        const calendarDays = document.querySelector(".calendar-days");
        // calendarDays.innerHTML = "";

        const dayArrayRaw = await fetch("https://vossie.isdev.co/calendar?token=" + userToken)
        const dayArray = await dayArrayRaw.json()
        console.log(dayArray)

        // ... Logic to populate calendar days here ...

        // Example: Dynamically create calendar day elements
        // for (let i = 1; i <= 31; i++) {
        //     const dayElement = document.createElement("div");
        //     dayElement.classList.add("day");
        //     dayElement.textContent = i;
        //     dayElement.addEventListener("click", () => openEventPopup(i));
        //     calendarDays.appendChild(dayElement);
        // }

        // Dynamically create calendar day elements
        // fill the calendar day with day-filler class elements until the day of the week is correct
        // then fill the calendar day with day class elements until the day of the month is correct
        // then fill the calendar day with day-filler class elements until the end of the week is reached
        let day = 1;
        let dayOfWeek = new Date().getDay() + 1;
        let month = new Date().getMonth();
        let year = new Date().getFullYear();
        let daysInMonth = new Date(year, month + 1, 0).getDate();
        let daysInPreviousMonth = new Date(year, month, 0).getDate();
        let daysInNextMonth = new Date(year, month + 2, 0).getDate();
        let lastDayOfMonth = new Date(year, month + 1, 0).getDay();
        let calendarDayNumber = 1;
        let calendarDayFillerNumber = 1;
        // fill the previous month
        for (let i = 0; i < dayOfWeek; i++) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("day-filler");
            dayElement.textContent = daysInPreviousMonth - (dayOfWeek - i - 1);
            calendarDays.appendChild(dayElement);
            calendarDayFillerNumber++;
        }
        // fill the current month
        while (day <= daysInMonth) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("day");
            dayElement.innerHTML = `${day}${generateEventList(dayArray, calendarDayNumber)}`;
            dayElement.addEventListener("click", () => openEventPopup(day));
            calendarDays.appendChild(dayElement);

            // if is today then add day-today class
            if (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                dayElement.classList.add("day-today");
                populateSchedule(dayArray, calendarDayNumber)
            }

            day++;
            calendarDayNumber++;
        }
        // fill the next month
        let endOfMonthFillerNumber = 1
        while (lastDayOfMonth < 6) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("day-filler");
            dayElement.textContent = endOfMonthFillerNumber;
            calendarDays.appendChild(dayElement);
            lastDayOfMonth++;
            endOfMonthFillerNumber++;
        }

        // Update current month label
        const currentMonth = new Date().toLocaleString("default", { month: "long" });
        currentMonthElement.textContent = currentMonth + " " + year;
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