import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import CircularProgress from "@mui/material/CircularProgress";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Monaco from "../../components/Monaco";
import { graphql } from "../../gql";
import "./CodeEditor.tsx.css";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { CodeResponse, ProgrammingTask, Stat } from "../../gql/graphql";
import { unauthorisedCheck } from "../../gql/exceptionChecks";
import UserContext from "../../contexts/UserContext";
import Divider from "@mui/material/Divider";
import RefreshIcon from "@mui/icons-material/Refresh";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LoadingButton from "@mui/lab/LoadingButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import ErrorIcon from "@mui/icons-material/Error";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import SaveIcon from "@mui/icons-material/Save";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

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
          <ErrorIcon style={{ margin: "auto" }} />
          <p className="info">You have unsaved changes</p>
        </div>
      );

    case SaveState.SAVING:
      return (
        <div className="inline">
          <CloudSyncIcon style={{ margin: "auto" }} />
          <p className="info">Saving changes...</p>
        </div>
      );

    case SaveState.SAVED:
      return (
        <div className="inline">
          <SaveIcon style={{ margin: "auto" }} />
          <p className="info">Solution Saved</p>
        </div>
      );

    default:
      return (
        <div className="inline">
          <ErrorIcon style={{ margin: "auto" }} />
          <p className="info">You have unsaved changes</p>
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
  function handleChange(evt: SelectChangeEvent) {
    props.handleChange(evt.target.value);
  }

  return (
    <div className="code-tool-bar">
      <h2>Editor</h2>
      <FormControl style={{ minWidth: "200px" }}>
        <InputLabel id="language-select-label">Language</InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          label="Language"
          onChange={handleChange}
          value={props.language}
        >
          {props.avalibleLanguages.map((language) => (
            <MenuItem value={language}>{language}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Indicator saveState={props.saveState} />
      <div style={{ margin: "auto 0 auto auto" }}>
        <Button
          style={{ marginRight: "1rem" }}
          color="secondary"
          startIcon={<RefreshIcon />}
          variant="contained"
          onClick={props.handleReset}
        >
          Reset
        </Button>
        {props.canSubmit && (
          <LoadingButton
            style={{ marginRight: "1rem" }}
            loading={props.runCodeIsLoading}
            loadingPosition="start"
            color="success"
            startIcon={<SaveAltIcon />}
            variant="contained"
            onClick={props.handleSubmit}
          >
            Submit Code
          </LoadingButton>
        )}
        {!props.canSubmit && (
          <LoadingButton
            style={{ marginRight: "1rem" }}
            loading={props.runCodeIsLoading}
            loadingPosition="start"
            color="success"
            startIcon={<PlayArrowIcon />}
            variant="contained"
            onClick={props.handleRun}
          >
            Run Code
          </LoadingButton>
        )}
      </div>
    </div>
  );
};

const Stats: React.FC<{ data: CodeResponse | undefined }> = (props) => {
  if (!props.data) {
    return (
      <Paper className="container container--stats">
        <h2>Stats</h2>
        <Divider />
      </Paper>
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
    <Paper className="container container--stats">
      <h2>Stats</h2>
      <Divider />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Execution Time</TableCell>
            <TableCell align="left">Memory Usage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{props.data.executionTimeMS} ms</TableCell>
            <TableCell>{maxMemory} kb</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
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
  query Evaluate($code: String!, $language: String!) {
    evaluate(code: $code, language: $language, taskId: 1) {
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

  const [
    evaluate,
    { data: evaluateData, error: evaluateError, loading: evaluateLoading },
  ] = useLazyQuery(evaluateQuery, { fetchPolicy: "no-cache" });

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
        setSelectedLanguage(getCodeData.programmingTask.language);
      }
      setTask(getCodeData.programmingTask);
    }
  }, [getCodeData]);

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
    return <CircularProgress />;
  }

  function evaluateCode() {
    if (!task) return; // Task should never be null if we have a task to run...
    evaluate({
      variables: {
        code: task.myCode,
        language: selectedLanguage,
      },
    });
  }

  function handleSubmit() {}

  function onCodeUpdated(code: string) {
    // If they could previously submit, but they've changed some code, disable it again
    if(skipChange) {
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
        <Paper style={{ height: "50%" }}>
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
          <Monaco
            codeText={task.myCode!}
            height="90%"
            language={selectedLanguage}
            editable
            onChange={onCodeUpdated}
          />
        </Paper>
        <Paper style={{ height: "44%", marginTop: "1rem" }}>
          <div className="code-tool-bar">
            <h2>Tests</h2>
          </div>
          <Monaco
            editable={false}
            codeText={task.testCode}
            height="100%"
            language={selectedLanguage}
          />
        </Paper>
        <div style={{ height: "10px" }} />
      </div>
      <div className="code-zone--right">
        <Paper className="container container--description">
          <h2>Task</h2>
          <Divider />
          {task.description}
        </Paper>
        <Paper className={outputClassName}>
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
        </Paper>
        <Stats data={evaluateData?.evaluate} />
      </div>
    </div>
  );
};

export default CodeEditor;
