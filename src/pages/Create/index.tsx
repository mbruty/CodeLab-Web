import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Text,
} from "@chakra-ui/react";
import MarkdownEditor from "@uiw/react-markdown-editor";
import React, { FC, useState } from "react";

const CreatePage: FC = (props) => {
  const [taskDescription, setTaskDescription] = useState("");
  return (
    <Card>
      <CardHeader>
        <Heading as="h1">Create a task</Heading>
      </CardHeader>
      <CardBody>
        <Heading as="h2" fontSize="x-large">
          Task text
        </Heading>
        <MarkdownEditor
          height="30ch"
          visible
          value={taskDescription}
          onChange={setTaskDescription}
        />
        <Divider marginY="1" />
        <Heading as="h2" fontSize="x-large">
          Hi
        </Heading>
      </CardBody>
    </Card>
  );
};

export default CreatePage;
