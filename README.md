# image-magician
图片魔法师,提供一些 常用的 图片操作api ,基于promise,如 图片压缩,图片裁剪,图片加水印,图片滤镜
Some common methods

## Example
### [LIVE DEMO](https://lijinke666.github.io/image-magician/)
```
git clone https://github.com/lijinke666/image-magician.git
```
```
npm install
```
### Then
```
npm start
```

## Installing

Use npm (暂无实现)

In browser
```
git clone https://github.com/lijinke666/image-magician.git
```


```js
<script src="/src/image-magician.js"><script>
```


## a Example 
```js
<script src="./src/image-magician.js"></script>
<script>
    const baseImageUrl = './images/demo.jpg'
    const watermark = './images/watermark.png'

    const $ = (seletor) => document.querySelector(seletor)


    const _img = new ImageMagician()

    $('.base-img').src = baseImageUrl


    // 图片转base64
    _img.toBase64Url({
        cover: baseImageUrl
    }).then((url) => {
        _img.createImageNode(url).then((data) => {
            $('.base64Url-content').appendChild(data)
        })
    }).catch((err) => {
        console.error('toBase64Url error', err);
    })

    //压缩图片
    _img.compressImage({
        cover: baseImageUrl,
        quality: 0.12,
    }).then((imageNode) => {
        $('.compress-content').appendChild(imageNode)
    }).catch((err) => {
        console.error('compressImage error', err);
    })

    //裁剪图片
    _img.clipImage({
        cover: baseImageUrl,
        scale: 1.0,
        coordinate: [[200, 200], [300, 300]],             //裁剪坐标 [x1,y1], [x2,y2]
    }).then((imageNode) => {
        $('.clipImage-content').appendChild(imageNode)
    }).catch((err) => {
        console.error('clipImage error', err);
    })

    //添加水印 (图片)
    _img.addWaterMark({
        cover: baseImageUrl,
        mode: "image",
        waterMark: watermark,
        width: 60,
        height: 60,
        opacity: 0.8,
        coordinate: [330, 300],
    }).then((imageNode) => {
        $('.addWaterMark-img-content').appendChild(imageNode)
    }).catch((err) => {
        console.error('add image WaterMark error', err);
    })

    //添加水印 (文字)
    _img.addWaterMark({
        cover: baseImageUrl,
        mode: "text",
        waterMark: "image-magician.js",
        fontBold: false,
        fontSize: 20,
        fontColor: "#396",
        coordinate: [10, 20]
    }).then((imageNode) => {
        $('.addWaterMark-text-content').appendChild(imageNode)
    }).catch((err) => {
        console.error('add text WaterMark error', err);
    })

    //添加图片滤镜  (复古)
    _img.addImageFilter({
        cover: baseImageUrl,
        mode: "vintage"
    }).then((imageNode) => {
        $('.vintage-content').appendChild(imageNode)
    }).catch((err) => {
        console.error('add image filter error', err);
    })

    //添加图片滤镜  (黑白)
    _img.addImageFilter({
        cover: baseImageUrl,
        mode: "blackWhite"
    }).then((imageNode) => {
        $('.blackWhite-content').appendChild(imageNode)
    }).catch((err) => {
        console.error('add image filter error', err);
    })

    //添加图片滤镜  (浮雕)
    _img.addImageFilter({
        cover: baseImageUrl,
        mode: "relief"
    }).then((imageNode) => {
        $('.relief-content').appendChild(imageNode)
    }).catch((err) => {
        console.error('add image filter error', err);
    })

    //添加图片滤镜  (反色)
    _img.addImageFilter({
        cover: baseImageUrl,
        mode: "invert"
    }).then((imageNode) => {
        $('.invert-content').appendChild(imageNode)
    }).catch((err) => {
        console.error('add image filter error', err);
    })

    //添加图片滤镜  (镜像)
    _img.addImageFilter({
        cover: baseImageUrl,
        mode: "mirror"
    }).then((imageNode) => {
        $('.mirror-content').appendChild(imageNode)
    }).catch((err) => {
        console.error('add image filter error', err);
    })

    //添加图片滤镜  (模糊)
    _img.addImageFilter({
        cover: baseImageUrl,
        mode: "blur"
    }).then((imageNode) => {
        $('.blur-content').appendChild(imageNode)
    }).catch((err) => {
        console.error('add image filter error', err);
    })

```

### 正在完善中...
