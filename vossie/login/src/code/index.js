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

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    // const username = document.getElementById('username').value;
    // const password = document.getElementById('password').value;

    const token = document.getElementById('token').value;

    if (token) {
        // window.location.href = 'dashboard.html'; // Redirect to dashboard
        setCookie("VOSSIE_TOKEN", token, 7); // Set the cookie to expire in 7 days
        window.location.href = '../'; // Redirect to dashboard
    } else {
        document.getElementById('error-message').textContent = 'Invalid credentials. Please try again.';
    }
});