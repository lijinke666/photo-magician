global.requestAnimationFrame =
  global.requestAnimationFrame ||
  function _raf(cb) {
    return setTimeout(cb, 0);
  };

import jsdom from "jsdom";

if (typeof document === "undefined") {
  global.document = jsdom.jsdom("<!doctype html><html><body></body></html>");
  global.window = document.defaultView;
  global.navigator = global.window.navigator;
  function copyProps(src, target) {
    const props = Object.getOwnPropertyNames(src)
      .filter(prop => typeof target[prop] === "undefined")
      .reduce(
        (result, prop) => ({
          ...result,
          [prop]: Object.getOwnPropertyDescriptor(src, prop)
        }),
        {}
      );
    Object.defineProperties(target, props);
  }
  
  global.window = window;
  global.document = window.document;
  global.navigator = {
    userAgent: "node.js"
  };
  copyProps(window, global);
  
  window.alert = msg => {
    console.log(msg);
  };
  window.matchMedia = () => ({});
  window.scrollTo = () => {};
}
