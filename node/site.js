/* Partea de AJAX */
function sendGetRequest(to, callback) {
    let url = new URL(to, 'http://localhost:8080');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url.toString());
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr);
        }
    }
    xhr.send();
}

function getText() {
    sendGetRequest('/', (xhr) => {
        document.getElementById('whatever').innerHTML = xhr.responseText;
    });
}

function getContent() {
    sendGetRequest('/data', (xhr) => {
        document.getElementById('content').innerHTML = xhr.responseText;
    });
}

function getNum() {
    sendGetRequest('/num', (xhr) => {
        document.getElementById('nr-elem').innerHTML = xhr.responseText;
    });
}

function getReverse() {
    sendGetRequest('/data/reverse', (xhr) => {
        document.getElementById('content2').innerHTML = xhr.responseText;
    });
}