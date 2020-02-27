import plugin from './plugin';

/**
 * Create an easier way to load the plugin
 * @param {Object} options
 * @returns {Function}
 */
function createPlugin(Vue, options = {}) {
    return function({ app, store }) {
        Vue.use(plugin, {
            app,
            store,
            ...options,
        });
    };
}

export default createPlugin;
