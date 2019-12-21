var listOfSubjects = [];
var nameSelector;
$(document).ready(function () {
    nameSelector = document.querySelector('div.plot-main select.subjectData');
    console.log(nameSelector);

    $.get('/getAllSubjectNames', function (names) {
        listOfSubjects = JSON.parse(names);
        console.log(listOfSubjects);
        assignOptions(listOfSubjects, nameSelector);
        updateSubject(listOfSubjects[0]);
    });

    function assignOptions(textArray, selector) {
        for (var i = 0; i < textArray.length; i++) {
            var currentOption = document.createElement('option');
            currentOption.text = textArray[i];
            selector.appendChild(currentOption);
        }
    }

    function updateSubject(subjectName) {
        sendName(subjectName);
        set3dPlot();
    }

    function updateSubject() {
        sendName(nameSelector.value);
        set3dPlot();
    }

    nameSelector.addEventListener('change', updateSubject, false);

    function sendName(subjectName) {
        var data = {
            data: JSON.stringify({
                'name': subjectName
            }),
        }
        // send name
        $.ajax({
            async: false,
            type: "POST",
            url: "subjectName",
            currentType: "application/json",
            data: data,
            dataType: "json"
        });
    }

    function removeTable(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    }

    function set3dPlot() {
        // get plot data
        $.get("/getOneSubject", function (data) {
            data = JSON.parse(data);
            console.log(data);
            var lineData = data["line"];
            var dataToPlot = [];
            for (var i = 0; i < lineData.length; i++) {
                var trace = {
                    x: lineData[i]["x"],
                    y: lineData[i]["y"],
                    z: lineData[i]["z"],
                    mode: "lines",
                    // assignLineColor:
                    marker: {
                        size: 12,
                        symbol: 'circle'
                    },
                    line: {
                        color: lineData[i]["color"],
                        width: 3
                    },
                    type: 'scatter3d'
                };
                dataToPlot.push(trace);
            }
            console.log(dataToPlot);
            // anno start
            var anno = [];
            if ("anno" in data) {
                var annoData = data["anno"];
                for (var i = 0; i < annoData.length; i++) {
                    anno.push({
                        showarrow: true,
                        arrowhead: 7,
                        x: annoData[i]["x"],
                        y: annoData[i]["y"],
                        z: annoData[i]["z"],
                        text: annoData[i]["text"],
                        font: {
                            color: "black",
                            size: 8
                        },
                        ax: 5,
                        ay: 2,
                        xanchor: "left",
                        yanchor: "bottom"
                    })
                }

            }
            console.log(anno);
            // anno end
            var layout = {
                autosize: true,
                //width: 1000,
                //height: 600,
                margin: {
                    l: 0,
                    r: 0,
                    b: 0,
                    t: 65
                },
                scene: {
                    annotations: anno,
                    xaxis: {
                        autorange: true,
                        showgrid: false,
                        zeroline: false,
                        showline: false,
                        autotick: true,
                        ticks: '',
                        showticklabels: false,
                        title: ''
                    },
                    yaxis: {
                        autorange: true,
                        showgrid: false,
                        zeroline: false,
                        showline: false,
                        autotick: true,
                        ticks: '',
                        showticklabels: false,
                        title: ''
                    },
                    zaxis: {
                        autorange: true,
                        showgrid: false,
                        zeroline: false,
                        showline: false,
                        autotick: true,
                        ticks: '',
                        showticklabels: false,
                        title: ''
                    }
                }
            };
            Plotly.newPlot('3dPlotDiv', dataToPlot, layout);

            //table start:
            if ('table' in data && 'tableFR' in data) {
                var values = data["table"];
                console.log(values);
                var rowColor = [];
                var rowEvenColor = "lightgrey";
                var rowOddColor = "white";
                for (var i = 0; i < data["table"][0].length; i++) {
                    if (i % 2 == 0) {
                        rowColor.push(rowOddColor);
                    } else {
                        rowColor.push(rowEvenColor);
                    }
                }

                var headerColor = "grey";
                var dataToTable = [{
                    type: 'table',
                    header: {
                        values: data["tableFR"],
                        align: "center",
                        line: { width: 1, color: 'black' },
                        fill: { color: headerColor },
                        font: { family: "Arial", size: 12, color: "white" }
                    },
                    cells: {
                        values: values,
                        align: "center",
                        line: { color: "black", width: 1 },
                        fill: {color: [rowColor]},
                        font: { family: "Arial", size: 11, color: ["black"] }
                    }
                }]

                Plotly.newPlot('table', dataToTable);
            }

            // var table = document.getElementById("table");
            // console.log(table);
            // removeTable(table);
            // //table header:
            // var thead = document.createElement('thead');
            // var frtr = document.createElement('tr');
            // if ('tableFirstRow' in data) {
            //     console.log(data['tableFirstRow']);
            //     data['tableFirstRow'].forEach(function(frdata) {
            //         var frth = document.createElement('th');
            //         frth.setAttribute("data-field", frdata);
            //         frth.textContent = frdata;
            //         frtr.appendChild(frth);
            //     })
            //     thead.appendChild(frtr);
            //     table.appendChild(thead);
            // }

            // var $table = $('#table');
            // console.log($table);
            // $(function() {
            //     console.log(data["table"]);
            //     $table.bootstrapTable({data: data["table"]});
            // })
        });
    }
});