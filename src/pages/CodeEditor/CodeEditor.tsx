import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Monaco from "../../components/Monaco";
import { graphql } from "../../gql";
import "./CodeEditor.tsx.css";
import { CodeResponse, ProgrammingTask, Stat } from "../../gql/graphql";
import { unauthorisedCheck } from "../../gql/exceptionChecks";
import UserContext from "../../contexts/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  CardHeader,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import {
  faFloppyDisk,
  faPlay,
  faCloud,
  faArrowsRotate,
  faCloudUpload,
  faExclamation,
  faCloudBolt,
} from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

enum SaveState {
  SAVING,
  UNSAVED,
  SAVED,
}

const Indicator: React.FC<{ saveState: SaveState }> = (props) => {
  switch (props.saveState) {
    case SaveState.UNSAVED:
      return (
        <div className="inline">
          <FontAwesomeIcon style={{ margin: "auto" }} icon={faCloudBolt} />
          <Text className="info">You have unsaved changes</Text>
        </div>
      );

    case SaveState.SAVING:
      return (
        <div className="inline">
          <FontAwesomeIcon icon={faCloudUpload} style={{ margin: "auto" }} />
          <Text className="info">Saving changes...</Text>
        </div>
      );

    case SaveState.SAVED:
      return (
        <div className="inline">
          <FontAwesomeIcon icon={faCloud} style={{ margin: "auto" }} />
          <Text className="info">Solution Saved</Text>
        </div>
      );

    default:
      return (
        <div className="inline">
          <FontAwesomeIcon icon={faExclamation} style={{ margin: "auto" }} />
          <Text className="info">You have unsaved changes</Text>
        </div>
      );
  }
};

interface IToolBarProps {
  language: string;
  avalibleLanguages: Array<string>;
  handleChange: (language: string) => void;
  handleReset: () => void;
  handleRun: () => void;
  handleSubmit: () => void;
  runCodeIsLoading: boolean;
  saveState: SaveState;
  canSubmit: boolean;
}

const ToolBar: React.FC<IToolBarProps> = (props) => {
  function handleChange(evt: any) {
    props.handleChange(evt.target.value);
  }

  return (
    <HStack className="code-tool-bar" spacing="1rem">
      <Text fontSize="xl" fontWeight="bold" as="h1">
        Editor
      </Text>
      <FormControl style={{ maxWidth: "20ch", position: "relative" }}>
        <FormLabel className="floatingLabel" htmlFor="language-select">
          Language
        </FormLabel>
        <Select
          id="language-select"
          onChange={handleChange}
          value={props.language}
        >
          {props.avalibleLanguages.map((language) => (
            <option
              id={`language-select-${language.replace("#", "sharp")}`}
              value={language}
            >
              {language}
            </option>
          ))}
        </Select>
      </FormControl>
      <Indicator saveState={props.saveState} />
      <Button
        style={{ margin: "0 0 0 auto" }}
        id="reset-solution"
        leftIcon={<FontAwesomeIcon icon={faArrowsRotate} />}
        variant="solid"
        onClick={props.handleReset}
        colorScheme="orange"
      >
        Reset
      </Button>
      {/* {props.canSubmit && (
        <Button
          isLoading={props.runCodeIsLoading}
          leftIcon={<FontAwesomeIcon icon={faFloppyDisk} />}
          colorScheme="whatsapp"
          variant="solid"
          onClick={props.handleSubmit}
        >
          Submit Code
        </Button>
      )}
      {!props.canSubmit && ( */}
        <Button
          id="run-code"
          style={{ marginRight: "1rem" }}
          isLoading={props.runCodeIsLoading}
          colorScheme="whatsapp"
          leftIcon={<FontAwesomeIcon icon={faPlay} />}
          variant="solid"
          onClick={props.handleRun}
        >
          Run Code
        </Button>
      {/* )} */}
    </HStack>
  );
};

const Stats: React.FC<{ data: CodeResponse | undefined }> = (props) => {
  if (!props.data) {
    return (
      <Card className="container container--stats">
        <CardHeader>Stats</CardHeader>
      </Card>
    );
  }

  let max = props.data.stats.reduce((acc: number, val: Stat | null) => {
    if (val == null) {
      return acc;
    }
    return +val.mem > acc ? +val.mem : acc;
  }, 0);

  const maxMemory = Math.round(max / 1000);

  return (
    <Card className="container container--stats">
      <CardHeader>Stats</CardHeader>
      <Divider />
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Execution Time</Th>
              <Th>Memory Usage</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{props.data.executionTimeMS} ms</Td>
              <Td>{maxMemory} kb</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Card>
  );
};

const getCode = graphql(`
  query getCode($id: Int!, $language: String!) {
    programmingTask(taskId: $id, language: $language) {
      id
      title
      description
      starterCode
      testCode
      language
      availableLanguages
      myCode
    }
  }
`);

const evaluateQuery = graphql(`
  query Evaluate($code: String!, $language: String!, $taskId: Int!) {
    evaluate(code: $code, language: $language, taskId: $taskId) {
      output
      stats {
        mem
        cpu
      }
      errorText
      isSuccessful
      executionTimeMS
    }
  }
`);

const saveCode = graphql(`
  mutation SaveCode($submission: UserCodeSubmissionInput) {
    submitCode(submission: $submission)
  }
`);

