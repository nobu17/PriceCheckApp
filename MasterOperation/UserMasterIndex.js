'use strict';

var service = require("./UserMaster/UserMasterService");

exports.handler = function (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    var aServ = new service.UserMasterService();
    if (event.method == "get") {
        var input = {
            "userId": event.userId
        };
        aServ.getUserInfo(input, (err, data) => {
            if (err) {
                callback(err, data);
            } else {
                callback(null, data);
            }
        });
    } else {
        callback(new Error("no method param"), null);
    }

};