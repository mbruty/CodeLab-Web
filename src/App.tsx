import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "components/Nav";
import Nav from "./components/Nav";
import UserContext from "./contexts/UserContext";
import UserObserver from "./contexts/UserObserver";
import { gql, useQuery } from "@apollo/client";
import { unauthorisedCheck } from "./gql/exceptionChecks";

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
  const setUnauthorisedError = React.useState(false)[1];
  // Get the current logged in user
  const { data, loading: userLoading, error: userError } = useQuery(getLoggedInUser);

  // Subscribe to the observer on the first render
  React.useEffect(() => {
    const id = observer.subscribe({
      onUpdate: (u) => {},
      onAuthFail: () => {
        setUnauthorisedError(true);
        navigate("/sign-in");
      },
    });

    return () => {
      observer.unsubscribe(id);
    };
  }, [navigate, observer, setUnauthorisedError]);

  React.useEffect(() => {
    unauthorisedCheck(userError, observer);
  }, [userError, observer]);

  // When we get data, set it on the observer
  React.useEffect(() => {
    if (data) {
      observer.update(data.me);
    }
  }, [data, observer])

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
            {NAV_ITEMS.map((page) => (
              <Route index={page.path === '/'} path={page.path} element={<page.component />} />
            ))}
          </Routes>
        </div>
      </UserContext.Provider>
    </div>
  );
}

export default App;
