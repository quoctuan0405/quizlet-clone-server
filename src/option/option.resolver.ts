import { Args, Query, Resolver } from '@nestjs/graphql';
import { OptionService } from './option.service';

@Resolver('Option')
export class OptionResolver {
  constructor(private optionService: OptionService) {}

  @Query('options')
  async options(@Args('termId') termId: string) {
    return this.optionService.option.findMany({
      where: { termId: parseInt(termId) },
    });
  }
}
