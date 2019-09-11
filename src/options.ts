import Metalsmith from 'metalsmith';

export interface OptionsInterface {
    readonly pattern: string | ReadonlyArray<string>;
}

export interface OptionsGenerator {
    (
        files: Metalsmith.Files,
        metalsmith: Metalsmith,
        defaultOptions: OptionsInterface,
    ): Partial<OptionsInterface> | Promise<Partial<OptionsInterface>>;
}

export async function normalizeOptions(
    files: Metalsmith.Files,
    metalsmith: Metalsmith,
    opts: Partial<OptionsInterface> | OptionsGenerator,
): Promise<OptionsInterface> {
    const defaultOptions: OptionsInterface = {
        pattern: ['**/metadata.{json,yaml,yml}', '**/metadata'],
    };

    return {
        ...defaultOptions,
        ...(typeof opts === 'function'
            ? await opts(files, metalsmith, defaultOptions)
            : opts),
    };
}
