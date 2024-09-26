import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';







@Controller()
export class HealthController {

  @Get("health")
  healthCheck(
    @Res() res: Response
  ) {
    return res.status(200).json({message: "healthy"})
  }


}
