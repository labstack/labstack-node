import test from "ava";
import { Client } from "..";

const ds = new Client(process.env.KEY).domain();

test("dns", async t => {
  await t.notThrowsAsync(async () => {
    const response = await ds.dns({
      type: "A",
      domain: "twilio.com"
    });
    t.not(response.records.length, 0);
  });
});

test("search", async t => {
  await t.notThrowsAsync(async () => {
    const response = await ds.search({
      domain: "twilio.com"
    });
    t.not(response.results.length, 0);
  });
});

test("status", async t => {
  await t.notThrowsAsync(async () => {
    const response = await ds.status({
      domain: "twilio.com"
    });
    t.is(response.result, "unavailable");
  });
});

test("whois", async t => {
  await t.notThrowsAsync(async () => {
    const response = await ds.whois({
      domain: "twilio.com"
    });
    t.not(response.raw, "");
  });
});
