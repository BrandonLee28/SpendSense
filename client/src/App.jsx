import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Budgets from "./pages/Budgets";
import axios from "axios";
import Logout from "./pages/Logout";
import Login from "./pages/Login";
import Home from "./pages/Home";
const App = () => {
  axios.defaults.baseURL = "https://pleasant-red-turtleneck.cyclic.cloud";
  axios.defaults.withCredentials = true;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />}></Route>
        <Route path="/budgets/:budgetId" element={<Budgets />}></Route>
        <Route path="/logout" element={<Logout />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/home" element={<Home />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
