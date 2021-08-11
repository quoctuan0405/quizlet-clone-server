import { Module } from '@nestjs/common';
import { TermService } from 'src/term/term.service';
import { UserLearningTermResolver } from './user-learning-term.resolver';
import { UserLearningTermService } from './user-learning-term.service';

@Module({
  providers: [UserLearningTermResolver, UserLearningTermService, TermService]
})
export class UserLearningTermModule {}
