
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class SignupInput {
    username: string;
    password: string;
}

export class LoginInput {
    username: string;
    password: string;
}

export class TermReport {
    termId: string;
    correct: boolean;
}

export class CreateSetInput {
    name: string;
    terms: CreateTermInput[];
}

export class CreateTermInput {
    question: string;
    answer: string;
    options?: Nullable<Nullable<UpsertOption>[]>;
    explanation?: Nullable<string>;
}

export class UpdateSetInput {
    id: string;
    name: string;
    terms: UpdateTermInput[];
}

export class UpdateTermInput {
    id?: Nullable<string>;
    question: string;
    answer: string;
    options?: Nullable<Nullable<UpsertOption>[]>;
    explanation?: Nullable<string>;
}

export class UpsertOption {
    id?: Nullable<string>;
    option: string;
}

export abstract class IQuery {
    abstract hi(): string | Promise<string>;

    abstract user(id: string): Nullable<User> | Promise<Nullable<User>>;

    abstract me(): Nullable<User> | Promise<Nullable<User>>;

    abstract users(): Nullable<User>[] | Promise<Nullable<User>[]>;

    abstract sets(): Nullable<Set>[] | Promise<Nullable<Set>[]>;

    abstract learningSets(): Nullable<Nullable<Set>[]> | Promise<Nullable<Nullable<Set>[]>>;

    abstract findSet(query?: Nullable<string>): Nullable<Nullable<Set>[]> | Promise<Nullable<Nullable<Set>[]>>;

    abstract set(id: string): Nullable<Set> | Promise<Nullable<Set>>;

    abstract terms(setId: string): Nullable<Term>[] | Promise<Nullable<Term>[]>;

    abstract options(termId: string): Nullable<Option>[] | Promise<Nullable<Option>[]>;
}

export abstract class IMutation {
    abstract signup(signupInput?: Nullable<SignupInput>): Nullable<User> | Promise<Nullable<User>>;

    abstract login(loginInput?: Nullable<LoginInput>): Nullable<User> | Promise<Nullable<User>>;

    abstract logout(): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract setUserLearningSet(setId: string): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract setUserLearningTerms(terms: Nullable<TermReport>[]): Nullable<Term>[] | Promise<Nullable<Term>[]>;

    abstract resetLearning(setId: string): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract createSet(createSetInput?: Nullable<CreateSetInput>): Set | Promise<Set>;

    abstract updateSet(updateSetInput?: Nullable<UpdateSetInput>): Set | Promise<Set>;
}

export class Set {
    id: string;
    name: string;
    author: User;
    _count: _CountTerm;
    terms?: Nullable<Nullable<Term>[]>;
}

export class Term {
    id: string;
    question: string;
    answer: string;
    explanation?: Nullable<string>;
    options?: Nullable<Nullable<Option>[]>;
    remained?: Nullable<number>;
    learned?: Nullable<boolean>;
}

export class Option {
    id: string;
    option: string;
}

export class User {
    id: string;
    username: string;
    sets?: Nullable<Nullable<Set>[]>;
    learningTerms?: Nullable<Nullable<UserLearningTerm>[]>;
    accessToken?: Nullable<string>;
}

export class UserLearningTerm {
    id: string;
    user: User;
    term: Term;
    remained: number;
}

export class _CountTerm {
    terms: number;
}

type Nullable<T> = T | null;
