import assert from "node:assert/strict";
import { test } from "node:test";
import { codesMatch, issueInboxToken, readInboxToken } from "./inbox-token.ts";

process.env.INBOX_ACCESS_CODE = "4242";
process.env.INBOX_TOKEN_SECRET = "test-secret";

test("access code matches only the configured value", () => {
  assert.equal(codesMatch("4242"), true);
  assert.equal(codesMatch("4243"), false);
  assert.equal(codesMatch("42420"), false);
  assert.equal(codesMatch(""), false);
});

test("inbox token expires and rejects tampering", () => {
  const now = 1_700_000_000_000;
  const token = issueInboxToken(now);
  assert.equal(readInboxToken(token, now + 1000), true);
  assert.equal(readInboxToken(token, now + 13 * 60 * 60 * 1000), false);
  assert.equal(readInboxToken(`${token}x`, now + 1000), false);
  assert.equal(readInboxToken(undefined, now), false);
});
