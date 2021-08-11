import { Module } from '@nestjs/common';
import { SetService } from './set.service';
import { SetResolver } from './set.resolver';
import { TermService } from 'src/term/term.service';

@Module({
  providers: [SetService, SetResolver, TermService]
})
export class SetModule {}
