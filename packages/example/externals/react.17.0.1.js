System.register([], (function (exports) {
	'use strict';
	return {
		execute: (function () {

			var react_development = exports('default', {});

			/*
			object-assign
			(c) Sindre Sorhus
			@license MIT
			*/
			/* eslint-disable no-unused-vars */
			var getOwnPropertySymbols = Object.getOwnPropertySymbols;
			var hasOwnProperty = Object.prototype.hasOwnProperty;
			var propIsEnumerable = Object.prototype.propertyIsEnumerable;

			function toObject(val) {
				if (val === null || val === undefined) {
					throw new TypeError('Object.assign cannot be called with null or undefined');
				}

				return Object(val);
			}

			function shouldUseNative() {
				try {
					if (!Object.assign) {
						return false;
					}

					// Detect buggy property enumeration order in older V8 versions.

					// https://bugs.chromium.org/p/v8/issues/detail?id=4118
					var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
					test1[5] = 'de';
					if (Object.getOwnPropertyNames(test1)[0] === '5') {
						return false;
					}

					// https://bugs.chromium.org/p/v8/issues/detail?id=3056
					var test2 = {};
					for (var i = 0; i < 10; i++) {
						test2['_' + String.fromCharCode(i)] = i;
					}
					var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
						return test2[n];
					});
					if (order2.join('') !== '0123456789') {
						return false;
					}

					// https://bugs.chromium.org/p/v8/issues/detail?id=3056
					var test3 = {};
					'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
						test3[letter] = letter;
					});
					if (Object.keys(Object.assign({}, test3)).join('') !==
							'abcdefghijklmnopqrst') {
						return false;
					}

					return true;
				} catch (err) {
					// We don't expect any of the above to throw, but better to be safe.
					return false;
				}
			}

			var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
				var from;
				var to = toObject(target);
				var symbols;

				for (var s = 1; s < arguments.length; s++) {
					from = Object(arguments[s]);

					for (var key in from) {
						if (hasOwnProperty.call(from, key)) {
							to[key] = from[key];
						}
					}

					if (getOwnPropertySymbols) {
						symbols = getOwnPropertySymbols(from);
						for (var i = 0; i < symbols.length; i++) {
							if (propIsEnumerable.call(from, symbols[i])) {
								to[symbols[i]] = from[symbols[i]];
							}
						}
					}
				}

				return to;
			};

			/** @license React v17.0.2
			 * react.development.js
			 *
			 * Copyright (c) Facebook, Inc. and its affiliates.
			 *
			 * This source code is licensed under the MIT license found in the
			 * LICENSE file in the root directory of this source tree.
			 */

			(function (exports) {

			{
			  (function() {

			var _assign = objectAssign;

			// TODO: this is special because it gets imported during build.
			var ReactVersion = '17.0.2';

			// ATTENTION
			// When adding new symbols to this file,
			// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
			// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
			// nor polyfill, then a plain number is used for performance.
			var REACT_ELEMENT_TYPE = 0xeac7;
			var REACT_PORTAL_TYPE = 0xeaca;
			exports.Fragment = 0xeacb;
			exports.StrictMode = 0xeacc;
			exports.Profiler = 0xead2;
			var REACT_PROVIDER_TYPE = 0xeacd;
			var REACT_CONTEXT_TYPE = 0xeace;
			var REACT_FORWARD_REF_TYPE = 0xead0;
			exports.Suspense = 0xead1;
			var REACT_SUSPENSE_LIST_TYPE = 0xead8;
			var REACT_MEMO_TYPE = 0xead3;
			var REACT_LAZY_TYPE = 0xead4;
			var REACT_BLOCK_TYPE = 0xead9;
			var REACT_SERVER_BLOCK_TYPE = 0xeada;
			var REACT_FUNDAMENTAL_TYPE = 0xead5;
			var REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
			var REACT_LEGACY_HIDDEN_TYPE = 0xeae3;

			if (typeof Symbol === 'function' && Symbol.for) {
			  var symbolFor = Symbol.for;
			  REACT_ELEMENT_TYPE = symbolFor('react.element');
			  REACT_PORTAL_TYPE = symbolFor('react.portal');
			  exports.Fragment = symbolFor('react.fragment');
			  exports.StrictMode = symbolFor('react.strict_mode');
			  exports.Profiler = symbolFor('react.profiler');
			  REACT_PROVIDER_TYPE = symbolFor('react.provider');
			  REACT_CONTEXT_TYPE = symbolFor('react.context');
			  REACT_FORWARD_REF_TYPE = symbolFor('react.forward_ref');
			  exports.Suspense = symbolFor('react.suspense');
			  REACT_SUSPENSE_LIST_TYPE = symbolFor('react.suspense_list');
			  REACT_MEMO_TYPE = symbolFor('react.memo');
			  REACT_LAZY_TYPE = symbolFor('react.lazy');
			  REACT_BLOCK_TYPE = symbolFor('react.block');
			  REACT_SERVER_BLOCK_TYPE = symbolFor('react.server.block');
			  REACT_FUNDAMENTAL_TYPE = symbolFor('react.fundamental');
			  symbolFor('react.scope');
			  symbolFor('react.opaque.id');
			  REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode');
			  symbolFor('react.offscreen');
			  REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden');
			}

			var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
			var FAUX_ITERATOR_SYMBOL = '@@iterator';
			function getIteratorFn(maybeIterable) {
			  if (maybeIterable === null || typeof maybeIterable !== 'object') {
			    return null;
			  }

			  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

			  if (typeof maybeIterator === 'function') {
			    return maybeIterator;
			  }

			  return null;
			}

			/**
			 * Keeps track of the current dispatcher.
			 */
			var ReactCurrentDispatcher = {
			  /**
			   * @internal
			   * @type {ReactComponent}
			   */
			  current: null
			};

			/**
			 * Keeps track of the current batch's configuration such as how long an update
			 * should suspend for if it needs to.
			 */
			var ReactCurrentBatchConfig = {
			  transition: 0
			};

			/**
			 * Keeps track of the current owner.
			 *
			 * The current owner is the component who should own any components that are
			 * currently being constructed.
			 */
			var ReactCurrentOwner = {
			  /**
			   * @internal
			   * @type {ReactComponent}
			   */
			  current: null
			};

			var ReactDebugCurrentFrame = {};
			var currentExtraStackFrame = null;
			function setExtraStackFrame(stack) {
			  {
			    currentExtraStackFrame = stack;
			  }
			}

			{
			  ReactDebugCurrentFrame.setExtraStackFrame = function (stack) {
			    {
			      currentExtraStackFrame = stack;
			    }
			  }; // Stack implementation injected by the current renderer.


			  ReactDebugCurrentFrame.getCurrentStack = null;

			  ReactDebugCurrentFrame.getStackAddendum = function () {
			    var stack = ''; // Add an extra top frame while an element is being validated

			    if (currentExtraStackFrame) {
			      stack += currentExtraStackFrame;
			    } // Delegate to the injected renderer-specific implementation


			    var impl = ReactDebugCurrentFrame.getCurrentStack;

			    if (impl) {
			      stack += impl() || '';
			    }

			    return stack;
			  };
			}

			/**
			 * Used by act() to track whether you're inside an act() scope.
			 */
			var IsSomeRendererActing = {
			  current: false
			};

			var ReactSharedInternals = {
			  ReactCurrentDispatcher: ReactCurrentDispatcher,
			  ReactCurrentBatchConfig: ReactCurrentBatchConfig,
			  ReactCurrentOwner: ReactCurrentOwner,
			  IsSomeRendererActing: IsSomeRendererActing,
			  // Used by renderers to avoid bundling object-assign twice in UMD bundles:
			  assign: _assign
			};

			{
			  ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
			}

			// by calls to these methods by a Babel plugin.
			//
			// In PROD (or in packages without access to React internals),
			// they are left as they are instead.

			function warn(format) {
			  {
			    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			      args[_key - 1] = arguments[_key];
			    }

			    printWarning('warn', format, args);
			  }
			}
			function error(format) {
			  {
			    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
			      args[_key2 - 1] = arguments[_key2];
			    }

			    printWarning('error', format, args);
			  }
			}

			function printWarning(level, format, args) {
			  // When changing this logic, you might want to also
			  // update consoleWithStackDev.www.js as well.
			  {
			    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
			    var stack = ReactDebugCurrentFrame.getStackAddendum();

			    if (stack !== '') {
			      format += '%s';
			      args = args.concat([stack]);
			    }

			    var argsWithFormat = args.map(function (item) {
			      return '' + item;
			    }); // Careful: RN currently depends on this prefix

			    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
			    // breaks IE9: https://github.com/facebook/react/issues/13610
			    // eslint-disable-next-line react-internal/no-production-logging

			    Function.prototype.apply.call(console[level], console, argsWithFormat);
			  }
			}

			var didWarnStateUpdateForUnmountedComponent = {};

			function warnNoop(publicInstance, callerName) {
			  {
			    var _constructor = publicInstance.constructor;
			    var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
			    var warningKey = componentName + "." + callerName;

			    if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
			      return;
			    }

			    error("Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);

			    didWarnStateUpdateForUnmountedComponent[warningKey] = true;
			  }
			}
			/**
			 * This is the abstract API for an update queue.
			 */


			var ReactNoopUpdateQueue = {
			  /**
			   * Checks whether or not this composite component is mounted.
			   * @param {ReactClass} publicInstance The instance we want to test.
			   * @return {boolean} True if mounted, false otherwise.
			   * @protected
			   * @final
			   */
			  isMounted: function (publicInstance) {
			    return false;
			  },

			  /**
			   * Forces an update. This should only be invoked when it is known with
			   * certainty that we are **not** in a DOM transaction.
			   *
			   * You may want to call this when you know that some deeper aspect of the
			   * component's state has changed but `setState` was not called.
			   *
			   * This will not invoke `shouldComponentUpdate`, but it will invoke
			   * `componentWillUpdate` and `componentDidUpdate`.
			   *
			   * @param {ReactClass} publicInstance The instance that should rerender.
			   * @param {?function} callback Called after component is updated.
			   * @param {?string} callerName name of the calling function in the public API.
			   * @internal
			   */
			  enqueueForceUpdate: function (publicInstance, callback, callerName) {
			    warnNoop(publicInstance, 'forceUpdate');
			  },

			  /**
			   * Replaces all of the state. Always use this or `setState` to mutate state.
			   * You should treat `this.state` as immutable.
			   *
			   * There is no guarantee that `this.state` will be immediately updated, so
			   * accessing `this.state` after calling this method may return the old value.
			   *
			   * @param {ReactClass} publicInstance The instance that should rerender.
			   * @param {object} completeState Next state.
			   * @param {?function} callback Called after component is updated.
			   * @param {?string} callerName name of the calling function in the public API.
			   * @internal
			   */
			  enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
			    warnNoop(publicInstance, 'replaceState');
			  },

			  /**
			   * Sets a subset of the state. This only exists because _pendingState is
			   * internal. This provides a merging strategy that is not available to deep
			   * properties which is confusing. TODO: Expose pendingState or don't use it
			   * during the merge.
			   *
			   * @param {ReactClass} publicInstance The instance that should rerender.
			   * @param {object} partialState Next partial state to be merged with state.
			   * @param {?function} callback Called after component is updated.
			   * @param {?string} Name of the calling function in the public API.
			   * @internal
			   */
			  enqueueSetState: function (publicInstance, partialState, callback, callerName) {
			    warnNoop(publicInstance, 'setState');
			  }
			};

			var emptyObject = {};

			{
			  Object.freeze(emptyObject);
			}
			/**
			 * Base class helpers for the updating state of a component.
			 */


			function Component(props, context, updater) {
			  this.props = props;
			  this.context = context; // If a component has string refs, we will assign a different object later.

			  this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
			  // renderer.

			  this.updater = updater || ReactNoopUpdateQueue;
			}

			Component.prototype.isReactComponent = {};
			/**
			 * Sets a subset of the state. Always use this to mutate
			 * state. You should treat `this.state` as immutable.
			 *
			 * There is no guarantee that `this.state` will be immediately updated, so
			 * accessing `this.state` after calling this method may return the old value.
			 *
			 * There is no guarantee that calls to `setState` will run synchronously,
			 * as they may eventually be batched together.  You can provide an optional
			 * callback that will be executed when the call to setState is actually
			 * completed.
			 *
			 * When a function is provided to setState, it will be called at some point in
			 * the future (not synchronously). It will be called with the up to date
			 * component arguments (state, props, context). These values can be different
			 * from this.* because your function may be called after receiveProps but before
			 * shouldComponentUpdate, and this new state, props, and context will not yet be
			 * assigned to this.
			 *
			 * @param {object|function} partialState Next partial state or function to
			 *        produce next partial state to be merged with current state.
			 * @param {?function} callback Called after state is updated.
			 * @final
			 * @protected
			 */

			Component.prototype.setState = function (partialState, callback) {
			  if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
			    {
			      throw Error( "setState(...): takes an object of state variables to update or a function which returns an object of state variables." );
			    }
			  }

			  this.updater.enqueueSetState(this, partialState, callback, 'setState');
			};
			/**
			 * Forces an update. This should only be invoked when it is known with
			 * certainty that we are **not** in a DOM transaction.
			 *
			 * You may want to call this when you know that some deeper aspect of the
			 * component's state has changed but `setState` was not called.
			 *
			 * This will not invoke `shouldComponentUpdate`, but it will invoke
			 * `componentWillUpdate` and `componentDidUpdate`.
			 *
			 * @param {?function} callback Called after update is complete.
			 * @final
			 * @protected
			 */


			Component.prototype.forceUpdate = function (callback) {
			  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
			};
			/**
			 * Deprecated APIs. These APIs used to exist on classic React classes but since
			 * we would like to deprecate them, we're not going to move them over to this
			 * modern base class. Instead, we define a getter that warns if it's accessed.
			 */


			{
			  var deprecatedAPIs = {
			    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
			    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
			  };

			  var defineDeprecationWarning = function (methodName, info) {
			    Object.defineProperty(Component.prototype, methodName, {
			      get: function () {
			        warn('%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);

			        return undefined;
			      }
			    });
			  };

			  for (var fnName in deprecatedAPIs) {
			    if (deprecatedAPIs.hasOwnProperty(fnName)) {
			      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
			    }
			  }
			}

			function ComponentDummy() {}

			ComponentDummy.prototype = Component.prototype;
			/**
			 * Convenience component with default shallow equality check for sCU.
			 */

			function PureComponent(props, context, updater) {
			  this.props = props;
			  this.context = context; // If a component has string refs, we will assign a different object later.

			  this.refs = emptyObject;
			  this.updater = updater || ReactNoopUpdateQueue;
			}

			var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
			pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

			_assign(pureComponentPrototype, Component.prototype);

			pureComponentPrototype.isPureReactComponent = true;

			// an immutable object with a single mutable value
			function createRef() {
			  var refObject = {
			    current: null
			  };

			  {
			    Object.seal(refObject);
			  }

			  return refObject;
			}

			function getWrappedName(outerType, innerType, wrapperName) {
			  var functionName = innerType.displayName || innerType.name || '';
			  return outerType.displayName || (functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName);
			}

			function getContextName(type) {
			  return type.displayName || 'Context';
			}

			function getComponentName(type) {
			  if (type == null) {
			    // Host root, text node or just invalid type.
			    return null;
			  }

			  {
			    if (typeof type.tag === 'number') {
			      error('Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
			    }
			  }

			  if (typeof type === 'function') {
			    return type.displayName || type.name || null;
			  }

			  if (typeof type === 'string') {
			    return type;
			  }

			  switch (type) {
			    case exports.Fragment:
			      return 'Fragment';

			    case REACT_PORTAL_TYPE:
			      return 'Portal';

			    case exports.Profiler:
			      return 'Profiler';

			    case exports.StrictMode:
			      return 'StrictMode';

			    case exports.Suspense:
			      return 'Suspense';

			    case REACT_SUSPENSE_LIST_TYPE:
			      return 'SuspenseList';
			  }

			  if (typeof type === 'object') {
			    switch (type.$$typeof) {
			      case REACT_CONTEXT_TYPE:
			        var context = type;
			        return getContextName(context) + '.Consumer';

			      case REACT_PROVIDER_TYPE:
			        var provider = type;
			        return getContextName(provider._context) + '.Provider';

			      case REACT_FORWARD_REF_TYPE:
			        return getWrappedName(type, type.render, 'ForwardRef');

			      case REACT_MEMO_TYPE:
			        return getComponentName(type.type);

			      case REACT_BLOCK_TYPE:
			        return getComponentName(type._render);

			      case REACT_LAZY_TYPE:
			        {
			          var lazyComponent = type;
			          var payload = lazyComponent._payload;
			          var init = lazyComponent._init;

			          try {
			            return getComponentName(init(payload));
			          } catch (x) {
			            return null;
			          }
			        }
			    }
			  }

			  return null;
			}

			var hasOwnProperty = Object.prototype.hasOwnProperty;
			var RESERVED_PROPS = {
			  key: true,
			  ref: true,
			  __self: true,
			  __source: true
			};
			var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;

			{
			  didWarnAboutStringRefs = {};
			}

			function hasValidRef(config) {
			  {
			    if (hasOwnProperty.call(config, 'ref')) {
			      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

			      if (getter && getter.isReactWarning) {
			        return false;
			      }
			    }
			  }

			  return config.ref !== undefined;
			}

			function hasValidKey(config) {
			  {
			    if (hasOwnProperty.call(config, 'key')) {
			      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

			      if (getter && getter.isReactWarning) {
			        return false;
			      }
			    }
			  }

			  return config.key !== undefined;
			}

			function defineKeyPropWarningGetter(props, displayName) {
			  var warnAboutAccessingKey = function () {
			    {
			      if (!specialPropKeyWarningShown) {
			        specialPropKeyWarningShown = true;

			        error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
			      }
			    }
			  };

			  warnAboutAccessingKey.isReactWarning = true;
			  Object.defineProperty(props, 'key', {
			    get: warnAboutAccessingKey,
			    configurable: true
			  });
			}

			function defineRefPropWarningGetter(props, displayName) {
			  var warnAboutAccessingRef = function () {
			    {
			      if (!specialPropRefWarningShown) {
			        specialPropRefWarningShown = true;

			        error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
			      }
			    }
			  };

			  warnAboutAccessingRef.isReactWarning = true;
			  Object.defineProperty(props, 'ref', {
			    get: warnAboutAccessingRef,
			    configurable: true
			  });
			}

			function warnIfStringRefCannotBeAutoConverted(config) {
			  {
			    if (typeof config.ref === 'string' && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
			      var componentName = getComponentName(ReactCurrentOwner.current.type);

			      if (!didWarnAboutStringRefs[componentName]) {
			        error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref);

			        didWarnAboutStringRefs[componentName] = true;
			      }
			    }
			  }
			}
			/**
			 * Factory method to create a new React element. This no longer adheres to
			 * the class pattern, so do not use new to call it. Also, instanceof check
			 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
			 * if something is a React Element.
			 *
			 * @param {*} type
			 * @param {*} props
			 * @param {*} key
			 * @param {string|object} ref
			 * @param {*} owner
			 * @param {*} self A *temporary* helper to detect places where `this` is
			 * different from the `owner` when React.createElement is called, so that we
			 * can warn. We want to get rid of owner and replace string `ref`s with arrow
			 * functions, and as long as `this` and owner are the same, there will be no
			 * change in behavior.
			 * @param {*} source An annotation object (added by a transpiler or otherwise)
			 * indicating filename, line number, and/or other information.
			 * @internal
			 */


			var ReactElement = function (type, key, ref, self, source, owner, props) {
			  var element = {
			    // This tag allows us to uniquely identify this as a React Element
			    $$typeof: REACT_ELEMENT_TYPE,
			    // Built-in properties that belong on the element
			    type: type,
			    key: key,
			    ref: ref,
			    props: props,
			    // Record the component responsible for creating this element.
			    _owner: owner
			  };

			  {
			    // The validation flag is currently mutative. We put it on
			    // an external backing store so that we can freeze the whole object.
			    // This can be replaced with a WeakMap once they are implemented in
			    // commonly used development environments.
			    element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
			    // the validation flag non-enumerable (where possible, which should
			    // include every environment we run tests in), so the test framework
			    // ignores it.

			    Object.defineProperty(element._store, 'validated', {
			      configurable: false,
			      enumerable: false,
			      writable: true,
			      value: false
			    }); // self and source are DEV only properties.

			    Object.defineProperty(element, '_self', {
			      configurable: false,
			      enumerable: false,
			      writable: false,
			      value: self
			    }); // Two elements created in two different places should be considered
			    // equal for testing purposes and therefore we hide it from enumeration.

			    Object.defineProperty(element, '_source', {
			      configurable: false,
			      enumerable: false,
			      writable: false,
			      value: source
			    });

			    if (Object.freeze) {
			      Object.freeze(element.props);
			      Object.freeze(element);
			    }
			  }

			  return element;
			};
			/**
			 * Create and return a new ReactElement of the given type.
			 * See https://reactjs.org/docs/react-api.html#createelement
			 */

			function createElement(type, config, children) {
			  var propName; // Reserved names are extracted

			  var props = {};
			  var key = null;
			  var ref = null;
			  var self = null;
			  var source = null;

			  if (config != null) {
			    if (hasValidRef(config)) {
			      ref = config.ref;

			      {
			        warnIfStringRefCannotBeAutoConverted(config);
			      }
			    }

			    if (hasValidKey(config)) {
			      key = '' + config.key;
			    }

			    self = config.__self === undefined ? null : config.__self;
			    source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

			    for (propName in config) {
			      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
			        props[propName] = config[propName];
			      }
			    }
			  } // Children can be more than one argument, and those are transferred onto
			  // the newly allocated props object.


			  var childrenLength = arguments.length - 2;

			  if (childrenLength === 1) {
			    props.children = children;
			  } else if (childrenLength > 1) {
			    var childArray = Array(childrenLength);

			    for (var i = 0; i < childrenLength; i++) {
			      childArray[i] = arguments[i + 2];
			    }

			    {
			      if (Object.freeze) {
			        Object.freeze(childArray);
			      }
			    }

			    props.children = childArray;
			  } // Resolve default props


			  if (type && type.defaultProps) {
			    var defaultProps = type.defaultProps;

			    for (propName in defaultProps) {
			      if (props[propName] === undefined) {
			        props[propName] = defaultProps[propName];
			      }
			    }
			  }

			  {
			    if (key || ref) {
			      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

			      if (key) {
			        defineKeyPropWarningGetter(props, displayName);
			      }

			      if (ref) {
			        defineRefPropWarningGetter(props, displayName);
			      }
			    }
			  }

			  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
			}
			function cloneAndReplaceKey(oldElement, newKey) {
			  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
			  return newElement;
			}
			/**
			 * Clone and return a new ReactElement using element as the starting point.
			 * See https://reactjs.org/docs/react-api.html#cloneelement
			 */

			function cloneElement(element, config, children) {
			  if (!!(element === null || element === undefined)) {
			    {
			      throw Error( "React.cloneElement(...): The argument must be a React element, but you passed " + element + "." );
			    }
			  }

			  var propName; // Original props are copied

			  var props = _assign({}, element.props); // Reserved names are extracted


			  var key = element.key;
			  var ref = element.ref; // Self is preserved since the owner is preserved.

			  var self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
			  // transpiler, and the original source is probably a better indicator of the
			  // true owner.

			  var source = element._source; // Owner will be preserved, unless ref is overridden

			  var owner = element._owner;

			  if (config != null) {
			    if (hasValidRef(config)) {
			      // Silently steal the ref from the parent.
			      ref = config.ref;
			      owner = ReactCurrentOwner.current;
			    }

			    if (hasValidKey(config)) {
			      key = '' + config.key;
			    } // Remaining properties override existing props


			    var defaultProps;

			    if (element.type && element.type.defaultProps) {
			      defaultProps = element.type.defaultProps;
			    }

			    for (propName in config) {
			      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
			        if (config[propName] === undefined && defaultProps !== undefined) {
			          // Resolve default props
			          props[propName] = defaultProps[propName];
			        } else {
			          props[propName] = config[propName];
			        }
			      }
			    }
			  } // Children can be more than one argument, and those are transferred onto
			  // the newly allocated props object.


			  var childrenLength = arguments.length - 2;

			  if (childrenLength === 1) {
			    props.children = children;
			  } else if (childrenLength > 1) {
			    var childArray = Array(childrenLength);

			    for (var i = 0; i < childrenLength; i++) {
			      childArray[i] = arguments[i + 2];
			    }

			    props.children = childArray;
			  }

			  return ReactElement(element.type, key, ref, self, source, owner, props);
			}
			/**
			 * Verifies the object is a ReactElement.
			 * See https://reactjs.org/docs/react-api.html#isvalidelement
			 * @param {?object} object
			 * @return {boolean} True if `object` is a ReactElement.
			 * @final
			 */

			function isValidElement(object) {
			  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
			}

			var SEPARATOR = '.';
			var SUBSEPARATOR = ':';
			/**
			 * Escape and wrap key so it is safe to use as a reactid
			 *
			 * @param {string} key to be escaped.
			 * @return {string} the escaped key.
			 */

			function escape(key) {
			  var escapeRegex = /[=:]/g;
			  var escaperLookup = {
			    '=': '=0',
			    ':': '=2'
			  };
			  var escapedString = key.replace(escapeRegex, function (match) {
			    return escaperLookup[match];
			  });
			  return '$' + escapedString;
			}
			/**
			 * TODO: Test that a single child and an array with one item have the same key
			 * pattern.
			 */


			var didWarnAboutMaps = false;
			var userProvidedKeyEscapeRegex = /\/+/g;

			function escapeUserProvidedKey(text) {
			  return text.replace(userProvidedKeyEscapeRegex, '$&/');
			}
			/**
			 * Generate a key string that identifies a element within a set.
			 *
			 * @param {*} element A element that could contain a manual key.
			 * @param {number} index Index that is used if a manual key is not provided.
			 * @return {string}
			 */


			function getElementKey(element, index) {
			  // Do some typechecking here since we call this blindly. We want to ensure
			  // that we don't block potential future ES APIs.
			  if (typeof element === 'object' && element !== null && element.key != null) {
			    // Explicit key
			    return escape('' + element.key);
			  } // Implicit key determined by the index in the set


			  return index.toString(36);
			}

			function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
			  var type = typeof children;

			  if (type === 'undefined' || type === 'boolean') {
			    // All of the above are perceived as null.
			    children = null;
			  }

			  var invokeCallback = false;

			  if (children === null) {
			    invokeCallback = true;
			  } else {
			    switch (type) {
			      case 'string':
			      case 'number':
			        invokeCallback = true;
			        break;

			      case 'object':
			        switch (children.$$typeof) {
			          case REACT_ELEMENT_TYPE:
			          case REACT_PORTAL_TYPE:
			            invokeCallback = true;
			        }

			    }
			  }

			  if (invokeCallback) {
			    var _child = children;
			    var mappedChild = callback(_child); // If it's the only child, treat the name as if it was wrapped in an array
			    // so that it's consistent if the number of children grows:

			    var childKey = nameSoFar === '' ? SEPARATOR + getElementKey(_child, 0) : nameSoFar;

			    if (Array.isArray(mappedChild)) {
			      var escapedChildKey = '';

			      if (childKey != null) {
			        escapedChildKey = escapeUserProvidedKey(childKey) + '/';
			      }

			      mapIntoArray(mappedChild, array, escapedChildKey, '', function (c) {
			        return c;
			      });
			    } else if (mappedChild != null) {
			      if (isValidElement(mappedChild)) {
			        mappedChild = cloneAndReplaceKey(mappedChild, // Keep both the (mapped) and old keys if they differ, just as
			        // traverseAllChildren used to do for objects as children
			        escapedPrefix + ( // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
			        mappedChild.key && (!_child || _child.key !== mappedChild.key) ? // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
			        escapeUserProvidedKey('' + mappedChild.key) + '/' : '') + childKey);
			      }

			      array.push(mappedChild);
			    }

			    return 1;
			  }

			  var child;
			  var nextName;
			  var subtreeCount = 0; // Count of children found in the current subtree.

			  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

			  if (Array.isArray(children)) {
			    for (var i = 0; i < children.length; i++) {
			      child = children[i];
			      nextName = nextNamePrefix + getElementKey(child, i);
			      subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
			    }
			  } else {
			    var iteratorFn = getIteratorFn(children);

			    if (typeof iteratorFn === 'function') {
			      var iterableChildren = children;

			      {
			        // Warn about using Maps as children
			        if (iteratorFn === iterableChildren.entries) {
			          if (!didWarnAboutMaps) {
			            warn('Using Maps as children is not supported. ' + 'Use an array of keyed ReactElements instead.');
			          }

			          didWarnAboutMaps = true;
			        }
			      }

			      var iterator = iteratorFn.call(iterableChildren);
			      var step;
			      var ii = 0;

			      while (!(step = iterator.next()).done) {
			        child = step.value;
			        nextName = nextNamePrefix + getElementKey(child, ii++);
			        subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
			      }
			    } else if (type === 'object') {
			      var childrenString = '' + children;

			      {
			        {
			          throw Error( "Objects are not valid as a React child (found: " + (childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString) + "). If you meant to render a collection of children, use an array instead." );
			        }
			      }
			    }
			  }

			  return subtreeCount;
			}

			/**
			 * Maps children that are typically specified as `props.children`.
			 *
			 * See https://reactjs.org/docs/react-api.html#reactchildrenmap
			 *
			 * The provided mapFunction(child, index) will be called for each
			 * leaf child.
			 *
			 * @param {?*} children Children tree container.
			 * @param {function(*, int)} func The map function.
			 * @param {*} context Context for mapFunction.
			 * @return {object} Object containing the ordered map of results.
			 */
			function mapChildren(children, func, context) {
			  if (children == null) {
			    return children;
			  }

			  var result = [];
			  var count = 0;
			  mapIntoArray(children, result, '', '', function (child) {
			    return func.call(context, child, count++);
			  });
			  return result;
			}
			/**
			 * Count the number of children that are typically specified as
			 * `props.children`.
			 *
			 * See https://reactjs.org/docs/react-api.html#reactchildrencount
			 *
			 * @param {?*} children Children tree container.
			 * @return {number} The number of children.
			 */


			function countChildren(children) {
			  var n = 0;
			  mapChildren(children, function () {
			    n++; // Don't return anything
			  });
			  return n;
			}

			/**
			 * Iterates through children that are typically specified as `props.children`.
			 *
			 * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
			 *
			 * The provided forEachFunc(child, index) will be called for each
			 * leaf child.
			 *
			 * @param {?*} children Children tree container.
			 * @param {function(*, int)} forEachFunc
			 * @param {*} forEachContext Context for forEachContext.
			 */
			function forEachChildren(children, forEachFunc, forEachContext) {
			  mapChildren(children, function () {
			    forEachFunc.apply(this, arguments); // Don't return anything.
			  }, forEachContext);
			}
			/**
			 * Flatten a children object (typically specified as `props.children`) and
			 * return an array with appropriately re-keyed children.
			 *
			 * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
			 */


			function toArray(children) {
			  return mapChildren(children, function (child) {
			    return child;
			  }) || [];
			}
			/**
			 * Returns the first child in a collection of children and verifies that there
			 * is only one child in the collection.
			 *
			 * See https://reactjs.org/docs/react-api.html#reactchildrenonly
			 *
			 * The current implementation of this function assumes that a single child gets
			 * passed without a wrapper, but the purpose of this helper function is to
			 * abstract away the particular structure of children.
			 *
			 * @param {?object} children Child collection structure.
			 * @return {ReactElement} The first and only `ReactElement` contained in the
			 * structure.
			 */


			function onlyChild(children) {
			  if (!isValidElement(children)) {
			    {
			      throw Error( "React.Children.only expected to receive a single React element child." );
			    }
			  }

			  return children;
			}

			function createContext(defaultValue, calculateChangedBits) {
			  if (calculateChangedBits === undefined) {
			    calculateChangedBits = null;
			  } else {
			    {
			      if (calculateChangedBits !== null && typeof calculateChangedBits !== 'function') {
			        error('createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits);
			      }
			    }
			  }

			  var context = {
			    $$typeof: REACT_CONTEXT_TYPE,
			    _calculateChangedBits: calculateChangedBits,
			    // As a workaround to support multiple concurrent renderers, we categorize
			    // some renderers as primary and others as secondary. We only expect
			    // there to be two concurrent renderers at most: React Native (primary) and
			    // Fabric (secondary); React DOM (primary) and React ART (secondary).
			    // Secondary renderers store their context values on separate fields.
			    _currentValue: defaultValue,
			    _currentValue2: defaultValue,
			    // Used to track how many concurrent renderers this context currently
			    // supports within in a single renderer. Such as parallel server rendering.
			    _threadCount: 0,
			    // These are circular
			    Provider: null,
			    Consumer: null
			  };
			  context.Provider = {
			    $$typeof: REACT_PROVIDER_TYPE,
			    _context: context
			  };
			  var hasWarnedAboutUsingNestedContextConsumers = false;
			  var hasWarnedAboutUsingConsumerProvider = false;
			  var hasWarnedAboutDisplayNameOnConsumer = false;

			  {
			    // A separate object, but proxies back to the original context object for
			    // backwards compatibility. It has a different $$typeof, so we can properly
			    // warn for the incorrect usage of Context as a Consumer.
			    var Consumer = {
			      $$typeof: REACT_CONTEXT_TYPE,
			      _context: context,
			      _calculateChangedBits: context._calculateChangedBits
			    }; // $FlowFixMe: Flow complains about not setting a value, which is intentional here

			    Object.defineProperties(Consumer, {
			      Provider: {
			        get: function () {
			          if (!hasWarnedAboutUsingConsumerProvider) {
			            hasWarnedAboutUsingConsumerProvider = true;

			            error('Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
			          }

			          return context.Provider;
			        },
			        set: function (_Provider) {
			          context.Provider = _Provider;
			        }
			      },
			      _currentValue: {
			        get: function () {
			          return context._currentValue;
			        },
			        set: function (_currentValue) {
			          context._currentValue = _currentValue;
			        }
			      },
			      _currentValue2: {
			        get: function () {
			          return context._currentValue2;
			        },
			        set: function (_currentValue2) {
			          context._currentValue2 = _currentValue2;
			        }
			      },
			      _threadCount: {
			        get: function () {
			          return context._threadCount;
			        },
			        set: function (_threadCount) {
			          context._threadCount = _threadCount;
			        }
			      },
			      Consumer: {
			        get: function () {
			          if (!hasWarnedAboutUsingNestedContextConsumers) {
			            hasWarnedAboutUsingNestedContextConsumers = true;

			            error('Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
			          }

			          return context.Consumer;
			        }
			      },
			      displayName: {
			        get: function () {
			          return context.displayName;
			        },
			        set: function (displayName) {
			          if (!hasWarnedAboutDisplayNameOnConsumer) {
			            warn('Setting `displayName` on Context.Consumer has no effect. ' + "You should set it directly on the context with Context.displayName = '%s'.", displayName);

			            hasWarnedAboutDisplayNameOnConsumer = true;
			          }
			        }
			      }
			    }); // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty

			    context.Consumer = Consumer;
			  }

			  {
			    context._currentRenderer = null;
			    context._currentRenderer2 = null;
			  }

			  return context;
			}

			var Uninitialized = -1;
			var Pending = 0;
			var Resolved = 1;
			var Rejected = 2;

			function lazyInitializer(payload) {
			  if (payload._status === Uninitialized) {
			    var ctor = payload._result;
			    var thenable = ctor(); // Transition to the next state.

			    var pending = payload;
			    pending._status = Pending;
			    pending._result = thenable;
			    thenable.then(function (moduleObject) {
			      if (payload._status === Pending) {
			        var defaultExport = moduleObject.default;

			        {
			          if (defaultExport === undefined) {
			            error('lazy: Expected the result of a dynamic import() call. ' + 'Instead received: %s\n\nYour code should look like: \n  ' + // Break up imports to avoid accidentally parsing them as dependencies.
			            'const MyComponent = lazy(() => imp' + "ort('./MyComponent'))", moduleObject);
			          }
			        } // Transition to the next state.


			        var resolved = payload;
			        resolved._status = Resolved;
			        resolved._result = defaultExport;
			      }
			    }, function (error) {
			      if (payload._status === Pending) {
			        // Transition to the next state.
			        var rejected = payload;
			        rejected._status = Rejected;
			        rejected._result = error;
			      }
			    });
			  }

			  if (payload._status === Resolved) {
			    return payload._result;
			  } else {
			    throw payload._result;
			  }
			}

			function lazy(ctor) {
			  var payload = {
			    // We use these fields to store the result.
			    _status: -1,
			    _result: ctor
			  };
			  var lazyType = {
			    $$typeof: REACT_LAZY_TYPE,
			    _payload: payload,
			    _init: lazyInitializer
			  };

			  {
			    // In production, this would just set it on the object.
			    var defaultProps;
			    var propTypes; // $FlowFixMe

			    Object.defineProperties(lazyType, {
			      defaultProps: {
			        configurable: true,
			        get: function () {
			          return defaultProps;
			        },
			        set: function (newDefaultProps) {
			          error('React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

			          defaultProps = newDefaultProps; // Match production behavior more closely:
			          // $FlowFixMe

			          Object.defineProperty(lazyType, 'defaultProps', {
			            enumerable: true
			          });
			        }
			      },
			      propTypes: {
			        configurable: true,
			        get: function () {
			          return propTypes;
			        },
			        set: function (newPropTypes) {
			          error('React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

			          propTypes = newPropTypes; // Match production behavior more closely:
			          // $FlowFixMe

			          Object.defineProperty(lazyType, 'propTypes', {
			            enumerable: true
			          });
			        }
			      }
			    });
			  }

			  return lazyType;
			}

			function forwardRef(render) {
			  {
			    if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
			      error('forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
			    } else if (typeof render !== 'function') {
			      error('forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
			    } else {
			      if (render.length !== 0 && render.length !== 2) {
			        error('forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.');
			      }
			    }

			    if (render != null) {
			      if (render.defaultProps != null || render.propTypes != null) {
			        error('forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?');
			      }
			    }
			  }

			  var elementType = {
			    $$typeof: REACT_FORWARD_REF_TYPE,
			    render: render
			  };

			  {
			    var ownName;
			    Object.defineProperty(elementType, 'displayName', {
			      enumerable: false,
			      configurable: true,
			      get: function () {
			        return ownName;
			      },
			      set: function (name) {
			        ownName = name;

			        if (render.displayName == null) {
			          render.displayName = name;
			        }
			      }
			    });
			  }

			  return elementType;
			}

			// Filter certain DOM attributes (e.g. src, href) if their values are empty strings.

			var enableScopeAPI = false; // Experimental Create Event Handle API.

			function isValidElementType(type) {
			  if (typeof type === 'string' || typeof type === 'function') {
			    return true;
			  } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


			  if (type === exports.Fragment || type === exports.Profiler || type === REACT_DEBUG_TRACING_MODE_TYPE || type === exports.StrictMode || type === exports.Suspense || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || enableScopeAPI ) {
			    return true;
			  }

			  if (typeof type === 'object' && type !== null) {
			    if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_BLOCK_TYPE || type[0] === REACT_SERVER_BLOCK_TYPE) {
			      return true;
			    }
			  }

			  return false;
			}

			function memo(type, compare) {
			  {
			    if (!isValidElementType(type)) {
			      error('memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
			    }
			  }

			  var elementType = {
			    $$typeof: REACT_MEMO_TYPE,
			    type: type,
			    compare: compare === undefined ? null : compare
			  };

			  {
			    var ownName;
			    Object.defineProperty(elementType, 'displayName', {
			      enumerable: false,
			      configurable: true,
			      get: function () {
			        return ownName;
			      },
			      set: function (name) {
			        ownName = name;

			        if (type.displayName == null) {
			          type.displayName = name;
			        }
			      }
			    });
			  }

			  return elementType;
			}

			function resolveDispatcher() {
			  var dispatcher = ReactCurrentDispatcher.current;

			  if (!(dispatcher !== null)) {
			    {
			      throw Error( "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem." );
			    }
			  }

			  return dispatcher;
			}

			function useContext(Context, unstable_observedBits) {
			  var dispatcher = resolveDispatcher();

			  {
			    if (unstable_observedBits !== undefined) {
			      error('useContext() second argument is reserved for future ' + 'use in React. Passing it is not supported. ' + 'You passed: %s.%s', unstable_observedBits, typeof unstable_observedBits === 'number' && Array.isArray(arguments[2]) ? '\n\nDid you call array.map(useContext)? ' + 'Calling Hooks inside a loop is not supported. ' + 'Learn more at https://reactjs.org/link/rules-of-hooks' : '');
			    } // TODO: add a more generic warning for invalid values.


			    if (Context._context !== undefined) {
			      var realContext = Context._context; // Don't deduplicate because this legitimately causes bugs
			      // and nobody should be using this in existing code.

			      if (realContext.Consumer === Context) {
			        error('Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
			      } else if (realContext.Provider === Context) {
			        error('Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
			      }
			    }
			  }

			  return dispatcher.useContext(Context, unstable_observedBits);
			}
			function useState(initialState) {
			  var dispatcher = resolveDispatcher();
			  return dispatcher.useState(initialState);
			}
			function useReducer(reducer, initialArg, init) {
			  var dispatcher = resolveDispatcher();
			  return dispatcher.useReducer(reducer, initialArg, init);
			}
			function useRef(initialValue) {
			  var dispatcher = resolveDispatcher();
			  return dispatcher.useRef(initialValue);
			}
			function useEffect(create, deps) {
			  var dispatcher = resolveDispatcher();
			  return dispatcher.useEffect(create, deps);
			}
			function useLayoutEffect(create, deps) {
			  var dispatcher = resolveDispatcher();
			  return dispatcher.useLayoutEffect(create, deps);
			}
			function useCallback(callback, deps) {
			  var dispatcher = resolveDispatcher();
			  return dispatcher.useCallback(callback, deps);
			}
			function useMemo(create, deps) {
			  var dispatcher = resolveDispatcher();
			  return dispatcher.useMemo(create, deps);
			}
			function useImperativeHandle(ref, create, deps) {
			  var dispatcher = resolveDispatcher();
			  return dispatcher.useImperativeHandle(ref, create, deps);
			}
			function useDebugValue(value, formatterFn) {
			  {
			    var dispatcher = resolveDispatcher();
			    return dispatcher.useDebugValue(value, formatterFn);
			  }
			}

			// Helpers to patch console.logs to avoid logging during side-effect free
			// replaying on render function. This currently only patches the object
			// lazily which won't cover if the log function was extracted eagerly.
			// We could also eagerly patch the method.
			var disabledDepth = 0;
			var prevLog;
			var prevInfo;
			var prevWarn;
			var prevError;
			var prevGroup;
			var prevGroupCollapsed;
			var prevGroupEnd;

			function disabledLog() {}

			disabledLog.__reactDisabledLog = true;
			function disableLogs() {
			  {
			    if (disabledDepth === 0) {
			      /* eslint-disable react-internal/no-production-logging */
			      prevLog = console.log;
			      prevInfo = console.info;
			      prevWarn = console.warn;
			      prevError = console.error;
			      prevGroup = console.group;
			      prevGroupCollapsed = console.groupCollapsed;
			      prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

			      var props = {
			        configurable: true,
			        enumerable: true,
			        value: disabledLog,
			        writable: true
			      }; // $FlowFixMe Flow thinks console is immutable.

			      Object.defineProperties(console, {
			        info: props,
			        log: props,
			        warn: props,
			        error: props,
			        group: props,
			        groupCollapsed: props,
			        groupEnd: props
			      });
			      /* eslint-enable react-internal/no-production-logging */
			    }

			    disabledDepth++;
			  }
			}
			function reenableLogs() {
			  {
			    disabledDepth--;

			    if (disabledDepth === 0) {
			      /* eslint-disable react-internal/no-production-logging */
			      var props = {
			        configurable: true,
			        enumerable: true,
			        writable: true
			      }; // $FlowFixMe Flow thinks console is immutable.

			      Object.defineProperties(console, {
			        log: _assign({}, props, {
			          value: prevLog
			        }),
			        info: _assign({}, props, {
			          value: prevInfo
			        }),
			        warn: _assign({}, props, {
			          value: prevWarn
			        }),
			        error: _assign({}, props, {
			          value: prevError
			        }),
			        group: _assign({}, props, {
			          value: prevGroup
			        }),
			        groupCollapsed: _assign({}, props, {
			          value: prevGroupCollapsed
			        }),
			        groupEnd: _assign({}, props, {
			          value: prevGroupEnd
			        })
			      });
			      /* eslint-enable react-internal/no-production-logging */
			    }

			    if (disabledDepth < 0) {
			      error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
			    }
			  }
			}

			var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
			var prefix;
			function describeBuiltInComponentFrame(name, source, ownerFn) {
			  {
			    if (prefix === undefined) {
			      // Extract the VM specific prefix used by each line.
			      try {
			        throw Error();
			      } catch (x) {
			        var match = x.stack.trim().match(/\n( *(at )?)/);
			        prefix = match && match[1] || '';
			      }
			    } // We use the prefix to ensure our stacks line up with native stack frames.


			    return '\n' + prefix + name;
			  }
			}
			var reentry = false;
			var componentFrameCache;

			{
			  var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
			  componentFrameCache = new PossiblyWeakMap();
			}

			function describeNativeComponentFrame(fn, construct) {
			  // If something asked for a stack inside a fake render, it should get ignored.
			  if (!fn || reentry) {
			    return '';
			  }

			  {
			    var frame = componentFrameCache.get(fn);

			    if (frame !== undefined) {
			      return frame;
			    }
			  }

			  var control;
			  reentry = true;
			  var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.

			  Error.prepareStackTrace = undefined;
			  var previousDispatcher;

			  {
			    previousDispatcher = ReactCurrentDispatcher$1.current; // Set the dispatcher in DEV because this might be call in the render function
			    // for warnings.

			    ReactCurrentDispatcher$1.current = null;
			    disableLogs();
			  }

			  try {
			    // This should throw.
			    if (construct) {
			      // Something should be setting the props in the constructor.
			      var Fake = function () {
			        throw Error();
			      }; // $FlowFixMe


			      Object.defineProperty(Fake.prototype, 'props', {
			        set: function () {
			          // We use a throwing setter instead of frozen or non-writable props
			          // because that won't throw in a non-strict mode function.
			          throw Error();
			        }
			      });

			      if (typeof Reflect === 'object' && Reflect.construct) {
			        // We construct a different control for this case to include any extra
			        // frames added by the construct call.
			        try {
			          Reflect.construct(Fake, []);
			        } catch (x) {
			          control = x;
			        }

			        Reflect.construct(fn, [], Fake);
			      } else {
			        try {
			          Fake.call();
			        } catch (x) {
			          control = x;
			        }

			        fn.call(Fake.prototype);
			      }
			    } else {
			      try {
			        throw Error();
			      } catch (x) {
			        control = x;
			      }

			      fn();
			    }
			  } catch (sample) {
			    // This is inlined manually because closure doesn't do it for us.
			    if (sample && control && typeof sample.stack === 'string') {
			      // This extracts the first frame from the sample that isn't also in the control.
			      // Skipping one frame that we assume is the frame that calls the two.
			      var sampleLines = sample.stack.split('\n');
			      var controlLines = control.stack.split('\n');
			      var s = sampleLines.length - 1;
			      var c = controlLines.length - 1;

			      while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
			        // We expect at least one stack frame to be shared.
			        // Typically this will be the root most one. However, stack frames may be
			        // cut off due to maximum stack limits. In this case, one maybe cut off
			        // earlier than the other. We assume that the sample is longer or the same
			        // and there for cut off earlier. So we should find the root most frame in
			        // the sample somewhere in the control.
			        c--;
			      }

			      for (; s >= 1 && c >= 0; s--, c--) {
			        // Next we find the first one that isn't the same which should be the
			        // frame that called our sample function and the control.
			        if (sampleLines[s] !== controlLines[c]) {
			          // In V8, the first line is describing the message but other VMs don't.
			          // If we're about to return the first line, and the control is also on the same
			          // line, that's a pretty good indicator that our sample threw at same line as
			          // the control. I.e. before we entered the sample frame. So we ignore this result.
			          // This can happen if you passed a class to function component, or non-function.
			          if (s !== 1 || c !== 1) {
			            do {
			              s--;
			              c--; // We may still have similar intermediate frames from the construct call.
			              // The next one that isn't the same should be our match though.

			              if (c < 0 || sampleLines[s] !== controlLines[c]) {
			                // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
			                var _frame = '\n' + sampleLines[s].replace(' at new ', ' at ');

			                {
			                  if (typeof fn === 'function') {
			                    componentFrameCache.set(fn, _frame);
			                  }
			                } // Return the line we found.


			                return _frame;
			              }
			            } while (s >= 1 && c >= 0);
			          }

			          break;
			        }
			      }
			    }
			  } finally {
			    reentry = false;

			    {
			      ReactCurrentDispatcher$1.current = previousDispatcher;
			      reenableLogs();
			    }

			    Error.prepareStackTrace = previousPrepareStackTrace;
			  } // Fallback to just using the name if we couldn't make it throw.


			  var name = fn ? fn.displayName || fn.name : '';
			  var syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';

			  {
			    if (typeof fn === 'function') {
			      componentFrameCache.set(fn, syntheticFrame);
			    }
			  }

			  return syntheticFrame;
			}
			function describeFunctionComponentFrame(fn, source, ownerFn) {
			  {
			    return describeNativeComponentFrame(fn, false);
			  }
			}

			function shouldConstruct(Component) {
			  var prototype = Component.prototype;
			  return !!(prototype && prototype.isReactComponent);
			}

			function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {

			  if (type == null) {
			    return '';
			  }

			  if (typeof type === 'function') {
			    {
			      return describeNativeComponentFrame(type, shouldConstruct(type));
			    }
			  }

			  if (typeof type === 'string') {
			    return describeBuiltInComponentFrame(type);
			  }

			  switch (type) {
			    case exports.Suspense:
			      return describeBuiltInComponentFrame('Suspense');

			    case REACT_SUSPENSE_LIST_TYPE:
			      return describeBuiltInComponentFrame('SuspenseList');
			  }

			  if (typeof type === 'object') {
			    switch (type.$$typeof) {
			      case REACT_FORWARD_REF_TYPE:
			        return describeFunctionComponentFrame(type.render);

			      case REACT_MEMO_TYPE:
			        // Memo may contain any component type so we recursively resolve it.
			        return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);

			      case REACT_BLOCK_TYPE:
			        return describeFunctionComponentFrame(type._render);

			      case REACT_LAZY_TYPE:
			        {
			          var lazyComponent = type;
			          var payload = lazyComponent._payload;
			          var init = lazyComponent._init;

			          try {
			            // Lazy may contain any component type so we recursively resolve it.
			            return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
			          } catch (x) {}
			        }
			    }
			  }

			  return '';
			}

			var loggedTypeFailures = {};
			var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;

			function setCurrentlyValidatingElement(element) {
			  {
			    if (element) {
			      var owner = element._owner;
			      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
			      ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
			    } else {
			      ReactDebugCurrentFrame$1.setExtraStackFrame(null);
			    }
			  }
			}

			function checkPropTypes(typeSpecs, values, location, componentName, element) {
			  {
			    // $FlowFixMe This is okay but Flow doesn't know it.
			    var has = Function.call.bind(Object.prototype.hasOwnProperty);

			    for (var typeSpecName in typeSpecs) {
			      if (has(typeSpecs, typeSpecName)) {
			        var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
			        // fail the render phase where it didn't fail before. So we log it.
			        // After these have been cleaned up, we'll let them throw.

			        try {
			          // This is intentionally an invariant that gets caught. It's the same
			          // behavior as without this statement except with a better message.
			          if (typeof typeSpecs[typeSpecName] !== 'function') {
			            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
			            err.name = 'Invariant Violation';
			            throw err;
			          }

			          error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
			        } catch (ex) {
			          error$1 = ex;
			        }

			        if (error$1 && !(error$1 instanceof Error)) {
			          setCurrentlyValidatingElement(element);

			          error('%s: type specification of %s' + ' `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error$1);

			          setCurrentlyValidatingElement(null);
			        }

			        if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
			          // Only monitor this failure once because there tends to be a lot of the
			          // same error.
			          loggedTypeFailures[error$1.message] = true;
			          setCurrentlyValidatingElement(element);

			          error('Failed %s type: %s', location, error$1.message);

			          setCurrentlyValidatingElement(null);
			        }
			      }
			    }
			  }
			}

			function setCurrentlyValidatingElement$1(element) {
			  {
			    if (element) {
			      var owner = element._owner;
			      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
			      setExtraStackFrame(stack);
			    } else {
			      setExtraStackFrame(null);
			    }
			  }
			}

			var propTypesMisspellWarningShown;

			{
			  propTypesMisspellWarningShown = false;
			}

			function getDeclarationErrorAddendum() {
			  if (ReactCurrentOwner.current) {
			    var name = getComponentName(ReactCurrentOwner.current.type);

			    if (name) {
			      return '\n\nCheck the render method of `' + name + '`.';
			    }
			  }

			  return '';
			}

			function getSourceInfoErrorAddendum(source) {
			  if (source !== undefined) {
			    var fileName = source.fileName.replace(/^.*[\\\/]/, '');
			    var lineNumber = source.lineNumber;
			    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
			  }

			  return '';
			}

			function getSourceInfoErrorAddendumForProps(elementProps) {
			  if (elementProps !== null && elementProps !== undefined) {
			    return getSourceInfoErrorAddendum(elementProps.__source);
			  }

			  return '';
			}
			/**
			 * Warn if there's no key explicitly set on dynamic arrays of children or
			 * object keys are not valid. This allows us to keep track of children between
			 * updates.
			 */


			var ownerHasKeyUseWarning = {};

			function getCurrentComponentErrorInfo(parentType) {
			  var info = getDeclarationErrorAddendum();

			  if (!info) {
			    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

			    if (parentName) {
			      info = "\n\nCheck the top-level render call using <" + parentName + ">.";
			    }
			  }

			  return info;
			}
			/**
			 * Warn if the element doesn't have an explicit key assigned to it.
			 * This element is in an array. The array could grow and shrink or be
			 * reordered. All children that haven't already been validated are required to
			 * have a "key" property assigned to it. Error statuses are cached so a warning
			 * will only be shown once.
			 *
			 * @internal
			 * @param {ReactElement} element Element that requires a key.
			 * @param {*} parentType element's parent's type.
			 */


			function validateExplicitKey(element, parentType) {
			  if (!element._store || element._store.validated || element.key != null) {
			    return;
			  }

			  element._store.validated = true;
			  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

			  if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
			    return;
			  }

			  ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
			  // property, it may be the creator of the child that's responsible for
			  // assigning it a key.

			  var childOwner = '';

			  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
			    // Give the component that originally created this child.
			    childOwner = " It was passed a child from " + getComponentName(element._owner.type) + ".";
			  }

			  {
			    setCurrentlyValidatingElement$1(element);

			    error('Each child in a list should have a unique "key" prop.' + '%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);

			    setCurrentlyValidatingElement$1(null);
			  }
			}
			/**
			 * Ensure that every element either is passed in a static location, in an
			 * array with an explicit keys property defined, or in an object literal
			 * with valid key property.
			 *
			 * @internal
			 * @param {ReactNode} node Statically passed child of any type.
			 * @param {*} parentType node's parent's type.
			 */


			function validateChildKeys(node, parentType) {
			  if (typeof node !== 'object') {
			    return;
			  }

			  if (Array.isArray(node)) {
			    for (var i = 0; i < node.length; i++) {
			      var child = node[i];

			      if (isValidElement(child)) {
			        validateExplicitKey(child, parentType);
			      }
			    }
			  } else if (isValidElement(node)) {
			    // This element was passed in a valid location.
			    if (node._store) {
			      node._store.validated = true;
			    }
			  } else if (node) {
			    var iteratorFn = getIteratorFn(node);

			    if (typeof iteratorFn === 'function') {
			      // Entry iterators used to provide implicit keys,
			      // but now we print a separate warning for them later.
			      if (iteratorFn !== node.entries) {
			        var iterator = iteratorFn.call(node);
			        var step;

			        while (!(step = iterator.next()).done) {
			          if (isValidElement(step.value)) {
			            validateExplicitKey(step.value, parentType);
			          }
			        }
			      }
			    }
			  }
			}
			/**
			 * Given an element, validate that its props follow the propTypes definition,
			 * provided by the type.
			 *
			 * @param {ReactElement} element
			 */


			function validatePropTypes(element) {
			  {
			    var type = element.type;

			    if (type === null || type === undefined || typeof type === 'string') {
			      return;
			    }

			    var propTypes;

			    if (typeof type === 'function') {
			      propTypes = type.propTypes;
			    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
			    // Inner props are checked in the reconciler.
			    type.$$typeof === REACT_MEMO_TYPE)) {
			      propTypes = type.propTypes;
			    } else {
			      return;
			    }

			    if (propTypes) {
			      // Intentionally inside to avoid triggering lazy initializers:
			      var name = getComponentName(type);
			      checkPropTypes(propTypes, element.props, 'prop', name, element);
			    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
			      propTypesMisspellWarningShown = true; // Intentionally inside to avoid triggering lazy initializers:

			      var _name = getComponentName(type);

			      error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', _name || 'Unknown');
			    }

			    if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
			      error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
			    }
			  }
			}
			/**
			 * Given a fragment, validate that it can only be provided with fragment props
			 * @param {ReactElement} fragment
			 */


			function validateFragmentProps(fragment) {
			  {
			    var keys = Object.keys(fragment.props);

			    for (var i = 0; i < keys.length; i++) {
			      var key = keys[i];

			      if (key !== 'children' && key !== 'key') {
			        setCurrentlyValidatingElement$1(fragment);

			        error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);

			        setCurrentlyValidatingElement$1(null);
			        break;
			      }
			    }

			    if (fragment.ref !== null) {
			      setCurrentlyValidatingElement$1(fragment);

			      error('Invalid attribute `ref` supplied to `React.Fragment`.');

			      setCurrentlyValidatingElement$1(null);
			    }
			  }
			}
			function createElementWithValidation(type, props, children) {
			  var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
			  // succeed and there will likely be errors in render.

			  if (!validType) {
			    var info = '';

			    if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
			      info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
			    }

			    var sourceInfo = getSourceInfoErrorAddendumForProps(props);

			    if (sourceInfo) {
			      info += sourceInfo;
			    } else {
			      info += getDeclarationErrorAddendum();
			    }

			    var typeString;

			    if (type === null) {
			      typeString = 'null';
			    } else if (Array.isArray(type)) {
			      typeString = 'array';
			    } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
			      typeString = "<" + (getComponentName(type.type) || 'Unknown') + " />";
			      info = ' Did you accidentally export a JSX literal instead of a component?';
			    } else {
			      typeString = typeof type;
			    }

			    {
			      error('React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
			    }
			  }

			  var element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
			  // TODO: Drop this when these are no longer allowed as the type argument.

			  if (element == null) {
			    return element;
			  } // Skip key warning if the type isn't valid since our key validation logic
			  // doesn't expect a non-string/function type and can throw confusing errors.
			  // We don't want exception behavior to differ between dev and prod.
			  // (Rendering will throw with a helpful message and as soon as the type is
			  // fixed, the key warnings will appear.)


			  if (validType) {
			    for (var i = 2; i < arguments.length; i++) {
			      validateChildKeys(arguments[i], type);
			    }
			  }

			  if (type === exports.Fragment) {
			    validateFragmentProps(element);
			  } else {
			    validatePropTypes(element);
			  }

			  return element;
			}
			var didWarnAboutDeprecatedCreateFactory = false;
			function createFactoryWithValidation(type) {
			  var validatedFactory = createElementWithValidation.bind(null, type);
			  validatedFactory.type = type;

			  {
			    if (!didWarnAboutDeprecatedCreateFactory) {
			      didWarnAboutDeprecatedCreateFactory = true;

			      warn('React.createFactory() is deprecated and will be removed in ' + 'a future major release. Consider using JSX ' + 'or use React.createElement() directly instead.');
			    } // Legacy hook: remove it


			    Object.defineProperty(validatedFactory, 'type', {
			      enumerable: false,
			      get: function () {
			        warn('Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');

			        Object.defineProperty(this, 'type', {
			          value: type
			        });
			        return type;
			      }
			    });
			  }

			  return validatedFactory;
			}
			function cloneElementWithValidation(element, props, children) {
			  var newElement = cloneElement.apply(this, arguments);

			  for (var i = 2; i < arguments.length; i++) {
			    validateChildKeys(arguments[i], newElement.type);
			  }

			  validatePropTypes(newElement);
			  return newElement;
			}

			{

			  try {
			    var frozenObject = Object.freeze({});
			    /* eslint-disable no-new */

			    new Map([[frozenObject, null]]);
			    new Set([frozenObject]);
			    /* eslint-enable no-new */
			  } catch (e) {
			  }
			}

			var createElement$1 =  createElementWithValidation ;
			var cloneElement$1 =  cloneElementWithValidation ;
			var createFactory =  createFactoryWithValidation ;
			var Children = {
			  map: mapChildren,
			  forEach: forEachChildren,
			  count: countChildren,
			  toArray: toArray,
			  only: onlyChild
			};

			exports.Children = Children;
			exports.Component = Component;
			exports.PureComponent = PureComponent;
			exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
			exports.cloneElement = cloneElement$1;
			exports.createContext = createContext;
			exports.createElement = createElement$1;
			exports.createFactory = createFactory;
			exports.createRef = createRef;
			exports.forwardRef = forwardRef;
			exports.isValidElement = isValidElement;
			exports.lazy = lazy;
			exports.memo = memo;
			exports.useCallback = useCallback;
			exports.useContext = useContext;
			exports.useDebugValue = useDebugValue;
			exports.useEffect = useEffect;
			exports.useImperativeHandle = useImperativeHandle;
			exports.useLayoutEffect = useLayoutEffect;
			exports.useMemo = useMemo;
			exports.useReducer = useReducer;
			exports.useRef = useRef;
			exports.useState = useState;
			exports.version = ReactVersion;
			  })();
			}
			}(react_development));

			const __esmModule = exports('__esmModule', true);
			const {
			  Fragment,
			  StrictMode,
			  Profiler,
			  Suspense,
			  Children,
			  Component,
			  PureComponent,
			  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
			  cloneElement,
			  createContext,
			  createElement,
			  createFactory,
			  createRef,
			  forwardRef,
			  isValidElement,
			  lazy,
			  memo,
			  useCallback,
			  useContext,
			  useDebugValue,
			  useEffect,
			  useImperativeHandle,
			  useLayoutEffect,
			  useMemo,
			  useReducer,
			  useRef,
			  useState,
			  version,
			} = react_development; exports({ Fragment: Fragment, StrictMode: StrictMode, Profiler: Profiler, Suspense: Suspense, Children: Children, Component: Component, PureComponent: PureComponent, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, cloneElement: cloneElement, createContext: createContext, createElement: createElement, createFactory: createFactory, createRef: createRef, forwardRef: forwardRef, isValidElement: isValidElement, lazy: lazy, memo: memo, useCallback: useCallback, useContext: useContext, useDebugValue: useDebugValue, useEffect: useEffect, useImperativeHandle: useImperativeHandle, useLayoutEffect: useLayoutEffect, useMemo: useMemo, useReducer: useReducer, useRef: useRef, useState: useState, version: version });

		})
	};
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QuMTcuMC4xLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC9janMvcmVhY3QuZGV2ZWxvcG1lbnQuanMiLCIuLi9zcmMvZGV2ZWxvcG1lbnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIi8qKiBAbGljZW5zZSBSZWFjdCB2MTcuMC4yXG4gKiByZWFjdC5kZXZlbG9wbWVudC5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBfYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuXG4vLyBUT0RPOiB0aGlzIGlzIHNwZWNpYWwgYmVjYXVzZSBpdCBnZXRzIGltcG9ydGVkIGR1cmluZyBidWlsZC5cbnZhciBSZWFjdFZlcnNpb24gPSAnMTcuMC4yJztcblxuLy8gQVRURU5USU9OXG4vLyBXaGVuIGFkZGluZyBuZXcgc3ltYm9scyB0byB0aGlzIGZpbGUsXG4vLyBQbGVhc2UgY29uc2lkZXIgYWxzbyBhZGRpbmcgdG8gJ3JlYWN0LWRldnRvb2xzLXNoYXJlZC9zcmMvYmFja2VuZC9SZWFjdFN5bWJvbHMnXG4vLyBUaGUgU3ltYm9sIHVzZWQgdG8gdGFnIHRoZSBSZWFjdEVsZW1lbnQtbGlrZSB0eXBlcy4gSWYgdGhlcmUgaXMgbm8gbmF0aXZlIFN5bWJvbFxuLy8gbm9yIHBvbHlmaWxsLCB0aGVuIGEgcGxhaW4gbnVtYmVyIGlzIHVzZWQgZm9yIHBlcmZvcm1hbmNlLlxudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IDB4ZWFjNztcbnZhciBSRUFDVF9QT1JUQUxfVFlQRSA9IDB4ZWFjYTtcbmV4cG9ydHMuRnJhZ21lbnQgPSAweGVhY2I7XG5leHBvcnRzLlN0cmljdE1vZGUgPSAweGVhY2M7XG5leHBvcnRzLlByb2ZpbGVyID0gMHhlYWQyO1xudmFyIFJFQUNUX1BST1ZJREVSX1RZUEUgPSAweGVhY2Q7XG52YXIgUkVBQ1RfQ09OVEVYVF9UWVBFID0gMHhlYWNlO1xudmFyIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgPSAweGVhZDA7XG5leHBvcnRzLlN1c3BlbnNlID0gMHhlYWQxO1xudmFyIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSA9IDB4ZWFkODtcbnZhciBSRUFDVF9NRU1PX1RZUEUgPSAweGVhZDM7XG52YXIgUkVBQ1RfTEFaWV9UWVBFID0gMHhlYWQ0O1xudmFyIFJFQUNUX0JMT0NLX1RZUEUgPSAweGVhZDk7XG52YXIgUkVBQ1RfU0VSVkVSX0JMT0NLX1RZUEUgPSAweGVhZGE7XG52YXIgUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSA9IDB4ZWFkNTtcbnZhciBSRUFDVF9TQ09QRV9UWVBFID0gMHhlYWQ3O1xudmFyIFJFQUNUX09QQVFVRV9JRF9UWVBFID0gMHhlYWUwO1xudmFyIFJFQUNUX0RFQlVHX1RSQUNJTkdfTU9ERV9UWVBFID0gMHhlYWUxO1xudmFyIFJFQUNUX09GRlNDUkVFTl9UWVBFID0gMHhlYWUyO1xudmFyIFJFQUNUX0xFR0FDWV9ISURERU5fVFlQRSA9IDB4ZWFlMztcblxuaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmZvcikge1xuICB2YXIgc3ltYm9sRm9yID0gU3ltYm9sLmZvcjtcbiAgUkVBQ1RfRUxFTUVOVF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5lbGVtZW50Jyk7XG4gIFJFQUNUX1BPUlRBTF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5wb3J0YWwnKTtcbiAgZXhwb3J0cy5GcmFnbWVudCA9IHN5bWJvbEZvcigncmVhY3QuZnJhZ21lbnQnKTtcbiAgZXhwb3J0cy5TdHJpY3RNb2RlID0gc3ltYm9sRm9yKCdyZWFjdC5zdHJpY3RfbW9kZScpO1xuICBleHBvcnRzLlByb2ZpbGVyID0gc3ltYm9sRm9yKCdyZWFjdC5wcm9maWxlcicpO1xuICBSRUFDVF9QUk9WSURFUl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5wcm92aWRlcicpO1xuICBSRUFDVF9DT05URVhUX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmNvbnRleHQnKTtcbiAgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QuZm9yd2FyZF9yZWYnKTtcbiAgZXhwb3J0cy5TdXNwZW5zZSA9IHN5bWJvbEZvcigncmVhY3Quc3VzcGVuc2UnKTtcbiAgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5zdXNwZW5zZV9saXN0Jyk7XG4gIFJFQUNUX01FTU9fVFlQRSA9IHN5bWJvbEZvcigncmVhY3QubWVtbycpO1xuICBSRUFDVF9MQVpZX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmxhenknKTtcbiAgUkVBQ1RfQkxPQ0tfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QuYmxvY2snKTtcbiAgUkVBQ1RfU0VSVkVSX0JMT0NLX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LnNlcnZlci5ibG9jaycpO1xuICBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5mdW5kYW1lbnRhbCcpO1xuICBSRUFDVF9TQ09QRV9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5zY29wZScpO1xuICBSRUFDVF9PUEFRVUVfSURfVFlQRSA9IHN5bWJvbEZvcigncmVhY3Qub3BhcXVlLmlkJyk7XG4gIFJFQUNUX0RFQlVHX1RSQUNJTkdfTU9ERV9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5kZWJ1Z190cmFjZV9tb2RlJyk7XG4gIFJFQUNUX09GRlNDUkVFTl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5vZmZzY3JlZW4nKTtcbiAgUkVBQ1RfTEVHQUNZX0hJRERFTl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5sZWdhY3lfaGlkZGVuJyk7XG59XG5cbnZhciBNQVlCRV9JVEVSQVRPUl9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5pdGVyYXRvcjtcbnZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJztcbmZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSkge1xuICBpZiAobWF5YmVJdGVyYWJsZSA9PT0gbnVsbCB8fCB0eXBlb2YgbWF5YmVJdGVyYWJsZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBtYXliZUl0ZXJhdG9yID0gTUFZQkVfSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbTUFZQkVfSVRFUkFUT1JfU1lNQk9MXSB8fCBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXTtcblxuICBpZiAodHlwZW9mIG1heWJlSXRlcmF0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gbWF5YmVJdGVyYXRvcjtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50IGRpc3BhdGNoZXIuXG4gKi9cbnZhciBSZWFjdEN1cnJlbnREaXNwYXRjaGVyID0ge1xuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEB0eXBlIHtSZWFjdENvbXBvbmVudH1cbiAgICovXG4gIGN1cnJlbnQ6IG51bGxcbn07XG5cbi8qKlxuICogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnQgYmF0Y2gncyBjb25maWd1cmF0aW9uIHN1Y2ggYXMgaG93IGxvbmcgYW4gdXBkYXRlXG4gKiBzaG91bGQgc3VzcGVuZCBmb3IgaWYgaXQgbmVlZHMgdG8uXG4gKi9cbnZhciBSZWFjdEN1cnJlbnRCYXRjaENvbmZpZyA9IHtcbiAgdHJhbnNpdGlvbjogMFxufTtcblxuLyoqXG4gKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudCBvd25lci5cbiAqXG4gKiBUaGUgY3VycmVudCBvd25lciBpcyB0aGUgY29tcG9uZW50IHdobyBzaG91bGQgb3duIGFueSBjb21wb25lbnRzIHRoYXQgYXJlXG4gKiBjdXJyZW50bHkgYmVpbmcgY29uc3RydWN0ZWQuXG4gKi9cbnZhciBSZWFjdEN1cnJlbnRPd25lciA9IHtcbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAdHlwZSB7UmVhY3RDb21wb25lbnR9XG4gICAqL1xuICBjdXJyZW50OiBudWxsXG59O1xuXG52YXIgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSA9IHt9O1xudmFyIGN1cnJlbnRFeHRyYVN0YWNrRnJhbWUgPSBudWxsO1xuZnVuY3Rpb24gc2V0RXh0cmFTdGFja0ZyYW1lKHN0YWNrKSB7XG4gIHtcbiAgICBjdXJyZW50RXh0cmFTdGFja0ZyYW1lID0gc3RhY2s7XG4gIH1cbn1cblxue1xuICBSZWFjdERlYnVnQ3VycmVudEZyYW1lLnNldEV4dHJhU3RhY2tGcmFtZSA9IGZ1bmN0aW9uIChzdGFjaykge1xuICAgIHtcbiAgICAgIGN1cnJlbnRFeHRyYVN0YWNrRnJhbWUgPSBzdGFjaztcbiAgICB9XG4gIH07IC8vIFN0YWNrIGltcGxlbWVudGF0aW9uIGluamVjdGVkIGJ5IHRoZSBjdXJyZW50IHJlbmRlcmVyLlxuXG5cbiAgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRDdXJyZW50U3RhY2sgPSBudWxsO1xuXG4gIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3RhY2sgPSAnJzsgLy8gQWRkIGFuIGV4dHJhIHRvcCBmcmFtZSB3aGlsZSBhbiBlbGVtZW50IGlzIGJlaW5nIHZhbGlkYXRlZFxuXG4gICAgaWYgKGN1cnJlbnRFeHRyYVN0YWNrRnJhbWUpIHtcbiAgICAgIHN0YWNrICs9IGN1cnJlbnRFeHRyYVN0YWNrRnJhbWU7XG4gICAgfSAvLyBEZWxlZ2F0ZSB0byB0aGUgaW5qZWN0ZWQgcmVuZGVyZXItc3BlY2lmaWMgaW1wbGVtZW50YXRpb25cblxuXG4gICAgdmFyIGltcGwgPSBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldEN1cnJlbnRTdGFjaztcblxuICAgIGlmIChpbXBsKSB7XG4gICAgICBzdGFjayArPSBpbXBsKCkgfHwgJyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YWNrO1xuICB9O1xufVxuXG4vKipcbiAqIFVzZWQgYnkgYWN0KCkgdG8gdHJhY2sgd2hldGhlciB5b3UncmUgaW5zaWRlIGFuIGFjdCgpIHNjb3BlLlxuICovXG52YXIgSXNTb21lUmVuZGVyZXJBY3RpbmcgPSB7XG4gIGN1cnJlbnQ6IGZhbHNlXG59O1xuXG52YXIgUmVhY3RTaGFyZWRJbnRlcm5hbHMgPSB7XG4gIFJlYWN0Q3VycmVudERpc3BhdGNoZXI6IFJlYWN0Q3VycmVudERpc3BhdGNoZXIsXG4gIFJlYWN0Q3VycmVudEJhdGNoQ29uZmlnOiBSZWFjdEN1cnJlbnRCYXRjaENvbmZpZyxcbiAgUmVhY3RDdXJyZW50T3duZXI6IFJlYWN0Q3VycmVudE93bmVyLFxuICBJc1NvbWVSZW5kZXJlckFjdGluZzogSXNTb21lUmVuZGVyZXJBY3RpbmcsXG4gIC8vIFVzZWQgYnkgcmVuZGVyZXJzIHRvIGF2b2lkIGJ1bmRsaW5nIG9iamVjdC1hc3NpZ24gdHdpY2UgaW4gVU1EIGJ1bmRsZXM6XG4gIGFzc2lnbjogX2Fzc2lnblxufTtcblxue1xuICBSZWFjdFNoYXJlZEludGVybmFscy5SZWFjdERlYnVnQ3VycmVudEZyYW1lID0gUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZTtcbn1cblxuLy8gYnkgY2FsbHMgdG8gdGhlc2UgbWV0aG9kcyBieSBhIEJhYmVsIHBsdWdpbi5cbi8vXG4vLyBJbiBQUk9EIChvciBpbiBwYWNrYWdlcyB3aXRob3V0IGFjY2VzcyB0byBSZWFjdCBpbnRlcm5hbHMpLFxuLy8gdGhleSBhcmUgbGVmdCBhcyB0aGV5IGFyZSBpbnN0ZWFkLlxuXG5mdW5jdGlvbiB3YXJuKGZvcm1hdCkge1xuICB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgcHJpbnRXYXJuaW5nKCd3YXJuJywgZm9ybWF0LCBhcmdzKTtcbiAgfVxufVxuZnVuY3Rpb24gZXJyb3IoZm9ybWF0KSB7XG4gIHtcbiAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgYXJnc1tfa2V5MiAtIDFdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICB9XG5cbiAgICBwcmludFdhcm5pbmcoJ2Vycm9yJywgZm9ybWF0LCBhcmdzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwcmludFdhcm5pbmcobGV2ZWwsIGZvcm1hdCwgYXJncykge1xuICAvLyBXaGVuIGNoYW5naW5nIHRoaXMgbG9naWMsIHlvdSBtaWdodCB3YW50IHRvIGFsc29cbiAgLy8gdXBkYXRlIGNvbnNvbGVXaXRoU3RhY2tEZXYud3d3LmpzIGFzIHdlbGwuXG4gIHtcbiAgICB2YXIgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLlJlYWN0RGVidWdDdXJyZW50RnJhbWU7XG4gICAgdmFyIHN0YWNrID0gUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRTdGFja0FkZGVuZHVtKCk7XG5cbiAgICBpZiAoc3RhY2sgIT09ICcnKSB7XG4gICAgICBmb3JtYXQgKz0gJyVzJztcbiAgICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChbc3RhY2tdKTtcbiAgICB9XG5cbiAgICB2YXIgYXJnc1dpdGhGb3JtYXQgPSBhcmdzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuICcnICsgaXRlbTtcbiAgICB9KTsgLy8gQ2FyZWZ1bDogUk4gY3VycmVudGx5IGRlcGVuZHMgb24gdGhpcyBwcmVmaXhcblxuICAgIGFyZ3NXaXRoRm9ybWF0LnVuc2hpZnQoJ1dhcm5pbmc6ICcgKyBmb3JtYXQpOyAvLyBXZSBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBzcHJlYWQgKG9yIC5hcHBseSkgZGlyZWN0bHkgYmVjYXVzZSBpdFxuICAgIC8vIGJyZWFrcyBJRTk6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvMTM2MTBcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaW50ZXJuYWwvbm8tcHJvZHVjdGlvbi1sb2dnaW5nXG5cbiAgICBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbChjb25zb2xlW2xldmVsXSwgY29uc29sZSwgYXJnc1dpdGhGb3JtYXQpO1xuICB9XG59XG5cbnZhciBkaWRXYXJuU3RhdGVVcGRhdGVGb3JVbm1vdW50ZWRDb21wb25lbnQgPSB7fTtcblxuZnVuY3Rpb24gd2Fybk5vb3AocHVibGljSW5zdGFuY2UsIGNhbGxlck5hbWUpIHtcbiAge1xuICAgIHZhciBfY29uc3RydWN0b3IgPSBwdWJsaWNJbnN0YW5jZS5jb25zdHJ1Y3RvcjtcbiAgICB2YXIgY29tcG9uZW50TmFtZSA9IF9jb25zdHJ1Y3RvciAmJiAoX2NvbnN0cnVjdG9yLmRpc3BsYXlOYW1lIHx8IF9jb25zdHJ1Y3Rvci5uYW1lKSB8fCAnUmVhY3RDbGFzcyc7XG4gICAgdmFyIHdhcm5pbmdLZXkgPSBjb21wb25lbnROYW1lICsgXCIuXCIgKyBjYWxsZXJOYW1lO1xuXG4gICAgaWYgKGRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudFt3YXJuaW5nS2V5XSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGVycm9yKFwiQ2FuJ3QgY2FsbCAlcyBvbiBhIGNvbXBvbmVudCB0aGF0IGlzIG5vdCB5ZXQgbW91bnRlZC4gXCIgKyAnVGhpcyBpcyBhIG5vLW9wLCBidXQgaXQgbWlnaHQgaW5kaWNhdGUgYSBidWcgaW4geW91ciBhcHBsaWNhdGlvbi4gJyArICdJbnN0ZWFkLCBhc3NpZ24gdG8gYHRoaXMuc3RhdGVgIGRpcmVjdGx5IG9yIGRlZmluZSBhIGBzdGF0ZSA9IHt9O2AgJyArICdjbGFzcyBwcm9wZXJ0eSB3aXRoIHRoZSBkZXNpcmVkIHN0YXRlIGluIHRoZSAlcyBjb21wb25lbnQuJywgY2FsbGVyTmFtZSwgY29tcG9uZW50TmFtZSk7XG5cbiAgICBkaWRXYXJuU3RhdGVVcGRhdGVGb3JVbm1vdW50ZWRDb21wb25lbnRbd2FybmluZ0tleV0gPSB0cnVlO1xuICB9XG59XG4vKipcbiAqIFRoaXMgaXMgdGhlIGFic3RyYWN0IEFQSSBmb3IgYW4gdXBkYXRlIHF1ZXVlLlxuICovXG5cblxudmFyIFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlID0ge1xuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgb3Igbm90IHRoaXMgY29tcG9zaXRlIGNvbXBvbmVudCBpcyBtb3VudGVkLlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB3ZSB3YW50IHRvIHRlc3QuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgbW91bnRlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKiBAcHJvdGVjdGVkXG4gICAqIEBmaW5hbFxuICAgKi9cbiAgaXNNb3VudGVkOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZvcmNlcyBhbiB1cGRhdGUuIFRoaXMgc2hvdWxkIG9ubHkgYmUgaW52b2tlZCB3aGVuIGl0IGlzIGtub3duIHdpdGhcbiAgICogY2VydGFpbnR5IHRoYXQgd2UgYXJlICoqbm90KiogaW4gYSBET00gdHJhbnNhY3Rpb24uXG4gICAqXG4gICAqIFlvdSBtYXkgd2FudCB0byBjYWxsIHRoaXMgd2hlbiB5b3Uga25vdyB0aGF0IHNvbWUgZGVlcGVyIGFzcGVjdCBvZiB0aGVcbiAgICogY29tcG9uZW50J3Mgc3RhdGUgaGFzIGNoYW5nZWQgYnV0IGBzZXRTdGF0ZWAgd2FzIG5vdCBjYWxsZWQuXG4gICAqXG4gICAqIFRoaXMgd2lsbCBub3QgaW52b2tlIGBzaG91bGRDb21wb25lbnRVcGRhdGVgLCBidXQgaXQgd2lsbCBpbnZva2VcbiAgICogYGNvbXBvbmVudFdpbGxVcGRhdGVgIGFuZCBgY29tcG9uZW50RGlkVXBkYXRlYC5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBzaG91bGQgcmVyZW5kZXIuXG4gICAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgY29tcG9uZW50IGlzIHVwZGF0ZWQuXG4gICAqIEBwYXJhbSB7P3N0cmluZ30gY2FsbGVyTmFtZSBuYW1lIG9mIHRoZSBjYWxsaW5nIGZ1bmN0aW9uIGluIHRoZSBwdWJsaWMgQVBJLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGVucXVldWVGb3JjZVVwZGF0ZTogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlLCBjYWxsYmFjaywgY2FsbGVyTmFtZSkge1xuICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCAnZm9yY2VVcGRhdGUnKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVwbGFjZXMgYWxsIG9mIHRoZSBzdGF0ZS4gQWx3YXlzIHVzZSB0aGlzIG9yIGBzZXRTdGF0ZWAgdG8gbXV0YXRlIHN0YXRlLlxuICAgKiBZb3Ugc2hvdWxkIHRyZWF0IGB0aGlzLnN0YXRlYCBhcyBpbW11dGFibGUuXG4gICAqXG4gICAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGB0aGlzLnN0YXRlYCB3aWxsIGJlIGltbWVkaWF0ZWx5IHVwZGF0ZWQsIHNvXG4gICAqIGFjY2Vzc2luZyBgdGhpcy5zdGF0ZWAgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgcmV0dXJuIHRoZSBvbGQgdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgc2hvdWxkIHJlcmVuZGVyLlxuICAgKiBAcGFyYW0ge29iamVjdH0gY29tcGxldGVTdGF0ZSBOZXh0IHN0YXRlLlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIGNvbXBvbmVudCBpcyB1cGRhdGVkLlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IGNhbGxlck5hbWUgbmFtZSBvZiB0aGUgY2FsbGluZyBmdW5jdGlvbiBpbiB0aGUgcHVibGljIEFQSS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlUmVwbGFjZVN0YXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIGNvbXBsZXRlU3RhdGUsIGNhbGxiYWNrLCBjYWxsZXJOYW1lKSB7XG4gICAgd2Fybk5vb3AocHVibGljSW5zdGFuY2UsICdyZXBsYWNlU3RhdGUnKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0cyBhIHN1YnNldCBvZiB0aGUgc3RhdGUuIFRoaXMgb25seSBleGlzdHMgYmVjYXVzZSBfcGVuZGluZ1N0YXRlIGlzXG4gICAqIGludGVybmFsLiBUaGlzIHByb3ZpZGVzIGEgbWVyZ2luZyBzdHJhdGVneSB0aGF0IGlzIG5vdCBhdmFpbGFibGUgdG8gZGVlcFxuICAgKiBwcm9wZXJ0aWVzIHdoaWNoIGlzIGNvbmZ1c2luZy4gVE9ETzogRXhwb3NlIHBlbmRpbmdTdGF0ZSBvciBkb24ndCB1c2UgaXRcbiAgICogZHVyaW5nIHRoZSBtZXJnZS5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBzaG91bGQgcmVyZW5kZXIuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJ0aWFsU3RhdGUgTmV4dCBwYXJ0aWFsIHN0YXRlIHRvIGJlIG1lcmdlZCB3aXRoIHN0YXRlLlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIGNvbXBvbmVudCBpcyB1cGRhdGVkLlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IE5hbWUgb2YgdGhlIGNhbGxpbmcgZnVuY3Rpb24gaW4gdGhlIHB1YmxpYyBBUEkuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZVNldFN0YXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2ssIGNhbGxlck5hbWUpIHtcbiAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgJ3NldFN0YXRlJyk7XG4gIH1cbn07XG5cbnZhciBlbXB0eU9iamVjdCA9IHt9O1xuXG57XG4gIE9iamVjdC5mcmVlemUoZW1wdHlPYmplY3QpO1xufVxuLyoqXG4gKiBCYXNlIGNsYXNzIGhlbHBlcnMgZm9yIHRoZSB1cGRhdGluZyBzdGF0ZSBvZiBhIGNvbXBvbmVudC5cbiAqL1xuXG5cbmZ1bmN0aW9uIENvbXBvbmVudChwcm9wcywgY29udGV4dCwgdXBkYXRlcikge1xuICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7IC8vIElmIGEgY29tcG9uZW50IGhhcyBzdHJpbmcgcmVmcywgd2Ugd2lsbCBhc3NpZ24gYSBkaWZmZXJlbnQgb2JqZWN0IGxhdGVyLlxuXG4gIHRoaXMucmVmcyA9IGVtcHR5T2JqZWN0OyAvLyBXZSBpbml0aWFsaXplIHRoZSBkZWZhdWx0IHVwZGF0ZXIgYnV0IHRoZSByZWFsIG9uZSBnZXRzIGluamVjdGVkIGJ5IHRoZVxuICAvLyByZW5kZXJlci5cblxuICB0aGlzLnVwZGF0ZXIgPSB1cGRhdGVyIHx8IFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlO1xufVxuXG5Db21wb25lbnQucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQgPSB7fTtcbi8qKlxuICogU2V0cyBhIHN1YnNldCBvZiB0aGUgc3RhdGUuIEFsd2F5cyB1c2UgdGhpcyB0byBtdXRhdGVcbiAqIHN0YXRlLiBZb3Ugc2hvdWxkIHRyZWF0IGB0aGlzLnN0YXRlYCBhcyBpbW11dGFibGUuXG4gKlxuICogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgYHRoaXMuc3RhdGVgIHdpbGwgYmUgaW1tZWRpYXRlbHkgdXBkYXRlZCwgc29cbiAqIGFjY2Vzc2luZyBgdGhpcy5zdGF0ZWAgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgcmV0dXJuIHRoZSBvbGQgdmFsdWUuXG4gKlxuICogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgY2FsbHMgdG8gYHNldFN0YXRlYCB3aWxsIHJ1biBzeW5jaHJvbm91c2x5LFxuICogYXMgdGhleSBtYXkgZXZlbnR1YWxseSBiZSBiYXRjaGVkIHRvZ2V0aGVyLiAgWW91IGNhbiBwcm92aWRlIGFuIG9wdGlvbmFsXG4gKiBjYWxsYmFjayB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgd2hlbiB0aGUgY2FsbCB0byBzZXRTdGF0ZSBpcyBhY3R1YWxseVxuICogY29tcGxldGVkLlxuICpcbiAqIFdoZW4gYSBmdW5jdGlvbiBpcyBwcm92aWRlZCB0byBzZXRTdGF0ZSwgaXQgd2lsbCBiZSBjYWxsZWQgYXQgc29tZSBwb2ludCBpblxuICogdGhlIGZ1dHVyZSAobm90IHN5bmNocm9ub3VzbHkpLiBJdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSB1cCB0byBkYXRlXG4gKiBjb21wb25lbnQgYXJndW1lbnRzIChzdGF0ZSwgcHJvcHMsIGNvbnRleHQpLiBUaGVzZSB2YWx1ZXMgY2FuIGJlIGRpZmZlcmVudFxuICogZnJvbSB0aGlzLiogYmVjYXVzZSB5b3VyIGZ1bmN0aW9uIG1heSBiZSBjYWxsZWQgYWZ0ZXIgcmVjZWl2ZVByb3BzIGJ1dCBiZWZvcmVcbiAqIHNob3VsZENvbXBvbmVudFVwZGF0ZSwgYW5kIHRoaXMgbmV3IHN0YXRlLCBwcm9wcywgYW5kIGNvbnRleHQgd2lsbCBub3QgeWV0IGJlXG4gKiBhc3NpZ25lZCB0byB0aGlzLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fGZ1bmN0aW9ufSBwYXJ0aWFsU3RhdGUgTmV4dCBwYXJ0aWFsIHN0YXRlIG9yIGZ1bmN0aW9uIHRvXG4gKiAgICAgICAgcHJvZHVjZSBuZXh0IHBhcnRpYWwgc3RhdGUgdG8gYmUgbWVyZ2VkIHdpdGggY3VycmVudCBzdGF0ZS5cbiAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgc3RhdGUgaXMgdXBkYXRlZC5cbiAqIEBmaW5hbFxuICogQHByb3RlY3RlZFxuICovXG5cbkNvbXBvbmVudC5wcm90b3R5cGUuc2V0U3RhdGUgPSBmdW5jdGlvbiAocGFydGlhbFN0YXRlLCBjYWxsYmFjaykge1xuICBpZiAoISh0eXBlb2YgcGFydGlhbFN0YXRlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgcGFydGlhbFN0YXRlID09PSAnZnVuY3Rpb24nIHx8IHBhcnRpYWxTdGF0ZSA9PSBudWxsKSkge1xuICAgIHtcbiAgICAgIHRocm93IEVycm9yKCBcInNldFN0YXRlKC4uLik6IHRha2VzIGFuIG9iamVjdCBvZiBzdGF0ZSB2YXJpYWJsZXMgdG8gdXBkYXRlIG9yIGEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhbiBvYmplY3Qgb2Ygc3RhdGUgdmFyaWFibGVzLlwiICk7XG4gICAgfVxuICB9XG5cbiAgdGhpcy51cGRhdGVyLmVucXVldWVTZXRTdGF0ZSh0aGlzLCBwYXJ0aWFsU3RhdGUsIGNhbGxiYWNrLCAnc2V0U3RhdGUnKTtcbn07XG4vKipcbiAqIEZvcmNlcyBhbiB1cGRhdGUuIFRoaXMgc2hvdWxkIG9ubHkgYmUgaW52b2tlZCB3aGVuIGl0IGlzIGtub3duIHdpdGhcbiAqIGNlcnRhaW50eSB0aGF0IHdlIGFyZSAqKm5vdCoqIGluIGEgRE9NIHRyYW5zYWN0aW9uLlxuICpcbiAqIFlvdSBtYXkgd2FudCB0byBjYWxsIHRoaXMgd2hlbiB5b3Uga25vdyB0aGF0IHNvbWUgZGVlcGVyIGFzcGVjdCBvZiB0aGVcbiAqIGNvbXBvbmVudCdzIHN0YXRlIGhhcyBjaGFuZ2VkIGJ1dCBgc2V0U3RhdGVgIHdhcyBub3QgY2FsbGVkLlxuICpcbiAqIFRoaXMgd2lsbCBub3QgaW52b2tlIGBzaG91bGRDb21wb25lbnRVcGRhdGVgLCBidXQgaXQgd2lsbCBpbnZva2VcbiAqIGBjb21wb25lbnRXaWxsVXBkYXRlYCBhbmQgYGNvbXBvbmVudERpZFVwZGF0ZWAuXG4gKlxuICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciB1cGRhdGUgaXMgY29tcGxldGUuXG4gKiBAZmluYWxcbiAqIEBwcm90ZWN0ZWRcbiAqL1xuXG5cbkNvbXBvbmVudC5wcm90b3R5cGUuZm9yY2VVcGRhdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgdGhpcy51cGRhdGVyLmVucXVldWVGb3JjZVVwZGF0ZSh0aGlzLCBjYWxsYmFjaywgJ2ZvcmNlVXBkYXRlJyk7XG59O1xuLyoqXG4gKiBEZXByZWNhdGVkIEFQSXMuIFRoZXNlIEFQSXMgdXNlZCB0byBleGlzdCBvbiBjbGFzc2ljIFJlYWN0IGNsYXNzZXMgYnV0IHNpbmNlXG4gKiB3ZSB3b3VsZCBsaWtlIHRvIGRlcHJlY2F0ZSB0aGVtLCB3ZSdyZSBub3QgZ29pbmcgdG8gbW92ZSB0aGVtIG92ZXIgdG8gdGhpc1xuICogbW9kZXJuIGJhc2UgY2xhc3MuIEluc3RlYWQsIHdlIGRlZmluZSBhIGdldHRlciB0aGF0IHdhcm5zIGlmIGl0J3MgYWNjZXNzZWQuXG4gKi9cblxuXG57XG4gIHZhciBkZXByZWNhdGVkQVBJcyA9IHtcbiAgICBpc01vdW50ZWQ6IFsnaXNNb3VudGVkJywgJ0luc3RlYWQsIG1ha2Ugc3VyZSB0byBjbGVhbiB1cCBzdWJzY3JpcHRpb25zIGFuZCBwZW5kaW5nIHJlcXVlc3RzIGluICcgKyAnY29tcG9uZW50V2lsbFVubW91bnQgdG8gcHJldmVudCBtZW1vcnkgbGVha3MuJ10sXG4gICAgcmVwbGFjZVN0YXRlOiBbJ3JlcGxhY2VTdGF0ZScsICdSZWZhY3RvciB5b3VyIGNvZGUgdG8gdXNlIHNldFN0YXRlIGluc3RlYWQgKHNlZSAnICsgJ2h0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvMzIzNikuJ11cbiAgfTtcblxuICB2YXIgZGVmaW5lRGVwcmVjYXRpb25XYXJuaW5nID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIGluZm8pIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29tcG9uZW50LnByb3RvdHlwZSwgbWV0aG9kTmFtZSwge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdhcm4oJyVzKC4uLikgaXMgZGVwcmVjYXRlZCBpbiBwbGFpbiBKYXZhU2NyaXB0IFJlYWN0IGNsYXNzZXMuICVzJywgaW5mb1swXSwgaW5mb1sxXSk7XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBmb3IgKHZhciBmbk5hbWUgaW4gZGVwcmVjYXRlZEFQSXMpIHtcbiAgICBpZiAoZGVwcmVjYXRlZEFQSXMuaGFzT3duUHJvcGVydHkoZm5OYW1lKSkge1xuICAgICAgZGVmaW5lRGVwcmVjYXRpb25XYXJuaW5nKGZuTmFtZSwgZGVwcmVjYXRlZEFQSXNbZm5OYW1lXSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIENvbXBvbmVudER1bW15KCkge31cblxuQ29tcG9uZW50RHVtbXkucHJvdG90eXBlID0gQ29tcG9uZW50LnByb3RvdHlwZTtcbi8qKlxuICogQ29udmVuaWVuY2UgY29tcG9uZW50IHdpdGggZGVmYXVsdCBzaGFsbG93IGVxdWFsaXR5IGNoZWNrIGZvciBzQ1UuXG4gKi9cblxuZnVuY3Rpb24gUHVyZUNvbXBvbmVudChwcm9wcywgY29udGV4dCwgdXBkYXRlcikge1xuICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7IC8vIElmIGEgY29tcG9uZW50IGhhcyBzdHJpbmcgcmVmcywgd2Ugd2lsbCBhc3NpZ24gYSBkaWZmZXJlbnQgb2JqZWN0IGxhdGVyLlxuXG4gIHRoaXMucmVmcyA9IGVtcHR5T2JqZWN0O1xuICB0aGlzLnVwZGF0ZXIgPSB1cGRhdGVyIHx8IFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlO1xufVxuXG52YXIgcHVyZUNvbXBvbmVudFByb3RvdHlwZSA9IFB1cmVDb21wb25lbnQucHJvdG90eXBlID0gbmV3IENvbXBvbmVudER1bW15KCk7XG5wdXJlQ29tcG9uZW50UHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUHVyZUNvbXBvbmVudDsgLy8gQXZvaWQgYW4gZXh0cmEgcHJvdG90eXBlIGp1bXAgZm9yIHRoZXNlIG1ldGhvZHMuXG5cbl9hc3NpZ24ocHVyZUNvbXBvbmVudFByb3RvdHlwZSwgQ29tcG9uZW50LnByb3RvdHlwZSk7XG5cbnB1cmVDb21wb25lbnRQcm90b3R5cGUuaXNQdXJlUmVhY3RDb21wb25lbnQgPSB0cnVlO1xuXG4vLyBhbiBpbW11dGFibGUgb2JqZWN0IHdpdGggYSBzaW5nbGUgbXV0YWJsZSB2YWx1ZVxuZnVuY3Rpb24gY3JlYXRlUmVmKCkge1xuICB2YXIgcmVmT2JqZWN0ID0ge1xuICAgIGN1cnJlbnQ6IG51bGxcbiAgfTtcblxuICB7XG4gICAgT2JqZWN0LnNlYWwocmVmT2JqZWN0KTtcbiAgfVxuXG4gIHJldHVybiByZWZPYmplY3Q7XG59XG5cbmZ1bmN0aW9uIGdldFdyYXBwZWROYW1lKG91dGVyVHlwZSwgaW5uZXJUeXBlLCB3cmFwcGVyTmFtZSkge1xuICB2YXIgZnVuY3Rpb25OYW1lID0gaW5uZXJUeXBlLmRpc3BsYXlOYW1lIHx8IGlubmVyVHlwZS5uYW1lIHx8ICcnO1xuICByZXR1cm4gb3V0ZXJUeXBlLmRpc3BsYXlOYW1lIHx8IChmdW5jdGlvbk5hbWUgIT09ICcnID8gd3JhcHBlck5hbWUgKyBcIihcIiArIGZ1bmN0aW9uTmFtZSArIFwiKVwiIDogd3JhcHBlck5hbWUpO1xufVxuXG5mdW5jdGlvbiBnZXRDb250ZXh0TmFtZSh0eXBlKSB7XG4gIHJldHVybiB0eXBlLmRpc3BsYXlOYW1lIHx8ICdDb250ZXh0Jztcbn1cblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50TmFtZSh0eXBlKSB7XG4gIGlmICh0eXBlID09IG51bGwpIHtcbiAgICAvLyBIb3N0IHJvb3QsIHRleHQgbm9kZSBvciBqdXN0IGludmFsaWQgdHlwZS5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHtcbiAgICBpZiAodHlwZW9mIHR5cGUudGFnID09PSAnbnVtYmVyJykge1xuICAgICAgZXJyb3IoJ1JlY2VpdmVkIGFuIHVuZXhwZWN0ZWQgb2JqZWN0IGluIGdldENvbXBvbmVudE5hbWUoKS4gJyArICdUaGlzIGlzIGxpa2VseSBhIGJ1ZyBpbiBSZWFjdC4gUGxlYXNlIGZpbGUgYW4gaXNzdWUuJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHR5cGUuZGlzcGxheU5hbWUgfHwgdHlwZS5uYW1lIHx8IG51bGw7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHR5cGU7XG4gIH1cblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIGV4cG9ydHMuRnJhZ21lbnQ6XG4gICAgICByZXR1cm4gJ0ZyYWdtZW50JztcblxuICAgIGNhc2UgUkVBQ1RfUE9SVEFMX1RZUEU6XG4gICAgICByZXR1cm4gJ1BvcnRhbCc7XG5cbiAgICBjYXNlIGV4cG9ydHMuUHJvZmlsZXI6XG4gICAgICByZXR1cm4gJ1Byb2ZpbGVyJztcblxuICAgIGNhc2UgZXhwb3J0cy5TdHJpY3RNb2RlOlxuICAgICAgcmV0dXJuICdTdHJpY3RNb2RlJztcblxuICAgIGNhc2UgZXhwb3J0cy5TdXNwZW5zZTpcbiAgICAgIHJldHVybiAnU3VzcGVuc2UnO1xuXG4gICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEU6XG4gICAgICByZXR1cm4gJ1N1c3BlbnNlTGlzdCc7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgc3dpdGNoICh0eXBlLiQkdHlwZW9mKSB7XG4gICAgICBjYXNlIFJFQUNUX0NPTlRFWFRfVFlQRTpcbiAgICAgICAgdmFyIGNvbnRleHQgPSB0eXBlO1xuICAgICAgICByZXR1cm4gZ2V0Q29udGV4dE5hbWUoY29udGV4dCkgKyAnLkNvbnN1bWVyJztcblxuICAgICAgY2FzZSBSRUFDVF9QUk9WSURFUl9UWVBFOlxuICAgICAgICB2YXIgcHJvdmlkZXIgPSB0eXBlO1xuICAgICAgICByZXR1cm4gZ2V0Q29udGV4dE5hbWUocHJvdmlkZXIuX2NvbnRleHQpICsgJy5Qcm92aWRlcic7XG5cbiAgICAgIGNhc2UgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTpcbiAgICAgICAgcmV0dXJuIGdldFdyYXBwZWROYW1lKHR5cGUsIHR5cGUucmVuZGVyLCAnRm9yd2FyZFJlZicpO1xuXG4gICAgICBjYXNlIFJFQUNUX01FTU9fVFlQRTpcbiAgICAgICAgcmV0dXJuIGdldENvbXBvbmVudE5hbWUodHlwZS50eXBlKTtcblxuICAgICAgY2FzZSBSRUFDVF9CTE9DS19UWVBFOlxuICAgICAgICByZXR1cm4gZ2V0Q29tcG9uZW50TmFtZSh0eXBlLl9yZW5kZXIpO1xuXG4gICAgICBjYXNlIFJFQUNUX0xBWllfVFlQRTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciBsYXp5Q29tcG9uZW50ID0gdHlwZTtcbiAgICAgICAgICB2YXIgcGF5bG9hZCA9IGxhenlDb21wb25lbnQuX3BheWxvYWQ7XG4gICAgICAgICAgdmFyIGluaXQgPSBsYXp5Q29tcG9uZW50Ll9pbml0O1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBnZXRDb21wb25lbnROYW1lKGluaXQocGF5bG9hZCkpO1xuICAgICAgICAgIH0gY2F0Y2ggKHgpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIFJFU0VSVkVEX1BST1BTID0ge1xuICBrZXk6IHRydWUsXG4gIHJlZjogdHJ1ZSxcbiAgX19zZWxmOiB0cnVlLFxuICBfX3NvdXJjZTogdHJ1ZVxufTtcbnZhciBzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93biwgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24sIGRpZFdhcm5BYm91dFN0cmluZ1JlZnM7XG5cbntcbiAgZGlkV2FybkFib3V0U3RyaW5nUmVmcyA9IHt9O1xufVxuXG5mdW5jdGlvbiBoYXNWYWxpZFJlZihjb25maWcpIHtcbiAge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgJ3JlZicpKSB7XG4gICAgICB2YXIgZ2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb25maWcsICdyZWYnKS5nZXQ7XG5cbiAgICAgIGlmIChnZXR0ZXIgJiYgZ2V0dGVyLmlzUmVhY3RXYXJuaW5nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gY29uZmlnLnJlZiAhPT0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBoYXNWYWxpZEtleShjb25maWcpIHtcbiAge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgJ2tleScpKSB7XG4gICAgICB2YXIgZ2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb25maWcsICdrZXknKS5nZXQ7XG5cbiAgICAgIGlmIChnZXR0ZXIgJiYgZ2V0dGVyLmlzUmVhY3RXYXJuaW5nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gY29uZmlnLmtleSAhPT0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpIHtcbiAgdmFyIHdhcm5BYm91dEFjY2Vzc2luZ0tleSA9IGZ1bmN0aW9uICgpIHtcbiAgICB7XG4gICAgICBpZiAoIXNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duKSB7XG4gICAgICAgIHNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duID0gdHJ1ZTtcblxuICAgICAgICBlcnJvcignJXM6IGBrZXlgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgJyArICdpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lICcgKyAndmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCAnICsgJ3Byb3AuIChodHRwczovL3JlYWN0anMub3JnL2xpbmsvc3BlY2lhbC1wcm9wcyknLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHdhcm5BYm91dEFjY2Vzc2luZ0tleS5pc1JlYWN0V2FybmluZyA9IHRydWU7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm9wcywgJ2tleScsIHtcbiAgICBnZXQ6IHdhcm5BYm91dEFjY2Vzc2luZ0tleSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlZmluZVJlZlByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSkge1xuICB2YXIgd2FybkFib3V0QWNjZXNzaW5nUmVmID0gZnVuY3Rpb24gKCkge1xuICAgIHtcbiAgICAgIGlmICghc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24pIHtcbiAgICAgICAgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24gPSB0cnVlO1xuXG4gICAgICAgIGVycm9yKCclczogYHJlZmAgaXMgbm90IGEgcHJvcC4gVHJ5aW5nIHRvIGFjY2VzcyBpdCB3aWxsIHJlc3VsdCAnICsgJ2luIGB1bmRlZmluZWRgIGJlaW5nIHJldHVybmVkLiBJZiB5b3UgbmVlZCB0byBhY2Nlc3MgdGhlIHNhbWUgJyArICd2YWx1ZSB3aXRoaW4gdGhlIGNoaWxkIGNvbXBvbmVudCwgeW91IHNob3VsZCBwYXNzIGl0IGFzIGEgZGlmZmVyZW50ICcgKyAncHJvcC4gKGh0dHBzOi8vcmVhY3Rqcy5vcmcvbGluay9zcGVjaWFsLXByb3BzKScsIGRpc3BsYXlOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgd2FybkFib3V0QWNjZXNzaW5nUmVmLmlzUmVhY3RXYXJuaW5nID0gdHJ1ZTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAncmVmJywge1xuICAgIGdldDogd2FybkFib3V0QWNjZXNzaW5nUmVmLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuZnVuY3Rpb24gd2FybklmU3RyaW5nUmVmQ2Fubm90QmVBdXRvQ29udmVydGVkKGNvbmZpZykge1xuICB7XG4gICAgaWYgKHR5cGVvZiBjb25maWcucmVmID09PSAnc3RyaW5nJyAmJiBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50ICYmIGNvbmZpZy5fX3NlbGYgJiYgUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC5zdGF0ZU5vZGUgIT09IGNvbmZpZy5fX3NlbGYpIHtcbiAgICAgIHZhciBjb21wb25lbnROYW1lID0gZ2V0Q29tcG9uZW50TmFtZShSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LnR5cGUpO1xuXG4gICAgICBpZiAoIWRpZFdhcm5BYm91dFN0cmluZ1JlZnNbY29tcG9uZW50TmFtZV0pIHtcbiAgICAgICAgZXJyb3IoJ0NvbXBvbmVudCBcIiVzXCIgY29udGFpbnMgdGhlIHN0cmluZyByZWYgXCIlc1wiLiAnICsgJ1N1cHBvcnQgZm9yIHN0cmluZyByZWZzIHdpbGwgYmUgcmVtb3ZlZCBpbiBhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiAnICsgJ1RoaXMgY2FzZSBjYW5ub3QgYmUgYXV0b21hdGljYWxseSBjb252ZXJ0ZWQgdG8gYW4gYXJyb3cgZnVuY3Rpb24uICcgKyAnV2UgYXNrIHlvdSB0byBtYW51YWxseSBmaXggdGhpcyBjYXNlIGJ5IHVzaW5nIHVzZVJlZigpIG9yIGNyZWF0ZVJlZigpIGluc3RlYWQuICcgKyAnTGVhcm4gbW9yZSBhYm91dCB1c2luZyByZWZzIHNhZmVseSBoZXJlOiAnICsgJ2h0dHBzOi8vcmVhY3Rqcy5vcmcvbGluay9zdHJpY3QtbW9kZS1zdHJpbmctcmVmJywgY29tcG9uZW50TmFtZSwgY29uZmlnLnJlZik7XG5cbiAgICAgICAgZGlkV2FybkFib3V0U3RyaW5nUmVmc1tjb21wb25lbnROYW1lXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4vKipcbiAqIEZhY3RvcnkgbWV0aG9kIHRvIGNyZWF0ZSBhIG5ldyBSZWFjdCBlbGVtZW50LiBUaGlzIG5vIGxvbmdlciBhZGhlcmVzIHRvXG4gKiB0aGUgY2xhc3MgcGF0dGVybiwgc28gZG8gbm90IHVzZSBuZXcgdG8gY2FsbCBpdC4gQWxzbywgaW5zdGFuY2VvZiBjaGVja1xuICogd2lsbCBub3Qgd29yay4gSW5zdGVhZCB0ZXN0ICQkdHlwZW9mIGZpZWxkIGFnYWluc3QgU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIHRvIGNoZWNrXG4gKiBpZiBzb21ldGhpbmcgaXMgYSBSZWFjdCBFbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7Kn0gdHlwZVxuICogQHBhcmFtIHsqfSBwcm9wc1xuICogQHBhcmFtIHsqfSBrZXlcbiAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gcmVmXG4gKiBAcGFyYW0geyp9IG93bmVyXG4gKiBAcGFyYW0geyp9IHNlbGYgQSAqdGVtcG9yYXJ5KiBoZWxwZXIgdG8gZGV0ZWN0IHBsYWNlcyB3aGVyZSBgdGhpc2AgaXNcbiAqIGRpZmZlcmVudCBmcm9tIHRoZSBgb3duZXJgIHdoZW4gUmVhY3QuY3JlYXRlRWxlbWVudCBpcyBjYWxsZWQsIHNvIHRoYXQgd2VcbiAqIGNhbiB3YXJuLiBXZSB3YW50IHRvIGdldCByaWQgb2Ygb3duZXIgYW5kIHJlcGxhY2Ugc3RyaW5nIGByZWZgcyB3aXRoIGFycm93XG4gKiBmdW5jdGlvbnMsIGFuZCBhcyBsb25nIGFzIGB0aGlzYCBhbmQgb3duZXIgYXJlIHRoZSBzYW1lLCB0aGVyZSB3aWxsIGJlIG5vXG4gKiBjaGFuZ2UgaW4gYmVoYXZpb3IuXG4gKiBAcGFyYW0geyp9IHNvdXJjZSBBbiBhbm5vdGF0aW9uIG9iamVjdCAoYWRkZWQgYnkgYSB0cmFuc3BpbGVyIG9yIG90aGVyd2lzZSlcbiAqIGluZGljYXRpbmcgZmlsZW5hbWUsIGxpbmUgbnVtYmVyLCBhbmQvb3Igb3RoZXIgaW5mb3JtYXRpb24uXG4gKiBAaW50ZXJuYWxcbiAqL1xuXG5cbnZhciBSZWFjdEVsZW1lbnQgPSBmdW5jdGlvbiAodHlwZSwga2V5LCByZWYsIHNlbGYsIHNvdXJjZSwgb3duZXIsIHByb3BzKSB7XG4gIHZhciBlbGVtZW50ID0ge1xuICAgIC8vIFRoaXMgdGFnIGFsbG93cyB1cyB0byB1bmlxdWVseSBpZGVudGlmeSB0aGlzIGFzIGEgUmVhY3QgRWxlbWVudFxuICAgICQkdHlwZW9mOiBSRUFDVF9FTEVNRU5UX1RZUEUsXG4gICAgLy8gQnVpbHQtaW4gcHJvcGVydGllcyB0aGF0IGJlbG9uZyBvbiB0aGUgZWxlbWVudFxuICAgIHR5cGU6IHR5cGUsXG4gICAga2V5OiBrZXksXG4gICAgcmVmOiByZWYsXG4gICAgcHJvcHM6IHByb3BzLFxuICAgIC8vIFJlY29yZCB0aGUgY29tcG9uZW50IHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGlzIGVsZW1lbnQuXG4gICAgX293bmVyOiBvd25lclxuICB9O1xuXG4gIHtcbiAgICAvLyBUaGUgdmFsaWRhdGlvbiBmbGFnIGlzIGN1cnJlbnRseSBtdXRhdGl2ZS4gV2UgcHV0IGl0IG9uXG4gICAgLy8gYW4gZXh0ZXJuYWwgYmFja2luZyBzdG9yZSBzbyB0aGF0IHdlIGNhbiBmcmVlemUgdGhlIHdob2xlIG9iamVjdC5cbiAgICAvLyBUaGlzIGNhbiBiZSByZXBsYWNlZCB3aXRoIGEgV2Vha01hcCBvbmNlIHRoZXkgYXJlIGltcGxlbWVudGVkIGluXG4gICAgLy8gY29tbW9ubHkgdXNlZCBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMuXG4gICAgZWxlbWVudC5fc3RvcmUgPSB7fTsgLy8gVG8gbWFrZSBjb21wYXJpbmcgUmVhY3RFbGVtZW50cyBlYXNpZXIgZm9yIHRlc3RpbmcgcHVycG9zZXMsIHdlIG1ha2VcbiAgICAvLyB0aGUgdmFsaWRhdGlvbiBmbGFnIG5vbi1lbnVtZXJhYmxlICh3aGVyZSBwb3NzaWJsZSwgd2hpY2ggc2hvdWxkXG4gICAgLy8gaW5jbHVkZSBldmVyeSBlbnZpcm9ubWVudCB3ZSBydW4gdGVzdHMgaW4pLCBzbyB0aGUgdGVzdCBmcmFtZXdvcmtcbiAgICAvLyBpZ25vcmVzIGl0LlxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQuX3N0b3JlLCAndmFsaWRhdGVkJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICB2YWx1ZTogZmFsc2VcbiAgICB9KTsgLy8gc2VsZiBhbmQgc291cmNlIGFyZSBERVYgb25seSBwcm9wZXJ0aWVzLlxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsICdfc2VsZicsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBzZWxmXG4gICAgfSk7IC8vIFR3byBlbGVtZW50cyBjcmVhdGVkIGluIHR3byBkaWZmZXJlbnQgcGxhY2VzIHNob3VsZCBiZSBjb25zaWRlcmVkXG4gICAgLy8gZXF1YWwgZm9yIHRlc3RpbmcgcHVycG9zZXMgYW5kIHRoZXJlZm9yZSB3ZSBoaWRlIGl0IGZyb20gZW51bWVyYXRpb24uXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudCwgJ19zb3VyY2UnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogc291cmNlXG4gICAgfSk7XG5cbiAgICBpZiAoT2JqZWN0LmZyZWV6ZSkge1xuICAgICAgT2JqZWN0LmZyZWV6ZShlbGVtZW50LnByb3BzKTtcbiAgICAgIE9iamVjdC5mcmVlemUoZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59O1xuLyoqXG4gKiBDcmVhdGUgYW5kIHJldHVybiBhIG5ldyBSZWFjdEVsZW1lbnQgb2YgdGhlIGdpdmVuIHR5cGUuXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI2NyZWF0ZWVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50KHR5cGUsIGNvbmZpZywgY2hpbGRyZW4pIHtcbiAgdmFyIHByb3BOYW1lOyAvLyBSZXNlcnZlZCBuYW1lcyBhcmUgZXh0cmFjdGVkXG5cbiAgdmFyIHByb3BzID0ge307XG4gIHZhciBrZXkgPSBudWxsO1xuICB2YXIgcmVmID0gbnVsbDtcbiAgdmFyIHNlbGYgPSBudWxsO1xuICB2YXIgc291cmNlID0gbnVsbDtcblxuICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICBpZiAoaGFzVmFsaWRSZWYoY29uZmlnKSkge1xuICAgICAgcmVmID0gY29uZmlnLnJlZjtcblxuICAgICAge1xuICAgICAgICB3YXJuSWZTdHJpbmdSZWZDYW5ub3RCZUF1dG9Db252ZXJ0ZWQoY29uZmlnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzVmFsaWRLZXkoY29uZmlnKSkge1xuICAgICAga2V5ID0gJycgKyBjb25maWcua2V5O1xuICAgIH1cblxuICAgIHNlbGYgPSBjb25maWcuX19zZWxmID09PSB1bmRlZmluZWQgPyBudWxsIDogY29uZmlnLl9fc2VsZjtcbiAgICBzb3VyY2UgPSBjb25maWcuX19zb3VyY2UgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb25maWcuX19zb3VyY2U7IC8vIFJlbWFpbmluZyBwcm9wZXJ0aWVzIGFyZSBhZGRlZCB0byBhIG5ldyBwcm9wcyBvYmplY3RcblxuICAgIGZvciAocHJvcE5hbWUgaW4gY29uZmlnKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsIHByb3BOYW1lKSAmJiAhUkVTRVJWRURfUFJPUFMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9IC8vIENoaWxkcmVuIGNhbiBiZSBtb3JlIHRoYW4gb25lIGFyZ3VtZW50LCBhbmQgdGhvc2UgYXJlIHRyYW5zZmVycmVkIG9udG9cbiAgLy8gdGhlIG5ld2x5IGFsbG9jYXRlZCBwcm9wcyBvYmplY3QuXG5cblxuICB2YXIgY2hpbGRyZW5MZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcblxuICBpZiAoY2hpbGRyZW5MZW5ndGggPT09IDEpIHtcbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICB9IGVsc2UgaWYgKGNoaWxkcmVuTGVuZ3RoID4gMSkge1xuICAgIHZhciBjaGlsZEFycmF5ID0gQXJyYXkoY2hpbGRyZW5MZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbkxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZEFycmF5W2ldID0gYXJndW1lbnRzW2kgKyAyXTtcbiAgICB9XG5cbiAgICB7XG4gICAgICBpZiAoT2JqZWN0LmZyZWV6ZSkge1xuICAgICAgICBPYmplY3QuZnJlZXplKGNoaWxkQXJyYXkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRBcnJheTtcbiAgfSAvLyBSZXNvbHZlIGRlZmF1bHQgcHJvcHNcblxuXG4gIGlmICh0eXBlICYmIHR5cGUuZGVmYXVsdFByb3BzKSB7XG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHR5cGUuZGVmYXVsdFByb3BzO1xuXG4gICAgZm9yIChwcm9wTmFtZSBpbiBkZWZhdWx0UHJvcHMpIHtcbiAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBkZWZhdWx0UHJvcHNbcHJvcE5hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHtcbiAgICBpZiAoa2V5IHx8IHJlZikge1xuICAgICAgdmFyIGRpc3BsYXlOYW1lID0gdHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgPyB0eXBlLmRpc3BsYXlOYW1lIHx8IHR5cGUubmFtZSB8fCAnVW5rbm93bicgOiB0eXBlO1xuXG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIGRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWYpIHtcbiAgICAgICAgZGVmaW5lUmVmUHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gUmVhY3RFbGVtZW50KHR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQsIHByb3BzKTtcbn1cbmZ1bmN0aW9uIGNsb25lQW5kUmVwbGFjZUtleShvbGRFbGVtZW50LCBuZXdLZXkpIHtcbiAgdmFyIG5ld0VsZW1lbnQgPSBSZWFjdEVsZW1lbnQob2xkRWxlbWVudC50eXBlLCBuZXdLZXksIG9sZEVsZW1lbnQucmVmLCBvbGRFbGVtZW50Ll9zZWxmLCBvbGRFbGVtZW50Ll9zb3VyY2UsIG9sZEVsZW1lbnQuX293bmVyLCBvbGRFbGVtZW50LnByb3BzKTtcbiAgcmV0dXJuIG5ld0VsZW1lbnQ7XG59XG4vKipcbiAqIENsb25lIGFuZCByZXR1cm4gYSBuZXcgUmVhY3RFbGVtZW50IHVzaW5nIGVsZW1lbnQgYXMgdGhlIHN0YXJ0aW5nIHBvaW50LlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNjbG9uZWVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiBjbG9uZUVsZW1lbnQoZWxlbWVudCwgY29uZmlnLCBjaGlsZHJlbikge1xuICBpZiAoISEoZWxlbWVudCA9PT0gbnVsbCB8fCBlbGVtZW50ID09PSB1bmRlZmluZWQpKSB7XG4gICAge1xuICAgICAgdGhyb3cgRXJyb3IoIFwiUmVhY3QuY2xvbmVFbGVtZW50KC4uLik6IFRoZSBhcmd1bWVudCBtdXN0IGJlIGEgUmVhY3QgZWxlbWVudCwgYnV0IHlvdSBwYXNzZWQgXCIgKyBlbGVtZW50ICsgXCIuXCIgKTtcbiAgICB9XG4gIH1cblxuICB2YXIgcHJvcE5hbWU7IC8vIE9yaWdpbmFsIHByb3BzIGFyZSBjb3BpZWRcblxuICB2YXIgcHJvcHMgPSBfYXNzaWduKHt9LCBlbGVtZW50LnByb3BzKTsgLy8gUmVzZXJ2ZWQgbmFtZXMgYXJlIGV4dHJhY3RlZFxuXG5cbiAgdmFyIGtleSA9IGVsZW1lbnQua2V5O1xuICB2YXIgcmVmID0gZWxlbWVudC5yZWY7IC8vIFNlbGYgaXMgcHJlc2VydmVkIHNpbmNlIHRoZSBvd25lciBpcyBwcmVzZXJ2ZWQuXG5cbiAgdmFyIHNlbGYgPSBlbGVtZW50Ll9zZWxmOyAvLyBTb3VyY2UgaXMgcHJlc2VydmVkIHNpbmNlIGNsb25lRWxlbWVudCBpcyB1bmxpa2VseSB0byBiZSB0YXJnZXRlZCBieSBhXG4gIC8vIHRyYW5zcGlsZXIsIGFuZCB0aGUgb3JpZ2luYWwgc291cmNlIGlzIHByb2JhYmx5IGEgYmV0dGVyIGluZGljYXRvciBvZiB0aGVcbiAgLy8gdHJ1ZSBvd25lci5cblxuICB2YXIgc291cmNlID0gZWxlbWVudC5fc291cmNlOyAvLyBPd25lciB3aWxsIGJlIHByZXNlcnZlZCwgdW5sZXNzIHJlZiBpcyBvdmVycmlkZGVuXG5cbiAgdmFyIG93bmVyID0gZWxlbWVudC5fb3duZXI7XG5cbiAgaWYgKGNvbmZpZyAhPSBudWxsKSB7XG4gICAgaWYgKGhhc1ZhbGlkUmVmKGNvbmZpZykpIHtcbiAgICAgIC8vIFNpbGVudGx5IHN0ZWFsIHRoZSByZWYgZnJvbSB0aGUgcGFyZW50LlxuICAgICAgcmVmID0gY29uZmlnLnJlZjtcbiAgICAgIG93bmVyID0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudDtcbiAgICB9XG5cbiAgICBpZiAoaGFzVmFsaWRLZXkoY29uZmlnKSkge1xuICAgICAga2V5ID0gJycgKyBjb25maWcua2V5O1xuICAgIH0gLy8gUmVtYWluaW5nIHByb3BlcnRpZXMgb3ZlcnJpZGUgZXhpc3RpbmcgcHJvcHNcblxuXG4gICAgdmFyIGRlZmF1bHRQcm9wcztcblxuICAgIGlmIChlbGVtZW50LnR5cGUgJiYgZWxlbWVudC50eXBlLmRlZmF1bHRQcm9wcykge1xuICAgICAgZGVmYXVsdFByb3BzID0gZWxlbWVudC50eXBlLmRlZmF1bHRQcm9wcztcbiAgICB9XG5cbiAgICBmb3IgKHByb3BOYW1lIGluIGNvbmZpZykge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCBwcm9wTmFtZSkgJiYgIVJFU0VSVkVEX1BST1BTLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICBpZiAoY29uZmlnW3Byb3BOYW1lXSA9PT0gdW5kZWZpbmVkICYmIGRlZmF1bHRQcm9wcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgLy8gUmVzb2x2ZSBkZWZhdWx0IHByb3BzXG4gICAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gZGVmYXVsdFByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBjb25maWdbcHJvcE5hbWVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IC8vIENoaWxkcmVuIGNhbiBiZSBtb3JlIHRoYW4gb25lIGFyZ3VtZW50LCBhbmQgdGhvc2UgYXJlIHRyYW5zZmVycmVkIG9udG9cbiAgLy8gdGhlIG5ld2x5IGFsbG9jYXRlZCBwcm9wcyBvYmplY3QuXG5cblxuICB2YXIgY2hpbGRyZW5MZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcblxuICBpZiAoY2hpbGRyZW5MZW5ndGggPT09IDEpIHtcbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICB9IGVsc2UgaWYgKGNoaWxkcmVuTGVuZ3RoID4gMSkge1xuICAgIHZhciBjaGlsZEFycmF5ID0gQXJyYXkoY2hpbGRyZW5MZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbkxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZEFycmF5W2ldID0gYXJndW1lbnRzW2kgKyAyXTtcbiAgICB9XG5cbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkQXJyYXk7XG4gIH1cblxuICByZXR1cm4gUmVhY3RFbGVtZW50KGVsZW1lbnQudHlwZSwga2V5LCByZWYsIHNlbGYsIHNvdXJjZSwgb3duZXIsIHByb3BzKTtcbn1cbi8qKlxuICogVmVyaWZpZXMgdGhlIG9iamVjdCBpcyBhIFJlYWN0RWxlbWVudC5cbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjaXN2YWxpZGVsZW1lbnRcbiAqIEBwYXJhbSB7P29iamVjdH0gb2JqZWN0XG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIGBvYmplY3RgIGlzIGEgUmVhY3RFbGVtZW50LlxuICogQGZpbmFsXG4gKi9cblxuZnVuY3Rpb24gaXNWYWxpZEVsZW1lbnQob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QgIT09IG51bGwgJiYgb2JqZWN0LiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEU7XG59XG5cbnZhciBTRVBBUkFUT1IgPSAnLic7XG52YXIgU1VCU0VQQVJBVE9SID0gJzonO1xuLyoqXG4gKiBFc2NhcGUgYW5kIHdyYXAga2V5IHNvIGl0IGlzIHNhZmUgdG8gdXNlIGFzIGEgcmVhY3RpZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgdG8gYmUgZXNjYXBlZC5cbiAqIEByZXR1cm4ge3N0cmluZ30gdGhlIGVzY2FwZWQga2V5LlxuICovXG5cbmZ1bmN0aW9uIGVzY2FwZShrZXkpIHtcbiAgdmFyIGVzY2FwZVJlZ2V4ID0gL1s9Ol0vZztcbiAgdmFyIGVzY2FwZXJMb29rdXAgPSB7XG4gICAgJz0nOiAnPTAnLFxuICAgICc6JzogJz0yJ1xuICB9O1xuICB2YXIgZXNjYXBlZFN0cmluZyA9IGtleS5yZXBsYWNlKGVzY2FwZVJlZ2V4LCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICByZXR1cm4gZXNjYXBlckxvb2t1cFttYXRjaF07XG4gIH0pO1xuICByZXR1cm4gJyQnICsgZXNjYXBlZFN0cmluZztcbn1cbi8qKlxuICogVE9ETzogVGVzdCB0aGF0IGEgc2luZ2xlIGNoaWxkIGFuZCBhbiBhcnJheSB3aXRoIG9uZSBpdGVtIGhhdmUgdGhlIHNhbWUga2V5XG4gKiBwYXR0ZXJuLlxuICovXG5cblxudmFyIGRpZFdhcm5BYm91dE1hcHMgPSBmYWxzZTtcbnZhciB1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCA9IC9cXC8rL2c7XG5cbmZ1bmN0aW9uIGVzY2FwZVVzZXJQcm92aWRlZEtleSh0ZXh0KSB7XG4gIHJldHVybiB0ZXh0LnJlcGxhY2UodXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXgsICckJi8nKTtcbn1cbi8qKlxuICogR2VuZXJhdGUgYSBrZXkgc3RyaW5nIHRoYXQgaWRlbnRpZmllcyBhIGVsZW1lbnQgd2l0aGluIGEgc2V0LlxuICpcbiAqIEBwYXJhbSB7Kn0gZWxlbWVudCBBIGVsZW1lbnQgdGhhdCBjb3VsZCBjb250YWluIGEgbWFudWFsIGtleS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBJbmRleCB0aGF0IGlzIHVzZWQgaWYgYSBtYW51YWwga2V5IGlzIG5vdCBwcm92aWRlZC5cbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuXG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRLZXkoZWxlbWVudCwgaW5kZXgpIHtcbiAgLy8gRG8gc29tZSB0eXBlY2hlY2tpbmcgaGVyZSBzaW5jZSB3ZSBjYWxsIHRoaXMgYmxpbmRseS4gV2Ugd2FudCB0byBlbnN1cmVcbiAgLy8gdGhhdCB3ZSBkb24ndCBibG9jayBwb3RlbnRpYWwgZnV0dXJlIEVTIEFQSXMuXG4gIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ29iamVjdCcgJiYgZWxlbWVudCAhPT0gbnVsbCAmJiBlbGVtZW50LmtleSAhPSBudWxsKSB7XG4gICAgLy8gRXhwbGljaXQga2V5XG4gICAgcmV0dXJuIGVzY2FwZSgnJyArIGVsZW1lbnQua2V5KTtcbiAgfSAvLyBJbXBsaWNpdCBrZXkgZGV0ZXJtaW5lZCBieSB0aGUgaW5kZXggaW4gdGhlIHNldFxuXG5cbiAgcmV0dXJuIGluZGV4LnRvU3RyaW5nKDM2KTtcbn1cblxuZnVuY3Rpb24gbWFwSW50b0FycmF5KGNoaWxkcmVuLCBhcnJheSwgZXNjYXBlZFByZWZpeCwgbmFtZVNvRmFyLCBjYWxsYmFjaykge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBjaGlsZHJlbjtcblxuICBpZiAodHlwZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgLy8gQWxsIG9mIHRoZSBhYm92ZSBhcmUgcGVyY2VpdmVkIGFzIG51bGwuXG4gICAgY2hpbGRyZW4gPSBudWxsO1xuICB9XG5cbiAgdmFyIGludm9rZUNhbGxiYWNrID0gZmFsc2U7XG5cbiAgaWYgKGNoaWxkcmVuID09PSBudWxsKSB7XG4gICAgaW52b2tlQ2FsbGJhY2sgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGludm9rZUNhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIHN3aXRjaCAoY2hpbGRyZW4uJCR0eXBlb2YpIHtcbiAgICAgICAgICBjYXNlIFJFQUNUX0VMRU1FTlRfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX1BPUlRBTF9UWVBFOlxuICAgICAgICAgICAgaW52b2tlQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICB9XG4gIH1cblxuICBpZiAoaW52b2tlQ2FsbGJhY2spIHtcbiAgICB2YXIgX2NoaWxkID0gY2hpbGRyZW47XG4gICAgdmFyIG1hcHBlZENoaWxkID0gY2FsbGJhY2soX2NoaWxkKTsgLy8gSWYgaXQncyB0aGUgb25seSBjaGlsZCwgdHJlYXQgdGhlIG5hbWUgYXMgaWYgaXQgd2FzIHdyYXBwZWQgaW4gYW4gYXJyYXlcbiAgICAvLyBzbyB0aGF0IGl0J3MgY29uc2lzdGVudCBpZiB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIGdyb3dzOlxuXG4gICAgdmFyIGNoaWxkS2V5ID0gbmFtZVNvRmFyID09PSAnJyA/IFNFUEFSQVRPUiArIGdldEVsZW1lbnRLZXkoX2NoaWxkLCAwKSA6IG5hbWVTb0ZhcjtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KG1hcHBlZENoaWxkKSkge1xuICAgICAgdmFyIGVzY2FwZWRDaGlsZEtleSA9ICcnO1xuXG4gICAgICBpZiAoY2hpbGRLZXkgIT0gbnVsbCkge1xuICAgICAgICBlc2NhcGVkQ2hpbGRLZXkgPSBlc2NhcGVVc2VyUHJvdmlkZWRLZXkoY2hpbGRLZXkpICsgJy8nO1xuICAgICAgfVxuXG4gICAgICBtYXBJbnRvQXJyYXkobWFwcGVkQ2hpbGQsIGFycmF5LCBlc2NhcGVkQ2hpbGRLZXksICcnLCBmdW5jdGlvbiAoYykge1xuICAgICAgICByZXR1cm4gYztcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAobWFwcGVkQ2hpbGQgIT0gbnVsbCkge1xuICAgICAgaWYgKGlzVmFsaWRFbGVtZW50KG1hcHBlZENoaWxkKSkge1xuICAgICAgICBtYXBwZWRDaGlsZCA9IGNsb25lQW5kUmVwbGFjZUtleShtYXBwZWRDaGlsZCwgLy8gS2VlcCBib3RoIHRoZSAobWFwcGVkKSBhbmQgb2xkIGtleXMgaWYgdGhleSBkaWZmZXIsIGp1c3QgYXNcbiAgICAgICAgLy8gdHJhdmVyc2VBbGxDaGlsZHJlbiB1c2VkIHRvIGRvIGZvciBvYmplY3RzIGFzIGNoaWxkcmVuXG4gICAgICAgIGVzY2FwZWRQcmVmaXggKyAoIC8vICRGbG93Rml4TWUgRmxvdyBpbmNvcnJlY3RseSB0aGlua3MgUmVhY3QuUG9ydGFsIGRvZXNuJ3QgaGF2ZSBhIGtleVxuICAgICAgICBtYXBwZWRDaGlsZC5rZXkgJiYgKCFfY2hpbGQgfHwgX2NoaWxkLmtleSAhPT0gbWFwcGVkQ2hpbGQua2V5KSA/IC8vICRGbG93Rml4TWUgRmxvdyBpbmNvcnJlY3RseSB0aGlua3MgZXhpc3RpbmcgZWxlbWVudCdzIGtleSBjYW4gYmUgYSBudW1iZXJcbiAgICAgICAgZXNjYXBlVXNlclByb3ZpZGVkS2V5KCcnICsgbWFwcGVkQ2hpbGQua2V5KSArICcvJyA6ICcnKSArIGNoaWxkS2V5KTtcbiAgICAgIH1cblxuICAgICAgYXJyYXkucHVzaChtYXBwZWRDaGlsZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICB2YXIgY2hpbGQ7XG4gIHZhciBuZXh0TmFtZTtcbiAgdmFyIHN1YnRyZWVDb3VudCA9IDA7IC8vIENvdW50IG9mIGNoaWxkcmVuIGZvdW5kIGluIHRoZSBjdXJyZW50IHN1YnRyZWUuXG5cbiAgdmFyIG5leHROYW1lUHJlZml4ID0gbmFtZVNvRmFyID09PSAnJyA/IFNFUEFSQVRPUiA6IG5hbWVTb0ZhciArIFNVQlNFUEFSQVRPUjtcblxuICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgbmV4dE5hbWUgPSBuZXh0TmFtZVByZWZpeCArIGdldEVsZW1lbnRLZXkoY2hpbGQsIGkpO1xuICAgICAgc3VidHJlZUNvdW50ICs9IG1hcEludG9BcnJheShjaGlsZCwgYXJyYXksIGVzY2FwZWRQcmVmaXgsIG5leHROYW1lLCBjYWxsYmFjayk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihjaGlsZHJlbik7XG5cbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHZhciBpdGVyYWJsZUNoaWxkcmVuID0gY2hpbGRyZW47XG5cbiAgICAgIHtcbiAgICAgICAgLy8gV2FybiBhYm91dCB1c2luZyBNYXBzIGFzIGNoaWxkcmVuXG4gICAgICAgIGlmIChpdGVyYXRvckZuID09PSBpdGVyYWJsZUNoaWxkcmVuLmVudHJpZXMpIHtcbiAgICAgICAgICBpZiAoIWRpZFdhcm5BYm91dE1hcHMpIHtcbiAgICAgICAgICAgIHdhcm4oJ1VzaW5nIE1hcHMgYXMgY2hpbGRyZW4gaXMgbm90IHN1cHBvcnRlZC4gJyArICdVc2UgYW4gYXJyYXkgb2Yga2V5ZWQgUmVhY3RFbGVtZW50cyBpbnN0ZWFkLicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRpZFdhcm5BYm91dE1hcHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChpdGVyYWJsZUNoaWxkcmVuKTtcbiAgICAgIHZhciBzdGVwO1xuICAgICAgdmFyIGlpID0gMDtcblxuICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICBjaGlsZCA9IHN0ZXAudmFsdWU7XG4gICAgICAgIG5leHROYW1lID0gbmV4dE5hbWVQcmVmaXggKyBnZXRFbGVtZW50S2V5KGNoaWxkLCBpaSsrKTtcbiAgICAgICAgc3VidHJlZUNvdW50ICs9IG1hcEludG9BcnJheShjaGlsZCwgYXJyYXksIGVzY2FwZWRQcmVmaXgsIG5leHROYW1lLCBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgdmFyIGNoaWxkcmVuU3RyaW5nID0gJycgKyBjaGlsZHJlbjtcblxuICAgICAge1xuICAgICAgICB7XG4gICAgICAgICAgdGhyb3cgRXJyb3IoIFwiT2JqZWN0cyBhcmUgbm90IHZhbGlkIGFzIGEgUmVhY3QgY2hpbGQgKGZvdW5kOiBcIiArIChjaGlsZHJlblN0cmluZyA9PT0gJ1tvYmplY3QgT2JqZWN0XScgPyAnb2JqZWN0IHdpdGgga2V5cyB7JyArIE9iamVjdC5rZXlzKGNoaWxkcmVuKS5qb2luKCcsICcpICsgJ30nIDogY2hpbGRyZW5TdHJpbmcpICsgXCIpLiBJZiB5b3UgbWVhbnQgdG8gcmVuZGVyIGEgY29sbGVjdGlvbiBvZiBjaGlsZHJlbiwgdXNlIGFuIGFycmF5IGluc3RlYWQuXCIgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdWJ0cmVlQ291bnQ7XG59XG5cbi8qKlxuICogTWFwcyBjaGlsZHJlbiB0aGF0IGFyZSB0eXBpY2FsbHkgc3BlY2lmaWVkIGFzIGBwcm9wcy5jaGlsZHJlbmAuXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVubWFwXG4gKlxuICogVGhlIHByb3ZpZGVkIG1hcEZ1bmN0aW9uKGNoaWxkLCBpbmRleCkgd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2hcbiAqIGxlYWYgY2hpbGQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCosIGludCl9IGZ1bmMgVGhlIG1hcCBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Kn0gY29udGV4dCBDb250ZXh0IGZvciBtYXBGdW5jdGlvbi5cbiAqIEByZXR1cm4ge29iamVjdH0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIG9yZGVyZWQgbWFwIG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIG1hcENoaWxkcmVuKGNoaWxkcmVuLCBmdW5jLCBjb250ZXh0KSB7XG4gIGlmIChjaGlsZHJlbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG5cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIgY291bnQgPSAwO1xuICBtYXBJbnRvQXJyYXkoY2hpbGRyZW4sIHJlc3VsdCwgJycsICcnLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIGNoaWxkLCBjb3VudCsrKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIENvdW50IHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhc1xuICogYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5jb3VudFxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNoaWxkcmVuLlxuICovXG5cblxuZnVuY3Rpb24gY291bnRDaGlsZHJlbihjaGlsZHJlbikge1xuICB2YXIgbiA9IDA7XG4gIG1hcENoaWxkcmVuKGNoaWxkcmVuLCBmdW5jdGlvbiAoKSB7XG4gICAgbisrOyAvLyBEb24ndCByZXR1cm4gYW55dGhpbmdcbiAgfSk7XG4gIHJldHVybiBuO1xufVxuXG4vKipcbiAqIEl0ZXJhdGVzIHRocm91Z2ggY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbmZvcmVhY2hcbiAqXG4gKiBUaGUgcHJvdmlkZWQgZm9yRWFjaEZ1bmMoY2hpbGQsIGluZGV4KSB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaFxuICogbGVhZiBjaGlsZC5cbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKiwgaW50KX0gZm9yRWFjaEZ1bmNcbiAqIEBwYXJhbSB7Kn0gZm9yRWFjaENvbnRleHQgQ29udGV4dCBmb3IgZm9yRWFjaENvbnRleHQuXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2hDaGlsZHJlbihjaGlsZHJlbiwgZm9yRWFjaEZ1bmMsIGZvckVhY2hDb250ZXh0KSB7XG4gIG1hcENoaWxkcmVuKGNoaWxkcmVuLCBmdW5jdGlvbiAoKSB7XG4gICAgZm9yRWFjaEZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgLy8gRG9uJ3QgcmV0dXJuIGFueXRoaW5nLlxuICB9LCBmb3JFYWNoQ29udGV4dCk7XG59XG4vKipcbiAqIEZsYXR0ZW4gYSBjaGlsZHJlbiBvYmplY3QgKHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYCkgYW5kXG4gKiByZXR1cm4gYW4gYXJyYXkgd2l0aCBhcHByb3ByaWF0ZWx5IHJlLWtleWVkIGNoaWxkcmVuLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbnRvYXJyYXlcbiAqL1xuXG5cbmZ1bmN0aW9uIHRvQXJyYXkoY2hpbGRyZW4pIHtcbiAgcmV0dXJuIG1hcENoaWxkcmVuKGNoaWxkcmVuLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICByZXR1cm4gY2hpbGQ7XG4gIH0pIHx8IFtdO1xufVxuLyoqXG4gKiBSZXR1cm5zIHRoZSBmaXJzdCBjaGlsZCBpbiBhIGNvbGxlY3Rpb24gb2YgY2hpbGRyZW4gYW5kIHZlcmlmaWVzIHRoYXQgdGhlcmVcbiAqIGlzIG9ubHkgb25lIGNoaWxkIGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbm9ubHlcbiAqXG4gKiBUaGUgY3VycmVudCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIGZ1bmN0aW9uIGFzc3VtZXMgdGhhdCBhIHNpbmdsZSBjaGlsZCBnZXRzXG4gKiBwYXNzZWQgd2l0aG91dCBhIHdyYXBwZXIsIGJ1dCB0aGUgcHVycG9zZSBvZiB0aGlzIGhlbHBlciBmdW5jdGlvbiBpcyB0b1xuICogYWJzdHJhY3QgYXdheSB0aGUgcGFydGljdWxhciBzdHJ1Y3R1cmUgb2YgY2hpbGRyZW4uXG4gKlxuICogQHBhcmFtIHs/b2JqZWN0fSBjaGlsZHJlbiBDaGlsZCBjb2xsZWN0aW9uIHN0cnVjdHVyZS5cbiAqIEByZXR1cm4ge1JlYWN0RWxlbWVudH0gVGhlIGZpcnN0IGFuZCBvbmx5IGBSZWFjdEVsZW1lbnRgIGNvbnRhaW5lZCBpbiB0aGVcbiAqIHN0cnVjdHVyZS5cbiAqL1xuXG5cbmZ1bmN0aW9uIG9ubHlDaGlsZChjaGlsZHJlbikge1xuICBpZiAoIWlzVmFsaWRFbGVtZW50KGNoaWxkcmVuKSkge1xuICAgIHtcbiAgICAgIHRocm93IEVycm9yKCBcIlJlYWN0LkNoaWxkcmVuLm9ubHkgZXhwZWN0ZWQgdG8gcmVjZWl2ZSBhIHNpbmdsZSBSZWFjdCBlbGVtZW50IGNoaWxkLlwiICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNoaWxkcmVuO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb250ZXh0KGRlZmF1bHRWYWx1ZSwgY2FsY3VsYXRlQ2hhbmdlZEJpdHMpIHtcbiAgaWYgKGNhbGN1bGF0ZUNoYW5nZWRCaXRzID09PSB1bmRlZmluZWQpIHtcbiAgICBjYWxjdWxhdGVDaGFuZ2VkQml0cyA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAge1xuICAgICAgaWYgKGNhbGN1bGF0ZUNoYW5nZWRCaXRzICE9PSBudWxsICYmIHR5cGVvZiBjYWxjdWxhdGVDaGFuZ2VkQml0cyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBlcnJvcignY3JlYXRlQ29udGV4dDogRXhwZWN0ZWQgdGhlIG9wdGlvbmFsIHNlY29uZCBhcmd1bWVudCB0byBiZSBhICcgKyAnZnVuY3Rpb24uIEluc3RlYWQgcmVjZWl2ZWQ6ICVzJywgY2FsY3VsYXRlQ2hhbmdlZEJpdHMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciBjb250ZXh0ID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9DT05URVhUX1RZUEUsXG4gICAgX2NhbGN1bGF0ZUNoYW5nZWRCaXRzOiBjYWxjdWxhdGVDaGFuZ2VkQml0cyxcbiAgICAvLyBBcyBhIHdvcmthcm91bmQgdG8gc3VwcG9ydCBtdWx0aXBsZSBjb25jdXJyZW50IHJlbmRlcmVycywgd2UgY2F0ZWdvcml6ZVxuICAgIC8vIHNvbWUgcmVuZGVyZXJzIGFzIHByaW1hcnkgYW5kIG90aGVycyBhcyBzZWNvbmRhcnkuIFdlIG9ubHkgZXhwZWN0XG4gICAgLy8gdGhlcmUgdG8gYmUgdHdvIGNvbmN1cnJlbnQgcmVuZGVyZXJzIGF0IG1vc3Q6IFJlYWN0IE5hdGl2ZSAocHJpbWFyeSkgYW5kXG4gICAgLy8gRmFicmljIChzZWNvbmRhcnkpOyBSZWFjdCBET00gKHByaW1hcnkpIGFuZCBSZWFjdCBBUlQgKHNlY29uZGFyeSkuXG4gICAgLy8gU2Vjb25kYXJ5IHJlbmRlcmVycyBzdG9yZSB0aGVpciBjb250ZXh0IHZhbHVlcyBvbiBzZXBhcmF0ZSBmaWVsZHMuXG4gICAgX2N1cnJlbnRWYWx1ZTogZGVmYXVsdFZhbHVlLFxuICAgIF9jdXJyZW50VmFsdWUyOiBkZWZhdWx0VmFsdWUsXG4gICAgLy8gVXNlZCB0byB0cmFjayBob3cgbWFueSBjb25jdXJyZW50IHJlbmRlcmVycyB0aGlzIGNvbnRleHQgY3VycmVudGx5XG4gICAgLy8gc3VwcG9ydHMgd2l0aGluIGluIGEgc2luZ2xlIHJlbmRlcmVyLiBTdWNoIGFzIHBhcmFsbGVsIHNlcnZlciByZW5kZXJpbmcuXG4gICAgX3RocmVhZENvdW50OiAwLFxuICAgIC8vIFRoZXNlIGFyZSBjaXJjdWxhclxuICAgIFByb3ZpZGVyOiBudWxsLFxuICAgIENvbnN1bWVyOiBudWxsXG4gIH07XG4gIGNvbnRleHQuUHJvdmlkZXIgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX1BST1ZJREVSX1RZUEUsXG4gICAgX2NvbnRleHQ6IGNvbnRleHRcbiAgfTtcbiAgdmFyIGhhc1dhcm5lZEFib3V0VXNpbmdOZXN0ZWRDb250ZXh0Q29uc3VtZXJzID0gZmFsc2U7XG4gIHZhciBoYXNXYXJuZWRBYm91dFVzaW5nQ29uc3VtZXJQcm92aWRlciA9IGZhbHNlO1xuICB2YXIgaGFzV2FybmVkQWJvdXREaXNwbGF5TmFtZU9uQ29uc3VtZXIgPSBmYWxzZTtcblxuICB7XG4gICAgLy8gQSBzZXBhcmF0ZSBvYmplY3QsIGJ1dCBwcm94aWVzIGJhY2sgdG8gdGhlIG9yaWdpbmFsIGNvbnRleHQgb2JqZWN0IGZvclxuICAgIC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LiBJdCBoYXMgYSBkaWZmZXJlbnQgJCR0eXBlb2YsIHNvIHdlIGNhbiBwcm9wZXJseVxuICAgIC8vIHdhcm4gZm9yIHRoZSBpbmNvcnJlY3QgdXNhZ2Ugb2YgQ29udGV4dCBhcyBhIENvbnN1bWVyLlxuICAgIHZhciBDb25zdW1lciA9IHtcbiAgICAgICQkdHlwZW9mOiBSRUFDVF9DT05URVhUX1RZUEUsXG4gICAgICBfY29udGV4dDogY29udGV4dCxcbiAgICAgIF9jYWxjdWxhdGVDaGFuZ2VkQml0czogY29udGV4dC5fY2FsY3VsYXRlQ2hhbmdlZEJpdHNcbiAgICB9OyAvLyAkRmxvd0ZpeE1lOiBGbG93IGNvbXBsYWlucyBhYm91dCBub3Qgc2V0dGluZyBhIHZhbHVlLCB3aGljaCBpcyBpbnRlbnRpb25hbCBoZXJlXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhDb25zdW1lciwge1xuICAgICAgUHJvdmlkZXI6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFoYXNXYXJuZWRBYm91dFVzaW5nQ29uc3VtZXJQcm92aWRlcikge1xuICAgICAgICAgICAgaGFzV2FybmVkQWJvdXRVc2luZ0NvbnN1bWVyUHJvdmlkZXIgPSB0cnVlO1xuXG4gICAgICAgICAgICBlcnJvcignUmVuZGVyaW5nIDxDb250ZXh0LkNvbnN1bWVyLlByb3ZpZGVyPiBpcyBub3Qgc3VwcG9ydGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gJyArICdhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiBEaWQgeW91IG1lYW4gdG8gcmVuZGVyIDxDb250ZXh0LlByb3ZpZGVyPiBpbnN0ZWFkPycpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBjb250ZXh0LlByb3ZpZGVyO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfUHJvdmlkZXIpIHtcbiAgICAgICAgICBjb250ZXh0LlByb3ZpZGVyID0gX1Byb3ZpZGVyO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX2N1cnJlbnRWYWx1ZToge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dC5fY3VycmVudFZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgY29udGV4dC5fY3VycmVudFZhbHVlID0gX2N1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF9jdXJyZW50VmFsdWUyOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0Ll9jdXJyZW50VmFsdWUyO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfY3VycmVudFZhbHVlMikge1xuICAgICAgICAgIGNvbnRleHQuX2N1cnJlbnRWYWx1ZTIgPSBfY3VycmVudFZhbHVlMjtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF90aHJlYWRDb3VudDoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dC5fdGhyZWFkQ291bnQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF90aHJlYWRDb3VudCkge1xuICAgICAgICAgIGNvbnRleHQuX3RocmVhZENvdW50ID0gX3RocmVhZENvdW50O1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgQ29uc3VtZXI6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFoYXNXYXJuZWRBYm91dFVzaW5nTmVzdGVkQ29udGV4dENvbnN1bWVycykge1xuICAgICAgICAgICAgaGFzV2FybmVkQWJvdXRVc2luZ05lc3RlZENvbnRleHRDb25zdW1lcnMgPSB0cnVlO1xuXG4gICAgICAgICAgICBlcnJvcignUmVuZGVyaW5nIDxDb250ZXh0LkNvbnN1bWVyLkNvbnN1bWVyPiBpcyBub3Qgc3VwcG9ydGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gJyArICdhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiBEaWQgeW91IG1lYW4gdG8gcmVuZGVyIDxDb250ZXh0LkNvbnN1bWVyPiBpbnN0ZWFkPycpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBjb250ZXh0LkNvbnN1bWVyO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGlzcGxheU5hbWU6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuZGlzcGxheU5hbWU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKGRpc3BsYXlOYW1lKSB7XG4gICAgICAgICAgaWYgKCFoYXNXYXJuZWRBYm91dERpc3BsYXlOYW1lT25Db25zdW1lcikge1xuICAgICAgICAgICAgd2FybignU2V0dGluZyBgZGlzcGxheU5hbWVgIG9uIENvbnRleHQuQ29uc3VtZXIgaGFzIG5vIGVmZmVjdC4gJyArIFwiWW91IHNob3VsZCBzZXQgaXQgZGlyZWN0bHkgb24gdGhlIGNvbnRleHQgd2l0aCBDb250ZXh0LmRpc3BsYXlOYW1lID0gJyVzJy5cIiwgZGlzcGxheU5hbWUpO1xuXG4gICAgICAgICAgICBoYXNXYXJuZWRBYm91dERpc3BsYXlOYW1lT25Db25zdW1lciA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7IC8vICRGbG93Rml4TWU6IEZsb3cgY29tcGxhaW5zIGFib3V0IG1pc3NpbmcgcHJvcGVydGllcyBiZWNhdXNlIGl0IGRvZXNuJ3QgdW5kZXJzdGFuZCBkZWZpbmVQcm9wZXJ0eVxuXG4gICAgY29udGV4dC5Db25zdW1lciA9IENvbnN1bWVyO1xuICB9XG5cbiAge1xuICAgIGNvbnRleHQuX2N1cnJlbnRSZW5kZXJlciA9IG51bGw7XG4gICAgY29udGV4dC5fY3VycmVudFJlbmRlcmVyMiA9IG51bGw7XG4gIH1cblxuICByZXR1cm4gY29udGV4dDtcbn1cblxudmFyIFVuaW5pdGlhbGl6ZWQgPSAtMTtcbnZhciBQZW5kaW5nID0gMDtcbnZhciBSZXNvbHZlZCA9IDE7XG52YXIgUmVqZWN0ZWQgPSAyO1xuXG5mdW5jdGlvbiBsYXp5SW5pdGlhbGl6ZXIocGF5bG9hZCkge1xuICBpZiAocGF5bG9hZC5fc3RhdHVzID09PSBVbmluaXRpYWxpemVkKSB7XG4gICAgdmFyIGN0b3IgPSBwYXlsb2FkLl9yZXN1bHQ7XG4gICAgdmFyIHRoZW5hYmxlID0gY3RvcigpOyAvLyBUcmFuc2l0aW9uIHRvIHRoZSBuZXh0IHN0YXRlLlxuXG4gICAgdmFyIHBlbmRpbmcgPSBwYXlsb2FkO1xuICAgIHBlbmRpbmcuX3N0YXR1cyA9IFBlbmRpbmc7XG4gICAgcGVuZGluZy5fcmVzdWx0ID0gdGhlbmFibGU7XG4gICAgdGhlbmFibGUudGhlbihmdW5jdGlvbiAobW9kdWxlT2JqZWN0KSB7XG4gICAgICBpZiAocGF5bG9hZC5fc3RhdHVzID09PSBQZW5kaW5nKSB7XG4gICAgICAgIHZhciBkZWZhdWx0RXhwb3J0ID0gbW9kdWxlT2JqZWN0LmRlZmF1bHQ7XG5cbiAgICAgICAge1xuICAgICAgICAgIGlmIChkZWZhdWx0RXhwb3J0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGVycm9yKCdsYXp5OiBFeHBlY3RlZCB0aGUgcmVzdWx0IG9mIGEgZHluYW1pYyBpbXBvcnQoKSBjYWxsLiAnICsgJ0luc3RlYWQgcmVjZWl2ZWQ6ICVzXFxuXFxuWW91ciBjb2RlIHNob3VsZCBsb29rIGxpa2U6IFxcbiAgJyArIC8vIEJyZWFrIHVwIGltcG9ydHMgdG8gYXZvaWQgYWNjaWRlbnRhbGx5IHBhcnNpbmcgdGhlbSBhcyBkZXBlbmRlbmNpZXMuXG4gICAgICAgICAgICAnY29uc3QgTXlDb21wb25lbnQgPSBsYXp5KCgpID0+IGltcCcgKyBcIm9ydCgnLi9NeUNvbXBvbmVudCcpKVwiLCBtb2R1bGVPYmplY3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSAvLyBUcmFuc2l0aW9uIHRvIHRoZSBuZXh0IHN0YXRlLlxuXG5cbiAgICAgICAgdmFyIHJlc29sdmVkID0gcGF5bG9hZDtcbiAgICAgICAgcmVzb2x2ZWQuX3N0YXR1cyA9IFJlc29sdmVkO1xuICAgICAgICByZXNvbHZlZC5fcmVzdWx0ID0gZGVmYXVsdEV4cG9ydDtcbiAgICAgIH1cbiAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGlmIChwYXlsb2FkLl9zdGF0dXMgPT09IFBlbmRpbmcpIHtcbiAgICAgICAgLy8gVHJhbnNpdGlvbiB0byB0aGUgbmV4dCBzdGF0ZS5cbiAgICAgICAgdmFyIHJlamVjdGVkID0gcGF5bG9hZDtcbiAgICAgICAgcmVqZWN0ZWQuX3N0YXR1cyA9IFJlamVjdGVkO1xuICAgICAgICByZWplY3RlZC5fcmVzdWx0ID0gZXJyb3I7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBpZiAocGF5bG9hZC5fc3RhdHVzID09PSBSZXNvbHZlZCkge1xuICAgIHJldHVybiBwYXlsb2FkLl9yZXN1bHQ7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgcGF5bG9hZC5fcmVzdWx0O1xuICB9XG59XG5cbmZ1bmN0aW9uIGxhenkoY3Rvcikge1xuICB2YXIgcGF5bG9hZCA9IHtcbiAgICAvLyBXZSB1c2UgdGhlc2UgZmllbGRzIHRvIHN0b3JlIHRoZSByZXN1bHQuXG4gICAgX3N0YXR1czogLTEsXG4gICAgX3Jlc3VsdDogY3RvclxuICB9O1xuICB2YXIgbGF6eVR5cGUgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0xBWllfVFlQRSxcbiAgICBfcGF5bG9hZDogcGF5bG9hZCxcbiAgICBfaW5pdDogbGF6eUluaXRpYWxpemVyXG4gIH07XG5cbiAge1xuICAgIC8vIEluIHByb2R1Y3Rpb24sIHRoaXMgd291bGQganVzdCBzZXQgaXQgb24gdGhlIG9iamVjdC5cbiAgICB2YXIgZGVmYXVsdFByb3BzO1xuICAgIHZhciBwcm9wVHlwZXM7IC8vICRGbG93Rml4TWVcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGxhenlUeXBlLCB7XG4gICAgICBkZWZhdWx0UHJvcHM6IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gZGVmYXVsdFByb3BzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdEZWZhdWx0UHJvcHMpIHtcbiAgICAgICAgICBlcnJvcignUmVhY3QubGF6eSguLi4pOiBJdCBpcyBub3Qgc3VwcG9ydGVkIHRvIGFzc2lnbiBgZGVmYXVsdFByb3BzYCB0byAnICsgJ2EgbGF6eSBjb21wb25lbnQgaW1wb3J0LiBFaXRoZXIgc3BlY2lmeSB0aGVtIHdoZXJlIHRoZSBjb21wb25lbnQgJyArICdpcyBkZWZpbmVkLCBvciBjcmVhdGUgYSB3cmFwcGluZyBjb21wb25lbnQgYXJvdW5kIGl0LicpO1xuXG4gICAgICAgICAgZGVmYXVsdFByb3BzID0gbmV3RGVmYXVsdFByb3BzOyAvLyBNYXRjaCBwcm9kdWN0aW9uIGJlaGF2aW9yIG1vcmUgY2xvc2VseTpcbiAgICAgICAgICAvLyAkRmxvd0ZpeE1lXG5cbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobGF6eVR5cGUsICdkZWZhdWx0UHJvcHMnLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcFR5cGVzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdQcm9wVHlwZXMpIHtcbiAgICAgICAgICBlcnJvcignUmVhY3QubGF6eSguLi4pOiBJdCBpcyBub3Qgc3VwcG9ydGVkIHRvIGFzc2lnbiBgcHJvcFR5cGVzYCB0byAnICsgJ2EgbGF6eSBjb21wb25lbnQgaW1wb3J0LiBFaXRoZXIgc3BlY2lmeSB0aGVtIHdoZXJlIHRoZSBjb21wb25lbnQgJyArICdpcyBkZWZpbmVkLCBvciBjcmVhdGUgYSB3cmFwcGluZyBjb21wb25lbnQgYXJvdW5kIGl0LicpO1xuXG4gICAgICAgICAgcHJvcFR5cGVzID0gbmV3UHJvcFR5cGVzOyAvLyBNYXRjaCBwcm9kdWN0aW9uIGJlaGF2aW9yIG1vcmUgY2xvc2VseTpcbiAgICAgICAgICAvLyAkRmxvd0ZpeE1lXG5cbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobGF6eVR5cGUsICdwcm9wVHlwZXMnLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBsYXp5VHlwZTtcbn1cblxuZnVuY3Rpb24gZm9yd2FyZFJlZihyZW5kZXIpIHtcbiAge1xuICAgIGlmIChyZW5kZXIgIT0gbnVsbCAmJiByZW5kZXIuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSkge1xuICAgICAgZXJyb3IoJ2ZvcndhcmRSZWYgcmVxdWlyZXMgYSByZW5kZXIgZnVuY3Rpb24gYnV0IHJlY2VpdmVkIGEgYG1lbW9gICcgKyAnY29tcG9uZW50LiBJbnN0ZWFkIG9mIGZvcndhcmRSZWYobWVtbyguLi4pKSwgdXNlICcgKyAnbWVtbyhmb3J3YXJkUmVmKC4uLikpLicpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlbmRlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZXJyb3IoJ2ZvcndhcmRSZWYgcmVxdWlyZXMgYSByZW5kZXIgZnVuY3Rpb24gYnV0IHdhcyBnaXZlbiAlcy4nLCByZW5kZXIgPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2YgcmVuZGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHJlbmRlci5sZW5ndGggIT09IDAgJiYgcmVuZGVyLmxlbmd0aCAhPT0gMikge1xuICAgICAgICBlcnJvcignZm9yd2FyZFJlZiByZW5kZXIgZnVuY3Rpb25zIGFjY2VwdCBleGFjdGx5IHR3byBwYXJhbWV0ZXJzOiBwcm9wcyBhbmQgcmVmLiAlcycsIHJlbmRlci5sZW5ndGggPT09IDEgPyAnRGlkIHlvdSBmb3JnZXQgdG8gdXNlIHRoZSByZWYgcGFyYW1ldGVyPycgOiAnQW55IGFkZGl0aW9uYWwgcGFyYW1ldGVyIHdpbGwgYmUgdW5kZWZpbmVkLicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZW5kZXIgIT0gbnVsbCkge1xuICAgICAgaWYgKHJlbmRlci5kZWZhdWx0UHJvcHMgIT0gbnVsbCB8fCByZW5kZXIucHJvcFR5cGVzICE9IG51bGwpIHtcbiAgICAgICAgZXJyb3IoJ2ZvcndhcmRSZWYgcmVuZGVyIGZ1bmN0aW9ucyBkbyBub3Qgc3VwcG9ydCBwcm9wVHlwZXMgb3IgZGVmYXVsdFByb3BzLiAnICsgJ0RpZCB5b3UgYWNjaWRlbnRhbGx5IHBhc3MgYSBSZWFjdCBjb21wb25lbnQ/Jyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFyIGVsZW1lbnRUeXBlID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFLFxuICAgIHJlbmRlcjogcmVuZGVyXG4gIH07XG5cbiAge1xuICAgIHZhciBvd25OYW1lO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50VHlwZSwgJ2Rpc3BsYXlOYW1lJywge1xuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG93bk5hbWU7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICBvd25OYW1lID0gbmFtZTtcblxuICAgICAgICBpZiAocmVuZGVyLmRpc3BsYXlOYW1lID09IG51bGwpIHtcbiAgICAgICAgICByZW5kZXIuZGlzcGxheU5hbWUgPSBuYW1lO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZWxlbWVudFR5cGU7XG59XG5cbi8vIEZpbHRlciBjZXJ0YWluIERPTSBhdHRyaWJ1dGVzIChlLmcuIHNyYywgaHJlZikgaWYgdGhlaXIgdmFsdWVzIGFyZSBlbXB0eSBzdHJpbmdzLlxuXG52YXIgZW5hYmxlU2NvcGVBUEkgPSBmYWxzZTsgLy8gRXhwZXJpbWVudGFsIENyZWF0ZSBFdmVudCBIYW5kbGUgQVBJLlxuXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSkge1xuICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gTm90ZTogdHlwZW9mIG1pZ2h0IGJlIG90aGVyIHRoYW4gJ3N5bWJvbCcgb3IgJ251bWJlcicgKGUuZy4gaWYgaXQncyBhIHBvbHlmaWxsKS5cblxuXG4gIGlmICh0eXBlID09PSBleHBvcnRzLkZyYWdtZW50IHx8IHR5cGUgPT09IGV4cG9ydHMuUHJvZmlsZXIgfHwgdHlwZSA9PT0gUkVBQ1RfREVCVUdfVFJBQ0lOR19NT0RFX1RZUEUgfHwgdHlwZSA9PT0gZXhwb3J0cy5TdHJpY3RNb2RlIHx8IHR5cGUgPT09IGV4cG9ydHMuU3VzcGVuc2UgfHwgdHlwZSA9PT0gUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX0xFR0FDWV9ISURERU5fVFlQRSB8fCBlbmFibGVTY29wZUFQSSApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gbnVsbCkge1xuICAgIGlmICh0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9MQVpZX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX1BST1ZJREVSX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfQ09OVEVYVF9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9CTE9DS19UWVBFIHx8IHR5cGVbMF0gPT09IFJFQUNUX1NFUlZFUl9CTE9DS19UWVBFKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIG1lbW8odHlwZSwgY29tcGFyZSkge1xuICB7XG4gICAgaWYgKCFpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSkpIHtcbiAgICAgIGVycm9yKCdtZW1vOiBUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIGNvbXBvbmVudC4gSW5zdGVhZCAnICsgJ3JlY2VpdmVkOiAlcycsIHR5cGUgPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2YgdHlwZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGVsZW1lbnRUeXBlID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9NRU1PX1RZUEUsXG4gICAgdHlwZTogdHlwZSxcbiAgICBjb21wYXJlOiBjb21wYXJlID09PSB1bmRlZmluZWQgPyBudWxsIDogY29tcGFyZVxuICB9O1xuXG4gIHtcbiAgICB2YXIgb3duTmFtZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudFR5cGUsICdkaXNwbGF5TmFtZScsIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBvd25OYW1lO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgb3duTmFtZSA9IG5hbWU7XG5cbiAgICAgICAgaWYgKHR5cGUuZGlzcGxheU5hbWUgPT0gbnVsbCkge1xuICAgICAgICAgIHR5cGUuZGlzcGxheU5hbWUgPSBuYW1lO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZWxlbWVudFR5cGU7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVEaXNwYXRjaGVyKCkge1xuICB2YXIgZGlzcGF0Y2hlciA9IFJlYWN0Q3VycmVudERpc3BhdGNoZXIuY3VycmVudDtcblxuICBpZiAoIShkaXNwYXRjaGVyICE9PSBudWxsKSkge1xuICAgIHtcbiAgICAgIHRocm93IEVycm9yKCBcIkludmFsaWQgaG9vayBjYWxsLiBIb29rcyBjYW4gb25seSBiZSBjYWxsZWQgaW5zaWRlIG9mIHRoZSBib2R5IG9mIGEgZnVuY3Rpb24gY29tcG9uZW50LiBUaGlzIGNvdWxkIGhhcHBlbiBmb3Igb25lIG9mIHRoZSBmb2xsb3dpbmcgcmVhc29uczpcXG4xLiBZb3UgbWlnaHQgaGF2ZSBtaXNtYXRjaGluZyB2ZXJzaW9ucyBvZiBSZWFjdCBhbmQgdGhlIHJlbmRlcmVyIChzdWNoIGFzIFJlYWN0IERPTSlcXG4yLiBZb3UgbWlnaHQgYmUgYnJlYWtpbmcgdGhlIFJ1bGVzIG9mIEhvb2tzXFxuMy4gWW91IG1pZ2h0IGhhdmUgbW9yZSB0aGFuIG9uZSBjb3B5IG9mIFJlYWN0IGluIHRoZSBzYW1lIGFwcFxcblNlZSBodHRwczovL3JlYWN0anMub3JnL2xpbmsvaW52YWxpZC1ob29rLWNhbGwgZm9yIHRpcHMgYWJvdXQgaG93IHRvIGRlYnVnIGFuZCBmaXggdGhpcyBwcm9ibGVtLlwiICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRpc3BhdGNoZXI7XG59XG5cbmZ1bmN0aW9uIHVzZUNvbnRleHQoQ29udGV4dCwgdW5zdGFibGVfb2JzZXJ2ZWRCaXRzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcblxuICB7XG4gICAgaWYgKHVuc3RhYmxlX29ic2VydmVkQml0cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvcigndXNlQ29udGV4dCgpIHNlY29uZCBhcmd1bWVudCBpcyByZXNlcnZlZCBmb3IgZnV0dXJlICcgKyAndXNlIGluIFJlYWN0LiBQYXNzaW5nIGl0IGlzIG5vdCBzdXBwb3J0ZWQuICcgKyAnWW91IHBhc3NlZDogJXMuJXMnLCB1bnN0YWJsZV9vYnNlcnZlZEJpdHMsIHR5cGVvZiB1bnN0YWJsZV9vYnNlcnZlZEJpdHMgPT09ICdudW1iZXInICYmIEFycmF5LmlzQXJyYXkoYXJndW1lbnRzWzJdKSA/ICdcXG5cXG5EaWQgeW91IGNhbGwgYXJyYXkubWFwKHVzZUNvbnRleHQpPyAnICsgJ0NhbGxpbmcgSG9va3MgaW5zaWRlIGEgbG9vcCBpcyBub3Qgc3VwcG9ydGVkLiAnICsgJ0xlYXJuIG1vcmUgYXQgaHR0cHM6Ly9yZWFjdGpzLm9yZy9saW5rL3J1bGVzLW9mLWhvb2tzJyA6ICcnKTtcbiAgICB9IC8vIFRPRE86IGFkZCBhIG1vcmUgZ2VuZXJpYyB3YXJuaW5nIGZvciBpbnZhbGlkIHZhbHVlcy5cblxuXG4gICAgaWYgKENvbnRleHQuX2NvbnRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHJlYWxDb250ZXh0ID0gQ29udGV4dC5fY29udGV4dDsgLy8gRG9uJ3QgZGVkdXBsaWNhdGUgYmVjYXVzZSB0aGlzIGxlZ2l0aW1hdGVseSBjYXVzZXMgYnVnc1xuICAgICAgLy8gYW5kIG5vYm9keSBzaG91bGQgYmUgdXNpbmcgdGhpcyBpbiBleGlzdGluZyBjb2RlLlxuXG4gICAgICBpZiAocmVhbENvbnRleHQuQ29uc3VtZXIgPT09IENvbnRleHQpIHtcbiAgICAgICAgZXJyb3IoJ0NhbGxpbmcgdXNlQ29udGV4dChDb250ZXh0LkNvbnN1bWVyKSBpcyBub3Qgc3VwcG9ydGVkLCBtYXkgY2F1c2UgYnVncywgYW5kIHdpbGwgYmUgJyArICdyZW1vdmVkIGluIGEgZnV0dXJlIG1ham9yIHJlbGVhc2UuIERpZCB5b3UgbWVhbiB0byBjYWxsIHVzZUNvbnRleHQoQ29udGV4dCkgaW5zdGVhZD8nKTtcbiAgICAgIH0gZWxzZSBpZiAocmVhbENvbnRleHQuUHJvdmlkZXIgPT09IENvbnRleHQpIHtcbiAgICAgICAgZXJyb3IoJ0NhbGxpbmcgdXNlQ29udGV4dChDb250ZXh0LlByb3ZpZGVyKSBpcyBub3Qgc3VwcG9ydGVkLiAnICsgJ0RpZCB5b3UgbWVhbiB0byBjYWxsIHVzZUNvbnRleHQoQ29udGV4dCkgaW5zdGVhZD8nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGlzcGF0Y2hlci51c2VDb250ZXh0KENvbnRleHQsIHVuc3RhYmxlX29ic2VydmVkQml0cyk7XG59XG5mdW5jdGlvbiB1c2VTdGF0ZShpbml0aWFsU3RhdGUpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VTdGF0ZShpbml0aWFsU3RhdGUpO1xufVxuZnVuY3Rpb24gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsQXJnLCBpbml0KSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsQXJnLCBpbml0KTtcbn1cbmZ1bmN0aW9uIHVzZVJlZihpbml0aWFsVmFsdWUpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VSZWYoaW5pdGlhbFZhbHVlKTtcbn1cbmZ1bmN0aW9uIHVzZUVmZmVjdChjcmVhdGUsIGRlcHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VFZmZlY3QoY3JlYXRlLCBkZXBzKTtcbn1cbmZ1bmN0aW9uIHVzZUxheW91dEVmZmVjdChjcmVhdGUsIGRlcHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VMYXlvdXRFZmZlY3QoY3JlYXRlLCBkZXBzKTtcbn1cbmZ1bmN0aW9uIHVzZUNhbGxiYWNrKGNhbGxiYWNrLCBkZXBzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlQ2FsbGJhY2soY2FsbGJhY2ssIGRlcHMpO1xufVxuZnVuY3Rpb24gdXNlTWVtbyhjcmVhdGUsIGRlcHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VNZW1vKGNyZWF0ZSwgZGVwcyk7XG59XG5mdW5jdGlvbiB1c2VJbXBlcmF0aXZlSGFuZGxlKHJlZiwgY3JlYXRlLCBkZXBzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlSW1wZXJhdGl2ZUhhbmRsZShyZWYsIGNyZWF0ZSwgZGVwcyk7XG59XG5mdW5jdGlvbiB1c2VEZWJ1Z1ZhbHVlKHZhbHVlLCBmb3JtYXR0ZXJGbikge1xuICB7XG4gICAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICAgIHJldHVybiBkaXNwYXRjaGVyLnVzZURlYnVnVmFsdWUodmFsdWUsIGZvcm1hdHRlckZuKTtcbiAgfVxufVxuXG4vLyBIZWxwZXJzIHRvIHBhdGNoIGNvbnNvbGUubG9ncyB0byBhdm9pZCBsb2dnaW5nIGR1cmluZyBzaWRlLWVmZmVjdCBmcmVlXG4vLyByZXBsYXlpbmcgb24gcmVuZGVyIGZ1bmN0aW9uLiBUaGlzIGN1cnJlbnRseSBvbmx5IHBhdGNoZXMgdGhlIG9iamVjdFxuLy8gbGF6aWx5IHdoaWNoIHdvbid0IGNvdmVyIGlmIHRoZSBsb2cgZnVuY3Rpb24gd2FzIGV4dHJhY3RlZCBlYWdlcmx5LlxuLy8gV2UgY291bGQgYWxzbyBlYWdlcmx5IHBhdGNoIHRoZSBtZXRob2QuXG52YXIgZGlzYWJsZWREZXB0aCA9IDA7XG52YXIgcHJldkxvZztcbnZhciBwcmV2SW5mbztcbnZhciBwcmV2V2FybjtcbnZhciBwcmV2RXJyb3I7XG52YXIgcHJldkdyb3VwO1xudmFyIHByZXZHcm91cENvbGxhcHNlZDtcbnZhciBwcmV2R3JvdXBFbmQ7XG5cbmZ1bmN0aW9uIGRpc2FibGVkTG9nKCkge31cblxuZGlzYWJsZWRMb2cuX19yZWFjdERpc2FibGVkTG9nID0gdHJ1ZTtcbmZ1bmN0aW9uIGRpc2FibGVMb2dzKCkge1xuICB7XG4gICAgaWYgKGRpc2FibGVkRGVwdGggPT09IDApIHtcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIHJlYWN0LWludGVybmFsL25vLXByb2R1Y3Rpb24tbG9nZ2luZyAqL1xuICAgICAgcHJldkxvZyA9IGNvbnNvbGUubG9nO1xuICAgICAgcHJldkluZm8gPSBjb25zb2xlLmluZm87XG4gICAgICBwcmV2V2FybiA9IGNvbnNvbGUud2FybjtcbiAgICAgIHByZXZFcnJvciA9IGNvbnNvbGUuZXJyb3I7XG4gICAgICBwcmV2R3JvdXAgPSBjb25zb2xlLmdyb3VwO1xuICAgICAgcHJldkdyb3VwQ29sbGFwc2VkID0gY29uc29sZS5ncm91cENvbGxhcHNlZDtcbiAgICAgIHByZXZHcm91cEVuZCA9IGNvbnNvbGUuZ3JvdXBFbmQ7IC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvMTkwOTlcblxuICAgICAgdmFyIHByb3BzID0ge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiBkaXNhYmxlZExvZyxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH07IC8vICRGbG93Rml4TWUgRmxvdyB0aGlua3MgY29uc29sZSBpcyBpbW11dGFibGUuXG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGNvbnNvbGUsIHtcbiAgICAgICAgaW5mbzogcHJvcHMsXG4gICAgICAgIGxvZzogcHJvcHMsXG4gICAgICAgIHdhcm46IHByb3BzLFxuICAgICAgICBlcnJvcjogcHJvcHMsXG4gICAgICAgIGdyb3VwOiBwcm9wcyxcbiAgICAgICAgZ3JvdXBDb2xsYXBzZWQ6IHByb3BzLFxuICAgICAgICBncm91cEVuZDogcHJvcHNcbiAgICAgIH0pO1xuICAgICAgLyogZXNsaW50LWVuYWJsZSByZWFjdC1pbnRlcm5hbC9uby1wcm9kdWN0aW9uLWxvZ2dpbmcgKi9cbiAgICB9XG5cbiAgICBkaXNhYmxlZERlcHRoKys7XG4gIH1cbn1cbmZ1bmN0aW9uIHJlZW5hYmxlTG9ncygpIHtcbiAge1xuICAgIGRpc2FibGVkRGVwdGgtLTtcblxuICAgIGlmIChkaXNhYmxlZERlcHRoID09PSAwKSB7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSByZWFjdC1pbnRlcm5hbC9uby1wcm9kdWN0aW9uLWxvZ2dpbmcgKi9cbiAgICAgIHZhciBwcm9wcyA9IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfTsgLy8gJEZsb3dGaXhNZSBGbG93IHRoaW5rcyBjb25zb2xlIGlzIGltbXV0YWJsZS5cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoY29uc29sZSwge1xuICAgICAgICBsb2c6IF9hc3NpZ24oe30sIHByb3BzLCB7XG4gICAgICAgICAgdmFsdWU6IHByZXZMb2dcbiAgICAgICAgfSksXG4gICAgICAgIGluZm86IF9hc3NpZ24oe30sIHByb3BzLCB7XG4gICAgICAgICAgdmFsdWU6IHByZXZJbmZvXG4gICAgICAgIH0pLFxuICAgICAgICB3YXJuOiBfYXNzaWduKHt9LCBwcm9wcywge1xuICAgICAgICAgIHZhbHVlOiBwcmV2V2FyblxuICAgICAgICB9KSxcbiAgICAgICAgZXJyb3I6IF9hc3NpZ24oe30sIHByb3BzLCB7XG4gICAgICAgICAgdmFsdWU6IHByZXZFcnJvclxuICAgICAgICB9KSxcbiAgICAgICAgZ3JvdXA6IF9hc3NpZ24oe30sIHByb3BzLCB7XG4gICAgICAgICAgdmFsdWU6IHByZXZHcm91cFxuICAgICAgICB9KSxcbiAgICAgICAgZ3JvdXBDb2xsYXBzZWQ6IF9hc3NpZ24oe30sIHByb3BzLCB7XG4gICAgICAgICAgdmFsdWU6IHByZXZHcm91cENvbGxhcHNlZFxuICAgICAgICB9KSxcbiAgICAgICAgZ3JvdXBFbmQ6IF9hc3NpZ24oe30sIHByb3BzLCB7XG4gICAgICAgICAgdmFsdWU6IHByZXZHcm91cEVuZFxuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIHJlYWN0LWludGVybmFsL25vLXByb2R1Y3Rpb24tbG9nZ2luZyAqL1xuICAgIH1cblxuICAgIGlmIChkaXNhYmxlZERlcHRoIDwgMCkge1xuICAgICAgZXJyb3IoJ2Rpc2FibGVkRGVwdGggZmVsbCBiZWxvdyB6ZXJvLiAnICsgJ1RoaXMgaXMgYSBidWcgaW4gUmVhY3QuIFBsZWFzZSBmaWxlIGFuIGlzc3VlLicpO1xuICAgIH1cbiAgfVxufVxuXG52YXIgUmVhY3RDdXJyZW50RGlzcGF0Y2hlciQxID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuUmVhY3RDdXJyZW50RGlzcGF0Y2hlcjtcbnZhciBwcmVmaXg7XG5mdW5jdGlvbiBkZXNjcmliZUJ1aWx0SW5Db21wb25lbnRGcmFtZShuYW1lLCBzb3VyY2UsIG93bmVyRm4pIHtcbiAge1xuICAgIGlmIChwcmVmaXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gRXh0cmFjdCB0aGUgVk0gc3BlY2lmaWMgcHJlZml4IHVzZWQgYnkgZWFjaCBsaW5lLlxuICAgICAgdHJ5IHtcbiAgICAgICAgdGhyb3cgRXJyb3IoKTtcbiAgICAgIH0gY2F0Y2ggKHgpIHtcbiAgICAgICAgdmFyIG1hdGNoID0geC5zdGFjay50cmltKCkubWF0Y2goL1xcbiggKihhdCApPykvKTtcbiAgICAgICAgcHJlZml4ID0gbWF0Y2ggJiYgbWF0Y2hbMV0gfHwgJyc7XG4gICAgICB9XG4gICAgfSAvLyBXZSB1c2UgdGhlIHByZWZpeCB0byBlbnN1cmUgb3VyIHN0YWNrcyBsaW5lIHVwIHdpdGggbmF0aXZlIHN0YWNrIGZyYW1lcy5cblxuXG4gICAgcmV0dXJuICdcXG4nICsgcHJlZml4ICsgbmFtZTtcbiAgfVxufVxudmFyIHJlZW50cnkgPSBmYWxzZTtcbnZhciBjb21wb25lbnRGcmFtZUNhY2hlO1xuXG57XG4gIHZhciBQb3NzaWJseVdlYWtNYXAgPSB0eXBlb2YgV2Vha01hcCA9PT0gJ2Z1bmN0aW9uJyA/IFdlYWtNYXAgOiBNYXA7XG4gIGNvbXBvbmVudEZyYW1lQ2FjaGUgPSBuZXcgUG9zc2libHlXZWFrTWFwKCk7XG59XG5cbmZ1bmN0aW9uIGRlc2NyaWJlTmF0aXZlQ29tcG9uZW50RnJhbWUoZm4sIGNvbnN0cnVjdCkge1xuICAvLyBJZiBzb21ldGhpbmcgYXNrZWQgZm9yIGEgc3RhY2sgaW5zaWRlIGEgZmFrZSByZW5kZXIsIGl0IHNob3VsZCBnZXQgaWdub3JlZC5cbiAgaWYgKCFmbiB8fCByZWVudHJ5KSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAge1xuICAgIHZhciBmcmFtZSA9IGNvbXBvbmVudEZyYW1lQ2FjaGUuZ2V0KGZuKTtcblxuICAgIGlmIChmcmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZnJhbWU7XG4gICAgfVxuICB9XG5cbiAgdmFyIGNvbnRyb2w7XG4gIHJlZW50cnkgPSB0cnVlO1xuICB2YXIgcHJldmlvdXNQcmVwYXJlU3RhY2tUcmFjZSA9IEVycm9yLnByZXBhcmVTdGFja1RyYWNlOyAvLyAkRmxvd0ZpeE1lIEl0IGRvZXMgYWNjZXB0IHVuZGVmaW5lZC5cblxuICBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZSA9IHVuZGVmaW5lZDtcbiAgdmFyIHByZXZpb3VzRGlzcGF0Y2hlcjtcblxuICB7XG4gICAgcHJldmlvdXNEaXNwYXRjaGVyID0gUmVhY3RDdXJyZW50RGlzcGF0Y2hlciQxLmN1cnJlbnQ7IC8vIFNldCB0aGUgZGlzcGF0Y2hlciBpbiBERVYgYmVjYXVzZSB0aGlzIG1pZ2h0IGJlIGNhbGwgaW4gdGhlIHJlbmRlciBmdW5jdGlvblxuICAgIC8vIGZvciB3YXJuaW5ncy5cblxuICAgIFJlYWN0Q3VycmVudERpc3BhdGNoZXIkMS5jdXJyZW50ID0gbnVsbDtcbiAgICBkaXNhYmxlTG9ncygpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyBUaGlzIHNob3VsZCB0aHJvdy5cbiAgICBpZiAoY29uc3RydWN0KSB7XG4gICAgICAvLyBTb21ldGhpbmcgc2hvdWxkIGJlIHNldHRpbmcgdGhlIHByb3BzIGluIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICAgIHZhciBGYWtlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aHJvdyBFcnJvcigpO1xuICAgICAgfTsgLy8gJEZsb3dGaXhNZVxuXG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGYWtlLnByb3RvdHlwZSwgJ3Byb3BzJywge1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBXZSB1c2UgYSB0aHJvd2luZyBzZXR0ZXIgaW5zdGVhZCBvZiBmcm96ZW4gb3Igbm9uLXdyaXRhYmxlIHByb3BzXG4gICAgICAgICAgLy8gYmVjYXVzZSB0aGF0IHdvbid0IHRocm93IGluIGEgbm9uLXN0cmljdCBtb2RlIGZ1bmN0aW9uLlxuICAgICAgICAgIHRocm93IEVycm9yKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09ICdvYmplY3QnICYmIFJlZmxlY3QuY29uc3RydWN0KSB7XG4gICAgICAgIC8vIFdlIGNvbnN0cnVjdCBhIGRpZmZlcmVudCBjb250cm9sIGZvciB0aGlzIGNhc2UgdG8gaW5jbHVkZSBhbnkgZXh0cmFcbiAgICAgICAgLy8gZnJhbWVzIGFkZGVkIGJ5IHRoZSBjb25zdHJ1Y3QgY2FsbC5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBSZWZsZWN0LmNvbnN0cnVjdChGYWtlLCBbXSk7XG4gICAgICAgIH0gY2F0Y2ggKHgpIHtcbiAgICAgICAgICBjb250cm9sID0geDtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlZmxlY3QuY29uc3RydWN0KGZuLCBbXSwgRmFrZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIEZha2UuY2FsbCgpO1xuICAgICAgICB9IGNhdGNoICh4KSB7XG4gICAgICAgICAgY29udHJvbCA9IHg7XG4gICAgICAgIH1cblxuICAgICAgICBmbi5jYWxsKEZha2UucHJvdG90eXBlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhyb3cgRXJyb3IoKTtcbiAgICAgIH0gY2F0Y2ggKHgpIHtcbiAgICAgICAgY29udHJvbCA9IHg7XG4gICAgICB9XG5cbiAgICAgIGZuKCk7XG4gICAgfVxuICB9IGNhdGNoIChzYW1wbGUpIHtcbiAgICAvLyBUaGlzIGlzIGlubGluZWQgbWFudWFsbHkgYmVjYXVzZSBjbG9zdXJlIGRvZXNuJ3QgZG8gaXQgZm9yIHVzLlxuICAgIGlmIChzYW1wbGUgJiYgY29udHJvbCAmJiB0eXBlb2Ygc2FtcGxlLnN0YWNrID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gVGhpcyBleHRyYWN0cyB0aGUgZmlyc3QgZnJhbWUgZnJvbSB0aGUgc2FtcGxlIHRoYXQgaXNuJ3QgYWxzbyBpbiB0aGUgY29udHJvbC5cbiAgICAgIC8vIFNraXBwaW5nIG9uZSBmcmFtZSB0aGF0IHdlIGFzc3VtZSBpcyB0aGUgZnJhbWUgdGhhdCBjYWxscyB0aGUgdHdvLlxuICAgICAgdmFyIHNhbXBsZUxpbmVzID0gc2FtcGxlLnN0YWNrLnNwbGl0KCdcXG4nKTtcbiAgICAgIHZhciBjb250cm9sTGluZXMgPSBjb250cm9sLnN0YWNrLnNwbGl0KCdcXG4nKTtcbiAgICAgIHZhciBzID0gc2FtcGxlTGluZXMubGVuZ3RoIC0gMTtcbiAgICAgIHZhciBjID0gY29udHJvbExpbmVzLmxlbmd0aCAtIDE7XG5cbiAgICAgIHdoaWxlIChzID49IDEgJiYgYyA+PSAwICYmIHNhbXBsZUxpbmVzW3NdICE9PSBjb250cm9sTGluZXNbY10pIHtcbiAgICAgICAgLy8gV2UgZXhwZWN0IGF0IGxlYXN0IG9uZSBzdGFjayBmcmFtZSB0byBiZSBzaGFyZWQuXG4gICAgICAgIC8vIFR5cGljYWxseSB0aGlzIHdpbGwgYmUgdGhlIHJvb3QgbW9zdCBvbmUuIEhvd2V2ZXIsIHN0YWNrIGZyYW1lcyBtYXkgYmVcbiAgICAgICAgLy8gY3V0IG9mZiBkdWUgdG8gbWF4aW11bSBzdGFjayBsaW1pdHMuIEluIHRoaXMgY2FzZSwgb25lIG1heWJlIGN1dCBvZmZcbiAgICAgICAgLy8gZWFybGllciB0aGFuIHRoZSBvdGhlci4gV2UgYXNzdW1lIHRoYXQgdGhlIHNhbXBsZSBpcyBsb25nZXIgb3IgdGhlIHNhbWVcbiAgICAgICAgLy8gYW5kIHRoZXJlIGZvciBjdXQgb2ZmIGVhcmxpZXIuIFNvIHdlIHNob3VsZCBmaW5kIHRoZSByb290IG1vc3QgZnJhbWUgaW5cbiAgICAgICAgLy8gdGhlIHNhbXBsZSBzb21ld2hlcmUgaW4gdGhlIGNvbnRyb2wuXG4gICAgICAgIGMtLTtcbiAgICAgIH1cblxuICAgICAgZm9yICg7IHMgPj0gMSAmJiBjID49IDA7IHMtLSwgYy0tKSB7XG4gICAgICAgIC8vIE5leHQgd2UgZmluZCB0aGUgZmlyc3Qgb25lIHRoYXQgaXNuJ3QgdGhlIHNhbWUgd2hpY2ggc2hvdWxkIGJlIHRoZVxuICAgICAgICAvLyBmcmFtZSB0aGF0IGNhbGxlZCBvdXIgc2FtcGxlIGZ1bmN0aW9uIGFuZCB0aGUgY29udHJvbC5cbiAgICAgICAgaWYgKHNhbXBsZUxpbmVzW3NdICE9PSBjb250cm9sTGluZXNbY10pIHtcbiAgICAgICAgICAvLyBJbiBWOCwgdGhlIGZpcnN0IGxpbmUgaXMgZGVzY3JpYmluZyB0aGUgbWVzc2FnZSBidXQgb3RoZXIgVk1zIGRvbid0LlxuICAgICAgICAgIC8vIElmIHdlJ3JlIGFib3V0IHRvIHJldHVybiB0aGUgZmlyc3QgbGluZSwgYW5kIHRoZSBjb250cm9sIGlzIGFsc28gb24gdGhlIHNhbWVcbiAgICAgICAgICAvLyBsaW5lLCB0aGF0J3MgYSBwcmV0dHkgZ29vZCBpbmRpY2F0b3IgdGhhdCBvdXIgc2FtcGxlIHRocmV3IGF0IHNhbWUgbGluZSBhc1xuICAgICAgICAgIC8vIHRoZSBjb250cm9sLiBJLmUuIGJlZm9yZSB3ZSBlbnRlcmVkIHRoZSBzYW1wbGUgZnJhbWUuIFNvIHdlIGlnbm9yZSB0aGlzIHJlc3VsdC5cbiAgICAgICAgICAvLyBUaGlzIGNhbiBoYXBwZW4gaWYgeW91IHBhc3NlZCBhIGNsYXNzIHRvIGZ1bmN0aW9uIGNvbXBvbmVudCwgb3Igbm9uLWZ1bmN0aW9uLlxuICAgICAgICAgIGlmIChzICE9PSAxIHx8IGMgIT09IDEpIHtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgcy0tO1xuICAgICAgICAgICAgICBjLS07IC8vIFdlIG1heSBzdGlsbCBoYXZlIHNpbWlsYXIgaW50ZXJtZWRpYXRlIGZyYW1lcyBmcm9tIHRoZSBjb25zdHJ1Y3QgY2FsbC5cbiAgICAgICAgICAgICAgLy8gVGhlIG5leHQgb25lIHRoYXQgaXNuJ3QgdGhlIHNhbWUgc2hvdWxkIGJlIG91ciBtYXRjaCB0aG91Z2guXG5cbiAgICAgICAgICAgICAgaWYgKGMgPCAwIHx8IHNhbXBsZUxpbmVzW3NdICE9PSBjb250cm9sTGluZXNbY10pIHtcbiAgICAgICAgICAgICAgICAvLyBWOCBhZGRzIGEgXCJuZXdcIiBwcmVmaXggZm9yIG5hdGl2ZSBjbGFzc2VzLiBMZXQncyByZW1vdmUgaXQgdG8gbWFrZSBpdCBwcmV0dGllci5cbiAgICAgICAgICAgICAgICB2YXIgX2ZyYW1lID0gJ1xcbicgKyBzYW1wbGVMaW5lc1tzXS5yZXBsYWNlKCcgYXQgbmV3ICcsICcgYXQgJyk7XG5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudEZyYW1lQ2FjaGUuc2V0KGZuLCBfZnJhbWUpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gLy8gUmV0dXJuIHRoZSBsaW5lIHdlIGZvdW5kLlxuXG5cbiAgICAgICAgICAgICAgICByZXR1cm4gX2ZyYW1lO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlIChzID49IDEgJiYgYyA+PSAwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICByZWVudHJ5ID0gZmFsc2U7XG5cbiAgICB7XG4gICAgICBSZWFjdEN1cnJlbnREaXNwYXRjaGVyJDEuY3VycmVudCA9IHByZXZpb3VzRGlzcGF0Y2hlcjtcbiAgICAgIHJlZW5hYmxlTG9ncygpO1xuICAgIH1cblxuICAgIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gcHJldmlvdXNQcmVwYXJlU3RhY2tUcmFjZTtcbiAgfSAvLyBGYWxsYmFjayB0byBqdXN0IHVzaW5nIHRoZSBuYW1lIGlmIHdlIGNvdWxkbid0IG1ha2UgaXQgdGhyb3cuXG5cblxuICB2YXIgbmFtZSA9IGZuID8gZm4uZGlzcGxheU5hbWUgfHwgZm4ubmFtZSA6ICcnO1xuICB2YXIgc3ludGhldGljRnJhbWUgPSBuYW1lID8gZGVzY3JpYmVCdWlsdEluQ29tcG9uZW50RnJhbWUobmFtZSkgOiAnJztcblxuICB7XG4gICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29tcG9uZW50RnJhbWVDYWNoZS5zZXQoZm4sIHN5bnRoZXRpY0ZyYW1lKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3ludGhldGljRnJhbWU7XG59XG5mdW5jdGlvbiBkZXNjcmliZUZ1bmN0aW9uQ29tcG9uZW50RnJhbWUoZm4sIHNvdXJjZSwgb3duZXJGbikge1xuICB7XG4gICAgcmV0dXJuIGRlc2NyaWJlTmF0aXZlQ29tcG9uZW50RnJhbWUoZm4sIGZhbHNlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzaG91bGRDb25zdHJ1Y3QoQ29tcG9uZW50KSB7XG4gIHZhciBwcm90b3R5cGUgPSBDb21wb25lbnQucHJvdG90eXBlO1xuICByZXR1cm4gISEocHJvdG90eXBlICYmIHByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50KTtcbn1cblxuZnVuY3Rpb24gZGVzY3JpYmVVbmtub3duRWxlbWVudFR5cGVGcmFtZUluREVWKHR5cGUsIHNvdXJjZSwgb3duZXJGbikge1xuXG4gIGlmICh0eXBlID09IG51bGwpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICB7XG4gICAgICByZXR1cm4gZGVzY3JpYmVOYXRpdmVDb21wb25lbnRGcmFtZSh0eXBlLCBzaG91bGRDb25zdHJ1Y3QodHlwZSkpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZGVzY3JpYmVCdWlsdEluQ29tcG9uZW50RnJhbWUodHlwZSk7XG4gIH1cblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIGV4cG9ydHMuU3VzcGVuc2U6XG4gICAgICByZXR1cm4gZGVzY3JpYmVCdWlsdEluQ29tcG9uZW50RnJhbWUoJ1N1c3BlbnNlJyk7XG5cbiAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRTpcbiAgICAgIHJldHVybiBkZXNjcmliZUJ1aWx0SW5Db21wb25lbnRGcmFtZSgnU3VzcGVuc2VMaXN0Jyk7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgc3dpdGNoICh0eXBlLiQkdHlwZW9mKSB7XG4gICAgICBjYXNlIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU6XG4gICAgICAgIHJldHVybiBkZXNjcmliZUZ1bmN0aW9uQ29tcG9uZW50RnJhbWUodHlwZS5yZW5kZXIpO1xuXG4gICAgICBjYXNlIFJFQUNUX01FTU9fVFlQRTpcbiAgICAgICAgLy8gTWVtbyBtYXkgY29udGFpbiBhbnkgY29tcG9uZW50IHR5cGUgc28gd2UgcmVjdXJzaXZlbHkgcmVzb2x2ZSBpdC5cbiAgICAgICAgcmV0dXJuIGRlc2NyaWJlVW5rbm93bkVsZW1lbnRUeXBlRnJhbWVJbkRFVih0eXBlLnR5cGUsIHNvdXJjZSwgb3duZXJGbik7XG5cbiAgICAgIGNhc2UgUkVBQ1RfQkxPQ0tfVFlQRTpcbiAgICAgICAgcmV0dXJuIGRlc2NyaWJlRnVuY3Rpb25Db21wb25lbnRGcmFtZSh0eXBlLl9yZW5kZXIpO1xuXG4gICAgICBjYXNlIFJFQUNUX0xBWllfVFlQRTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciBsYXp5Q29tcG9uZW50ID0gdHlwZTtcbiAgICAgICAgICB2YXIgcGF5bG9hZCA9IGxhenlDb21wb25lbnQuX3BheWxvYWQ7XG4gICAgICAgICAgdmFyIGluaXQgPSBsYXp5Q29tcG9uZW50Ll9pbml0O1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIExhenkgbWF5IGNvbnRhaW4gYW55IGNvbXBvbmVudCB0eXBlIHNvIHdlIHJlY3Vyc2l2ZWx5IHJlc29sdmUgaXQuXG4gICAgICAgICAgICByZXR1cm4gZGVzY3JpYmVVbmtub3duRWxlbWVudFR5cGVGcmFtZUluREVWKGluaXQocGF5bG9hZCksIHNvdXJjZSwgb3duZXJGbik7XG4gICAgICAgICAgfSBjYXRjaCAoeCkge31cbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAnJztcbn1cblxudmFyIGxvZ2dlZFR5cGVGYWlsdXJlcyA9IHt9O1xudmFyIFJlYWN0RGVidWdDdXJyZW50RnJhbWUkMSA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLlJlYWN0RGVidWdDdXJyZW50RnJhbWU7XG5cbmZ1bmN0aW9uIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGVsZW1lbnQpIHtcbiAge1xuICAgIGlmIChlbGVtZW50KSB7XG4gICAgICB2YXIgb3duZXIgPSBlbGVtZW50Ll9vd25lcjtcbiAgICAgIHZhciBzdGFjayA9IGRlc2NyaWJlVW5rbm93bkVsZW1lbnRUeXBlRnJhbWVJbkRFVihlbGVtZW50LnR5cGUsIGVsZW1lbnQuX3NvdXJjZSwgb3duZXIgPyBvd25lci50eXBlIDogbnVsbCk7XG4gICAgICBSZWFjdERlYnVnQ3VycmVudEZyYW1lJDEuc2V0RXh0cmFTdGFja0ZyYW1lKHN0YWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSQxLnNldEV4dHJhU3RhY2tGcmFtZShudWxsKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tQcm9wVHlwZXModHlwZVNwZWNzLCB2YWx1ZXMsIGxvY2F0aW9uLCBjb21wb25lbnROYW1lLCBlbGVtZW50KSB7XG4gIHtcbiAgICAvLyAkRmxvd0ZpeE1lIFRoaXMgaXMgb2theSBidXQgRmxvdyBkb2Vzbid0IGtub3cgaXQuXG4gICAgdmFyIGhhcyA9IEZ1bmN0aW9uLmNhbGwuYmluZChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcblxuICAgIGZvciAodmFyIHR5cGVTcGVjTmFtZSBpbiB0eXBlU3BlY3MpIHtcbiAgICAgIGlmIChoYXModHlwZVNwZWNzLCB0eXBlU3BlY05hbWUpKSB7XG4gICAgICAgIHZhciBlcnJvciQxID0gdm9pZCAwOyAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgICAvLyBmYWlsIHRoZSByZW5kZXIgcGhhc2Ugd2hlcmUgaXQgZGlkbid0IGZhaWwgYmVmb3JlLiBTbyB3ZSBsb2cgaXQuXG4gICAgICAgIC8vIEFmdGVyIHRoZXNlIGhhdmUgYmVlbiBjbGVhbmVkIHVwLCB3ZSdsbCBsZXQgdGhlbSB0aHJvdy5cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRoaXMgaXMgaW50ZW50aW9uYWxseSBhbiBpbnZhcmlhbnQgdGhhdCBnZXRzIGNhdWdodC4gSXQncyB0aGUgc2FtZVxuICAgICAgICAgIC8vIGJlaGF2aW9yIGFzIHdpdGhvdXQgdGhpcyBzdGF0ZW1lbnQgZXhjZXB0IHdpdGggYSBiZXR0ZXIgbWVzc2FnZS5cbiAgICAgICAgICBpZiAodHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0gRXJyb3IoKGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJykgKyAnOiAnICsgbG9jYXRpb24gKyAnIHR5cGUgYCcgKyB0eXBlU3BlY05hbWUgKyAnYCBpcyBpbnZhbGlkOyAnICsgJ2l0IG11c3QgYmUgYSBmdW5jdGlvbiwgdXN1YWxseSBmcm9tIHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZSwgYnV0IHJlY2VpdmVkIGAnICsgdHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdICsgJ2AuJyArICdUaGlzIG9mdGVuIGhhcHBlbnMgYmVjYXVzZSBvZiB0eXBvcyBzdWNoIGFzIGBQcm9wVHlwZXMuZnVuY3Rpb25gIGluc3RlYWQgb2YgYFByb3BUeXBlcy5mdW5jYC4nKTtcbiAgICAgICAgICAgIGVyci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGVycm9yJDEgPSB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSh2YWx1ZXMsIHR5cGVTcGVjTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIG51bGwsICdTRUNSRVRfRE9fTk9UX1BBU1NfVEhJU19PUl9ZT1VfV0lMTF9CRV9GSVJFRCcpO1xuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgIGVycm9yJDEgPSBleDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvciQxICYmICEoZXJyb3IkMSBpbnN0YW5jZW9mIEVycm9yKSkge1xuICAgICAgICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGVsZW1lbnQpO1xuXG4gICAgICAgICAgZXJyb3IoJyVzOiB0eXBlIHNwZWNpZmljYXRpb24gb2YgJXMnICsgJyBgJXNgIGlzIGludmFsaWQ7IHRoZSB0eXBlIGNoZWNrZXIgJyArICdmdW5jdGlvbiBtdXN0IHJldHVybiBgbnVsbGAgb3IgYW4gYEVycm9yYCBidXQgcmV0dXJuZWQgYSAlcy4gJyArICdZb3UgbWF5IGhhdmUgZm9yZ290dGVuIHRvIHBhc3MgYW4gYXJndW1lbnQgdG8gdGhlIHR5cGUgY2hlY2tlciAnICsgJ2NyZWF0b3IgKGFycmF5T2YsIGluc3RhbmNlT2YsIG9iamVjdE9mLCBvbmVPZiwgb25lT2ZUeXBlLCBhbmQgJyArICdzaGFwZSBhbGwgcmVxdWlyZSBhbiBhcmd1bWVudCkuJywgY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnLCBsb2NhdGlvbiwgdHlwZVNwZWNOYW1lLCB0eXBlb2YgZXJyb3IkMSk7XG5cbiAgICAgICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChudWxsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvciQxIGluc3RhbmNlb2YgRXJyb3IgJiYgIShlcnJvciQxLm1lc3NhZ2UgaW4gbG9nZ2VkVHlwZUZhaWx1cmVzKSkge1xuICAgICAgICAgIC8vIE9ubHkgbW9uaXRvciB0aGlzIGZhaWx1cmUgb25jZSBiZWNhdXNlIHRoZXJlIHRlbmRzIHRvIGJlIGEgbG90IG9mIHRoZVxuICAgICAgICAgIC8vIHNhbWUgZXJyb3IuXG4gICAgICAgICAgbG9nZ2VkVHlwZUZhaWx1cmVzW2Vycm9yJDEubWVzc2FnZV0gPSB0cnVlO1xuICAgICAgICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGVsZW1lbnQpO1xuXG4gICAgICAgICAgZXJyb3IoJ0ZhaWxlZCAlcyB0eXBlOiAlcycsIGxvY2F0aW9uLCBlcnJvciQxLm1lc3NhZ2UpO1xuXG4gICAgICAgICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQobnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQkMShlbGVtZW50KSB7XG4gIHtcbiAgICBpZiAoZWxlbWVudCkge1xuICAgICAgdmFyIG93bmVyID0gZWxlbWVudC5fb3duZXI7XG4gICAgICB2YXIgc3RhY2sgPSBkZXNjcmliZVVua25vd25FbGVtZW50VHlwZUZyYW1lSW5ERVYoZWxlbWVudC50eXBlLCBlbGVtZW50Ll9zb3VyY2UsIG93bmVyID8gb3duZXIudHlwZSA6IG51bGwpO1xuICAgICAgc2V0RXh0cmFTdGFja0ZyYW1lKHN0YWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0RXh0cmFTdGFja0ZyYW1lKG51bGwpO1xuICAgIH1cbiAgfVxufVxuXG52YXIgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd247XG5cbntcbiAgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24gPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCkge1xuICBpZiAoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCkge1xuICAgIHZhciBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LnR5cGUpO1xuXG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHJldHVybiAnXFxuXFxuQ2hlY2sgdGhlIHJlbmRlciBtZXRob2Qgb2YgYCcgKyBuYW1lICsgJ2AuJztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtKHNvdXJjZSkge1xuICBpZiAoc291cmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgZmlsZU5hbWUgPSBzb3VyY2UuZmlsZU5hbWUucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgIHZhciBsaW5lTnVtYmVyID0gc291cmNlLmxpbmVOdW1iZXI7XG4gICAgcmV0dXJuICdcXG5cXG5DaGVjayB5b3VyIGNvZGUgYXQgJyArIGZpbGVOYW1lICsgJzonICsgbGluZU51bWJlciArICcuJztcbiAgfVxuXG4gIHJldHVybiAnJztcbn1cblxuZnVuY3Rpb24gZ2V0U291cmNlSW5mb0Vycm9yQWRkZW5kdW1Gb3JQcm9wcyhlbGVtZW50UHJvcHMpIHtcbiAgaWYgKGVsZW1lbnRQcm9wcyAhPT0gbnVsbCAmJiBlbGVtZW50UHJvcHMgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bShlbGVtZW50UHJvcHMuX19zb3VyY2UpO1xuICB9XG5cbiAgcmV0dXJuICcnO1xufVxuLyoqXG4gKiBXYXJuIGlmIHRoZXJlJ3Mgbm8ga2V5IGV4cGxpY2l0bHkgc2V0IG9uIGR5bmFtaWMgYXJyYXlzIG9mIGNoaWxkcmVuIG9yXG4gKiBvYmplY3Qga2V5cyBhcmUgbm90IHZhbGlkLiBUaGlzIGFsbG93cyB1cyB0byBrZWVwIHRyYWNrIG9mIGNoaWxkcmVuIGJldHdlZW5cbiAqIHVwZGF0ZXMuXG4gKi9cblxuXG52YXIgb3duZXJIYXNLZXlVc2VXYXJuaW5nID0ge307XG5cbmZ1bmN0aW9uIGdldEN1cnJlbnRDb21wb25lbnRFcnJvckluZm8ocGFyZW50VHlwZSkge1xuICB2YXIgaW5mbyA9IGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSgpO1xuXG4gIGlmICghaW5mbykge1xuICAgIHZhciBwYXJlbnROYW1lID0gdHlwZW9mIHBhcmVudFR5cGUgPT09ICdzdHJpbmcnID8gcGFyZW50VHlwZSA6IHBhcmVudFR5cGUuZGlzcGxheU5hbWUgfHwgcGFyZW50VHlwZS5uYW1lO1xuXG4gICAgaWYgKHBhcmVudE5hbWUpIHtcbiAgICAgIGluZm8gPSBcIlxcblxcbkNoZWNrIHRoZSB0b3AtbGV2ZWwgcmVuZGVyIGNhbGwgdXNpbmcgPFwiICsgcGFyZW50TmFtZSArIFwiPi5cIjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaW5mbztcbn1cbi8qKlxuICogV2FybiBpZiB0aGUgZWxlbWVudCBkb2Vzbid0IGhhdmUgYW4gZXhwbGljaXQga2V5IGFzc2lnbmVkIHRvIGl0LlxuICogVGhpcyBlbGVtZW50IGlzIGluIGFuIGFycmF5LiBUaGUgYXJyYXkgY291bGQgZ3JvdyBhbmQgc2hyaW5rIG9yIGJlXG4gKiByZW9yZGVyZWQuIEFsbCBjaGlsZHJlbiB0aGF0IGhhdmVuJ3QgYWxyZWFkeSBiZWVuIHZhbGlkYXRlZCBhcmUgcmVxdWlyZWQgdG9cbiAqIGhhdmUgYSBcImtleVwiIHByb3BlcnR5IGFzc2lnbmVkIHRvIGl0LiBFcnJvciBzdGF0dXNlcyBhcmUgY2FjaGVkIHNvIGEgd2FybmluZ1xuICogd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQGludGVybmFsXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHRoYXQgcmVxdWlyZXMgYSBrZXkuXG4gKiBAcGFyYW0geyp9IHBhcmVudFR5cGUgZWxlbWVudCdzIHBhcmVudCdzIHR5cGUuXG4gKi9cblxuXG5mdW5jdGlvbiB2YWxpZGF0ZUV4cGxpY2l0S2V5KGVsZW1lbnQsIHBhcmVudFR5cGUpIHtcbiAgaWYgKCFlbGVtZW50Ll9zdG9yZSB8fCBlbGVtZW50Ll9zdG9yZS52YWxpZGF0ZWQgfHwgZWxlbWVudC5rZXkgIT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGVsZW1lbnQuX3N0b3JlLnZhbGlkYXRlZCA9IHRydWU7XG4gIHZhciBjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvID0gZ2V0Q3VycmVudENvbXBvbmVudEVycm9ySW5mbyhwYXJlbnRUeXBlKTtcblxuICBpZiAob3duZXJIYXNLZXlVc2VXYXJuaW5nW2N1cnJlbnRDb21wb25lbnRFcnJvckluZm9dKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgb3duZXJIYXNLZXlVc2VXYXJuaW5nW2N1cnJlbnRDb21wb25lbnRFcnJvckluZm9dID0gdHJ1ZTsgLy8gVXN1YWxseSB0aGUgY3VycmVudCBvd25lciBpcyB0aGUgb2ZmZW5kZXIsIGJ1dCBpZiBpdCBhY2NlcHRzIGNoaWxkcmVuIGFzIGFcbiAgLy8gcHJvcGVydHksIGl0IG1heSBiZSB0aGUgY3JlYXRvciBvZiB0aGUgY2hpbGQgdGhhdCdzIHJlc3BvbnNpYmxlIGZvclxuICAvLyBhc3NpZ25pbmcgaXQgYSBrZXkuXG5cbiAgdmFyIGNoaWxkT3duZXIgPSAnJztcblxuICBpZiAoZWxlbWVudCAmJiBlbGVtZW50Ll9vd25lciAmJiBlbGVtZW50Ll9vd25lciAhPT0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCkge1xuICAgIC8vIEdpdmUgdGhlIGNvbXBvbmVudCB0aGF0IG9yaWdpbmFsbHkgY3JlYXRlZCB0aGlzIGNoaWxkLlxuICAgIGNoaWxkT3duZXIgPSBcIiBJdCB3YXMgcGFzc2VkIGEgY2hpbGQgZnJvbSBcIiArIGdldENvbXBvbmVudE5hbWUoZWxlbWVudC5fb3duZXIudHlwZSkgKyBcIi5cIjtcbiAgfVxuXG4gIHtcbiAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCQxKGVsZW1lbnQpO1xuXG4gICAgZXJyb3IoJ0VhY2ggY2hpbGQgaW4gYSBsaXN0IHNob3VsZCBoYXZlIGEgdW5pcXVlIFwia2V5XCIgcHJvcC4nICsgJyVzJXMgU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvbGluay93YXJuaW5nLWtleXMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJywgY3VycmVudENvbXBvbmVudEVycm9ySW5mbywgY2hpbGRPd25lcik7XG5cbiAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCQxKG51bGwpO1xuICB9XG59XG4vKipcbiAqIEVuc3VyZSB0aGF0IGV2ZXJ5IGVsZW1lbnQgZWl0aGVyIGlzIHBhc3NlZCBpbiBhIHN0YXRpYyBsb2NhdGlvbiwgaW4gYW5cbiAqIGFycmF5IHdpdGggYW4gZXhwbGljaXQga2V5cyBwcm9wZXJ0eSBkZWZpbmVkLCBvciBpbiBhbiBvYmplY3QgbGl0ZXJhbFxuICogd2l0aCB2YWxpZCBrZXkgcHJvcGVydHkuXG4gKlxuICogQGludGVybmFsXG4gKiBAcGFyYW0ge1JlYWN0Tm9kZX0gbm9kZSBTdGF0aWNhbGx5IHBhc3NlZCBjaGlsZCBvZiBhbnkgdHlwZS5cbiAqIEBwYXJhbSB7Kn0gcGFyZW50VHlwZSBub2RlJ3MgcGFyZW50J3MgdHlwZS5cbiAqL1xuXG5cbmZ1bmN0aW9uIHZhbGlkYXRlQ2hpbGRLZXlzKG5vZGUsIHBhcmVudFR5cGUpIHtcbiAgaWYgKHR5cGVvZiBub2RlICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KG5vZGUpKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hpbGQgPSBub2RlW2ldO1xuXG4gICAgICBpZiAoaXNWYWxpZEVsZW1lbnQoY2hpbGQpKSB7XG4gICAgICAgIHZhbGlkYXRlRXhwbGljaXRLZXkoY2hpbGQsIHBhcmVudFR5cGUpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChpc1ZhbGlkRWxlbWVudChub2RlKSkge1xuICAgIC8vIFRoaXMgZWxlbWVudCB3YXMgcGFzc2VkIGluIGEgdmFsaWQgbG9jYXRpb24uXG4gICAgaWYgKG5vZGUuX3N0b3JlKSB7XG4gICAgICBub2RlLl9zdG9yZS52YWxpZGF0ZWQgPSB0cnVlO1xuICAgIH1cbiAgfSBlbHNlIGlmIChub2RlKSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG5vZGUpO1xuXG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBFbnRyeSBpdGVyYXRvcnMgdXNlZCB0byBwcm92aWRlIGltcGxpY2l0IGtleXMsXG4gICAgICAvLyBidXQgbm93IHdlIHByaW50IGEgc2VwYXJhdGUgd2FybmluZyBmb3IgdGhlbSBsYXRlci5cbiAgICAgIGlmIChpdGVyYXRvckZuICE9PSBub2RlLmVudHJpZXMpIHtcbiAgICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKG5vZGUpO1xuICAgICAgICB2YXIgc3RlcDtcblxuICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgaWYgKGlzVmFsaWRFbGVtZW50KHN0ZXAudmFsdWUpKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZUV4cGxpY2l0S2V5KHN0ZXAudmFsdWUsIHBhcmVudFR5cGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuLyoqXG4gKiBHaXZlbiBhbiBlbGVtZW50LCB2YWxpZGF0ZSB0aGF0IGl0cyBwcm9wcyBmb2xsb3cgdGhlIHByb3BUeXBlcyBkZWZpbml0aW9uLFxuICogcHJvdmlkZWQgYnkgdGhlIHR5cGUuXG4gKlxuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGVsZW1lbnRcbiAqL1xuXG5cbmZ1bmN0aW9uIHZhbGlkYXRlUHJvcFR5cGVzKGVsZW1lbnQpIHtcbiAge1xuICAgIHZhciB0eXBlID0gZWxlbWVudC50eXBlO1xuXG4gICAgaWYgKHR5cGUgPT09IG51bGwgfHwgdHlwZSA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBwcm9wVHlwZXM7XG5cbiAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHByb3BUeXBlcyA9IHR5cGUucHJvcFR5cGVzO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmICh0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIHx8IC8vIE5vdGU6IE1lbW8gb25seSBjaGVja3Mgb3V0ZXIgcHJvcHMgaGVyZS5cbiAgICAvLyBJbm5lciBwcm9wcyBhcmUgY2hlY2tlZCBpbiB0aGUgcmVjb25jaWxlci5cbiAgICB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUpKSB7XG4gICAgICBwcm9wVHlwZXMgPSB0eXBlLnByb3BUeXBlcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwcm9wVHlwZXMpIHtcbiAgICAgIC8vIEludGVudGlvbmFsbHkgaW5zaWRlIHRvIGF2b2lkIHRyaWdnZXJpbmcgbGF6eSBpbml0aWFsaXplcnM6XG4gICAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUodHlwZSk7XG4gICAgICBjaGVja1Byb3BUeXBlcyhwcm9wVHlwZXMsIGVsZW1lbnQucHJvcHMsICdwcm9wJywgbmFtZSwgZWxlbWVudCk7XG4gICAgfSBlbHNlIGlmICh0eXBlLlByb3BUeXBlcyAhPT0gdW5kZWZpbmVkICYmICFwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93bikge1xuICAgICAgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24gPSB0cnVlOyAvLyBJbnRlbnRpb25hbGx5IGluc2lkZSB0byBhdm9pZCB0cmlnZ2VyaW5nIGxhenkgaW5pdGlhbGl6ZXJzOlxuXG4gICAgICB2YXIgX25hbWUgPSBnZXRDb21wb25lbnROYW1lKHR5cGUpO1xuXG4gICAgICBlcnJvcignQ29tcG9uZW50ICVzIGRlY2xhcmVkIGBQcm9wVHlwZXNgIGluc3RlYWQgb2YgYHByb3BUeXBlc2AuIERpZCB5b3UgbWlzc3BlbGwgdGhlIHByb3BlcnR5IGFzc2lnbm1lbnQ/JywgX25hbWUgfHwgJ1Vua25vd24nKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHR5cGUuZ2V0RGVmYXVsdFByb3BzID09PSAnZnVuY3Rpb24nICYmICF0eXBlLmdldERlZmF1bHRQcm9wcy5pc1JlYWN0Q2xhc3NBcHByb3ZlZCkge1xuICAgICAgZXJyb3IoJ2dldERlZmF1bHRQcm9wcyBpcyBvbmx5IHVzZWQgb24gY2xhc3NpYyBSZWFjdC5jcmVhdGVDbGFzcyAnICsgJ2RlZmluaXRpb25zLiBVc2UgYSBzdGF0aWMgcHJvcGVydHkgbmFtZWQgYGRlZmF1bHRQcm9wc2AgaW5zdGVhZC4nKTtcbiAgICB9XG4gIH1cbn1cbi8qKlxuICogR2l2ZW4gYSBmcmFnbWVudCwgdmFsaWRhdGUgdGhhdCBpdCBjYW4gb25seSBiZSBwcm92aWRlZCB3aXRoIGZyYWdtZW50IHByb3BzXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZnJhZ21lbnRcbiAqL1xuXG5cbmZ1bmN0aW9uIHZhbGlkYXRlRnJhZ21lbnRQcm9wcyhmcmFnbWVudCkge1xuICB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhmcmFnbWVudC5wcm9wcyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuXG4gICAgICBpZiAoa2V5ICE9PSAnY2hpbGRyZW4nICYmIGtleSAhPT0gJ2tleScpIHtcbiAgICAgICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQkMShmcmFnbWVudCk7XG5cbiAgICAgICAgZXJyb3IoJ0ludmFsaWQgcHJvcCBgJXNgIHN1cHBsaWVkIHRvIGBSZWFjdC5GcmFnbWVudGAuICcgKyAnUmVhY3QuRnJhZ21lbnQgY2FuIG9ubHkgaGF2ZSBga2V5YCBhbmQgYGNoaWxkcmVuYCBwcm9wcy4nLCBrZXkpO1xuXG4gICAgICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50JDEobnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmcmFnbWVudC5yZWYgIT09IG51bGwpIHtcbiAgICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50JDEoZnJhZ21lbnQpO1xuXG4gICAgICBlcnJvcignSW52YWxpZCBhdHRyaWJ1dGUgYHJlZmAgc3VwcGxpZWQgdG8gYFJlYWN0LkZyYWdtZW50YC4nKTtcblxuICAgICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQkMShudWxsKTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRXaXRoVmFsaWRhdGlvbih0eXBlLCBwcm9wcywgY2hpbGRyZW4pIHtcbiAgdmFyIHZhbGlkVHlwZSA9IGlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKTsgLy8gV2Ugd2FybiBpbiB0aGlzIGNhc2UgYnV0IGRvbid0IHRocm93LiBXZSBleHBlY3QgdGhlIGVsZW1lbnQgY3JlYXRpb24gdG9cbiAgLy8gc3VjY2VlZCBhbmQgdGhlcmUgd2lsbCBsaWtlbHkgYmUgZXJyb3JzIGluIHJlbmRlci5cblxuICBpZiAoIXZhbGlkVHlwZSkge1xuICAgIHZhciBpbmZvID0gJyc7XG5cbiAgICBpZiAodHlwZSA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiB0eXBlICE9PSBudWxsICYmIE9iamVjdC5rZXlzKHR5cGUpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaW5mbyArPSAnIFlvdSBsaWtlbHkgZm9yZ290IHRvIGV4cG9ydCB5b3VyIGNvbXBvbmVudCBmcm9tIHRoZSBmaWxlICcgKyBcIml0J3MgZGVmaW5lZCBpbiwgb3IgeW91IG1pZ2h0IGhhdmUgbWl4ZWQgdXAgZGVmYXVsdCBhbmQgbmFtZWQgaW1wb3J0cy5cIjtcbiAgICB9XG5cbiAgICB2YXIgc291cmNlSW5mbyA9IGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtRm9yUHJvcHMocHJvcHMpO1xuXG4gICAgaWYgKHNvdXJjZUluZm8pIHtcbiAgICAgIGluZm8gKz0gc291cmNlSW5mbztcbiAgICB9IGVsc2Uge1xuICAgICAgaW5mbyArPSBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKTtcbiAgICB9XG5cbiAgICB2YXIgdHlwZVN0cmluZztcblxuICAgIGlmICh0eXBlID09PSBudWxsKSB7XG4gICAgICB0eXBlU3RyaW5nID0gJ251bGwnO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0eXBlKSkge1xuICAgICAgdHlwZVN0cmluZyA9ICdhcnJheSc7XG4gICAgfSBlbHNlIGlmICh0eXBlICE9PSB1bmRlZmluZWQgJiYgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFKSB7XG4gICAgICB0eXBlU3RyaW5nID0gXCI8XCIgKyAoZ2V0Q29tcG9uZW50TmFtZSh0eXBlLnR5cGUpIHx8ICdVbmtub3duJykgKyBcIiAvPlwiO1xuICAgICAgaW5mbyA9ICcgRGlkIHlvdSBhY2NpZGVudGFsbHkgZXhwb3J0IGEgSlNYIGxpdGVyYWwgaW5zdGVhZCBvZiBhIGNvbXBvbmVudD8nO1xuICAgIH0gZWxzZSB7XG4gICAgICB0eXBlU3RyaW5nID0gdHlwZW9mIHR5cGU7XG4gICAgfVxuXG4gICAge1xuICAgICAgZXJyb3IoJ1JlYWN0LmNyZWF0ZUVsZW1lbnQ6IHR5cGUgaXMgaW52YWxpZCAtLSBleHBlY3RlZCBhIHN0cmluZyAoZm9yICcgKyAnYnVpbHQtaW4gY29tcG9uZW50cykgb3IgYSBjbGFzcy9mdW5jdGlvbiAoZm9yIGNvbXBvc2l0ZSAnICsgJ2NvbXBvbmVudHMpIGJ1dCBnb3Q6ICVzLiVzJywgdHlwZVN0cmluZywgaW5mbyk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IC8vIFRoZSByZXN1bHQgY2FuIGJlIG51bGxpc2ggaWYgYSBtb2NrIG9yIGEgY3VzdG9tIGZ1bmN0aW9uIGlzIHVzZWQuXG4gIC8vIFRPRE86IERyb3AgdGhpcyB3aGVuIHRoZXNlIGFyZSBubyBsb25nZXIgYWxsb3dlZCBhcyB0aGUgdHlwZSBhcmd1bWVudC5cblxuICBpZiAoZWxlbWVudCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH0gLy8gU2tpcCBrZXkgd2FybmluZyBpZiB0aGUgdHlwZSBpc24ndCB2YWxpZCBzaW5jZSBvdXIga2V5IHZhbGlkYXRpb24gbG9naWNcbiAgLy8gZG9lc24ndCBleHBlY3QgYSBub24tc3RyaW5nL2Z1bmN0aW9uIHR5cGUgYW5kIGNhbiB0aHJvdyBjb25mdXNpbmcgZXJyb3JzLlxuICAvLyBXZSBkb24ndCB3YW50IGV4Y2VwdGlvbiBiZWhhdmlvciB0byBkaWZmZXIgYmV0d2VlbiBkZXYgYW5kIHByb2QuXG4gIC8vIChSZW5kZXJpbmcgd2lsbCB0aHJvdyB3aXRoIGEgaGVscGZ1bCBtZXNzYWdlIGFuZCBhcyBzb29uIGFzIHRoZSB0eXBlIGlzXG4gIC8vIGZpeGVkLCB0aGUga2V5IHdhcm5pbmdzIHdpbGwgYXBwZWFyLilcblxuXG4gIGlmICh2YWxpZFR5cGUpIHtcbiAgICBmb3IgKHZhciBpID0gMjsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFsaWRhdGVDaGlsZEtleXMoYXJndW1lbnRzW2ldLCB0eXBlKTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZSA9PT0gZXhwb3J0cy5GcmFnbWVudCkge1xuICAgIHZhbGlkYXRlRnJhZ21lbnRQcm9wcyhlbGVtZW50KTtcbiAgfSBlbHNlIHtcbiAgICB2YWxpZGF0ZVByb3BUeXBlcyhlbGVtZW50KTtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufVxudmFyIGRpZFdhcm5BYm91dERlcHJlY2F0ZWRDcmVhdGVGYWN0b3J5ID0gZmFsc2U7XG5mdW5jdGlvbiBjcmVhdGVGYWN0b3J5V2l0aFZhbGlkYXRpb24odHlwZSkge1xuICB2YXIgdmFsaWRhdGVkRmFjdG9yeSA9IGNyZWF0ZUVsZW1lbnRXaXRoVmFsaWRhdGlvbi5iaW5kKG51bGwsIHR5cGUpO1xuICB2YWxpZGF0ZWRGYWN0b3J5LnR5cGUgPSB0eXBlO1xuXG4gIHtcbiAgICBpZiAoIWRpZFdhcm5BYm91dERlcHJlY2F0ZWRDcmVhdGVGYWN0b3J5KSB7XG4gICAgICBkaWRXYXJuQWJvdXREZXByZWNhdGVkQ3JlYXRlRmFjdG9yeSA9IHRydWU7XG5cbiAgICAgIHdhcm4oJ1JlYWN0LmNyZWF0ZUZhY3RvcnkoKSBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gJyArICdhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiBDb25zaWRlciB1c2luZyBKU1ggJyArICdvciB1c2UgUmVhY3QuY3JlYXRlRWxlbWVudCgpIGRpcmVjdGx5IGluc3RlYWQuJyk7XG4gICAgfSAvLyBMZWdhY3kgaG9vazogcmVtb3ZlIGl0XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2YWxpZGF0ZWRGYWN0b3J5LCAndHlwZScsIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdhcm4oJ0ZhY3RvcnkudHlwZSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdGhlIGNsYXNzIGRpcmVjdGx5ICcgKyAnYmVmb3JlIHBhc3NpbmcgaXQgdG8gY3JlYXRlRmFjdG9yeS4nKTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3R5cGUnLCB7XG4gICAgICAgICAgdmFsdWU6IHR5cGVcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHZhbGlkYXRlZEZhY3Rvcnk7XG59XG5mdW5jdGlvbiBjbG9uZUVsZW1lbnRXaXRoVmFsaWRhdGlvbihlbGVtZW50LCBwcm9wcywgY2hpbGRyZW4pIHtcbiAgdmFyIG5ld0VsZW1lbnQgPSBjbG9uZUVsZW1lbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICBmb3IgKHZhciBpID0gMjsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGFyZ3VtZW50c1tpXSwgbmV3RWxlbWVudC50eXBlKTtcbiAgfVxuXG4gIHZhbGlkYXRlUHJvcFR5cGVzKG5ld0VsZW1lbnQpO1xuICByZXR1cm4gbmV3RWxlbWVudDtcbn1cblxue1xuXG4gIHRyeSB7XG4gICAgdmFyIGZyb3plbk9iamVjdCA9IE9iamVjdC5mcmVlemUoe30pO1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLW5ldyAqL1xuXG4gICAgbmV3IE1hcChbW2Zyb3plbk9iamVjdCwgbnVsbF1dKTtcbiAgICBuZXcgU2V0KFtmcm96ZW5PYmplY3RdKTtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLW5ldyAqL1xuICB9IGNhdGNoIChlKSB7XG4gIH1cbn1cblxudmFyIGNyZWF0ZUVsZW1lbnQkMSA9ICBjcmVhdGVFbGVtZW50V2l0aFZhbGlkYXRpb24gO1xudmFyIGNsb25lRWxlbWVudCQxID0gIGNsb25lRWxlbWVudFdpdGhWYWxpZGF0aW9uIDtcbnZhciBjcmVhdGVGYWN0b3J5ID0gIGNyZWF0ZUZhY3RvcnlXaXRoVmFsaWRhdGlvbiA7XG52YXIgQ2hpbGRyZW4gPSB7XG4gIG1hcDogbWFwQ2hpbGRyZW4sXG4gIGZvckVhY2g6IGZvckVhY2hDaGlsZHJlbixcbiAgY291bnQ6IGNvdW50Q2hpbGRyZW4sXG4gIHRvQXJyYXk6IHRvQXJyYXksXG4gIG9ubHk6IG9ubHlDaGlsZFxufTtcblxuZXhwb3J0cy5DaGlsZHJlbiA9IENoaWxkcmVuO1xuZXhwb3J0cy5Db21wb25lbnQgPSBDb21wb25lbnQ7XG5leHBvcnRzLlB1cmVDb21wb25lbnQgPSBQdXJlQ29tcG9uZW50O1xuZXhwb3J0cy5fX1NFQ1JFVF9JTlRFUk5BTFNfRE9fTk9UX1VTRV9PUl9ZT1VfV0lMTF9CRV9GSVJFRCA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzO1xuZXhwb3J0cy5jbG9uZUVsZW1lbnQgPSBjbG9uZUVsZW1lbnQkMTtcbmV4cG9ydHMuY3JlYXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ7XG5leHBvcnRzLmNyZWF0ZUVsZW1lbnQgPSBjcmVhdGVFbGVtZW50JDE7XG5leHBvcnRzLmNyZWF0ZUZhY3RvcnkgPSBjcmVhdGVGYWN0b3J5O1xuZXhwb3J0cy5jcmVhdGVSZWYgPSBjcmVhdGVSZWY7XG5leHBvcnRzLmZvcndhcmRSZWYgPSBmb3J3YXJkUmVmO1xuZXhwb3J0cy5pc1ZhbGlkRWxlbWVudCA9IGlzVmFsaWRFbGVtZW50O1xuZXhwb3J0cy5sYXp5ID0gbGF6eTtcbmV4cG9ydHMubWVtbyA9IG1lbW87XG5leHBvcnRzLnVzZUNhbGxiYWNrID0gdXNlQ2FsbGJhY2s7XG5leHBvcnRzLnVzZUNvbnRleHQgPSB1c2VDb250ZXh0O1xuZXhwb3J0cy51c2VEZWJ1Z1ZhbHVlID0gdXNlRGVidWdWYWx1ZTtcbmV4cG9ydHMudXNlRWZmZWN0ID0gdXNlRWZmZWN0O1xuZXhwb3J0cy51c2VJbXBlcmF0aXZlSGFuZGxlID0gdXNlSW1wZXJhdGl2ZUhhbmRsZTtcbmV4cG9ydHMudXNlTGF5b3V0RWZmZWN0ID0gdXNlTGF5b3V0RWZmZWN0O1xuZXhwb3J0cy51c2VNZW1vID0gdXNlTWVtbztcbmV4cG9ydHMudXNlUmVkdWNlciA9IHVzZVJlZHVjZXI7XG5leHBvcnRzLnVzZVJlZiA9IHVzZVJlZjtcbmV4cG9ydHMudXNlU3RhdGUgPSB1c2VTdGF0ZTtcbmV4cG9ydHMudmVyc2lvbiA9IFJlYWN0VmVyc2lvbjtcbiAgfSkoKTtcbn1cbiIsImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3QvY2pzL3JlYWN0LmRldmVsb3BtZW50LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0O1xuZXhwb3J0IGNvbnN0IF9fZXNtTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydCBjb25zdCB7XG4gIEZyYWdtZW50LFxuICBTdHJpY3RNb2RlLFxuICBQcm9maWxlcixcbiAgU3VzcGVuc2UsXG4gIENoaWxkcmVuLFxuICBDb21wb25lbnQsXG4gIFB1cmVDb21wb25lbnQsXG4gIF9fU0VDUkVUX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0ZJUkVELFxuICBjbG9uZUVsZW1lbnQsXG4gIGNyZWF0ZUNvbnRleHQsXG4gIGNyZWF0ZUVsZW1lbnQsXG4gIGNyZWF0ZUZhY3RvcnksXG4gIGNyZWF0ZVJlZixcbiAgZm9yd2FyZFJlZixcbiAgaXNWYWxpZEVsZW1lbnQsXG4gIGxhenksXG4gIG1lbW8sXG4gIHVzZUNhbGxiYWNrLFxuICB1c2VDb250ZXh0LFxuICB1c2VEZWJ1Z1ZhbHVlLFxuICB1c2VFZmZlY3QsXG4gIHVzZUltcGVyYXRpdmVIYW5kbGUsXG4gIHVzZUxheW91dEVmZmVjdCxcbiAgdXNlTWVtbyxcbiAgdXNlUmVkdWNlcixcbiAgdXNlUmVmLFxuICB1c2VTdGF0ZSxcbiAgdmVyc2lvbixcbn0gPSBSZWFjdDtcbiJdLCJuYW1lcyI6WyJyZXF1aXJlJCQwIiwiUmVhY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztHQU9BO0dBQ0EsSUFBSSxxQkFBcUIsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUM7R0FDekQsSUFBSSxjQUFjLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7R0FDckQsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDO0FBQzdEO0dBQ0EsU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFO0dBQ3ZCLENBQUMsSUFBSSxHQUFHLEtBQUssSUFBSSxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7R0FDeEMsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLHVEQUF1RCxDQUFDLENBQUM7R0FDL0UsRUFBRTtBQUNGO0dBQ0EsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUNwQixDQUFDO0FBQ0Q7R0FDQSxTQUFTLGVBQWUsR0FBRztHQUMzQixDQUFDLElBQUk7R0FDTCxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0dBQ3RCLEdBQUcsT0FBTyxLQUFLLENBQUM7R0FDaEIsR0FBRztBQUNIO0dBQ0E7QUFDQTtHQUNBO0dBQ0EsRUFBRSxJQUFJLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNo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
