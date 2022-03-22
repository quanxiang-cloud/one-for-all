let wasm, cachedTextDecoder = new TextDecoder("utf-8", {
  ignoreBOM: !0,
  fatal: !0
});
cachedTextDecoder.decode();
let cachegetUint8Memory0 = null;

function getUint8Memory0() {
  return null !== cachegetUint8Memory0 && cachegetUint8Memory0.buffer === wasm.memory.buffer || (cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer)), cachegetUint8Memory0
}

function getStringFromWasm0(e, t) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(e, e + t))
}
const heap = new Array(32).fill(void 0);
heap.push(void 0, null, !0, !1);
let heap_next = heap.length;

function addHeapObject(e) {
  heap_next === heap.length && heap.push(heap.length + 1);
  const t = heap_next;
  return heap_next = heap[t], heap[t] = e, t
}

function getObject(e) {
  return heap[e]
}

function dropObject(e) {
  e < 36 || (heap[e] = heap_next, heap_next = e)
}

function takeObject(e) {
  const t = getObject(e);
  return dropObject(e), t
}
let WASM_VECTOR_LEN = 0,
  cachedTextEncoder = new TextEncoder("utf-8");
const encodeString = "function" == typeof cachedTextEncoder.encodeInto ? function (e, t) {
  return cachedTextEncoder.encodeInto(e, t)
} : function (e, t) {
  const n = cachedTextEncoder.encode(e);
  return t.set(n), {
    read: e.length,
    written: n.length
  }
};

function passStringToWasm0(e, t, n) {
  if (void 0 === n) {
    const n = cachedTextEncoder.encode(e),
      r = t(n.length);
    return getUint8Memory0().subarray(r, r + n.length).set(n), WASM_VECTOR_LEN = n.length, r
  }
  let r = e.length,
    a = t(r);
  const o = getUint8Memory0();
  let s = 0;
  for (; s < r; s++) {
    const t = e.charCodeAt(s);
    if (t > 127) break;
    o[a + s] = t
  }
  if (s !== r) {
    0 !== s && (e = e.slice(s)), a = n(a, r, r = s + 3 * e.length);
    const t = getUint8Memory0().subarray(a + s, a + r);
    s += encodeString(e, t).written
  }
  return WASM_VECTOR_LEN = s, a
}

function isLikeNone(e) {
  return null == e
}
let cachegetInt32Memory0 = null;

function getInt32Memory0() {
  return null !== cachegetInt32Memory0 && cachegetInt32Memory0.buffer === wasm.memory.buffer || (cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer)), cachegetInt32Memory0
}

function passArray8ToWasm0(e, t) {
  const n = t(1 * e.length);
  return getUint8Memory0().set(e, n / 1), WASM_VECTOR_LEN = e.length, n
}

function getArrayU8FromWasm0(e, t) {
  return getUint8Memory0().subarray(e / 1, e / 1 + t)
}
export function compressGzip(e) {
  try {
    const o = wasm.__wbindgen_add_to_stack_pointer(-16);
    var t = passArray8ToWasm0(e, wasm.__wbindgen_malloc),
      n = WASM_VECTOR_LEN;
    wasm.compressGzip(o, t, n);
    var r = getInt32Memory0()[o / 4 + 0],
      a = getInt32Memory0()[o / 4 + 1];
    let s;
    return 0 !== r && (s = getArrayU8FromWasm0(r, a).slice(), wasm.__wbindgen_free(r, 1 * a)), s
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
  }
}
export function decompressGzip(e) {
  try {
    const o = wasm.__wbindgen_add_to_stack_pointer(-16);
    var t = passArray8ToWasm0(e, wasm.__wbindgen_malloc),
      n = WASM_VECTOR_LEN;
    wasm.decompressGzip(o, t, n);
    var r = getInt32Memory0()[o / 4 + 0],
      a = getInt32Memory0()[o / 4 + 1];
    let s;
    return 0 !== r && (s = getArrayU8FromWasm0(r, a).slice(), wasm.__wbindgen_free(r, 1 * a)), s
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
  }
}
export function compressStringGzip(e) {
  try {
    const o = wasm.__wbindgen_add_to_stack_pointer(-16);
    var t = passStringToWasm0(e, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc),
      n = WASM_VECTOR_LEN;
    wasm.compressStringGzip(o, t, n);
    var r = getInt32Memory0()[o / 4 + 0],
      a = getInt32Memory0()[o / 4 + 1];
    let s;
    return 0 !== r && (s = getArrayU8FromWasm0(r, a).slice(), wasm.__wbindgen_free(r, 1 * a)), s
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
  }
}
export function decompressStringGzip(e) {
  try {
    const o = wasm.__wbindgen_add_to_stack_pointer(-16);
    var t = passArray8ToWasm0(e, wasm.__wbindgen_malloc),
      n = WASM_VECTOR_LEN;
    wasm.decompressStringGzip(o, t, n);
    var r = getInt32Memory0()[o / 4 + 0],
      a = getInt32Memory0()[o / 4 + 1];
    let s;
    return 0 !== r && (s = getStringFromWasm0(r, a).slice(), wasm.__wbindgen_free(r, 1 * a)), s
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
  }
}
let stack_pointer = 32;

