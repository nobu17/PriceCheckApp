'use strict';

var service = require("./PriceCompare/PriceCompareService");

exports.handler = function (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    var aServ = new service.PriceCompareService();
    var input = {
        "userId": event.userId,
        "groupId": event.groupId
    };
    aServ.compare(input, (err, data) => {
        if (err) {
            callback(err, data);
        } else {
            callback(null, data);
        }
    });
};