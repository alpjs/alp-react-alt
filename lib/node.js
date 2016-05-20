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

const logger = new _nightingaleLogger2.default('alp.react-redux');

// https://www.npmjs.com/package/babel-preset-modern-browsers
const agents = [{ name: 'Edge', regexp: /edge\/([\d]+)/i, modernMinVersion: 13 }, { name: 'Firefox', regexp: /firefox\/([\d]+)/i, modernMinVersion: 45 }, { name: 'Chrome', regexp: /chrome\/([\d]+)/i, modernMinVersion: 41 }, // also works for opera.
{ name: 'Chromium', regexp: /chromium\/([\d]+)/i, modernMinVersion: 41 }];

/**
 * @function
 * @param Html
*/
// { name: 'Safari', regexp: /safari.*version\/([\d\w\.\-]+)/i, modernMinVersion: 10 },
function alpReactAlt(Html) {
    return app => {
        app.context.render = /**
                              * @function
                              * @param moduleDescriptor
                              * @param data
                             */function (moduleDescriptor, data) {
            logger.debug('render view', { data: data });

            if (moduleDescriptor.actions || moduleDescriptor.stores) {
                const alt = new _alt2.default();
                if (moduleDescriptor.actions) {
                    Object.keys(moduleDescriptor.actions).forEach(key => alt.addActions(key, moduleDescriptor.actions[key]));
                }

                if (moduleDescriptor.stores) {
                    Object.keys(moduleDescriptor.stores).forEach(key => alt.addStore(key, moduleDescriptor.stores[key]));
                }

                this.alt = alt;
            }

            this.body = (0, _fody2.default)({
                htmlData: {
                    context: this,
                    moduleDescriptor: moduleDescriptor,
                    get scriptName() {
                        // TODO create alp-useragent with getter in context
                        const ua = this.context.req.headers['user-agent'];

                        for (let agent of agents) {
                            const res = agent.regexp.exec(ua);
                            if (res && res[1] >= agent.modernMinVersion) {
                                return 'modern-browsers';
                            }
                        }
                        return 'es5';
                    }
                },
                context: this,
                View: moduleDescriptor.View,
                data: this.alt ? undefined : data,
                initialData: this.alt ? () => this.alt.takeSnapshot() : () => null,
                Html: Html,
                App: this.alt ? _fodyAltApp2.default : _fodyApp2.default
            });
        };
    };
}
//# sourceMappingURL=node.js.map