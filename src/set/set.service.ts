import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Ctx } from 'src/types/Context.type';

@Injectable()
export class SetService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async findMany() {
    return this.set.findMany({
      include: { _count: { select: { terms: true } } },
    });
  }

  async findById(id: string | number) {
    return this.set.findUnique({
      where: { id: typeof id === 'string' ? parseInt(id) : id },
      include: { _count: { select: { terms: true } } },
    });
  }

  async findByIds(ids: number[]) {
    return this.set.findMany({
      where: { id: { in: ids } },
      include: { _count: { select: { terms: true } } },
    });
  }

  async search(query: string) {
    const queryLowercase = query.toLowerCase();

    if (!queryLowercase || queryLowercase === '') {
      return this.set.findMany({
        include: { _count: { select: { terms: true } } },
      });
    }

    return this.set.findMany({
      where: {
        OR: [
          {
            name: { contains: queryLowercase, mode: 'insensitive' },
          },
          {
            terms: {
              some: {
                OR: [
                  {
                    question: { contains: queryLowercase, mode: 'insensitive' },
                  },
                  { answer: { contains: queryLowercase, mode: 'insensitive' } },
                  {
                    options: {
                      some: {
                        option: {
                          contains: queryLowercase,
                          mode: 'insensitive',
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      include: { _count: { select: { terms: true } } },
    });
  }

  async initUserLearningSet(setId: string | number, context: Ctx) {
    // Find all terms id in the set
    const termsId = await this.term.findMany({
      where: { setId: typeof setId === 'string' ? parseInt(setId) : setId },
      select: { id: true },
    });
    if (termsId.length === 0) {
      return false;
    }

    // If user already learning that set, return false
    const alreadyLearningSet = await this.userLearningTerm.findFirst({
      where: { userId: context.req.user.id, termId: termsId[0].id },
    });
    if (alreadyLearningSet) {
      return false;
    }

    // If its the first time, then that user must answer correctly 3 times in a row
    const userLearningTerms = termsId.map(({ id }) => ({
      userId: context.req.user.id,
      termId: id,
      remained: 3,
      learned: false,
    }));

    await this.userLearningTerm.createMany({ data: userLearningTerms });

    return true;
  }
}
