// const fileInput = document.getElementById('fileInput');
// const fileDeleteInput = document.getElementById('fileDeleteInput');
// const passInput = document.getElementById('passwordInput');

// const uploadButton = document.getElementById('uploadButton');
// const deleteButton = document.getElementById('deleteButton');
// const passButton = document.getElementById('passwordButton');

// const uploadStatus = document.getElementById('uploadStatusMessage');
// const deleteStatus = document.getElementById('deleteStatusMessage');
// const passwordStatus = document.getElementById('passwordStatusMessage');

// const overlay = document.getElementById('overlay');

// const serverUrl = `https://cdn.isdev.co`
// let userPassword = ""

// // Function to set a cookie
// function setCookie(name, value, days) {
//     const expires = new Date();
//     expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
//     document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
// }

// // Function to get a cookie value
// function getCookie(name) {
//     const cookieName = `${name}=`;
//     const cookies = document.cookie.split(';');
//     for (let i = 0; i < cookies.length; i++) {
//         let cookie = cookies[i].trim();
//         if (cookie.startsWith(cookieName)) {
//             return cookie.substring(cookieName.length, cookie.length);
//         }
//     }
//     return null;
// }

// async function testPassword(password) {
//     try {
//         const response = await fetch(serverUrl + '/verify_password', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'password': password
//             },
//         });

//         if (response.ok) {
//             return { isCorrect: true, text: 'Password correct.' };
//         } else if (response.status == 429) {
//             return { isCorrect: false, text: 'Too many attempts. Please try again in 1 minute.' };
//         } else {
//             return { isCorrect: false, text: 'Wrong password.' };
//         }
//     } catch (error) {
//         console.error('Error checking password:', error);
//         return { isCorrect: false, text: 'An error occurred.' };
//     }
// }

// async function refreshList() {
//     const listData = await fetch(serverUrl + '/list', {
//         method: 'GET',
//         headers: {
//             'password': userPassword
//         },
//     })
//     const list = await listData.json()

//     const listElement = document.getElementById('file_list')
//     listElement.innerHTML = ''

//     list.forEach((item) => {
//         const listItem = document.createElement('li')
//         listItem.textContent = item
//         listElement.appendChild(listItem)
//     })
// }

// uploadButton.addEventListener('click', async () => {
//     const file = fileInput.files[0];
//     if (!file) {
//         uploadStatus.textContent = 'Please select a file.';
//         return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//         const response = await fetch(serverUrl + '/upload', {
//             method: 'POST',
//             headers: {
//                 'password': userPassword
//             },
//             body: formData,
//         });

//         const data = await response.json();
//         if (response.ok) {
//             uploadStatus.textContent = `File uploaded.<br>Link: ${data.link}<br>Download: ${data.download_link}`;
//         } else {
//             uploadStatus.textContent = 'Error uploading file.';
//         }
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         uploadStatus.textContent = 'An error occurred.';
//     }

//     refreshList()
// });

// deleteButton.addEventListener('click', async () => {
//     const fileName = fileDeleteInput.value;
//     if (!fileName) {
//         deleteStatus.textContent = 'Please select a file.';
//         return;
//     }

//     try {
//         const response = await fetch(serverUrl + '/delete/' + fileName, {
//             method: 'POST',
//             headers: {
//                 'password': userPassword
//             },
//         });

//         const data = await response.json();
//         if (response.ok) {
//             deleteStatus.textContent = `File deleted.`;
//         } else {
//             deleteStatus.textContent = 'Error deleting file.';
//         }
//     } catch (error) {
//         console.error('Error deleting file:', error);
//         deleteStatus.textContent = 'An error occurred.';
//     }

//     refreshList()
// })

// passButton.addEventListener('click', async () => {
//     const password = passInput.value;
//     if (!password) {
//         passwordStatus.textContent = 'Please enter a password.';
//         return;
//     }

//     const { isCorrect, text } = await testPassword(password);
//     passwordStatus.textContent = text;
//     if (isCorrect) {
//         userPassword = password
//         overlay.style.display = "none"
//         setCookie("password", password, 7)
//         refreshList()
//     }
// })

