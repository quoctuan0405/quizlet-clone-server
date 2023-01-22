import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionResolver } from './option.resolver';

@Module({
  providers: [OptionService, OptionResolver],
})
export class OptionModule {}
