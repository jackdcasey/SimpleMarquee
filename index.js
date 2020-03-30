document.addEventListener("DOMContentLoaded", function() {

    var params = getUrlVars();

    if ('url' in params) {
        var sheetsURL = getUrlVars()['url'];
        var delay = getUrlVars()['delay'];

        showOutput();
        startDisplay(sheetsURL, delay);
    }
    else {
        showInput();
    }
});

function urlEnter() {
    window.location.href = window.location.href + "?url=" + document.getElementById('urlInput').value + "&delay=" + document.getElementById('delayInput').value;
}

async function startDisplay(sheetsUrl, delay) {

    displayText = document.getElementById('outputParagraph');
    displayTitle = document.getElementById('title')

    displayText.innerHTML = "Loading..."

    sheetsHtml = await downloadHtml(sheetsUrl)
    sheetsData = convertSheetsPage(sheetsHtml)
    displayQueue = sheetsData.slice(1)

    displayTitle.innerHTML = sheetsData[0]

    while (displayQueue.length > 0) {

        displayText.innerHTML = displayQueue.shift()

        if (displayQueue.length == 0) {
            sheetsHtml = await downloadHtml(sheetsUrl)
            newData = convertSheetsPage(sheetsHtml).slice(1)
            displayQueue = newData
        }

        await sleep(delay * 1000)
    }
}
async function downloadHtml(sheetsURL) {

    console.log("Loading from: ".concat(sheetsURL))

    const corsURL = "https://cors-anywhere.herokuapp.com/".concat(sheetsURL);

    return fetch(corsURL)
    .then((response) => response.text())
    .then((responseText)=>{return responseText})
    .catch(err => console.log(err));
}

function convertSheetsPage(sheetsPage) {

    var parser = new DOMParser();

    let document = parser.parseFromString(sheetsPage, 'text/html');

    linesOut = []
    try {
        linesOut.push(document.querySelector('meta[property="og:title"]').content);
    } catch (error) {
        linesOut.push("Simple Marquee")
    }


    let lines = document.querySelectorAll('td[dir="ltr"]');

    for (i = 0; i < lines.length; i++){

        if (lines[i].classList.contains('s1'))
        {
            linesOut.push(lines[i].querySelector('div').innerHTML);
        }
        else
        {
            linesOut.push(lines[i].innerHTML);
        }
    }

    return linesOut
}

function getUrlVars() {

    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) {
      vars[key] = value;
    });
    return vars;
}

function showInput() {
    var inputDiv = document.getElementById('inputDiv');
    inputDiv.classList.remove('hidden');
}

function showOutput() {
    var inputDiv = document.getElementById('outputDiv');
    inputDiv.classList.remove('hidden');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}