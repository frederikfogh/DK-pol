const COLORS = {
    'VVD': '#ff7709',
    'FvD': '#841818',
    'GL': '#50c401',
    'DENK': '#41bac2',
    'D66': '#01af40',
    'CDA': '#007b5f',
    '50P': '#92278f',
    'PvdA': '#C0392B',
    'SGP': '#024a90',
    'CU': '#012466',
    'SP': '#fe0000',
    'PvdD': '#006c2e',
    'PVV': '#212F3D',

    'male': '#0000ff',
    'female': '#ffc0cb',

    '13-17': '#641E16',
    '18-24': '#512E5F',
    '25-34': '#154360',
    '35-44': '#0E6251',
    '45-54': '#145A32',
    '55-64': '#7D6608',
    '65+': '#784212',

    'Drenthe': '#AED6F1',
    'Friesland': '#AF7AC5',
    'Gelderland': '#E74C3C',
    'Groningen': '#ABEBC6',
    'Limburg': '#E74C3C',
    'North Brabant': '#E74C3C',
    'Noord-Holland': '#239B56',
    'Utrecht': '#F4D03F',
    'Zeeland': '#D7BDE2',
    'Zuid-Holland': '#EB984E',
    'Overijssel': '#B7950B',
    'Flevoland': '#EB984E',
}

const PARTIES = ["50P", "CDA", "CU", "D66", "DENK", "FvD", "GL", "PVV", "PvdA", "PvdD", "SGP", "SP", "VVD"]

function addPercentageToBarLabel(tooltipItem, data) {
    let dataset = data.datasets[tooltipItem.datasetIndex];

    let total = 0;
    dataset.data.forEach(function (element){
        total += element;
    });

    let value = dataset.data[tooltipItem.index];
    let percentage = (value / total * 100).toFixed(2);
    return value.toFixed(2) + " (" + percentage + "%)";
}

function getDaysArray(startDate) {
    let dates = [];
    let now = new Date();
    for (let dt = new Date(startDate); dt <= now; dt.setDate(dt.getDate() + 1)) {
        dates.push(new Date(dt).toISOString().split('T')[0]);
    }
    return dates;
}

function generateLineGraphConfig(adData, title, dataKey, specificParty = "") {
    let graphConfig = {
        type: "line",
        data: {
            labels: getDaysArray(new Date("2020-01-01")),
            datasets: []
        },
        options: {
            animation: {
                duration: 0
            },
            hover: {
                animationDuration: 0
            },
            responsiveAnimationDuration: 0,
            responsive: true,
            title: {
                display: true,
                text: title,
                fontSize: 18,
            },
            legend: {
                position: "bottom",
                                labels: {padding: 7,},
            },
            scales: {
                xAxes: [{
                    type: "time",
                }],
            },
            tooltips: {
                mode: 'x',
                intersect: false,
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x',
                    },
                    zoom: {
                        enabled: true,
                        drag: false,
                        mode: "x",
                    }
                }
            },
        },
    };

    if (specificParty) {
        for (let key in adData["party-specific-data"][specificParty][dataKey]) {
            graphConfig.data.datasets.push(
                {
                    label: key,
                    data: adData["party-specific-data"][specificParty][dataKey][key],
                    fill: true,
                    backgroundColor: COLORS[key],
                    borderColor: COLORS[key],
                    pointRadius: 0,
                    borderWidth: 2,
                });
        }


    } else {
        for (let party in adData["party-specific-data"]) {
            graphConfig.data.datasets.push(
                {
                    label: party,
                    data: adData["party-specific-data"][party][dataKey],
                    fill: false,
                    backgroundColor: COLORS[party],
                    borderColor: COLORS[party],
                    pointRadius: 0,
                    borderWidth: 2,
                });
        }
    }

    return graphConfig;
}

function generateBarChart(adData, title, dataKey, specificParty = "") {
    let chartConfig = {
        type: "horizontalBar",
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
                maxBarThickness: 30,
            }]
        },
        options: {
            animation: {
                duration: 0
            },
            hover: {
                animationDuration: 0
            },
            responsiveAnimationDuration: 0,
            maintainAspectRatio: false,
            responsive: true,
            title: {
                display: true,
                text: title,
                fontSize: 18,
            },
            legend: {
                display: false,
            },
            tooltips: {
                intersect: false,
                callbacks: {
                    label: addPercentageToBarLabel,
                }
            },
        }
    };

    if (specificParty) {

        adData["party-specific-data"][specificParty][dataKey]['order'].forEach( function (key) {
            chartConfig.data.labels.push(key);
            chartConfig.data.datasets[0].data.push(adData["party-specific-data"][specificParty][dataKey]['map'][key])
            chartConfig.data.datasets[0].backgroundColor.push(COLORS[key])
        });


    } else {
        adData[dataKey]['order'].forEach( function (party) {
            chartConfig.data.labels.push(party);
            chartConfig.data.datasets[0].data.push(adData[dataKey]['map'][party])
            chartConfig.data.datasets[0].backgroundColor.push(COLORS[party])
        });
    }

    return chartConfig;
}

$(document).ready(function () {
    PARTIES.forEach(function (party){
        $("#party-specific-charts-navbar-dropdown").append(`<a class="dropdown-item" href="party.html?party=${party}">${party}</a>`);
    });
});