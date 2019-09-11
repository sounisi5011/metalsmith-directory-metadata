import yaml from 'js-yaml';
import path from 'path';
import util from 'util';

import { FileInterface, isObject } from './utils';

function parseYAML(filename: string, contents: string): unknown {
    try {
        return yaml.safeLoad(contents);
    } catch (error) {
        throw new Error(`Invalid YAML: ${util.inspect(filename)}`);
    }
}

function parseJSON(filename: string, contents: string): unknown {
    try {
        return JSON.parse(contents);
    } catch (error) {
        throw new Error(`Invalid JSON: ${util.inspect(filename)}`);
    }
}

export function parser(
    filename: string,
    filedata: FileInterface,
): Record<string, unknown> {
    const contents = filedata.contents.toString('utf8');
    const extname = path.extname(filename);

    let data: unknown;
    if (extname === '.yaml' || extname === '.yml') {
        data = parseYAML(filename, contents);
    } else if (extname === '.json') {
        data = parseJSON(filename, contents);
    } else if (extname === '') {
        try {
            data = parseJSON(filename, contents);
        } catch (error) {
            try {
                data = parseYAML(filename, contents);
            } catch (error) {
                throw new Error(
                    `Invalid JSON or YAML. This file content is neither JSON nor YAML: ${util.inspect(
                        filename,
                    )}`,
                );
            }
        }
    } else {
        throw new Error(
            `Invalid file type. This file has an unknown extension: ${util.inspect(
                filename,
            )}`,
        );
    }

    if (!isObject(data)) {
        throw new Error(
            `Invalid data structure. The data defined in this file is not an object / record / table / associative array: ${util.inspect(
                filename,
            )}`,
        );
    }

    return data;
}
