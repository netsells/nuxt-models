import AttributeModel from '../src/AttributeModel';
import ModelError from '../src/ModelError';

class BrokenIdentifier extends AttributeModel {}
BrokenIdentifier.identifier = 5;

class BrokenAttributes extends AttributeModel {}
BrokenAttributes.attributes = {};

describe('AttributeModel', () => {
    it('is a function', () => {
        expect(AttributeModel).toEqual(expect.any(Function));
    });

    it('has a default identifier of id', () => {
        expect(AttributeModel).toHaveProperty('identifier', 'id');
    });

    it('has a default attributes of []', () => {
        expect(AttributeModel).toHaveProperty('attributes', []);
    });

    it('sets a field property with all passed fields', () => {
        const fields = { foo: 'bar' };
        const model = new AttributeModel(fields);

        expect(model.fields).toBe(fields);
    });

    it('fields can be omitted to be an empty object', () => {
        const model = new AttributeModel();

        expect(model.fields).toEqual({});
    });

    it('only defines getters for id without attributes set', () => {
        const fields = { foo: 'bar', id: 5 };
        const model = new AttributeModel(fields);

        expect(model).toHaveProperty('id', 5);
        expect(model).not.toHaveProperty('foo');
    });

    it('only defines setters for id without attributes set', () => {
        const fields = { foo: 'bar', id: 5 };
        const model = new AttributeModel(fields);

        model.id = 8;
        expect(model.fields).toHaveProperty('id', 8);
    });

    it('errors if identifier is not a string', () => {
        expect(() => {
            new BrokenIdentifier();
        }).toThrow(new ModelError('Static property must be a string: BrokenIdentifier::identifier'));
    });

    it('errors if attributes is not an array', () => {
        expect(() => {
            new BrokenAttributes();
        }).toThrow(new ModelError('Static property must be an array: BrokenAttributes::attributes'));
    });
});
