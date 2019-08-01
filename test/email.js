import test from "ava";
import { Client } from "..";

const es = new Client(process.env.KEY).email();

test("verify", async t => {
  await t.notThrowsAsync(async () => {
    const response = await es.verify({
      email: "jon@labstack.com"
    });
    t.is(response.result, "deliverable");
  });
});
