# metalsmith-directory-metadata

[![npm package](https://img.shields.io/npm/v/metalsmith-directory-metadata.svg)][npm]
[![License: MIT](https://img.shields.io/static/v1?label=license&message=MIT&color=green)][github-license]
![Supported Node version: >=8.3.0](https://img.shields.io/static/v1?label=node&message=%3E%3D8.3.0&color=brightgreen)
![Type Definitions: TypeScript](https://img.shields.io/npm/types/metalsmith-directory-metadata.svg)
[![bundle size](https://badgen.net/bundlephobia/min/metalsmith-directory-metadata@1.0.0)](https://bundlephobia.com/result?p=metalsmith-directory-metadata@1.0.0)
[![Dependencies Status](https://david-dm.org/sounisi5011/metalsmith-directory-metadata/status.svg)](https://david-dm.org/sounisi5011/metalsmith-directory-metadata)
[![Build Status](https://travis-ci.com/sounisi5011/metalsmith-directory-metadata.svg?branch=master)](https://travis-ci.com/sounisi5011/metalsmith-directory-metadata)
[![Maintainability Status](https://api.codeclimate.com/v1/badges/4dcb19ba4651279775d5/maintainability)](https://codeclimate.com/github/sounisi5011/metalsmith-directory-metadata/maintainability)

[npm]: https://www.npmjs.com/package/metalsmith-directory-metadata
[github-license]: https://github.com/sounisi5011/metalsmith-directory-metadata/blob/v1.0.0/LICENSE

Defines default metadata for files in a directory.

## Features

*   can define directory metadata

    This plugin defines the metadata that all files in the directory have in common.  
    Directory metadata is defined using a definition file in JSON or YAML format.

## Install

```sh
npm install metalsmith-directory-metadata
```

## CLI Usage

Install via npm and then add the `metalsmith-directory-metadata` key to your `metalsmith.json` plugin, like so:

```json
{
  "plugins": {
    "metalsmith-directory-metadata": true
  }
}
```

If you need to specify an options, set the options to the value of the `metalsmith-directory-metadata` key.

```json
{
  "plugins": {
    "metalsmith-directory-metadata": {
      "pattern": "**/.metadata"
    }
  }
}
```

See [Metalsmith CLI] for more details.

[Metalsmith CLI]: https://github.com/segmentio/metalsmith#cli

## Javascript Usage

The simplest use is to omit the option. By [default](#options), the following files are used to define metadata: `metadata.yaml`, `metadata.yml`, `metadata.json`, and `metadata`.

```js
const directoryMetadata = require('metalsmith-directory-metadata');

metalsmith
  .use(directoryMetadata());
```

If you need to specify an options, set the options value.

```js
const directoryMetadata = require('metalsmith-directory-metadata');

metalsmith
  .use(directoryMetadata({
    pattern: '**/.metadata',
  }));
```

If you want to use the `files` variable or the default options value, you can specify the callback function that generates the options.

```js
const directoryMetadata = require('metalsmith-directory-metadata');

metalsmith
  .use(directoryMetadata(
    (files, metalsmith, defaultOptions) => {
      return {
        pattern: [...defaultOptions.pattern, '**/.metadata'],
      };
    }
  ));
```

## TypeScript Usage

For compatibility with the [Metalsmith CLI], this package exports single function in CommonJS style.  
When using with TypeScript, it is better to use the [`import = require()` statement](https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require).

```js
import directoryMetadata = require('metalsmith-directory-metadata');

metalsmith
  .use(directoryMetadata());
```

## Options

The default value for options are [defined](https://github.com/sounisi5011/metalsmith-directory-metadata/blob/v1.0.0/src/options.ts#L16-L18) like this:

```js
{
  pattern: ['**/metadata.{json,yaml,yml}', '**/metadata'],
}
```

### `pattern`

Specifies the Glob pattern that matches the file that defines the directory metadata.  
Specify a glob expression string or an array of strings as the pattern.  
Pattern are verified using [multimatch v4.0.0][npm-multimatch-used].

[npm-multimatch-used]: https://www.npmjs.com/package/multimatch/v/4.0.0

Default value ([source](https://github.com/sounisi5011/metalsmith-directory-metadata/blob/v1.0.0/src/options.ts#L17)):

```js
['**/metadata.{json,yaml,yml}', '**/metadata']
```

Type definition ([source](https://github.com/sounisi5011/metalsmith-directory-metadata/blob/v1.0.0/src/options.ts#L5)):

```ts
string | string[]
```

## Debug mode

This plugin supports debugging output.  
To enable, use the following command when running your build script:

```sh
DEBUG=metalsmith-directory-metadata,metalsmith-directory-metadata:* node my-website-build.js
```

For more details, please check the description of [debug v4.1.1][npm-debug-used].

[npm-debug-used]: https://www.npmjs.com/package/debug/v/4.1.1

## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```sh
npm install
npm test
```

## Contributing

see [CONTRIBUTING.md](https://github.com/sounisi5011/metalsmith-directory-metadata/blob/master/CONTRIBUTING.md)
