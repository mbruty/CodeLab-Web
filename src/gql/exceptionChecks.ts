import { ApolloError } from "@apollo/client";
import UserObserver from "../contexts/UserObserver";

export function unauthorisedCheck(
  err: ApolloError | undefined,
  observer: UserObserver
) {
  if (
    err &&
    err.message.startsWith(
      "net.bruty.CodeLabs.graphql.exceptions.UnauthorisedException"
    )
  ) {
    observer.notifyUnauthorised();
  }
}
