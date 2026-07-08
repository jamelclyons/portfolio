import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import semver from 'semver';

describe('package.json', () => {
  it('should contain a valid semantic version', () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8')
    );

    expect(packageJson.version).toBeDefined();
    expect(semver.valid(packageJson.version)).not.toBeNull();
  });
});