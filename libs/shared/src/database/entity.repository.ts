import { NotFoundException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import {
  FilterQuery,
  Model,
  PopulateOptions
} from 'mongoose';

import { EntitySchemaFactory } from './entity-schema.factory';
import { IdentifiableEntitySchema } from './identifiable-entity.schema';
import { IPaginationData } from '../adapters/paginated-data.interface';

export abstract class EntityRepository<
  TSchema extends IdentifiableEntitySchema,
  TEntity extends AggregateRoot
> {
  constructor(
    protected readonly entityModel: Model<TSchema>,
    protected readonly entitySchemaFactory: EntitySchemaFactory<
      TSchema,
      TEntity
    >,
  ) {}

  protected async findOne(
    entityFilterQuery?: FilterQuery<TSchema>,
  ): Promise<TEntity> {
    const entityDocument = await this.entityModel.findOne(
      entityFilterQuery,
      {},
      { lean: true },
    );

    if (!entityDocument) {
      return null
    }

    return this.entitySchemaFactory.createFromSchema(entityDocument as unknown as TSchema);
  }

  protected async findAll(
    entityFilterQuery?: FilterQuery<TSchema>,
    popOptions?: PopulateOptions[],
    fields?: string[] 
  ): Promise<IPaginationData<TEntity>> {
    const sortBy = entityFilterQuery?.sort?.split(',')?.join(' ') || "-createdAt";
    const page = entityFilterQuery?.page * 1 || 1;
    const limit = entityFilterQuery?.limit * 1 || 10;
    const skip = (page-1) * limit;
    if(entityFilterQuery){
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach((el) => delete entityFilterQuery[el]);
    }
    let queryStr = JSON.stringify(entityFilterQuery);

    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|regex)\b/g,
      (match) => `$${match}`
    );
    const totalDocs = await this.entityModel.countDocuments(JSON.parse(queryStr));

    return{
      data: (
        await this.entityModel.find(JSON.parse(queryStr), {}, { lean: true })
        .sort(sortBy)
        .limit(limit)
        .select(fields)
        .skip(skip)
        .populate(popOptions)
      ).map(entityDocument =>
        this.entitySchemaFactory.createFromSchema(entityDocument as unknown as TSchema),
      ),
      paginationData: {
        limit,
        page,
        totalDocs,
      }
    } 
  }

  async create(entity: TEntity): Promise<void> {
    console.log("entity create", entity)
    await new this.entityModel(this.entitySchemaFactory.create(entity)).save();
  }

  protected async findOneAndReplace(
    entityFilterQuery: FilterQuery<TSchema>,
    entity: TEntity,
  ): Promise<void> {
    const updatedEntityDocument = await this.entityModel.findOneAndReplace(
      entityFilterQuery,
      (this.entitySchemaFactory.create(
        entity,
      ) as unknown) as TSchema,
      {
        new: true,
        useFindAndModify: false,
        lean: true,
      },
    );

    if (!updatedEntityDocument) {
      throw new NotFoundException('Unable to find the entity to replace.');
    }
  }


  protected async delete(
    entityFilterQuery: FilterQuery<TSchema>,
    entity: TEntity,
  ): Promise<void> {
    const deletedEntityDocument = await this.entityModel.findOneAndDelete(
      entityFilterQuery,
      (this.entitySchemaFactory.create(
        entity,
      ) as unknown) as TSchema,
    );

    if (!deletedEntityDocument) {
      throw new NotFoundException('Unable to find the entity to delete.');
    }
  }
}
