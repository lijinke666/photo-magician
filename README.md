# photo-magician

[![npm](https://img.shields.io/npm/dm/photo-magician.svg?style=flat-square)](https://www.npmjs.com/package/photo-magician)
[![npm version](https://img.shields.io/npm/v/photo-magician.svg?style=flat-square)](https://badge.fury.io/js/photo-magician)
[![jest](https://facebook.github.io/jest/img/jest-badge.svg)](https://github.com/facebook/jest)

:art: Provide some common image process apis with canvas

[React Version](https://github.com/lijinke666/react-image-process)

## Installation

using `yarn` :

```
yarn add photo-magician
```

using `npm` :

```
npm install photo-magician --save
```

using in the browser :

```js
<script src="photoMagician.min.js"></script>
<script>
    const magician = new photoMagician()
    magician.toBase64Url({cover:"YOUR_IMG_URL"})
</script>
```

## Screenshots

![https://github.com/lijinke666/photo-magician/bolb/master/assets/screenshot.png](https://github.com/lijinke666/photo-magician/blob/master/assets/screenshot.png)

## Example

[https://lijinke666.github.io/photo-magician/](https://lijinke666.github.io/photo-magician/)

## Usage

> ES6

```js
import photoMagician from "photo-magician";
const magician = new photoMagician();

magician.toBase64Url({ cover: "YOUR_IMG_URL" });
```

> No ES6

```js
const photoMagician = require("photo-magician");
const magician = new photoMagician();

magician.toBase64Url({ cover: "YOUR_IMG_URL" });
```

> set config

```js
// set out put image data quality  [ 0 - 1 ]

magician.setConfig({
  imageQuality: 0.4
});
```

Return to the promise

```js
//use ES6
magician
  .toBase64Url({
    cover: baseImageUrl
  })
  .then(data => {
    console.log("image data:", data);
  })
  .catch(error => {
    console.error("toBase64Url error", err);
  });

//use ES7
async () => {
  const data = await magician.toBase64Url({
    cover: baseImageUrl
  });
  console.log("image data:", data);
};
```

outputType

```js
async () => {
  // outputType = 'dataUrl'  default
  const data = await magician.toBase64Url({
    cover: baseImageUrl,
    outputType: "dataUrl"
  });
  console.log("image data:", data);

  // outputType = 'blob'
  const blob = await magician.toBase64Url({
    cover: baseImageUrl,
    outputType: "blob"
  });
  console.log("image blob:", URL.createObjectURL(blob));
};
```

## Development

```
git clone https://github.com/lijinke666/photo-magician.git
npm install | yarn
npm start
```

## API

```js
/**
 * @name toBase64Url
 * @description get base64 data of the image
 * @param {Object} options
 * @param {String | Object} options.cover cover url | image element node   The next cover parameter is the same as this.
 * @return base64 data
 */
magician.toBase64Url({
  cover: baseImageUrl
});

/**
 * @name getPrimaryColor
 * @description get primary color of the image
 * @param {Object} options
 * @param {String | Object} options.cover
 * @return primaryColor
 */

magician.getPrimaryColor({
  cover: watermark
});

/**
 * @name compressImage()
 * @description compress of the image
 * @param {Object} options
 * @param {String | Object} options.cover
 * @param {Number}  options.quality range(0-1) default '0.92'
 * @return base64 data
 */
magician.compressImage({
  cover: baseImageUrl,
  quality: 0.12
});

/**
 * @name clipImage()
 * @description cut clip of the image
 * @param {object} Options
 * @param {String | Object} options.cover
 * @param {Number} options.scale Image zooming   default '1.0'
 * @param {Array} options.coordinate [[x1,y1],[x2,y2]]
 * @return base64 data
 */
magician.clipImage({
  cover: baseImageUrl,
  scale: 1.0,
  coordinate: [[200, 200], [[300, 300]]
});

/**
 * @name rotateImage()
 * @description Rotate the image
 * @param {String | Object} cover 图片地址或节点
 * @param {Number} rotate 旋转比例 (0 -360 ) °
 */
magician.rotateImage({
  cover: baseImageUrl,
  rotate: 20
});

/**
 * @name addWaterMark
 * @description Add text or picture watermark to the image.
 * @param {Object} options
 * @param {String | Object} options.cover
 * @param {String} options.waterMark waterMark
 * @param {String} options.mode "image | text"  Specify whether it is a image or a text. [default 'text']
 * @param {Boolean} options.fontBold If it's text, then bold [default 'true']
 * @param {Number} options.fontSize If it's text, what font size is it?  [default 20]
 * @param {String} options.fontColor if it's text, If it's text, what font color is it? [default'rgba(255,255,255,.5)']
 * @param {Number} options.width if it's image what width of the image [default '50']
 * @param {NUmber} options.height if it's image what height of the image [default '50']
 * @param {NUmber} options.opacity opacity of the image  [default '0.5']
 * @param {Array} options.coordinate [x,y] [default '[0,0]']
 */
magician.addWaterMark({
  cover: baseImageUrl,
  mode: "image",
  waterMark: watermark,
  width: 60,
  height: 60,
  opacity: 0.8,
  coordinate: [330, 300]
});

/**
 * @name addWaterMark
 * @param Same as above
 */
magician.addWaterMark({
  cover: baseImageUrl,
  mode: "text",
  waterMark: "photo-magician.js",
  fontBold: false,
  fontSize: 20,
  fontColor: "#396",
  coordinate: [10, 20]
});

/**
 * @name addImageFilter
 * @param {Object} options
 * @param {String | Object} options.cover
 * @param {String} options.mode  filter name  "vintage" | "blackWhite" | "relief" | "blur"
 */
magician.addImageFilter({
  cover: baseImageUrl,
  mode: "vintage"
});
```

## License

[MIT](https://github.com/photo-magician/blob/master/LICENCE)
