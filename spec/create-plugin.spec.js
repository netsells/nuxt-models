import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';

import logger from '../src/logger';
import createPlugin, { BaseModel } from '../src/index';

class FooModel extends BaseModel {}
class BrokenModel {}

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
    let warn;

    beforeEach(() => {
        info = jest.fn();
        fatal = jest.fn();
        warn = jest.fn();
        logger.mockTypes((typeName) => typeName === 'info' && info);
        logger.mockTypes((typeName) => typeName === 'fatal' && fatal);
        logger.mockTypes((typeName) => typeName === 'warn' && warn);

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

            it('shows no warnings', () => {
                expect(warn).not.toHaveBeenCalled();
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

    describe('when called with wrong classes', () => {
        let nuxtPlugin;

        beforeEach(() => {
            nuxtPlugin = createPlugin(localVue, {
                classes: [BrokenModel],
            });
        });

        describe('when return function called', () => {
            beforeEach(() => {
                nuxtPlugin({ app, store });
            });

            it('shows a warning', () => {
                expect(warn).toHaveBeenCalledWith('Passed class "BrokenModel" does not extend BaseModel');
            });
        });
    });
});
