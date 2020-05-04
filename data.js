const URL = 'https://pomber.github.io/covid19/timeseries.json';

let casesPerDay = new Array();
let allCountries = new Object();

function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }

    return [day, month, year].join('.');
}

async function loadCases() {
    const cases = await fetch(URL)
                      .then(response => response.json())
                      .then(data => {return data});
    allCountries = cases;
    let arr = new Array();

    cases['Romania'].forEach(day => {
        arr.push(day);
    });

    casesPerDay = arr;

    const last_day = arr[arr.length - 1];
    const prev_day = arr[arr.length - 2];

    const last_active =
        last_day.confirmed - last_day.recovered - last_day.deaths;
    const prev_active =
        prev_day.confirmed - prev_day.recovered - prev_day.deaths;

    document.getElementById('current-date').innerHTML =
        formatDate(last_day.date);
    document.getElementById('active-cases').innerHTML = last_active;
    document.getElementById('active-cases-today').innerHTML =
        `(+${last_active - prev_active})`;
    document.getElementById('confirmed-cases').innerHTML = last_day.confirmed;
    document.getElementById('confirmed-cases-today').innerHTML =
        `(+${last_day.confirmed - prev_day.confirmed})`;
    document.getElementById('recovered-cases').innerHTML = last_day.recovered;
    document.getElementById('recovered-cases-today').innerHTML =
        `(+${last_day.recovered - prev_day.recovered})`;
    document.getElementById('lost-cases').innerHTML = last_day.deaths;
    document.getElementById('lost-cases-today').innerHTML =
        `(+${last_day.deaths - prev_day.deaths})`;
};

this.onload = loadCases;
setInterval(loadCases, 1000 * 60);  // Update la fiecare minut

function search() {
    let toSearch = document.getElementById('country-name').value;
    let country = allCountries[toSearch];
    let numCases = 0;
    let numActive = 0;
    let numRecovered = 0;
    let numDeaths = 0;
    let paragraph = document.getElementById('country-summary');

    if(country) {
        console.log(`Submitted: ${toSearch}`);

        country.forEach(day => {
            numCases = day.confirmed;
            numRecovered = day.recovered;
            numDeaths = day.deaths;
        });

        numActive = numCases - numRecovered - numDeaths;

        paragraph.innerHTML = `${numActive} cazuri active <br> ${numCases} cazuri totale <br> ${numRecovered} cazuri tratate <br> ${numDeaths} decese`;
    }
    else {
        console.log(`Could not find country: ${toSearch}`);
        paragraph.innerHTML = `Nu am putut gasi tara: ${toSearch}!`;
    }
}

var blackTheme = false;

function toggleTheme() {
    let website = document.getElementById('website');
    let headers = document.querySelectorAll('#website .header');
    let highlighted = document.querySelectorAll('.highlight-text');
    let bar = document.querySelector('#website .header hr');
    let footer = document.querySelector('#website .footer');
    let buttons = document.querySelectorAll('#website .content .button');
    let eachDayTable = document.querySelectorAll('#each-day-table, #each-day-table th, #each-day-table td');
    let rest = document.querySelectorAll('#rest-table, #rest-table th, #rest-table td');
    let disclaimers = [
        'active-cases',
        'active-cases-today',
        'confirmed-cases',
        'confirmed-cases-today',
        'recovered-cases',
        'recovered-cases-today',
        'lost-cases',
        'lost-cases-today'
    ];

    if(blackTheme === false) {
        website.style.backgroundColor = '#FFF';
        bar.style.color = '#000';

        for(let i = 0; i < headers.length; ++i) {
            headers[i].style.backgroundColor = '#FFF';
        }
    
        for(let i = 0; i < highlighted.length; ++i) {
            highlighted[i].style.color = '#000';
        }

        for(let i = 0; i < disclaimers.length; ++i) {
            document.getElementById(disclaimers[i]).style.color = '#000';
        }

        for(let i = 0; i < buttons.length; ++i) {
            buttons[i].style.backgroundColor = '#000';
        }

        for(let i = 0; i < eachDayTable.length; ++i) {
            eachDayTable[i].style.border = '1px solid #000';
        }

        for(let i = 0; i < rest.length; ++i) {
            rest[i].style.border = '1px solid #000';
        }
 
        footer.style.backgroundColor = '#000';
    }
    else {
        website.style.backgroundColor = '#DDD';
        bar.style.color = '#FC5A03';

        for(let i = 0; i < headers.length; ++i) {
            headers[i].style.backgroundColor = '#DDD';
        }

        for(let i = 0; i < highlighted.length; ++i) {
            highlighted[i].style.color = '#FC5A03';
        }

        for(let i = 0; i < disclaimers.length; ++i) {
            document.getElementById(disclaimers[i]).style.color = '#FC5A03';
        }

        for(let i = 0; i < buttons.length; ++i) {
            buttons[i].style.backgroundColor = '#FC5A03';
        }

        for(let i = 0; i < eachDayTable.length; ++i) {
            eachDayTable[i].style.border = '1px solid #FC5A03';
        }

        for(let i = 0; i < rest.length; ++i) {
            rest[i].style.border = '1px solid #FC5A03';
        }

        footer.style.backgroundColor = '#FC5A03';
    }

    blackTheme = !blackTheme;
}

this.addEventListener("keydown", function(ev) {
    ev = ev || this.window.event;

    if(ev.key === "|") {
        toggleTheme();
    }
}, true)

let eachDayShow = false;
let eachDayAlreadyCreated = false;

function createTablePerDays() {
    eachDayShow = !eachDayShow;

    if (eachDayShow === false) {
        document.getElementById('each-day-table').style.display = 'none';
        return;
    }
    if (eachDayAlreadyCreated === true) {
        document.getElementById('each-day-table').style.display = 'flex';
        return;
    }

    let table = document.getElementById('each-day-table');

    for (let day in casesPerDay.reverse()) {
        let currDay = casesPerDay[day];

        if (currDay.confirmed <= 0) {
            break;
        }

        let row = table.insertRow();
        row.insertCell(0).innerHTML = formatDate(currDay.date);
        row.insertCell(1).innerHTML = currDay.confirmed;
        row.insertCell(2).innerHTML = currDay.recovered;
        row.insertCell(3).innerHTML = currDay.deaths;
    }

    table.style.display = 'block';
    eachDayAlreadyCreated = true;
}

let others = false;
let othersAlreadyCreated = false;

function createTableForOthers() {
    others = !others;

    if (others === false) {
        document.getElementById('rest-table').style.display = 'none';
        return;
    }
    if (othersAlreadyCreated === true) {
        document.getElementById('rest-table').style.display = 'block';
        return;
    }

    let table = document.getElementById('rest-table');

    let countries = new Array();

    for (let country in allCountries) {
        let currCountry =
            allCountries[country][allCountries[country].length - 1];
        console.log(currCountry);
        countries.push({
            name: country,
            confirmed: currCountry.confirmed,
            recovered: currCountry.recovered,
            deaths: currCountry.deaths
        });
    }

    countries.sort(function(a, b) {
        return b.confirmed - a.confirmed;
    });

    let count = 0;

    for (let i = 0; i < countries.length; ++i) {
        count++;

        let row = table.insertRow();
        row.insertCell(0).innerHTML = count;
        row.insertCell(1).innerHTML = countries[i].name;
        row.insertCell(2).innerHTML = countries[i].confirmed;
        row.insertCell(3).innerHTML = countries[i].recovered;
        row.insertCell(4).innerHTML = countries[i].deaths;
    }

    table.style.display = 'block';
    othersAlreadyCreated = true;
}
