'use strict';

var repository = require("../Common/LambdaRepository");

class ItemRepository extends repository.LambdaRepository {
    constructor() {
        super();
    }
    // アイテム情報を取得
    getItemInfoListAsync(itemIdList) {
        return new Promise((resolve, reject) => {
            const input = {
                method: "itemInfoGet",
                itemIdList: itemIdList
            }
            this.callLambdaWithinLambda(input, "PriceGet", (err, res) => {
                if (err) {
                    reject(err);
                } else if (res.isSuccess) {
                    resolve(res.data);
                } else {
                    reject(new Error("getItemInfoListAsync is fail"));
                }
            });
        });

    }
    // 監視マスタに登録
    addItemObserveAsync(userId, groupId, itemId, addDate, itemName, threshold) {
        return new Promise((resolve, reject) => {

            const input = {
                "method": "putMaster",
                "userId": userId,
                "itemId": itemId,
                "addDate": addDate,
                "groupId": groupId,
                "itemName": itemName,
                "threshold": threshold
            }
            this.callLambdaWithinLambda(input, "ObserveMaster", (err, res) => {
                if (err) {
                    reject(err);
                } else if (res.isSuccess) {
                    resolve(res);
                } else {
                    reject(new Error("addItemObserveAsync is fail"));
                }
            });
        });
    }
}

module.exports.ItemRepository = ItemRepository

