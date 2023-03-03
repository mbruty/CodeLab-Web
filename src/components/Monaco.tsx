import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

interface IProps {
  codeText: string;
  language: string;
  height: string;
  onChange?: (data: string) => void;
  editable?: boolean;
}

const Monaco: React.FC<IProps> = (props) => {
  useEffect(() => {
    if (props.onChange) {
      props.onChange(props.codeText);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  function handleChange(value: string | undefined, event: any) {
    if (value && props.onChange !== undefined) {
      props.onChange(value);
    }
  }

  const theme =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "vs-dark"
      : "vs";

  let language = props.language.toLowerCase();

  switch (props.language) {
    case "C#":
      language = "csharp";
      break;
  }

  return (
    <Editor
      height={props.height}
      language={language}
      value={props.codeText}
      theme={theme}
      onChange={handleChange}
      options={{ readOnly: !props.editable }}
      onMount={(editor) => (editorRef.current = editor)}
    />
  );
};

export default Monaco;
