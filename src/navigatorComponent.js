import React from "react";

function NavigatorComponent({ anchorRef, children, style }) {
  return (
    <div ref={anchorRef} style={{ ...style }}>
      {children}
    </div>
  );
}

export default NavigatorComponent;
