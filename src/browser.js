import DefaultApp from 'fody-app';
import AltApp from 'fody-alt-app';
import contentLoaded from 'content-loaded';
import render from 'fody';
import Logger from 'nightingale-logger';
import Alt from 'alt';

const logger = new Logger('alp.react-alt');

let alt;

export default function alpReactAlt({ moduleDescriptor, initialData, element }) {
    return (app) => {
        app.context.render = function (moduleDescriptor, data) {
            logger.debug('render view', { data });

            if (!moduleDescriptor.View) {
                throw new Error('View is undefined, class expected');
            }

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

                if (initialData) {
                    alt.bootstrap(initialData);
                }
            }

            render({
                context: this,
                View: moduleDescriptor.View,
                data: this.alt ? undefined : data,
                element,
                App: this.alt ? AltApp : DefaultApp,
            });
        };

        if (moduleDescriptor) {
            const context = Object.create(app.context);
            contentLoaded().then(() => {
                logger.debug('document ready');
                context.render(moduleDescriptor, initialData);
            });
        }
    };
}
