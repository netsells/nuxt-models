class AttributeModel {
    constructor(fields) {
        this.fields = fields;

        if (typeof this.constructor.identifier !== 'string') {
            throw new Error(`Static property must be a string: ${ this.constructor.name }::identifier`);
        }

        if (!Array.isArray(this.constructor.attributes)) {
            throw new Error(`Static property must be an array: ${ this.constructor.name }::attributes`);
        }

        if (!this.constructor.attributes.includes(this.constructor.identifier)) {
            this.constructor.attributes.push(this.constructor.identifier);
        }

        this.constructor.attributes.forEach(attrName => {
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
}

AttributeModel.identifier = 'id';
AttributeModel.attributes = [];

export default AttributeModel;
