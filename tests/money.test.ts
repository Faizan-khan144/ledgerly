import assert from "node:assert/strict";
import test from "node:test";
import {
  daysBetween,
  formatMoney,
  parseMoneyToCents,
} from "../lib/money.ts";

test("formats cents as USD", () => {
  assert.equal(formatMoney(123456), "$1,234.56");
  assert.equal(formatMoney(0), "$0.00");
});

test("parses user entered amounts", () => {
  assert.equal(parseMoneyToCents("1,250.50"), 125050);
  assert.equal(parseMoneyToCents("$99"), 9900);
  assert.equal(parseMoneyToCents(""), 0);
  assert.equal(parseMoneyToCents("not money"), 0);
});

test("counts calendar days between dates", () => {
  assert.equal(daysBetween("2026-10-01", "2026-10-15"), 14);
});
