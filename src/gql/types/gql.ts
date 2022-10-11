/* eslint-disable */
import * as types from './graphql';
import type {TypedDocumentNode as DocumentNode} from '@graphql-typed-document-node/core';

const documents = {
	"\n\tquery AuthCheck {\n\t\tme {\n\t\t\tid\n\t\t\temail\n\t\t\tusername\n\t\t\txp\n\t\t}\n\t}\n": types.AuthCheckDocument,
	"\n\tmutation LoginMutation($email: String!, $password: String!) {\n\t\tlogin(email: $email, password: $password) {\n\t\t\tid\n\t\t\temail\n\t\t\tusername\n\t\t\trefreshCount\n\t\t}\n\t}\n": types.LoginMutationDocument,
};

export function graphql(source: "\n\tquery AuthCheck {\n\t\tme {\n\t\t\tid\n\t\t\temail\n\t\t\tusername\n\t\t\txp\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery AuthCheck {\n\t\tme {\n\t\t\tid\n\t\t\temail\n\t\t\tusername\n\t\t\txp\n\t\t}\n\t}\n"];
export function graphql(source: "\n\tmutation LoginMutation($email: String!, $password: String!) {\n\t\tlogin(email: $email, password: $password) {\n\t\t\tid\n\t\t\temail\n\t\t\tusername\n\t\t\trefreshCount\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation LoginMutation($email: String!, $password: String!) {\n\t\tlogin(email: $email, password: $password) {\n\t\t\tid\n\t\t\temail\n\t\t\tusername\n\t\t\trefreshCount\n\t\t}\n\t}\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
	return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;