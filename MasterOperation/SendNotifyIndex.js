'use strict';

var service = require("./SendNotify/SendNotifyService");

exports.handler = function (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    var aServ = new service.SendNotifyService();
    var input = {
        "userId": event.userId,
        "notifyInfoList": event.notifyInfoList,
        "arn": event.arn
    };
    aServ.sendNotify(input, (err, data) => {
        if (err) {
            callback(err, data);
        } else {
            callback(null, data);
        }
    });
};