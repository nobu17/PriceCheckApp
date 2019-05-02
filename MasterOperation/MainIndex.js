'use strict';

var service = require("./Main/MainService");

exports.handler = function (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    var mServ = new service.MainService();

    let input = {
        "userId": event.userId
    };

    mServ.doTask(input, callback);

};  