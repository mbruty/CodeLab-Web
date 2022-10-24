/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query GetLoggedInUser {\n    me {\n      id\n      username\n      xp\n    }\n  }\n": types.GetLoggedInUserDocument,
    "\n  query getCode($id: Int!, $language: String!) {\n    programmingTask(taskId: $id, language: $language) {\n      id\n      title\n      description\n      starterCode\n      testCode\n      language\n      availableLanguages\n      myCode\n    }\n  }\n": types.GetCodeDocument,
    "\n  query Evaluate($code: String!, $language: String!) {\n    evaluate(code: $code, language: $language, taskId: 1) {\n      output\n      stats {\n        mem\n        cpu\n      }\n      errorText\n      isSuccessful\n      executionTimeMS\n    }\n  }\n": types.EvaluateDocument,
    "\n  mutation SaveCode($submission: UserCodeSubmissionInput) {\n    submitCode(submission: $submission)\n  }\n": types.SaveCodeDocument,
    "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      username\n      xp\n    }\n  }\n": types.LoginDocument,
};

export function graphql(source: "\n  query GetLoggedInUser {\n    me {\n      id\n      username\n      xp\n    }\n  }\n"): (typeof documents)["\n  query GetLoggedInUser {\n    me {\n      id\n      username\n      xp\n    }\n  }\n"];
export function graphql(source: "\n  query getCode($id: Int!, $language: String!) {\n    programmingTask(taskId: $id, language: $language) {\n      id\n      title\n      description\n      starterCode\n      testCode\n      language\n      availableLanguages\n      myCode\n    }\n  }\n"): (typeof documents)["\n  query getCode($id: Int!, $language: String!) {\n    programmingTask(taskId: $id, language: $language) {\n      id\n      title\n      description\n      starterCode\n      testCode\n      language\n      availableLanguages\n      myCode\n    }\n  }\n"];
export function graphql(source: "\n  query Evaluate($code: String!, $language: String!) {\n    evaluate(code: $code, language: $language, taskId: 1) {\n      output\n      stats {\n        mem\n        cpu\n      }\n      errorText\n      isSuccessful\n      executionTimeMS\n    }\n  }\n"): (typeof documents)["\n  query Evaluate($code: String!, $language: String!) {\n    evaluate(code: $code, language: $language, taskId: 1) {\n      output\n      stats {\n        mem\n        cpu\n      }\n      errorText\n      isSuccessful\n      executionTimeMS\n    }\n  }\n"];
export function graphql(source: "\n  mutation SaveCode($submission: UserCodeSubmissionInput) {\n    submitCode(submission: $submission)\n  }\n"): (typeof documents)["\n  mutation SaveCode($submission: UserCodeSubmissionInput) {\n    submitCode(submission: $submission)\n  }\n"];
export function graphql(source: "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      username\n      xp\n    }\n  }\n"): (typeof documents)["\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      username\n      xp\n    }\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;