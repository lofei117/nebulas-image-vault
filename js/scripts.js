// Empty JS for your own code to be here

"use strict";

class Image {
    constructor() {
    }

    parse(jsonObject) {
        this.imageHash = jsonObject.imageHash;
        this.imageWidth = jsonObject.imageWidth;
        this.imageHeight = jsonObject.imageHeight;
        this.imageExif = jsonObject.imageExif;
        this.imageData = jsonObject.imageData;
    }

    getHash() {
        return this.imageHash;
    }

    getWidth() {
        return this.imageWidth;
    }

    getHeight() {
        return this.imageHeight;
    }

    getExif() {
        return this.imageExif;
    }

    getData() {
        return this.imageData;
    }
}

class Author {
    constructor() {
    }

    parse(jsonObject) {
        this.name = jsonObject.name;
        this.email = jsonObject.email;
    }

    getName() {
        return this.name;
    }

    getEmail() {
        return this.email;
    }
}

var nebAddress, nebState;
var nebulas = require("nebulas"),
    Account = nebulas.Account,
    neb = new nebulas.Neb();
var NebPay = require("nebpay");
var nebPay = new NebPay();
var nebConfigArr = {
    mainnet: {
        // TODO
        name: "主网",
        contractAddress: "n1qQhDzswApj5SmRrNQBNd6nSjqaaqmmmZi",
        txhash: "04222aa816c36a7895efd59256f4f2844fae253064ebc40c155266e3d6cc5220",
        host: "https://mainnet.nebulas.io",
        payhost: "https://pay.nebulas.io/api/mainnet/pay"
    },
    testnet: {
        // TODO
        name: "测试网",
        contractAddress: "n21g7acsnLJqfKU3uTSY2k5M53djgHpu3SK",
        txhash: "e8ee35381c1e480ca5a61ce8eb88dc2b27d4284996b53cec7f2c6d57746aacf1",
        host: "https://testnet.nebulas.io",
        payhost: "https://pay.nebulas.io/api/pay"
    },
    localhost: {
        name: "开发网",
        contractAddress: "n21jG7yWWAMsvuFcHEqSgbVUiYDqh9wUtmW",
        txhash: "d8de3a01ba2128888aa4878afaf72a1b90eeef4a57cd49dd36ba5097486de10a",
        host: "http://localhost:8685",
        payhost: "http://localhost/api/pay"
    }
};
var nebConfig = nebConfigArr["testnet"];
neb.setRequest(new nebulas.HttpRequest(nebConfig["host"]));

