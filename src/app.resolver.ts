import { Context, Query } from '@nestjs/graphql';
import { AppService } from './app.service';
import { Ctx } from './types/Context.type';

export class AppResolver {
  @Query('hi')
  async hi(@Context() Context: Ctx) {
    return 'there';
  }
}
