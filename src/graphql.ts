
/*
 * ------------------------------------------------------
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
    options?: UpsertOption[];
    explanation?: string;
}

export class UpdateSetInput {
    id: string;
    name: string;
    terms: UpdateTermInput[];
}

export class UpdateTermInput {
    id?: string;
    question: string;
    answer: string;
    options?: UpsertOption[];
    explanation?: string;
}

export class UpsertOption {
    id?: string;
    option: string;
}

export abstract class IQuery {
    abstract hi(): string | Promise<string>;

    abstract user(id: string): User | Promise<User>;

    abstract me(): User | Promise<User>;

    abstract users(): User[] | Promise<User[]>;

    abstract sets(): Set[] | Promise<Set[]>;

    abstract learningSets(): Set[] | Promise<Set[]>;

    abstract findSet(query?: string): Set[] | Promise<Set[]>;

    abstract set(id: string): Set | Promise<Set>;

    abstract terms(setId: string): Term[] | Promise<Term[]>;

    abstract options(termId: string): Option[] | Promise<Option[]>;
}

export abstract class IMutation {
    abstract signup(signupInput?: SignupInput): User | Promise<User>;

    abstract login(loginInput?: LoginInput): User | Promise<User>;

    abstract logout(): boolean | Promise<boolean>;

    abstract setUserLearningSet(setId: string): boolean | Promise<boolean>;

    abstract setUserLearningTerms(terms: TermReport[]): Term[] | Promise<Term[]>;

    abstract resetLearning(setId: string): boolean | Promise<boolean>;

    abstract createSet(createSetInput?: CreateSetInput): Set | Promise<Set>;

    abstract updateSet(updateSetInput?: UpdateSetInput): Set | Promise<Set>;
}

export class Set {
    id: string;
    name: string;
    author: User;
    _count: _CountTerm;
    terms?: Term[];
}

export class Term {
    id: string;
    question: string;
    answer: string;
    explanation?: string;
    options?: Option[];
    remained?: number;
    learned?: boolean;
}

export class Option {
    id: string;
    option: string;
}

export class User {
    id: string;
    username: string;
    sets?: Set[];
    learningTerms?: UserLearningTerm[];
    accessToken?: string;
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
