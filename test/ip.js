import test from "ava";
import { Client } from "..";

const is = new Client(process.env.KEY).ip();

test("lookup", async t => {
  await t.notThrowsAsync(async () => {
    const response = await is.lookup({
      ip: "96.45.83.67"
    });
    t.not(response.country, "");
  });
});
