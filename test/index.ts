import test from 'ava';
import Metalsmith from 'metalsmith';
import path from 'path';

import { processAsync, stripDefaultFiledata } from './helpers/metalsmith';
import dirMetadata = require('../src/index');

const fixtures = path.join(__dirname, 'fixtures');

test('should define metadata for files in the directory', async t => {
    const metalsmith = Metalsmith(path.join(fixtures, 'basic'))
        .source('src')
        .use(dirMetadata());
    const files = await processAsync(metalsmith);

    t.deepEqual(
        stripDefaultFiledata(files['file.txt']),
        {
            x: 42,
            lv: 0,
            lv0: true,
        },
        'should merge file metadata',
    );
    t.deepEqual(
        stripDefaultFiledata(files['dir/file.txt']),
        {
            x: 42,
            lv: 1,
            lv1: true,
            lv0: true,
        },
        'should merge parent directory metadata',
    );
    t.deepEqual(
        stripDefaultFiledata(files['dir/path/file.txt']),
        {
            x: 42,
            lv: 2,
            lv2: true,
            lv1: true,
            lv0: true,
        },
        'should merge parent and ancestor directories',
    );
    t.deepEqual(
        stripDefaultFiledata(files['dir/path/to/file.txt']),
        {
            x: 42,
            lv: 3,
            lv3: true,
            lv2: true,
            lv1: true,
            lv0: true,
        },
        'should merge parent and ancestor directories',
    );
    t.deepEqual(
        stripDefaultFiledata(files['dir/file2.txt']),
        {
            x: 42,
            lv: 'F-2',
            lv1: true,
            lv0: true,
        },
        'directory metadata should be overwritten with file metadata',
    );

    t.deepEqual(
        Object.keys(files).filter(filename =>
            /(?:^|[/\\])metadata(?:\.[a-zA-Z0-9]+)?$/.test(filename),
        ),
        [],
        'metadata definition file should be removed',
    );
});

test('if it detects a invalid YAML file, it should throw an error', async t => {
    const metalsmith = Metalsmith(path.join(fixtures, 'invalid-yaml'))
        .source('src')
        .use(dirMetadata());

    await t.throwsAsync(async () => {
        await processAsync(metalsmith);
    }, "Invalid YAML: 'path/to/metadata.yml'");
});

test('if it detects a invalid JSON file, it should throw an error', async t => {
    const metalsmith = Metalsmith(path.join(fixtures, 'invalid-json'))
        .source('src')
        .use(dirMetadata());

    await t.throwsAsync(async () => {
        await processAsync(metalsmith);
    }, "Invalid JSON: 'path/to/metadata.json'");
});

test('an error should be thrown if the contents of a file with no extension is invalid as YAML or JSON', async t => {
    const metalsmith = Metalsmith(path.join(fixtures, 'invalid-format'))
        .source('src')
        .use(dirMetadata());

    await t.throwsAsync(async () => {
        await processAsync(metalsmith);
    }, "Invalid JSON or YAML. This file content is neither JSON nor YAML: 'path/to/metadata'");
});

test('if it detects a definition file with an unknown extension, it should throw an error', async t => {
    const metalsmith = Metalsmith(path.join(fixtures, 'invalid-file-type'))
        .source('src')
        .use(
            dirMetadata({
                pattern: '**/metadata.*',
            }),
        );

    await t.throwsAsync(async () => {
        await processAsync(metalsmith);
    }, "Invalid file type. This file has an unknown extension: 'dir/metadata.unknown'");
});

test("if it finds a definition file that doesn't define an object, it should throw an error", async t => {
    const metalsmith = Metalsmith(path.join(fixtures, 'invalid-data-structure'))
        .source('src')
        .use(dirMetadata());

    await t.throwsAsync(async () => {
        await processAsync(metalsmith);
    }, "Invalid data structure. The data defined in this file is not an object / record / table / associative array: 'path/to/metadata.yaml'");
});

test('if there are multiple files defining metadata in the same directory, an error should be thrown', async t => {
    const metalsmith = Metalsmith(path.join(fixtures, 'conflict'))
        .source('src')
        .use(dirMetadata());

    const error = await t.throwsAsync(async () => {
        await processAsync(metalsmith);
    }, /^Conflicting data files\. Multiple files define metadata for one directory 'path\/to':/);
    t.regex(error.message, /^- 'path\/to\/metadata\.json'$/m);
    t.regex(error.message, /^- 'path\/to\/metadata\.yml'$/m);
});
