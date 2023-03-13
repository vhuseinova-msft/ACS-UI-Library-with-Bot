// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import * as Adaptive from "adaptivecards";
import ProgressBar from "./ProgressBar";

// Added registration for a custom element ProgressBar
Adaptive.GlobalRegistry.elements.register(
  ProgressBar.JsonTypeName,
  ProgressBar
);

ReactDOM.render(
  <div className="wrapper">
    <App />
  </div>,
  document.getElementById("root")
);
