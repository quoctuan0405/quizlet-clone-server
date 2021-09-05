import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CookieOptions } from 'express';
import { Ctx } from 'src/types/Context.type';
import { signJwt } from 'src/utils/jwt.utils';

const cookieOptions: CookieOptions = {
    domain: process.env.BACKEND_DOMAIN || 'localhost',
    secure: true,
    sameSite: 'none',
    httpOnly: true,
    path: '/'
};

@Injectable()
export class UserService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    async setLoginCookie(user: User, context: Ctx) {
        const jwt = signJwt({ id: user.id, username: user.username }, '1w');

        context.res.cookie('accessToken', jwt, cookieOptions);
    }

    async createUser(username: string, password: string, context: Ctx): Promise<User> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await this.user.create({ data: { username, password: hashedPassword }});

        this.setLoginCookie(user, context);

        return user;
    }

    async login(username: string, candidatePassword: string, context: Ctx) {
        const user = await this.user.findUnique({ where: { username } });
        
        if (!user || !await bcrypt.compare(candidatePassword, user.password)) {
            throw new Error("Invalid credentials.");
        }

        this.setLoginCookie(user, context);

        return user;
    }

    async logout(context: Ctx) {
        context.res.cookie('accessToken', '', {...cookieOptions, maxAge: 0});
        return true;
    }

}
