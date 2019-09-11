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