// const pass = getCookie("password")
// if (pass) {
//     (async () => {
//         const { isCorrect, text } = await testPassword(pass);
//         passwordStatus.textContent = text;
//         if (isCorrect) {
//             userPassword = pass
//             overlay.style.display = "none"
//             refreshList()
//         }
//     })()
// }

const serverUrl = "https://cdn.isdev.co"
let userPassword = ""
let currentFileLocation = ""
let fileList = []

const fileTypes = {
    "image": ["png", "jpg", "jpeg"],
    "video": ["mp4", "mov", "avi", "mkv"],
    "audio": ["mp3", "wav", "ogg"],
    "document": ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"],
    "code": ["html", "css", "js", "json", "py", "java", "c", "cpp", "cs", "php", "rb", "go", "sh", "swift", "sql"],
    "archive": ["zip", "rar", "7z", "tar", "gz", "xz"],
}

function getFileType(file) {
    if (file.isFolder) return "folder"

    const extension = file.extension.toLowerCase().match(/[^.]+$/)[0]
    for (const [key, value] of Object.entries(fileTypes)) {
        if (value.includes(extension)) {
            return key
        }
    }
    return "other"
}

function updateFileLocation() {
    const fileLocationElement = document.getElementById('file-location-text')
    fileLocationElement.innerText = "files\\" + currentFileLocation
}

function uploadFile(formData) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const percentage = (event.loaded / event.total) * 100;
                console.log(`Upload Progress: ${percentage.toFixed(2)}%`);
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                console.log('File uploaded.');
                refreshFiles();
                resolve(xhr.responseText);
            } else {
                console.error('Error uploading file.');
                reject(xhr.statusText);
            }
        });

        xhr.addEventListener('error', () => {
            console.error('Error uploading file.');
            reject(xhr.statusText);
        });

        xhr.open('POST', serverUrl + '/upload', true);
        xhr.setRequestHeader('password', userPassword);
        xhr.send(formData);
    });
}

function convertFileSize(fileSizeBytes) {
    const sizes = ["b", "kb", "mb", "gb", "tb"]
    if (fileSizeBytes == 0) return "0b"
    const i = Math.floor(Math.log(fileSizeBytes) / Math.log(1024))
    return Math.round(fileSizeBytes / Math.pow(1024, i), 2) + sizes[i]
}

function calculateFolderSize(folderName) {
    let totalSize = 0
    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]
        if (!file.name.startsWith(folderName + "\\")) continue
        totalSize += file.size
    }
    return totalSize
}

function connectOpenFolderFunction(element) {
    element.addEventListener('click', () => {
        const fileElement = element.parentElement.parentElement
        const fileName = fileElement.querySelector('.file-name').innerText
        currentFileLocation += fileName + "\\"
        refreshList()
    })
}

