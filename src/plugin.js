import createPlugin from '@netsells/nuxt-non-pojo';

import BaseModel from './BaseModel';
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
                $nnp,
            })({ app, store });
        }

        classes.forEach(Klass => {
            if (!BaseModel.prototype.isPrototypeOf(Klass.prototype)) {
                logger.warn(`Passed class "${ Klass.name }" does not extend BaseModel`);
            }

            app[$nnp].register(Klass);
        });
    },
};

export default NuxtModels;
