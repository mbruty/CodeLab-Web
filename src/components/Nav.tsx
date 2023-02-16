import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Link,
  Popover,
  PopoverTrigger,
  useColorModeValue,
  useDisclosure,
  Center,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useContext, useState, useEffect } from "react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import CodeEditor from "pages/CodeEditor/CodeEditor";
import Courses from "pages/Courses";
import SignUp from "pages/SignUp/SignUp";
import LogIn from "pages/LogIn";
import ModulePage from "pages/ModulePage";
import { NavLink, useNavigate } from "react-router-dom";
import { faSchool } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserContext from "contexts/UserContext";
import { User } from "gql/graphql";
import { graphql } from "gql";
import { useMutation } from "@apollo/client";
import CreatePage from "pages/Create";

const logoutMutation = graphql(`
  mutation Logout {
    logout
  }
`);

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const [user, setUser] = useState<User | undefined>(userContext.user);
  const logout = useMutation(logoutMutation)[0];
  useEffect(() => {
    const id = userContext.subscribe({
      onUpdate: (u) => setUser(u),
    });

    return () => userContext.unsubscribe(id);
  }, [user, userContext]);
  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <NavLink to="/">
            <img
              height="50px"
              src={process.env.PUBLIC_URL + "/logo.svg"}
              alt="logo"
            />
          </NavLink>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          {user ? (
            <Menu>
              <Button variant={"link"} onClick={() => navigate("/create")}>Create</Button>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  src={`https://api.dicebear.com/5.x/adventurer/svg?seed=${user.username}`}
                  size="sm"
                />
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={async () => {
                    await logout();
                    navigate("/sign-in");
                    userContext.update(undefined);
                  }}
                >
                  Sign out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <>
              <Button
                fontSize={"sm"}
                fontWeight={400}
                variant={"link"}
                onClick={() => {
                  navigate("/sign-in");
                }}
              >
                Sign In
              </Button>
              <Button
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"pink.400"}
                _hover={{
                  bg: "pink.300",
                }}
                onClick={() => {
                  navigate("/sign-up");
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.filter((x) => x.isVisibleInNav).map((navItem) => (
        <Center key={navItem.text}>
          <Box borderRadius="lg" padding="1">
            {navItem.icon && (
              <FontAwesomeIcon
                icon={navItem.icon}
                style={{ marginRight: "0.5rem" }}
              />
            )}
            <NavLink to={navItem.path ?? "#"}>{navItem.text}</NavLink>
          </Box>
        </Center>
      ))}
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.filter((x) => x.isVisibleInNav).map((navItem) => (
        <MobileNavItem key={navItem.text} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ text, path }: NavItem) => {
  return (
    <Stack spacing={4}>
      <Flex
        py={2}
        as={Link}
        href={path ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {text}
        </Text>
      </Flex>
    </Stack>
  );
};

interface NavItem {
  text: string;
  component: React.FC;
  isVisibleInNav: boolean;
  icon: IconProp | undefined;
  path?: string;
}

export const NAV_ITEMS: Array<NavItem> = [
  {
    component: LogIn,
    path: "/sign-in",
    text: "",
    isVisibleInNav: false,
    icon: undefined,
  },
  {
    component: SignUp,
    path: "/sign-up",
    text: "",
    isVisibleInNav: false,
    icon: undefined,
  },
  {
    component: CodeEditor,
    path: "/code/:taskid",
    text: "",
    isVisibleInNav: false,
    icon: undefined,
  },
  {
    component: Courses,
    path: "/courses",
    text: "Courses",
    isVisibleInNav: true,
    icon: faSchool,
  },
  {
    component: ModulePage,
    path: "/module/:moduleid",
    text: "",
    isVisibleInNav: false,
    icon: undefined,
  },
  {
    component: CreatePage,
    path: "/create",
    text: "",
    isVisibleInNav: false,
    icon: undefined
  }
];
