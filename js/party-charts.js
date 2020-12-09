$(document).ready(function () {
    $.getJSON("data.json", function (adData) {
        let searchParams = new URLSearchParams(window.location.search)

        if (!searchParams.has("party")) {
            $("#party-specific-charts").append("<p>No Party Provided.</p>");
            return;
        }

        let party = searchParams.get("party");

        if (!Object.keys(adData["party-specific-data"]).includes(party)) {
            $("#party-specific-charts").append("<p>Party Not Found.</p>");
            return;
        }

        $("#party-specific-charts").append(
            `<div class="text-center">
                <h1>${party} Graphs</h1>
                <p class="lead">${party} ran <strong>${adData['ads-per-party'][party]}</strong> ads and spent an estimated <strong>€${adData['spending-per-party'][party].toFixed(2)}</strong>.</p>
            </div>
            <hr>`);


        ["Spending", "Impressions"].forEach( function(dataType) {

            let dataTypeLowerCase = dataType.toLowerCase();
            let datatypeDivId = party + "-" + dataTypeLowerCase
            let datatypeDivChartsId = party + "-" + dataTypeLowerCase + "-charts"

            $("#party-specific-charts").append(
                `<div id="${datatypeDivId}">
                    <div class="text-center">
                        <h2>${dataType}</h2>
                    </div>
                    <div id="${datatypeDivChartsId}">
                    </div>
                 </div>`
            );

            ["Region", "Gender", "Age"].forEach( function(lineLabelType) {

                let lineLabelTypeLowerCase = lineLabelType.toLowerCase();

                let LineChartCanvasId = party.toLowerCase() + "-" + lineLabelTypeLowerCase + "-" + dataTypeLowerCase + "-line-chart";
                let DoughnutChartCanvasId = party.toLowerCase() + "-" + lineLabelTypeLowerCase + "-" + dataTypeLowerCase + "-doughnut-chart";

                $("#" + datatypeDivChartsId).append(
                    `<div>
                    <div class="text-center">
                        <h4>(Estimated) ${dataType} per ${lineLabelType} (${party})</h4>
                    </div>
                    
                    <div class="row">
                        <div class="col-8">
                            <canvas id="${LineChartCanvasId}"></canvas>
                            <p>This graph shows ${dataTypeLowerCase} per ${lineLabelTypeLowerCase} over time. Facebook provides a range (e.g. €1000 - €1999 has been spent on an ad) for each ad, this graph is based on the average of the range of each ad.</p>
                        </div>
                        <div class="col-4">
                            <canvas id="${DoughnutChartCanvasId}"></canvas>
                        </div>
                    </div>
                </div>
                <hr>`);


                let lineChart = generateLineGraphConfig(adData,
                    "Average (Estimated) " + dataType + " per " + lineLabelType + " over time (" + party + ")",
                    dataTypeLowerCase + "-per-" + lineLabelTypeLowerCase + "-per-date",
                    party);


                if (dataType === "Spending") {
                    lineChart.options.scales.yAxes = [{
                        ticks: {
                            callback: function (value, index, values) {
                                return "€" + value;
                            }
                        }
                    }];
                    lineChart.options.tooltips = {
                        mode: "x",
                        intersect: false,
                        callbacks: {
                            label: function (tooltipItems, data) {
                                return data.datasets[tooltipItems.datasetIndex].label + ": €" + tooltipItems.yLabel;
                            },

                        }
                    };

                }

                new Chart($("#" + LineChartCanvasId), lineChart);

                let doughnutChart = generateDoughnutChart(adData,
                    "Total (Estimated) " + dataType + " per " + lineLabelType + " (" + party + ")",
                    dataTypeLowerCase + "-per-" + lineLabelTypeLowerCase,
                    party)
                new Chart($("#" + DoughnutChartCanvasId), doughnutChart);
            })
        });
    });
});
