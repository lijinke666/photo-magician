/*eslint-disable */
import assert from "power-assert";
import imageMagician from "../src";
import validator from "validator"

const cover = {
  cover:"../assets/watermark.png"
}
const magician = new imageMagician(cover)
describe("imageMagician Tests", () => {
    it("should return base64 data", async () => {
      const data = await magician.toBase64Url(cover)
      assert(validator.isBase64(data));
    });
    it("should get primary color of the image", async () => {
      const color = await magician.getPrimaryColor(cover)
      assert(color === "rgb(0,200,0)");
    });
    it("should clipImage", async (done) => {
      const data = await magician.clipImage({
        ...cover,
        coordinate: [[0, 0], [50, 50]]
      })
      const img = new Image()
      img.src = data
      img.onload = ()=>{
        assert(img.width === 50 && image.height === 50);
        done()
      }
    });
});
