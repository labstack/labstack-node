import test from "ava";
import { Client } from "..";

const cs = new Client(process.env.KEY).currency();

test("convert", async t => {
  await t.notThrowsAsync(async () => {
    const response = await cs.convert({
      amount: 10,
      from: "USD",
      to: "INR"
    });
    t.not(response.amount, "0");
  });
});

test("list", async t => {
  await t.notThrowsAsync(async () => {
    const response = await cs.list();
    t.not(response.currencies.length, "0");
  });
});

test("rates", async t => {
  await t.notThrowsAsync(async () => {
    const response = await cs.rates();
    t.not(response.rates.length, "0");
  });
});
