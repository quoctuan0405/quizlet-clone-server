import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
  Context,
} from '@nestjs/graphql';
import { SetService } from './set.service';
import { Set, Term } from '@prisma/client';
import { Ctx } from 'src/types/Context.type';
import { TermService } from 'src/term/term.service';
import { CreateSetInput, UpsertOption, UpdateSetInput } from 'src/graphql';
import * as _ from 'lodash';

@Resolver('Set')
export class SetResolver {
  constructor(
    private setServices: SetService,
    private termService: TermService,
  ) {}

  @Query('sets')
  async sets() {
    return this.setServices.findMany();
  }

  @Query('set')
  async set(@Args('id') id: string) {
    return this.setServices.findById(id);
  }

  @Query('learningSets')
  async learningSet(@Context() context: Ctx) {
    // Check if user logged in
    if (!context.req.user) {
      throw new Error('Unauthorized!');
    }

    const result: { setId: number }[] = await this.setServices.$queryRaw`
            SELECT "Set"."id" AS "setId"
            FROM "UserLearningTerm"
            JOIN "User" ON "UserLearningTerm"."userId" = "User"."id" AND "User"."id" = ${context.req.user.id}
            JOIN "Term" ON "UserLearningTerm"."termId" = "Term"."id"
            JOIN "Set" ON "Term"."setId" = "Set"."id"
            GROUP BY "Set"."id"
        `;

    const setIds = result.map(({ setId }) => {
      return setId;
    });

    return this.setServices.findByIds(setIds);
  }

  @Query('findSet')
  async findSet(@Args('query') query: string) {
    return this.setServices.search(query);
  }

  @ResolveField('author')
  async author(@Parent() set: Set) {
    return this.setServices.user.findUnique({ where: { id: set.authorId } });
  }

  @ResolveField('terms')
  async terms(@Parent() set: Set, @Context() context: Ctx) {
    return this.termService.findBySetId(set.id, context);
  }

  @Mutation('setUserLearningSet')
  async setUserLearningSet(
    @Args('setId') setId: string,
    @Context() context: Ctx,
  ) {
    // Check if user logged in
    if (!context.req.user) {
      throw new Error('Unauthorized!');
    }

    return this.setServices.initUserLearningSet(setId, context);
  }

  @Mutation('createSet')
  async createSet(
    @Args('createSetInput') createSetInput: CreateSetInput,
    @Context() context: Ctx,
  ) {
    // Check if user logged in
    if (!context.req.user) {
      throw new Error('Unauthorized!');
    }

    const { id: setId } = await this.setServices.set.create({
      data: {
        name: createSetInput.name,
        authorId: context.req.user.id,
      },
    });

    for (let term of createSetInput.terms) {
      await this.setServices.term.create({
        data: {
          setId,
          answer: term.answer,
          question: term.question,
          explanation: term.explanation,
          options: {
            createMany: {
              data: term.options?.map(({ option }) => ({ option })) || [],
            },
          },
        },
      });
    }

    return this.setServices.findById(setId);
  }

  @Mutation('updateSet')
  async updateSet(
    @Args('updateSetInput') updateSetInput: UpdateSetInput,
    @Context() context: Ctx,
  ) {
    // Check if user logged in
    if (!context.req.user) {
      throw new Error('Unauthorized!');
    }

    // Check if its the same user who created this set
    const author = await this.setServices.set.findUnique({
      where: { id: parseInt(updateSetInput.id) },
      select: { authorId: true },
    });
    if (author?.authorId !== context.req.user.id) {
      throw new Error('Unauthorized!');
    }

    // Update set
    const { id: setId } = await this.setServices.set.update({
      where: {
        id: parseInt(updateSetInput.id),
      },
      data: {
        name: updateSetInput.name,
      },
    });

    let updatedTermsId: number[] = [];
    for (let term of updateSetInput.terms) {
      if (term.id) {
        updatedTermsId.push(parseInt(term.id));
      }
    }

    // Delete all options of all term from the updated set
    await this.setServices.option.deleteMany({
      where: { term: { setId } },
    });

    // Delete all userLearningTerms from the terms about to be deleted
    await this.setServices.userLearningTerm.deleteMany({
      where: { term: { id: { notIn: updatedTermsId }, setId } },
    });

    // Delete all terms that are not in the UpdateSetInput
    await this.setServices.term.deleteMany({
      where: { id: { notIn: updatedTermsId }, setId },
    });

    // Upsert term
    for (let term of updateSetInput.terms) {
      const termData = _.omit({ ...term, setId }, ['id', 'options']);
      if (term.id) {
        await this.setServices.term.update({
          where: { id: parseInt(term.id) },
          data: {
            ...termData,
            options: {
              createMany: {
                data: term.options
                  ? term.options.map(({ option }) => ({ option }))
                  : [],
              },
            },
          },
        });
      } else {
        await this.setServices.term.create({
          data: {
            ...termData,
            options: {
              createMany: {
                data: term.options
                  ? term.options.map(({ option }) => ({ option }))
                  : [],
              },
            },
          },
        });
      }
    }

    // Return set
    return this.setServices.findById(setId);
  }
}