const CodeEditor: React.FC = () => {
  // Params
  const params = useParams();
  const navigate = useNavigate();
  const userObserver = React.useContext(UserContext);

  // State
  const [selectedLanguage, setSelectedLanguage] = React.useState("default");
  const [task, setTask] = React.useState<ProgrammingTask | null>(null);
  const [outputClassName, setOttputClassName] = React.useState(
    "container container--output output"
  );
  const [timeout, updateTimeout] = React.useState<number | undefined>();
  const [saveState, setSaveState] = React.useState(SaveState.SAVED);
  const [canSubmit, setCanSubmit] = React.useState(false);
  const [skipChange, setSkipChange] = React.useState(false);
  // Ensure that we have a task id
  const taskId = parseInt(params.taskid ?? "-1");
  if (taskId === -1) {
    navigate("/modules");
  }

  // GraphQL
  const { data: getCodeData, error: getCodeError } = useQuery(getCode, {
    variables: {
      id: taskId,
      language: selectedLanguage,
    },
  });

  const [evaluate, { data: evaluateData, loading: evaluateLoading }] =
    useLazyQuery(evaluateQuery, { fetchPolicy: "no-cache" });

  const [save, { loading: saveLoading }] = useMutation(saveCode);

  React.useEffect(() => {
    if (evaluateLoading) return;
    if (!evaluateData) return;
    if (evaluateData?.evaluate.isSuccessful) {
      setOttputClassName("container container--output output output--success");
      setCanSubmit(true);
    } else {
      setOttputClassName("container container--output output output--failure");
    }

    const timeout = setTimeout(() => {
      setOttputClassName("container container--output output");
    }, 1000);

    return function () {
      clearTimeout(timeout);
    };
  }, [evaluateData, evaluateLoading]);

  React.useEffect(() => {
    if (getCodeData) {
      if (selectedLanguage === "default") {
        setSelectedLanguage(getCodeData.programmingTask.language ?? "");
      }
      setTask(getCodeData.programmingTask);
    }
  }, [getCodeData]); // eslint-disable-line

  React.useEffect(() => {
    unauthorisedCheck(getCodeError, userObserver);
  }, [getCodeError, userObserver]);

  React.useEffect(() => {
    if (saveLoading) {
      setSaveState(SaveState.SAVING);
    } else {
      setSaveState(SaveState.SAVED);
    }
  }, [saveLoading]);

  if (task === null) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Spinner />
      </div>
    );
  }

  function evaluateCode() {
    if (!task) return; // Task should never be null if we have a task to run...
    evaluate({
      variables: {
        code: task.myCode ?? "",
        language: selectedLanguage,
        taskId
      },
    });
  }

  function handleSubmit() {}

  function onCodeUpdated(code: string) {
    // If they could previously submit, but they've changed some code, disable it again
    if (skipChange) {
      setSkipChange(false);
    }
    if (canSubmit) {
      setCanSubmit(false);
    }
    setTask((previous) => {
      return { ...previous, myCode: code } as ProgrammingTask;
    });
    clearTimeout(timeout);
    setSaveState(SaveState.UNSAVED);

    const t1 = setTimeout(() => {
      save({
        variables: {
          submission: {
            codeText: code,
            taskId,
            language: selectedLanguage,
          },
        },
      });
    }, 1000) as unknown as number;
    updateTimeout(t1);
  }

  return (
    <div className="code-zone">
      <div className="code-editor">
        <Card style={{ height: "calc((100vh / 2) - 55px)" }}>
          <ToolBar
            avalibleLanguages={task.availableLanguages as string[]} // CodeGen isn't seeing that this isn't an optional
            language={selectedLanguage}
            handleChange={(x) => {
              setSkipChange(true);
              setSelectedLanguage(x);
            }}
            handleReset={() => {
              setTask({ ...task, myCode: task.starterCode });
            }}
            handleRun={evaluateCode}
            handleSubmit={handleSubmit}
            saveState={saveState}
            runCodeIsLoading={evaluateLoading}
            canSubmit={canSubmit}
          />
          <Divider style={{ margin: "0.5rem 0" }} />

          <Monaco
            codeText={task.myCode!}
            height="100%"
            language={selectedLanguage}
            editable
            onChange={onCodeUpdated}
          />
        </Card>
        <Card style={{ height: "calc((100vh / 2) - 55px)", marginTop: "1rem" }}>
          <div className="code-tool-bar">
            <Text fontSize="xl" fontWeight="bold" as="h1">
              Tests
            </Text>
          </div>
          <Divider style={{ marginBottom: "0.5rem" }} />
          <Monaco
            editable={false}
            codeText={task.testCode ?? ""}
            height="100%"
            language={selectedLanguage}
          />
        </Card>
        <div style={{ height: "10px" }} />
      </div>
      <VStack className="code-zone--right">
        <Card className="container container--description">
          <h2>Task</h2>
          <Divider />
          <ReactMarkdown children={task.description} remarkPlugins={[remarkGfm]} />
        </Card>
        <Card className={outputClassName}>
          <div style={{ display: "flex" }}>
            <h2>Output</h2>
            <div
              style={{
                marginRight: "1rem",
                marginLeft: "auto",
                verticalAlign: "baseline",
              }}
            >
              {}
            </div>
          </div>
          <Divider />
          <pre>{evaluateData?.evaluate.output}</pre>
        </Card>
        <Stats data={evaluateData?.evaluate} />
      </VStack>
    </div>
  );
};

export default CodeEditor;
