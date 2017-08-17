const gulp = require('gulp')
const babel = require('gulp-babel')   //es6转es5
const jsmin = require("gulp-uglify")  //压缩js
const path = require('path')
const rename = require("gulp-rename")  //重命名
const concat = require("gulp-concat")  //合并文件
const rev = require('gulp-rev-append')
const auto = require('gulp-autoprefixer');     //自动加前缀
const less = require('gulp-less')
const cssmin = require('gulp-clean-css')   //压缩css
const browserSync = require('browser-sync').create()  //热更新
const reload = browserSync.reload
const imgmin = require('gulp-imagemin')
const cache = require('gulp-cache')

const pathBuild = (p) => {
  return path.resolve(__dirname, p)
}
//压缩js
gulp.task("buildjs", () => {
  console.log('================[build js start]===================')
  gulp.src([ pathBuild("libs/*.js")])
    .pipe(concat("image-magician.min.js"))
    .pipe(babel())
    // .pipe(jsmin({
    //   mangle: true,//类型：Boolean 默认：true 是否修改变量名
    //   compress: true//类型：Boolean 默认：true 是否完全压缩
    // }))
    .pipe(gulp.dest(pathBuild("libs/")))
    .pipe(reload({stream:true}))
})

//开发服务器
gulp.task('server',['buildjs'],()=>{
  browserSync.init({
    server:{
      baseDir:"./"
    }
  })
  gulp.watch(pathBuild('libs/*.js'),['buildjs']);
  gulp.watch(pathBuild('src/views/*.html')).on('change',reload);
})