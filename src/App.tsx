import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import pages from "./pages";
import Nav from "./components/Nav";
import UserContext from "./contexts/UserContext";
import UserObserver from "./contexts/UserObserver";
import { gql, useQuery } from "@apollo/client";
import { unauthorisedCheck } from "./gql/exceptionChecks";
import { ChakraProvider } from "@chakra-ui/react";

const getLoggedInUser = gql`
  query GetLoggedInUser {
    me {
      id
      username
      xp
    }
  }
`;

function App() {
  const navigate = useNavigate();

  const [observer] = React.useState(new UserObserver());
  const [unauthorisedError, setUnauthorisedError] = React.useState(false);
  // Get the current logged in user
  const { loading: userLoading, error: userError } = useQuery(getLoggedInUser);

  // Subscribe to the observer on the first render
  React.useEffect(() => {
    const id = observer.subscribe({
      onUpdate: (u) => {},
      onAuthFail: () => {
        setUnauthorisedError(true);
        navigate("/log-in");
      },
      guid: null,
    });

    return () => {
      observer.unsubscribe(id);
    };
  }, [navigate, observer]);

  React.useEffect(() => {
    unauthorisedCheck(userError, observer);
  }, [userError, observer]);

  if (userLoading) {
    return <p>Loading</p>;
  }

  return (
    <div className="App">
      {/* <Snackbar
        open={unauthorisedError}
        autoHideDuration={6000}
        onClose={() => setUnauthorisedError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={() => setUnauthorisedError(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          You have been logged out.
        </MuiAlert>
      </Snackbar> */}
      <UserContext.Provider value={observer}>
        <Nav />
        <div className="content">
          <Routes>
            <Route index element={<Home />} />
            {pages.map((page) => (
              <Route path={page.path} element={<page.component />} />
            ))}
          </Routes>
        </div>
      </UserContext.Provider>
    </div>
  );
}

export default App;
