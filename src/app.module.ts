import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { SetModule } from './set/set.module';
import { TermModule } from './term/term.module';
import { OptionModule } from './option/option.module';
import { set } from 'lodash';
import { decode } from 'src/utils/jwt.utils';
import { UserLearningTermModule } from './user-learning-term/user-learning-term.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
      introspection: true,
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      cors: {
        credentials: true,
        origin: process.env.FRONTEND_SERVER_URL as string
      },
      context: ({req, res}) => {
        const { accessToken } = req.cookies;

        const decoded = accessToken && decode(accessToken.replace("Bearer ", ""));
        if (decoded?.payload) {
          set(req, 'user', decoded.payload);
        }

        return { req, res };
      }
    }),
    UserModule,
    SetModule,
    TermModule,
    OptionModule,
    UserLearningTermModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
