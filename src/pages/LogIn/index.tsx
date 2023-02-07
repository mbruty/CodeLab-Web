import { useMutation } from "@apollo/client";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Center,
  useColorModeValue,
  useToast,
  Text,
} from "@chakra-ui/react";
import { graphql } from "gql";
import { useContext, useState, useEffect } from "react";
import UserContext from "contexts/UserContext";
import { NavLink, useNavigate } from "react-router-dom";
import { User } from "gql/graphql";

const loginMutation = graphql(`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      username
      xp
    }
  }
`);

export default function SignInCard() {
  const observer = useContext(UserContext);
  const [mutateFunction, { data, loading, error }] = useMutation(loginMutation);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const toast = useToast();

  useEffect(() => {
    // If we have a logged in user, send 'em to the home page
    if (userContext.user) {
      toast({
        isClosable: true,
        status: "info",
        duration: 5000,
        title: "Already logged in",
      });
      navigate('/');
    }
  }, [userContext, navigate, toast]);

  async function login() {
    if (!email) {
      toast({
        isClosable: true,
        status: "error",
        duration: 5000,
        title: "Authentication error",
        description: "Please provide your email",
      });
    } else if (!password) {
      toast({
        isClosable: true,
        status: "error",
        duration: 5000,
        title: "Authentication error",
        description: "Please provide your password",
      });
    } else {
      const result = await mutateFunction({
        variables: {
          email,
          password,
        },
      });

      userContext.update(result.data?.login as User);
    }
  }

  // If data is not nullish, then the login worked!
  useEffect(() => {
    if (data && data.login) {
      observer.update(data.login as User);
      navigate("/");
    }
  }, [data, navigate, observer]);

  useEffect(() => {
    if (error) {
      toast({
        isClosable: true,
        status: "error",
        duration: 5000,
        title: "Authentication error",
        description: "There was an issue trying to log you in...",
      });
    }
  }, [error, toast]);

  return (
    <Center>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
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
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </FormControl>
            <Stack spacing={2}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <div />
                <Link color={"blue.400"}>Forgot password?</Link>
              </Stack>
              <Button
                isLoading={loading}
                onClick={login}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Sign in
              </Button>
              <Text align={"center"}>
                Don't have an account?{" "}
                <NavLink to="/sign-up" color={"blue.400"}>
                  <Link color="blue.400">Sign up</Link>
                </NavLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Center>
  );
}
