# image-magician
图片魔法师,提供一些 基于 canvas 和 promise 的 常用图片操作api , 如 图片压缩,图片裁剪,图片加水印,图片滤镜

## Example
[https://lijinke666.github.io/image-magician/](https://lijinke666.github.io/image-magician/)

## Usage
```js
<script src="./src/image-magician.js"><script>
<script>
    const baseImageUrl = "YOUR_IMG_URL"
    const magician = new imageMagician()

    //use ES6
    magician.toBase64Url({
        cover: baseImageUrl
    }).then( data  => {
        console.log('image data:',data)
    }).catch( error => {
        console.error('toBase64Url error', err);
    })

    //use ES7
    (async ()=>{
        const data = await magician.toBase64Url({
            cover: baseImageUrl
        })
        console.log('image data:',data)
    })
</script>
```

## Development
```
git clone https://github.com/lijinke666/image-magician.git
npm install | yarn
npm start
```

## Api
```js
    /**
     * 图片 转base64
     * @param {Object} options 
     * @param {String | Object} cover 图片地址 或者图片节点 
     * @return 图片base64 data
     */
    
    _img.toBase64Url({
        cover: baseImageUrl
    })

    /**
     * 获取 图片主色调
     * @param {Object} options 
     * @param {String | Object} cover 图片地址 或者图片节点 
     * @return primaryColor 
     */

    _img.getPrimaryColor({
        cover: watermark
    })

    /**
     * 压缩图片
     * @param {Object} options 
     * @param {String | Object} cover 图片地址 或者图片节点 
     * @param {Number}  quality 压缩比例  非必选 (0-1) 默认 '0.92'
     * @return 图片base64 data (jpg格式)
     */
    _img.compressImage({
        cover: baseImageUrl,
        quality: 0.12,
    })

    /**
     * 裁剪图片
    * @param {object} Options 
    * @param {String | Object} cover 图片节点 或者 图片地址 必选 
    * @param {Number} scale 缩放比例  非必选 默认 1.0 不缩放 
    * @param {Array} coordinate 裁剪坐标  必选  [[x1,y1],[x2,y2]]
    * @return 裁剪后的图片节点
    */
    _img.clipImage({
        cover: baseImageUrl,
        scale: 1.0,
        coordinate: [[200, 200], [300, 300]],             //裁剪坐标 [x1,y1], [x2,y2]
    })

    /**
     * 旋转图片
     * @param {String | Object} cover 图片地址或节点
     * @param {Number} rotate 旋转比例 (0 -360 ) °
     */
    _img.rotateImage({
        cover:baseImageUrl,
        rotate:20,
    })

    /**
     * 添加水印 (文本水印 | 图片水印)
     * @param {Object} options 
     * @param {String | Object} cover 目标图片 或者图片节点 必选
     * @param {String} waterMark 水印 (文本或图片地址) 必选
     * @param {String} mode 水印模式 非必选  text | image 默认 "text"
     * @param {Boolean} fontBold 文本水印加粗 (文字水印时有效) 非必选 默认 true
     * @param {Number} fontSize 文本字体大小 (文字水印时有效) 非必选 默认 20
     * @param {String} fontColor 文本水印颜色 (文字水印时有效) 非必选 默认 'rgba(255,255,255,.5)'
     * @param {Number} width 图片水印长度 (图片水印时有效) 非必选 默认 '50'
     * @param {NUmber} height 图片水印高度 (图片水印时有效) 非必选 默认 '50'
     */
    _img.addWaterMark({
        cover: baseImageUrl,
        mode: "image",
        waterMark: watermark,
        width: 60,
        height: 60,
        opacity: 0.8,
        coordinate: [330, 300],
    })

    /**
     * 添加文字水印 
     * @param 同上
     */
    _img.addWaterMark({
        cover: baseImageUrl,
        mode: "text",
        waterMark: "image-magician.js",
        fontBold: false,
        fontSize: 20,
        fontColor: "#396",
        coordinate: [10, 20]
    })

    /**
     * 添加图片滤镜
     * @param {Object} options
     * @param {String | Object} options.cover 图片地址 或节点
     * @param {String} options.mode  滤镜模式
     * {可选如下}
     * vintage          //复古
     * blackWhite       //黑白
     * relief           //浮雕
     * blur             //模糊
     */
    _img.addImageFilter({
        cover: baseImageUrl,
        mode: "vintage"
    })


```
## License
[MIT](https://github.com/image-magician/dawdler/blob/master/LICENCE)
