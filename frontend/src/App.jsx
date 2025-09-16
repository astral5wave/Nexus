import React from "react";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import { Routes,Route } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth/>} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};

export default App;