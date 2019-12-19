import React from "react";
import ReactDOM from "react-dom";

import Navigator from "./verticalNavigator";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <Navigator>
        <h1 name="header 1" style={{ height: "1000px" }}>
          Hello CodeSandbox
        </h1>
        <h1 name="header 2" style={{ height: "1000px" }}>
          Hello CodeSandbox
        </h1>
        <h2 name="header 3" style={{ height: "1000px" }}>
          Start editing to see some magic happen!
        </h2>
      </Navigator>
      <div style={{ height: "10px" }}>sdjaskdhaskdhaskjdh</div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
