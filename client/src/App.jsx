import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth";
import RouteGuard from "./components/route-gaurd/index";
import { AuthContext } from "./context/auth-context";
import InstructorDashboardpage from "./pages/instructor";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";
import NotFoundPage from "./pages/not-found"

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <RouteGuard
            element={<AuthPage />}
            authenticate={auth?.authenticate}
          />
        }
      />
      <Route
        path="/instructor"
        element={
          <RouteGuard
            element={<InstructorDashboardpage />}
            authenticate ={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/"
        element={
          <RouteGuard
            element={<StudentViewCommonLayout />}
            authenticate={auth?.authenticate}
            user={auth?.user}
          />
        }
        >
      <Route
        path = ""
        element={<StudentHomePage/>}    
          />
      <Route 
        path ="home"
        element = {<StudentHomePage/>}
          /> 

        </Route>
      <Route
      path ="*"
      element = {<NotFoundPage/>}
        />
      <Route/>

    </Routes>
  );
}

export default App;