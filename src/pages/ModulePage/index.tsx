import "./index.tsx.css";
import React, { FC, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import UserContext from "../../contexts/UserContext";
import { graphql } from "gql";
import { unauthorisedCheck } from "gql/exceptionChecks";
import {
  Card,
  Center,
  Grid,
  Heading,
  HStack,
  Skeleton,
  SkeletonText,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const getModuleQuery = graphql(`
  query getModule($moduleId: ID!) {
    module(moduleId: $moduleId) {
      title
      description
      tasks {
        id
        title
        availableLanguages
      }
    }
  }
`);

function langToColour(lang: string | null): Array<string> {
  switch (lang) {
    case "Python":
      return ["blue.600", "white"];
    default:
      return ["red.100", "black.100"];
  }
}

const ModulePage: FC = (props) => {
  const { moduleid } = useParams();
  const { data, error, loading } = useQuery(getModuleQuery, {
    variables: {
      moduleId: moduleid!,
    },
  });
  const userObserver = useContext(UserContext);

  useEffect(() => {
    unauthorisedCheck(error, userObserver);
  }, [error, userObserver]);

  if (loading) {
    return (
      <Stack spacing="2">
        <Skeleton maxWidth="400">
          <Heading as="h1">Module title</Heading>
        </Skeleton>
        <Skeleton>
          <Text>Longer module description</Text>
        </Skeleton>
        <Grid gridTemplateColumns="repeat(4, 1fr)" marginTop="2" gap="2">
          <Skeleton width="200" height="100" />
          <Skeleton width="200" height="100" />
          <Skeleton width="200" height="100" />
          <Skeleton width="200" height="100" />
          <Skeleton width="200" height="100" />
          <Skeleton width="200" height="100" />
        </Grid>
      </Stack>
    );
  }

  return (
    <>
      <Heading as="h1">{data?.module.title}</Heading>
      <Text>{data?.module.description}</Text>
      <Grid gridTemplateColumns="repeat(4, 1fr)" marginTop="2" gap="2">
        {data?.module.tasks?.map((task) => (
          <Link to={`/code/${task?.id}`}>
            <Card padding="0.5" paddingLeft="2">
              <Heading fontSize="xx-large" as="h2">
                {task?.title}
              </Heading>
              <HStack marginTop="1">
                {task?.availableLanguages?.map((lang) => (
                  <Card
                    padding="0.5"
                    paddingLeft="2"
                    paddingRight="2"
                    backgroundColor={langToColour(lang)[0]}
                    color={langToColour(lang)[1]}
                    borderRadius="xl"
                  >
                    <Text>{lang}</Text>
                  </Card>
                ))}
              </HStack>
              <FontAwesomeIcon
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%) ",
                }}
                icon={faChevronRight}
              />
            </Card>
          </Link>
        ))}
      </Grid>
    </>
  );
};

export default ModulePage;
