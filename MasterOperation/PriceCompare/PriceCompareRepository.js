'use strict';

var repository = require("../Common/LambdaRepository");

class PriceCompareRepository extends repository.LambdaRepository {
    constructor() {
        super();
    }
    // 監視マスタの取得
    getObserveMaster(userId, groupId, callback) {
        const input = {
            method: "getMaster",
            userId: userId,
            groupId: groupId
        }
        this.callLambdaWithinLambda(input, "ObserveMaster", callback);
    }
    // 価格情報の取得
    getPriceList(itemIdList, callback) {
        const input = {
            method: "priceGet",
            itemIdList: itemIdList
        }
        this.callLambdaWithinLambda(input, "PriceGet", callback);
    }
    // アラートログの取得
    getAlertLogList(userId, targetAlertDate, callback) {
        const input = {
            method: "get",
            userId: userId,
            lastAlertDate: targetAlertDate
        }
        this.callLambdaWithinLambda(input, "ItemAlertLog", callback);
    }

}

module.exports.PriceCompareRepository = PriceCompareRepository;