/**
 * Created by nuwanm on 12/17/16.
 */

var _id;
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

function getUser(username) {
    console.log('Get User called:', username);
    $.ajax({
        url: '/users/getUser',
        method: 'GET',
        data: {username: username},
        success: function (data) {
            var data = JSON.parse(data);
            console.log('success getting user: ', data);
            var username = data.username;
            var firstname = data.firstname;
            var lastname = data.lastname;
            var vehicleNo = data.vehicleNo;
            var vehicleType = data.vehicleType;
            var fuelCapacity = data.fuelCapacity;
            var deviceId = data.deviceId;
            _id = data._id;
            $('[name="username"]').val(username);
            $('[name="firstname"]').val(firstname);
            $('[name="lastname"]').val(lastname);
            $('[name="vehicleNo"]').val(vehicleNo);
            $('[name="vehicleType"]').val(vehicleType);
            $('[name="fuelCapacity"]').val(fuelCapacity);
            $('[name="deviceId"]').val(deviceId);
            $('[name="_id"]').val(_id);
        },
        error: function (data) {
            console.log('Sorry error occurred.');
            $('#status').text('Sorry error occurred.')
        }
    });
}

$(function () {
    var username = getParameterByName('username', window.location);
    getUser(username);

});