import fs from 'fs';
import Metalsmith from 'metalsmith';
import util from 'util';

export type MetalsmithFileData = Metalsmith.Files[keyof Metalsmith.Files];

export function stripDefaultFiledata(
    filedata: MetalsmithFileData,
): MetalsmithFileData {
    if (typeof filedata === 'object') {
        return Object.entries(filedata).reduce<Record<string, unknown>>(
            (obj, [prop, value]) => {
                if (
                    !(
                        (prop === 'contents' && Buffer.isBuffer(value)) ||
                        (prop === 'mode' &&
                            typeof value === 'string' &&
                            /^[0-7]{4}$/.test(value)) ||
                        (prop === 'stats' &&
                            Object.getPrototypeOf(value) === fs.Stats.prototype)
                    )
                ) {
                    obj[prop] = value;
                }
                return obj;
            },
            {},
        );
    }
    return filedata;
}

export async function processAsync(
    metalsmith: Metalsmith,
): Promise<Metalsmith.Files> {
    return util.promisify(metalsmith.process.bind(metalsmith))();
}
