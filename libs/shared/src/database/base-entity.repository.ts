import { AggregateRoot } from '@nestjs/cqrs';
import { FilterQuery, Types } from 'mongoose';
import { EntityRepository } from './entity.repository';

import { IdentifiableEntitySchema } from './identifiable-entity.schema';

export abstract class BaseEntityRepository<
  TSchema extends IdentifiableEntitySchema,
  TEntity extends AggregateRoot
> extends EntityRepository<TSchema, TEntity> {

  
  async findByIdAndReplace(id: string, entity: TEntity): Promise<void> {
    return await this.findOneAndReplace(
      { _id: new Types.ObjectId(id) } as FilterQuery<TSchema>,
      entity,
    );
  }

  async findOneById(id: string): Promise<TEntity> {
    return this.findOne({ _id: new Types.ObjectId(id) } as FilterQuery<TSchema>);
  }

  async findAll(filterQuery: FilterQuery<TSchema>): Promise<TEntity[]> {
    return this.find(filterQuery);
  }

  async findByIdAndDelete(_id: string, entity: TEntity): Promise<void>{
    return this.delete({_id}, entity)
  }

}
