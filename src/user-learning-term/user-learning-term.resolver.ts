import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserLearningTerm } from '@prisma/client';
import { TermReport } from 'src/graphql';
import { TermService } from 'src/term/term.service';
import { Ctx } from 'src/types/Context.type';
import { UserLearningTermService } from './user-learning-term.service';

@Resolver('UserLearningTerm')
export class UserLearningTermResolver {
  constructor(
    private userLearningTermService: UserLearningTermService,
    private termService: TermService,
  ) {}

  @ResolveField('term')
  async term(@Parent() userLearningTerm: UserLearningTerm) {
    return this.userLearningTermService.term.findUnique({
      where: { id: userLearningTerm.termId },
    });
  }

  @ResolveField('user')
  async user(@Parent() userLearningTerm: UserLearningTerm) {
    return this.userLearningTermService.term.findUnique({
      where: { id: userLearningTerm.userId },
    });
  }

  @Mutation('setUserLearningTerms')
  async setUserLearningSet(
    @Args('terms') terms: TermReport[],
    @Context() context: Ctx,
  ) {
    if (!context.req.user) {
      throw new Error('Unauthorized!');
    }

    const user = await this.userLearningTermService.user.findUnique({
      where: { username: context.req.user?.username },
      select: { id: true },
    });
    if (!user?.id) {
      throw new Error('Unauthorized!');
    }

    if (terms.length === 0) {
      throw new Error('Terms report must not be empty!');
    }

    for (let term of terms) {
      const userLearningTerm =
        await this.userLearningTermService.userLearningTerm.findFirst({
          where: {
            termId: parseInt(term.termId),
            userId: user.id,
            remained: { gt: 0 },
          },
          select: { id: true },
        });

      if (!userLearningTerm?.id) {
        continue;
      }

      if (term.correct === true) {
        await this.userLearningTermService.userLearningTerm.update({
          where: { id: userLearningTerm.id },
          data: { remained: { decrement: 1 }, learned: true },
        });
      } else {
        await this.userLearningTermService.userLearningTerm.update({
          where: { id: userLearningTerm.id },
          data: { remained: 5, learned: true },
        });
      }
    }

    const modifiedTermsRemainedId = terms.map((term) => parseInt(term.termId));
    return this.termService.findByIds(modifiedTermsRemainedId, context);
  }

  @Mutation('resetLearning')
  async resetLearning(@Args('setId') setId: string, @Context() context: Ctx) {
    if (!context.req.user) {
      return false;
    }

    // Find all terms id in the set
    const termsId = await this.userLearningTermService.term.findMany({
      where: { setId: parseInt(setId) },
      select: { id: true },
    });
    if (termsId.length === 0) {
      return false;
    }

    await this.userLearningTermService.userLearningTerm.updateMany({
      where: {
        termId: { in: termsId.map(({ id }) => id) },
        userId: context.req.user.id,
      },
      data: {
        remained: 3,
        learned: false,
      },
    });

    return true;
  }
}
