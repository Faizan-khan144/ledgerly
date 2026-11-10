import assert from "node:assert/strict";
import test from "node:test";
import { hashPassword, verifyPassword } from "../lib/password.ts";

test("hashes and verifies a password", () => {
  const hash = hashPassword("demo1234");
  assert.notEqual(hash, "demo1234");
  assert.equal(verifyPassword("demo1234", hash), true);
  assert.equal(verifyPassword("wrong-password", hash), false);
});

test("rejects malformed hashes", () => {
  assert.equal(verifyPassword("demo1234", "nonsense"), false);
});
