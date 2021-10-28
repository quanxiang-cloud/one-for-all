import lodash from "../esm/index.js";
import { filter } from "../esm/index.js";
describe("@esm-bundle/lodash", () => {
  it("can load the esm bundle without dying", () => {
    return import("../esm/index.js");
  });

  it("findIndex works", () => {
    const test = [
      { name: "Anakin Skywalker" },
      { name: "Obi-wan Kenobi" },
      { name: "Yoda" },
    ];
    const foundIndex = lodash.findIndex(
      test,
      (person) => person.name === "Yoda"
    );
    expect(foundIndex).to.equal(2);
  });

  it("filter works, even destructured", () => {
    const test = [
      { name: "Anakin Skywalker", rank: "Jedi Knight" },
      { name: "Obi-wan Kenobi", rank: "Jedi Master" },
      { name: "Yoda", rank: "Jedi Master" },
    ];
    const masters = filter(test, (jedi) => jedi.rank === "Jedi Master");
    expect(masters.length).to.equal(2);
  });
});
