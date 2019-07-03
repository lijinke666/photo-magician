/*global process */
import { rollup } from "rollup";
import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";

rollup({
  entry: "src/index.js",
  plugins: [
    babel({
      presets: ["es2015-rollup"],
      babelrc: false
    }),
    uglify()
  ]
})
  .then(bundle =>
    bundle.write({
      dest: `photoMagician.min.js`,
      format: "umd", //CMD  nodejs  AMD 异步模块规范  UMD 通用模块规范
      moduleName: "photoMagician"
    })
  )
  .catch(e => {
    process.stderr.write(e.message + "\n");
    process.exit(1);
  });