function addBorrowedObject(e) {
  if (1 == stack_pointer) throw new Error("out of js stack");
  return heap[--stack_pointer] = e, stack_pointer
}
export function compressJsonGzip(e) {
  try {
    const a = wasm.__wbindgen_add_to_stack_pointer(-16);
    wasm.compressJsonGzip(a, addBorrowedObject(e));
    var t = getInt32Memory0()[a / 4 + 0],
      n = getInt32Memory0()[a / 4 + 1],
      r = getArrayU8FromWasm0(t, n).slice();
    return wasm.__wbindgen_free(t, 1 * n), r
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16), heap[stack_pointer++] = void 0
  }
}
export function decompressJsonGzip(e) {
  var t = passArray8ToWasm0(e, wasm.__wbindgen_malloc),
    n = WASM_VECTOR_LEN;
  return takeObject(wasm.decompressJsonGzip(t, n))
}

function handleError(e) {
  return function () {
    try {
      return e.apply(this, arguments)
    } catch (e) {
      wasm.__wbindgen_exn_store(addHeapObject(e))
    }
  }
}
async function load(e, t) {
  if ("function" == typeof Response && e instanceof Response) {
    if ("function" == typeof WebAssembly.instantiateStreaming) try {
      return await WebAssembly.instantiateStreaming(e, t)
    } catch (t) {
      if ("application/wasm" == e.headers.get("Content-Type")) throw t;
      console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", t)
    }
    const n = await e.arrayBuffer();
    return await WebAssembly.instantiate(n, t)
  } {
    const n = await WebAssembly.instantiate(e, t);
    return n instanceof WebAssembly.Instance ? {
      instance: n,
      module: e
    } : n
  }
}
async function init(e) {
  void 0 === e && (e =
    import.meta.url.replace(/\.js$/, "_bg.wasm"));
  const t = {
    wbg: {}
  };
  t.wbg.__wbindgen_string_new = function (e, t) {
    return addHeapObject(getStringFromWasm0(e, t))
  }, t.wbg.__wbg_parse_58b7cdbfa2b3e55a = handleError((function (e, t) {
    return addHeapObject(JSON.parse(getStringFromWasm0(e, t)))
  })), t.wbg.__wbindgen_object_drop_ref = function (e) {
    takeObject(e)
  }, t.wbg.__wbg_stringify_e5f075a4462d77f0 = handleError((function (e) {
    return addHeapObject(JSON.stringify(getObject(e)))
  })), t.wbg.__wbindgen_string_get = function (e, t) {
    const n = getObject(t);
    var r = "string" == typeof n ? n : void 0,
      a = isLikeNone(r) ? 0 : passStringToWasm0(r, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc),
      o = WASM_VECTOR_LEN;
    getInt32Memory0()[e / 4 + 1] = o, getInt32Memory0()[e / 4 + 0] = a
  }, t.wbg.__wbindgen_throw = function (e, t) {
    throw new Error(getStringFromWasm0(e, t))
  }, t.wbg.__wbindgen_rethrow = function (e) {
    throw takeObject(e)
  }, ("string" == typeof e || "function" == typeof Request && e instanceof Request || "function" == typeof URL && e instanceof URL) && (e = fetch(e));
  const {
    instance: n,
    module: r
  } = await load(await e, t);
  return wasm = n.exports, init.__wbindgen_wasm_module = r, wasm
}
export default init;
