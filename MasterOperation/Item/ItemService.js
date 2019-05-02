'use strict';

var iRepository = require("./ItemRepository");
var apiRes = require("../Common/ApiResultBase");
var BaseC = require("../Common/BaseClass");
var dFormatter = require("../Common/DateFormatter");

class ItemService extends BaseC.BaseClass {

    constructor() {
        super();
        this.repository = new iRepository.ItemRepository();
    }
    // API経由で商品情報を取得して合わせて監視マスタに登録
    async addObserveItem(input, callback) {
        if (!input) {
            let msg = "input is undefined";
            this.error(msg);
            callback(new Error(msg), null);
        }
        if (!input.userId) {
            let msg = "userId is undefined";
            this.error(msg);
            this.error(JSON.stringify(input));
            callback(new Error(msg), null);
        }
        if (!input.groupId) {
            let msg = "groupId is undefined";
            this.error(msg);
            this.error(JSON.stringify(input));
            callback(new Error(msg), null);
        }
        if (!input.itemId) {
            let msg = "itemId is undefined";
            this.error(msg);
            this.error(JSON.stringify(input));
            callback(new Error(msg), null);
        }
        if (!input.threshold || isNaN(input.threshold)) {
            let msg = "threshold is not defined";
            this.error(msg);
            this.error(JSON.stringify(input));
            callback(new Error(msg), null);
        }


        try {
            //まずは商品情報を取得
            let idList = new Array();
            idList.push(input.itemId);
            var itemInfo = await this.repository.getItemInfoListAsync(idList);
            this.info("itemInfo:" + JSON.stringify(itemInfo));
            if (itemInfo && itemInfo.length > 0 && itemInfo[0]) {
                //商品情報を付与して監視マスタに登録
                var dt = new Date();
                var nowStr = dFormatter.DateFormatter.formatDateToString(dt, "yyyyMMdd");
                var res = await this.repository.addItemObserveAsync(input.userId, input.groupId,
                                                                    input.itemId, nowStr, itemInfo[0].title, input.threshold);
                if (res.isSuccess) {
                    var aRes = new apiRes.ApiResultBase();
                    aRes.setIsSuccess(true);
                    callback(null, res);
                } else {
                    callback(new Error("マスタ登録に失敗"), null);
                }
            } else {
                callback(new Error("アイテムが見つかりませんでした。:id=" + input.itemId));
            }
        } catch (e) {
            this.error("想定外エラー発生", e);
            callback(e, null);
        }
    }
}

module.exports.ItemService = ItemService;