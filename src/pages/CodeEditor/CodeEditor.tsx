import { useQuery } from "@apollo/client";
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
import Button from "@mui/material/Button"

interface IToolBarProps {
  language: string;
  avalibleLanguages: Array<string>;
  handleChange: (language: string) => void;
}

const ToolBar: React.FC<IToolBarProps> = (props) => {
  function handleChange(evt: SelectChangeEvent) {}

  return (
    <div className="code-tool-bar">
      <FormControl style={{ minWidth: "200px" }}>
        <InputLabel id="language-select-label">Language</InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          label="Language"
          onChange={handleChange}
        >
          {props.avalibleLanguages.map((language) => (
            <MenuItem value={language}>{language}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
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

const CodeEditor: React.FC = () => {
  // Params
  const params = useParams();
  const navigate = useNavigate();

  // State
  const [selectedLanguage, setSelectedLanguage] = React.useState("default");
  const [showLoadingSpinner, setShowLoadingSpinner] = React.useState(true);
  // Ensure that we have a task id
  const taskId = parseInt(params.taskid ?? "-1");
  if (taskId === -1) {
    navigate("/modules");
  }

  // GraphQL
  const {
    data: getCodeData,
    loading: getCodeLoading,
    error: getCodeError,
  } = useQuery(getCode, {
    variables: {
      id: taskId,
      language: selectedLanguage,
    },
  });

  React.useEffect(() => {
    console.log(getCodeData);
  }, [getCodeData]);

  // Effects
  React.useEffect(() => {
    // If we are showing the loading spinner, and the getCode query isn't loading, stop showing the spinner
    if (showLoadingSpinner && !getCodeLoading) {
      setShowLoadingSpinner(false);
    }
  }, [getCodeLoading, showLoadingSpinner]);

  if (showLoadingSpinner) {
    return <CircularProgress />;
  }

  return (
    <div className="code-zone">
      <Paper className="code-editor">
        <ToolBar
          avalibleLanguages={["JavaScript", "TypeScript"]}
          language={selectedLanguage}
          handleChange={(x) => setSelectedLanguage(x)}
        />
        <Monaco
          codeText="hello world"
          height="50%"
          language="javascript"
          onChange={(x) => console.log(x)}
        />
      </Paper>
    </div>
  );
};

export default CodeEditor;
