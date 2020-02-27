import ModelError from './ModelError';

class AttributeModel {
    constructor(fields = {}) {
        this.fields = fields;

        if (typeof this.constructor.identifier !== 'string') {
            throw new ModelError(`Static property must be a string: ${ this.constructor.name }::identifier`);
        }

        if (!Array.isArray(this.constructor.attributes)) {
            throw new ModelError(`Static property must be an array: ${ this.constructor.name }::attributes`);
        }

        this.constructor._attributes.forEach(attrName => {
            Object.defineProperty(this, attrName, {
                get() {
                    return this.fields[attrName];
                },

                set(value) {
                    this.fields[attrName] = value;
                },
            });
        });
    }

    static get _attributes() {
        return [...this.attributes, this.identifier];
    }
}

AttributeModel.identifier = 'id';
AttributeModel.attributes = [];

export default AttributeModel;
