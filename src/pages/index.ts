import React from "react";
import CodeEditor from "./CodeEditor/CodeEditor";
import Courses from "./Courses";
import SignUp from "./SignUp/SignUp";
import ModulePage from "./ModulePage";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
interface INavItem {
  component: React.FC;
  path: string;
  text: string;
  isVisibleInNav: boolean;
  icon: IconProp | undefined;
}

const pages: Array<INavItem> = [
  {
    component: SignUp,
    path: "/log-in",
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
    icon: undefined,
  },
  {
    component: ModulePage,
    path: "/module/:moduleid",
    text: "",
    isVisibleInNav: false,
    icon: undefined,
  },
];

export default pages;
