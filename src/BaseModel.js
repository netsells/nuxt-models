import AttributeModel from './AttributeModel';

class BaseModel extends AttributeModel {
    toPOJO() {
        return this.fields;
    }

    toKey() {
        if (!Object.keys(this.fields).includes(this.constructor.identifier)) {
            throw new Error(`Can't save model with no "${ this.constructor.identifier }" field`);
        }

        return this.fields[this.constructor.identifier];
    }

    static fromPOJO(fields) {
        const Klass = this;

        return new Klass(fields);
    }
}

export default BaseModel;
