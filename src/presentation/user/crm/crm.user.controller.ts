import { Controller, Get, Query } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { UserSchema } from 'src/infrustructure/schema/user.schema';






@Controller('crm/user')
export class CrmUserController {
  constructor(

) {}

    @Get()
    async listUsers(
        @Query() filterQuery: FilterQuery<UserSchema>
    ) {
        // execute and query
        return filterQuery
    }

}
