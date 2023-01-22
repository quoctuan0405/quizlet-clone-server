import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { set } from 'lodash';
import { decode } from 'src/utils/jwt.utils';
import { UserModule } from './user/user.module';
import { SetModule } from './set/set.module';
import { TermModule } from './term/term.module';
import { OptionModule } from './option/option.module';
import { UserLearningTermModule } from './user-learning-term/user-learning-term.module';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      typePaths: ['./**/*.graphql'],
      introspection: true,
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      cors: {
        credentials: true,
        origin: process.env.FRONTEND_SERVER_URL as string,
      },
      context: ({ req, res }) => {
        let accessToken: string;

        if (req.cookies?.accessToken) {
          accessToken = req.cookies.accessToken;
        } else if (req.headers.accessToken) {
          accessToken = req.headers.accessToken;
        } else if (req.headers.accesstoken) {
          accessToken = req.headers.accesstoken;
        }

        const decoded =
          accessToken && decode(accessToken.replace('Bearer ', ''));
        if (decoded?.payload) {
          set(req, 'user', decoded.payload);
        }

        return { req, res };
      },
    }),
    UserModule,
    SetModule,
    TermModule,
    OptionModule,
    UserLearningTermModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
