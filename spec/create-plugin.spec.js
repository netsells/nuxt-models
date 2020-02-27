import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';

import logger from '../src/logger';
import createPlugin, { BaseModel } from '../src/index';

class FooModel extends BaseModel {}

const TestBase = {
    template: '<div />',
};

describe('createPlugin', () => {
    let localVue;
    let app;
    let store;
    let info;
    let fatal;
    let wrapper;

    beforeEach(() => {
        info = jest.fn();
        fatal = jest.fn();
        logger.mockTypes((typeName) => typeName === 'info' && info);
        logger.mockTypes((typeName) => typeName === 'fatal' && fatal);

        localVue = createLocalVue();
        localVue.use(Vuex);
        store = new Vuex.Store();
        app = {};

        localVue.prototype.$store = store;
    });

    it('is a function', () => {
        expect(createPlugin).toEqual(expect.any(Function));
    });

    describe('when called without options', () => {
        let nuxtPlugin;

        beforeEach(() => {
            nuxtPlugin = createPlugin(localVue);
        });

        it('returns a function', () => {
            expect(nuxtPlugin).toEqual(expect.any(Function));
        });

        describe('when return function called', () => {
            beforeEach(() => {
                nuxtPlugin({ app, store });
            });

            it('registers the $nnp plugin', () => {
                expect(info).toHaveBeenCalledWith('Nuxt Non POJO plugin not found, installing it automatically');
            });
        });

        describe('when return function called but $nnp installed', () => {
            beforeEach(() => {
                app.$nnp = () => {};
                nuxtPlugin({ app, store });
            });

            it('does not register the $nnp plugin', () => {
                expect(info).not.toHaveBeenCalled();
            });
        });

        describe('when return function called without app', () => {
            beforeEach(() => {
                nuxtPlugin({ store });
            });

            it('errors', () => {
                expect(fatal).toHaveBeenCalledWith('You must pass in the NuxtJS app variable');
            });
        });
    });

    describe('when called with correct classes', () => {
        let nuxtPlugin;

        beforeEach(() => {
            nuxtPlugin = createPlugin(localVue, {
                classes: [FooModel],
            });
        });

        it('returns a function', () => {
            expect(nuxtPlugin).toEqual(expect.any(Function));
        });

        describe('when return function called', () => {
            beforeEach(() => {
                nuxtPlugin({ app, store });
            });

            it('registers the classes', () => {
                wrapper = mount(TestBase, {
                    localVue,
                });

                expect(() => {
                    wrapper.vm.$nnp.save(new FooModel({ id: 1 }));
                }).not.toThrow();
            });
        });
    });
});
