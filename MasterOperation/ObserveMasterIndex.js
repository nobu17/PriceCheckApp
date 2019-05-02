'use strict';

var service = require("./ObserveMaster/ObserveMasterService");

exports.handler = function (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    var oServ = new service.ObserveMasterService();
    
    if (event.method == "getMaster") {
        let input = {
            "userId": event.userId,
            "groupId": event.groupId
        };
        oServ.getObserveTargetList(input, callback);
    } else if (event.method == "getGroup") {
        let input = {
            "userId": event.userId,
        };
        oServ.getGroupIdList(input, callback);
    } else if (event.method == "putMaster") {
        let input = {
            "userId": event.userId,
            "itemId": event.itemId,
            "addDate": event.addDate,
            "groupId": event.groupId,
            "itemName": event.itemName,
            "threshold": event.threshold
        };
        oServ.putObserveItem(input, callback);
    }
    else {
        callback(new Error("no method param"), null);
    }
};  