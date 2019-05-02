'use strict';

var service = require("./ItemAlertLog/ItemAlertLogService");

exports.handler = function (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    var oServ = new service.ItemAlertLogService();

    if (event.method == "get") {
        let input = {
            "userId": event.userId,
            "lastAlertDate": event.lastAlertDate
        };
        oServ.getAlertedList(input, callback);
    } else if (event.method == "putmany") {
        let input = {
            "userId": event.userId,
            "lastAlertDate": event.lastAlertDate,
            "itemIdAndPriceList": event.itemIdAndPriceList
        };
        oServ.putAlertLogList(input, callback);
    } else if (event.method == "putone") {
        let input = {
            "userId": event.userId,
            "lastAlertDate": event.lastAlertDate,
            "itemId": event.itemId,
            "price": event.price
        };
        oServ.putAlertLog(input, callback);
    }

};  