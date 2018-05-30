"use strict";

// image hashcode, image width, image height, image other info(exif)
// author name, author email(optinal), date
// block info

class Image {
  constructor(jsonObject) {
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
  constructor(jsonObject) {
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

var DepositeContent = function (text) {
  if (text) {
    var o = JSON.parse(text);
    this.image = new Image(o.image);
    this.author = new Author(o.author);
    this.from = o.from;
    this.timestamp = o.timestamp;
    this.blockHeight = o.blockHeight;
  } else {
    this.timestamp = Date.now();
  }
};

DepositeContent.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var ImageVaultContract = function () {
  LocalContractStorage.defineMapProperty(this, "imageVault", {
    parse: function (text) {
      return new DepositeContent(text);
    },
    stringify: function (o) {
      return o.toString();
    }
  });

  LocalContractStorage.defineMapProperty(this, "userImageVault", {
    parse: function (text) {
      return JSON.parse(text);
    },
    stringify: function (o) {
      return JSON.stringify(o);
    }
  });
};


// save value to contract, only after height of block, users can takeout
ImageVaultContract.prototype = {
  init: function () {
    //TODO:
  },

  save: function (dataValue) {
    var from = Blockchain.transaction.from;
    var value = Blockchain.transaction.value; // value?

    var data = JSON.parse(dataValue);  // the json object.

    var bk_height = new BigNumber(Blockchain.block.height);

    var image = new Image(data.image);
    var author = new Author(data.author);

    var orig_deposit = this.imageVault.get(image.getHash());
    if (orig_deposit) {
      // already exists, throw error.
      throw new Error("The image has already been uploaded by " + orig_deposit.from + ".");
    } else {
      var deposit = new DepositeContent();
      deposit.image = image;
      deposit.author = author
      deposit.timestamp = Date.now();
      deposit.from = from;
      deposit.blockHeight = bk_height;

      this.imageVault.put(image.getHash(), deposit);

      var imageArray = this.userImageVault.get(from);
      if (imageArray) {
          imageArray.push({"imageHash": image.getHash(), "timestamp": Date.now()});
      } else {
          imageArray = [{"imageHash": image.getHash(), "timestamp": Date.now()}];
      }
      this.userImageVault.put(from, imageArray);
    }
  },

  getImageInfoByHash: function(imageHash) {
    return this.imageVault.get(imageHash);
  },

  getUserImageList: function() {
    var from = Blockchain.transaction.from;
    return this.userImageVault.get(from);
  },

  verifyAddress: function (address) {
    // 1-valid, 0-invalid
    var result = Blockchain.verifyAddress(address);
    return {
      valid: result == 0 ? false : true
    };
  }
};
module.exports = ImageVaultContract;