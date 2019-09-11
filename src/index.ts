import Metalsmith from 'metalsmith';
import multimatch from 'multimatch';
import path from 'path';
import util from 'util';

import {
    normalizeOptions,
    OptionsGenerator,
    OptionsInterface,
} from './options';
import { parser } from './parse';
import { createPlugin, firstItem, hasProp, isFile, isObject } from './utils';

export = (
    opts: Partial<OptionsInterface> | OptionsGenerator = {},
): Metalsmith.Plugin => {
    return createPlugin(async (files, metalsmith) => {
        const options = await normalizeOptions(files, metalsmith, opts);

        const dataListMap = new Map<
            string,
            { filename: string; dirdata: ReturnType<typeof parser> }[]
        >();
        for (const filename of multimatch(
            Object.keys(files),
            options.pattern,
        )) {
            const filedata = files[filename];
            if (!isFile(filedata)) {
                continue;
            }

            const dirdata = parser(filename, filedata);

            const dirname = path.normalize(path.dirname(filename));
            dataListMap.set(dirname, [
                ...(dataListMap.get(dirname) || []),
                { filename, dirdata },
            ]);
        }

        const dataMap = new Map(
            [...dataListMap].map(([dirname, dirDataList]): [
                string,
                (Record<string, unknown> | undefined),
            ] => {
                if (dirDataList.length > 1) {
                    throw new Error(
                        `Conflicting data files. Multiple files define metadata for one directory ${util.inspect(
                            dirname,
                        )}:\n` +
                            dirDataList
                                .map(
                                    ({ filename }) =>
                                        `- ${util.inspect(filename)}`,
                                )
                                .join('\n'),
                    );
                }

                const data = firstItem(dirDataList);
                if (data) {
                    delete files[data.filename];
                    return [dirname, data.dirdata];
                } else {
                    return [dirname, undefined];
                }
            }),
        );

        for (const [filename, filedata] of Object.entries(files)) {
            if (!isObject(filedata)) {
                continue;
            }

            let dirname = path.normalize(filename);
            const searchedDirname = new Set<string>();
            do {
                const dirdata = dataMap.get(dirname);
                if (dirdata) {
                    for (const [prop, value] of Object.entries(dirdata)) {
                        if (!hasProp(filedata, prop)) {
                            (filedata as Record<string, unknown>)[prop] = value;
                        }
                    }
                }
                searchedDirname.add(dirname);
                dirname = path.normalize(path.dirname(dirname));
            } while (!searchedDirname.has(dirname));
        }
    });
};
