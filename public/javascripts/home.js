/**
 * Created by nuwanm on 12/16/16.
 */

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//Map Generation
var citymap = {
    chicago: {
        center: {lat: 41.878, lng: -87.629},
    },
    newyork: {
        center: {lat: 40.714, lng: -74.005},
    },
    losangeles: {
        center: {lat: 34.052, lng: -118.243},
    },
    vancouver: {
        center: {lat: 49.25, lng: -123.1},
    }
};

var allPoints = [];
var map;

function updateUser() {
    var username = getParameterByName('username', window.location);
    window.open('/users/update?username=' + username, '_blank')
}

function createPoints(map, data) {
    for (var city in data) {
        // Add the circle for this city to the map.
        var cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 1,
            strokeWeight: 10,
            fillColor: '#FF0000',
            fillOpacity: 1,
            map: map,
            center: data[city].center,
            radius: 100,
            clickable: true,
            title: 'hi'
        });
        allPoints.push(cityCircle);
    }
}

function removePoints() {
    console.log('all points before remove: ', allPoints);
    for (var point in allPoints) {
        allPoints[point].setMap(null);
    }
}

function getData(start, end) {
    $.ajax({
        method: 'GET',
        url: '/fuel/getData',
        data: {
            start: start,
            end: end,
            vehicleNo: $('[name="vehicleNo"]').val()
        },
        success: function (data) {
            console.log('get Data in home: ', data);
            removePoints();
            createPoints(map, data);
            drawGraph(data)
        },
        error: function (err) {
            console.log('Error getting data', err);
        }

    });
}

function initMap() {
    // Create the map.
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: {lat: 37.090, lng: -95.712},
        mapTypeId: 'terrain'
    });

    // Construct the circle for each value in citymap.
    createPoints(map, citymap);

}

function drawGraph(data){

    var xData = [];
    var yData  = [];
    for(var i in data){
        var point = data[i];
        var value = point.fuelValue;
        var date = point.date;
        xData.push(date);
        yData.push(value);
        Highcharts.chart('container', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Fuel Level '
            },
            xAxis: {
                categories: xData
            },
            yAxis: {
                title: {
                    text: 'Fuel value (Liters)'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series: [{
                name: 'Fuel Level',
                data: yData
            }]
        });

    }
}
console.log('Init map done');
$(function () {
    $('#daterange').daterangepicker({
            locale: {
                format: 'YYYY-MM-DD'
            }
        },
        function (start, end, label) {
            console.log(allPoints);
            console.log("A new date range was chosen: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
            getData(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
        });
});
