function onAnchorClick(event) {
    chrome.tabs.create({
        selected: true,
        url: event.srcElement.href
    });
    return false;
}

function getStoredData() {
    return JSON.parse(localStorage.getItem('urlToTimeData')) || {};
}

function storeData(urlToTime) {
    localStorage.setItem('urlToTimeData', JSON.stringify(urlToTime));
}

function formatTime(milliseconds) {
    const seconds = milliseconds / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;

    if (hours >= 1) {
        return hours.toFixed(2) + " hours";
    } else if (minutes >= 1) {
        return minutes.toFixed(2) + " minutes";
    } else {
        return seconds.toFixed(2) + " seconds";
    }
}


function buildPopupDom(divName, currentWeekData, previousWeekData) {
    let popupDiv = document.getElementById(divName);

    let table = document.createElement('table');
    table.style.width = '100%';
    popupDiv.appendChild(table);

    let header = table.createTHead();
    let headerRow = header.insertRow(0);
    let urlHeader = document.createElement('th');
    urlHeader.appendChild(document.createTextNode("URL"));
    let currentWeekHeader = document.createElement('th');
    currentWeekHeader.appendChild(document.createTextNode("Current Week Time"));
    let previousWeekHeader = document.createElement('th');
    previousWeekHeader.appendChild(document.createTextNode("Previous Week Time"));
    headerRow.appendChild(urlHeader);
    headerRow.appendChild(currentWeekHeader);
    headerRow.appendChild(previousWeekHeader);

    let body = table.createTBody();

    for (let i = 0; i < currentWeekData.length; i++) {
        let tr = body.insertRow(i);

        let urlCell = document.createElement('td');
        let currentWeekTimeCell = document.createElement('td');
        let previousWeekTimeCell = document.createElement('td');

        urlCell.appendChild(document.createTextNode(currentWeekData[i].url));
        currentWeekTimeCell.appendChild(document.createTextNode(formatTime(currentWeekData[i].time)));
        previousWeekTimeCell.appendChild(document.createTextNode(formatTime(previousWeekData[i].time)));

        tr.appendChild(urlCell);
        tr.appendChild(currentWeekTimeCell);
        tr.appendChild(previousWeekTimeCell);
    }
}

function calculateAverageTime(data) {
    const numEntries = Object.keys(data).length;

    if (numEntries === 0) {
        return 0;
    }

    let totalTime = 0;
    for (let entry in data) {
        totalTime += parseFloat(data[entry]);
    }

    return totalTime / numEntries;
}



function generateCouponCode(length, format) {
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';

    let couponCode = '';

    for (let i = 0; i < length; i++) {
        const char = format[i % format.length];

        if (char === 'A') {
            couponCode += uppercaseLetters.charAt(Math.floor(Math.random() * uppercaseLetters.length));
        } else if (char === 'a') {
            couponCode += lowercaseLetters.charAt(Math.floor(Math.random() * lowercaseLetters.length));
        } else if (char === '0') {
            couponCode += numbers.charAt(Math.floor(Math.random() * numbers.length));
        } else {
            throw new Error(`Invalid format character: ${char}`);
        }
    }

    return couponCode;
}

function displayComparisonStats(currentWeekData, previousWeekData) {
    let currentWeekAverage = calculateAverageTime(currentWeekData);
    let previousWeekAverage = calculateAverageTime(previousWeekData);

    let messageDiv = document.getElementById('message_div');
    messageDiv.innerHTML = `
        <p>Current Week's Daily Average Time: ${formatTime(currentWeekAverage)}</p>
        <p>Previous Week's Daily Average Time: ${formatTime(previousWeekAverage)}</p>
    `;

    if (!isNaN(currentWeekAverage) && !isNaN(previousWeekAverage)) {
        const percentageReduction = ((previousWeekAverage - currentWeekAverage) / previousWeekAverage) * 100;
        if (percentageReduction >= 50) {
            messageDiv.innerHTML += "<p>HIPPHIPP! We are so proud of you for reducing your screentime by 50%!</p>";
            const couponCode = generateCouponCode(10, 'AAA00A00AA');
            const couponCodeParagraph = document.createElement('p');
            couponCodeParagraph.textContent = `Your coupon code: ${couponCode}`;
            messageDiv.appendChild(couponCodeParagraph);
        } else if (percentageReduction >= 25) {
            messageDiv.innerHTML += "<p>Yay you! We celebrate you reducing your screentime by 25%!</p>";
            const couponCode = generateCouponCode(8, 'AAA00A00');
            const couponCodeParagraph = document.createElement('p');
            couponCodeParagraph.textContent = `Your coupon code: ${couponCode}`;
            messageDiv.appendChild(couponCodeParagraph);
        } else if (percentageReduction >= 10) {
            messageDiv.innerHTML += "<p>Congratulations! Enjoy your $10 off for reducing your screentime by 10%!</p>";
            const couponCode = generateCouponCode(6, 'Aa0A0');
            const couponCodeParagraph = document.createElement('p');
            couponCodeParagraph.textContent = `Your coupon code: ${couponCode}`;
            messageDiv.appendChild(couponCodeParagraph);
        } else {
            messageDiv.innerHTML += "<p>Log off for me... No rewards for you! It's time to touch some grass!</p>";
        }
    } else {
        messageDiv.innerHTML += "<p>Unable to calculate the average time. Please check your data.</p>";
    }
}


