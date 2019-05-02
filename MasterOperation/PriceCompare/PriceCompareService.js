'use strict';

//var apiRes = require("../Common/ApiResultBase");
var BaseC = require("../Common/BaseClass");
var apiRes = require("../Common/ApiResultBase");
var pRepository = require("./PriceCompareRepository");
var overT = require("./OverTarget");
var dFormatter = require("../Common/DateFormatter");

class PriceCompareService extends BaseC.BaseClass {

    constructor() {
        super();
        this.repository = new pRepository.PriceCompareRepository();
    }

    async compare(input, callback) {

        try {
            var fireList = [];
            //商品マスタを取得
            var obMasters = await this.getObserveMasterAsync(input.userId, input.groupId);
            //id一覧を取得
            var idList = obMasters.map((value) => { return value.ItemId });
            if (idList && idList.length > 0) {
                //価格一覧を取得
                var priceList = await this.getPriceListAsync(idList);
                //価格と敷居値を比較して超えたもの取得
                var goOverList = this.getGooverThretholdItems(obMasters, priceList);
                if (goOverList && goOverList.length > 0) {
                    this.info("閾値を超えたアイテム一覧:" + JSON.stringify(goOverList));
                    var alertLog = await this.getAlertLogAsync(input.userId);
                    // 発火済みでかつ価格が安くなければ発火しない
                    var isnotFire = false;
                    goOverList.forEach((item) => {
                        if (alertLog.length > 0) {
                            alertLog.forEach((alert) => {
                                //価格が安くなければ発火対象外
                                if ((alert.ItemId == item.itemId) && (alert.Price <= item.price)) {
                                    this.info("過去に発火済みのため対象外" + item.itemId + ":::" + item.price);
                                    isnotFire = true;
                                }
                            });
                        }
                        if (!isnotFire) {
                            fireList.push(item);
                        }
                    });
                } else {
                    this.info("閾値を超えた商品は見つかりませんでした。:" + input.userId + ":" + input.groupId);
                }
            } else {
                this.info("該当IDの比較対象のマスタが見つかりません。:" + input.userId + ":" + input.groupId);
            }

            this.info("発火対象リスト:" + JSON.stringify(fireList));
            var aRes = new apiRes.ApiResultBase();
            aRes.setIsSuccess(true);
            aRes.setData(fireList);
            callback(null, aRes);

        } catch (e) {
            let aRes = new apiRes.ApiResultBase();
            aRes.setIsSuccess(false);
            this.error("価格比較失敗:" + JSON.stringify(e));
            callback(e, aRes);
        }
    }

    getPriceListAsync(idList) {
        return new Promise((resolve, reject) => {
            this.repository.getPriceList(idList, (err, res) => {
                if (err) {
                    reject(err);
                } else if (res.isSuccess) {
                    resolve(res.data);
                } else {
                    reject(new Error("PriceList Error"));
                }
            });
        });
    }

    getObserveMasterAsync(userId, groupId) {
        return new Promise((resolve, reject) => {
            //商品マスタを取得
            this.repository.getObserveMaster(userId, groupId, (err, res) => {
                if (err) {
                    reject(err);
                } else if (res.isSuccess) {
                    resolve(res.data);
                } else {
                    reject(new Error("ObserveMasterError"));
                }
            });
        });
    }

    getAlertLogAsync(userId) {
        return new Promise((resolve, reject) => {
            //過去３日のアラート履歴を取得
            var dt = new Date();
            dt.setDate(dt.getDate() - 3);
            var nowStr = dFormatter.DateFormatter.formatDateToString(dt, "yyyyMMdd");
            this.repository.getAlertLogList(userId, nowStr, (err, res) => {
                if (err) {
                    reject(err);
                } else if (res.isSuccess) {
                    resolve(res.data);
                } else {
                    reject(new Error("AletLogError"));
                }
            });
        });
    }

    // 閾値と現在価格の比較し敷居値を超えたもののみを取得
    getGooverThretholdItems(observeList, priceList){
        var goOverList = [];
        observeList.forEach((obs) => {
            var matchPrice = priceList.find((price) => {
                return (price.itemId == obs.ItemId);
            });
            if (matchPrice) {
                var cheapest = this.getCheapestPrice(matchPrice);
                //敷値を超えていれば
                if (cheapest > 0 && obs.Threshold >= cheapest) {
                    //一覧に格納
                    this.info("閾値より安価:" + obs.ItemId + "," + cheapest);
                    goOverList.push(new overT.OverTarget(obs.ItemName, obs.ItemId, cheapest, obs.Threshold));
                } else {
                    this.info("閾値より高価:" + obs.ItemId + " 閾値:" + obs.Threshold + " 実価格:" + cheapest);
                }
            } else {
                this.warn("価格比較対象が見つかりません。:" + obs.ItemId);
            }
        });
        // 閾値を超えるものがあれば
        if (goOverList.length > 0) {
            this.info("閾値を超えるアイテムあり。");           
        } else {
            this.info("閾値を超えるアイテムはなし。");
        }
        return goOverList;
    }
    // 最安値を取得
    getCheapestPrice(priceInfo) {

        const usedP = priceInfo.usedPrice;
        const newP = priceInfo.newPrice;

        if (usedP > 0 && newP > 0) {
            if (usedP <= newP) {
                return usedP;
            } else {
                return newP;
            }
        } else if (usedP > 0) {
            return usedP;
        } else if (newP > 0) {
            return newP;
        } else {
            return -1;
        }
    }
    
}

module.exports.PriceCompareService = PriceCompareService