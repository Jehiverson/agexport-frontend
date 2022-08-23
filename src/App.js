import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import FilesTaskPage from "./pages/FilesTaskPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/files/:id" element={<FilesTaskPage />} />
          <Route element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
