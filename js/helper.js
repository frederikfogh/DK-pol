function addPercentageToDoughnutLabel(tooltipItem, data) {
    // https://stackoverflow.com/questions/37257034/chart-js-2-0-doughnut-tooltip-percentages/49717859#49717859
    let dataset = data.datasets[tooltipItem.datasetIndex];
    let total = dataset._meta[Object.keys(dataset._meta)[0]].total;
    let value = dataset.data[tooltipItem.index];
    let percentage = (value / total * 100).toFixed(2);
    return value.toFixed(2) + " (" + percentage + "%)";
}

function getDaysArray(startDate) {
    let dates=[];
    let now=new Date();
    for(let dt=new Date(startDate); dt<=now; dt.setDate(dt.getDate()+1)){
        dates.push(new Date(dt).toISOString().split('T')[0]);
    }
    return dates;
}

function generateLineGraphConfig(adData, title, dataKey) {
    let graphConfig = {
        type: "line",
        data: {
            labels: getDaysArray(new Date("2020-01-01")),
            datasets: []
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: title,
                fontSize: 18,
            },
            legend: {
                position: "bottom",
            },
            scales: {
                xAxes: [{
                    type: "time",
                }],
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                    },
                    zoom: {
                        enabled: true,
                        drag: false,
                    }
                }
            },
        },
    };

    for (let party in adData["party-specific-data"]) {
        graphConfig.data.datasets.push(
            {
                label: party,
                data: adData["party-specific-data"][party][dataKey],
                fill: false,
                backgroundColor: adData["party-specific-data"][party]["color"],
                borderColor: adData["party-specific-data"][party]["color"],
                pointRadius: 0,
                borderWidth: 2,
            });
    }

    return graphConfig;
}

function generateDoughnutChart(adData, title, dataKey) {
    let chartConfig = {
        type: "doughnut",
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            title: {
                display: true,
                text: title,
                fontSize: 18,
            },
            legend: {
                position: "bottom",
            },
            tooltips: {
                callbacks: {
                    label: addPercentageToDoughnutLabel,
                    title: function (tooltipItem, data) {
                        return data.labels[tooltipItem[0].index];
                    }
                }
            },
        }
    };

    for (let party in adData["party-specific-data"]) {
        chartConfig.data.labels.push(party);
        chartConfig.data.datasets[0].data.push(adData["party-specific-data"][party][dataKey])
        chartConfig.data.datasets[0].backgroundColor.push(adData["party-specific-data"][party]["color"])
    }

    return chartConfig;
}