import { test } from "node:test";
import assert from "node:assert/strict";
import { sceneAt, sceneProgress } from "../src/motionSpec.js";
test("chapter destinations select every product in forward and reverse order", () => {
  for (const i of [0, 1, 2, 3, 4, 3, 2, 1, 0])
    assert.equal(sceneAt(sceneProgress(i, 5), 5), i);
});
test("scroll endpoints clamp to valid products", () => {
  assert.equal(sceneAt(0, 5), 0);
  assert.equal(sceneAt(1, 5), 4);
  assert.equal(sceneAt(-0.1, 5), 0);
  assert.equal(sceneAt(1.1, 5), 4);
});
