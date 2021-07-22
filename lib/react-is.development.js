System.register([], function (exports) {
	'use strict';
	return {
		execute: function () {

			function createCommonjsModule(fn, module) {
				return module = { exports: {} }, fn(module, module.exports), module.exports;
			}

			/** @license React v17.0.1
			 * react-is.production.min.js
			 *
			 * Copyright (c) Facebook, Inc. and its affiliates.
			 *
			 * This source code is licensed under the MIT license found in the
			 * LICENSE file in the root directory of this source tree.
			 */
			var b=60103,c=60106,d=60107,e=60108,f=60114,g=60109,h=60110,k=60112,l=60113,m=60120,n=60115,p=60116,q=60121,r=60122,u=60117,v=60129,w=60131;
			if("function"===typeof Symbol&&Symbol.for){var x=Symbol.for;b=x("react.element");c=x("react.portal");d=x("react.fragment");e=x("react.strict_mode");f=x("react.profiler");g=x("react.provider");h=x("react.context");k=x("react.forward_ref");l=x("react.suspense");m=x("react.suspense_list");n=x("react.memo");p=x("react.lazy");q=x("react.block");r=x("react.server.block");u=x("react.fundamental");v=x("react.debug_trace_mode");w=x("react.legacy_hidden");}
			function y(a){if("object"===typeof a&&null!==a){var t=a.$$typeof;switch(t){case b:switch(a=a.type,a){case d:case f:case e:case l:case m:return a;default:switch(a=a&&a.$$typeof,a){case h:case k:case p:case n:case g:return a;default:return t}}case c:return t}}}var z=g,A=b,B=k,C=d,D=p,E=n,F=c,G=f,H=e,I=l;var ContextConsumer= exports('ContextConsumer',h);var ContextProvider= exports('ContextProvider',z);var Element= exports('Element',A);var ForwardRef= exports('ForwardRef',B);var Fragment= exports('Fragment',C);var Lazy= exports('Lazy',D);var Memo= exports('Memo',E);var Portal= exports('Portal',F);var Profiler= exports('Profiler',G);var StrictMode= exports('StrictMode',H);
			var Suspense= exports('Suspense',I);var isAsyncMode= exports('isAsyncMode',function(){return !1});var isConcurrentMode= exports('isConcurrentMode',function(){return !1});var isContextConsumer= exports('isContextConsumer',function(a){return y(a)===h});var isContextProvider= exports('isContextProvider',function(a){return y(a)===g});var isElement= exports('isElement',function(a){return "object"===typeof a&&null!==a&&a.$$typeof===b});var isForwardRef= exports('isForwardRef',function(a){return y(a)===k});var isFragment= exports('isFragment',function(a){return y(a)===d});var isLazy= exports('isLazy',function(a){return y(a)===p});var isMemo= exports('isMemo',function(a){return y(a)===n});
			var isPortal= exports('isPortal',function(a){return y(a)===c});var isProfiler= exports('isProfiler',function(a){return y(a)===f});var isStrictMode= exports('isStrictMode',function(a){return y(a)===e});var isSuspense= exports('isSuspense',function(a){return y(a)===l});var isValidElementType= exports('isValidElementType',function(a){return "string"===typeof a||"function"===typeof a||a===d||a===f||a===v||a===e||a===l||a===m||a===w||"object"===typeof a&&null!==a&&(a.$$typeof===p||a.$$typeof===n||a.$$typeof===g||a.$$typeof===h||a.$$typeof===k||a.$$typeof===u||a.$$typeof===q||a[0]===r)?!0:!1});
			var typeOf= exports('typeOf',y);

			var reactIs_production_min = exports('__moduleExports', {
				ContextConsumer: ContextConsumer,
				ContextProvider: ContextProvider,
				Element: Element,
				ForwardRef: ForwardRef,
				Fragment: Fragment,
				Lazy: Lazy,
				Memo: Memo,
				Portal: Portal,
				Profiler: Profiler,
				StrictMode: StrictMode,
				Suspense: Suspense,
				isAsyncMode: isAsyncMode,
				isConcurrentMode: isConcurrentMode,
				isContextConsumer: isContextConsumer,
				isContextProvider: isContextProvider,
				isElement: isElement,
				isForwardRef: isForwardRef,
				isFragment: isFragment,
				isLazy: isLazy,
				isMemo: isMemo,
				isPortal: isPortal,
				isProfiler: isProfiler,
				isStrictMode: isStrictMode,
				isSuspense: isSuspense,
				isValidElementType: isValidElementType,
				typeOf: typeOf
			});

			var reactIs_development = createCommonjsModule(function (module, exports) {

			{
			  (function() {

			// ATTENTION
			// When adding new symbols to this file,
			// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
			// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
			// nor polyfill, then a plain number is used for performance.
			var REACT_ELEMENT_TYPE = 0xeac7;
			var REACT_PORTAL_TYPE = 0xeaca;
			var REACT_FRAGMENT_TYPE = 0xeacb;
			var REACT_STRICT_MODE_TYPE = 0xeacc;
			var REACT_PROFILER_TYPE = 0xead2;
			var REACT_PROVIDER_TYPE = 0xeacd;
			var REACT_CONTEXT_TYPE = 0xeace;
			var REACT_FORWARD_REF_TYPE = 0xead0;
			var REACT_SUSPENSE_TYPE = 0xead1;
			var REACT_SUSPENSE_LIST_TYPE = 0xead8;
			var REACT_MEMO_TYPE = 0xead3;
			var REACT_LAZY_TYPE = 0xead4;
			var REACT_BLOCK_TYPE = 0xead9;
			var REACT_SERVER_BLOCK_TYPE = 0xeada;
			var REACT_FUNDAMENTAL_TYPE = 0xead5;
			var REACT_SCOPE_TYPE = 0xead7;
			var REACT_OPAQUE_ID_TYPE = 0xeae0;
			var REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
			var REACT_OFFSCREEN_TYPE = 0xeae2;
			var REACT_LEGACY_HIDDEN_TYPE = 0xeae3;

			if (typeof Symbol === 'function' && Symbol.for) {
			  var symbolFor = Symbol.for;
			  REACT_ELEMENT_TYPE = symbolFor('react.element');
			  REACT_PORTAL_TYPE = symbolFor('react.portal');
			  REACT_FRAGMENT_TYPE = symbolFor('react.fragment');
			  REACT_STRICT_MODE_TYPE = symbolFor('react.strict_mode');
			  REACT_PROFILER_TYPE = symbolFor('react.profiler');
			  REACT_PROVIDER_TYPE = symbolFor('react.provider');
			  REACT_CONTEXT_TYPE = symbolFor('react.context');
			  REACT_FORWARD_REF_TYPE = symbolFor('react.forward_ref');
			  REACT_SUSPENSE_TYPE = symbolFor('react.suspense');
			  REACT_SUSPENSE_LIST_TYPE = symbolFor('react.suspense_list');
			  REACT_MEMO_TYPE = symbolFor('react.memo');
			  REACT_LAZY_TYPE = symbolFor('react.lazy');
			  REACT_BLOCK_TYPE = symbolFor('react.block');
			  REACT_SERVER_BLOCK_TYPE = symbolFor('react.server.block');
			  REACT_FUNDAMENTAL_TYPE = symbolFor('react.fundamental');
			  REACT_SCOPE_TYPE = symbolFor('react.scope');
			  REACT_OPAQUE_ID_TYPE = symbolFor('react.opaque.id');
			  REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode');
			  REACT_OFFSCREEN_TYPE = symbolFor('react.offscreen');
			  REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden');
			}

			// Filter certain DOM attributes (e.g. src, href) if their values are empty strings.

			var enableScopeAPI = false; // Experimental Create Event Handle API.

			function isValidElementType(type) {
			  if (typeof type === 'string' || typeof type === 'function') {
			    return true;
			  } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


			  if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || type === REACT_DEBUG_TRACING_MODE_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || enableScopeAPI ) {
			    return true;
			  }

			  if (typeof type === 'object' && type !== null) {
			    if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_BLOCK_TYPE || type[0] === REACT_SERVER_BLOCK_TYPE) {
			      return true;
			    }
			  }

			  return false;
			}

			function typeOf(object) {
			  if (typeof object === 'object' && object !== null) {
			    var $$typeof = object.$$typeof;

			    switch ($$typeof) {
			      case REACT_ELEMENT_TYPE:
			        var type = object.type;

			        switch (type) {
			          case REACT_FRAGMENT_TYPE:
			          case REACT_PROFILER_TYPE:
			          case REACT_STRICT_MODE_TYPE:
			          case REACT_SUSPENSE_TYPE:
			          case REACT_SUSPENSE_LIST_TYPE:
			            return type;

			          default:
			            var $$typeofType = type && type.$$typeof;

			            switch ($$typeofType) {
			              case REACT_CONTEXT_TYPE:
			              case REACT_FORWARD_REF_TYPE:
			              case REACT_LAZY_TYPE:
			              case REACT_MEMO_TYPE:
			              case REACT_PROVIDER_TYPE:
			                return $$typeofType;

			              default:
			                return $$typeof;
			            }

			        }

			      case REACT_PORTAL_TYPE:
			        return $$typeof;
			    }
			  }

			  return undefined;
			}
			var ContextConsumer = REACT_CONTEXT_TYPE;
			var ContextProvider = REACT_PROVIDER_TYPE;
			var Element = REACT_ELEMENT_TYPE;
			var ForwardRef = REACT_FORWARD_REF_TYPE;
			var Fragment = REACT_FRAGMENT_TYPE;
			var Lazy = REACT_LAZY_TYPE;
			var Memo = REACT_MEMO_TYPE;
			var Portal = REACT_PORTAL_TYPE;
			var Profiler = REACT_PROFILER_TYPE;
			var StrictMode = REACT_STRICT_MODE_TYPE;
			var Suspense = REACT_SUSPENSE_TYPE;
			var hasWarnedAboutDeprecatedIsAsyncMode = false;
			var hasWarnedAboutDeprecatedIsConcurrentMode = false; // AsyncMode should be deprecated

			function isAsyncMode(object) {
			  {
			    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
			      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

			      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 18+.');
			    }
			  }

			  return false;
			}
			function isConcurrentMode(object) {
			  {
			    if (!hasWarnedAboutDeprecatedIsConcurrentMode) {
			      hasWarnedAboutDeprecatedIsConcurrentMode = true; // Using console['warn'] to evade Babel and ESLint

			      console['warn']('The ReactIs.isConcurrentMode() alias has been deprecated, ' + 'and will be removed in React 18+.');
			    }
			  }

			  return false;
			}
			function isContextConsumer(object) {
			  return typeOf(object) === REACT_CONTEXT_TYPE;
			}
			function isContextProvider(object) {
			  return typeOf(object) === REACT_PROVIDER_TYPE;
			}
			function isElement(object) {
			  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
			}
			function isForwardRef(object) {
			  return typeOf(object) === REACT_FORWARD_REF_TYPE;
			}
			function isFragment(object) {
			  return typeOf(object) === REACT_FRAGMENT_TYPE;
			}
			function isLazy(object) {
			  return typeOf(object) === REACT_LAZY_TYPE;
			}
			function isMemo(object) {
			  return typeOf(object) === REACT_MEMO_TYPE;
			}
			function isPortal(object) {
			  return typeOf(object) === REACT_PORTAL_TYPE;
			}
			function isProfiler(object) {
			  return typeOf(object) === REACT_PROFILER_TYPE;
			}
			function isStrictMode(object) {
			  return typeOf(object) === REACT_STRICT_MODE_TYPE;
			}
			function isSuspense(object) {
			  return typeOf(object) === REACT_SUSPENSE_TYPE;
			}

			exports.ContextConsumer = ContextConsumer;
			exports.ContextProvider = ContextProvider;
			exports.Element = Element;
			exports.ForwardRef = ForwardRef;
			exports.Fragment = Fragment;
			exports.Lazy = Lazy;
			exports.Memo = Memo;
			exports.Portal = Portal;
			exports.Profiler = Profiler;
			exports.StrictMode = StrictMode;
			exports.Suspense = Suspense;
			exports.isAsyncMode = isAsyncMode;
			exports.isConcurrentMode = isConcurrentMode;
			exports.isContextConsumer = isContextConsumer;
			exports.isContextProvider = isContextProvider;
			exports.isElement = isElement;
			exports.isForwardRef = isForwardRef;
			exports.isFragment = isFragment;
			exports.isLazy = isLazy;
			exports.isMemo = isMemo;
			exports.isPortal = isPortal;
			exports.isProfiler = isProfiler;
			exports.isStrictMode = isStrictMode;
			exports.isSuspense = isSuspense;
			exports.isValidElementType = isValidElementType;
			exports.typeOf = typeOf;
			  })();
			}
			});
			var reactIs_development_1 = reactIs_development.ContextConsumer;
			var reactIs_development_2 = reactIs_development.ContextProvider;
			var reactIs_development_3 = reactIs_development.Element;
			var reactIs_development_4 = reactIs_development.ForwardRef;
			var reactIs_development_5 = reactIs_development.Fragment;
			var reactIs_development_6 = reactIs_development.Lazy;
			var reactIs_development_7 = reactIs_development.Memo;
			var reactIs_development_8 = reactIs_development.Portal;
			var reactIs_development_9 = reactIs_development.Profiler;
			var reactIs_development_10 = reactIs_development.StrictMode;
			var reactIs_development_11 = reactIs_development.Suspense;
			var reactIs_development_12 = reactIs_development.isAsyncMode;
			var reactIs_development_13 = reactIs_development.isConcurrentMode;
			var reactIs_development_14 = reactIs_development.isContextConsumer;
			var reactIs_development_15 = reactIs_development.isContextProvider;
			var reactIs_development_16 = reactIs_development.isElement;
			var reactIs_development_17 = reactIs_development.isForwardRef;
			var reactIs_development_18 = reactIs_development.isFragment;
			var reactIs_development_19 = reactIs_development.isLazy;
			var reactIs_development_20 = reactIs_development.isMemo;
			var reactIs_development_21 = reactIs_development.isPortal;
			var reactIs_development_22 = reactIs_development.isProfiler;
			var reactIs_development_23 = reactIs_development.isStrictMode;
			var reactIs_development_24 = reactIs_development.isSuspense;
			var reactIs_development_25 = reactIs_development.isValidElementType;
			var reactIs_development_26 = reactIs_development.typeOf;

			var reactIs = createCommonjsModule(function (module) {

			{
			  module.exports = reactIs_development;
			}
			});

			exports('default', reactIs);const __esModule = exports('__esModule', true);

		}
	};
});
//# sourceMappingURL=react-is.development.js.map
