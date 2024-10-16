import { Routes, Route } from "react-router-dom";
import  AuthPage  from "../src/lib/pages/auth";

function App() {

  return (
    <Routes>
      <Route path = "/auth" element = {<AuthPage/>}/>
    </Routes>
  );
}


export default App;
