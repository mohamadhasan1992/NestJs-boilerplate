
import { IdentifiableEntitySchema } from './identifiable-entity.schema';

export interface BaseSchemaFactory<
  TSchema extends IdentifiableEntitySchema,
  TEntity
> {
  create(entity: TEntity): TSchema;
  createFromSchema(entitySchema: TSchema): TEntity;
}
