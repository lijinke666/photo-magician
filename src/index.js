/**
 * image-magician.js
 * @author Jinke.Li
 * @github https://www.github.com/lijinke666/
 * 图片滤镜算法代码 参考网上代码
 */
/* global define*/
const PACKAGE_NAME = "imageMagician";
(function(name, definition) {
  const hasDefine = typeof define === "function";
  const hasExports = typeof module !== "undefined" && module.exports;
  if (hasDefine) {
    define(definition);
  } else if (hasExports) {
    exports.default = definition();
    module.exports = exports["default"];
  } else {
    this[name] = definition();
  }
})(PACKAGE_NAME, function() {
  class ImageMagician {
    constructor() {
      this.colors = {};
      this.cover = null;
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d");
      //图片滤镜
      this.imageFilterConfig = {
        vintage: "vintage", //复古
        blackWhite: "blackWhite", //黑白
        invert: "invert", //反色
        relief: "relief", //浮雕
        mirror: "mirror", //镜像
        blur: "blur" //模糊
      };
    }
    createImageNode(cover, canvasWidth, canvasHeight) {
      return new Promise((res, rej) => {
        const coverType = typeof cover;
        if (Object.is(coverType, "object")) {
          this.setCanvasWidth(canvasWidth, canvasHeight);
          res(cover);
        } else if (Object.is(coverType, "string")) {
          const img = new Image();
          img.src = cover;
          img.onload = () => {
            this.setCanvasWidth(
              canvasWidth || img.width,
              canvasHeight || img.height
            );
            res(img);
          };
          img.onerror = e => rej(e);
        } else {
          const errText = "The cover options is not a String of Object\n";
          rej(errText);
        }
      });
    }
    getCoverExt(cover) {
      this.checkCoverType(cover);
      return cover.replace(/.*\.(jpg|jpeg|png|gif)/, "$1");
    }
    setCanvasWidth(width, height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    checkCoverType(cover) {
      if (!Object.is(typeof (cover), "string"))
        throw new Error('cover can not be empty and it must be "string"');
    }
    /**
     * 添加水印
     * @param {Object} options
     * @param {String} cover 目标图片 必选
     * @param {String} waterMark 水印 (文本或图片地址) 必选
     * @param {String} mode 水印模式 非必选  text | image 默认 "text"
     * @param {Boolean} fontBold 文本水印加粗 (文字水印时有效) 非必选 默认 true
     * @param {Number} fontSize 文本字体大小 (文字水印时有效) 非必选 默认 20
     * @param {String} fontColor 文本水印颜色 (文字水印时有效) 非必选 默认 'rgba(255,255,255,.5)'
     * @param {Number} width 图片水印长度 (图片水印时有效) 非必选 默认 '50'
     * @param {NUmber} height 图片水印高度 (图片水印时有效) 非必选 默认 '50'
     */
    async addWaterMark({
      cover,
      coordinate = [0, 0],
      fontBold = true,
      fontSize = 20,
      fontColor = "rgba(255,255,255,.5)",
      mode = "text",
      width = 50,
      height = 50,
      opacity = 0.5,
      waterMark
    } = {}) {
      const isTextMode = Object.is(mode, "text");
      const isImageMode = Object.is(mode, "image");
      if (!waterMark) throw new Error("waterMark is required");
      if (!isTextMode && !isImageMode)
        throw new Error('mode it must be "text" of "image" ');
      return new Promise((res, rej) => {
        const ext = this.getCoverExt(cover);
        const [sx, sy] = coordinate;
        this.createImageNode(cover)
          .then(async img => {
            this.waterMarkCanvas = document.createElement("canvas");
            this.waterMarkCtx = this.waterMarkCanvas.getContext("2d");

            //绘制图片水印
            if (isImageMode) {
              const waterMarkImg = await this.createImageNode(
                waterMark,
                img.width,
                img.height
              );
              this.waterMarkCanvas.width = width;
              this.waterMarkCanvas.height = height;
              this.waterMarkCtx.globalAlpha = opacity;
              this.waterMarkCtx.drawImage(
                waterMarkImg,
                0,
                0,
                this.waterMarkCanvas.width,
                this.waterMarkCanvas.height
              );
            }

            //绘制文本水印
            if (isTextMode) {
              this.waterMarkCtx.font = `${fontBold ? "bold" : ""} ${fontSize}${
                /.*px$/.test(fontSize) ? "" : "px"
              } Microsoft YaHei`;
              this.waterMarkCtx.fillStyle = fontColor;
              this.waterMarkCtx.textBaseline = "middle";
              this.waterMarkCtx.fillText(waterMark, sx, sy);
            }

            //离屏渲染
            this.ctx.drawImage(img, 0, 0, img.width, img.height);
            this.ctx.drawImage(
              this.waterMarkCanvas,
              sx,
              sy,
              isImageMode ? this.waterMarkCanvas.width : img.width,
              isImageMode ? this.waterMarkCanvas.height : img.height
            );

            const waterMarkData = this.canvas.toDataURL(`image/${ext}`);
            this.createImageNode(waterMarkData)
              .then(waterMarkNode => {
                res(waterMarkNode);
              })
              .catch(rej);
          })
          .catch(rej);
      });
    }
    /**
     * 裁剪图片
     * @param {object} Options
     * @param {String} cover 图片 必选
     * @param {Number} scale 缩放比例  非必选 默认 1.0 不缩放
     * @param {Array} coordinate 裁剪坐标  必选  [[x1,y1],[x2,y2]]
     * @return 裁剪后的图片节点
     */
    clipImage({ cover, scale = 1.0, coordinate } = {}) {
      return new Promise((res, rej) => {
        const ext = this.getCoverExt(cover);
        const [xy1, xy2] = coordinate;
        const [x1, y1] = xy1;
        const [x2, y2] = xy2;

        const clipWidth = Math.abs(x2 - x1);
        const clipHeight = Math.abs(y2 - y1);
        this.createImageNode(cover, clipWidth, clipHeight)
          .then(img => {
            this.ctx.drawImage(
              img,
              x1 / scale,
              y1 / scale,
              clipWidth / scale,
              clipHeight / scale,
              0,
              0,
              clipWidth,
              clipHeight
            );
            const clipImageData = this.canvas.toDataURL(`image/${ext}`);
            this.createImageNode(clipImageData)
              .then(clipImageNode => {
                res(clipImageNode);
              })
              .catch(rej);
          })
          .catch(rej);
      });
    }
    //拷贝图片像素信息
    copyImageData({ width, height, data } = {}) {
      const copyData = this.ctx.createImageData(width, height);
      copyData.data.set(data);
      return copyData;
    }
    //获取图片像素信息
    transFormImageData(filterType, suffix) {
      //每一个像素由4个元素组成  分别是  r g b a
      //所以 第 i 个元素  是
      //r = pixelData[ i*4 +0 ];
      //g = pixelData[ i*4 +1 ];
      //b = pixelData[ i*4 +2 ];
      //a = pixelData[ i*4 +3 ];
      this.filterCanvas = document.createElement("canvas");
      this.filterCtx = this.filterCanvas.getContext("2d");
      this.filterCanvas.width = this.canvas.width;
      this.filterCanvas.height = this.canvas.height;
      let imageData = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      ); //像素信息

      let { data } = imageData;
      const canvasArea = this.canvas.width * this.canvas.height;
      const tempData = this.copyImageData(imageData);
      let sumred = 0.0,
        sumgreen = 0.0,
        sumblue = 0.0;

      switch (filterType) {
        //复古 (灰白)
        case this.imageFilterConfig["vintage"]:
          for (let i = 0; i < canvasArea; i++) {
            let r = data[i * 4],
              g = data[i * 4 + 1],
              b = data[i * 4] + 2;
            //国际 最佳灰色图像算法
            let grey = r * 0.3 + g * 0.59 + b * 0.11;
            data[i * 4] = grey;
            data[i * 4 + 1] = grey;
            data[i * 4 + 2] = grey;
          }
          break;
        //黑白
        case this.imageFilterConfig["blackWhite"]:
          for (let i = 0; i < canvasArea; i++) {
            let r = data[i * 4],
              g = data[i * 4 + 1],
              b = data[i * 4] + 2,
              color = null;
            let grey = r * 0.3 + g * 0.59 + b * 0.11;

            if (grey > 255 / 2) {
              color = 255;
            } else {
              color = 0;
            }

            data[i * 4] = color;
            data[i * 4 + 1] = color;
            data[i * 4 + 2] = color;
          }
          break;
        //反色 以下几个滤镜是copy 的网上的代码

        case this.imageFilterConfig["invert"]:
          for (let i = 0; i < canvasArea; i += 4) {
            let r = data[i],
              g = data[i + 1],
              b = data[i + 2];

            data[i] = 255 - r;
            data[i + 1] = 255 - g;
            data[i + 2] = 255 - b;
          }
          break;
        //浮雕
        case this.imageFilterConfig["relief"]:
          for (let x = 1; x < tempData.width - 1; x++) {
            for (let y = 1; y < tempData.height - 1; y++) {
              let idx = (x + y * tempData.width) * 4,
                bidx = (x - 1 + y * tempData.width) * 4,
                aidx = (x + 1 + y * tempData.width) * 4;

              let nr = tempData.data[aidx + 0] - tempData.data[bidx + 0] + 128;
              let ng = tempData.data[aidx + 1] - tempData.data[bidx + 1] + 128;
              let nb = tempData.data[aidx + 2] - tempData.data[bidx + 2] + 128;

              nr = nr < 0 ? 0 : nr > 255 ? 255 : nr;
              ng = ng < 0 ? 0 : ng > 255 ? 255 : ng;
              nb = nb < 0 ? 0 : nb > 255 ? 255 : nb;

              data[idx + 0] = nr;
              data[idx + 1] = ng;
              data[idx + 2] = nb;
              data[idx + 3] = 255;
            }
          }
          break;
        //镜像
        case this.imageFilterConfig["mirror"]:
          for (let x = 0; x < tempData.width; x++) {
            for (let y = 0; y < tempData.height; y++) {
              let idx = (x + y * tempData.width) * 4;
              let midx = (tempData.width - 1 - x + y * tempData.width) * 4;

              data[midx + 0] = data[idx + 0];
              data[midx + 1] = data[idx + 1];
              data[midx + 2] = data[idx + 2];
              data[midx + 3] = 255;
            }
          }
          break;
        case this.imageFilterConfig["blur"]:
          for (let x = 0; x < tempData.width; x++) {
            for (let y = 0; y < tempData.height; y++) {
              // Index of the pixel in the array
              let idx = (x + y * tempData.width) * 4;
              for (let subCol = -2; subCol <= 2; subCol++) {
                let colOff = subCol + x;
                if (colOff < 0 || colOff >= tempData.width) {
                  colOff = 0;
                }
                for (let subRow = -2; subRow <= 2; subRow++) {
                  let rowOff = subRow + y;
                  if (rowOff < 0 || rowOff >= tempData.height) {
                    rowOff = 0;
                  }
                  let idx2 = (colOff + rowOff * tempData.width) * 4;
                  let r = tempData.data[idx2 + 0];
                  let g = tempData.data[idx2 + 1];
                  let b = tempData.data[idx2 + 2];
                  sumred += r;
                  sumgreen += g;
                  sumblue += b;
                }
              }

              // calculate new RGB value
              let nr = sumred / 25.0;
              let ng = sumgreen / 25.0;
              let nb = sumblue / 25.0;

              // clear previous for next pixel point
              sumred = 0.0;
              sumgreen = 0.0;
              sumblue = 0.0;

              // assign new pixel value
              data[idx + 0] = nr; // Red channel
              data[idx + 1] = ng; // Green channel
              data[idx + 2] = nb; // Blue channel
              data[idx + 3] = 255; // Alpha channel
            }
          }
          break;
      }
      this.filterCtx.putImageData(
        imageData,
        0,
        0,
        0,
        0,
        this.filterCanvas.width,
        this.filterCanvas.height
      );
      return this.filterCanvas.toDataURL(`image/${suffix}`);
    }
    /**
     * 图片滤镜
     * @param {Object} options
     * @param {String} mode 滤镜名字 非必须 默认 复古 'vintage'
     */
    addImageFilter({ cover, mode = this.imageFilterConfig["vintage"] } = {}) {
      return new Promise((res, rej) => {
        const ext = this.getCoverExt(cover);
        this.createImageNode(cover)
          .then(img => {
            this.ctx.drawImage(img, 0, 0, img.width, img.height);
            const filterData = this.transFormImageData(mode, ext);
            this.createImageNode(filterData)
              .then(filterImageNode => {
                res(filterImageNode);
              })
              .catch(rej);
          })
          .catch(rej);
      });
    }
    /**
     * 旋转图片
     * @param {String | Object} cover 图片
     * @param {Number} rotate 旋转比例 (0 -360 ) deg
     */
    rotateImage({ cover, rotate = 0 } = {}) {
      return new Promise((res, rej) => {
        const ext = this.getCoverExt(cover);
        this.createImageNode(cover)
          .then(img => {
            this.ctx.save();
            this.ctx.rotate(rotate * Math.PI / 180);
            this.ctx.drawImage(img, 0, 0, img.width, img.height);
            this.ctx.restore();
            const base64URL = this.canvas.toDataURL(`image/${ext}`);
            this.createImageNode(base64URL)
              .then(node => {
                res(node);
              })
              .catch(rej);
          })
          .catch(rej);
      });
    }
    /**
     * 图片 转base64
     * @param {Object} options
     * @param {String | Object} cover 图片地址
     * @return 图片base64 data
     */
    toBase64Url({ cover }) {
      return new Promise((res, rej) => {
        const ext = this.getCoverExt(cover);
        this.createImageNode(cover)
          .then(img => {
            this.ctx.drawImage(img, 0, 0, img.width, img.height);
            const base64URL = this.canvas.toDataURL(`image/${ext}`);
            res(base64URL);
          })
          .catch(rej);
      });
    }
    /**
     * 压缩图片
     * @param {Object} options
     * @param {String | Object} cover 图片地址 | 图片节点 必选
     * @param {Number}  quality 压缩比例  非必选 默认 '0.92'
     * @return 压缩后的图片节点
     */
    compressImage({ cover, quality = 0.92 } = {}) {
      return new Promise((res, rej) => {
        this.createImageNode(cover)
          .then(img => {
            this.ctx.drawImage(img, 0, 0, img.width, img.height);
            const compressImage = this.canvas.toDataURL(
              "image/jpeg",
              Number(quality)
            );
            this.createImageNode(compressImage)
              .then(compressImageNode => {
                res(compressImageNode);
              })
              .catch(rej);
          })
          .catch(rej);
      });
    }
    getPrimaryColor({ cover } = {}) {
      return new Promise((res, rej) => {
        this.createImageNode(cover)
          .then(img => {
            this.ctx.drawImage(img, 0, 0, img.width, img.height);
            const {
              data,
              width: imgDataWidth,
              height: imgdataHeight
            } = this.ctx.getImageData(0, 0, img.width, img.height);
            for (let i = 0, len = imgDataWidth * imgdataHeight; i < len; i++) {
              const [r, g, b, a] = [
                data[i * 4],
                data[i * 4 + 1],
                data[i * 4 + 2],
                data[i * 4 + 3]
              ];

              const rgba = `rgba(${r},${g},${b},${a})`;

              if (this.colors[rgba]) {
                this.colors[rgba].num++;
              } else {
                this.colors[rgba] = {
                  color: rgba,
                  num: 1
                };
              }
            }
            const primaryColor = this.getMax(this.colors);
            res(primaryColor);
          })
          .catch(rej);
      });
    }
    static getMax(data) {
      const sort = Object.values(data).sort((a, b) => a.num - b.num);
      return sort[sort.length - 1]["color"];
    }
    static getValues(obj) {
      return (
        (Object.values && Object.values(obj)) ||
        Object.keys(obj).map(v => obj[v])
      );
    }
  }
  return ImageMagician;
});
