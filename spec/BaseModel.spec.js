import { BaseModel } from '../src/index';

describe('BaseModel', () => {
    it('is a function', () => {
        expect(BaseModel).toEqual(expect.any(Function));
    });

    describe('static fromPOJO', () => {
        it('returns the class with the passed fields', () => {
            expect(BaseModel.fromPOJO({
                id: 1,
                foo: 'bar',
            })).toEqual(new BaseModel({
                id: 1,
                foo: 'bar',
            }));
        });
    });

    describe('toPOJO', () => {
        it('returns the fields', () => {
            const fields = {
                id: 2,
                bar: 'foo',
            };
            const model = new BaseModel(fields);

            expect(model.toPOJO()).toBe(fields);
        });
    });

    describe('toKey', () => {
        it('returns the key', () => {
            const fields = {
                id: 2,
                bar: 'foo',
            };
            const model = new BaseModel(fields);

            expect(model.toKey()).toEqual(2);
        });

        it('errors if id not set', () => {
            const fields = {
                bar: 'foo',
            };
            const model = new BaseModel(fields);

            expect(() => model.toKey()).toThrow(new Error('Can\'t save model with no "id" field'));
        });
    });
});
