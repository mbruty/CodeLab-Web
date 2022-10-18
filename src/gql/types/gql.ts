/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n\tquery AuthCheck {\n\t\tme {\n\t\t\tid\n\t\t\temail\n\t\t\tusername\n\t\t\txp\n\t\t}\n\t}\n": types.AuthCheckDocument,
    "\n\t\tquery GetCode($id: Int!, $language: String!) {\n\t\t\tprogrammingTask(taskId: $id, language: $language) {\n\t\t\t\ttitle\n\t\t\t\tdescription\n\t\t\t\tstarterCode\n\t\t\t\ttestCode\n\t\t\t\tlanguage\n\t\t\t\tavailableLanguages\n\t\t\t}\n\t\t}\n\t": types.GetCodeDocument,
    "\n\t\tquery Evaluate($code: String!, $language: String!) {\n\t\t\tevaluate(code: $code, language: $language, taskId: 1) {\n\t\t\t\toutput\n\t\t\t\tstats {\n\t\t\t\t\tmem\n\t\t\t\t}\n\t\t\t\terrorText\n\t\t\t\tisSuccessful\n\t\t\t\texecutionTimeMS\n\t\t\t}\n\t\t}\n\t": types.EvaluateDocument,
    "\n\tmutation LoginMutation($email: String!, $password: String!) {\n\t\tlogin(email: $email, password: $password) {\n\t\t\tid\n\t\t\temail\n\t\t\tusername\n\t\t\txp\n\t\t}\n\t}\n": types.LoginMutationDocument,
};

export function graphql(source: "\n\tquery AuthCheck {\n\t\tme {\n\t\t\tid\n\t\t\temail\n\t\t\tusername\n\t\t\txp\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery AuthCheck {\n\t\tme {\n\t\t\tid\n\t\t\temail\n\t\t\tusername\n\t\t\txp\n\t\t}\n\t}\n"];
export function graphql(source: "\n\t\tquery GetCode($id: Int!, $language: String!) {\n\t\t\tprogrammingTask(taskId: $id, language: $language) {\n\t\t\t\ttitle\n\t\t\t\tdescription\n\t\t\t\tstarterCode\n\t\t\t\ttestCode\n\t\t\t\tlanguage\n\t\t\t\tavailableLanguages\n\t\t\t}\n\t\t}\n\t"): (typeof documents)["\n\t\tquery GetCode($id: Int!, $language: String!) {\n\t\t\tprogrammingTask(taskId: $id, language: $language) {\n\t\t\t\ttitle\n\t\t\t\tdescription\n\t\t\t\tstarterCode\n\t\t\t\ttestCode\n\t\t\t\tlanguage\n\t\t\t\tavailableLanguages\n\t\t\t}\n\t\t}\n\t"];
export function graphql(source: "\n\t\tquery Evaluate($code: String!, $language: String!) {\n\t\t\tevaluate(code: $code, language: $language, taskId: 1) {\n\t\t\t\toutput\n\t\t\t\tstats {\n\t\t\t\t\tmem\n\t\t\t\t}\n\t\t\t\terrorText\n\t\t\t\tisSuccessful\n\t\t\t\texecutionTimeMS\n\t\t\t}\n\t\t}\n\t"): (typeof documents)["\n\t\tquery Evaluate($code: String!, $language: String!) {\n\t\t\tevaluate(code: $code, language: $language, taskId: 1) {\n\t\t\t\toutput\n\t\t\t\tstats {\n\t\t\t\t\tmem\n\t\t\t\t}\n\t\t\t\terrorText\n\t\t\t\tisSuccessful\n\t\t\t\texecutionTimeMS\n\t\t\t}\n\t\t}\n\t"];
export function graphql(source: "\n\tmutation LoginMutation($email: String!, $password: String!) {\n\t\tlogin(email: $email, password: $password) {\n\t\t\tid\n\t\t\temail\n\t\t\tusername\n\t\t\txp\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation LoginMutation($email: String!, $password: String!) {\n\t\tlogin(email: $email, password: $password) {\n\t\t\tid\n\t\t\temail\n\t\t\tusername\n\t\t\txp\n\t\t}\n\t}\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;