import { NotFoundException } from '@nestjs/common';
import {
  FilterQuery,
  Model,
  PopulateOptions
} from 'mongoose';
import { IdentifiableEntitySchema } from './identifiable-entity.schema';
import { IPaginationData } from 'shared/adapters/pagination.interfac';
import { BaseSchemaFactory } from './base-schema.factory';

export abstract class BaseRepository<
  TSchema extends IdentifiableEntitySchema,
  TEntity
> {
  constructor(
    protected readonly entityModel: Model<TSchema>,
    protected readonly entitySchemaFactory: BaseSchemaFactory<
      TSchema,
      TEntity
    >,
  ) {}

  protected async findOne(
    entityFilterQuery?: FilterQuery<TSchema>,
    popOptions?: PopulateOptions[],
    fields?: string[] 
  ): Promise<TEntity> {
    const entityDocument = await this.entityModel.findOne(
      entityFilterQuery,
      {},
      { lean: true },
    )
    .populate(popOptions)
    .select(fields);

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
      pagination: {
        hasNextPage: totalDocs > (skip+limit),
        hasPrevPage: page > 1 ,
        limit,
        nextPage: totalDocs > (skip+limit) ? page + 1 : null,
        page,
        totalDocs,
        totalPages: Math.ceil(totalDocs/limit)
      }
    } 
  }

  async create(entity: TEntity): Promise<void> {
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


  protected async deleteMany(
    entityFilterQuery: FilterQuery<TSchema>,
  ): Promise<void> {
    const deletedEntityDocument = await this.entityModel.deleteMany(
      entityFilterQuery,
    );

    if (!deletedEntityDocument) {
      throw new NotFoundException('Unable to find the entity to delete.');
    }
  }
}
