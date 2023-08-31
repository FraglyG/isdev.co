const fileInput = document.getElementById('fileInput');
const fileDeleteInput = document.getElementById('fileDeleteInput');
const passInput = document.getElementById('passwordInput');

const uploadButton = document.getElementById('uploadButton');
const deleteButton = document.getElementById('deleteButton');
const passButton = document.getElementById('passwordButton');

const uploadStatus = document.getElementById('uploadStatusMessage');
const deleteStatus = document.getElementById('deleteStatusMessage');
const passwordStatus = document.getElementById('passwordStatusMessage');

const overlay = document.getElementById('overlay');

const serverUrl = `https://cdn.isdev.co`
let userPassword = ""

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

async function testPassword(password) {
    try {
        const response = await fetch(serverUrl + '/verify_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'password': password
            },
        });

        if (response.ok) {
            return { isCorrect: true, text: 'Password correct.' };
        } else if (response.status == 429) {
            return { isCorrect: false, text: 'Too many attempts. Please try again in 1 minute.' };
        } else {
            return { isCorrect: false, text: 'Wrong password.' };
        }
    } catch (error) {
        console.error('Error checking password:', error);
        return { isCorrect: false, text: 'An error occurred.' };
    }
}

async function refreshList() {
    const listData = await fetch(serverUrl + '/list', {
        method: 'GET',
        headers: {
            'password': userPassword
        },
    })
    const list = await listData.json()

    const listElement = document.getElementById('file_list')
    listElement.innerHTML = ''

    list.forEach((item) => {
        const listItem = document.createElement('li')
        listItem.textContent = item
        listElement.appendChild(listItem)
    })
}

uploadButton.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) {
        uploadStatus.textContent = 'Please select a file.';
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(serverUrl + '/upload', {
            method: 'POST',
            headers: {
                'password': userPassword
            },
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            uploadStatus.textContent = `File uploaded.<br>Link: ${data.link}<br>Download: ${data.download_link}`;
        } else {
            uploadStatus.textContent = 'Error uploading file.';
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        uploadStatus.textContent = 'An error occurred.';
    }

    refreshList()
});

deleteButton.addEventListener('click', async () => {
    const fileName = fileDeleteInput.value;
    if (!fileName) {
        deleteStatus.textContent = 'Please select a file.';
        return;
    }

    try {
        const response = await fetch(serverUrl + '/delete/' + fileName, {
            method: 'POST',
            headers: {
                'password': userPassword
            },
        });

        const data = await response.json();
        if (response.ok) {
            deleteStatus.textContent = `File deleted.`;
        } else {
            deleteStatus.textContent = 'Error deleting file.';
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        deleteStatus.textContent = 'An error occurred.';
    }

    refreshList()
})

passButton.addEventListener('click', async () => {
    const password = passInput.value;
    if (!password) {
        passwordStatus.textContent = 'Please enter a password.';
        return;
    }

    const { isCorrect, text } = await testPassword(password);
    passwordStatus.textContent = text;
    if (isCorrect) {
        userPassword = password
        overlay.style.display = "none"
        setCookie("password", password, 7)
        refreshList()
    }
})

const pass = getCookie("password")
if (pass) {
    (async () => {
        const { isCorrect, text } = await testPassword(pass);
        passwordStatus.textContent = text;
        if (isCorrect) {
            userPassword = pass
            overlay.style.display = "none"
            refreshList()
        }
    })()
}