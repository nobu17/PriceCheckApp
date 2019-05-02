'use strict'

var apiRes = require("../Common/ApiResultBase");
var BaseC = require("../Common/BaseClass");
var sRepository = require("./MasterRepository");

class MainService extends BaseC.BaseClass {
    constructor() {
        super();
        this.repository = new sRepository.MasterRepository();
    }

    async doTask(input, callback) {
        if (!input.userId) {
            let msg = "userId is undefined:" + JSON.stringify(input);
            this.error(msg);
            callback(new Error(msg), null);
        }

        try {
            var isFail = false;
            //ユーザマスタからARNとかを取得
            var userInfo = await this.repository.getUserInfoAsync(input.userId);
            if (userInfo && userInfo.length >= 1 && userInfo[0]) {
                //グループID一覧を取得
                var gpList = await this.repository.getGroupIdList(input.userId);
                if (gpList && gpList.length >= 1) {
                    this.info("グループID一覧:" + JSON.stringify(gpList));

                    //グループID別に価格比較を実施
                    for (var i = 0; i < gpList.length; i++) {
                        let gp = gpList[i];

                        // 価格比較を実施
                        var result = await this.doCompareAsync(input.userId, gp);
                        if (result.isSuccess) {
                            // 結果があれば通知
                            if (result.data && result.data.length > 0) {
                                this.info("通知対象がみつかりました。:" + JSON.stringify(result));
                                var result2 = await this.doSendNotifyAsync(input.userId, userInfo[0].Arn, result.data);
                                if (result2.isSuccess) {
                                    this.info("通知に成功");
                                } else {
                                    this.info("通知に失敗");
                                    isFail = true;
                                }
                            } else {
                                this.error("通知対象はありませんでした。:" + gp);
                            }
                        } else {
                            this.error("価格比較に失敗しました。:" + gp);
                            isFail = true;
                        }
                    }

                    let aRes = new apiRes.ApiResultBase();
                    aRes.setIsSuccess(!isFail);
                    this.info(JSON.stringify(aRes));
                    callback(null, aRes);

                } else {
                    let aRes = new apiRes.ApiResultBase();
                    aRes.setIsSuccess(false);
                    let msg = "グループID一覧が見つかりませんでした。:" + input.userId;
                    this.error(msg);
                    this.info(JSON.stringify(aRes));
                    callback(new Error(msg), aRes);
                }
            } else {
                let aRes = new apiRes.ApiResultBase();
                aRes.setIsSuccess(false);
                let msg = "ユーザ情報が見つかりませんでした。:" + input.userId;
                this.error(msg);
                this.info(JSON.stringify(aRes));
                callback(new Error(msg), aRes);
            }
        } catch (e) {
            let aRes = new apiRes.ApiResultBase();
            aRes.setIsSuccess(false);
            this.error("処理失敗:" + JSON.stringify(e));
            callback(e, aRes);
        }
    }

    async doCompareAsync(userId, groupId) {
        try {
            this.info("groupId:" + groupId + "の価格比較を実施します");
            var compRes = await this.repository.doPriceCompareAsync(userId, groupId);
            this.info("doCompareAsync:result:" + JSON.stringify(compRes));
            return { isSuccess : true, data : compRes };
        } catch (e) {
            this.error("価格比較中にエラーが発生。", e);
            return { isSuccess: false, data: null };
        }
    }

    async doSendNotifyAsync(userId, arn, itemInfoList) {
        try {
            this.info("userId:" + userId + "に通知を行います。:" + JSON.stringify(itemInfoList));
            var itemList = [];
            itemInfoList.forEach((item) => {
                var tItem = {
                    "itemName": item.itemName,
                    "price": item.price,
                    "threshold": item.threshold,
                    "itemId": item.itemId
                };
                itemList.push(tItem);
            });

            var compRes = await this.repository.doNotifyAsync(userId, arn, itemList);
            this.info("doSendNotifyAsync:result:" + JSON.stringify(compRes));
            return { isSuccess: true, data: compRes };
        } catch (e) {
            this.error("通知送信中ににエラーが発生。", e);
            return { isSuccess: false, data: null };
        }
    }
}


module.exports.MainService = MainService;