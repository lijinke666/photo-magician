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
}
