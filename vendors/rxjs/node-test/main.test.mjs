import { animationFrameScheduler, of } from "../esm/es2015/rxjs.min.js";
import { map, filter, switchMap } from "../esm/es2015/rxjs-operators.min.js";
import { ajax, AjaxError } from "../esm/es2015/rxjs-ajax.min.js";
import { fromFetch } from "../esm/es2015/rxjs-fetch.min.js";
import { TestScheduler } from "../esm/es2015/rxjs-testing.min.js";
import {
  webSocket,
  WebSocketSubject,
} from "../esm/es2015/rxjs-websocket.min.js";

describe("@esm-bundle/rxjs", () => {
  it("rxjs has correct properties on it", () => {
    expect(animationFrameScheduler).to.be.ok;
    expect(of).to.be.ok;
  });

  it("rxjs operators have correct properties on it", () => {
    expect(map).to.be.ok;
    expect(filter).to.be.ok;
    expect(switchMap).to.be.ok;
  });

  it("rxjs ajax has correct properties on it", () => {
    expect(ajax).to.be.ok;
    expect(AjaxError).to.be.ok;
  });

  it("rxjs fetch has correct properties on it", () => {
    expect(fromFetch).to.be.ok;
  });

  it("rxjs websocket has correct properties on it", () => {
    expect(webSocket).to.be.ok;
    expect(WebSocketSubject).to.be.ok;
  });

  it("rxjs testing has correct properties on it", () => {
    expect(TestScheduler).to.be.ok;
  });
});
