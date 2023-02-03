import "./index.tsx.css";
import React, { FC, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import UserContext from "../../contexts/UserContext";
import { graphql } from "gql";
import { unauthorisedCheck } from "gql/exceptionChecks";
import { Card } from "@chakra-ui/react";


const getModuleQuery = graphql(`
  query getModule($moduleId: Int!) {
    module(moduleId: $moduleId) {
      title
      description
      tasks {
        id
        title
        description
        availableLanguages
      }
    }
  }
`);

const ModulePage: FC = (props) => {
  const { moduleid } = useParams();
  const { data, error, loading } = useQuery(getModuleQuery);
  const userObserver = useContext(UserContext);

  useEffect(() => {
    unauthorisedCheck(error, userObserver);
  }, [error, userObserver]);

  return (
    <Card>
    </Card>
  )
};

export default ModulePage;
