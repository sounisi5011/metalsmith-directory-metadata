import Metalsmith from 'metalsmith';

export interface OptionsInterface {
    pattern: string | string[];
}

export interface OptionsGenerator {
    (
        files: Metalsmith.Files,
        metalsmith: Metalsmith,
        defaultOptions: OptionsInterface,
    ): Partial<OptionsInterface>;
}

export function normalizeOptions(
    files: Metalsmith.Files,
    metalsmith: Metalsmith,
    opts: Partial<OptionsInterface> | OptionsGenerator,
): OptionsInterface {
    const defaultOptions: OptionsInterface = {
        pattern: ['**/metadata.{json,yaml,yml}', '**/metadata'],
    };

    return {
        ...defaultOptions,
        ...(typeof opts === 'function'
            ? opts(files, metalsmith, defaultOptions)
            : opts),
    };
}
