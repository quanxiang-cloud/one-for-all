/* tslint:disable */
/* eslint-disable */
/**
* Compresses binary data using GZip.
* @param {Uint8Array} data
* @returns {Uint8Array | undefined}
*/
export function compressGzip(data: Uint8Array): Uint8Array | undefined;
/**
* Decompresses GZip data and returns the binary result.
* @param {Uint8Array} data
* @returns {Uint8Array | undefined}
*/
export function decompressGzip(data: Uint8Array): Uint8Array | undefined;
/**
* @param {string} string
* @returns {Uint8Array | undefined}
*/
export function compressStringGzip(string: string): Uint8Array | undefined;
/**
* @param {Uint8Array} data
* @returns {string | undefined}
*/
export function decompressStringGzip(data: Uint8Array): string | undefined;
/**
* @param {any} data
* @returns {Uint8Array}
*/
export function compressJsonGzip(data: any): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {any}
*/
export function decompressJsonGzip(data: Uint8Array): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly compressGzip: (a: number, b: number, c: number) => void;
  readonly decompressGzip: (a: number, b: number, c: number) => void;
  readonly compressStringGzip: (a: number, b: number, c: number) => void;
  readonly decompressStringGzip: (a: number, b: number, c: number) => void;
  readonly compressJsonGzip: (a: number, b: number) => void;
  readonly decompressJsonGzip: (a: number, b: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
        