import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Term } from '@prisma/client';
import { TermReport } from 'src/graphql';
import { Ctx } from 'src/types/Context.type';
import { TermService } from './term.service';

@Resolver('Term')
export class TermResolver {
    constructor(private termService: TermService) {}

    @Query('terms')
    async terms(@Args('setId') setId: string, @Context() ctx: Ctx) {
        return this.termService.findBySetId(setId, ctx);
    }

    @ResolveField('options')
    async options(@Parent() term: Term) {
        return this.termService.option.findMany({where: {termId: term.id}});
    }
}
