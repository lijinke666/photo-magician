"use strict";

var _isIterable2 = require("babel-runtime/core-js/is-iterable");

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _iterator = require("babel-runtime/core-js/symbol/iterator");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require("babel-runtime/core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var _defineProperty = require("babel-runtime/core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _values = require("babel-runtime/core-js/object/values");

var _values2 = _interopRequireDefault(_values);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _is = require("babel-runtime/core-js/object/is");

var _is2 = _interopRequireDefault(_is);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if ((0, _isIterable3.default)(Object(arr))) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; (0, _defineProperty2.default)(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _promise2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _promise2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * image-magician.js
 * @author Jinke.Li
 * @github https://www.github.com/lijinke666/
 * 图片滤镜算法代码 参考网上代码
 */
var VERSION = "0.4.0";
var PACKAGE_NAME = "imageMagician";(function (name, definition) {
    var hasDefine = typeof define === 'function';
    var hasExports = typeof module !== 'undefined' && module.exports;
    if (hasDefine) {
        define(definition);
    } else if (hasExports) {
        module.exports = definition();
    } else {
        undefined[name] = definition();
    }
})(PACKAGE_NAME, function () {
    var ImageMagician = function () {
        function ImageMagician() {
            _classCallCheck(this, ImageMagician);

            this.colors = {};
            this.cover = null;
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            //图片滤镜
            this.imageFilterConfig = {
                'vintage': "vintage", //复古
                "blackWhite": "blackWhite", //黑白
                "invert": "invert", //反色
                "relief": "relief", //浮雕
                "mirror": "mirror", //镜像
                "blur": "blur" //模糊
            };
        }

        _createClass(ImageMagician, [{
            key: "createImageNode",
            value: function createImageNode(cover, canvasWidth, canvasHeight) {
                var _this = this;

                return new _promise2.default(function (res, rej) {
                    var coverType = typeof cover === "undefined" ? "undefined" : _typeof(cover);
                    if ((0, _is2.default)(coverType, 'object')) {
                        _this.setCanvasWidth(canvasWidth, canvasHeight);
                        res(cover);
                    } else if ((0, _is2.default)(coverType, 'string')) {
                        var img = new Image();
                        img.src = cover;
                        img.onload = function () {
                            _this.setCanvasWidth(canvasWidth || img.width, canvasHeight || img.height);
                            res(img);
                        };
                        img.onerror = function (e) {
                            return rej(e);
                        };
                    } else {
                        var errText = 'The cover options is not a String of Object\n';
                        rej(errText);
                    }
                });
            }
        }, {
            key: "getCoverExt",
            value: function getCoverExt(cover) {
                this.checkCoverType(cover);
                return cover.replace(/.*\.(jpg|jpeg|png|gif)/, "$1");
            }
        }, {
            key: "setCanvasWidth",
            value: function setCanvasWidth(width, height) {
                this.canvas.width = width;
                this.canvas.height = height;
            }
        }, {
            key: "checkCoverType",
            value: function checkCoverType(cover) {
                if (!(0, _is2.default)(typeof cover === "undefined" ? "undefined" : _typeof(cover), 'string')) throw new Error('cover it must be "string"');
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

        }, {
            key: "addWaterMark",
            value: function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                    var _this2 = this;

                    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                        cover = _ref2.cover,
                        _ref2$coordinate = _ref2.coordinate,
                        coordinate = _ref2$coordinate === undefined ? [0, 0] : _ref2$coordinate,
                        _ref2$fontBold = _ref2.fontBold,
                        fontBold = _ref2$fontBold === undefined ? true : _ref2$fontBold,
                        _ref2$fontSize = _ref2.fontSize,
                        fontSize = _ref2$fontSize === undefined ? 20 : _ref2$fontSize,
                        _ref2$fontColor = _ref2.fontColor,
                        fontColor = _ref2$fontColor === undefined ? "rgba(255,255,255,.5)" : _ref2$fontColor,
                        _ref2$mode = _ref2.mode,
                        mode = _ref2$mode === undefined ? "text" : _ref2$mode,
                        _ref2$width = _ref2.width,
                        width = _ref2$width === undefined ? 50 : _ref2$width,
                        _ref2$height = _ref2.height,
                        height = _ref2$height === undefined ? 50 : _ref2$height,
                        _ref2$opacity = _ref2.opacity,
                        opacity = _ref2$opacity === undefined ? 0.5 : _ref2$opacity,
                        waterMark = _ref2.waterMark;

                    var isTextMode, isImageMode;
                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    isTextMode = (0, _is2.default)(mode, 'text');
                                    isImageMode = (0, _is2.default)(mode, 'image');

                                    if (waterMark) {
                                        _context2.next = 4;
                                        break;
                                    }

                                    throw new Error('waterMark is required');

                                case 4:
                                    if (!(!isTextMode && !isImageMode)) {
                                        _context2.next = 6;
                                        break;
                                    }

                                    throw new Error('mode it must be "text" of "image" ');

                                case 6:
                                    return _context2.abrupt("return", new _promise2.default(function (res, rej) {
                                        var ext = _this2.getCoverExt(cover);

                                        var _coordinate = _slicedToArray(coordinate, 2),
                                            sx = _coordinate[0],
                                            sy = _coordinate[1];

                                        _this2.createImageNode(cover).then(function () {
                                            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(img) {
                                                var waterMarkImg, waterMarkData;
                                                return _regenerator2.default.wrap(function _callee$(_context) {
                                                    while (1) {
                                                        switch (_context.prev = _context.next) {
                                                            case 0:
                                                                _this2.waterMarkCanvas = document.createElement('canvas');
                                                                _this2.waterMarkCtx = _this2.waterMarkCanvas.getContext('2d');

                                                                //绘制图片水印

                                                                if (!isImageMode) {
                                                                    _context.next = 10;
                                                                    break;
                                                                }

                                                                _context.next = 5;
                                                                return _this2.createImageNode(waterMark, img.width, img.height);

                                                            case 5:
                                                                waterMarkImg = _context.sent;

                                                                _this2.waterMarkCanvas.width = width;
                                                                _this2.waterMarkCanvas.height = height;
                                                                _this2.waterMarkCtx.globalAlpha = opacity;
                                                                _this2.waterMarkCtx.drawImage(waterMarkImg, 0, 0, _this2.waterMarkCanvas.width, _this2.waterMarkCanvas.height);

                                                            case 10:

                                                                //绘制文本水印
                                                                if (isTextMode) {
                                                                    _this2.waterMarkCtx.font = (fontBold ? 'bold' : "") + " " + fontSize + (/.*px$/.test(fontSize) ? '' : 'px') + " Microsoft YaHei";
                                                                    _this2.waterMarkCtx.fillStyle = fontColor;
                                                                    _this2.waterMarkCtx.textBaseline = "middle";
                                                                    _this2.waterMarkCtx.fillText(waterMark, sx, sy);
                                                                }

                                                                //离屏渲染
                                                                _this2.ctx.drawImage(img, 0, 0, img.width, img.height);
                                                                _this2.ctx.drawImage(_this2.waterMarkCanvas, sx, sy, isImageMode ? _this2.waterMarkCanvas.width : img.width, isImageMode ? _this2.waterMarkCanvas.height : img.height);

                                                                waterMarkData = _this2.canvas.toDataURL("image/" + ext);

                                                                _this2.createImageNode(waterMarkData).then(function (waterMarkNode) {
                                                                    res(waterMarkNode);
                                                                }).catch(rej);

                                                            case 15:
                                                            case "end":
                                                                return _context.stop();
                                                        }
                                                    }
                                                }, _callee, _this2);
                                            }));

                                            return function (_x2) {
                                                return _ref3.apply(this, arguments);
                                            };
                                        }()).catch(rej);
                                    }));

                                case 7:
                                case "end":
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this);
                }));

                function addWaterMark() {
                    return _ref.apply(this, arguments);
                }

                return addWaterMark;
            }()
            /**
             * 裁剪图片
            * @param {object} Options 
            * @param {String} cover 图片 必选 
            * @param {Number} scale 缩放比例  非必选 默认 1.0 不缩放 
            * @param {Array} coordinate 裁剪坐标  必选  [[x1,y1],[x2,y2]]
            * @return 裁剪后的图片节点
            */

        }, {
            key: "clipImage",
            value: function clipImage() {
                var _this3 = this;

                var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                    cover = _ref4.cover,
                    _ref4$scale = _ref4.scale,
                    scale = _ref4$scale === undefined ? 1.0 : _ref4$scale,
                    coordinate = _ref4.coordinate;

                return new _promise2.default(function (res, rej) {
                    var ext = _this3.getCoverExt(cover);

                    var _coordinate2 = _slicedToArray(coordinate, 2),
                        xy1 = _coordinate2[0],
                        xy2 = _coordinate2[1];

                    var _xy = _slicedToArray(xy1, 2),
                        x1 = _xy[0],
                        y1 = _xy[1];

                    var _xy2 = _slicedToArray(xy2, 2),
                        x2 = _xy2[0],
                        y2 = _xy2[1];

                    var clipWidth = Math.abs(x2 - x1);
                    var clipHeight = Math.abs(y2 - y1);
                    _this3.createImageNode(cover, clipWidth, clipHeight).then(function (img) {
                        _this3.ctx.drawImage(img, x1 / scale, y1 / scale, clipWidth / scale, clipHeight / scale, 0, 0, clipWidth, clipHeight);
                        var clipImageData = _this3.canvas.toDataURL("image/" + ext);
                        _this3.createImageNode(clipImageData).then(function (clipImageNode) {
                            res(clipImageNode);
                        }).catch(rej);
                    }).catch(rej);
                });
            }
            //拷贝图片像素信息

        }, {
            key: "copyImageData",
            value: function copyImageData() {
                var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                    width = _ref5.width,
                    height = _ref5.height,
                    data = _ref5.data;

                var copyData = this.ctx.createImageData(width, height);
                copyData.data.set(data);
                return copyData;
            }
            //获取图片像素信息

        }, {
            key: "transFormImageData",
            value: function transFormImageData(filterType, suffix) {
                //每一个像素由4个元素组成  分别是  r g b a
                //所以 第 i 个元素  是
                //r = pixelData[ i*4 +0 ];
                //g = pixelData[ i*4 +1 ];
                //b = pixelData[ i*4 +2 ];
                //a = pixelData[ i*4 +3 ];
                this.filterCanvas = document.createElement('canvas');
                this.filterCtx = this.filterCanvas.getContext('2d');
                this.filterCanvas.width = this.canvas.width;
                this.filterCanvas.height = this.canvas.height;
                var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height); //像素信息

                var width = imageData.width,
                    height = imageData.height,
                    data = imageData.data;

                var canvasArea = this.canvas.width * this.canvas.height;

                switch (filterType) {
                    //复古 (灰白)
                    case this.imageFilterConfig['vintage']:
                        for (var i = 0; i < canvasArea; i++) {
                            var r = data[i * 4],
                                g = data[i * 4 + 1],
                                b = data[i * 4] + 2;
                            //国际 最佳灰色图像算法
                            var grey = r * 0.3 + g * 0.59 + b * 0.11;
                            data[i * 4] = grey;
                            data[i * 4 + 1] = grey;
                            data[i * 4 + 2] = grey;
                        }
                        break;
                    //黑白
                    case this.imageFilterConfig['blackWhite']:
                        for (var _i = 0; _i < canvasArea; _i++) {
                            var _r = data[_i * 4],
                                _g = data[_i * 4 + 1],
                                _b = data[_i * 4] + 2,
                                color = null;
                            var _grey = _r * 0.3 + _g * 0.59 + _b * 0.11;

                            if (_grey > 255 / 2) {
                                color = 255;
                            } else {
                                color = 0;
                            }

                            data[_i * 4] = color;
                            data[_i * 4 + 1] = color;
                            data[_i * 4 + 2] = color;
                        }
                        break;
                    //反色 以下几个滤镜是copy 的网上的代码

                    case this.imageFilterConfig['invert']:
                        for (var _i2 = 0; _i2 < canvasArea; _i2 += 4) {
                            var _r2 = data[_i2],
                                _g2 = data[_i2 + 1],
                                _b2 = data[_i2 + 2];

                            data[_i2] = 255 - _r2;
                            data[_i2 + 1] = 255 - _g2;
                            data[_i2 + 2] = 255 - _b2;
                        }
                        break;
                    //浮雕
                    case this.imageFilterConfig['relief']:
                        var copyImageData = this.copyImageData(imageData);
                        for (var x = 1; x < copyImageData.width - 1; x++) {
                            for (var y = 1; y < copyImageData.height - 1; y++) {

                                var idx = (x + y * copyImageData.width) * 4,
                                    bidx = (x - 1 + y * copyImageData.width) * 4,
                                    aidx = (x + 1 + y * copyImageData.width) * 4;

                                var nr = copyImageData.data[aidx + 0] - copyImageData.data[bidx + 0] + 128;
                                var ng = copyImageData.data[aidx + 1] - copyImageData.data[bidx + 1] + 128;
                                var nb = copyImageData.data[aidx + 2] - copyImageData.data[bidx + 2] + 128;

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
                    case this.imageFilterConfig['mirror']:
                        var copyData = this.copyImageData(imageData);
                        for (var _x5 = 0; _x5 < copyData.width; _x5++) {
                            for (var _y = 0; _y < copyData.height; _y++) {

                                var _idx = (_x5 + _y * copyData.width) * 4;
                                var midx = (copyData.width - 1 - _x5 + _y * copyData.width) * 4;

                                data[midx + 0] = data[_idx + 0];
                                data[midx + 1] = data[_idx + 1];
                                data[midx + 2] = data[_idx + 2];
                                data[midx + 3] = 255;
                            }
                        }
                        break;
                    case this.imageFilterConfig['blur']:
                        var tempData = this.copyImageData(imageData);
                        var sumred = 0.0,
                            sumgreen = 0.0,
                            sumblue = 0.0;
                        for (var _x6 = 0; _x6 < tempData.width; _x6++) {
                            for (var _y2 = 0; _y2 < tempData.height; _y2++) {

                                // Index of the pixel in the array      
                                var _idx2 = (_x6 + _y2 * tempData.width) * 4;
                                for (var subCol = -2; subCol <= 2; subCol++) {
                                    var colOff = subCol + _x6;
                                    if (colOff < 0 || colOff >= tempData.width) {
                                        colOff = 0;
                                    }
                                    for (var subRow = -2; subRow <= 2; subRow++) {
                                        var rowOff = subRow + _y2;
                                        if (rowOff < 0 || rowOff >= tempData.height) {
                                            rowOff = 0;
                                        }
                                        var idx2 = (colOff + rowOff * tempData.width) * 4;
                                        var _r3 = tempData.data[idx2 + 0];
                                        var _g3 = tempData.data[idx2 + 1];
                                        var _b3 = tempData.data[idx2 + 2];
                                        sumred += _r3;
                                        sumgreen += _g3;
                                        sumblue += _b3;
                                    }
                                }

                                // calculate new RGB value  
                                var _nr = sumred / 25.0;
                                var _ng = sumgreen / 25.0;
                                var _nb = sumblue / 25.0;

                                // clear previous for next pixel point  
                                sumred = 0.0;
                                sumgreen = 0.0;
                                sumblue = 0.0;

                                // assign new pixel value      
                                data[_idx2 + 0] = _nr; // Red channel      
                                data[_idx2 + 1] = _ng; // Green channel      
                                data[_idx2 + 2] = _nb; // Blue channel      
                                data[_idx2 + 3] = 255; // Alpha channel      
                            }
                        }
                        break;
                }
                this.filterCtx.putImageData(imageData, 0, 0, 0, 0, this.filterCanvas.width, this.filterCanvas.height);
                return this.filterCanvas.toDataURL("image/" + suffix);
            }
            /**
             * 图片滤镜
             * @param {Object} options 
             * @param {String} mode 滤镜名字 非必须 默认 复古 'vintage' 
             */

        }, {
            key: "addImageFilter",
            value: function addImageFilter() {
                var _this4 = this;

                var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                    cover = _ref6.cover,
                    _ref6$mode = _ref6.mode,
                    mode = _ref6$mode === undefined ? this.imageFilterConfig['vintage'] : _ref6$mode;

                return new _promise2.default(function (res, rej) {
                    var ext = _this4.getCoverExt(cover);
                    _this4.createImageNode(cover).then(function (img) {
                        _this4.ctx.drawImage(img, 0, 0, img.width, img.height);
                        var filterData = _this4.transFormImageData(mode, ext);
                        _this4.createImageNode(filterData).then(function (filterImageNode) {
                            res(filterImageNode);
                        }).catch(rej);
                    }).catch(rej);
                });
            }
            /**
             * 旋转图片
             * @param {String | Object} cover 图片
             * @param {Number} rotate 旋转比例 (0 -360 ) deg
             */

        }, {
            key: "rotateImage",
            value: function rotateImage() {
                var _this5 = this;

                var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                    cover = _ref7.cover,
                    _ref7$rotate = _ref7.rotate,
                    rotate = _ref7$rotate === undefined ? 0 : _ref7$rotate;

                return new _promise2.default(function (res, rej) {
                    var ext = _this5.getCoverExt(cover);
                    _this5.createImageNode(cover).then(function (img) {
                        _this5.ctx.save();
                        _this5.ctx.rotate(rotate * Math.PI / 180);
                        _this5.ctx.drawImage(img, 0, 0, img.width, img.height);
                        _this5.ctx.restore();
                        var base64URL = _this5.canvas.toDataURL("image/" + ext);
                        _this5.createImageNode(base64URL).then(function (node) {
                            res(node);
                        }).catch(rej);
                    }).catch(rej);
                });
            }
            /**
             * 图片 转base64
             * @param {Object} options 
             * @param {String | Object} cover 图片地址 
             * @return 图片base64 data
             */

        }, {
            key: "toBase64Url",
            value: function toBase64Url(_ref8) {
                var _this6 = this;

                var cover = _ref8.cover;

                return new _promise2.default(function (res, rej) {
                    var ext = _this6.getCoverExt(cover);
                    _this6.createImageNode(cover).then(function (img) {
                        _this6.ctx.drawImage(img, 0, 0, img.width, img.height);
                        var base64URL = _this6.canvas.toDataURL("image/" + ext);
                        res(base64URL);
                    }).catch(rej);
                });
            }
            /**
             * 压缩图片
             * @param {Object} options
             * @param {String | Object} cover 图片地址 | 图片节点 必选
             * @param {Number}  quality 压缩比例  非必选 默认 '0.92'
             * @return 压缩后的图片节点
             */

        }, {
            key: "compressImage",
            value: function compressImage() {
                var _this7 = this;

                var _ref9 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                    cover = _ref9.cover,
                    _ref9$quality = _ref9.quality,
                    quality = _ref9$quality === undefined ? 0.92 : _ref9$quality;

                return new _promise2.default(function (res, rej) {
                    _this7.createImageNode(cover).then(function (img) {
                        _this7.ctx.drawImage(img, 0, 0, img.width, img.height);
                        var compressImage = _this7.canvas.toDataURL('image/jpeg', Number(quality));
                        _this7.createImageNode(compressImage).then(function (compressImageNode) {
                            res(compressImageNode);
                        }).catch(rej);
                    }).catch(rej);
                });
            }
        }, {
            key: "getPrimaryColor",
            value: function getPrimaryColor() {
                var _this8 = this;

                var _ref10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                    cover = _ref10.cover;

                return new _promise2.default(function (res, rej) {
                    _this8.createImageNode(cover).then(function (img) {
                        _this8.ctx.drawImage(img, 0, 0, img.width, img.height);

                        var _ctx$getImageData = _this8.ctx.getImageData(0, 0, img.width, img.height),
                            data = _ctx$getImageData.data,
                            imgDataWidth = _ctx$getImageData.width,
                            imgdataHeight = _ctx$getImageData.height;

                        for (var i = 0, len = imgDataWidth * imgdataHeight; i < len; i++) {
                            var _ref11 = [data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]],
                                r = _ref11[0],
                                g = _ref11[1],
                                b = _ref11[2],
                                a = _ref11[3];


                            var rgba = "rgba(" + r + "," + g + "," + b + "," + a + ")";

                            if (_this8.colors[rgba]) {
                                _this8.colors[rgba].num++;
                            } else {
                                _this8.colors[rgba] = {
                                    color: rgba,
                                    num: 1
                                };
                            }
                        }
                        var primaryColor = _this8.getMax(_this8.colors);
                        res(primaryColor);
                    }).catch(rej);
                });
            }
        }, {
            key: "getMax",
            value: function getMax(data) {
                var sort = (0, _values2.default)(data).sort(function (a, b) {
                    return a.num - b.num;
                });
                return sort[sort.length - 1]['color'];
            }
        }, {
            key: "getValues",
            value: function getValues(obj) {
                return _values2.default && (0, _values2.default)(obj) || (0, _keys2.default)(obj).map(function (v) {
                    return obj[v];
                });
            }
        }]);

        return ImageMagician;
    }();

    return ImageMagician;
});