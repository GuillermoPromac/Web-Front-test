import {Field} from "../domain/model/field.entity.js";

export class FieldAssembler {

    static toEntityFromResource(resource) {
        return new Field({...resource});
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            return [];
        }
        let resources = response.data instanceof Array ? response.data
            : response.data['field'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}