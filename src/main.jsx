import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // ton Tailwind CSS
import ListPdfFields from "./components/ListPdfFields";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <ListPdfFields />
  </React.StrictMode>
);

