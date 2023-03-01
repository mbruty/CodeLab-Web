import { useQuery } from "@apollo/client";
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
} from "@chakra-ui/react";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import Monaco from "components/Monaco";
import { graphql } from "gql";
import { FC, useState } from "react";

const languageQuery = graphql(`
  query AvalibleLanguages {
    availableLanguages
  }
`);

const CreatePage: FC = (props) => {
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<Array<string>>([]);
  const { loading, data } = useQuery(languageQuery);
  const [codeTexts, setCodeTexts] = useState<
    Record<string, { starterCode: string; testCode: string }>
  >({});

  function onCheckboxClick(lang: string, isChecked: boolean) {
    if (isChecked) {
      setSelectedLanguages([...selectedLanguages, lang]);
    } else {
      setSelectedLanguages((prev) => prev.filter((x) => x !== lang));
    }
    console.log(lang);
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

  if (loading) return null;
  return (
    <Card padding={2}>
      <Steps activeStep={activeStep}>
        <Step label="Select languages">
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
          <Step label={`Create ${lang} task`}>
            <Tabs marginTop={2}>
              <TabList>
                <Tab>Starter Code</Tab>
                <Tab>Test Code</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Monaco
                    codeText={codeTexts[lang]?.starterCode ?? ""}
                    height="calc(100vh - 1rem - 240px)"
                    language={lang}
                    editable
                    onChange={(e) => onCodeChange(e, lang, false)}
                  />
                </TabPanel>
                <TabPanel>
                  <Monaco
                    codeText={codeTexts[lang]?.testCode ?? ""}
                    height="calc(100vh - 1rem - 240px)"
                    language={lang}
                    editable
                    onChange={(e) => onCodeChange(e, lang, true)}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Step>
        ))}
        <Step label="Add a description">
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
        <Button size="sm" onClick={nextStep}>
          {activeStep === 1 ? "Save" : "Next"}
        </Button>
      </Flex>
    </Card>
  );
};

export default CreatePage;
