"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDuoAuth = useDuoAuth;
exports.DuoAuthProvider = DuoAuthProvider;
exports.DuoAuthLogin = DuoAuthLogin;
exports.actionTypes = void 0;

var _react = _interopRequireWildcard(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _DuoWebV = _interopRequireDefault(require("./Duo-Web-v2"));

require("./DuoAuth.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DUO_ENDPOINT = '/duo'; //------------------------------------------------------------------------------
// Context and the useDuoAuth convenience function
//------------------------------------------------------------------------------

var DuoAuthContext = _react["default"].createContext();

function useDuoAuth() {
  return (0, _react.useContext)(DuoAuthContext);
} //------------------------------------------------------------------------------
// Reducer and associated action types
//------------------------------------------------------------------------------


var actionTypes = {
  SET_USERNAME: 'setUsername'
};
exports.actionTypes = actionTypes;

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_USERNAME:
      return _objectSpread({}, state, {
        username: action.payload
      });

    default:
      throw new Error('Invalid action type: ' + action.type);
  }
} //------------------------------------------------------------------------------
// The DuoAuthProvider to wrap those parts of the app that need authentication
//------------------------------------------------------------------------------


function DuoAuthProvider(_ref) {
  var duoEndpoint = _ref.duoEndpoint,
      redirectUri = _ref.redirectUri,
      checkInterval = _ref.checkInterval,
      children = _ref.children;

  var _useReducer = (0, _react.useReducer)(reducer, {
    username: undefined
  }),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  duoEndpoint = duoEndpoint || DUO_ENDPOINT;

  function login(username, nopreauth) {
    var url = nopreauth ? duoEndpoint + '?nopreauth' : duoEndpoint;
    return apiRequest('POST', url, {
      username: username,
      redirect: redirectUri || null
    }).then(function (options) {
      _DuoWebV["default"].init(options);

      return true;
    });
  }

  function logout() {
    return apiRequest('DELETE', duoEndpoint).then(function () {
      dispatch({
        type: actionTypes.SET_USERNAME,
        payload: null
      });
      return true;
    });
  }

  function check() {
    return apiRequest('GET', duoEndpoint).then(function (data) {
      var username = data ? data.username : null;

      if (state.username !== username) {
        dispatch({
          type: actionTypes.SET_USERNAME,
          payload: username
        });
      }

      return true;
    });
  }

  (0, _react.useEffect)(function () {
    check();
  }, []);
  useInterval(check, typeof checkInterval === 'number' ? checkInterval : null);
  return _react["default"].createElement(DuoAuthContext.Provider, {
    value: {
      state: state,
      login: login,
      logout: logout
    }
  }, children);
}

function DuoAuthLogin() {
  return _react["default"].createElement('div', {
    className: '__duo_login',
    id: 'duo_iframe'
  });
} //------------------------------------------------------------------------------
// Internal helper functions
//------------------------------------------------------------------------------

/**
 * A generic API request.
 *
 * @param {string} method - the HTTP method
 * @param {string} url - the endpoint URL
 * @param {string} data - the data to send in a post
 *
 * @returns The response data or null on error.
 */


function apiRequest(method, url, data) {
  var config = {
    method: method,
    url: url,
    responseType: 'json',
    withCredentials: true,
    headers: {
      Pragma: 'no-cache'
    },
    data: data
  };
  return (0, _axios["default"])(config).then(function (response) {
    return response.data;
  })["catch"](function (err) {
    var msg = err.response && err.response.data && err.response.data.message || err.message;
    return Promise.reject(new Error(msg));
  });
}
/**
 * A react hook for an interval timer.
 * Copied from: https://github.com/donavon/use-interval
 *
 * @param {function} callback - the function to call at each interval
 * @param {number} delay - the delay in milliseconds or null to stop
 */


var useInterval = function useInterval(callback, delay) {
  var savedCallback = (0, _react.useRef)();
  (0, _react.useEffect)(function () {
    savedCallback.current = callback;
  }, [callback]);
  (0, _react.useEffect)(function () {
    var handler = function handler() {
      return savedCallback.current.apply(savedCallback, arguments);
    };

    if (delay !== null) {
      var id = setInterval(handler, delay);
      return function () {
        return clearInterval(id);
      };
    }
  }, [delay]);
};
