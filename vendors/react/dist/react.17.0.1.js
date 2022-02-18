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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QuMTcuMC4xLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vb2JqZWN0LWFzc2lnbkA0LjEuMS9ub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIi4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yZWFjdEAxNy4wLjIvbm9kZV9tb2R1bGVzL3JlYWN0L2Nqcy9yZWFjdC5kZXZlbG9wbWVudC5qcyIsIi4uL3NyYy9kZXZlbG9wbWVudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiLyoqIEBsaWNlbnNlIFJlYWN0IHYxNy4wLjJcbiAqIHJlYWN0LmRldmVsb3BtZW50LmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIChmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxudmFyIF9hc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5cbi8vIFRPRE86IHRoaXMgaXMgc3BlY2lhbCBiZWNhdXNlIGl0IGdldHMgaW1wb3J0ZWQgZHVyaW5nIGJ1aWxkLlxudmFyIFJlYWN0VmVyc2lvbiA9ICcxNy4wLjInO1xuXG4vLyBBVFRFTlRJT05cbi8vIFdoZW4gYWRkaW5nIG5ldyBzeW1ib2xzIHRvIHRoaXMgZmlsZSxcbi8vIFBsZWFzZSBjb25zaWRlciBhbHNvIGFkZGluZyB0byAncmVhY3QtZGV2dG9vbHMtc2hhcmVkL3NyYy9iYWNrZW5kL1JlYWN0U3ltYm9scydcbi8vIFRoZSBTeW1ib2wgdXNlZCB0byB0YWcgdGhlIFJlYWN0RWxlbWVudC1saWtlIHR5cGVzLiBJZiB0aGVyZSBpcyBubyBuYXRpdmUgU3ltYm9sXG4vLyBub3IgcG9seWZpbGwsIHRoZW4gYSBwbGFpbiBudW1iZXIgaXMgdXNlZCBmb3IgcGVyZm9ybWFuY2UuXG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gMHhlYWM3O1xudmFyIFJFQUNUX1BPUlRBTF9UWVBFID0gMHhlYWNhO1xuZXhwb3J0cy5GcmFnbWVudCA9IDB4ZWFjYjtcbmV4cG9ydHMuU3RyaWN0TW9kZSA9IDB4ZWFjYztcbmV4cG9ydHMuUHJvZmlsZXIgPSAweGVhZDI7XG52YXIgUkVBQ1RfUFJPVklERVJfVFlQRSA9IDB4ZWFjZDtcbnZhciBSRUFDVF9DT05URVhUX1RZUEUgPSAweGVhY2U7XG52YXIgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSA9IDB4ZWFkMDtcbmV4cG9ydHMuU3VzcGVuc2UgPSAweGVhZDE7XG52YXIgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFID0gMHhlYWQ4O1xudmFyIFJFQUNUX01FTU9fVFlQRSA9IDB4ZWFkMztcbnZhciBSRUFDVF9MQVpZX1RZUEUgPSAweGVhZDQ7XG52YXIgUkVBQ1RfQkxPQ0tfVFlQRSA9IDB4ZWFkOTtcbnZhciBSRUFDVF9TRVJWRVJfQkxPQ0tfVFlQRSA9IDB4ZWFkYTtcbnZhciBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFID0gMHhlYWQ1O1xudmFyIFJFQUNUX1NDT1BFX1RZUEUgPSAweGVhZDc7XG52YXIgUkVBQ1RfT1BBUVVFX0lEX1RZUEUgPSAweGVhZTA7XG52YXIgUkVBQ1RfREVCVUdfVFJBQ0lOR19NT0RFX1RZUEUgPSAweGVhZTE7XG52YXIgUkVBQ1RfT0ZGU0NSRUVOX1RZUEUgPSAweGVhZTI7XG52YXIgUkVBQ1RfTEVHQUNZX0hJRERFTl9UWVBFID0gMHhlYWUzO1xuXG5pZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yKSB7XG4gIHZhciBzeW1ib2xGb3IgPSBTeW1ib2wuZm9yO1xuICBSRUFDVF9FTEVNRU5UX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmVsZW1lbnQnKTtcbiAgUkVBQ1RfUE9SVEFMX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LnBvcnRhbCcpO1xuICBleHBvcnRzLkZyYWdtZW50ID0gc3ltYm9sRm9yKCdyZWFjdC5mcmFnbWVudCcpO1xuICBleHBvcnRzLlN0cmljdE1vZGUgPSBzeW1ib2xGb3IoJ3JlYWN0LnN0cmljdF9tb2RlJyk7XG4gIGV4cG9ydHMuUHJvZmlsZXIgPSBzeW1ib2xGb3IoJ3JlYWN0LnByb2ZpbGVyJyk7XG4gIFJFQUNUX1BST1ZJREVSX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LnByb3ZpZGVyJyk7XG4gIFJFQUNUX0NPTlRFWFRfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QuY29udGV4dCcpO1xuICBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5mb3J3YXJkX3JlZicpO1xuICBleHBvcnRzLlN1c3BlbnNlID0gc3ltYm9sRm9yKCdyZWFjdC5zdXNwZW5zZScpO1xuICBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LnN1c3BlbnNlX2xpc3QnKTtcbiAgUkVBQ1RfTUVNT19UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5tZW1vJyk7XG4gIFJFQUNUX0xBWllfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QubGF6eScpO1xuICBSRUFDVF9CTE9DS19UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5ibG9jaycpO1xuICBSRUFDVF9TRVJWRVJfQkxPQ0tfVFlQRSA9IHN5bWJvbEZvcigncmVhY3Quc2VydmVyLmJsb2NrJyk7XG4gIFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmZ1bmRhbWVudGFsJyk7XG4gIFJFQUNUX1NDT1BFX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LnNjb3BlJyk7XG4gIFJFQUNUX09QQVFVRV9JRF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5vcGFxdWUuaWQnKTtcbiAgUkVBQ1RfREVCVUdfVFJBQ0lOR19NT0RFX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmRlYnVnX3RyYWNlX21vZGUnKTtcbiAgUkVBQ1RfT0ZGU0NSRUVOX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0Lm9mZnNjcmVlbicpO1xuICBSRUFDVF9MRUdBQ1lfSElEREVOX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmxlZ2FjeV9oaWRkZW4nKTtcbn1cblxudmFyIE1BWUJFX0lURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xudmFyIEZBVVhfSVRFUkFUT1JfU1lNQk9MID0gJ0BAaXRlcmF0b3InO1xuZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKSB7XG4gIGlmIChtYXliZUl0ZXJhYmxlID09PSBudWxsIHx8IHR5cGVvZiBtYXliZUl0ZXJhYmxlICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIG1heWJlSXRlcmF0b3IgPSBNQVlCRV9JVEVSQVRPUl9TWU1CT0wgJiYgbWF5YmVJdGVyYWJsZVtNQVlCRV9JVEVSQVRPUl9TWU1CT0xdIHx8IG1heWJlSXRlcmFibGVbRkFVWF9JVEVSQVRPUl9TWU1CT0xdO1xuXG4gIGlmICh0eXBlb2YgbWF5YmVJdGVyYXRvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBtYXliZUl0ZXJhdG9yO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnQgZGlzcGF0Y2hlci5cbiAqL1xudmFyIFJlYWN0Q3VycmVudERpc3BhdGNoZXIgPSB7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQHR5cGUge1JlYWN0Q29tcG9uZW50fVxuICAgKi9cbiAgY3VycmVudDogbnVsbFxufTtcblxuLyoqXG4gKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudCBiYXRjaCdzIGNvbmZpZ3VyYXRpb24gc3VjaCBhcyBob3cgbG9uZyBhbiB1cGRhdGVcbiAqIHNob3VsZCBzdXNwZW5kIGZvciBpZiBpdCBuZWVkcyB0by5cbiAqL1xudmFyIFJlYWN0Q3VycmVudEJhdGNoQ29uZmlnID0ge1xuICB0cmFuc2l0aW9uOiAwXG59O1xuXG4vKipcbiAqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50IG93bmVyLlxuICpcbiAqIFRoZSBjdXJyZW50IG93bmVyIGlzIHRoZSBjb21wb25lbnQgd2hvIHNob3VsZCBvd24gYW55IGNvbXBvbmVudHMgdGhhdCBhcmVcbiAqIGN1cnJlbnRseSBiZWluZyBjb25zdHJ1Y3RlZC5cbiAqL1xudmFyIFJlYWN0Q3VycmVudE93bmVyID0ge1xuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEB0eXBlIHtSZWFjdENvbXBvbmVudH1cbiAgICovXG4gIGN1cnJlbnQ6IG51bGxcbn07XG5cbnZhciBSZWFjdERlYnVnQ3VycmVudEZyYW1lID0ge307XG52YXIgY3VycmVudEV4dHJhU3RhY2tGcmFtZSA9IG51bGw7XG5mdW5jdGlvbiBzZXRFeHRyYVN0YWNrRnJhbWUoc3RhY2spIHtcbiAge1xuICAgIGN1cnJlbnRFeHRyYVN0YWNrRnJhbWUgPSBzdGFjaztcbiAgfVxufVxuXG57XG4gIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuc2V0RXh0cmFTdGFja0ZyYW1lID0gZnVuY3Rpb24gKHN0YWNrKSB7XG4gICAge1xuICAgICAgY3VycmVudEV4dHJhU3RhY2tGcmFtZSA9IHN0YWNrO1xuICAgIH1cbiAgfTsgLy8gU3RhY2sgaW1wbGVtZW50YXRpb24gaW5qZWN0ZWQgYnkgdGhlIGN1cnJlbnQgcmVuZGVyZXIuXG5cblxuICBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldEN1cnJlbnRTdGFjayA9IG51bGw7XG5cbiAgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRTdGFja0FkZGVuZHVtID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdGFjayA9ICcnOyAvLyBBZGQgYW4gZXh0cmEgdG9wIGZyYW1lIHdoaWxlIGFuIGVsZW1lbnQgaXMgYmVpbmcgdmFsaWRhdGVkXG5cbiAgICBpZiAoY3VycmVudEV4dHJhU3RhY2tGcmFtZSkge1xuICAgICAgc3RhY2sgKz0gY3VycmVudEV4dHJhU3RhY2tGcmFtZTtcbiAgICB9IC8vIERlbGVnYXRlIHRvIHRoZSBpbmplY3RlZCByZW5kZXJlci1zcGVjaWZpYyBpbXBsZW1lbnRhdGlvblxuXG5cbiAgICB2YXIgaW1wbCA9IFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0Q3VycmVudFN0YWNrO1xuXG4gICAgaWYgKGltcGwpIHtcbiAgICAgIHN0YWNrICs9IGltcGwoKSB8fCAnJztcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhY2s7XG4gIH07XG59XG5cbi8qKlxuICogVXNlZCBieSBhY3QoKSB0byB0cmFjayB3aGV0aGVyIHlvdSdyZSBpbnNpZGUgYW4gYWN0KCkgc2NvcGUuXG4gKi9cbnZhciBJc1NvbWVSZW5kZXJlckFjdGluZyA9IHtcbiAgY3VycmVudDogZmFsc2Vcbn07XG5cbnZhciBSZWFjdFNoYXJlZEludGVybmFscyA9IHtcbiAgUmVhY3RDdXJyZW50RGlzcGF0Y2hlcjogUmVhY3RDdXJyZW50RGlzcGF0Y2hlcixcbiAgUmVhY3RDdXJyZW50QmF0Y2hDb25maWc6IFJlYWN0Q3VycmVudEJhdGNoQ29uZmlnLFxuICBSZWFjdEN1cnJlbnRPd25lcjogUmVhY3RDdXJyZW50T3duZXIsXG4gIElzU29tZVJlbmRlcmVyQWN0aW5nOiBJc1NvbWVSZW5kZXJlckFjdGluZyxcbiAgLy8gVXNlZCBieSByZW5kZXJlcnMgdG8gYXZvaWQgYnVuZGxpbmcgb2JqZWN0LWFzc2lnbiB0d2ljZSBpbiBVTUQgYnVuZGxlczpcbiAgYXNzaWduOiBfYXNzaWduXG59O1xuXG57XG4gIFJlYWN0U2hhcmVkSW50ZXJuYWxzLlJlYWN0RGVidWdDdXJyZW50RnJhbWUgPSBSZWFjdERlYnVnQ3VycmVudEZyYW1lO1xufVxuXG4vLyBieSBjYWxscyB0byB0aGVzZSBtZXRob2RzIGJ5IGEgQmFiZWwgcGx1Z2luLlxuLy9cbi8vIEluIFBST0QgKG9yIGluIHBhY2thZ2VzIHdpdGhvdXQgYWNjZXNzIHRvIFJlYWN0IGludGVybmFscyksXG4vLyB0aGV5IGFyZSBsZWZ0IGFzIHRoZXkgYXJlIGluc3RlYWQuXG5cbmZ1bmN0aW9uIHdhcm4oZm9ybWF0KSB7XG4gIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICBwcmludFdhcm5pbmcoJ3dhcm4nLCBmb3JtYXQsIGFyZ3MpO1xuICB9XG59XG5mdW5jdGlvbiBlcnJvcihmb3JtYXQpIHtcbiAge1xuICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuMiA+IDEgPyBfbGVuMiAtIDEgOiAwKSwgX2tleTIgPSAxOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICBhcmdzW19rZXkyIC0gMV0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgIH1cblxuICAgIHByaW50V2FybmluZygnZXJyb3InLCBmb3JtYXQsIGFyZ3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHByaW50V2FybmluZyhsZXZlbCwgZm9ybWF0LCBhcmdzKSB7XG4gIC8vIFdoZW4gY2hhbmdpbmcgdGhpcyBsb2dpYywgeW91IG1pZ2h0IHdhbnQgdG8gYWxzb1xuICAvLyB1cGRhdGUgY29uc29sZVdpdGhTdGFja0Rldi53d3cuanMgYXMgd2VsbC5cbiAge1xuICAgIHZhciBSZWFjdERlYnVnQ3VycmVudEZyYW1lID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZTtcbiAgICB2YXIgc3RhY2sgPSBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0oKTtcblxuICAgIGlmIChzdGFjayAhPT0gJycpIHtcbiAgICAgIGZvcm1hdCArPSAnJXMnO1xuICAgICAgYXJncyA9IGFyZ3MuY29uY2F0KFtzdGFja10pO1xuICAgIH1cblxuICAgIHZhciBhcmdzV2l0aEZvcm1hdCA9IGFyZ3MubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gJycgKyBpdGVtO1xuICAgIH0pOyAvLyBDYXJlZnVsOiBSTiBjdXJyZW50bHkgZGVwZW5kcyBvbiB0aGlzIHByZWZpeFxuXG4gICAgYXJnc1dpdGhGb3JtYXQudW5zaGlmdCgnV2FybmluZzogJyArIGZvcm1hdCk7IC8vIFdlIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIHNwcmVhZCAob3IgLmFwcGx5KSBkaXJlY3RseSBiZWNhdXNlIGl0XG4gICAgLy8gYnJlYWtzIElFOTogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8xMzYxMFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1pbnRlcm5hbC9uby1wcm9kdWN0aW9uLWxvZ2dpbmdcblxuICAgIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKGNvbnNvbGVbbGV2ZWxdLCBjb25zb2xlLCBhcmdzV2l0aEZvcm1hdCk7XG4gIH1cbn1cblxudmFyIGRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudCA9IHt9O1xuXG5mdW5jdGlvbiB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgY2FsbGVyTmFtZSkge1xuICB7XG4gICAgdmFyIF9jb25zdHJ1Y3RvciA9IHB1YmxpY0luc3RhbmNlLmNvbnN0cnVjdG9yO1xuICAgIHZhciBjb21wb25lbnROYW1lID0gX2NvbnN0cnVjdG9yICYmIChfY29uc3RydWN0b3IuZGlzcGxheU5hbWUgfHwgX2NvbnN0cnVjdG9yLm5hbWUpIHx8ICdSZWFjdENsYXNzJztcbiAgICB2YXIgd2FybmluZ0tleSA9IGNvbXBvbmVudE5hbWUgKyBcIi5cIiArIGNhbGxlck5hbWU7XG5cbiAgICBpZiAoZGlkV2FyblN0YXRlVXBkYXRlRm9yVW5tb3VudGVkQ29tcG9uZW50W3dhcm5pbmdLZXldKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZXJyb3IoXCJDYW4ndCBjYWxsICVzIG9uIGEgY29tcG9uZW50IHRoYXQgaXMgbm90IHlldCBtb3VudGVkLiBcIiArICdUaGlzIGlzIGEgbm8tb3AsIGJ1dCBpdCBtaWdodCBpbmRpY2F0ZSBhIGJ1ZyBpbiB5b3VyIGFwcGxpY2F0aW9uLiAnICsgJ0luc3RlYWQsIGFzc2lnbiB0byBgdGhpcy5zdGF0ZWAgZGlyZWN0bHkgb3IgZGVmaW5lIGEgYHN0YXRlID0ge307YCAnICsgJ2NsYXNzIHByb3BlcnR5IHdpdGggdGhlIGRlc2lyZWQgc3RhdGUgaW4gdGhlICVzIGNvbXBvbmVudC4nLCBjYWxsZXJOYW1lLCBjb21wb25lbnROYW1lKTtcblxuICAgIGRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudFt3YXJuaW5nS2V5XSA9IHRydWU7XG4gIH1cbn1cbi8qKlxuICogVGhpcyBpcyB0aGUgYWJzdHJhY3QgQVBJIGZvciBhbiB1cGRhdGUgcXVldWUuXG4gKi9cblxuXG52YXIgUmVhY3ROb29wVXBkYXRlUXVldWUgPSB7XG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciBvciBub3QgdGhpcyBjb21wb3NpdGUgY29tcG9uZW50IGlzIG1vdW50ZWQuXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHdlIHdhbnQgdG8gdGVzdC5cbiAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiBtb3VudGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqIEBwcm90ZWN0ZWRcbiAgICogQGZpbmFsXG4gICAqL1xuICBpc01vdW50ZWQ6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICogRm9yY2VzIGFuIHVwZGF0ZS4gVGhpcyBzaG91bGQgb25seSBiZSBpbnZva2VkIHdoZW4gaXQgaXMga25vd24gd2l0aFxuICAgKiBjZXJ0YWludHkgdGhhdCB3ZSBhcmUgKipub3QqKiBpbiBhIERPTSB0cmFuc2FjdGlvbi5cbiAgICpcbiAgICogWW91IG1heSB3YW50IHRvIGNhbGwgdGhpcyB3aGVuIHlvdSBrbm93IHRoYXQgc29tZSBkZWVwZXIgYXNwZWN0IG9mIHRoZVxuICAgKiBjb21wb25lbnQncyBzdGF0ZSBoYXMgY2hhbmdlZCBidXQgYHNldFN0YXRlYCB3YXMgbm90IGNhbGxlZC5cbiAgICpcbiAgICogVGhpcyB3aWxsIG5vdCBpbnZva2UgYHNob3VsZENvbXBvbmVudFVwZGF0ZWAsIGJ1dCBpdCB3aWxsIGludm9rZVxuICAgKiBgY29tcG9uZW50V2lsbFVwZGF0ZWAgYW5kIGBjb21wb25lbnREaWRVcGRhdGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IHNob3VsZCByZXJlbmRlci5cbiAgICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBjb21wb25lbnQgaXMgdXBkYXRlZC5cbiAgICogQHBhcmFtIHs/c3RyaW5nfSBjYWxsZXJOYW1lIG5hbWUgb2YgdGhlIGNhbGxpbmcgZnVuY3Rpb24gaW4gdGhlIHB1YmxpYyBBUEkuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZUZvcmNlVXBkYXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIGNhbGxiYWNrLCBjYWxsZXJOYW1lKSB7XG4gICAgd2Fybk5vb3AocHVibGljSW5zdGFuY2UsICdmb3JjZVVwZGF0ZScpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXBsYWNlcyBhbGwgb2YgdGhlIHN0YXRlLiBBbHdheXMgdXNlIHRoaXMgb3IgYHNldFN0YXRlYCB0byBtdXRhdGUgc3RhdGUuXG4gICAqIFlvdSBzaG91bGQgdHJlYXQgYHRoaXMuc3RhdGVgIGFzIGltbXV0YWJsZS5cbiAgICpcbiAgICogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgYHRoaXMuc3RhdGVgIHdpbGwgYmUgaW1tZWRpYXRlbHkgdXBkYXRlZCwgc29cbiAgICogYWNjZXNzaW5nIGB0aGlzLnN0YXRlYCBhZnRlciBjYWxsaW5nIHRoaXMgbWV0aG9kIG1heSByZXR1cm4gdGhlIG9sZCB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBzaG91bGQgcmVyZW5kZXIuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBjb21wbGV0ZVN0YXRlIE5leHQgc3RhdGUuXG4gICAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgY29tcG9uZW50IGlzIHVwZGF0ZWQuXG4gICAqIEBwYXJhbSB7P3N0cmluZ30gY2FsbGVyTmFtZSBuYW1lIG9mIHRoZSBjYWxsaW5nIGZ1bmN0aW9uIGluIHRoZSBwdWJsaWMgQVBJLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGVucXVldWVSZXBsYWNlU3RhdGU6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSwgY29tcGxldGVTdGF0ZSwgY2FsbGJhY2ssIGNhbGxlck5hbWUpIHtcbiAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgJ3JlcGxhY2VTdGF0ZScpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXRzIGEgc3Vic2V0IG9mIHRoZSBzdGF0ZS4gVGhpcyBvbmx5IGV4aXN0cyBiZWNhdXNlIF9wZW5kaW5nU3RhdGUgaXNcbiAgICogaW50ZXJuYWwuIFRoaXMgcHJvdmlkZXMgYSBtZXJnaW5nIHN0cmF0ZWd5IHRoYXQgaXMgbm90IGF2YWlsYWJsZSB0byBkZWVwXG4gICAqIHByb3BlcnRpZXMgd2hpY2ggaXMgY29uZnVzaW5nLiBUT0RPOiBFeHBvc2UgcGVuZGluZ1N0YXRlIG9yIGRvbid0IHVzZSBpdFxuICAgKiBkdXJpbmcgdGhlIG1lcmdlLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IHNob3VsZCByZXJlbmRlci5cbiAgICogQHBhcmFtIHtvYmplY3R9IHBhcnRpYWxTdGF0ZSBOZXh0IHBhcnRpYWwgc3RhdGUgdG8gYmUgbWVyZ2VkIHdpdGggc3RhdGUuXG4gICAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgY29tcG9uZW50IGlzIHVwZGF0ZWQuXG4gICAqIEBwYXJhbSB7P3N0cmluZ30gTmFtZSBvZiB0aGUgY2FsbGluZyBmdW5jdGlvbiBpbiB0aGUgcHVibGljIEFQSS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlU2V0U3RhdGU6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSwgcGFydGlhbFN0YXRlLCBjYWxsYmFjaywgY2FsbGVyTmFtZSkge1xuICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCAnc2V0U3RhdGUnKTtcbiAgfVxufTtcblxudmFyIGVtcHR5T2JqZWN0ID0ge307XG5cbntcbiAgT2JqZWN0LmZyZWV6ZShlbXB0eU9iamVjdCk7XG59XG4vKipcbiAqIEJhc2UgY2xhc3MgaGVscGVycyBmb3IgdGhlIHVwZGF0aW5nIHN0YXRlIG9mIGEgY29tcG9uZW50LlxuICovXG5cblxuZnVuY3Rpb24gQ29tcG9uZW50KHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDsgLy8gSWYgYSBjb21wb25lbnQgaGFzIHN0cmluZyByZWZzLCB3ZSB3aWxsIGFzc2lnbiBhIGRpZmZlcmVudCBvYmplY3QgbGF0ZXIuXG5cbiAgdGhpcy5yZWZzID0gZW1wdHlPYmplY3Q7IC8vIFdlIGluaXRpYWxpemUgdGhlIGRlZmF1bHQgdXBkYXRlciBidXQgdGhlIHJlYWwgb25lIGdldHMgaW5qZWN0ZWQgYnkgdGhlXG4gIC8vIHJlbmRlcmVyLlxuXG4gIHRoaXMudXBkYXRlciA9IHVwZGF0ZXIgfHwgUmVhY3ROb29wVXBkYXRlUXVldWU7XG59XG5cbkNvbXBvbmVudC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudCA9IHt9O1xuLyoqXG4gKiBTZXRzIGEgc3Vic2V0IG9mIHRoZSBzdGF0ZS4gQWx3YXlzIHVzZSB0aGlzIHRvIG11dGF0ZVxuICogc3RhdGUuIFlvdSBzaG91bGQgdHJlYXQgYHRoaXMuc3RhdGVgIGFzIGltbXV0YWJsZS5cbiAqXG4gKiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBgdGhpcy5zdGF0ZWAgd2lsbCBiZSBpbW1lZGlhdGVseSB1cGRhdGVkLCBzb1xuICogYWNjZXNzaW5nIGB0aGlzLnN0YXRlYCBhZnRlciBjYWxsaW5nIHRoaXMgbWV0aG9kIG1heSByZXR1cm4gdGhlIG9sZCB2YWx1ZS5cbiAqXG4gKiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBjYWxscyB0byBgc2V0U3RhdGVgIHdpbGwgcnVuIHN5bmNocm9ub3VzbHksXG4gKiBhcyB0aGV5IG1heSBldmVudHVhbGx5IGJlIGJhdGNoZWQgdG9nZXRoZXIuICBZb3UgY2FuIHByb3ZpZGUgYW4gb3B0aW9uYWxcbiAqIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBleGVjdXRlZCB3aGVuIHRoZSBjYWxsIHRvIHNldFN0YXRlIGlzIGFjdHVhbGx5XG4gKiBjb21wbGV0ZWQuXG4gKlxuICogV2hlbiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkIHRvIHNldFN0YXRlLCBpdCB3aWxsIGJlIGNhbGxlZCBhdCBzb21lIHBvaW50IGluXG4gKiB0aGUgZnV0dXJlIChub3Qgc3luY2hyb25vdXNseSkuIEl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIHVwIHRvIGRhdGVcbiAqIGNvbXBvbmVudCBhcmd1bWVudHMgKHN0YXRlLCBwcm9wcywgY29udGV4dCkuIFRoZXNlIHZhbHVlcyBjYW4gYmUgZGlmZmVyZW50XG4gKiBmcm9tIHRoaXMuKiBiZWNhdXNlIHlvdXIgZnVuY3Rpb24gbWF5IGJlIGNhbGxlZCBhZnRlciByZWNlaXZlUHJvcHMgYnV0IGJlZm9yZVxuICogc2hvdWxkQ29tcG9uZW50VXBkYXRlLCBhbmQgdGhpcyBuZXcgc3RhdGUsIHByb3BzLCBhbmQgY29udGV4dCB3aWxsIG5vdCB5ZXQgYmVcbiAqIGFzc2lnbmVkIHRvIHRoaXMuXG4gKlxuICogQHBhcmFtIHtvYmplY3R8ZnVuY3Rpb259IHBhcnRpYWxTdGF0ZSBOZXh0IHBhcnRpYWwgc3RhdGUgb3IgZnVuY3Rpb24gdG9cbiAqICAgICAgICBwcm9kdWNlIG5leHQgcGFydGlhbCBzdGF0ZSB0byBiZSBtZXJnZWQgd2l0aCBjdXJyZW50IHN0YXRlLlxuICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBzdGF0ZSBpcyB1cGRhdGVkLlxuICogQGZpbmFsXG4gKiBAcHJvdGVjdGVkXG4gKi9cblxuQ29tcG9uZW50LnByb3RvdHlwZS5zZXRTdGF0ZSA9IGZ1bmN0aW9uIChwYXJ0aWFsU3RhdGUsIGNhbGxiYWNrKSB7XG4gIGlmICghKHR5cGVvZiBwYXJ0aWFsU3RhdGUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBwYXJ0aWFsU3RhdGUgPT09ICdmdW5jdGlvbicgfHwgcGFydGlhbFN0YXRlID09IG51bGwpKSB7XG4gICAge1xuICAgICAgdGhyb3cgRXJyb3IoIFwic2V0U3RhdGUoLi4uKTogdGFrZXMgYW4gb2JqZWN0IG9mIHN0YXRlIHZhcmlhYmxlcyB0byB1cGRhdGUgb3IgYSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFuIG9iamVjdCBvZiBzdGF0ZSB2YXJpYWJsZXMuXCIgKTtcbiAgICB9XG4gIH1cblxuICB0aGlzLnVwZGF0ZXIuZW5xdWV1ZVNldFN0YXRlKHRoaXMsIHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2ssICdzZXRTdGF0ZScpO1xufTtcbi8qKlxuICogRm9yY2VzIGFuIHVwZGF0ZS4gVGhpcyBzaG91bGQgb25seSBiZSBpbnZva2VkIHdoZW4gaXQgaXMga25vd24gd2l0aFxuICogY2VydGFpbnR5IHRoYXQgd2UgYXJlICoqbm90KiogaW4gYSBET00gdHJhbnNhY3Rpb24uXG4gKlxuICogWW91IG1heSB3YW50IHRvIGNhbGwgdGhpcyB3aGVuIHlvdSBrbm93IHRoYXQgc29tZSBkZWVwZXIgYXNwZWN0IG9mIHRoZVxuICogY29tcG9uZW50J3Mgc3RhdGUgaGFzIGNoYW5nZWQgYnV0IGBzZXRTdGF0ZWAgd2FzIG5vdCBjYWxsZWQuXG4gKlxuICogVGhpcyB3aWxsIG5vdCBpbnZva2UgYHNob3VsZENvbXBvbmVudFVwZGF0ZWAsIGJ1dCBpdCB3aWxsIGludm9rZVxuICogYGNvbXBvbmVudFdpbGxVcGRhdGVgIGFuZCBgY29tcG9uZW50RGlkVXBkYXRlYC5cbiAqXG4gKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIHVwZGF0ZSBpcyBjb21wbGV0ZS5cbiAqIEBmaW5hbFxuICogQHByb3RlY3RlZFxuICovXG5cblxuQ29tcG9uZW50LnByb3RvdHlwZS5mb3JjZVVwZGF0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICB0aGlzLnVwZGF0ZXIuZW5xdWV1ZUZvcmNlVXBkYXRlKHRoaXMsIGNhbGxiYWNrLCAnZm9yY2VVcGRhdGUnKTtcbn07XG4vKipcbiAqIERlcHJlY2F0ZWQgQVBJcy4gVGhlc2UgQVBJcyB1c2VkIHRvIGV4aXN0IG9uIGNsYXNzaWMgUmVhY3QgY2xhc3NlcyBidXQgc2luY2VcbiAqIHdlIHdvdWxkIGxpa2UgdG8gZGVwcmVjYXRlIHRoZW0sIHdlJ3JlIG5vdCBnb2luZyB0byBtb3ZlIHRoZW0gb3ZlciB0byB0aGlzXG4gKiBtb2Rlcm4gYmFzZSBjbGFzcy4gSW5zdGVhZCwgd2UgZGVmaW5lIGEgZ2V0dGVyIHRoYXQgd2FybnMgaWYgaXQncyBhY2Nlc3NlZC5cbiAqL1xuXG5cbntcbiAgdmFyIGRlcHJlY2F0ZWRBUElzID0ge1xuICAgIGlzTW91bnRlZDogWydpc01vdW50ZWQnLCAnSW5zdGVhZCwgbWFrZSBzdXJlIHRvIGNsZWFuIHVwIHN1YnNjcmlwdGlvbnMgYW5kIHBlbmRpbmcgcmVxdWVzdHMgaW4gJyArICdjb21wb25lbnRXaWxsVW5tb3VudCB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcy4nXSxcbiAgICByZXBsYWNlU3RhdGU6IFsncmVwbGFjZVN0YXRlJywgJ1JlZmFjdG9yIHlvdXIgY29kZSB0byB1c2Ugc2V0U3RhdGUgaW5zdGVhZCAoc2VlICcgKyAnaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8zMjM2KS4nXVxuICB9O1xuXG4gIHZhciBkZWZpbmVEZXByZWNhdGlvbldhcm5pbmcgPSBmdW5jdGlvbiAobWV0aG9kTmFtZSwgaW5mbykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb21wb25lbnQucHJvdG90eXBlLCBtZXRob2ROYW1lLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2FybignJXMoLi4uKSBpcyBkZXByZWNhdGVkIGluIHBsYWluIEphdmFTY3JpcHQgUmVhY3QgY2xhc3Nlcy4gJXMnLCBpbmZvWzBdLCBpbmZvWzFdKTtcblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGZvciAodmFyIGZuTmFtZSBpbiBkZXByZWNhdGVkQVBJcykge1xuICAgIGlmIChkZXByZWNhdGVkQVBJcy5oYXNPd25Qcm9wZXJ0eShmbk5hbWUpKSB7XG4gICAgICBkZWZpbmVEZXByZWNhdGlvbldhcm5pbmcoZm5OYW1lLCBkZXByZWNhdGVkQVBJc1tmbk5hbWVdKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gQ29tcG9uZW50RHVtbXkoKSB7fVxuXG5Db21wb25lbnREdW1teS5wcm90b3R5cGUgPSBDb21wb25lbnQucHJvdG90eXBlO1xuLyoqXG4gKiBDb252ZW5pZW5jZSBjb21wb25lbnQgd2l0aCBkZWZhdWx0IHNoYWxsb3cgZXF1YWxpdHkgY2hlY2sgZm9yIHNDVS5cbiAqL1xuXG5mdW5jdGlvbiBQdXJlQ29tcG9uZW50KHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDsgLy8gSWYgYSBjb21wb25lbnQgaGFzIHN0cmluZyByZWZzLCB3ZSB3aWxsIGFzc2lnbiBhIGRpZmZlcmVudCBvYmplY3QgbGF0ZXIuXG5cbiAgdGhpcy5yZWZzID0gZW1wdHlPYmplY3Q7XG4gIHRoaXMudXBkYXRlciA9IHVwZGF0ZXIgfHwgUmVhY3ROb29wVXBkYXRlUXVldWU7XG59XG5cbnZhciBwdXJlQ29tcG9uZW50UHJvdG90eXBlID0gUHVyZUNvbXBvbmVudC5wcm90b3R5cGUgPSBuZXcgQ29tcG9uZW50RHVtbXkoKTtcbnB1cmVDb21wb25lbnRQcm90b3R5cGUuY29uc3RydWN0b3IgPSBQdXJlQ29tcG9uZW50OyAvLyBBdm9pZCBhbiBleHRyYSBwcm90b3R5cGUganVtcCBmb3IgdGhlc2UgbWV0aG9kcy5cblxuX2Fzc2lnbihwdXJlQ29tcG9uZW50UHJvdG90eXBlLCBDb21wb25lbnQucHJvdG90eXBlKTtcblxucHVyZUNvbXBvbmVudFByb3RvdHlwZS5pc1B1cmVSZWFjdENvbXBvbmVudCA9IHRydWU7XG5cbi8vIGFuIGltbXV0YWJsZSBvYmplY3Qgd2l0aCBhIHNpbmdsZSBtdXRhYmxlIHZhbHVlXG5mdW5jdGlvbiBjcmVhdGVSZWYoKSB7XG4gIHZhciByZWZPYmplY3QgPSB7XG4gICAgY3VycmVudDogbnVsbFxuICB9O1xuXG4gIHtcbiAgICBPYmplY3Quc2VhbChyZWZPYmplY3QpO1xuICB9XG5cbiAgcmV0dXJuIHJlZk9iamVjdDtcbn1cblxuZnVuY3Rpb24gZ2V0V3JhcHBlZE5hbWUob3V0ZXJUeXBlLCBpbm5lclR5cGUsIHdyYXBwZXJOYW1lKSB7XG4gIHZhciBmdW5jdGlvbk5hbWUgPSBpbm5lclR5cGUuZGlzcGxheU5hbWUgfHwgaW5uZXJUeXBlLm5hbWUgfHwgJyc7XG4gIHJldHVybiBvdXRlclR5cGUuZGlzcGxheU5hbWUgfHwgKGZ1bmN0aW9uTmFtZSAhPT0gJycgPyB3cmFwcGVyTmFtZSArIFwiKFwiICsgZnVuY3Rpb25OYW1lICsgXCIpXCIgOiB3cmFwcGVyTmFtZSk7XG59XG5cbmZ1bmN0aW9uIGdldENvbnRleHROYW1lKHR5cGUpIHtcbiAgcmV0dXJuIHR5cGUuZGlzcGxheU5hbWUgfHwgJ0NvbnRleHQnO1xufVxuXG5mdW5jdGlvbiBnZXRDb21wb25lbnROYW1lKHR5cGUpIHtcbiAgaWYgKHR5cGUgPT0gbnVsbCkge1xuICAgIC8vIEhvc3Qgcm9vdCwgdGV4dCBub2RlIG9yIGp1c3QgaW52YWxpZCB0eXBlLlxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAge1xuICAgIGlmICh0eXBlb2YgdHlwZS50YWcgPT09ICdudW1iZXInKSB7XG4gICAgICBlcnJvcignUmVjZWl2ZWQgYW4gdW5leHBlY3RlZCBvYmplY3QgaW4gZ2V0Q29tcG9uZW50TmFtZSgpLiAnICsgJ1RoaXMgaXMgbGlrZWx5IGEgYnVnIGluIFJlYWN0LiBQbGVhc2UgZmlsZSBhbiBpc3N1ZS4nKTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgbnVsbDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdHlwZTtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgZXhwb3J0cy5GcmFnbWVudDpcbiAgICAgIHJldHVybiAnRnJhZ21lbnQnO1xuXG4gICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgIHJldHVybiAnUG9ydGFsJztcblxuICAgIGNhc2UgZXhwb3J0cy5Qcm9maWxlcjpcbiAgICAgIHJldHVybiAnUHJvZmlsZXInO1xuXG4gICAgY2FzZSBleHBvcnRzLlN0cmljdE1vZGU6XG4gICAgICByZXR1cm4gJ1N0cmljdE1vZGUnO1xuXG4gICAgY2FzZSBleHBvcnRzLlN1c3BlbnNlOlxuICAgICAgcmV0dXJuICdTdXNwZW5zZSc7XG5cbiAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRTpcbiAgICAgIHJldHVybiAnU3VzcGVuc2VMaXN0JztcbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICBzd2l0Y2ggKHR5cGUuJCR0eXBlb2YpIHtcbiAgICAgIGNhc2UgUkVBQ1RfQ09OVEVYVF9UWVBFOlxuICAgICAgICB2YXIgY29udGV4dCA9IHR5cGU7XG4gICAgICAgIHJldHVybiBnZXRDb250ZXh0TmFtZShjb250ZXh0KSArICcuQ29uc3VtZXInO1xuXG4gICAgICBjYXNlIFJFQUNUX1BST1ZJREVSX1RZUEU6XG4gICAgICAgIHZhciBwcm92aWRlciA9IHR5cGU7XG4gICAgICAgIHJldHVybiBnZXRDb250ZXh0TmFtZShwcm92aWRlci5fY29udGV4dCkgKyAnLlByb3ZpZGVyJztcblxuICAgICAgY2FzZSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFOlxuICAgICAgICByZXR1cm4gZ2V0V3JhcHBlZE5hbWUodHlwZSwgdHlwZS5yZW5kZXIsICdGb3J3YXJkUmVmJyk7XG5cbiAgICAgIGNhc2UgUkVBQ1RfTUVNT19UWVBFOlxuICAgICAgICByZXR1cm4gZ2V0Q29tcG9uZW50TmFtZSh0eXBlLnR5cGUpO1xuXG4gICAgICBjYXNlIFJFQUNUX0JMT0NLX1RZUEU6XG4gICAgICAgIHJldHVybiBnZXRDb21wb25lbnROYW1lKHR5cGUuX3JlbmRlcik7XG5cbiAgICAgIGNhc2UgUkVBQ1RfTEFaWV9UWVBFOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIGxhenlDb21wb25lbnQgPSB0eXBlO1xuICAgICAgICAgIHZhciBwYXlsb2FkID0gbGF6eUNvbXBvbmVudC5fcGF5bG9hZDtcbiAgICAgICAgICB2YXIgaW5pdCA9IGxhenlDb21wb25lbnQuX2luaXQ7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGdldENvbXBvbmVudE5hbWUoaW5pdChwYXlsb2FkKSk7XG4gICAgICAgICAgfSBjYXRjaCAoeCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgUkVTRVJWRURfUFJPUFMgPSB7XG4gIGtleTogdHJ1ZSxcbiAgcmVmOiB0cnVlLFxuICBfX3NlbGY6IHRydWUsXG4gIF9fc291cmNlOiB0cnVlXG59O1xudmFyIHNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duLCBzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93biwgZGlkV2FybkFib3V0U3RyaW5nUmVmcztcblxue1xuICBkaWRXYXJuQWJvdXRTdHJpbmdSZWZzID0ge307XG59XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkUmVmKGNvbmZpZykge1xuICB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCAncmVmJykpIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbmZpZywgJ3JlZicpLmdldDtcblxuICAgICAgaWYgKGdldHRlciAmJiBnZXR0ZXIuaXNSZWFjdFdhcm5pbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb25maWcucmVmICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkS2V5KGNvbmZpZykge1xuICB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCAna2V5JykpIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbmZpZywgJ2tleScpLmdldDtcblxuICAgICAgaWYgKGdldHRlciAmJiBnZXR0ZXIuaXNSZWFjdFdhcm5pbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb25maWcua2V5ICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSkge1xuICB2YXIgd2FybkFib3V0QWNjZXNzaW5nS2V5ID0gZnVuY3Rpb24gKCkge1xuICAgIHtcbiAgICAgIGlmICghc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24pIHtcbiAgICAgICAgc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24gPSB0cnVlO1xuXG4gICAgICAgIGVycm9yKCclczogYGtleWAgaXMgbm90IGEgcHJvcC4gVHJ5aW5nIHRvIGFjY2VzcyBpdCB3aWxsIHJlc3VsdCAnICsgJ2luIGB1bmRlZmluZWRgIGJlaW5nIHJldHVybmVkLiBJZiB5b3UgbmVlZCB0byBhY2Nlc3MgdGhlIHNhbWUgJyArICd2YWx1ZSB3aXRoaW4gdGhlIGNoaWxkIGNvbXBvbmVudCwgeW91IHNob3VsZCBwYXNzIGl0IGFzIGEgZGlmZmVyZW50ICcgKyAncHJvcC4gKGh0dHBzOi8vcmVhY3Rqcy5vcmcvbGluay9zcGVjaWFsLXByb3BzKScsIGRpc3BsYXlOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgd2FybkFib3V0QWNjZXNzaW5nS2V5LmlzUmVhY3RXYXJuaW5nID0gdHJ1ZTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAna2V5Jywge1xuICAgIGdldDogd2FybkFib3V0QWNjZXNzaW5nS2V5LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVmaW5lUmVmUHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKSB7XG4gIHZhciB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYgPSBmdW5jdGlvbiAoKSB7XG4gICAge1xuICAgICAgaWYgKCFzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93bikge1xuICAgICAgICBzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93biA9IHRydWU7XG5cbiAgICAgICAgZXJyb3IoJyVzOiBgcmVmYCBpcyBub3QgYSBwcm9wLiBUcnlpbmcgdG8gYWNjZXNzIGl0IHdpbGwgcmVzdWx0ICcgKyAnaW4gYHVuZGVmaW5lZGAgYmVpbmcgcmV0dXJuZWQuIElmIHlvdSBuZWVkIHRvIGFjY2VzcyB0aGUgc2FtZSAnICsgJ3ZhbHVlIHdpdGhpbiB0aGUgY2hpbGQgY29tcG9uZW50LCB5b3Ugc2hvdWxkIHBhc3MgaXQgYXMgYSBkaWZmZXJlbnQgJyArICdwcm9wLiAoaHR0cHM6Ly9yZWFjdGpzLm9yZy9saW5rL3NwZWNpYWwtcHJvcHMpJywgZGlzcGxheU5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYuaXNSZWFjdFdhcm5pbmcgPSB0cnVlO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcHMsICdyZWYnLCB7XG4gICAgZ2V0OiB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG5mdW5jdGlvbiB3YXJuSWZTdHJpbmdSZWZDYW5ub3RCZUF1dG9Db252ZXJ0ZWQoY29uZmlnKSB7XG4gIHtcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5yZWYgPT09ICdzdHJpbmcnICYmIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQgJiYgY29uZmlnLl9fc2VsZiAmJiBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LnN0YXRlTm9kZSAhPT0gY29uZmlnLl9fc2VsZikge1xuICAgICAgdmFyIGNvbXBvbmVudE5hbWUgPSBnZXRDb21wb25lbnROYW1lKFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQudHlwZSk7XG5cbiAgICAgIGlmICghZGlkV2FybkFib3V0U3RyaW5nUmVmc1tjb21wb25lbnROYW1lXSkge1xuICAgICAgICBlcnJvcignQ29tcG9uZW50IFwiJXNcIiBjb250YWlucyB0aGUgc3RyaW5nIHJlZiBcIiVzXCIuICcgKyAnU3VwcG9ydCBmb3Igc3RyaW5nIHJlZnMgd2lsbCBiZSByZW1vdmVkIGluIGEgZnV0dXJlIG1ham9yIHJlbGVhc2UuICcgKyAnVGhpcyBjYXNlIGNhbm5vdCBiZSBhdXRvbWF0aWNhbGx5IGNvbnZlcnRlZCB0byBhbiBhcnJvdyBmdW5jdGlvbi4gJyArICdXZSBhc2sgeW91IHRvIG1hbnVhbGx5IGZpeCB0aGlzIGNhc2UgYnkgdXNpbmcgdXNlUmVmKCkgb3IgY3JlYXRlUmVmKCkgaW5zdGVhZC4gJyArICdMZWFybiBtb3JlIGFib3V0IHVzaW5nIHJlZnMgc2FmZWx5IGhlcmU6ICcgKyAnaHR0cHM6Ly9yZWFjdGpzLm9yZy9saW5rL3N0cmljdC1tb2RlLXN0cmluZy1yZWYnLCBjb21wb25lbnROYW1lLCBjb25maWcucmVmKTtcblxuICAgICAgICBkaWRXYXJuQWJvdXRTdHJpbmdSZWZzW2NvbXBvbmVudE5hbWVdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbi8qKlxuICogRmFjdG9yeSBtZXRob2QgdG8gY3JlYXRlIGEgbmV3IFJlYWN0IGVsZW1lbnQuIFRoaXMgbm8gbG9uZ2VyIGFkaGVyZXMgdG9cbiAqIHRoZSBjbGFzcyBwYXR0ZXJuLCBzbyBkbyBub3QgdXNlIG5ldyB0byBjYWxsIGl0LiBBbHNvLCBpbnN0YW5jZW9mIGNoZWNrXG4gKiB3aWxsIG5vdCB3b3JrLiBJbnN0ZWFkIHRlc3QgJCR0eXBlb2YgZmllbGQgYWdhaW5zdCBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykgdG8gY2hlY2tcbiAqIGlmIHNvbWV0aGluZyBpcyBhIFJlYWN0IEVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHsqfSB0eXBlXG4gKiBAcGFyYW0geyp9IHByb3BzXG4gKiBAcGFyYW0geyp9IGtleVxuICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSByZWZcbiAqIEBwYXJhbSB7Kn0gb3duZXJcbiAqIEBwYXJhbSB7Kn0gc2VsZiBBICp0ZW1wb3JhcnkqIGhlbHBlciB0byBkZXRlY3QgcGxhY2VzIHdoZXJlIGB0aGlzYCBpc1xuICogZGlmZmVyZW50IGZyb20gdGhlIGBvd25lcmAgd2hlbiBSZWFjdC5jcmVhdGVFbGVtZW50IGlzIGNhbGxlZCwgc28gdGhhdCB3ZVxuICogY2FuIHdhcm4uIFdlIHdhbnQgdG8gZ2V0IHJpZCBvZiBvd25lciBhbmQgcmVwbGFjZSBzdHJpbmcgYHJlZmBzIHdpdGggYXJyb3dcbiAqIGZ1bmN0aW9ucywgYW5kIGFzIGxvbmcgYXMgYHRoaXNgIGFuZCBvd25lciBhcmUgdGhlIHNhbWUsIHRoZXJlIHdpbGwgYmUgbm9cbiAqIGNoYW5nZSBpbiBiZWhhdmlvci5cbiAqIEBwYXJhbSB7Kn0gc291cmNlIEFuIGFubm90YXRpb24gb2JqZWN0IChhZGRlZCBieSBhIHRyYW5zcGlsZXIgb3Igb3RoZXJ3aXNlKVxuICogaW5kaWNhdGluZyBmaWxlbmFtZSwgbGluZSBudW1iZXIsIGFuZC9vciBvdGhlciBpbmZvcm1hdGlvbi5cbiAqIEBpbnRlcm5hbFxuICovXG5cblxudmFyIFJlYWN0RWxlbWVudCA9IGZ1bmN0aW9uICh0eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBvd25lciwgcHJvcHMpIHtcbiAgdmFyIGVsZW1lbnQgPSB7XG4gICAgLy8gVGhpcyB0YWcgYWxsb3dzIHVzIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IHRoaXMgYXMgYSBSZWFjdCBFbGVtZW50XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0VMRU1FTlRfVFlQRSxcbiAgICAvLyBCdWlsdC1pbiBwcm9wZXJ0aWVzIHRoYXQgYmVsb25nIG9uIHRoZSBlbGVtZW50XG4gICAgdHlwZTogdHlwZSxcbiAgICBrZXk6IGtleSxcbiAgICByZWY6IHJlZixcbiAgICBwcm9wczogcHJvcHMsXG4gICAgLy8gUmVjb3JkIHRoZSBjb21wb25lbnQgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoaXMgZWxlbWVudC5cbiAgICBfb3duZXI6IG93bmVyXG4gIH07XG5cbiAge1xuICAgIC8vIFRoZSB2YWxpZGF0aW9uIGZsYWcgaXMgY3VycmVudGx5IG11dGF0aXZlLiBXZSBwdXQgaXQgb25cbiAgICAvLyBhbiBleHRlcm5hbCBiYWNraW5nIHN0b3JlIHNvIHRoYXQgd2UgY2FuIGZyZWV6ZSB0aGUgd2hvbGUgb2JqZWN0LlxuICAgIC8vIFRoaXMgY2FuIGJlIHJlcGxhY2VkIHdpdGggYSBXZWFrTWFwIG9uY2UgdGhleSBhcmUgaW1wbGVtZW50ZWQgaW5cbiAgICAvLyBjb21tb25seSB1c2VkIGRldmVsb3BtZW50IGVudmlyb25tZW50cy5cbiAgICBlbGVtZW50Ll9zdG9yZSA9IHt9OyAvLyBUbyBtYWtlIGNvbXBhcmluZyBSZWFjdEVsZW1lbnRzIGVhc2llciBmb3IgdGVzdGluZyBwdXJwb3Nlcywgd2UgbWFrZVxuICAgIC8vIHRoZSB2YWxpZGF0aW9uIGZsYWcgbm9uLWVudW1lcmFibGUgKHdoZXJlIHBvc3NpYmxlLCB3aGljaCBzaG91bGRcbiAgICAvLyBpbmNsdWRlIGV2ZXJ5IGVudmlyb25tZW50IHdlIHJ1biB0ZXN0cyBpbiksIHNvIHRoZSB0ZXN0IGZyYW1ld29ya1xuICAgIC8vIGlnbm9yZXMgaXQuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudC5fc3RvcmUsICd2YWxpZGF0ZWQnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiBmYWxzZVxuICAgIH0pOyAvLyBzZWxmIGFuZCBzb3VyY2UgYXJlIERFViBvbmx5IHByb3BlcnRpZXMuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudCwgJ19zZWxmJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHNlbGZcbiAgICB9KTsgLy8gVHdvIGVsZW1lbnRzIGNyZWF0ZWQgaW4gdHdvIGRpZmZlcmVudCBwbGFjZXMgc2hvdWxkIGJlIGNvbnNpZGVyZWRcbiAgICAvLyBlcXVhbCBmb3IgdGVzdGluZyBwdXJwb3NlcyBhbmQgdGhlcmVmb3JlIHdlIGhpZGUgaXQgZnJvbSBlbnVtZXJhdGlvbi5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50LCAnX3NvdXJjZScsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBzb3VyY2VcbiAgICB9KTtcblxuICAgIGlmIChPYmplY3QuZnJlZXplKSB7XG4gICAgICBPYmplY3QuZnJlZXplKGVsZW1lbnQucHJvcHMpO1xuICAgICAgT2JqZWN0LmZyZWV6ZShlbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWxlbWVudDtcbn07XG4vKipcbiAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgbmV3IFJlYWN0RWxlbWVudCBvZiB0aGUgZ2l2ZW4gdHlwZS5cbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjY3JlYXRlZWxlbWVudFxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgY29uZmlnLCBjaGlsZHJlbikge1xuICB2YXIgcHJvcE5hbWU7IC8vIFJlc2VydmVkIG5hbWVzIGFyZSBleHRyYWN0ZWRcblxuICB2YXIgcHJvcHMgPSB7fTtcbiAgdmFyIGtleSA9IG51bGw7XG4gIHZhciByZWYgPSBudWxsO1xuICB2YXIgc2VsZiA9IG51bGw7XG4gIHZhciBzb3VyY2UgPSBudWxsO1xuXG4gIGlmIChjb25maWcgIT0gbnVsbCkge1xuICAgIGlmIChoYXNWYWxpZFJlZihjb25maWcpKSB7XG4gICAgICByZWYgPSBjb25maWcucmVmO1xuXG4gICAgICB7XG4gICAgICAgIHdhcm5JZlN0cmluZ1JlZkNhbm5vdEJlQXV0b0NvbnZlcnRlZChjb25maWcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNWYWxpZEtleShjb25maWcpKSB7XG4gICAgICBrZXkgPSAnJyArIGNvbmZpZy5rZXk7XG4gICAgfVxuXG4gICAgc2VsZiA9IGNvbmZpZy5fX3NlbGYgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb25maWcuX19zZWxmO1xuICAgIHNvdXJjZSA9IGNvbmZpZy5fX3NvdXJjZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGNvbmZpZy5fX3NvdXJjZTsgLy8gUmVtYWluaW5nIHByb3BlcnRpZXMgYXJlIGFkZGVkIHRvIGEgbmV3IHByb3BzIG9iamVjdFxuXG4gICAgZm9yIChwcm9wTmFtZSBpbiBjb25maWcpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgcHJvcE5hbWUpICYmICFSRVNFUlZFRF9QUk9QUy5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcbiAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gY29uZmlnW3Byb3BOYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH0gLy8gQ2hpbGRyZW4gY2FuIGJlIG1vcmUgdGhhbiBvbmUgYXJndW1lbnQsIGFuZCB0aG9zZSBhcmUgdHJhbnNmZXJyZWQgb250b1xuICAvLyB0aGUgbmV3bHkgYWxsb2NhdGVkIHByb3BzIG9iamVjdC5cblxuXG4gIHZhciBjaGlsZHJlbkxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGggLSAyO1xuXG4gIGlmIChjaGlsZHJlbkxlbmd0aCA9PT0gMSkge1xuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAoY2hpbGRyZW5MZW5ndGggPiAxKSB7XG4gICAgdmFyIGNoaWxkQXJyYXkgPSBBcnJheShjaGlsZHJlbkxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkQXJyYXlbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIH1cblxuICAgIHtcbiAgICAgIGlmIChPYmplY3QuZnJlZXplKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUoY2hpbGRBcnJheSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZEFycmF5O1xuICB9IC8vIFJlc29sdmUgZGVmYXVsdCBwcm9wc1xuXG5cbiAgaWYgKHR5cGUgJiYgdHlwZS5kZWZhdWx0UHJvcHMpIHtcbiAgICB2YXIgZGVmYXVsdFByb3BzID0gdHlwZS5kZWZhdWx0UHJvcHM7XG5cbiAgICBmb3IgKHByb3BOYW1lIGluIGRlZmF1bHRQcm9wcykge1xuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGRlZmF1bHRQcm9wc1twcm9wTmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAge1xuICAgIGlmIChrZXkgfHwgcmVmKSB7XG4gICAgICB2YXIgZGlzcGxheU5hbWUgPSB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyA/IHR5cGUuZGlzcGxheU5hbWUgfHwgdHlwZS5uYW1lIHx8ICdVbmtub3duJyA6IHR5cGU7XG5cbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgZGVmaW5lS2V5UHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlZikge1xuICAgICAgICBkZWZpbmVSZWZQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBSZWFjdEVsZW1lbnQodHlwZSwga2V5LCByZWYsIHNlbGYsIHNvdXJjZSwgUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCwgcHJvcHMpO1xufVxuZnVuY3Rpb24gY2xvbmVBbmRSZXBsYWNlS2V5KG9sZEVsZW1lbnQsIG5ld0tleSkge1xuICB2YXIgbmV3RWxlbWVudCA9IFJlYWN0RWxlbWVudChvbGRFbGVtZW50LnR5cGUsIG5ld0tleSwgb2xkRWxlbWVudC5yZWYsIG9sZEVsZW1lbnQuX3NlbGYsIG9sZEVsZW1lbnQuX3NvdXJjZSwgb2xkRWxlbWVudC5fb3duZXIsIG9sZEVsZW1lbnQucHJvcHMpO1xuICByZXR1cm4gbmV3RWxlbWVudDtcbn1cbi8qKlxuICogQ2xvbmUgYW5kIHJldHVybiBhIG5ldyBSZWFjdEVsZW1lbnQgdXNpbmcgZWxlbWVudCBhcyB0aGUgc3RhcnRpbmcgcG9pbnQuXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI2Nsb25lZWxlbWVudFxuICovXG5cbmZ1bmN0aW9uIGNsb25lRWxlbWVudChlbGVtZW50LCBjb25maWcsIGNoaWxkcmVuKSB7XG4gIGlmICghIShlbGVtZW50ID09PSBudWxsIHx8IGVsZW1lbnQgPT09IHVuZGVmaW5lZCkpIHtcbiAgICB7XG4gICAgICB0aHJvdyBFcnJvciggXCJSZWFjdC5jbG9uZUVsZW1lbnQoLi4uKTogVGhlIGFyZ3VtZW50IG11c3QgYmUgYSBSZWFjdCBlbGVtZW50LCBidXQgeW91IHBhc3NlZCBcIiArIGVsZW1lbnQgKyBcIi5cIiApO1xuICAgIH1cbiAgfVxuXG4gIHZhciBwcm9wTmFtZTsgLy8gT3JpZ2luYWwgcHJvcHMgYXJlIGNvcGllZFxuXG4gIHZhciBwcm9wcyA9IF9hc3NpZ24oe30sIGVsZW1lbnQucHJvcHMpOyAvLyBSZXNlcnZlZCBuYW1lcyBhcmUgZXh0cmFjdGVkXG5cblxuICB2YXIga2V5ID0gZWxlbWVudC5rZXk7XG4gIHZhciByZWYgPSBlbGVtZW50LnJlZjsgLy8gU2VsZiBpcyBwcmVzZXJ2ZWQgc2luY2UgdGhlIG93bmVyIGlzIHByZXNlcnZlZC5cblxuICB2YXIgc2VsZiA9IGVsZW1lbnQuX3NlbGY7IC8vIFNvdXJjZSBpcyBwcmVzZXJ2ZWQgc2luY2UgY2xvbmVFbGVtZW50IGlzIHVubGlrZWx5IHRvIGJlIHRhcmdldGVkIGJ5IGFcbiAgLy8gdHJhbnNwaWxlciwgYW5kIHRoZSBvcmlnaW5hbCBzb3VyY2UgaXMgcHJvYmFibHkgYSBiZXR0ZXIgaW5kaWNhdG9yIG9mIHRoZVxuICAvLyB0cnVlIG93bmVyLlxuXG4gIHZhciBzb3VyY2UgPSBlbGVtZW50Ll9zb3VyY2U7IC8vIE93bmVyIHdpbGwgYmUgcHJlc2VydmVkLCB1bmxlc3MgcmVmIGlzIG92ZXJyaWRkZW5cblxuICB2YXIgb3duZXIgPSBlbGVtZW50Ll9vd25lcjtcblxuICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICBpZiAoaGFzVmFsaWRSZWYoY29uZmlnKSkge1xuICAgICAgLy8gU2lsZW50bHkgc3RlYWwgdGhlIHJlZiBmcm9tIHRoZSBwYXJlbnQuXG4gICAgICByZWYgPSBjb25maWcucmVmO1xuICAgICAgb3duZXIgPSBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50O1xuICAgIH1cblxuICAgIGlmIChoYXNWYWxpZEtleShjb25maWcpKSB7XG4gICAgICBrZXkgPSAnJyArIGNvbmZpZy5rZXk7XG4gICAgfSAvLyBSZW1haW5pbmcgcHJvcGVydGllcyBvdmVycmlkZSBleGlzdGluZyBwcm9wc1xuXG5cbiAgICB2YXIgZGVmYXVsdFByb3BzO1xuXG4gICAgaWYgKGVsZW1lbnQudHlwZSAmJiBlbGVtZW50LnR5cGUuZGVmYXVsdFByb3BzKSB7XG4gICAgICBkZWZhdWx0UHJvcHMgPSBlbGVtZW50LnR5cGUuZGVmYXVsdFByb3BzO1xuICAgIH1cblxuICAgIGZvciAocHJvcE5hbWUgaW4gY29uZmlnKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsIHByb3BOYW1lKSAmJiAhUkVTRVJWRURfUFJPUFMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgIGlmIChjb25maWdbcHJvcE5hbWVdID09PSB1bmRlZmluZWQgJiYgZGVmYXVsdFByb3BzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBSZXNvbHZlIGRlZmF1bHQgcHJvcHNcbiAgICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBkZWZhdWx0UHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gLy8gQ2hpbGRyZW4gY2FuIGJlIG1vcmUgdGhhbiBvbmUgYXJndW1lbnQsIGFuZCB0aG9zZSBhcmUgdHJhbnNmZXJyZWQgb250b1xuICAvLyB0aGUgbmV3bHkgYWxsb2NhdGVkIHByb3BzIG9iamVjdC5cblxuXG4gIHZhciBjaGlsZHJlbkxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGggLSAyO1xuXG4gIGlmIChjaGlsZHJlbkxlbmd0aCA9PT0gMSkge1xuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAoY2hpbGRyZW5MZW5ndGggPiAxKSB7XG4gICAgdmFyIGNoaWxkQXJyYXkgPSBBcnJheShjaGlsZHJlbkxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkQXJyYXlbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIH1cblxuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRBcnJheTtcbiAgfVxuXG4gIHJldHVybiBSZWFjdEVsZW1lbnQoZWxlbWVudC50eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBvd25lciwgcHJvcHMpO1xufVxuLyoqXG4gKiBWZXJpZmllcyB0aGUgb2JqZWN0IGlzIGEgUmVhY3RFbGVtZW50LlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNpc3ZhbGlkZWxlbWVudFxuICogQHBhcmFtIHs/b2JqZWN0fSBvYmplY3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgYG9iamVjdGAgaXMgYSBSZWFjdEVsZW1lbnQuXG4gKiBAZmluYWxcbiAqL1xuXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCAmJiBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbn1cblxudmFyIFNFUEFSQVRPUiA9ICcuJztcbnZhciBTVUJTRVBBUkFUT1IgPSAnOic7XG4vKipcbiAqIEVzY2FwZSBhbmQgd3JhcCBrZXkgc28gaXQgaXMgc2FmZSB0byB1c2UgYXMgYSByZWFjdGlkXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSB0byBiZSBlc2NhcGVkLlxuICogQHJldHVybiB7c3RyaW5nfSB0aGUgZXNjYXBlZCBrZXkuXG4gKi9cblxuZnVuY3Rpb24gZXNjYXBlKGtleSkge1xuICB2YXIgZXNjYXBlUmVnZXggPSAvWz06XS9nO1xuICB2YXIgZXNjYXBlckxvb2t1cCA9IHtcbiAgICAnPSc6ICc9MCcsXG4gICAgJzonOiAnPTInXG4gIH07XG4gIHZhciBlc2NhcGVkU3RyaW5nID0ga2V5LnJlcGxhY2UoZXNjYXBlUmVnZXgsIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgIHJldHVybiBlc2NhcGVyTG9va3VwW21hdGNoXTtcbiAgfSk7XG4gIHJldHVybiAnJCcgKyBlc2NhcGVkU3RyaW5nO1xufVxuLyoqXG4gKiBUT0RPOiBUZXN0IHRoYXQgYSBzaW5nbGUgY2hpbGQgYW5kIGFuIGFycmF5IHdpdGggb25lIGl0ZW0gaGF2ZSB0aGUgc2FtZSBrZXlcbiAqIHBhdHRlcm4uXG4gKi9cblxuXG52YXIgZGlkV2FybkFib3V0TWFwcyA9IGZhbHNlO1xudmFyIHVzZXJQcm92aWRlZEtleUVzY2FwZVJlZ2V4ID0gL1xcLysvZztcblxuZnVuY3Rpb24gZXNjYXBlVXNlclByb3ZpZGVkS2V5KHRleHQpIHtcbiAgcmV0dXJuIHRleHQucmVwbGFjZSh1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCwgJyQmLycpO1xufVxuLyoqXG4gKiBHZW5lcmF0ZSBhIGtleSBzdHJpbmcgdGhhdCBpZGVudGlmaWVzIGEgZWxlbWVudCB3aXRoaW4gYSBzZXQuXG4gKlxuICogQHBhcmFtIHsqfSBlbGVtZW50IEEgZWxlbWVudCB0aGF0IGNvdWxkIGNvbnRhaW4gYSBtYW51YWwga2V5LlxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IEluZGV4IHRoYXQgaXMgdXNlZCBpZiBhIG1hbnVhbCBrZXkgaXMgbm90IHByb3ZpZGVkLlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5cblxuZnVuY3Rpb24gZ2V0RWxlbWVudEtleShlbGVtZW50LCBpbmRleCkge1xuICAvLyBEbyBzb21lIHR5cGVjaGVja2luZyBoZXJlIHNpbmNlIHdlIGNhbGwgdGhpcyBibGluZGx5LiBXZSB3YW50IHRvIGVuc3VyZVxuICAvLyB0aGF0IHdlIGRvbid0IGJsb2NrIHBvdGVudGlhbCBmdXR1cmUgRVMgQVBJcy5cbiAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnb2JqZWN0JyAmJiBlbGVtZW50ICE9PSBudWxsICYmIGVsZW1lbnQua2V5ICE9IG51bGwpIHtcbiAgICAvLyBFeHBsaWNpdCBrZXlcbiAgICByZXR1cm4gZXNjYXBlKCcnICsgZWxlbWVudC5rZXkpO1xuICB9IC8vIEltcGxpY2l0IGtleSBkZXRlcm1pbmVkIGJ5IHRoZSBpbmRleCBpbiB0aGUgc2V0XG5cblxuICByZXR1cm4gaW5kZXgudG9TdHJpbmcoMzYpO1xufVxuXG5mdW5jdGlvbiBtYXBJbnRvQXJyYXkoY2hpbGRyZW4sIGFycmF5LCBlc2NhcGVkUHJlZml4LCBuYW1lU29GYXIsIGNhbGxiYWNrKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIGNoaWxkcmVuO1xuXG4gIGlmICh0eXBlID09PSAndW5kZWZpbmVkJyB8fCB0eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAvLyBBbGwgb2YgdGhlIGFib3ZlIGFyZSBwZXJjZWl2ZWQgYXMgbnVsbC5cbiAgICBjaGlsZHJlbiA9IG51bGw7XG4gIH1cblxuICB2YXIgaW52b2tlQ2FsbGJhY2sgPSBmYWxzZTtcblxuICBpZiAoY2hpbGRyZW4gPT09IG51bGwpIHtcbiAgICBpbnZva2VDYWxsYmFjayA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgaW52b2tlQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgc3dpdGNoIChjaGlsZHJlbi4kJHR5cGVvZikge1xuICAgICAgICAgIGNhc2UgUkVBQ1RfRUxFTUVOVF9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfUE9SVEFMX1RZUEU6XG4gICAgICAgICAgICBpbnZva2VDYWxsYmFjayA9IHRydWU7XG4gICAgICAgIH1cblxuICAgIH1cbiAgfVxuXG4gIGlmIChpbnZva2VDYWxsYmFjaykge1xuICAgIHZhciBfY2hpbGQgPSBjaGlsZHJlbjtcbiAgICB2YXIgbWFwcGVkQ2hpbGQgPSBjYWxsYmFjayhfY2hpbGQpOyAvLyBJZiBpdCdzIHRoZSBvbmx5IGNoaWxkLCB0cmVhdCB0aGUgbmFtZSBhcyBpZiBpdCB3YXMgd3JhcHBlZCBpbiBhbiBhcnJheVxuICAgIC8vIHNvIHRoYXQgaXQncyBjb25zaXN0ZW50IGlmIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gZ3Jvd3M6XG5cbiAgICB2YXIgY2hpbGRLZXkgPSBuYW1lU29GYXIgPT09ICcnID8gU0VQQVJBVE9SICsgZ2V0RWxlbWVudEtleShfY2hpbGQsIDApIDogbmFtZVNvRmFyO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobWFwcGVkQ2hpbGQpKSB7XG4gICAgICB2YXIgZXNjYXBlZENoaWxkS2V5ID0gJyc7XG5cbiAgICAgIGlmIChjaGlsZEtleSAhPSBudWxsKSB7XG4gICAgICAgIGVzY2FwZWRDaGlsZEtleSA9IGVzY2FwZVVzZXJQcm92aWRlZEtleShjaGlsZEtleSkgKyAnLyc7XG4gICAgICB9XG5cbiAgICAgIG1hcEludG9BcnJheShtYXBwZWRDaGlsZCwgYXJyYXksIGVzY2FwZWRDaGlsZEtleSwgJycsIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIHJldHVybiBjO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChtYXBwZWRDaGlsZCAhPSBudWxsKSB7XG4gICAgICBpZiAoaXNWYWxpZEVsZW1lbnQobWFwcGVkQ2hpbGQpKSB7XG4gICAgICAgIG1hcHBlZENoaWxkID0gY2xvbmVBbmRSZXBsYWNlS2V5KG1hcHBlZENoaWxkLCAvLyBLZWVwIGJvdGggdGhlIChtYXBwZWQpIGFuZCBvbGQga2V5cyBpZiB0aGV5IGRpZmZlciwganVzdCBhc1xuICAgICAgICAvLyB0cmF2ZXJzZUFsbENoaWxkcmVuIHVzZWQgdG8gZG8gZm9yIG9iamVjdHMgYXMgY2hpbGRyZW5cbiAgICAgICAgZXNjYXBlZFByZWZpeCArICggLy8gJEZsb3dGaXhNZSBGbG93IGluY29ycmVjdGx5IHRoaW5rcyBSZWFjdC5Qb3J0YWwgZG9lc24ndCBoYXZlIGEga2V5XG4gICAgICAgIG1hcHBlZENoaWxkLmtleSAmJiAoIV9jaGlsZCB8fCBfY2hpbGQua2V5ICE9PSBtYXBwZWRDaGlsZC5rZXkpID8gLy8gJEZsb3dGaXhNZSBGbG93IGluY29ycmVjdGx5IHRoaW5rcyBleGlzdGluZyBlbGVtZW50J3Mga2V5IGNhbiBiZSBhIG51bWJlclxuICAgICAgICBlc2NhcGVVc2VyUHJvdmlkZWRLZXkoJycgKyBtYXBwZWRDaGlsZC5rZXkpICsgJy8nIDogJycpICsgY2hpbGRLZXkpO1xuICAgICAgfVxuXG4gICAgICBhcnJheS5wdXNoKG1hcHBlZENoaWxkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIHZhciBjaGlsZDtcbiAgdmFyIG5leHROYW1lO1xuICB2YXIgc3VidHJlZUNvdW50ID0gMDsgLy8gQ291bnQgb2YgY2hpbGRyZW4gZm91bmQgaW4gdGhlIGN1cnJlbnQgc3VidHJlZS5cblxuICB2YXIgbmV4dE5hbWVQcmVmaXggPSBuYW1lU29GYXIgPT09ICcnID8gU0VQQVJBVE9SIDogbmFtZVNvRmFyICsgU1VCU0VQQVJBVE9SO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICBuZXh0TmFtZSA9IG5leHROYW1lUHJlZml4ICsgZ2V0RWxlbWVudEtleShjaGlsZCwgaSk7XG4gICAgICBzdWJ0cmVlQ291bnQgKz0gbWFwSW50b0FycmF5KGNoaWxkLCBhcnJheSwgZXNjYXBlZFByZWZpeCwgbmV4dE5hbWUsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKGNoaWxkcmVuKTtcblxuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIGl0ZXJhYmxlQ2hpbGRyZW4gPSBjaGlsZHJlbjtcblxuICAgICAge1xuICAgICAgICAvLyBXYXJuIGFib3V0IHVzaW5nIE1hcHMgYXMgY2hpbGRyZW5cbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4gPT09IGl0ZXJhYmxlQ2hpbGRyZW4uZW50cmllcykge1xuICAgICAgICAgIGlmICghZGlkV2FybkFib3V0TWFwcykge1xuICAgICAgICAgICAgd2FybignVXNpbmcgTWFwcyBhcyBjaGlsZHJlbiBpcyBub3Qgc3VwcG9ydGVkLiAnICsgJ1VzZSBhbiBhcnJheSBvZiBrZXllZCBSZWFjdEVsZW1lbnRzIGluc3RlYWQuJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGlkV2FybkFib3V0TWFwcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKGl0ZXJhYmxlQ2hpbGRyZW4pO1xuICAgICAgdmFyIHN0ZXA7XG4gICAgICB2YXIgaWkgPSAwO1xuXG4gICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgIGNoaWxkID0gc3RlcC52YWx1ZTtcbiAgICAgICAgbmV4dE5hbWUgPSBuZXh0TmFtZVByZWZpeCArIGdldEVsZW1lbnRLZXkoY2hpbGQsIGlpKyspO1xuICAgICAgICBzdWJ0cmVlQ291bnQgKz0gbWFwSW50b0FycmF5KGNoaWxkLCBhcnJheSwgZXNjYXBlZFByZWZpeCwgbmV4dE5hbWUsIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICB2YXIgY2hpbGRyZW5TdHJpbmcgPSAnJyArIGNoaWxkcmVuO1xuXG4gICAgICB7XG4gICAgICAgIHtcbiAgICAgICAgICB0aHJvdyBFcnJvciggXCJPYmplY3RzIGFyZSBub3QgdmFsaWQgYXMgYSBSZWFjdCBjaGlsZCAoZm91bmQ6IFwiICsgKGNoaWxkcmVuU3RyaW5nID09PSAnW29iamVjdCBPYmplY3RdJyA/ICdvYmplY3Qgd2l0aCBrZXlzIHsnICsgT2JqZWN0LmtleXMoY2hpbGRyZW4pLmpvaW4oJywgJykgKyAnfScgOiBjaGlsZHJlblN0cmluZykgKyBcIikuIElmIHlvdSBtZWFudCB0byByZW5kZXIgYSBjb2xsZWN0aW9uIG9mIGNoaWxkcmVuLCB1c2UgYW4gYXJyYXkgaW5zdGVhZC5cIiApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN1YnRyZWVDb3VudDtcbn1cblxuLyoqXG4gKiBNYXBzIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5tYXBcbiAqXG4gKiBUaGUgcHJvdmlkZWQgbWFwRnVuY3Rpb24oY2hpbGQsIGluZGV4KSB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaFxuICogbGVhZiBjaGlsZC5cbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKiwgaW50KX0gZnVuYyBUaGUgbWFwIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSBjb250ZXh0IENvbnRleHQgZm9yIG1hcEZ1bmN0aW9uLlxuICogQHJldHVybiB7b2JqZWN0fSBPYmplY3QgY29udGFpbmluZyB0aGUgb3JkZXJlZCBtYXAgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gbWFwQ2hpbGRyZW4oY2hpbGRyZW4sIGZ1bmMsIGNvbnRleHQpIHtcbiAgaWYgKGNoaWxkcmVuID09IG51bGwpIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cblxuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBjb3VudCA9IDA7XG4gIG1hcEludG9BcnJheShjaGlsZHJlbiwgcmVzdWx0LCAnJywgJycsIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgY2hpbGQsIGNvdW50KyspO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICogQ291bnQgdGhlIG51bWJlciBvZiBjaGlsZHJlbiB0aGF0IGFyZSB0eXBpY2FsbHkgc3BlY2lmaWVkIGFzXG4gKiBgcHJvcHMuY2hpbGRyZW5gLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbmNvdW50XG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hpbGRyZW4uXG4gKi9cblxuXG5mdW5jdGlvbiBjb3VudENoaWxkcmVuKGNoaWxkcmVuKSB7XG4gIHZhciBuID0gMDtcbiAgbWFwQ2hpbGRyZW4oY2hpbGRyZW4sIGZ1bmN0aW9uICgpIHtcbiAgICBuKys7IC8vIERvbid0IHJldHVybiBhbnl0aGluZ1xuICB9KTtcbiAgcmV0dXJuIG47XG59XG5cbi8qKlxuICogSXRlcmF0ZXMgdGhyb3VnaCBjaGlsZHJlbiB0aGF0IGFyZSB0eXBpY2FsbHkgc3BlY2lmaWVkIGFzIGBwcm9wcy5jaGlsZHJlbmAuXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVuZm9yZWFjaFxuICpcbiAqIFRoZSBwcm92aWRlZCBmb3JFYWNoRnVuYyhjaGlsZCwgaW5kZXgpIHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoXG4gKiBsZWFmIGNoaWxkLlxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHBhcmFtIHtmdW5jdGlvbigqLCBpbnQpfSBmb3JFYWNoRnVuY1xuICogQHBhcmFtIHsqfSBmb3JFYWNoQ29udGV4dCBDb250ZXh0IGZvciBmb3JFYWNoQ29udGV4dC5cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaENoaWxkcmVuKGNoaWxkcmVuLCBmb3JFYWNoRnVuYywgZm9yRWFjaENvbnRleHQpIHtcbiAgbWFwQ2hpbGRyZW4oY2hpbGRyZW4sIGZ1bmN0aW9uICgpIHtcbiAgICBmb3JFYWNoRnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyAvLyBEb24ndCByZXR1cm4gYW55dGhpbmcuXG4gIH0sIGZvckVhY2hDb250ZXh0KTtcbn1cbi8qKlxuICogRmxhdHRlbiBhIGNoaWxkcmVuIG9iamVjdCAodHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gKSBhbmRcbiAqIHJldHVybiBhbiBhcnJheSB3aXRoIGFwcHJvcHJpYXRlbHkgcmUta2V5ZWQgY2hpbGRyZW4uXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVudG9hcnJheVxuICovXG5cblxuZnVuY3Rpb24gdG9BcnJheShjaGlsZHJlbikge1xuICByZXR1cm4gbWFwQ2hpbGRyZW4oY2hpbGRyZW4sIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIHJldHVybiBjaGlsZDtcbiAgfSkgfHwgW107XG59XG4vKipcbiAqIFJldHVybnMgdGhlIGZpcnN0IGNoaWxkIGluIGEgY29sbGVjdGlvbiBvZiBjaGlsZHJlbiBhbmQgdmVyaWZpZXMgdGhhdCB0aGVyZVxuICogaXMgb25seSBvbmUgY2hpbGQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVub25seVxuICpcbiAqIFRoZSBjdXJyZW50IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgZnVuY3Rpb24gYXNzdW1lcyB0aGF0IGEgc2luZ2xlIGNoaWxkIGdldHNcbiAqIHBhc3NlZCB3aXRob3V0IGEgd3JhcHBlciwgYnV0IHRoZSBwdXJwb3NlIG9mIHRoaXMgaGVscGVyIGZ1bmN0aW9uIGlzIHRvXG4gKiBhYnN0cmFjdCBhd2F5IHRoZSBwYXJ0aWN1bGFyIHN0cnVjdHVyZSBvZiBjaGlsZHJlbi5cbiAqXG4gKiBAcGFyYW0gez9vYmplY3R9IGNoaWxkcmVuIENoaWxkIGNvbGxlY3Rpb24gc3RydWN0dXJlLlxuICogQHJldHVybiB7UmVhY3RFbGVtZW50fSBUaGUgZmlyc3QgYW5kIG9ubHkgYFJlYWN0RWxlbWVudGAgY29udGFpbmVkIGluIHRoZVxuICogc3RydWN0dXJlLlxuICovXG5cblxuZnVuY3Rpb24gb25seUNoaWxkKGNoaWxkcmVuKSB7XG4gIGlmICghaXNWYWxpZEVsZW1lbnQoY2hpbGRyZW4pKSB7XG4gICAge1xuICAgICAgdGhyb3cgRXJyb3IoIFwiUmVhY3QuQ2hpbGRyZW4ub25seSBleHBlY3RlZCB0byByZWNlaXZlIGEgc2luZ2xlIFJlYWN0IGVsZW1lbnQgY2hpbGQuXCIgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY2hpbGRyZW47XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnRleHQoZGVmYXVsdFZhbHVlLCBjYWxjdWxhdGVDaGFuZ2VkQml0cykge1xuICBpZiAoY2FsY3VsYXRlQ2hhbmdlZEJpdHMgPT09IHVuZGVmaW5lZCkge1xuICAgIGNhbGN1bGF0ZUNoYW5nZWRCaXRzID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICB7XG4gICAgICBpZiAoY2FsY3VsYXRlQ2hhbmdlZEJpdHMgIT09IG51bGwgJiYgdHlwZW9mIGNhbGN1bGF0ZUNoYW5nZWRCaXRzICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGVycm9yKCdjcmVhdGVDb250ZXh0OiBFeHBlY3RlZCB0aGUgb3B0aW9uYWwgc2Vjb25kIGFyZ3VtZW50IHRvIGJlIGEgJyArICdmdW5jdGlvbi4gSW5zdGVhZCByZWNlaXZlZDogJXMnLCBjYWxjdWxhdGVDaGFuZ2VkQml0cyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFyIGNvbnRleHQgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0NPTlRFWFRfVFlQRSxcbiAgICBfY2FsY3VsYXRlQ2hhbmdlZEJpdHM6IGNhbGN1bGF0ZUNoYW5nZWRCaXRzLFxuICAgIC8vIEFzIGEgd29ya2Fyb3VuZCB0byBzdXBwb3J0IG11bHRpcGxlIGNvbmN1cnJlbnQgcmVuZGVyZXJzLCB3ZSBjYXRlZ29yaXplXG4gICAgLy8gc29tZSByZW5kZXJlcnMgYXMgcHJpbWFyeSBhbmQgb3RoZXJzIGFzIHNlY29uZGFyeS4gV2Ugb25seSBleHBlY3RcbiAgICAvLyB0aGVyZSB0byBiZSB0d28gY29uY3VycmVudCByZW5kZXJlcnMgYXQgbW9zdDogUmVhY3QgTmF0aXZlIChwcmltYXJ5KSBhbmRcbiAgICAvLyBGYWJyaWMgKHNlY29uZGFyeSk7IFJlYWN0IERPTSAocHJpbWFyeSkgYW5kIFJlYWN0IEFSVCAoc2Vjb25kYXJ5KS5cbiAgICAvLyBTZWNvbmRhcnkgcmVuZGVyZXJzIHN0b3JlIHRoZWlyIGNvbnRleHQgdmFsdWVzIG9uIHNlcGFyYXRlIGZpZWxkcy5cbiAgICBfY3VycmVudFZhbHVlOiBkZWZhdWx0VmFsdWUsXG4gICAgX2N1cnJlbnRWYWx1ZTI6IGRlZmF1bHRWYWx1ZSxcbiAgICAvLyBVc2VkIHRvIHRyYWNrIGhvdyBtYW55IGNvbmN1cnJlbnQgcmVuZGVyZXJzIHRoaXMgY29udGV4dCBjdXJyZW50bHlcbiAgICAvLyBzdXBwb3J0cyB3aXRoaW4gaW4gYSBzaW5nbGUgcmVuZGVyZXIuIFN1Y2ggYXMgcGFyYWxsZWwgc2VydmVyIHJlbmRlcmluZy5cbiAgICBfdGhyZWFkQ291bnQ6IDAsXG4gICAgLy8gVGhlc2UgYXJlIGNpcmN1bGFyXG4gICAgUHJvdmlkZXI6IG51bGwsXG4gICAgQ29uc3VtZXI6IG51bGxcbiAgfTtcbiAgY29udGV4dC5Qcm92aWRlciA9IHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfUFJPVklERVJfVFlQRSxcbiAgICBfY29udGV4dDogY29udGV4dFxuICB9O1xuICB2YXIgaGFzV2FybmVkQWJvdXRVc2luZ05lc3RlZENvbnRleHRDb25zdW1lcnMgPSBmYWxzZTtcbiAgdmFyIGhhc1dhcm5lZEFib3V0VXNpbmdDb25zdW1lclByb3ZpZGVyID0gZmFsc2U7XG4gIHZhciBoYXNXYXJuZWRBYm91dERpc3BsYXlOYW1lT25Db25zdW1lciA9IGZhbHNlO1xuXG4gIHtcbiAgICAvLyBBIHNlcGFyYXRlIG9iamVjdCwgYnV0IHByb3hpZXMgYmFjayB0byB0aGUgb3JpZ2luYWwgY29udGV4dCBvYmplY3QgZm9yXG4gICAgLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuIEl0IGhhcyBhIGRpZmZlcmVudCAkJHR5cGVvZiwgc28gd2UgY2FuIHByb3Blcmx5XG4gICAgLy8gd2FybiBmb3IgdGhlIGluY29ycmVjdCB1c2FnZSBvZiBDb250ZXh0IGFzIGEgQ29uc3VtZXIuXG4gICAgdmFyIENvbnN1bWVyID0ge1xuICAgICAgJCR0eXBlb2Y6IFJFQUNUX0NPTlRFWFRfVFlQRSxcbiAgICAgIF9jb250ZXh0OiBjb250ZXh0LFxuICAgICAgX2NhbGN1bGF0ZUNoYW5nZWRCaXRzOiBjb250ZXh0Ll9jYWxjdWxhdGVDaGFuZ2VkQml0c1xuICAgIH07IC8vICRGbG93Rml4TWU6IEZsb3cgY29tcGxhaW5zIGFib3V0IG5vdCBzZXR0aW5nIGEgdmFsdWUsIHdoaWNoIGlzIGludGVudGlvbmFsIGhlcmVcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKENvbnN1bWVyLCB7XG4gICAgICBQcm92aWRlcjoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWhhc1dhcm5lZEFib3V0VXNpbmdDb25zdW1lclByb3ZpZGVyKSB7XG4gICAgICAgICAgICBoYXNXYXJuZWRBYm91dFVzaW5nQ29uc3VtZXJQcm92aWRlciA9IHRydWU7XG5cbiAgICAgICAgICAgIGVycm9yKCdSZW5kZXJpbmcgPENvbnRleHQuQ29uc3VtZXIuUHJvdmlkZXI+IGlzIG5vdCBzdXBwb3J0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiAnICsgJ2EgZnV0dXJlIG1ham9yIHJlbGVhc2UuIERpZCB5b3UgbWVhbiB0byByZW5kZXIgPENvbnRleHQuUHJvdmlkZXI+IGluc3RlYWQ/Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuUHJvdmlkZXI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF9Qcm92aWRlcikge1xuICAgICAgICAgIGNvbnRleHQuUHJvdmlkZXIgPSBfUHJvdmlkZXI7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfY3VycmVudFZhbHVlOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0Ll9jdXJyZW50VmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF9jdXJyZW50VmFsdWUpIHtcbiAgICAgICAgICBjb250ZXh0Ll9jdXJyZW50VmFsdWUgPSBfY3VycmVudFZhbHVlO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX2N1cnJlbnRWYWx1ZTI6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuX2N1cnJlbnRWYWx1ZTI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF9jdXJyZW50VmFsdWUyKSB7XG4gICAgICAgICAgY29udGV4dC5fY3VycmVudFZhbHVlMiA9IF9jdXJyZW50VmFsdWUyO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX3RocmVhZENvdW50OiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0Ll90aHJlYWRDb3VudDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoX3RocmVhZENvdW50KSB7XG4gICAgICAgICAgY29udGV4dC5fdGhyZWFkQ291bnQgPSBfdGhyZWFkQ291bnQ7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBDb25zdW1lcjoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWhhc1dhcm5lZEFib3V0VXNpbmdOZXN0ZWRDb250ZXh0Q29uc3VtZXJzKSB7XG4gICAgICAgICAgICBoYXNXYXJuZWRBYm91dFVzaW5nTmVzdGVkQ29udGV4dENvbnN1bWVycyA9IHRydWU7XG5cbiAgICAgICAgICAgIGVycm9yKCdSZW5kZXJpbmcgPENvbnRleHQuQ29uc3VtZXIuQ29uc3VtZXI+IGlzIG5vdCBzdXBwb3J0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiAnICsgJ2EgZnV0dXJlIG1ham9yIHJlbGVhc2UuIERpZCB5b3UgbWVhbiB0byByZW5kZXIgPENvbnRleHQuQ29uc3VtZXI+IGluc3RlYWQ/Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuQ29uc3VtZXI7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkaXNwbGF5TmFtZToge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dC5kaXNwbGF5TmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoZGlzcGxheU5hbWUpIHtcbiAgICAgICAgICBpZiAoIWhhc1dhcm5lZEFib3V0RGlzcGxheU5hbWVPbkNvbnN1bWVyKSB7XG4gICAgICAgICAgICB3YXJuKCdTZXR0aW5nIGBkaXNwbGF5TmFtZWAgb24gQ29udGV4dC5Db25zdW1lciBoYXMgbm8gZWZmZWN0LiAnICsgXCJZb3Ugc2hvdWxkIHNldCBpdCBkaXJlY3RseSBvbiB0aGUgY29udGV4dCB3aXRoIENvbnRleHQuZGlzcGxheU5hbWUgPSAnJXMnLlwiLCBkaXNwbGF5TmFtZSk7XG5cbiAgICAgICAgICAgIGhhc1dhcm5lZEFib3V0RGlzcGxheU5hbWVPbkNvbnN1bWVyID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTsgLy8gJEZsb3dGaXhNZTogRmxvdyBjb21wbGFpbnMgYWJvdXQgbWlzc2luZyBwcm9wZXJ0aWVzIGJlY2F1c2UgaXQgZG9lc24ndCB1bmRlcnN0YW5kIGRlZmluZVByb3BlcnR5XG5cbiAgICBjb250ZXh0LkNvbnN1bWVyID0gQ29uc3VtZXI7XG4gIH1cblxuICB7XG4gICAgY29udGV4dC5fY3VycmVudFJlbmRlcmVyID0gbnVsbDtcbiAgICBjb250ZXh0Ll9jdXJyZW50UmVuZGVyZXIyID0gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0O1xufVxuXG52YXIgVW5pbml0aWFsaXplZCA9IC0xO1xudmFyIFBlbmRpbmcgPSAwO1xudmFyIFJlc29sdmVkID0gMTtcbnZhciBSZWplY3RlZCA9IDI7XG5cbmZ1bmN0aW9uIGxhenlJbml0aWFsaXplcihwYXlsb2FkKSB7XG4gIGlmIChwYXlsb2FkLl9zdGF0dXMgPT09IFVuaW5pdGlhbGl6ZWQpIHtcbiAgICB2YXIgY3RvciA9IHBheWxvYWQuX3Jlc3VsdDtcbiAgICB2YXIgdGhlbmFibGUgPSBjdG9yKCk7IC8vIFRyYW5zaXRpb24gdG8gdGhlIG5leHQgc3RhdGUuXG5cbiAgICB2YXIgcGVuZGluZyA9IHBheWxvYWQ7XG4gICAgcGVuZGluZy5fc3RhdHVzID0gUGVuZGluZztcbiAgICBwZW5kaW5nLl9yZXN1bHQgPSB0aGVuYWJsZTtcbiAgICB0aGVuYWJsZS50aGVuKGZ1bmN0aW9uIChtb2R1bGVPYmplY3QpIHtcbiAgICAgIGlmIChwYXlsb2FkLl9zdGF0dXMgPT09IFBlbmRpbmcpIHtcbiAgICAgICAgdmFyIGRlZmF1bHRFeHBvcnQgPSBtb2R1bGVPYmplY3QuZGVmYXVsdDtcblxuICAgICAgICB7XG4gICAgICAgICAgaWYgKGRlZmF1bHRFeHBvcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZXJyb3IoJ2xhenk6IEV4cGVjdGVkIHRoZSByZXN1bHQgb2YgYSBkeW5hbWljIGltcG9ydCgpIGNhbGwuICcgKyAnSW5zdGVhZCByZWNlaXZlZDogJXNcXG5cXG5Zb3VyIGNvZGUgc2hvdWxkIGxvb2sgbGlrZTogXFxuICAnICsgLy8gQnJlYWsgdXAgaW1wb3J0cyB0byBhdm9pZCBhY2NpZGVudGFsbHkgcGFyc2luZyB0aGVtIGFzIGRlcGVuZGVuY2llcy5cbiAgICAgICAgICAgICdjb25zdCBNeUNvbXBvbmVudCA9IGxhenkoKCkgPT4gaW1wJyArIFwib3J0KCcuL015Q29tcG9uZW50JykpXCIsIG1vZHVsZU9iamVjdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IC8vIFRyYW5zaXRpb24gdG8gdGhlIG5leHQgc3RhdGUuXG5cblxuICAgICAgICB2YXIgcmVzb2x2ZWQgPSBwYXlsb2FkO1xuICAgICAgICByZXNvbHZlZC5fc3RhdHVzID0gUmVzb2x2ZWQ7XG4gICAgICAgIHJlc29sdmVkLl9yZXN1bHQgPSBkZWZhdWx0RXhwb3J0O1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgaWYgKHBheWxvYWQuX3N0YXR1cyA9PT0gUGVuZGluZykge1xuICAgICAgICAvLyBUcmFuc2l0aW9uIHRvIHRoZSBuZXh0IHN0YXRlLlxuICAgICAgICB2YXIgcmVqZWN0ZWQgPSBwYXlsb2FkO1xuICAgICAgICByZWplY3RlZC5fc3RhdHVzID0gUmVqZWN0ZWQ7XG4gICAgICAgIHJlamVjdGVkLl9yZXN1bHQgPSBlcnJvcjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGlmIChwYXlsb2FkLl9zdGF0dXMgPT09IFJlc29sdmVkKSB7XG4gICAgcmV0dXJuIHBheWxvYWQuX3Jlc3VsdDtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBwYXlsb2FkLl9yZXN1bHQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gbGF6eShjdG9yKSB7XG4gIHZhciBwYXlsb2FkID0ge1xuICAgIC8vIFdlIHVzZSB0aGVzZSBmaWVsZHMgdG8gc3RvcmUgdGhlIHJlc3VsdC5cbiAgICBfc3RhdHVzOiAtMSxcbiAgICBfcmVzdWx0OiBjdG9yXG4gIH07XG4gIHZhciBsYXp5VHlwZSA9IHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfTEFaWV9UWVBFLFxuICAgIF9wYXlsb2FkOiBwYXlsb2FkLFxuICAgIF9pbml0OiBsYXp5SW5pdGlhbGl6ZXJcbiAgfTtcblxuICB7XG4gICAgLy8gSW4gcHJvZHVjdGlvbiwgdGhpcyB3b3VsZCBqdXN0IHNldCBpdCBvbiB0aGUgb2JqZWN0LlxuICAgIHZhciBkZWZhdWx0UHJvcHM7XG4gICAgdmFyIHByb3BUeXBlczsgLy8gJEZsb3dGaXhNZVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobGF6eVR5cGUsIHtcbiAgICAgIGRlZmF1bHRQcm9wczoge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBkZWZhdWx0UHJvcHM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKG5ld0RlZmF1bHRQcm9wcykge1xuICAgICAgICAgIGVycm9yKCdSZWFjdC5sYXp5KC4uLik6IEl0IGlzIG5vdCBzdXBwb3J0ZWQgdG8gYXNzaWduIGBkZWZhdWx0UHJvcHNgIHRvICcgKyAnYSBsYXp5IGNvbXBvbmVudCBpbXBvcnQuIEVpdGhlciBzcGVjaWZ5IHRoZW0gd2hlcmUgdGhlIGNvbXBvbmVudCAnICsgJ2lzIGRlZmluZWQsIG9yIGNyZWF0ZSBhIHdyYXBwaW5nIGNvbXBvbmVudCBhcm91bmQgaXQuJyk7XG5cbiAgICAgICAgICBkZWZhdWx0UHJvcHMgPSBuZXdEZWZhdWx0UHJvcHM7IC8vIE1hdGNoIHByb2R1Y3Rpb24gYmVoYXZpb3IgbW9yZSBjbG9zZWx5OlxuICAgICAgICAgIC8vICRGbG93Rml4TWVcblxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsYXp5VHlwZSwgJ2RlZmF1bHRQcm9wcycsIHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHByb3BUeXBlczoge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBwcm9wVHlwZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKG5ld1Byb3BUeXBlcykge1xuICAgICAgICAgIGVycm9yKCdSZWFjdC5sYXp5KC4uLik6IEl0IGlzIG5vdCBzdXBwb3J0ZWQgdG8gYXNzaWduIGBwcm9wVHlwZXNgIHRvICcgKyAnYSBsYXp5IGNvbXBvbmVudCBpbXBvcnQuIEVpdGhlciBzcGVjaWZ5IHRoZW0gd2hlcmUgdGhlIGNvbXBvbmVudCAnICsgJ2lzIGRlZmluZWQsIG9yIGNyZWF0ZSBhIHdyYXBwaW5nIGNvbXBvbmVudCBhcm91bmQgaXQuJyk7XG5cbiAgICAgICAgICBwcm9wVHlwZXMgPSBuZXdQcm9wVHlwZXM7IC8vIE1hdGNoIHByb2R1Y3Rpb24gYmVoYXZpb3IgbW9yZSBjbG9zZWx5OlxuICAgICAgICAgIC8vICRGbG93Rml4TWVcblxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsYXp5VHlwZSwgJ3Byb3BUeXBlcycsIHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGxhenlUeXBlO1xufVxuXG5mdW5jdGlvbiBmb3J3YXJkUmVmKHJlbmRlcikge1xuICB7XG4gICAgaWYgKHJlbmRlciAhPSBudWxsICYmIHJlbmRlci4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFKSB7XG4gICAgICBlcnJvcignZm9yd2FyZFJlZiByZXF1aXJlcyBhIHJlbmRlciBmdW5jdGlvbiBidXQgcmVjZWl2ZWQgYSBgbWVtb2AgJyArICdjb21wb25lbnQuIEluc3RlYWQgb2YgZm9yd2FyZFJlZihtZW1vKC4uLikpLCB1c2UgJyArICdtZW1vKGZvcndhcmRSZWYoLi4uKSkuJyk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmVuZGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBlcnJvcignZm9yd2FyZFJlZiByZXF1aXJlcyBhIHJlbmRlciBmdW5jdGlvbiBidXQgd2FzIGdpdmVuICVzLicsIHJlbmRlciA9PT0gbnVsbCA/ICdudWxsJyA6IHR5cGVvZiByZW5kZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocmVuZGVyLmxlbmd0aCAhPT0gMCAmJiByZW5kZXIubGVuZ3RoICE9PSAyKSB7XG4gICAgICAgIGVycm9yKCdmb3J3YXJkUmVmIHJlbmRlciBmdW5jdGlvbnMgYWNjZXB0IGV4YWN0bHkgdHdvIHBhcmFtZXRlcnM6IHByb3BzIGFuZCByZWYuICVzJywgcmVuZGVyLmxlbmd0aCA9PT0gMSA/ICdEaWQgeW91IGZvcmdldCB0byB1c2UgdGhlIHJlZiBwYXJhbWV0ZXI/JyA6ICdBbnkgYWRkaXRpb25hbCBwYXJhbWV0ZXIgd2lsbCBiZSB1bmRlZmluZWQuJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlbmRlciAhPSBudWxsKSB7XG4gICAgICBpZiAocmVuZGVyLmRlZmF1bHRQcm9wcyAhPSBudWxsIHx8IHJlbmRlci5wcm9wVHlwZXMgIT0gbnVsbCkge1xuICAgICAgICBlcnJvcignZm9yd2FyZFJlZiByZW5kZXIgZnVuY3Rpb25zIGRvIG5vdCBzdXBwb3J0IHByb3BUeXBlcyBvciBkZWZhdWx0UHJvcHMuICcgKyAnRGlkIHlvdSBhY2NpZGVudGFsbHkgcGFzcyBhIFJlYWN0IGNvbXBvbmVudD8nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YXIgZWxlbWVudFR5cGUgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUsXG4gICAgcmVuZGVyOiByZW5kZXJcbiAgfTtcblxuICB7XG4gICAgdmFyIG93bk5hbWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnRUeXBlLCAnZGlzcGxheU5hbWUnLCB7XG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gb3duTmFtZTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIG93bk5hbWUgPSBuYW1lO1xuXG4gICAgICAgIGlmIChyZW5kZXIuZGlzcGxheU5hbWUgPT0gbnVsbCkge1xuICAgICAgICAgIHJlbmRlci5kaXNwbGF5TmFtZSA9IG5hbWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50VHlwZTtcbn1cblxuLy8gRmlsdGVyIGNlcnRhaW4gRE9NIGF0dHJpYnV0ZXMgKGUuZy4gc3JjLCBocmVmKSBpZiB0aGVpciB2YWx1ZXMgYXJlIGVtcHR5IHN0cmluZ3MuXG5cbnZhciBlbmFibGVTY29wZUFQSSA9IGZhbHNlOyAvLyBFeHBlcmltZW50YWwgQ3JlYXRlIEV2ZW50IEhhbmRsZSBBUEkuXG5cbmZ1bmN0aW9uIGlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKSB7XG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSAvLyBOb3RlOiB0eXBlb2YgbWlnaHQgYmUgb3RoZXIgdGhhbiAnc3ltYm9sJyBvciAnbnVtYmVyJyAoZS5nLiBpZiBpdCdzIGEgcG9seWZpbGwpLlxuXG5cbiAgaWYgKHR5cGUgPT09IGV4cG9ydHMuRnJhZ21lbnQgfHwgdHlwZSA9PT0gZXhwb3J0cy5Qcm9maWxlciB8fCB0eXBlID09PSBSRUFDVF9ERUJVR19UUkFDSU5HX01PREVfVFlQRSB8fCB0eXBlID09PSBleHBvcnRzLlN0cmljdE1vZGUgfHwgdHlwZSA9PT0gZXhwb3J0cy5TdXNwZW5zZSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfTEVHQUNZX0hJRERFTl9UWVBFIHx8IGVuYWJsZVNjb3BlQVBJICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiB0eXBlICE9PSBudWxsKSB7XG4gICAgaWYgKHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0xBWllfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9DT05URVhUX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0JMT0NLX1RZUEUgfHwgdHlwZVswXSA9PT0gUkVBQ1RfU0VSVkVSX0JMT0NLX1RZUEUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gbWVtbyh0eXBlLCBjb21wYXJlKSB7XG4gIHtcbiAgICBpZiAoIWlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKSkge1xuICAgICAgZXJyb3IoJ21lbW86IFRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgY29tcG9uZW50LiBJbnN0ZWFkICcgKyAncmVjZWl2ZWQ6ICVzJywgdHlwZSA9PT0gbnVsbCA/ICdudWxsJyA6IHR5cGVvZiB0eXBlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgZWxlbWVudFR5cGUgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX01FTU9fVFlQRSxcbiAgICB0eXBlOiB0eXBlLFxuICAgIGNvbXBhcmU6IGNvbXBhcmUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb21wYXJlXG4gIH07XG5cbiAge1xuICAgIHZhciBvd25OYW1lO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50VHlwZSwgJ2Rpc3BsYXlOYW1lJywge1xuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG93bk5hbWU7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICBvd25OYW1lID0gbmFtZTtcblxuICAgICAgICBpZiAodHlwZS5kaXNwbGF5TmFtZSA9PSBudWxsKSB7XG4gICAgICAgICAgdHlwZS5kaXNwbGF5TmFtZSA9IG5hbWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50VHlwZTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZURpc3BhdGNoZXIoKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gUmVhY3RDdXJyZW50RGlzcGF0Y2hlci5jdXJyZW50O1xuXG4gIGlmICghKGRpc3BhdGNoZXIgIT09IG51bGwpKSB7XG4gICAge1xuICAgICAgdGhyb3cgRXJyb3IoIFwiSW52YWxpZCBob29rIGNhbGwuIEhvb2tzIGNhbiBvbmx5IGJlIGNhbGxlZCBpbnNpZGUgb2YgdGhlIGJvZHkgb2YgYSBmdW5jdGlvbiBjb21wb25lbnQuIFRoaXMgY291bGQgaGFwcGVuIGZvciBvbmUgb2YgdGhlIGZvbGxvd2luZyByZWFzb25zOlxcbjEuIFlvdSBtaWdodCBoYXZlIG1pc21hdGNoaW5nIHZlcnNpb25zIG9mIFJlYWN0IGFuZCB0aGUgcmVuZGVyZXIgKHN1Y2ggYXMgUmVhY3QgRE9NKVxcbjIuIFlvdSBtaWdodCBiZSBicmVha2luZyB0aGUgUnVsZXMgb2YgSG9va3NcXG4zLiBZb3UgbWlnaHQgaGF2ZSBtb3JlIHRoYW4gb25lIGNvcHkgb2YgUmVhY3QgaW4gdGhlIHNhbWUgYXBwXFxuU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvbGluay9pbnZhbGlkLWhvb2stY2FsbCBmb3IgdGlwcyBhYm91dCBob3cgdG8gZGVidWcgYW5kIGZpeCB0aGlzIHByb2JsZW0uXCIgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGlzcGF0Y2hlcjtcbn1cblxuZnVuY3Rpb24gdXNlQ29udGV4dChDb250ZXh0LCB1bnN0YWJsZV9vYnNlcnZlZEJpdHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuXG4gIHtcbiAgICBpZiAodW5zdGFibGVfb2JzZXJ2ZWRCaXRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yKCd1c2VDb250ZXh0KCkgc2Vjb25kIGFyZ3VtZW50IGlzIHJlc2VydmVkIGZvciBmdXR1cmUgJyArICd1c2UgaW4gUmVhY3QuIFBhc3NpbmcgaXQgaXMgbm90IHN1cHBvcnRlZC4gJyArICdZb3UgcGFzc2VkOiAlcy4lcycsIHVuc3RhYmxlX29ic2VydmVkQml0cywgdHlwZW9mIHVuc3RhYmxlX29ic2VydmVkQml0cyA9PT0gJ251bWJlcicgJiYgQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMl0pID8gJ1xcblxcbkRpZCB5b3UgY2FsbCBhcnJheS5tYXAodXNlQ29udGV4dCk/ICcgKyAnQ2FsbGluZyBIb29rcyBpbnNpZGUgYSBsb29wIGlzIG5vdCBzdXBwb3J0ZWQuICcgKyAnTGVhcm4gbW9yZSBhdCBodHRwczovL3JlYWN0anMub3JnL2xpbmsvcnVsZXMtb2YtaG9va3MnIDogJycpO1xuICAgIH0gLy8gVE9ETzogYWRkIGEgbW9yZSBnZW5lcmljIHdhcm5pbmcgZm9yIGludmFsaWQgdmFsdWVzLlxuXG5cbiAgICBpZiAoQ29udGV4dC5fY29udGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgcmVhbENvbnRleHQgPSBDb250ZXh0Ll9jb250ZXh0OyAvLyBEb24ndCBkZWR1cGxpY2F0ZSBiZWNhdXNlIHRoaXMgbGVnaXRpbWF0ZWx5IGNhdXNlcyBidWdzXG4gICAgICAvLyBhbmQgbm9ib2R5IHNob3VsZCBiZSB1c2luZyB0aGlzIGluIGV4aXN0aW5nIGNvZGUuXG5cbiAgICAgIGlmIChyZWFsQ29udGV4dC5Db25zdW1lciA9PT0gQ29udGV4dCkge1xuICAgICAgICBlcnJvcignQ2FsbGluZyB1c2VDb250ZXh0KENvbnRleHQuQ29uc3VtZXIpIGlzIG5vdCBzdXBwb3J0ZWQsIG1heSBjYXVzZSBidWdzLCBhbmQgd2lsbCBiZSAnICsgJ3JlbW92ZWQgaW4gYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS4gRGlkIHlvdSBtZWFuIHRvIGNhbGwgdXNlQ29udGV4dChDb250ZXh0KSBpbnN0ZWFkPycpO1xuICAgICAgfSBlbHNlIGlmIChyZWFsQ29udGV4dC5Qcm92aWRlciA9PT0gQ29udGV4dCkge1xuICAgICAgICBlcnJvcignQ2FsbGluZyB1c2VDb250ZXh0KENvbnRleHQuUHJvdmlkZXIpIGlzIG5vdCBzdXBwb3J0ZWQuICcgKyAnRGlkIHlvdSBtZWFuIHRvIGNhbGwgdXNlQ29udGV4dChDb250ZXh0KSBpbnN0ZWFkPycpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUNvbnRleHQoQ29udGV4dCwgdW5zdGFibGVfb2JzZXJ2ZWRCaXRzKTtcbn1cbmZ1bmN0aW9uIHVzZVN0YXRlKGluaXRpYWxTdGF0ZSkge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZVN0YXRlKGluaXRpYWxTdGF0ZSk7XG59XG5mdW5jdGlvbiB1c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRpYWxBcmcsIGluaXQpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRpYWxBcmcsIGluaXQpO1xufVxuZnVuY3Rpb24gdXNlUmVmKGluaXRpYWxWYWx1ZSkge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZVJlZihpbml0aWFsVmFsdWUpO1xufVxuZnVuY3Rpb24gdXNlRWZmZWN0KGNyZWF0ZSwgZGVwcykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUVmZmVjdChjcmVhdGUsIGRlcHMpO1xufVxuZnVuY3Rpb24gdXNlTGF5b3V0RWZmZWN0KGNyZWF0ZSwgZGVwcykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUxheW91dEVmZmVjdChjcmVhdGUsIGRlcHMpO1xufVxuZnVuY3Rpb24gdXNlQ2FsbGJhY2soY2FsbGJhY2ssIGRlcHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VDYWxsYmFjayhjYWxsYmFjaywgZGVwcyk7XG59XG5mdW5jdGlvbiB1c2VNZW1vKGNyZWF0ZSwgZGVwcykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZU1lbW8oY3JlYXRlLCBkZXBzKTtcbn1cbmZ1bmN0aW9uIHVzZUltcGVyYXRpdmVIYW5kbGUocmVmLCBjcmVhdGUsIGRlcHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VJbXBlcmF0aXZlSGFuZGxlKHJlZiwgY3JlYXRlLCBkZXBzKTtcbn1cbmZ1bmN0aW9uIHVzZURlYnVnVmFsdWUodmFsdWUsIGZvcm1hdHRlckZuKSB7XG4gIHtcbiAgICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gICAgcmV0dXJuIGRpc3BhdGNoZXIudXNlRGVidWdWYWx1ZSh2YWx1ZSwgZm9ybWF0dGVyRm4pO1xuICB9XG59XG5cbi8vIEhlbHBlcnMgdG8gcGF0Y2ggY29uc29sZS5sb2dzIHRvIGF2b2lkIGxvZ2dpbmcgZHVyaW5nIHNpZGUtZWZmZWN0IGZyZWVcbi8vIHJlcGxheWluZyBvbiByZW5kZXIgZnVuY3Rpb24uIFRoaXMgY3VycmVudGx5IG9ubHkgcGF0Y2hlcyB0aGUgb2JqZWN0XG4vLyBsYXppbHkgd2hpY2ggd29uJ3QgY292ZXIgaWYgdGhlIGxvZyBmdW5jdGlvbiB3YXMgZXh0cmFjdGVkIGVhZ2VybHkuXG4vLyBXZSBjb3VsZCBhbHNvIGVhZ2VybHkgcGF0Y2ggdGhlIG1ldGhvZC5cbnZhciBkaXNhYmxlZERlcHRoID0gMDtcbnZhciBwcmV2TG9nO1xudmFyIHByZXZJbmZvO1xudmFyIHByZXZXYXJuO1xudmFyIHByZXZFcnJvcjtcbnZhciBwcmV2R3JvdXA7XG52YXIgcHJldkdyb3VwQ29sbGFwc2VkO1xudmFyIHByZXZHcm91cEVuZDtcblxuZnVuY3Rpb24gZGlzYWJsZWRMb2coKSB7fVxuXG5kaXNhYmxlZExvZy5fX3JlYWN0RGlzYWJsZWRMb2cgPSB0cnVlO1xuZnVuY3Rpb24gZGlzYWJsZUxvZ3MoKSB7XG4gIHtcbiAgICBpZiAoZGlzYWJsZWREZXB0aCA9PT0gMCkge1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgcmVhY3QtaW50ZXJuYWwvbm8tcHJvZHVjdGlvbi1sb2dnaW5nICovXG4gICAgICBwcmV2TG9nID0gY29uc29sZS5sb2c7XG4gICAgICBwcmV2SW5mbyA9IGNvbnNvbGUuaW5mbztcbiAgICAgIHByZXZXYXJuID0gY29uc29sZS53YXJuO1xuICAgICAgcHJldkVycm9yID0gY29uc29sZS5lcnJvcjtcbiAgICAgIHByZXZHcm91cCA9IGNvbnNvbGUuZ3JvdXA7XG4gICAgICBwcmV2R3JvdXBDb2xsYXBzZWQgPSBjb25zb2xlLmdyb3VwQ29sbGFwc2VkO1xuICAgICAgcHJldkdyb3VwRW5kID0gY29uc29sZS5ncm91cEVuZDsgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8xOTA5OVxuXG4gICAgICB2YXIgcHJvcHMgPSB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6IGRpc2FibGVkTG9nLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfTsgLy8gJEZsb3dGaXhNZSBGbG93IHRoaW5rcyBjb25zb2xlIGlzIGltbXV0YWJsZS5cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoY29uc29sZSwge1xuICAgICAgICBpbmZvOiBwcm9wcyxcbiAgICAgICAgbG9nOiBwcm9wcyxcbiAgICAgICAgd2FybjogcHJvcHMsXG4gICAgICAgIGVycm9yOiBwcm9wcyxcbiAgICAgICAgZ3JvdXA6IHByb3BzLFxuICAgICAgICBncm91cENvbGxhcHNlZDogcHJvcHMsXG4gICAgICAgIGdyb3VwRW5kOiBwcm9wc1xuICAgICAgfSk7XG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIHJlYWN0LWludGVybmFsL25vLXByb2R1Y3Rpb24tbG9nZ2luZyAqL1xuICAgIH1cblxuICAgIGRpc2FibGVkRGVwdGgrKztcbiAgfVxufVxuZnVuY3Rpb24gcmVlbmFibGVMb2dzKCkge1xuICB7XG4gICAgZGlzYWJsZWREZXB0aC0tO1xuXG4gICAgaWYgKGRpc2FibGVkRGVwdGggPT09IDApIHtcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIHJlYWN0LWludGVybmFsL25vLXByb2R1Y3Rpb24tbG9nZ2luZyAqL1xuICAgICAgdmFyIHByb3BzID0ge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9OyAvLyAkRmxvd0ZpeE1lIEZsb3cgdGhpbmtzIGNvbnNvbGUgaXMgaW1tdXRhYmxlLlxuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhjb25zb2xlLCB7XG4gICAgICAgIGxvZzogX2Fzc2lnbih7fSwgcHJvcHMsIHtcbiAgICAgICAgICB2YWx1ZTogcHJldkxvZ1xuICAgICAgICB9KSxcbiAgICAgICAgaW5mbzogX2Fzc2lnbih7fSwgcHJvcHMsIHtcbiAgICAgICAgICB2YWx1ZTogcHJldkluZm9cbiAgICAgICAgfSksXG4gICAgICAgIHdhcm46IF9hc3NpZ24oe30sIHByb3BzLCB7XG4gICAgICAgICAgdmFsdWU6IHByZXZXYXJuXG4gICAgICAgIH0pLFxuICAgICAgICBlcnJvcjogX2Fzc2lnbih7fSwgcHJvcHMsIHtcbiAgICAgICAgICB2YWx1ZTogcHJldkVycm9yXG4gICAgICAgIH0pLFxuICAgICAgICBncm91cDogX2Fzc2lnbih7fSwgcHJvcHMsIHtcbiAgICAgICAgICB2YWx1ZTogcHJldkdyb3VwXG4gICAgICAgIH0pLFxuICAgICAgICBncm91cENvbGxhcHNlZDogX2Fzc2lnbih7fSwgcHJvcHMsIHtcbiAgICAgICAgICB2YWx1ZTogcHJldkdyb3VwQ29sbGFwc2VkXG4gICAgICAgIH0pLFxuICAgICAgICBncm91cEVuZDogX2Fzc2lnbih7fSwgcHJvcHMsIHtcbiAgICAgICAgICB2YWx1ZTogcHJldkdyb3VwRW5kXG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICAgIC8qIGVzbGludC1lbmFibGUgcmVhY3QtaW50ZXJuYWwvbm8tcHJvZHVjdGlvbi1sb2dnaW5nICovXG4gICAgfVxuXG4gICAgaWYgKGRpc2FibGVkRGVwdGggPCAwKSB7XG4gICAgICBlcnJvcignZGlzYWJsZWREZXB0aCBmZWxsIGJlbG93IHplcm8uICcgKyAnVGhpcyBpcyBhIGJ1ZyBpbiBSZWFjdC4gUGxlYXNlIGZpbGUgYW4gaXNzdWUuJyk7XG4gICAgfVxuICB9XG59XG5cbnZhciBSZWFjdEN1cnJlbnREaXNwYXRjaGVyJDEgPSBSZWFjdFNoYXJlZEludGVybmFscy5SZWFjdEN1cnJlbnREaXNwYXRjaGVyO1xudmFyIHByZWZpeDtcbmZ1bmN0aW9uIGRlc2NyaWJlQnVpbHRJbkNvbXBvbmVudEZyYW1lKG5hbWUsIHNvdXJjZSwgb3duZXJGbikge1xuICB7XG4gICAgaWYgKHByZWZpeCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBFeHRyYWN0IHRoZSBWTSBzcGVjaWZpYyBwcmVmaXggdXNlZCBieSBlYWNoIGxpbmUuXG4gICAgICB0cnkge1xuICAgICAgICB0aHJvdyBFcnJvcigpO1xuICAgICAgfSBjYXRjaCAoeCkge1xuICAgICAgICB2YXIgbWF0Y2ggPSB4LnN0YWNrLnRyaW0oKS5tYXRjaCgvXFxuKCAqKGF0ICk/KS8pO1xuICAgICAgICBwcmVmaXggPSBtYXRjaCAmJiBtYXRjaFsxXSB8fCAnJztcbiAgICAgIH1cbiAgICB9IC8vIFdlIHVzZSB0aGUgcHJlZml4IHRvIGVuc3VyZSBvdXIgc3RhY2tzIGxpbmUgdXAgd2l0aCBuYXRpdmUgc3RhY2sgZnJhbWVzLlxuXG5cbiAgICByZXR1cm4gJ1xcbicgKyBwcmVmaXggKyBuYW1lO1xuICB9XG59XG52YXIgcmVlbnRyeSA9IGZhbHNlO1xudmFyIGNvbXBvbmVudEZyYW1lQ2FjaGU7XG5cbntcbiAgdmFyIFBvc3NpYmx5V2Vha01hcCA9IHR5cGVvZiBXZWFrTWFwID09PSAnZnVuY3Rpb24nID8gV2Vha01hcCA6IE1hcDtcbiAgY29tcG9uZW50RnJhbWVDYWNoZSA9IG5ldyBQb3NzaWJseVdlYWtNYXAoKTtcbn1cblxuZnVuY3Rpb24gZGVzY3JpYmVOYXRpdmVDb21wb25lbnRGcmFtZShmbiwgY29uc3RydWN0KSB7XG4gIC8vIElmIHNvbWV0aGluZyBhc2tlZCBmb3IgYSBzdGFjayBpbnNpZGUgYSBmYWtlIHJlbmRlciwgaXQgc2hvdWxkIGdldCBpZ25vcmVkLlxuICBpZiAoIWZuIHx8IHJlZW50cnkpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICB7XG4gICAgdmFyIGZyYW1lID0gY29tcG9uZW50RnJhbWVDYWNoZS5nZXQoZm4pO1xuXG4gICAgaWYgKGZyYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBmcmFtZTtcbiAgICB9XG4gIH1cblxuICB2YXIgY29udHJvbDtcbiAgcmVlbnRyeSA9IHRydWU7XG4gIHZhciBwcmV2aW91c1ByZXBhcmVTdGFja1RyYWNlID0gRXJyb3IucHJlcGFyZVN0YWNrVHJhY2U7IC8vICRGbG93Rml4TWUgSXQgZG9lcyBhY2NlcHQgdW5kZWZpbmVkLlxuXG4gIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gdW5kZWZpbmVkO1xuICB2YXIgcHJldmlvdXNEaXNwYXRjaGVyO1xuXG4gIHtcbiAgICBwcmV2aW91c0Rpc3BhdGNoZXIgPSBSZWFjdEN1cnJlbnREaXNwYXRjaGVyJDEuY3VycmVudDsgLy8gU2V0IHRoZSBkaXNwYXRjaGVyIGluIERFViBiZWNhdXNlIHRoaXMgbWlnaHQgYmUgY2FsbCBpbiB0aGUgcmVuZGVyIGZ1bmN0aW9uXG4gICAgLy8gZm9yIHdhcm5pbmdzLlxuXG4gICAgUmVhY3RDdXJyZW50RGlzcGF0Y2hlciQxLmN1cnJlbnQgPSBudWxsO1xuICAgIGRpc2FibGVMb2dzKCk7XG4gIH1cblxuICB0cnkge1xuICAgIC8vIFRoaXMgc2hvdWxkIHRocm93LlxuICAgIGlmIChjb25zdHJ1Y3QpIHtcbiAgICAgIC8vIFNvbWV0aGluZyBzaG91bGQgYmUgc2V0dGluZyB0aGUgcHJvcHMgaW4gdGhlIGNvbnN0cnVjdG9yLlxuICAgICAgdmFyIEZha2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRocm93IEVycm9yKCk7XG4gICAgICB9OyAvLyAkRmxvd0ZpeE1lXG5cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZha2UucHJvdG90eXBlLCAncHJvcHMnLCB7XG4gICAgICAgIHNldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIFdlIHVzZSBhIHRocm93aW5nIHNldHRlciBpbnN0ZWFkIG9mIGZyb3plbiBvciBub24td3JpdGFibGUgcHJvcHNcbiAgICAgICAgICAvLyBiZWNhdXNlIHRoYXQgd29uJ3QgdGhyb3cgaW4gYSBub24tc3RyaWN0IG1vZGUgZnVuY3Rpb24uXG4gICAgICAgICAgdGhyb3cgRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gJ29iamVjdCcgJiYgUmVmbGVjdC5jb25zdHJ1Y3QpIHtcbiAgICAgICAgLy8gV2UgY29uc3RydWN0IGEgZGlmZmVyZW50IGNvbnRyb2wgZm9yIHRoaXMgY2FzZSB0byBpbmNsdWRlIGFueSBleHRyYVxuICAgICAgICAvLyBmcmFtZXMgYWRkZWQgYnkgdGhlIGNvbnN0cnVjdCBjYWxsLlxuICAgICAgICB0cnkge1xuICAgICAgICAgIFJlZmxlY3QuY29uc3RydWN0KEZha2UsIFtdKTtcbiAgICAgICAgfSBjYXRjaCAoeCkge1xuICAgICAgICAgIGNvbnRyb2wgPSB4O1xuICAgICAgICB9XG5cbiAgICAgICAgUmVmbGVjdC5jb25zdHJ1Y3QoZm4sIFtdLCBGYWtlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgRmFrZS5jYWxsKCk7XG4gICAgICAgIH0gY2F0Y2ggKHgpIHtcbiAgICAgICAgICBjb250cm9sID0geDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZuLmNhbGwoRmFrZS5wcm90b3R5cGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aHJvdyBFcnJvcigpO1xuICAgICAgfSBjYXRjaCAoeCkge1xuICAgICAgICBjb250cm9sID0geDtcbiAgICAgIH1cblxuICAgICAgZm4oKTtcbiAgICB9XG4gIH0gY2F0Y2ggKHNhbXBsZSkge1xuICAgIC8vIFRoaXMgaXMgaW5saW5lZCBtYW51YWxseSBiZWNhdXNlIGNsb3N1cmUgZG9lc24ndCBkbyBpdCBmb3IgdXMuXG4gICAgaWYgKHNhbXBsZSAmJiBjb250cm9sICYmIHR5cGVvZiBzYW1wbGUuc3RhY2sgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBUaGlzIGV4dHJhY3RzIHRoZSBmaXJzdCBmcmFtZSBmcm9tIHRoZSBzYW1wbGUgdGhhdCBpc24ndCBhbHNvIGluIHRoZSBjb250cm9sLlxuICAgICAgLy8gU2tpcHBpbmcgb25lIGZyYW1lIHRoYXQgd2UgYXNzdW1lIGlzIHRoZSBmcmFtZSB0aGF0IGNhbGxzIHRoZSB0d28uXG4gICAgICB2YXIgc2FtcGxlTGluZXMgPSBzYW1wbGUuc3RhY2suc3BsaXQoJ1xcbicpO1xuICAgICAgdmFyIGNvbnRyb2xMaW5lcyA9IGNvbnRyb2wuc3RhY2suc3BsaXQoJ1xcbicpO1xuICAgICAgdmFyIHMgPSBzYW1wbGVMaW5lcy5sZW5ndGggLSAxO1xuICAgICAgdmFyIGMgPSBjb250cm9sTGluZXMubGVuZ3RoIC0gMTtcblxuICAgICAgd2hpbGUgKHMgPj0gMSAmJiBjID49IDAgJiYgc2FtcGxlTGluZXNbc10gIT09IGNvbnRyb2xMaW5lc1tjXSkge1xuICAgICAgICAvLyBXZSBleHBlY3QgYXQgbGVhc3Qgb25lIHN0YWNrIGZyYW1lIHRvIGJlIHNoYXJlZC5cbiAgICAgICAgLy8gVHlwaWNhbGx5IHRoaXMgd2lsbCBiZSB0aGUgcm9vdCBtb3N0IG9uZS4gSG93ZXZlciwgc3RhY2sgZnJhbWVzIG1heSBiZVxuICAgICAgICAvLyBjdXQgb2ZmIGR1ZSB0byBtYXhpbXVtIHN0YWNrIGxpbWl0cy4gSW4gdGhpcyBjYXNlLCBvbmUgbWF5YmUgY3V0IG9mZlxuICAgICAgICAvLyBlYXJsaWVyIHRoYW4gdGhlIG90aGVyLiBXZSBhc3N1bWUgdGhhdCB0aGUgc2FtcGxlIGlzIGxvbmdlciBvciB0aGUgc2FtZVxuICAgICAgICAvLyBhbmQgdGhlcmUgZm9yIGN1dCBvZmYgZWFybGllci4gU28gd2Ugc2hvdWxkIGZpbmQgdGhlIHJvb3QgbW9zdCBmcmFtZSBpblxuICAgICAgICAvLyB0aGUgc2FtcGxlIHNvbWV3aGVyZSBpbiB0aGUgY29udHJvbC5cbiAgICAgICAgYy0tO1xuICAgICAgfVxuXG4gICAgICBmb3IgKDsgcyA+PSAxICYmIGMgPj0gMDsgcy0tLCBjLS0pIHtcbiAgICAgICAgLy8gTmV4dCB3ZSBmaW5kIHRoZSBmaXJzdCBvbmUgdGhhdCBpc24ndCB0aGUgc2FtZSB3aGljaCBzaG91bGQgYmUgdGhlXG4gICAgICAgIC8vIGZyYW1lIHRoYXQgY2FsbGVkIG91ciBzYW1wbGUgZnVuY3Rpb24gYW5kIHRoZSBjb250cm9sLlxuICAgICAgICBpZiAoc2FtcGxlTGluZXNbc10gIT09IGNvbnRyb2xMaW5lc1tjXSkge1xuICAgICAgICAgIC8vIEluIFY4LCB0aGUgZmlyc3QgbGluZSBpcyBkZXNjcmliaW5nIHRoZSBtZXNzYWdlIGJ1dCBvdGhlciBWTXMgZG9uJ3QuXG4gICAgICAgICAgLy8gSWYgd2UncmUgYWJvdXQgdG8gcmV0dXJuIHRoZSBmaXJzdCBsaW5lLCBhbmQgdGhlIGNvbnRyb2wgaXMgYWxzbyBvbiB0aGUgc2FtZVxuICAgICAgICAgIC8vIGxpbmUsIHRoYXQncyBhIHByZXR0eSBnb29kIGluZGljYXRvciB0aGF0IG91ciBzYW1wbGUgdGhyZXcgYXQgc2FtZSBsaW5lIGFzXG4gICAgICAgICAgLy8gdGhlIGNvbnRyb2wuIEkuZS4gYmVmb3JlIHdlIGVudGVyZWQgdGhlIHNhbXBsZSBmcmFtZS4gU28gd2UgaWdub3JlIHRoaXMgcmVzdWx0LlxuICAgICAgICAgIC8vIFRoaXMgY2FuIGhhcHBlbiBpZiB5b3UgcGFzc2VkIGEgY2xhc3MgdG8gZnVuY3Rpb24gY29tcG9uZW50LCBvciBub24tZnVuY3Rpb24uXG4gICAgICAgICAgaWYgKHMgIT09IDEgfHwgYyAhPT0gMSkge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICBzLS07XG4gICAgICAgICAgICAgIGMtLTsgLy8gV2UgbWF5IHN0aWxsIGhhdmUgc2ltaWxhciBpbnRlcm1lZGlhdGUgZnJhbWVzIGZyb20gdGhlIGNvbnN0cnVjdCBjYWxsLlxuICAgICAgICAgICAgICAvLyBUaGUgbmV4dCBvbmUgdGhhdCBpc24ndCB0aGUgc2FtZSBzaG91bGQgYmUgb3VyIG1hdGNoIHRob3VnaC5cblxuICAgICAgICAgICAgICBpZiAoYyA8IDAgfHwgc2FtcGxlTGluZXNbc10gIT09IGNvbnRyb2xMaW5lc1tjXSkge1xuICAgICAgICAgICAgICAgIC8vIFY4IGFkZHMgYSBcIm5ld1wiIHByZWZpeCBmb3IgbmF0aXZlIGNsYXNzZXMuIExldCdzIHJlbW92ZSBpdCB0byBtYWtlIGl0IHByZXR0aWVyLlxuICAgICAgICAgICAgICAgIHZhciBfZnJhbWUgPSAnXFxuJyArIHNhbXBsZUxpbmVzW3NdLnJlcGxhY2UoJyBhdCBuZXcgJywgJyBhdCAnKTtcblxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50RnJhbWVDYWNoZS5zZXQoZm4sIF9mcmFtZSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSAvLyBSZXR1cm4gdGhlIGxpbmUgd2UgZm91bmQuXG5cblxuICAgICAgICAgICAgICAgIHJldHVybiBfZnJhbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gd2hpbGUgKHMgPj0gMSAmJiBjID49IDApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIHJlZW50cnkgPSBmYWxzZTtcblxuICAgIHtcbiAgICAgIFJlYWN0Q3VycmVudERpc3BhdGNoZXIkMS5jdXJyZW50ID0gcHJldmlvdXNEaXNwYXRjaGVyO1xuICAgICAgcmVlbmFibGVMb2dzKCk7XG4gICAgfVxuXG4gICAgRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgPSBwcmV2aW91c1ByZXBhcmVTdGFja1RyYWNlO1xuICB9IC8vIEZhbGxiYWNrIHRvIGp1c3QgdXNpbmcgdGhlIG5hbWUgaWYgd2UgY291bGRuJ3QgbWFrZSBpdCB0aHJvdy5cblxuXG4gIHZhciBuYW1lID0gZm4gPyBmbi5kaXNwbGF5TmFtZSB8fCBmbi5uYW1lIDogJyc7XG4gIHZhciBzeW50aGV0aWNGcmFtZSA9IG5hbWUgPyBkZXNjcmliZUJ1aWx0SW5Db21wb25lbnRGcmFtZShuYW1lKSA6ICcnO1xuXG4gIHtcbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb21wb25lbnRGcmFtZUNhY2hlLnNldChmbiwgc3ludGhldGljRnJhbWUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzeW50aGV0aWNGcmFtZTtcbn1cbmZ1bmN0aW9uIGRlc2NyaWJlRnVuY3Rpb25Db21wb25lbnRGcmFtZShmbiwgc291cmNlLCBvd25lckZuKSB7XG4gIHtcbiAgICByZXR1cm4gZGVzY3JpYmVOYXRpdmVDb21wb25lbnRGcmFtZShmbiwgZmFsc2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNob3VsZENvbnN0cnVjdChDb21wb25lbnQpIHtcbiAgdmFyIHByb3RvdHlwZSA9IENvbXBvbmVudC5wcm90b3R5cGU7XG4gIHJldHVybiAhIShwcm90b3R5cGUgJiYgcHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQpO1xufVxuXG5mdW5jdGlvbiBkZXNjcmliZVVua25vd25FbGVtZW50VHlwZUZyYW1lSW5ERVYodHlwZSwgc291cmNlLCBvd25lckZuKSB7XG5cbiAgaWYgKHR5cGUgPT0gbnVsbCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHtcbiAgICAgIHJldHVybiBkZXNjcmliZU5hdGl2ZUNvbXBvbmVudEZyYW1lKHR5cGUsIHNob3VsZENvbnN0cnVjdCh0eXBlKSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBkZXNjcmliZUJ1aWx0SW5Db21wb25lbnRGcmFtZSh0eXBlKTtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgZXhwb3J0cy5TdXNwZW5zZTpcbiAgICAgIHJldHVybiBkZXNjcmliZUJ1aWx0SW5Db21wb25lbnRGcmFtZSgnU3VzcGVuc2UnKTtcblxuICAgIGNhc2UgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFOlxuICAgICAgcmV0dXJuIGRlc2NyaWJlQnVpbHRJbkNvbXBvbmVudEZyYW1lKCdTdXNwZW5zZUxpc3QnKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICBzd2l0Y2ggKHR5cGUuJCR0eXBlb2YpIHtcbiAgICAgIGNhc2UgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTpcbiAgICAgICAgcmV0dXJuIGRlc2NyaWJlRnVuY3Rpb25Db21wb25lbnRGcmFtZSh0eXBlLnJlbmRlcik7XG5cbiAgICAgIGNhc2UgUkVBQ1RfTUVNT19UWVBFOlxuICAgICAgICAvLyBNZW1vIG1heSBjb250YWluIGFueSBjb21wb25lbnQgdHlwZSBzbyB3ZSByZWN1cnNpdmVseSByZXNvbHZlIGl0LlxuICAgICAgICByZXR1cm4gZGVzY3JpYmVVbmtub3duRWxlbWVudFR5cGVGcmFtZUluREVWKHR5cGUudHlwZSwgc291cmNlLCBvd25lckZuKTtcblxuICAgICAgY2FzZSBSRUFDVF9CTE9DS19UWVBFOlxuICAgICAgICByZXR1cm4gZGVzY3JpYmVGdW5jdGlvbkNvbXBvbmVudEZyYW1lKHR5cGUuX3JlbmRlcik7XG5cbiAgICAgIGNhc2UgUkVBQ1RfTEFaWV9UWVBFOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIGxhenlDb21wb25lbnQgPSB0eXBlO1xuICAgICAgICAgIHZhciBwYXlsb2FkID0gbGF6eUNvbXBvbmVudC5fcGF5bG9hZDtcbiAgICAgICAgICB2YXIgaW5pdCA9IGxhenlDb21wb25lbnQuX2luaXQ7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gTGF6eSBtYXkgY29udGFpbiBhbnkgY29tcG9uZW50IHR5cGUgc28gd2UgcmVjdXJzaXZlbHkgcmVzb2x2ZSBpdC5cbiAgICAgICAgICAgIHJldHVybiBkZXNjcmliZVVua25vd25FbGVtZW50VHlwZUZyYW1lSW5ERVYoaW5pdChwYXlsb2FkKSwgc291cmNlLCBvd25lckZuKTtcbiAgICAgICAgICB9IGNhdGNoICh4KSB7fVxuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuICcnO1xufVxuXG52YXIgbG9nZ2VkVHlwZUZhaWx1cmVzID0ge307XG52YXIgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSQxID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZTtcblxuZnVuY3Rpb24gc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQoZWxlbWVudCkge1xuICB7XG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgIHZhciBvd25lciA9IGVsZW1lbnQuX293bmVyO1xuICAgICAgdmFyIHN0YWNrID0gZGVzY3JpYmVVbmtub3duRWxlbWVudFR5cGVGcmFtZUluREVWKGVsZW1lbnQudHlwZSwgZWxlbWVudC5fc291cmNlLCBvd25lciA/IG93bmVyLnR5cGUgOiBudWxsKTtcbiAgICAgIFJlYWN0RGVidWdDdXJyZW50RnJhbWUkMS5zZXRFeHRyYVN0YWNrRnJhbWUoc3RhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBSZWFjdERlYnVnQ3VycmVudEZyYW1lJDEuc2V0RXh0cmFTdGFja0ZyYW1lKG51bGwpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja1Byb3BUeXBlcyh0eXBlU3BlY3MsIHZhbHVlcywgbG9jYXRpb24sIGNvbXBvbmVudE5hbWUsIGVsZW1lbnQpIHtcbiAge1xuICAgIC8vICRGbG93Rml4TWUgVGhpcyBpcyBva2F5IGJ1dCBGbG93IGRvZXNuJ3Qga25vdyBpdC5cbiAgICB2YXIgaGFzID0gRnVuY3Rpb24uY2FsbC5iaW5kKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpO1xuXG4gICAgZm9yICh2YXIgdHlwZVNwZWNOYW1lIGluIHR5cGVTcGVjcykge1xuICAgICAgaWYgKGhhcyh0eXBlU3BlY3MsIHR5cGVTcGVjTmFtZSkpIHtcbiAgICAgICAgdmFyIGVycm9yJDEgPSB2b2lkIDA7IC8vIFByb3AgdHlwZSB2YWxpZGF0aW9uIG1heSB0aHJvdy4gSW4gY2FzZSB0aGV5IGRvLCB3ZSBkb24ndCB3YW50IHRvXG4gICAgICAgIC8vIGZhaWwgdGhlIHJlbmRlciBwaGFzZSB3aGVyZSBpdCBkaWRuJ3QgZmFpbCBiZWZvcmUuIFNvIHdlIGxvZyBpdC5cbiAgICAgICAgLy8gQWZ0ZXIgdGhlc2UgaGF2ZSBiZWVuIGNsZWFuZWQgdXAsIHdlJ2xsIGxldCB0aGVtIHRocm93LlxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gVGhpcyBpcyBpbnRlbnRpb25hbGx5IGFuIGludmFyaWFudCB0aGF0IGdldHMgY2F1Z2h0LiBJdCdzIHRoZSBzYW1lXG4gICAgICAgICAgLy8gYmVoYXZpb3IgYXMgd2l0aG91dCB0aGlzIHN0YXRlbWVudCBleGNlcHQgd2l0aCBhIGJldHRlciBtZXNzYWdlLlxuICAgICAgICAgIGlmICh0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhciBlcnIgPSBFcnJvcigoY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnKSArICc6ICcgKyBsb2NhdGlvbiArICcgdHlwZSBgJyArIHR5cGVTcGVjTmFtZSArICdgIGlzIGludmFsaWQ7ICcgKyAnaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLCBidXQgcmVjZWl2ZWQgYCcgKyB0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gKyAnYC4nICsgJ1RoaXMgb2Z0ZW4gaGFwcGVucyBiZWNhdXNlIG9mIHR5cG9zIHN1Y2ggYXMgYFByb3BUeXBlcy5mdW5jdGlvbmAgaW5zdGVhZCBvZiBgUHJvcFR5cGVzLmZ1bmNgLicpO1xuICAgICAgICAgICAgZXJyLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZXJyb3IkMSA9IHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdKHZhbHVlcywgdHlwZVNwZWNOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgbnVsbCwgJ1NFQ1JFVF9ET19OT1RfUEFTU19USElTX09SX1lPVV9XSUxMX0JFX0ZJUkVEJyk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgZXJyb3IkMSA9IGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9yJDEgJiYgIShlcnJvciQxIGluc3RhbmNlb2YgRXJyb3IpKSB7XG4gICAgICAgICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQoZWxlbWVudCk7XG5cbiAgICAgICAgICBlcnJvcignJXM6IHR5cGUgc3BlY2lmaWNhdGlvbiBvZiAlcycgKyAnIGAlc2AgaXMgaW52YWxpZDsgdGhlIHR5cGUgY2hlY2tlciAnICsgJ2Z1bmN0aW9uIG11c3QgcmV0dXJuIGBudWxsYCBvciBhbiBgRXJyb3JgIGJ1dCByZXR1cm5lZCBhICVzLiAnICsgJ1lvdSBtYXkgaGF2ZSBmb3Jnb3R0ZW4gdG8gcGFzcyBhbiBhcmd1bWVudCB0byB0aGUgdHlwZSBjaGVja2VyICcgKyAnY3JlYXRvciAoYXJyYXlPZiwgaW5zdGFuY2VPZiwgb2JqZWN0T2YsIG9uZU9mLCBvbmVPZlR5cGUsIGFuZCAnICsgJ3NoYXBlIGFsbCByZXF1aXJlIGFuIGFyZ3VtZW50KS4nLCBjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycsIGxvY2F0aW9uLCB0eXBlU3BlY05hbWUsIHR5cGVvZiBlcnJvciQxKTtcblxuICAgICAgICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KG51bGwpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9yJDEgaW5zdGFuY2VvZiBFcnJvciAmJiAhKGVycm9yJDEubWVzc2FnZSBpbiBsb2dnZWRUeXBlRmFpbHVyZXMpKSB7XG4gICAgICAgICAgLy8gT25seSBtb25pdG9yIHRoaXMgZmFpbHVyZSBvbmNlIGJlY2F1c2UgdGhlcmUgdGVuZHMgdG8gYmUgYSBsb3Qgb2YgdGhlXG4gICAgICAgICAgLy8gc2FtZSBlcnJvci5cbiAgICAgICAgICBsb2dnZWRUeXBlRmFpbHVyZXNbZXJyb3IkMS5tZXNzYWdlXSA9IHRydWU7XG4gICAgICAgICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQoZWxlbWVudCk7XG5cbiAgICAgICAgICBlcnJvcignRmFpbGVkICVzIHR5cGU6ICVzJywgbG9jYXRpb24sIGVycm9yJDEubWVzc2FnZSk7XG5cbiAgICAgICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChudWxsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCQxKGVsZW1lbnQpIHtcbiAge1xuICAgIGlmIChlbGVtZW50KSB7XG4gICAgICB2YXIgb3duZXIgPSBlbGVtZW50Ll9vd25lcjtcbiAgICAgIHZhciBzdGFjayA9IGRlc2NyaWJlVW5rbm93bkVsZW1lbnRUeXBlRnJhbWVJbkRFVihlbGVtZW50LnR5cGUsIGVsZW1lbnQuX3NvdXJjZSwgb3duZXIgPyBvd25lci50eXBlIDogbnVsbCk7XG4gICAgICBzZXRFeHRyYVN0YWNrRnJhbWUoc3RhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRFeHRyYVN0YWNrRnJhbWUobnVsbCk7XG4gICAgfVxuICB9XG59XG5cbnZhciBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93bjtcblxue1xuICBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93biA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKSB7XG4gIGlmIChSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50KSB7XG4gICAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lKFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQudHlwZSk7XG5cbiAgICBpZiAobmFtZSkge1xuICAgICAgcmV0dXJuICdcXG5cXG5DaGVjayB0aGUgcmVuZGVyIG1ldGhvZCBvZiBgJyArIG5hbWUgKyAnYC4nO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAnJztcbn1cblxuZnVuY3Rpb24gZ2V0U291cmNlSW5mb0Vycm9yQWRkZW5kdW0oc291cmNlKSB7XG4gIGlmIChzb3VyY2UgIT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBmaWxlTmFtZSA9IHNvdXJjZS5maWxlTmFtZS5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgdmFyIGxpbmVOdW1iZXIgPSBzb3VyY2UubGluZU51bWJlcjtcbiAgICByZXR1cm4gJ1xcblxcbkNoZWNrIHlvdXIgY29kZSBhdCAnICsgZmlsZU5hbWUgKyAnOicgKyBsaW5lTnVtYmVyICsgJy4nO1xuICB9XG5cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bUZvclByb3BzKGVsZW1lbnRQcm9wcykge1xuICBpZiAoZWxlbWVudFByb3BzICE9PSBudWxsICYmIGVsZW1lbnRQcm9wcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtKGVsZW1lbnRQcm9wcy5fX3NvdXJjZSk7XG4gIH1cblxuICByZXR1cm4gJyc7XG59XG4vKipcbiAqIFdhcm4gaWYgdGhlcmUncyBubyBrZXkgZXhwbGljaXRseSBzZXQgb24gZHluYW1pYyBhcnJheXMgb2YgY2hpbGRyZW4gb3JcbiAqIG9iamVjdCBrZXlzIGFyZSBub3QgdmFsaWQuIFRoaXMgYWxsb3dzIHVzIHRvIGtlZXAgdHJhY2sgb2YgY2hpbGRyZW4gYmV0d2VlblxuICogdXBkYXRlcy5cbiAqL1xuXG5cbnZhciBvd25lckhhc0tleVVzZVdhcm5pbmcgPSB7fTtcblxuZnVuY3Rpb24gZ2V0Q3VycmVudENvbXBvbmVudEVycm9ySW5mbyhwYXJlbnRUeXBlKSB7XG4gIHZhciBpbmZvID0gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCk7XG5cbiAgaWYgKCFpbmZvKSB7XG4gICAgdmFyIHBhcmVudE5hbWUgPSB0eXBlb2YgcGFyZW50VHlwZSA9PT0gJ3N0cmluZycgPyBwYXJlbnRUeXBlIDogcGFyZW50VHlwZS5kaXNwbGF5TmFtZSB8fCBwYXJlbnRUeXBlLm5hbWU7XG5cbiAgICBpZiAocGFyZW50TmFtZSkge1xuICAgICAgaW5mbyA9IFwiXFxuXFxuQ2hlY2sgdGhlIHRvcC1sZXZlbCByZW5kZXIgY2FsbCB1c2luZyA8XCIgKyBwYXJlbnROYW1lICsgXCI+LlwiO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpbmZvO1xufVxuLyoqXG4gKiBXYXJuIGlmIHRoZSBlbGVtZW50IGRvZXNuJ3QgaGF2ZSBhbiBleHBsaWNpdCBrZXkgYXNzaWduZWQgdG8gaXQuXG4gKiBUaGlzIGVsZW1lbnQgaXMgaW4gYW4gYXJyYXkuIFRoZSBhcnJheSBjb3VsZCBncm93IGFuZCBzaHJpbmsgb3IgYmVcbiAqIHJlb3JkZXJlZC4gQWxsIGNoaWxkcmVuIHRoYXQgaGF2ZW4ndCBhbHJlYWR5IGJlZW4gdmFsaWRhdGVkIGFyZSByZXF1aXJlZCB0b1xuICogaGF2ZSBhIFwia2V5XCIgcHJvcGVydHkgYXNzaWduZWQgdG8gaXQuIEVycm9yIHN0YXR1c2VzIGFyZSBjYWNoZWQgc28gYSB3YXJuaW5nXG4gKiB3aWxsIG9ubHkgYmUgc2hvd24gb25jZS5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgdGhhdCByZXF1aXJlcyBhIGtleS5cbiAqIEBwYXJhbSB7Kn0gcGFyZW50VHlwZSBlbGVtZW50J3MgcGFyZW50J3MgdHlwZS5cbiAqL1xuXG5cbmZ1bmN0aW9uIHZhbGlkYXRlRXhwbGljaXRLZXkoZWxlbWVudCwgcGFyZW50VHlwZSkge1xuICBpZiAoIWVsZW1lbnQuX3N0b3JlIHx8IGVsZW1lbnQuX3N0b3JlLnZhbGlkYXRlZCB8fCBlbGVtZW50LmtleSAhPSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZWxlbWVudC5fc3RvcmUudmFsaWRhdGVkID0gdHJ1ZTtcbiAgdmFyIGN1cnJlbnRDb21wb25lbnRFcnJvckluZm8gPSBnZXRDdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvKHBhcmVudFR5cGUpO1xuXG4gIGlmIChvd25lckhhc0tleVVzZVdhcm5pbmdbY3VycmVudENvbXBvbmVudEVycm9ySW5mb10pIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBvd25lckhhc0tleVVzZVdhcm5pbmdbY3VycmVudENvbXBvbmVudEVycm9ySW5mb10gPSB0cnVlOyAvLyBVc3VhbGx5IHRoZSBjdXJyZW50IG93bmVyIGlzIHRoZSBvZmZlbmRlciwgYnV0IGlmIGl0IGFjY2VwdHMgY2hpbGRyZW4gYXMgYVxuICAvLyBwcm9wZXJ0eSwgaXQgbWF5IGJlIHRoZSBjcmVhdG9yIG9mIHRoZSBjaGlsZCB0aGF0J3MgcmVzcG9uc2libGUgZm9yXG4gIC8vIGFzc2lnbmluZyBpdCBhIGtleS5cblxuICB2YXIgY2hpbGRPd25lciA9ICcnO1xuXG4gIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuX293bmVyICYmIGVsZW1lbnQuX293bmVyICE9PSBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50KSB7XG4gICAgLy8gR2l2ZSB0aGUgY29tcG9uZW50IHRoYXQgb3JpZ2luYWxseSBjcmVhdGVkIHRoaXMgY2hpbGQuXG4gICAgY2hpbGRPd25lciA9IFwiIEl0IHdhcyBwYXNzZWQgYSBjaGlsZCBmcm9tIFwiICsgZ2V0Q29tcG9uZW50TmFtZShlbGVtZW50Ll9vd25lci50eXBlKSArIFwiLlwiO1xuICB9XG5cbiAge1xuICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50JDEoZWxlbWVudCk7XG5cbiAgICBlcnJvcignRWFjaCBjaGlsZCBpbiBhIGxpc3Qgc2hvdWxkIGhhdmUgYSB1bmlxdWUgXCJrZXlcIiBwcm9wLicgKyAnJXMlcyBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9saW5rL3dhcm5pbmcta2V5cyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLCBjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvLCBjaGlsZE93bmVyKTtcblxuICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50JDEobnVsbCk7XG4gIH1cbn1cbi8qKlxuICogRW5zdXJlIHRoYXQgZXZlcnkgZWxlbWVudCBlaXRoZXIgaXMgcGFzc2VkIGluIGEgc3RhdGljIGxvY2F0aW9uLCBpbiBhblxuICogYXJyYXkgd2l0aCBhbiBleHBsaWNpdCBrZXlzIHByb3BlcnR5IGRlZmluZWQsIG9yIGluIGFuIG9iamVjdCBsaXRlcmFsXG4gKiB3aXRoIHZhbGlkIGtleSBwcm9wZXJ0eS5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqIEBwYXJhbSB7UmVhY3ROb2RlfSBub2RlIFN0YXRpY2FsbHkgcGFzc2VkIGNoaWxkIG9mIGFueSB0eXBlLlxuICogQHBhcmFtIHsqfSBwYXJlbnRUeXBlIG5vZGUncyBwYXJlbnQncyB0eXBlLlxuICovXG5cblxuZnVuY3Rpb24gdmFsaWRhdGVDaGlsZEtleXMobm9kZSwgcGFyZW50VHlwZSkge1xuICBpZiAodHlwZW9mIG5vZGUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkobm9kZSkpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGlsZCA9IG5vZGVbaV07XG5cbiAgICAgIGlmIChpc1ZhbGlkRWxlbWVudChjaGlsZCkpIHtcbiAgICAgICAgdmFsaWRhdGVFeHBsaWNpdEtleShjaGlsZCwgcGFyZW50VHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzVmFsaWRFbGVtZW50KG5vZGUpKSB7XG4gICAgLy8gVGhpcyBlbGVtZW50IHdhcyBwYXNzZWQgaW4gYSB2YWxpZCBsb2NhdGlvbi5cbiAgICBpZiAobm9kZS5fc3RvcmUpIHtcbiAgICAgIG5vZGUuX3N0b3JlLnZhbGlkYXRlZCA9IHRydWU7XG4gICAgfVxuICB9IGVsc2UgaWYgKG5vZGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4obm9kZSk7XG5cbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIEVudHJ5IGl0ZXJhdG9ycyB1c2VkIHRvIHByb3ZpZGUgaW1wbGljaXQga2V5cyxcbiAgICAgIC8vIGJ1dCBub3cgd2UgcHJpbnQgYSBzZXBhcmF0ZSB3YXJuaW5nIGZvciB0aGVtIGxhdGVyLlxuICAgICAgaWYgKGl0ZXJhdG9yRm4gIT09IG5vZGUuZW50cmllcykge1xuICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwobm9kZSk7XG4gICAgICAgIHZhciBzdGVwO1xuXG4gICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICBpZiAoaXNWYWxpZEVsZW1lbnQoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlRXhwbGljaXRLZXkoc3RlcC52YWx1ZSwgcGFyZW50VHlwZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4vKipcbiAqIEdpdmVuIGFuIGVsZW1lbnQsIHZhbGlkYXRlIHRoYXQgaXRzIHByb3BzIGZvbGxvdyB0aGUgcHJvcFR5cGVzIGRlZmluaXRpb24sXG4gKiBwcm92aWRlZCBieSB0aGUgdHlwZS5cbiAqXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZWxlbWVudFxuICovXG5cblxuZnVuY3Rpb24gdmFsaWRhdGVQcm9wVHlwZXMoZWxlbWVudCkge1xuICB7XG4gICAgdmFyIHR5cGUgPSBlbGVtZW50LnR5cGU7XG5cbiAgICBpZiAodHlwZSA9PT0gbnVsbCB8fCB0eXBlID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHByb3BUeXBlcztcblxuICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcHJvcFR5cGVzID0gdHlwZS5wcm9wVHlwZXM7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgKHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgfHwgLy8gTm90ZTogTWVtbyBvbmx5IGNoZWNrcyBvdXRlciBwcm9wcyBoZXJlLlxuICAgIC8vIElubmVyIHByb3BzIGFyZSBjaGVja2VkIGluIHRoZSByZWNvbmNpbGVyLlxuICAgIHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSkpIHtcbiAgICAgIHByb3BUeXBlcyA9IHR5cGUucHJvcFR5cGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHByb3BUeXBlcykge1xuICAgICAgLy8gSW50ZW50aW9uYWxseSBpbnNpZGUgdG8gYXZvaWQgdHJpZ2dlcmluZyBsYXp5IGluaXRpYWxpemVyczpcbiAgICAgIHZhciBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZSh0eXBlKTtcbiAgICAgIGNoZWNrUHJvcFR5cGVzKHByb3BUeXBlcywgZWxlbWVudC5wcm9wcywgJ3Byb3AnLCBuYW1lLCBlbGVtZW50KTtcbiAgICB9IGVsc2UgaWYgKHR5cGUuUHJvcFR5cGVzICE9PSB1bmRlZmluZWQgJiYgIXByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duKSB7XG4gICAgICBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93biA9IHRydWU7IC8vIEludGVudGlvbmFsbHkgaW5zaWRlIHRvIGF2b2lkIHRyaWdnZXJpbmcgbGF6eSBpbml0aWFsaXplcnM6XG5cbiAgICAgIHZhciBfbmFtZSA9IGdldENvbXBvbmVudE5hbWUodHlwZSk7XG5cbiAgICAgIGVycm9yKCdDb21wb25lbnQgJXMgZGVjbGFyZWQgYFByb3BUeXBlc2AgaW5zdGVhZCBvZiBgcHJvcFR5cGVzYC4gRGlkIHlvdSBtaXNzcGVsbCB0aGUgcHJvcGVydHkgYXNzaWdubWVudD8nLCBfbmFtZSB8fCAnVW5rbm93bicpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdHlwZS5nZXREZWZhdWx0UHJvcHMgPT09ICdmdW5jdGlvbicgJiYgIXR5cGUuZ2V0RGVmYXVsdFByb3BzLmlzUmVhY3RDbGFzc0FwcHJvdmVkKSB7XG4gICAgICBlcnJvcignZ2V0RGVmYXVsdFByb3BzIGlzIG9ubHkgdXNlZCBvbiBjbGFzc2ljIFJlYWN0LmNyZWF0ZUNsYXNzICcgKyAnZGVmaW5pdGlvbnMuIFVzZSBhIHN0YXRpYyBwcm9wZXJ0eSBuYW1lZCBgZGVmYXVsdFByb3BzYCBpbnN0ZWFkLicpO1xuICAgIH1cbiAgfVxufVxuLyoqXG4gKiBHaXZlbiBhIGZyYWdtZW50LCB2YWxpZGF0ZSB0aGF0IGl0IGNhbiBvbmx5IGJlIHByb3ZpZGVkIHdpdGggZnJhZ21lbnQgcHJvcHNcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBmcmFnbWVudFxuICovXG5cblxuZnVuY3Rpb24gdmFsaWRhdGVGcmFnbWVudFByb3BzKGZyYWdtZW50KSB7XG4gIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGZyYWdtZW50LnByb3BzKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG5cbiAgICAgIGlmIChrZXkgIT09ICdjaGlsZHJlbicgJiYga2V5ICE9PSAna2V5Jykge1xuICAgICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCQxKGZyYWdtZW50KTtcblxuICAgICAgICBlcnJvcignSW52YWxpZCBwcm9wIGAlc2Agc3VwcGxpZWQgdG8gYFJlYWN0LkZyYWdtZW50YC4gJyArICdSZWFjdC5GcmFnbWVudCBjYW4gb25seSBoYXZlIGBrZXlgIGFuZCBgY2hpbGRyZW5gIHByb3BzLicsIGtleSk7XG5cbiAgICAgICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQkMShudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZyYWdtZW50LnJlZiAhPT0gbnVsbCkge1xuICAgICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQkMShmcmFnbWVudCk7XG5cbiAgICAgIGVycm9yKCdJbnZhbGlkIGF0dHJpYnV0ZSBgcmVmYCBzdXBwbGllZCB0byBgUmVhY3QuRnJhZ21lbnRgLicpO1xuXG4gICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCQxKG51bGwpO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudFdpdGhWYWxpZGF0aW9uKHR5cGUsIHByb3BzLCBjaGlsZHJlbikge1xuICB2YXIgdmFsaWRUeXBlID0gaXNWYWxpZEVsZW1lbnRUeXBlKHR5cGUpOyAvLyBXZSB3YXJuIGluIHRoaXMgY2FzZSBidXQgZG9uJ3QgdGhyb3cuIFdlIGV4cGVjdCB0aGUgZWxlbWVudCBjcmVhdGlvbiB0b1xuICAvLyBzdWNjZWVkIGFuZCB0aGVyZSB3aWxsIGxpa2VseSBiZSBlcnJvcnMgaW4gcmVuZGVyLlxuXG4gIGlmICghdmFsaWRUeXBlKSB7XG4gICAgdmFyIGluZm8gPSAnJztcblxuICAgIGlmICh0eXBlID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmIHR5cGUgIT09IG51bGwgJiYgT2JqZWN0LmtleXModHlwZSkubGVuZ3RoID09PSAwKSB7XG4gICAgICBpbmZvICs9ICcgWW91IGxpa2VseSBmb3Jnb3QgdG8gZXhwb3J0IHlvdXIgY29tcG9uZW50IGZyb20gdGhlIGZpbGUgJyArIFwiaXQncyBkZWZpbmVkIGluLCBvciB5b3UgbWlnaHQgaGF2ZSBtaXhlZCB1cCBkZWZhdWx0IGFuZCBuYW1lZCBpbXBvcnRzLlwiO1xuICAgIH1cblxuICAgIHZhciBzb3VyY2VJbmZvID0gZ2V0U291cmNlSW5mb0Vycm9yQWRkZW5kdW1Gb3JQcm9wcyhwcm9wcyk7XG5cbiAgICBpZiAoc291cmNlSW5mbykge1xuICAgICAgaW5mbyArPSBzb3VyY2VJbmZvO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbmZvICs9IGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSgpO1xuICAgIH1cblxuICAgIHZhciB0eXBlU3RyaW5nO1xuXG4gICAgaWYgKHR5cGUgPT09IG51bGwpIHtcbiAgICAgIHR5cGVTdHJpbmcgPSAnbnVsbCc7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHR5cGUpKSB7XG4gICAgICB0eXBlU3RyaW5nID0gJ2FycmF5JztcbiAgICB9IGVsc2UgaWYgKHR5cGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEUpIHtcbiAgICAgIHR5cGVTdHJpbmcgPSBcIjxcIiArIChnZXRDb21wb25lbnROYW1lKHR5cGUudHlwZSkgfHwgJ1Vua25vd24nKSArIFwiIC8+XCI7XG4gICAgICBpbmZvID0gJyBEaWQgeW91IGFjY2lkZW50YWxseSBleHBvcnQgYSBKU1ggbGl0ZXJhbCBpbnN0ZWFkIG9mIGEgY29tcG9uZW50Pyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHR5cGVTdHJpbmcgPSB0eXBlb2YgdHlwZTtcbiAgICB9XG5cbiAgICB7XG4gICAgICBlcnJvcignUmVhY3QuY3JlYXRlRWxlbWVudDogdHlwZSBpcyBpbnZhbGlkIC0tIGV4cGVjdGVkIGEgc3RyaW5nIChmb3IgJyArICdidWlsdC1pbiBjb21wb25lbnRzKSBvciBhIGNsYXNzL2Z1bmN0aW9uIChmb3IgY29tcG9zaXRlICcgKyAnY29tcG9uZW50cykgYnV0IGdvdDogJXMuJXMnLCB0eXBlU3RyaW5nLCBpbmZvKTtcbiAgICB9XG4gIH1cblxuICB2YXIgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgLy8gVGhlIHJlc3VsdCBjYW4gYmUgbnVsbGlzaCBpZiBhIG1vY2sgb3IgYSBjdXN0b20gZnVuY3Rpb24gaXMgdXNlZC5cbiAgLy8gVE9ETzogRHJvcCB0aGlzIHdoZW4gdGhlc2UgYXJlIG5vIGxvbmdlciBhbGxvd2VkIGFzIHRoZSB0eXBlIGFyZ3VtZW50LlxuXG4gIGlmIChlbGVtZW50ID09IG51bGwpIHtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfSAvLyBTa2lwIGtleSB3YXJuaW5nIGlmIHRoZSB0eXBlIGlzbid0IHZhbGlkIHNpbmNlIG91ciBrZXkgdmFsaWRhdGlvbiBsb2dpY1xuICAvLyBkb2Vzbid0IGV4cGVjdCBhIG5vbi1zdHJpbmcvZnVuY3Rpb24gdHlwZSBhbmQgY2FuIHRocm93IGNvbmZ1c2luZyBlcnJvcnMuXG4gIC8vIFdlIGRvbid0IHdhbnQgZXhjZXB0aW9uIGJlaGF2aW9yIHRvIGRpZmZlciBiZXR3ZWVuIGRldiBhbmQgcHJvZC5cbiAgLy8gKFJlbmRlcmluZyB3aWxsIHRocm93IHdpdGggYSBoZWxwZnVsIG1lc3NhZ2UgYW5kIGFzIHNvb24gYXMgdGhlIHR5cGUgaXNcbiAgLy8gZml4ZWQsIHRoZSBrZXkgd2FybmluZ3Mgd2lsbCBhcHBlYXIuKVxuXG5cbiAgaWYgKHZhbGlkVHlwZSkge1xuICAgIGZvciAodmFyIGkgPSAyOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWxpZGF0ZUNoaWxkS2V5cyhhcmd1bWVudHNbaV0sIHR5cGUpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlID09PSBleHBvcnRzLkZyYWdtZW50KSB7XG4gICAgdmFsaWRhdGVGcmFnbWVudFByb3BzKGVsZW1lbnQpO1xuICB9IGVsc2Uge1xuICAgIHZhbGlkYXRlUHJvcFR5cGVzKGVsZW1lbnQpO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG52YXIgZGlkV2FybkFib3V0RGVwcmVjYXRlZENyZWF0ZUZhY3RvcnkgPSBmYWxzZTtcbmZ1bmN0aW9uIGNyZWF0ZUZhY3RvcnlXaXRoVmFsaWRhdGlvbih0eXBlKSB7XG4gIHZhciB2YWxpZGF0ZWRGYWN0b3J5ID0gY3JlYXRlRWxlbWVudFdpdGhWYWxpZGF0aW9uLmJpbmQobnVsbCwgdHlwZSk7XG4gIHZhbGlkYXRlZEZhY3RvcnkudHlwZSA9IHR5cGU7XG5cbiAge1xuICAgIGlmICghZGlkV2FybkFib3V0RGVwcmVjYXRlZENyZWF0ZUZhY3RvcnkpIHtcbiAgICAgIGRpZFdhcm5BYm91dERlcHJlY2F0ZWRDcmVhdGVGYWN0b3J5ID0gdHJ1ZTtcblxuICAgICAgd2FybignUmVhY3QuY3JlYXRlRmFjdG9yeSgpIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiAnICsgJ2EgZnV0dXJlIG1ham9yIHJlbGVhc2UuIENvbnNpZGVyIHVzaW5nIEpTWCAnICsgJ29yIHVzZSBSZWFjdC5jcmVhdGVFbGVtZW50KCkgZGlyZWN0bHkgaW5zdGVhZC4nKTtcbiAgICB9IC8vIExlZ2FjeSBob29rOiByZW1vdmUgaXRcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHZhbGlkYXRlZEZhY3RvcnksICd0eXBlJywge1xuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2FybignRmFjdG9yeS50eXBlIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB0aGUgY2xhc3MgZGlyZWN0bHkgJyArICdiZWZvcmUgcGFzc2luZyBpdCB0byBjcmVhdGVGYWN0b3J5LicpO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndHlwZScsIHtcbiAgICAgICAgICB2YWx1ZTogdHlwZVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gdmFsaWRhdGVkRmFjdG9yeTtcbn1cbmZ1bmN0aW9uIGNsb25lRWxlbWVudFdpdGhWYWxpZGF0aW9uKGVsZW1lbnQsIHByb3BzLCBjaGlsZHJlbikge1xuICB2YXIgbmV3RWxlbWVudCA9IGNsb25lRWxlbWVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gIGZvciAodmFyIGkgPSAyOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFsaWRhdGVDaGlsZEtleXMoYXJndW1lbnRzW2ldLCBuZXdFbGVtZW50LnR5cGUpO1xuICB9XG5cbiAgdmFsaWRhdGVQcm9wVHlwZXMobmV3RWxlbWVudCk7XG4gIHJldHVybiBuZXdFbGVtZW50O1xufVxuXG57XG5cbiAgdHJ5IHtcbiAgICB2YXIgZnJvemVuT2JqZWN0ID0gT2JqZWN0LmZyZWV6ZSh7fSk7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tbmV3ICovXG5cbiAgICBuZXcgTWFwKFtbZnJvemVuT2JqZWN0LCBudWxsXV0pO1xuICAgIG5ldyBTZXQoW2Zyb3plbk9iamVjdF0pO1xuICAgIC8qIGVzbGludC1lbmFibGUgbm8tbmV3ICovXG4gIH0gY2F0Y2ggKGUpIHtcbiAgfVxufVxuXG52YXIgY3JlYXRlRWxlbWVudCQxID0gIGNyZWF0ZUVsZW1lbnRXaXRoVmFsaWRhdGlvbiA7XG52YXIgY2xvbmVFbGVtZW50JDEgPSAgY2xvbmVFbGVtZW50V2l0aFZhbGlkYXRpb24gO1xudmFyIGNyZWF0ZUZhY3RvcnkgPSAgY3JlYXRlRmFjdG9yeVdpdGhWYWxpZGF0aW9uIDtcbnZhciBDaGlsZHJlbiA9IHtcbiAgbWFwOiBtYXBDaGlsZHJlbixcbiAgZm9yRWFjaDogZm9yRWFjaENoaWxkcmVuLFxuICBjb3VudDogY291bnRDaGlsZHJlbixcbiAgdG9BcnJheTogdG9BcnJheSxcbiAgb25seTogb25seUNoaWxkXG59O1xuXG5leHBvcnRzLkNoaWxkcmVuID0gQ2hpbGRyZW47XG5leHBvcnRzLkNvbXBvbmVudCA9IENvbXBvbmVudDtcbmV4cG9ydHMuUHVyZUNvbXBvbmVudCA9IFB1cmVDb21wb25lbnQ7XG5leHBvcnRzLl9fU0VDUkVUX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0ZJUkVEID0gUmVhY3RTaGFyZWRJbnRlcm5hbHM7XG5leHBvcnRzLmNsb25lRWxlbWVudCA9IGNsb25lRWxlbWVudCQxO1xuZXhwb3J0cy5jcmVhdGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dDtcbmV4cG9ydHMuY3JlYXRlRWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQkMTtcbmV4cG9ydHMuY3JlYXRlRmFjdG9yeSA9IGNyZWF0ZUZhY3Rvcnk7XG5leHBvcnRzLmNyZWF0ZVJlZiA9IGNyZWF0ZVJlZjtcbmV4cG9ydHMuZm9yd2FyZFJlZiA9IGZvcndhcmRSZWY7XG5leHBvcnRzLmlzVmFsaWRFbGVtZW50ID0gaXNWYWxpZEVsZW1lbnQ7XG5leHBvcnRzLmxhenkgPSBsYXp5O1xuZXhwb3J0cy5tZW1vID0gbWVtbztcbmV4cG9ydHMudXNlQ2FsbGJhY2sgPSB1c2VDYWxsYmFjaztcbmV4cG9ydHMudXNlQ29udGV4dCA9IHVzZUNvbnRleHQ7XG5leHBvcnRzLnVzZURlYnVnVmFsdWUgPSB1c2VEZWJ1Z1ZhbHVlO1xuZXhwb3J0cy51c2VFZmZlY3QgPSB1c2VFZmZlY3Q7XG5leHBvcnRzLnVzZUltcGVyYXRpdmVIYW5kbGUgPSB1c2VJbXBlcmF0aXZlSGFuZGxlO1xuZXhwb3J0cy51c2VMYXlvdXRFZmZlY3QgPSB1c2VMYXlvdXRFZmZlY3Q7XG5leHBvcnRzLnVzZU1lbW8gPSB1c2VNZW1vO1xuZXhwb3J0cy51c2VSZWR1Y2VyID0gdXNlUmVkdWNlcjtcbmV4cG9ydHMudXNlUmVmID0gdXNlUmVmO1xuZXhwb3J0cy51c2VTdGF0ZSA9IHVzZVN0YXRlO1xuZXhwb3J0cy52ZXJzaW9uID0gUmVhY3RWZXJzaW9uO1xuICB9KSgpO1xufVxuIiwiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdC9janMvcmVhY3QuZGV2ZWxvcG1lbnQuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3Q7XG5leHBvcnQgY29uc3QgX19lc21Nb2R1bGUgPSB0cnVlO1xuZXhwb3J0IGNvbnN0IHtcbiAgRnJhZ21lbnQsXG4gIFN0cmljdE1vZGUsXG4gIFByb2ZpbGVyLFxuICBTdXNwZW5zZSxcbiAgQ2hpbGRyZW4sXG4gIENvbXBvbmVudCxcbiAgUHVyZUNvbXBvbmVudCxcbiAgX19TRUNSRVRfSU5URVJOQUxTX0RPX05PVF9VU0VfT1JfWU9VX1dJTExfQkVfRklSRUQsXG4gIGNsb25lRWxlbWVudCxcbiAgY3JlYXRlQ29udGV4dCxcbiAgY3JlYXRlRWxlbWVudCxcbiAgY3JlYXRlRmFjdG9yeSxcbiAgY3JlYXRlUmVmLFxuICBmb3J3YXJkUmVmLFxuICBpc1ZhbGlkRWxlbWVudCxcbiAgbGF6eSxcbiAgbWVtbyxcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZUNvbnRleHQsXG4gIHVzZURlYnVnVmFsdWUsXG4gIHVzZUVmZmVjdCxcbiAgdXNlSW1wZXJhdGl2ZUhhbmRsZSxcbiAgdXNlTGF5b3V0RWZmZWN0LFxuICB1c2VNZW1vLFxuICB1c2VSZWR1Y2VyLFxuICB1c2VSZWYsXG4gIHVzZVN0YXRlLFxuICB2ZXJzaW9uLFxufSA9IFJlYWN0O1xuIl0sIm5hbWVzIjpbInJlcXVpcmUkJDAiLCJSZWFjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0dBT0E7R0FDQSxJQUFJLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQztHQUN6RCxJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztHQUNyRCxJQUFJLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUM7QUFDN0Q7R0FDQSxTQUFTLFFBQVEsQ0FBQyxHQUFHLEVBQUU7R0FDdkIsQ0FBQyxJQUFJLEdBQUcsS0FBSyxJQUFJLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtHQUN4QyxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsdURBQXVELENBQUMsQ0FBQztHQUMvRSxFQUFFO0FBQ0Y7R0FDQSxDQUFDLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ3BCLENBQUM7QUFDRDtHQUNBLFNBQVMsZUFBZSxHQUFHO0dBQzNCLENBQUMsSUFBSTtHQUNMLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7R0FDdEIsR0FBRyxPQUFPLEtBQUss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