function buildTypedUrlList(divName) {
    let microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    let oneWeekAgo = new Date().getTime() - microsecondsPerWeek;
    let twoWeeksAgo = new Date().getTime() - 2 * microsecondsPerWeek;

    let numRequestsOutstanding = 0;
    let currentWeekData = {};
    let previousWeekData = {};

    chrome.history.search(
        {
            text: '',
            startTime: twoWeeksAgo,
            maxResults: 10000
        },
        function (historyItems) {
            for (let i = 0; i < historyItems.length; ++i) {
                let url = historyItems[i].url;
                let processVisitsWithUrl = function (url) {
                    return function (visitItems) {
                        processVisits(url, visitItems);
                    };
                };
                chrome.history.getVisits({ url: url }, processVisitsWithUrl(url));
                numRequestsOutstanding++;
            }
            if (!numRequestsOutstanding) {
                onAllVisitsProcessed();
            }
        }
    );

    const processVisits = function (url, visitItems) {
        let currentTime = new Date().getTime();
        let totalTimeSpent = 0;
        for (let i = 0, ie = visitItems.length; i < ie; ++i) {
            if (visitItems[i].transition === 'typed') {
                if (!currentWeekData[url]) {
                    currentWeekData[url] = 0;
                    previousWeekData[url] = 0;
                }

                if (i < ie - 1) {
                    let timeDifference = visitItems[i + 1].visitTime - visitItems[i].visitTime;
                    if (visitItems[i].visitTime > oneWeekAgo) {
                        currentWeekData[url] += timeDifference;
                    } else if (visitItems[i].visitTime > twoWeeksAgo) {
                        previousWeekData[url] += timeDifference;
                    }
                }
            }
        }
        if (!--numRequestsOutstanding) {
            onAllVisitsProcessed();
        }
    };

    const onAllVisitsProcessed = () => {
        let currentWeekDataArray = [];
        let previousWeekDataArray = [];

        fetch('http://localhost:19008/user-activity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentWeekData, previousWeekData }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data sent to the server:', data);
            })
            .catch(error => {
                console.error('Error sending data to the server:', error);
            });

        for (let url in currentWeekData) {
            currentWeekDataArray.push({ url: url, time: currentWeekData[url] });
            previousWeekDataArray.push({ url: url, time: previousWeekData[url] });
        }

        currentWeekDataArray.sort((a, b) => b.time - a.time);
        previousWeekDataArray.sort((a, b) => b.time - a.time);

        buildPopupDom(divName, currentWeekDataArray.slice(0, 10), previousWeekDataArray.slice(0, 10));

        storeData(currentWeekData);
        displayComparisonStats(currentWeekData, previousWeekData);
    };
}

function displayDeals(deals) {
    let dealsList = document.getElementById('deals_list');

    deals.forEach((deal) => {
        let listItem = document.createElement('li');
        listItem.textContent = deal;
        dealsList.appendChild(listItem);
    });
}

function generateAndDisplayDeals() {
    let deals = ["Get $10 OFF when you reduce screentime by 10%", "Reduce screentime by 25% for 25% OFF Order", "Buy One, Get One Free when you reduce your screentime by 50%"];
    displayDeals(deals);
}

document.addEventListener('DOMContentLoaded', function () {
    buildTypedUrlList('typedUrl_div');
    generateAndDisplayDeals();
});  