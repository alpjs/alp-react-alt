import render from 'fody';
import DefaultApp from 'fody-app';
import AltApp from 'fody-alt-app';
import Logger from 'nightingale-logger';
import Alt from 'alt';
const logger = new Logger('alp.react-redux');

// https://www.npmjs.com/package/babel-preset-modern-browsers
const agents = [
    { name: 'Edge', regexp: /edge\/([\d]+)/i, modernMinVersion: 13 },
    { name: 'Firefox', regexp: /firefox\/([\d]+)/i, modernMinVersion: 45 },
    { name: 'Chrome', regexp: /chrome\/([\d]+)/i, modernMinVersion: 41 }, // also works for opera.
    { name: 'Chromium', regexp: /chromium\/([\d]+)/i, modernMinVersion: 41 },
    // { name: 'Safari', regexp: /safari.*version\/([\d\w\.\-]+)/i, modernMinVersion: 10 },
];

export default function alpReactAlt(Html) {
    return (app) => {
        app.context.render = function (moduleDescriptor, data) {
            logger.debug('render view', { data });

            if (moduleDescriptor.actions || moduleDescriptor.stores) {
                const alt = new Alt();
                if (moduleDescriptor.actions) {
                    Object.keys(moduleDescriptor.actions)
                        .forEach(key => alt.addActions(key, moduleDescriptor.actions[key]));
                }

                if (moduleDescriptor.stores) {
                    Object.keys(moduleDescriptor.stores)
                        .forEach(key => alt.addStore(key, moduleDescriptor.stores[key]));
                }

                this.alt = alt;
            }

            this.body = render({
                htmlData: {
                    context: this,
                    moduleDescriptor,
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
                    },
                },
                context: this,
                View: moduleDescriptor.View,
                data: this.alt ? undefined : data,
                initialData: this.alt ? () => this.alt.takeSnapshot() : () => null,
                Html,
                App: this.alt ? AltApp : DefaultApp,
            });
        };
    };
}
