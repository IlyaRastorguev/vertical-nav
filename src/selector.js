import React from "react";

function Selector({ name, callback, index, className }) {
  return (
    <div className={className} onClick={() => callback(index)}>
      {name}
    </div>
  );
}

export default Selector;
