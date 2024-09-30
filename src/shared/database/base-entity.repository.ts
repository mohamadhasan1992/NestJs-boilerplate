import { AggregateRoot } from '@nestjs/cqrs';
import { FilterQuery, PopulateOptions, Types } from 'mongoose';
import { EntityRepository } from './entity.repository';
import { IdentifiableEntitySchema } from './identifiable-entity.schema';
import { IPaginationData } from 'shared/adapters/pagination.interfac';



export abstract class BaseEntityRepository<
  TSchema extends IdentifiableEntitySchema,
  TEntity extends AggregateRoot
> extends EntityRepository<TSchema, TEntity> {

  
  async findOneAndReplaceById(id: string, entity: TEntity): Promise<void> {
    return await this.findOneAndReplace(
      { _id: new Types.ObjectId(id) } as FilterQuery<TSchema>,
      entity,
    );
  }

  async findOneById(id: string, popOptions?: PopulateOptions[], select?: string[]): Promise<TEntity> {
    return this.findOne({ _id: new Types.ObjectId(id) } as FilterQuery<TSchema>, popOptions, select);
  }

  async findAll(filterQuery: FilterQuery<TSchema>): Promise<IPaginationData<TEntity>> {
    return this.findPaginated(filterQuery);
  }
}
