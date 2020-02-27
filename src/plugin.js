import createPlugin from '@netsells/nuxt-non-pojo';

import logger from './logger';

const NuxtModels = {
    /**
     * Install the plugin
     * @param {Object} Vue
     * @param {Object} options
     */
    install(Vue, {
        app,
        store,
        classes = [],
        $nnp = '$nnp',
    }) {
        if (!app) {
            logger.fatal('You must pass in the NuxtJS app variable');

            return;
        }

        if (!app[$nnp]) {
            logger.info('Nuxt Non POJO plugin not found, installing it automatically');

            createPlugin(Vue, {
                classes,
                $nnp,
            })({ app, store });
        }

        classes.forEach(Klass => {
            app[$nnp].register(Klass);
        });
    },
};

export default NuxtModels;
