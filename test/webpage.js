import test from "ava";
import { Client } from "..";

const ws = new Client(process.env.KEY).webpage();

test("image", async t => {
  await t.notThrowsAsync(async () => {
    const response = await ws.image({
      url: "http://amazon.com"
    });
    t.not(response.image, "");
  });
});

test("pdf", async t => {
  await t.notThrowsAsync(async () => {
    const response = await ws.pdf({
      url: "http://amazon.com"
    });
    t.not(response.pdf, "");
  });
});
