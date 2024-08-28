import { Prop, Schema } from '@nestjs/mongoose';
import { IdentifiableEntitySchema } from '../database/identifiable-entity.schema';



@Schema({versionKey: false, collection: "Property"})
export class PropertySchema extends IdentifiableEntitySchema {
    @Prop({type: Number, default: 0})
    area: number;

    @Prop({type: Number, default: 0})
    price: number;

    @Prop({type: String})
    city:  string;

    @Prop({type: String})
    link: string;

    @Prop({type: Array})
    pics: string[]
}


