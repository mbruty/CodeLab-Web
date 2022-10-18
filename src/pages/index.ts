import React from "react";
import Login from "./Login";

const pages: Array<{ component: React.FC, path: string }> = [
    {
        component: Login,
        path: "/login"
    }
]

export default pages;