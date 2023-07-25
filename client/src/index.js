import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Verifier } from "./Verifier";
import { Prover } from "./Prover";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={App} /> {/* 👈 Renders at /app/ */}
        <Route path="/verifier/:checkId" Component={Verifier} />
        <Route path="/prover/:checkId" Component={Prover} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
