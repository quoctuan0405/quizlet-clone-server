import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Ctx } from 'src/types/Context.type';

@Injectable()
export class TermService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async findBySetId(setId: any, context: Ctx) {
    if (!context.req.user) {
      return this.term.findMany({ where: { setId } });
    }

    const terms = await this.term.findMany({
      where: { setId },
      select: {
        id: true,
        question: true,
        answer: true,
        explanation: true,
        options: true,
        usersLearning: {
          where: { userId: context.req.user.id },
          select: { remained: true, learned: true },
        },
      },
    });
    const termsWithRemained = terms.map((term) => {
      if (term.usersLearning.length !== 0) {
        return {
          ...term,
          usersLearning: undefined,
          remained: term.usersLearning[0].remained,
          learned: term.usersLearning[0].learned,
        };
      }
      return term;
    });

    return termsWithRemained;
  }

  async findById(id: any, context: Ctx) {
    if (!context.req.user) {
      return this.term.findMany({ where: { id } });
    }

    const term = await this.term.findUnique({
      where: { id },
      select: {
        id: true,
        question: true,
        answer: true,
        explanation: true,
        options: true,
        usersLearning: {
          where: { userId: context.req.user.id },
          select: { remained: true, learned: true },
        },
      },
    });

    if (term?.usersLearning) {
      return {
        ...term,
        usersLearning: undefined,
        remained: term?.usersLearning[0].remained,
        learned: term?.usersLearning[0].learned,
      };
    } else {
      return term;
    }
  }

  async findByIds(ids: number[], context: Ctx) {
    if (!context.req.user) {
      return this.term.findMany({ where: { id: { in: ids } } });
    }

    const terms = await this.term.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        question: true,
        answer: true,
        explanation: true,
        options: true,
        usersLearning: {
          where: { userId: context.req.user.id },
          select: { remained: true, learned: true },
        },
      },
    });
    const termsWithRemained = terms.map((term) => {
      if (term.usersLearning.length !== 0) {
        return {
          ...term,
          usersLearning: undefined,
          remained: term.usersLearning[0].remained,
          learned: term.usersLearning[0].learned,
        };
      }
      return term;
    });

    return termsWithRemained;
  }
}
