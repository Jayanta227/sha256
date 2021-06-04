let buf, uarr, anim;
let reader, file;

document.getElementById('button').addEventListener('click',
    function () {
        document.getElementById('input').click();
    });

document.getElementById('drag').addEventListener('dragover',
    function (event) {
        event.preventDefault();
        this.setAttribute('style', 'background-color:rgb(226, 250, 187)');
    });

document.getElementById('drag').addEventListener('dragleave',
    function (event) {
        event.preventDefault();
        this.removeAttribute('style');
    });

document.getElementById('drag').addEventListener('drop',
    function (event) {
        event.preventDefault();
        readFile(event.dataTransfer);
    });

function readFile(input) {
    start_animate();
    file = input.files[0];
    reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = function (e) {
        document.getElementById('check_btn').removeAttribute('disabled');
        document.getElementById('base64_btn').removeAttribute('disabled');
        buf = reader.result
        uarr = new Uint8Array(buf);
        // console.log(uarr);
        // console.log(atob(btoa(uarr)));
        document.getElementById('span').innerHTML = file.name+' selected';
        stop_animate();
    };

    reader.onerror = function () {
        console.log(reader.error);
    };
}

// let downloadBlob, downloadURL;

// downloadBlob = function (data, fileName, mimeType) {
//     var blob, url;
//     blob = new Blob([data], {
//         type: mimeType
//     });
//     url = window.URL.createObjectURL(blob);
//     downloadURL(url, fileName);
//     setTimeout(function () {
//         return window.URL.revokeObjectURL(url);
//     }, 1000);
// };

// downloadURL = function (data, fileName) {
//     var a;
//     a = document.createElement('a');
//     a.href = data;
//     a.download = fileName;
//     document.body.appendChild(a);
//     a.style = 'display: none';
//     a.click();
//     a.remove();
// };
// downloadBlob( uarr, 'some-file.txt', 'application/octet-stream');



async function digestMessage() {
    const hashBuffer = await crypto.subtle.digest('SHA-256', uarr);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// const digestHex = await digestMessage();
// console.log(digestHex);

const show_result = async () => {
    document.getElementById('check_btn').setAttribute('disabled', 'disabled');
    const digestHex = await digestMessage();
    let result = document.getElementById('result');
    result.innerHTML = digestHex;

    console.log(digestHex);
    delete digestHex;
}

const show_encode = async () => {
    if (file.size < 40000) {
        document.getElementById('base64_btn').setAttribute('disabled', 'disabled');
        const base64str = btoa(uarr);
        let result = document.getElementById('result');
        result.innerHTML = `<textarea>${base64str}</textarea>`;
    }else{
        alert('file is too large for base64 encoding');
    }
}

const start_animate = () => {
    document.getElementById('loading').innerHTML = 'loading';
    anim = setInterval(() => {
        let loading = document.getElementById('loading')
        loading.innerHTML += '.';
        if (loading.innerHTML == 'loading..........') {
            loading.innerHTML = 'loading'
        }
    }, 500);
}
const stop_animate = () => {
    clearInterval(anim);
    document.getElementById('loading').innerHTML = '';
}