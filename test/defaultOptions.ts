import test from 'ava';
import cloneDeep from 'lodash.clonedeep';
import Metalsmith from 'metalsmith';
import path from 'path';

import { ignoreTypeError } from './helpers';
import { processAsync } from './helpers/metalsmith';
import dirMetadata = require('../src/index');

const fixtures = path.join(__dirname, 'fixtures');

test('defaultOptions cannot be changed', async t => {
    const metalsmith = Metalsmith(path.join(fixtures, 'basic'))
        .source('src')
        .use(
            dirMetadata(async (_files, _metalsmith, defaultOptions) => {
                const originalOptions = cloneDeep(defaultOptions);

                ignoreTypeError(() => {
                    Object.assign(defaultOptions, { hoge: 'fuga' });
                });
                t.deepEqual(
                    defaultOptions,
                    originalOptions,
                    'Properties cannot be added',
                );

                ignoreTypeError(() => {
                    Object.assign(defaultOptions, { pattern: '**/.meta' });
                });
                t.deepEqual(
                    defaultOptions,
                    originalOptions,
                    'Properties cannot be changed',
                );

                ignoreTypeError(() => {
                    if (Array.isArray(defaultOptions.pattern)) {
                        defaultOptions.pattern.push('**');
                    }
                });
                t.deepEqual(
                    defaultOptions,
                    originalOptions,
                    'Child properties cannot be changed',
                );

                return {};
            }),
        );
    await processAsync(metalsmith);
});
