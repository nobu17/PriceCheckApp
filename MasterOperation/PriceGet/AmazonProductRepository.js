'use strict';

const path = require('path');
var BaseC = require("../Common/BaseClass");
var amazon = require('amazon-product-api');
var amazonP = require("../PriceGet/AmazonPrice");
var amazonI = require("../PriceGet/AmazonItem");

class AmazonProductRepository extends BaseC.BaseClass {
    constructor() {
        super();
        this.init();
    }

    init() {
        try {
            var fs = require('fs');
            var filePath = path.resolve(process.env.LAMBDA_TASK_ROOT, '', process.env.AWS_LAMBDA_FUNCTION_NAME, './aws_config.json')
            var json = JSON.parse(fs.readFileSync(filePath, 'utf8').trim());
            //var json = JSON.parse(fs.readFileSync("./aws_config.json", 'utf8').trim());
            // AWS設定の取得
            this.awsId = json.awsId;
            this.awsSecKey = json.awsSecKey;
            this.awsTag = json.awsTag;
            this.awsDomain = json.awsDomain;
        } catch (e) {
            this.error("init fail", e);
        }
    }

    // アイテム取得
    itemLookup(itemIdList, callback) {
        var client = amazon.createClient({
            awsId: this.awsId,
            awsSecret: this.awsSecKey,
            awsTag: this.awsTag
        });
        //複数アイテムはカンマ区切り
        const idListStr = itemIdList.join(",");

        client.itemLookup({
            domain: this.awsDomain,
            idType: "ASIN",
            itemId: idListStr,
            responseGroup: 'OfferSummary'
        }).then((results) => {

            var priceList = new Array();

            results.forEach((result) => {
                let price = new amazonP.AmazonPrice();
                price.itemId = result.ASIN[0];
                price.newPrice = Number(result.OfferSummary[0].LowestNewPrice[0].Amount[0]);
                price.usedPrice = Number(result.OfferSummary[0].LowestUsedPrice[0].Amount[0]);

                priceList.push(price);
            });

            callback(null, priceList);
        }).catch((err) => {
            this.error("itemLookup fail", err);
            callback(err, null);
        });
    }

    itemInfoGet(itemIdList, callback) {
        var client = amazon.createClient({
            awsId: this.awsId,
            awsSecret: this.awsSecKey,
            awsTag: this.awsTag
        });

        //複数アイテムはカンマ区切り
        const idListStr = itemIdList.join(",");

        client.itemLookup({
            domain: this.awsDomain,
            idType: "ASIN",
            itemId: idListStr,
            responseGroup: 'ItemAttributes'
        }).then((results) => {

            var infoList = new Array();

            results.forEach((result) => {
                let item = new amazonI.AmazonItem();
                item.itemId = result.ASIN[0];
                item.title = result.ItemAttributes[0].Title[0];
                //作者がない場合がある
                if (result.ItemAttributes[0].Author && result.ItemAttributes[0].Author.length > 0) {
                    item.author = result.ItemAttributes[0].Author[0];
                } else if (result.ItemAttributes[0].Creator && result.ItemAttributes[0].Creator.length > 0) {
                    item.author = result.ItemAttributes[0].Creator[0];
                }
                infoList.push(item);
            });

            callback(null, infoList);
        }).catch((err) => {
            this.error("itemInfoGet fail", err);
            callback(err, null);
        });
    }
}

module.exports.AmazonProductRepository = AmazonProductRepository;

