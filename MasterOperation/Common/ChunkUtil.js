'use strict'

class ChunkUtil {
    constructor() {
    }
    // 配列を指定サイズごとに分割します
    static chunkArray(array, size) {
        var ary = array;
        var idx = 0;
        var results = [];
        var length = ary.length;

        while (idx + size < length) {
            var result = ary.slice(idx, idx + size)
            results.push(result);
            idx = idx + size
        }

        var rest = ary.slice(idx, length + 1)
        results.push(rest)
        return results;
    }
}

module.exports.ChunkUtil = ChunkUtil;