function connectDeleteFileFunction(element, fileName) {
    element.addEventListener('click', async () => {
        try {
            const response = await fetch(serverUrl + '/delete/' + fileName.replace(/\\/g, ":"), {
                method: 'POST',
                headers: {
                    'password': userPassword
                },
            });

            const data = await response.json();
            if (response.ok) {
                console.log("File deleted.")
                refreshFiles()
            } else {
                console.error('Error deleting file.');
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    })
}

function connectCopyDownloadLinkFunction(element, fileName) {
    const downloadLinkAppend = serverUrl + "/download/" + fileName.replace(/\\/g, ":") // replace \ with : because : is not allowed in file names
    element.addEventListener('click', () => {
        navigator.clipboard.writeText(downloadLinkAppend)
    })
}

function connectDownloadFileFunction(element, fileName) {
    const downloadLinkAppend = serverUrl + "/download/" + fileName.replace(/\\/g, ":")
    element.addEventListener('click', () => {
        window.open(downloadLinkAppend)
    })
}

const fileBackButton = document.getElementById('file-location-back')
fileBackButton.addEventListener('click', () => {
    if (currentFileLocation == "") return
    currentFileLocation = currentFileLocation.substring(0, currentFileLocation.length - 1)
    currentFileLocation = currentFileLocation.substring(0, currentFileLocation.lastIndexOf("\\") + 1)
    refreshList()
})

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

async function refreshFiles() {
    const listData = await fetch(serverUrl + '/list', {
        method: 'GET',
        headers: {
            'password': userPassword
        },
    })
    const list = await listData.json()
    // list: {name: string, created: Date, size: number, path: string}[]


    // put folders first in the list
    list.sort((a, b) => {
        if (a.name.includes(".") && !b.name.includes(".")) return 1
        if (!a.name.includes(".") && b.name.includes(".")) return -1
        return 0
    })

    fileList = list

    console.log(list)

    await refreshList()
}

async function refreshList() {
    const fileContainer = document.getElementById('file-container')
    fileContainer.innerHTML = ''

    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]

        const filePath = file.name.split("\\")
        const fileName = filePath.pop()

        console.log("--------------------------------")
        console.log("File Path: ", filePath.join("\\"))
        console.log("File Name: ", fileName)

        if ((currentFileLocation == "" && file.name.includes("\\")) || filePath.join("\\") != currentFileLocation.slice(0, -1)) continue

        const fileType = getFileType(file)
        console.log(fileType)

        const fileElement = document.createElement('div')
        fileElement.classList.add('file')

        //  FILE INFO
        const fileInfoElement = document.createElement('div')
        fileInfoElement.classList.add('file-info')

        const fileIconElement = document.createElement('div')
        fileIconElement.classList.add('file-icon', "file-type-" + fileType)

        const fileNameElement = document.createElement('div')
        fileNameElement.classList.add('file-name')

        const fileNameTextElement = document.createElement('p')
        fileNameTextElement.innerText = fileName

        const fileMetadataElement = document.createElement('div')
        fileMetadataElement.classList.add('file-metadata')

        const fileSizeElement = document.createElement('p')
        fileSizeElement.classList.add('file-size')
        fileSizeElement.innerText = fileType == "folder" ? convertFileSize(calculateFolderSize(file.name)) : convertFileSize(file.size)

        const normalizedDate = new Date(file.created)
        const normalizedDateString = normalizedDate.getDate() + "/" + (normalizedDate.getMonth() + 1) + "/" + normalizedDate.getFullYear()

        const fileCreatedElement = document.createElement('p')
        fileCreatedElement.classList.add('file-created')
        fileCreatedElement.innerText = normalizedDateString // DD/MM/YYYY

        fileMetadataElement.appendChild(fileSizeElement)
        fileMetadataElement.appendChild(fileCreatedElement)

        fileNameElement.appendChild(fileNameTextElement)

        fileInfoElement.appendChild(fileIconElement)
        fileInfoElement.appendChild(fileNameElement)
        fileInfoElement.appendChild(fileMetadataElement)

        //  FILE ACTIONS
        const fileActionsElement = document.createElement('div')
        fileActionsElement.classList.add('file-actions')

        if (fileType != "folder") {
            const fileCopyDownloadLinkElement = document.createElement('div')
            fileCopyDownloadLinkElement.classList.add('file-button', 'copy-download-link')
            connectCopyDownloadLinkFunction(fileCopyDownloadLinkElement, file.name)

            const fileDownloadElement = document.createElement('div')
            fileDownloadElement.classList.add('file-button', 'file-download')
            connectDownloadFileFunction(fileDownloadElement, file.name)

            fileActionsElement.appendChild(fileDownloadElement)
            fileActionsElement.appendChild(fileCopyDownloadLinkElement)
        }

        if (fileType == "folder") {
            const fileOpenElement = document.createElement('div')
            fileOpenElement.classList.add('file-button', 'open-folder')
            connectOpenFolderFunction(fileOpenElement)

            fileActionsElement.appendChild(fileOpenElement)
        }

        const fileDeleteElement = document.createElement('div')
        fileDeleteElement.classList.add('file-button', 'file-delete')
        connectDeleteFileFunction(fileDeleteElement, file.name)

        fileActionsElement.appendChild(fileDeleteElement)

        // APPEND TO FILE ELEMENT
        fileElement.appendChild(fileInfoElement)
        fileElement.appendChild(fileActionsElement)

        fileContainer.appendChild(fileElement)
    }

    updateFileLocation()

    const treeView = document.getElementById('tree-view');
    treeView.innerHTML = createFileTree()
}

