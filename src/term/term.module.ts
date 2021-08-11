import { Module } from '@nestjs/common';
import { TermService } from './term.service';
import { TermResolver } from './term.resolver';

@Module({
  providers: [TermService, TermResolver]
})
export class TermModule {}
