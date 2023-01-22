import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
  Context,
} from '@nestjs/graphql';
import { User, UserLearningTerm } from '@prisma/client';
import { SignupDTO } from './dto/create-user.dto';
import { LoginInputDTO } from './dto/login-input.dto';
import { UserService } from './user.service';
import { Ctx } from 'src/types/Context.type';

@Resolver('User')
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query('users')
  async users(@Context() context: Ctx) {
    if (!context.req.user) {
      throw new Error('Unauthorized!');
    }

    return this.userService.user.findMany();
  }

  @Query('user')
  async user(@Args('id') id: string, @Context() context: Ctx) {
    if (!context.req.user) {
      throw new Error('Unauthorized!');
    }

    return this.userService.user.findUnique({ where: { id: parseInt(id) } });
  }

  @Query('me')
  async me(@Context() context: Ctx) {
    const username = context.req.user?.username;

    if (username) {
      return this.userService.user.findUnique({ where: { username } });
    } else {
      return null;
    }
  }

  @ResolveField('sets')
  async sets(@Parent() user: User) {
    return this.userService.set.findMany({
      where: { authorId: user.id },
      include: { _count: { select: { terms: true } } },
    });
  }

  @ResolveField('learningTerms')
  async learningTerms(@Parent() user: User, @Context() context: Ctx) {
    if (!context.req.user || context.req.user.username !== user.username) {
      throw new Error('Unauthorized!');
    }

    return this.userService.userLearningTerm.findMany({
      where: { userId: user.id },
    });
  }

  @Mutation('signup')
  async signup(
    @Args('signupInput') signupInput: SignupDTO,
    @Context() context: Ctx,
  ) {
    const { username, password } = signupInput;

    return this.userService.createUser(username, password, context);
  }

  @Mutation('login')
  async login(
    @Args('loginInput') loginInput: LoginInputDTO,
    @Context() context: Ctx,
  ) {
    const { username, password } = loginInput;

    return this.userService.login(username, password, context);
  }

  @Mutation('logout')
  async logout(@Context() context: Ctx) {
    return this.userService.logout(context);
  }
}
