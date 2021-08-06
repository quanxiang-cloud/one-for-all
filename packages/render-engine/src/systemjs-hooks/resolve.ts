(function() {
  const endsWithFileExtension = /\/?\.[a-zA-Z]{2,}$/;
  const originalResolve = System.constructor.prototype.resolve;

  System.constructor.prototype.resolve = (id: string, parent: string) => {
    // apply original resolve to make sure importmaps are resolved first
    const url = originalResolve.apply(System, [id, parent]);
    // append .js file extension if url is missing a file extension
    return endsWithFileExtension.test(url) ? url : url + '.js';
  };
})();
