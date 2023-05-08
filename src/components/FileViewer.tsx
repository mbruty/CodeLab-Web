import {
  Checkbox,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { File } from "gql/graphql";
import { FC, useState, useMemo, useRef } from "react";

type Props = {
  file: File;
};

type ViewerProps = {
  fileText: string;
};

const CsvViewer: FC<ViewerProps> = (props) => {
  const [withHeaders, setWithHeaders] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const datapoints = useMemo(
    () =>
      props.fileText
        .split("\n")
        .map((line) => line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)),
    [props.fileText]
  );

  const render = useMemo(
    () => (
      <>
        <Flex justifyContent="flex-end">
          <Checkbox
            isChecked={withHeaders}
            onChange={(e) => setWithHeaders(e.target.checked)}
            marginRight="5"
          >
            File contains headers
          </Checkbox>
        </Flex>
        <TableContainer
          ref={parentRef}
          overflowY="auto"
          height="calc(100vh - 1rem - 190px)"
        >
          <Table>
            <Thead
              position="sticky"
              top={0}
              zIndex="docked"
              backgroundColor="var(--chakra-colors-chakra-body-bg)"
            >
              <Tr>
                {withHeaders &&
                  datapoints[0]?.map((header) => (
                    <Th key={header}>{header.replaceAll('"', "")}</Th>
                  ))}
                {!withHeaders &&
                  datapoints[0].map((_, index) => (
                    <Th key={"header" + index}>{index}</Th>
                  ))}
              </Tr>
            </Thead>
            <Tbody>
              {datapoints.slice(withHeaders ? 1 : 0).map((line, index) => (
                <Tr key={`line-${index}`}>
                  {line.map((point, index) => (
                    <Td key={index}>{point.replaceAll('"', "")}</Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </>
    ),
    [datapoints, withHeaders]
  );
  return render;
};

const TextViewer: FC<ViewerProps> = (props) => {
  return null;
};

const FileViewer: FC<Props> = (props) => {
  let Viewer: FC<ViewerProps> = TextViewer;

  if (props.file.fileName.endsWith(".csv")) {
    Viewer = CsvViewer;
  }

  return <Viewer fileText={props.file.fileText} />;
};

export default FileViewer;
