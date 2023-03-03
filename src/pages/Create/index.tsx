import { useLazyQuery, useQuery } from "@apollo/client";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  CheckboxGroup,
  Checkbox,
  Center,
  VStack,
  Select,
  Input,
  Stack,
  Text,
  Box,
  HStack,
} from "@chakra-ui/react";
import { faPlay, faRemove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import Monaco from "components/Monaco";
import getCodeForLanguage from "default_code_texts";
import { graphql } from "gql";
import { FC, useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { nanoid } from "nanoid";

const languageQuery = graphql(`
  query AvalibleLanguages {
    availableLanguages
  }
`);

const modulesQuery = graphql(`
  query EditableModules {
    editableModules {
      id
      title
    }
  }
`);

const executeCodeQuery = graphql(`
  query TestCode(
    $code: String!
    $testCode: String!
    $language: String!
    $fileContent: String!
    $fileName: String!
  ) {
    evaluateTest(
      code: $code
      testCode: $testCode
      language: $language
      fileContent: $fileContent
      fileName: $fileName
    ) {
      consoleOutput
      output
      isSuccessful
    }
  }
`);
const CreatePage: FC = (props) => {
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<Array<string>>([]);
  const [selectedModuleId, setSelectedModuleId] = useState(-1);
  const [files, setFiles] = useState<
    Array<{ id: string; fileName: string; fileText: string }>
  >([]);
  const { loading, data } = useQuery(languageQuery);
  const { data: moduleData } = useQuery(modulesQuery);
  const [runCode, { loading: codeIsProcessing, data: codeOutput }] =
    useLazyQuery(executeCodeQuery);
  const [codeTexts, setCodeTexts] = useState<
    Record<string, { starterCode: string; testCode: string }>
  >({});

  const [testOutput, setTestOutput] = useState("");
  const [consoleOutput, setConsoleOutput] = useState("");

  const onDrop = useCallback(
    (acceptedFiles: Array<File>) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const newObj = {
            id: nanoid(),
            fileName: file.name,
            fileText: e.target.result as string,
          };
          console.log(newObj);
          setFiles([...files, newObj]);
        };
        reader.readAsText(file);
      });
    },
    [files, setFiles]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    setTestOutput(codeOutput?.evaluateTest.output ?? "");
  }, [codeOutput]);

  useEffect(() => {
    setConsoleOutput(codeOutput?.evaluateTest.consoleOutput ?? "");
  }, [codeOutput]);

  useEffect(() => {
    setTestOutput("");
    setConsoleOutput("");
  }, [activeStep]);

  function onCheckboxClick(lang: string, isChecked: boolean) {
    if (isChecked) {
      setSelectedLanguages([...selectedLanguages, lang]);
    } else {
      setSelectedLanguages((prev) => prev.filter((x) => x !== lang));
    }
  }

  function onCodeChange(newText: string, lang: string, isTestCode: boolean) {
    if (isTestCode) {
      const record = codeTexts[lang] ?? {};
      record.testCode = newText;

      codeTexts[lang] = record;
      setCodeTexts({ ...codeTexts });
    } else {
      const record = codeTexts[lang] ?? {};
      record.starterCode = newText;

      codeTexts[lang] = record;
      setCodeTexts({ ...codeTexts });
    }
  }

  function next() {
    setTestOutput("");
    nextStep();
  }

  function handleModuleSelect(e: any) {
    const value = e.target.value;
    const id =
      moduleData?.editableModules.find((x) => x?.title === value)?.id ?? "-1";

    setSelectedModuleId(parseInt(id));
  }

  function onTestCodeClick(language: string) {
    runCode({
      variables: {
        code: codeTexts[language].starterCode,
        testCode: codeTexts[language].testCode,
        language: language,
        fileContent: "",
        fileName: "",
      },
    });
  }

  function removeFile(fileName: string) {
    setFiles((prev) => {
      return prev.filter((x) => x.fileName !== fileName);
    });
  }

  function onFileNameChange(newName: string, id: string) {
    setFiles((prev) => {
      return prev.map((x) => {
        if (x.id !== id) return x;
        x.fileName = newName;
        return x;
      });
    });
  }

  if (loading) return null;
  return (
    <Center>
      <Card padding={6} width="100%" maxWidth="2000px">
        <Steps activeStep={activeStep}>
          <Step key="language" label="Select languages">
            <Center>
              <CheckboxGroup>
                <VStack alignItems="flex-start" margin={2}>
                  {data?.availableLanguages?.map((lang) => (
                    <Checkbox
                      onChange={(e) =>
                        onCheckboxClick(lang as string, e.target.checked)
                      }
                      key={lang}
                    >
                      {lang}
                    </Checkbox>
                  ))}
                </VStack>
              </CheckboxGroup>
            </Center>
          </Step>
          {selectedLanguages.map((lang) => (
            <Step key={lang} label={`Create ${lang} task`} position="relative">
              <Button
                leftIcon={<FontAwesomeIcon icon={faPlay} />}
                style={{ position: "absolute", right: 20, top: 65 }}
                colorScheme="whatsapp"
                isLoading={codeIsProcessing}
                onClick={() => onTestCodeClick(lang)}
              >
                Test code
              </Button>
              <Tabs marginTop={5}>
                <TabList>
                  <Tab>Starter Code</Tab>
                  <Tab>Test Code</Tab>
                  <Tab>Files</Tab>
                  <Tab>Test Output</Tab>
                  <Tab>Console Output</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Monaco
                      codeText={
                        codeTexts[lang]?.starterCode ??
                        getCodeForLanguage(lang).starter
                      }
                      height="calc(100vh - 1rem - 300px)"
                      language={lang}
                      editable
                      onChange={(e) => onCodeChange(e, lang, false)}
                    />
                  </TabPanel>
                  <TabPanel>
                    <Monaco
                      codeText={
                        codeTexts[lang]?.testCode ??
                        getCodeForLanguage(lang).test
                      }
                      height="calc(100vh - 1rem - 300px)"
                      language={lang}
                      editable
                      onChange={(e) => onCodeChange(e, lang, true)}
                    />
                  </TabPanel>
                  <TabPanel>
                    <Stack
                      {...getRootProps()}
                      p="8"
                      textAlign="center"
                      spacing="1"
                      cursor="pointer"
                    >
                      <Heading fontSize="lg" color="gray.700" fontWeight="bold">
                        Drop images here
                      </Heading>
                      <input {...getInputProps()} />
                      <Text fontWeight="light">or click to upload</Text>
                      <Text fontWeight="light" fontSize="sm" fontStyle="italic">
                        Note: files are shared between all languages
                      </Text>
                    </Stack>
                    <Stack spacing="2">
                      {files.map((file) => (
                        <Box key={file.id}>
                          <HStack>
                            <Input
                              type="text"
                              value={file.fileName}
                              onChange={(e) => {
                                onFileNameChange(e.target.value, file.id);
                                e.preventDefault();
                              }}
                            />
                            <Button
                              colorScheme="red"
                              onClick={() => removeFile(file.fileName)}
                            >
                              <FontAwesomeIcon icon={faRemove} />
                            </Button>
                          </HStack>
                        </Box>
                      ))}
                    </Stack>
                  </TabPanel>
                  <TabPanel>
                    <pre>{testOutput}</pre>
                  </TabPanel>
                  <TabPanel>
                    <pre>{consoleOutput}</pre>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Step>
          ))}
          <Step
            key={`desc-${selectedLanguages.length}`}
            label="Add a description"
          >
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
            </CardBody>
          </Step>
          <Step
            key={`mod-${selectedLanguages.length}`}
            label="Link to a module"
          >
            <CardHeader>
              <Heading as="h1">Link to a module</Heading>
            </CardHeader>
            <CardBody>
              <Center>
                <Select onChange={handleModuleSelect} maxW="lg">
                  <option value="None">None</option>
                  {moduleData?.editableModules.map((m) => (
                    <option value={m?.title}>{m?.title}</option>
                  ))}
                </Select>
              </Center>
            </CardBody>
          </Step>
        </Steps>
        <Flex width="100%" justify="flex-end">
          <Button
            isDisabled={activeStep === 0}
            mr={4}
            onClick={prevStep}
            size="sm"
            variant="ghost"
          >
            Back
          </Button>
          <Button size="sm" onClick={next}>
            {activeStep === 1 ? "Save" : "Next"}
          </Button>
        </Flex>
      </Card>
    </Center>
  );
};

export default CreatePage;
