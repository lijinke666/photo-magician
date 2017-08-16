class imageMagician {
    constructor() {
        this.cover = null
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')
    }
    createImageNode(cover) {
        return new Promise((res, rej) => {
            const coverType = typeof cover
            if (Object.is(coverType, 'object')) {
                res(cover)
            } else if (Object.is(coverType, 'string')) {
                const img = new Image()
                img.src = cover
                img.onload = () => {
                    this.setCanvasWidth(img.width,img.height)
                    res(img)
                }
                img.onerror = (e) => rej(e)
            } else {
                const errText = 'The cover options is not a String of Object\n'
                rej(errText)
            }
        })
    }
    setCanvasWidth(width,height){
        this.canvas.width = width
        this.canvas.height = height
    }
    toBase64Url({
        cover
    }){
        if(!Object.is(typeof cover,'string')) throw new Error('cover it must be "string"')
        return new Promise((res,rej)=>{
            const ext = cover.replace(/.*\.(jpg|jpeg|png|gif)/,"$1")
            this.createImageNode(cover).then((img) => {
                this.ctx.drawImage(img, 0, 0, img.width, img.height)
                const base64URL = this.canvas.toDataURL(`image/${ext}`)
                res(base64URL)
            }).catch(rej)
        })
    }
    /**
     * 
     * @param {Object} options
     * @param {String | Object} cover 图片地址 或者图片节点
     * @param {Number}  quality 压缩比例
     */
    compressImage({
        cover,
        quality,
    } = {
            quality: 0.92,
        }) {
        return new Promise((res, rej) => {
            this.createImageNode(cover).then((img) => {
                this.ctx.drawImage(img, 0, 0, img.width, img.height)
                const compressImage = this.canvas.toDataURL(Number(quality), 'image/jpeg')
                this.createImageNode(compressImage).then((compressImageNode) => {
                    res(compressImageNode)
                }).catch(rej)
            }).catch(rej)
        })
    }
}


