import type {SvgIconComponent} from "@mui/icons-material";
import React from "react";
import CodeEditor from "./CodeEditor/CodeEditor";
import Courses from "./Courses";
import SchoolIcon from '@mui/icons-material/School';
import SignUp from "./SignUp/SignUp";
interface INavItem {
    component: React.FC,
    path: string,
    text: string,
    isVisibleInNav: boolean,
    icon: SvgIconComponent | undefined;
}

const pages: Array<INavItem> = [
    {
        component: SignUp,
        path: "/log-in",
        text: "",
        isVisibleInNav: false,
        icon: undefined
    },
    {
        component: SignUp,
        path: "/sign-up",
        text: "",
        isVisibleInNav: false,
        icon: undefined
    },
    {
        component: CodeEditor,
        path: "/code/:taskid",
        text: "",
        isVisibleInNav: false,
        icon: undefined
    },
    {
        component: Courses,
        path: "/courses",
        text: "Courses",
        isVisibleInNav: true,
        icon: SchoolIcon
    }
]

export default pages;