'use strict';

var repository = require("../Common/LambdaRepository");

class MasterRepository extends repository.LambdaRepository {
    constructor() {
        super();
    }
    // ユーザ情報を取得
    getUserInfoAsync(userId) {
        return new Promise((resolve, reject) => {
            const input = {
                "method": "get",
                "userId": userId
            }
            this.callLambdaWithinLambda(input, "UserMaster", (err, res) => {
                if (err) {
                    reject(err);
                } else if (res.isSuccess) {
                    resolve(res.data);
                } else {
                    reject(new Error("getUserInfoAsync fail"));
                }
            });
        });
    }
    // グループID一覧を取得
    getGroupIdList(userId) {
        return new Promise((resolve, reject) => {
            const input = {
                "method": "getGroup",
                "userId": userId
            }
            this.callLambdaWithinLambda(input, "ObserveMaster", (err, res) => {
                if (err) {
                    reject(err);
                } else if (res.isSuccess) {
                    resolve(res.data.groupIdList);
                } else {
                    reject(new Error("getGroupIdList fail"));
                }
            });
        });
    }
    // 価格比較を実施
    doPriceCompareAsync(userId, groupId) {
        return new Promise((resolve, reject) => {
            const input = {
                "userId": userId,
                "groupId": groupId
            }
            this.callLambdaWithinLambda(input, "PriceCompare", (err, res) => {
                if (err) {
                    reject(err);
                } else if (res.isSuccess) {
                    resolve(res.data);
                } else {
                    reject(new Error("doPriceCompareAsync fail"));
                }
            });
        });
    }
    // 通知を実施
    doNotifyAsync(userId, arn, notifyInfoList) {
        return new Promise((resolve, reject) => {
            var input = {
                "userId": userId,
                "notifyInfoList": notifyInfoList,
                "arn": arn
            };
            this.callLambdaWithinLambda(input, "SendNotify", (err, res) => {
                if (err) {
                    reject(err);
                } else if (res.isSuccess) {
                    resolve(res.data);
                } else {
                    reject(new Error("doNotifyAsync fail"));
                }
            });
        });
    }
}

module.exports.MasterRepository = MasterRepository;