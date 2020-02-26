class BaseModel {
    constructor(fields) {
        this.fields = fields;

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

    toPOJO() {
        return this.fields;
    }

    toKey() {
        if (!Object.keys(this.fields).includes(this.constructor.identifier)) {
            throw new Error(`Can't save model with no "${ this.constructor.identifier }"`);
        }

        return this.fields[this.constructor.identifier];
    }

    static fromPOJO(fields) {
        const Klass = this;

        return new Klass(fields);
    }
}

BaseModel.identifier = 'id';
BaseModel.attributes = [];

export default BaseModel;
