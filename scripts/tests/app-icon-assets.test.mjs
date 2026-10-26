import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const registry = fs.readFileSync(new URL('../../src/lib/apps.ts', import.meta.url), 'utf8');
const iconPaths = [...registry.matchAll(/icon:\s*'([^']+)'/g)].map((match) => match[1]);

test('registered app icons have valid embedded image MIME types and stay lightweight', () => {
  assert.ok(iconPaths.length > 0, 'the app registry contains icons');

  for (const iconPath of iconPaths) {
    const localPath = path.join(new URL('../../static', import.meta.url).pathname, iconPath);
    assert.ok(fs.existsSync(localPath), `${iconPath} exists`);
    const source = fs.readFileSync(localPath, 'utf8');
    const size = fs.statSync(localPath).size;
    assert.ok(size <= 128 * 1024, `${iconPath} is lightweight (${size} bytes)`);

    for (const [, mime, encoded] of source.matchAll(/data:image\/(png|webp);base64,([A-Za-z0-9+/=]+)/g)) {
      const bytes = Buffer.from(encoded, 'base64');
      const actualMime = bytes.subarray(0, 4).toString('ascii') === 'RIFF'
        && bytes.subarray(8, 12).toString('ascii') === 'WEBP'
        ? 'webp'
        : bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
          ? 'png'
          : 'unknown';
      assert.equal(actualMime, mime, `${iconPath} declares the embedded image's actual MIME type`);
    }
  }
});
