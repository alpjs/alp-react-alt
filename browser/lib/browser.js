'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = alpReactAlt;

var _fodyApp = require('fody-app');

var _fodyApp2 = _interopRequireDefault(_fodyApp);

var _fodyAltApp = require('fody-alt-app');

var _fodyAltApp2 = _interopRequireDefault(_fodyAltApp);

var _contentLoaded = require('content-loaded');

var _contentLoaded2 = _interopRequireDefault(_contentLoaded);

var _fody = require('fody');

var _fody2 = _interopRequireDefault(_fody);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _alt = require('alt');

var _alt2 = _interopRequireDefault(_alt);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = new _nightingaleLogger2.default('alp.react-alt');

var alt = void 0;

/**
 * @function
 * @param
*/function alpReactAlt(_ref) {
    var moduleDescriptor = _ref.moduleDescriptor;
    var initialData = _ref.initialData;
    var element = _ref.element;

    return function (app) {
        app.context.render = /**
                              * @function
                              * @param moduleDescriptor
                              * @param data
                             */function (moduleDescriptor, data) {
            var _this = this;

            logger.debug('render view', { data: data });

            if (!moduleDescriptor.View) {
                throw new Error('View is undefined, class expected');
            }

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

                    if (initialData) {
                        alt.bootstrap(initialData);
                    }
                })();
            }

            (0, _fody2.default)({
                context: this,
                View: moduleDescriptor.View,
                data: this.alt ? undefined : data,
                element: element,
                App: this.alt ? _fodyAltApp2.default : _fodyApp2.default
            });
        };

        if (moduleDescriptor) {
            ( /**
               * @function
              */function () {
                var context = Object.create(app.context);
                (0, _contentLoaded2.default)().then(function () {
                    logger.debug('document ready');
                    context.render(moduleDescriptor, initialData);
                });
            })();
        }
    };
}
//# sourceMappingURL=browser.js.map