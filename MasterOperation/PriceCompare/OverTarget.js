
"use strict"

//価格を超えた情報
class OverTarget {
    constructor(itemName, itemId, price, threshold) {
        this.itemName = itemName;
        this.itemId = itemId;
        this.price = price;
        this.threshold = threshold;
    }
}

module.exports.OverTarget = OverTarget;