'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = alpReactAlt;

var _fody = require('fody');

var _fody2 = _interopRequireDefault(_fody);

var _fodyApp = require('fody-app');

var _fodyApp2 = _interopRequireDefault(_fodyApp);

var _fodyAltApp = require('fody-alt-app');

var _fodyAltApp2 = _interopRequireDefault(_fodyAltApp);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _alt = require('alt');

var _alt2 = _interopRequireDefault(_alt);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = new _nightingaleLogger2.default('alp.react-redux');

// https://www.npmjs.com/package/babel-preset-modern-browsers
var agents = [{ name: 'Edge', regexp: /edge\/([\d]+)/i, modernMinVersion: 13 }, { name: 'Firefox', regexp: /firefox\/([\d]+)/i, modernMinVersion: 45 }, { name: 'Chrome', regexp: /chrome\/([\d]+)/i, modernMinVersion: 41 }, // also works for opera.
{ name: 'Chromium', regexp: /chromium\/([\d]+)/i, modernMinVersion: 41 }];

/**
 * @function
 * @param Html
*/
// { name: 'Safari', regexp: /safari.*version\/([\d\w\.\-]+)/i, modernMinVersion: 10 },
function alpReactAlt(Html) {
    return function (app) {
        app.context.render = /**
                              * @function
                              * @param moduleDescriptor
                              * @param data
                             */function (moduleDescriptor, data) {
            var _this = this;

            logger.debug('render view', { data: data });

            if (moduleDescriptor.actions || moduleDescriptor.stores) {
                ( /**
                   * @function
                  */function () {
                    var alt = new _alt2.default();
                    if (moduleDescriptor.actions) {
                        Object.keys(moduleDescriptor.actions).forEach(function (key) {
                            return alt.addActions(key, moduleDescriptor.actions[key]);
                        });
                    }

                    if (moduleDescriptor.stores) {
                        Object.keys(moduleDescriptor.stores).forEach(function (key) {
                            return alt.addStore(key, moduleDescriptor.stores[key]);
                        });
                    }

                    _this.alt = alt;
                })();
            }

            this.body = (0, _fody2.default)({
                htmlData: {
                    context: this,
                    moduleDescriptor: moduleDescriptor,
                    get scriptName() {
                        // TODO create alp-useragent with getter in context
                        var ua = this.context.req.headers['user-agent'];

                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = agents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var agent = _step.value;

                                var res = agent.regexp.exec(ua);
                                if (res && res[1] >= agent.modernMinVersion) {
                                    return 'modern-browsers';
                                }
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        return 'es5';
                    }
                },
                context: this,
                View: moduleDescriptor.View,
                data: this.alt ? undefined : data,
                initialData: this.alt ? function () {
                    return _this.alt.takeSnapshot();
                } : function () {
                    return null;
                },
                Html: Html,
                App: this.alt ? _fodyAltApp2.default : _fodyApp2.default
            });
        };
    };
}
//# sourceMappingURL=node.js.map