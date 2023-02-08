import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Center,
  useToast,
} from "@chakra-ui/react";
import { useState, useContext, useEffect } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { NavLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import ValidationError from "yup/lib/ValidationError";
import { graphql } from "gql";
import { useMutation } from "@apollo/client";
import UserContext from "contexts/UserContext";
import { User } from "gql/graphql";

const schema = yup.object({
  email: yup
    .string()
    .required("Please provide an email")
    .max(50, "Your email is too long")
    .email("Email is invalid"),
  username: yup
    .string()
    .required("Please provide your nickname")
    .max(25, "Your nickname is too long!"),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Password must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
});

const signUpMutation = graphql(`
  mutation SignUp($email: String!, $password: String!, $username: String!) {
    signUp(email: $email, password: $password, username: $username) {
      id
      username
    }
  }
`);

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mutateFunc, { loading, error }] = useMutation(signUpMutation);
  const userContext = useContext(UserContext);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // If we have a logged in user, send 'em to the home page
    if (userContext.user) {
      toast({
        isClosable: true,
        status: "info",
        duration: 5000,
        title: "Already logged in",
      });
      navigate("/");
    }
  }, [userContext, navigate, toast]);

  async function signup() {
    const vars = {
      username: nick,
      email,
      password,
    };
    try {
      await schema.validate(vars, { abortEarly: false });
    } catch (e: unknown) {
      const error = e as ValidationError;
      error.errors.forEach((err) => {
        toast({
          isClosable: true,
          status: "error",
          duration: 5000,
          title: "Oops, there was an error checking your details.",
          description: err,
        });
      });
      return;
    }

    try {
      const result = await mutateFunc({ variables: vars });
      if (result.data) {
        userContext.update(result.data?.signUp as User);
        navigate("/");
      }
    } catch (e: any) {
      if (
        (e.message as string).startsWith(
          "net.bruty.CodeLabs.graphql.exceptions.AlreadyExistsException"
        )
      ) {
        toast({
          isClosable: true,
          status: "error",
          duration: 5000,
          title: "Oops, there was an error creating your account",
          description: "Your email is already in use",
        });
      } else {
        toast({
          isClosable: true,
          status: "error",
          duration: 5000,
          title: "Oops, there was an error creating your account",
          description: "Please try again later",
        });
      }
    }
  }

  return (
    <Center>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <Box>
              <FormControl id="firstName" isRequired>
                <FormLabel>Nick name (max 25)</FormLabel>
                <Input
                  value={nick}
                  onChange={(e) => setNick(e.target.value)}
                  type="text"
                />
              </FormControl>
            </Box>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={signup}
              >
                Sign up
              </Button>
            </Stack>
            <Text align={"center"}>
              Already a user?{" "}
              <NavLink to="/sign-in" color={"blue.400"}>
                <Link color="blue.400">Login</Link>
              </NavLink>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Center>
  );
}
