'use strict'

var respository = require("../Common/SnsRepository");
var lambdaRespository = require("../Common/LambdaRepository");

class SendNotifyRepository extends respository.SnsRepositpry {
    constructor() {
        super();
        this.lambda = new lambdaRespository.LambdaRepository();
    }
    // SNS通知
    sendNotify(title, message, arn, callback) {
        super.sendNotify(title, message, arn, callback);
    }
    // 通知した対象のalertLogをput
    putAlertLog(userId, lastAlertDate, itemIdAndPriceList, callback) {
        const params = {
            method: "putmany",
            userId: userId,
            lastAlertDate: lastAlertDate,
            itemIdAndPriceList: itemIdAndPriceList
        }
        this.lambda.callLambdaWithinLambda(params, "ItemAlertLog", callback);
    }
}

module.exports.SendNotifyRepository = SendNotifyRepository;
