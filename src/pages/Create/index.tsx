import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
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
  useToast,
  FormLabel,
  Textarea,
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
    $files: [FileInput]!
  ) {
    evaluateTest(
      code: $code
      testCode: $testCode
      language: $language
      files: $files
    ) {
      consoleOutput
      output
      isSuccessful
    }
  }
`);

const createModuleMutation = graphql(`
  mutation CreateModule($title: String!, $description: String!) {
    createModule(moduleTitle: $title, moduleDescription: $description)
  }
`);

const createTaskMutation = graphql(`
mutation CreateTask(
  $title: String!
  $description: String!
  $code: [StarterCodeInput]!
  $files: [FileInput]!
) {
  createTask(
    title: $title
    description: $description
    starterCodes: $code
    files: $files
  )
}
`);
const CreatePage: FC = (props) => {
  const toast = useToast();
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });
  const [createModule, { loading: createModuleLoading }] =
    useMutation(createModuleMutation);
  const [createTask, { loading: createTaskLoading }] =
    useMutation(createTaskMutation);
  const [taskDescription, setTaskDescription] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<Array<string>>([]);
  const [selectedModuleId, setSelectedModuleId] = useState("-1");
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
  const [newModuleData, setNewModuleData] = useState({
    moduleTitle: "",
    moduleDescription: "",
  });

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
    if (selectedLanguages.length === 0) {
      toast({
        title: "Error: No languages selected",
        description: "To continue, please select at least one language",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (activeStep === 3 + selectedLanguages.length - 1) {
      save();
      return;
    }
    setTestOutput("");
    nextStep();
  }

  function handleModuleSelect(e: any) {
    const value = e.target.value;
    let id =
      moduleData?.editableModules.find((x) => x?.title === value)?.id ?? "-1";
    if (value === "Create a new module") id = "-2";
    setSelectedModuleId(id);
  }

  function onTestCodeClick(language: string) {
    runCode({
      variables: {
        code: codeTexts[language].starterCode,
        testCode: codeTexts[language].testCode,
        language: language,
        files: files.map((x) => ({ fileName: x.fileName, text: x.fileText })),
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

  async function save() {
    if (selectedModuleId === "-2") {
      if (!newModuleData.moduleTitle) {
        toast({
          title: "Error: Module title empty",
          description: "Please provide a name for the module",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      if (!newModuleData.moduleDescription) {
        toast({
          title: "Error: Module Description empty",
          description: "Pleaes provide a description for the module",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      const result = await createModule({
        variables: {
          title: newModuleData.moduleTitle,
          description: newModuleData.moduleDescription,
        },
      });

      const created = result.data?.createModule;
      if (!created) return;

      // const taskResult = await createTask({
      //   variables: {
      //     code: selectedLanguages.map(language => ({
      //       language: language
      //     }))
      //   }
      // })

    }
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
                    <pre className="code-output">{testOutput}</pre>
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
            <CardBody>
              <Stack spacing="1rem">
                <div>
                  <FormLabel
                    fontWeight="bold"
                    fontSize="x-large"
                    htmlFor="title"
                  >
                    Task Title
                  </FormLabel>
                  <Input
                    id="title"
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                  />
                </div>
                <Heading as="h2" fontSize="x-large">
                  Task text
                </Heading>
                <MarkdownEditor
                  height="30ch"
                  visible
                  value={taskDescription}
                  onChange={setTaskDescription}
                />
              </Stack>
            </CardBody>
          </Step>
          <Step
            key={`mod-${selectedLanguages.length}`}
            label="Link to a module"
          >
            <CardHeader>
              <Heading as="h1">Link a module</Heading>
            </CardHeader>
            <CardBody>
              <Center>
                <VStack spacing={6}>
                  <Select onChange={handleModuleSelect} maxW="lg">
                    <option value="None">None</option>
                    {moduleData?.editableModules.map((m) => (
                      <option value={m?.title}>{m?.title}</option>
                    ))}
                    <option value="Create a new module">
                      Create a new module
                    </option>
                  </Select>
                  {selectedModuleId === "-2" && (
                    <VStack alignItems="flex-start">
                      <Heading as="h2">Create a module</Heading>
                      <label htmlFor="module-title">Module title</label>
                      <Input
                        id="module-title"
                        value={newModuleData.moduleTitle}
                        onChange={(e) =>
                          setNewModuleData({
                            ...newModuleData,
                            moduleTitle: e.target.value,
                          })
                        }
                      />
                      <label htmlFor="module-desc">Module description</label>
                      <Textarea
                        id="module-desc"
                        value={newModuleData.moduleDescription}
                        onChange={(e) =>
                          setNewModuleData({
                            ...newModuleData,
                            moduleDescription: e.target.value,
                          })
                        }
                      />
                    </VStack>
                  )}
                </VStack>
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
          <Button
            isLoading={createModuleLoading || createTaskLoading}
            size="sm"
            onClick={next}
          >
            {activeStep === 3 + selectedLanguages.length - 1 ? "Save" : "Next"}
          </Button>
        </Flex>
      </Card>
    </Center>
  );
};

export default CreatePage;
