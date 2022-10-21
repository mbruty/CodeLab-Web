import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import React from "react";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import * as yup from "yup";
import useDebounce from "../../utils/debounce";
import "./SignUp.tsx.css";
import { gql, useMutation } from "@apollo/client";
import UserContext from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const TabPanel: React.FC<{
  value: number;
  index: number;
  children: JSX.Element;
}> = (props) => {
  if (props.value !== props.index) return null;
  return props.children;
};

const loginMutation = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      username
      xp
    }
  }
`;

const LoginForm: React.FC = () => {
  const observer = React.useContext(UserContext);
  const navigate = useNavigate();
  const [password, setPassword] = React.useState("");
  const [mutateFunction, { data, loading, error }] = useMutation(loginMutation);
  const [email, setDebounceEmail] = useDebounce<string>(
    "",
    handleEmailChange,
    1000
  );
  const [loginError, setLoginError] = React.useState({
    email: "",
    password: "",
    login: "",
  });

  // if we have data back, then it was successful
  React.useEffect(() => {
    if (data) {
      observer.update(data.login);
      navigate("/");
    }
  }, [data, navigate, observer]);

  // if we have an unauthorised error, tell the user
  React.useEffect(() => {
    if (
      error &&
      error.message.startsWith(
        "net.bruty.CodeLabs.graphql.exceptions.UnauthorisedException"
      )
    ) {
      setLoginError((prev) => {
        return { ...prev, login: "Incorrect username or password" };
      });
    }
  }, [error]);

  async function handleEmailChange(email: string) {
    const validation = yup.string().email();

    if (!(await validation.isValid(email))) {
      setLoginError({ ...loginError, email: "Invalid email" });
    } else {
      setLoginError({ ...loginError, email: "" });
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validation = yup.string().email();
    if (!(await validation.isValid(email))) {
      setLoginError({ ...loginError, email: "Invalid email" });
      return;
    }
    if (password === "") {
      return;
    }

    mutateFunction({
      variables: {
        email,
        password,
      },
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormControl variant="outlined" fullWidth className="login-form">
        <TextField
          className="login-input"
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setDebounceEmail(e.target.value)}
        />
        {loginError.email && <p className="form-error">{loginError.email}</p>}
        <TextField
          className="login-input"
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {loginError.password && (
          <p className="form-error">{loginError.password}</p>
        )}
        {loginError.login && <p className="form-error">{loginError.login}</p>}
        <Button
          style={{ margin: "1rem 0 0 auto" }}
          variant="outlined"
          type="submit"
        >
          {loading && (
            <CircularProgress size="15px" style={{ marginRight: "0.5rem" }} />
          )}
          Login
        </Button>
      </FormControl>
    </form>
  );
};

const SignUp: React.FC = () => {
  const [tab, setTab] = React.useState(
    window.location.pathname === "/log-in" ? 1 : 0
  );
  return (
    <Paper style={{ maxWidth: "600px", padding: "1rem", margin: "auto" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={(_, idx: number) => setTab(idx)}
          aria-label="basic tabs example"
          variant="fullWidth"
        >
          <Tab
            label="Sign Up"
            id="signup-tab"
            aria-controls="signup-tab-pannel"
          />
          <Tab label="Login" id="login-tab" aria-controls="login-tab-pannel" />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <div>Item One</div>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <LoginForm />
      </TabPanel>
    </Paper>
  );
};

export default SignUp;