function createFileTree() {
    let fileTree = {};

    fileList.forEach(file => {
        let pathParts = file.name.split("\\");
        let currentLevel = fileTree;

        pathParts.forEach((part, index) => {
            if (!currentLevel[part]) {
                currentLevel[part] = (index === pathParts.length - 1 && !file.isFolder) ? null : {};
            }
            currentLevel = currentLevel[part];
        });
    });

    function buildHtml(tree) {
        let html = '<ul class="navbar-tree">';

        for (let key in tree) {
            html += '<li>' + key;
            if (tree[key] !== null) {
                html += buildHtml(tree[key]);
            }
            html += '</li>';
        }

        html += '</ul>';

        return html;
    }

    return buildHtml(fileTree);
}

const passwordStatus = document.getElementById('passwordStatusMessage');
const passButton = document.getElementById('passwordButton');
const passInput = document.getElementById('passwordInput');
const overlay = document.getElementById('overlay');

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
        refreshFiles()
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
            refreshFiles()
        }
    })()
}

// upload file when user puts file over file container
const fileContainer = document.body
fileContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
})

fileContainer.addEventListener('drop', async (e) => {
    e.preventDefault();
    console.log("drop")

    if (!e.dataTransfer.items || e.dataTransfer.items.length == 0) return

    // Initialize a variable to store the current directory path
    let currentDirectory = currentFileLocation.replace(/\\/g, ":");
    console.log(currentDirectory)

    // Loop through each item in the drop event
    for (let i = 0; i < e.dataTransfer.items.length; i++) {
        // Use webkitGetAsEntry to get more information about the item
        const item = e.dataTransfer.items[i].webkitGetAsEntry();

        if (!item) continue; // Skip items without entry information

        if (item.isFile) {
            // If it's a file, get the file and upload it with the directory path
            const file = e.dataTransfer.items[i].getAsFile();

            // Add the current directory path to the file name
            const fileNameWithPath = currentDirectory + (currentDirectory ? ':' : '') + file.name;

            console.log(fileNameWithPath);
            if (file.size == 0 && !file.name.includes(".")) continue

            const formData = new FormData();
            formData.append('file', file, fileNameWithPath);

            uploadFile(formData);
        } else if (item.isDirectory) {
            // If it's a directory, update the current directory path
            currentDirectory = currentDirectory + (currentDirectory ? ':' : '') + item.name;

            // Handle the directory
            await handleDirectoryUpload(item, currentDirectory);

            // Remove the directory name from the current path when going back up
            currentDirectory = currentDirectory.replace(`:${item.name}`, '');
        }
    }
})

async function handleDirectoryUpload(directory, currentDirectory) {
    // Read the contents of the directory
    const reader = directory.createReader();
    const entries = await new Promise((resolve) => reader.readEntries(resolve));

    // Loop through each entry in the directory
    for (const entry of entries) {
        if (entry.isFile) {
            // If it's a file, get the file and upload it with the directory path
            const file = await new Promise((resolve) => entry.file(resolve));

            console.log(file);

            // Add the current directory path to the file name
            const fileNameWithPath = currentDirectory + (currentDirectory ? ':' : '') + entry.name;

            console.log(fileNameWithPath)

            const formData = new FormData();
            formData.append('file', file, fileNameWithPath);

            uploadFile(formData);
        } else if (entry.isDirectory) {
            // If it's another directory, handle it recursively with the updated directory path
            console.log(entry.name);
            await handleDirectoryUpload(entry, currentDirectory + (currentDirectory ? ':' : '') + entry.name);
        }
    }
}

