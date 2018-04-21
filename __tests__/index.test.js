/*eslint-disable */
import assert from "power-assert";
import imageMagician from "../src";

const cover = {
  cover:"../assets/demo.jpg"
}
const magician = new imageMagician(cover)
console.log(magician.toBase64Url())
describe("imageMagician Tests", () => {
    it("should return a boolean", () => {
      assert(imageMagician);
    });
});
