describe("@esm-bundle/rxjs", () => {
  it("can load the ESM bundle", () => {
    return import("/base/esm/es2015/rxjs.min.js");
  });

  it("can load the System.register bundle", () => {
    return System.import("/base/system/es2015/rxjs.min.js");
  });
});

describe("rxjs operators", () => {
  it("can load the ESM bundle", () => {
    return import("/base/esm/es2015/rxjs-operators.min.js");
  });

  it("can load the System.register bundle", () => {
    return System.import("/base/system/es2015/rxjs-operators.min.js");
  });
});

describe("rxjs fetch", () => {
  it("can load the ESM bundle", () => {
    return import("/base/esm/es2015/rxjs-fetch.min.js");
  });

  it("can load the System.register bundle", () => {
    return System.import("/base/system/es2015/rxjs-fetch.min.js");
  });
});

describe("rxjs websocket", () => {
  it("can load the ESM bundle", () => {
    return import("/base/esm/es2015/rxjs-websocket.min.js");
  });

  it("can load the System.register bundle", () => {
    return System.import("/base/system/es2015/rxjs-websocket.min.js");
  });
});

describe("rxjs ajax", () => {
  it("can load the ESM bundle", () => {
    return import("/base/esm/es2015/rxjs-ajax.min.js");
  });

  it("can load the System.register bundle", () => {
    return System.import("/base/system/es2015/rxjs-ajax.min.js");
  });
});

describe("rxjs testing", () => {
  it("can load the ESM bundle", () => {
    return import("/base/esm/es2015/rxjs-testing.min.js");
  });

  it("can load the System.register bundle", () => {
    return System.import("/base/system/es2015/rxjs-testing.min.js");
  });
});
