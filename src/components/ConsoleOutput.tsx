import { Center } from "@chakra-ui/react";
import React, { FC } from "react";

type Props = {
  text: String;
};

const Line: FC<Props> = (props) => {
  const split = props.text.split(" ");

  if (split[0] === "<%media>") {
    return (
      <Center>
        <img src={split[1]} alt="media output" />
      </Center>
    );
  }

  return <pre className="code-output">{props.text}</pre>;
};

const ConsoleOutput: FC<Props> = (props) => {
  return (
    <>
      {props.text.split("\n").map((text, index) => (
        <Line text={text} key={index} />
      ))}
    </>
  );
};

export default ConsoleOutput;
