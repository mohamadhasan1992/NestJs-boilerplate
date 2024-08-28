import { Prop } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";



export abstract class IdentifiableEntitySchema{
    @Prop({type: SchemaTypes.ObjectId})
    _id: Types.ObjectId

}