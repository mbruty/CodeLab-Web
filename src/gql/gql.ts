/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query GetLoggedInUser {\n    me {\n      id\n      username\n      xp\n    }\n  }\n": types.GetLoggedInUserDocument,
    "\n  query getCode($id: Int!, $language: String!) {\n    programmingTask(taskId: $id, language: $language) {\n      id\n      title\n      description\n      starterCode\n      testCode\n      language\n      availableLanguages\n      myCode\n    }\n  }\n": types.GetCodeDocument,
    "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      username\n      xp\n    }\n  }\n": types.LoginDocument,
};

export function graphql(source: "\n  query GetLoggedInUser {\n    me {\n      id\n      username\n      xp\n    }\n  }\n"): (typeof documents)["\n  query GetLoggedInUser {\n    me {\n      id\n      username\n      xp\n    }\n  }\n"];
export function graphql(source: "\n  query getCode($id: Int!, $language: String!) {\n    programmingTask(taskId: $id, language: $language) {\n      id\n      title\n      description\n      starterCode\n      testCode\n      language\n      availableLanguages\n      myCode\n    }\n  }\n"): (typeof documents)["\n  query getCode($id: Int!, $language: String!) {\n    programmingTask(taskId: $id, language: $language) {\n      id\n      title\n      description\n      starterCode\n      testCode\n      language\n      availableLanguages\n      myCode\n    }\n  }\n"];
export function graphql(source: "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      username\n      xp\n    }\n  }\n"): (typeof documents)["\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      username\n      xp\n    }\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;