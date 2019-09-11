import Metalsmith from 'metalsmith';

export interface FileInterface extends Metalsmith.Files {
    contents: Buffer;
    [index: string]: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObject(value: unknown): value is Record<any, unknown> {
    return typeof value === 'object' && value !== null;
}

export function hasProp<
    T extends object,
    U extends (Parameters<typeof Object.prototype.hasOwnProperty>)[0]
>(value: T, prop: U): value is T & Required<Pick<T, Extract<keyof T, U>>> {
    return Object.prototype.hasOwnProperty.call(value, prop);
}

export function firstItem<T>(list: ReadonlyArray<T>): T | undefined {
    return list[0];
}

export function isFile(value: unknown): value is FileInterface {
    if (isObject(value)) {
        return hasProp(value, 'contents') && Buffer.isBuffer(value.contents);
    }
    return false;
}

export function createPlugin(
    callback: (
        files: Metalsmith.Files,
        metalsmith: Metalsmith,
    ) => Promise<void>,
): Metalsmith.Plugin {
    return (files, metalsmith, done) => {
        callback(files, metalsmith)
            .then(() => done(null, files, metalsmith))
            .catch(error => done(error, files, metalsmith));
    };
}
