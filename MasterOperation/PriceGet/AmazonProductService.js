"use strict";

var BaseC = require("../Common/BaseClass");
var repository = require("./AmazonProductRepository"); 
var apiRes = require("../Common/ApiResultBase");
var Chunk = require("../Common/ChunkUtil");

// Amazon商品の価格取得サービス
class AmazonProductService extends BaseC.BaseClass {
    constructor() {
        super();
        this.repository = new repository.AmazonProductRepository();
        if (!this.repository) {
            let msg = "repository is null";
            this.error(msg);
            throw new Error(msg);
        }
    }
    // アイテム価格取得
    async itemLookup(input, callback) {

        if (!input) {
            let msg = "input is undefined";
            this.error(msg);
            callback(new Error(msg), null);
        }
        if (!input.itemIdList) {
            let msg = "itemIdList is undefined";
            this.error(msg);
            callback(new Error(msg), null);
        }
        //最大同時リクエスト数は10
        var chunkedIdList = Chunk.ChunkUtil.chunkArray(input.itemIdList, 10);

        var allPriceList = new Array();
        var isFail = false;
        var lastError = null;
        for (var i = 0; i < chunkedIdList.length; i++) {

            try {
                this.info("request idList:" + JSON.stringify(chunkedIdList[i]));
                var result = await this.itemLookupAsync(chunkedIdList[i]);
                allPriceList = allPriceList.concat(result);
            } catch (e) {
                this.error("リクエスト中に失敗:", e);
                isFail = true;
                lastError = e;
                break;
            }
        }

        var aRes = new apiRes.ApiResultBase();
        if (isFail) {
            aRes.setIsSuccess(false);
            callback(lastError, aRes);
        } else {
            aRes.setIsSuccess(true);
            aRes.setData(allPriceList);
            callback(null, aRes);
        }           
    }

    itemLookupAsync(idList) {
        return new Promise((resolve, reject) => {
            this.repository.itemLookup(idList, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    // アイテム情報を取得
    async itemInfoGet(input, callback) {

        if (!input) {
            let msg = "input is undefined";
            this.error(msg);
            callback(new Error(msg), null);
        }
        if (!input.itemIdList) {
            let msg = "itemIdList is undefined";
            this.error(msg);
            callback(new Error(msg), null);
        }

        //最大同時リクエスト数は10
        var chunkedIdList = Chunk.ChunkUtil.chunkArray(input.itemIdList, 10);

        var allInfoList = new Array();
        var isFail = false;
        var lastError = null;
        for (var i = 0; i < chunkedIdList.length; i++) {

            try {
                this.info("request idList:" + JSON.stringify(chunkedIdList[i]));
                var result = await this.itemInfoGetAsync(chunkedIdList[i]);
                allInfoList = allInfoList.concat(result);
            } catch (e) {
                this.error("リクエスト中に失敗:", e);
                isFail = true;
                lastError = e;
                break;
            }
        }

        var aRes = new apiRes.ApiResultBase();
        if (isFail) {
            aRes.setIsSuccess(false);
            callback(lastError, aRes);
        } else {
            aRes.setIsSuccess(true);
            aRes.setData(allInfoList);
            callback(null, aRes);
        }           

    }

    itemInfoGetAsync(idList) {
        return new Promise((resolve, reject) => {
            this.repository.itemInfoGet(idList, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports.AmazonProductService = AmazonProductService;