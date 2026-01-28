import React from 'react';

import './animated-box.css';

export const AnimatedBox: React.FC = () => {
  const [active, setActive] = React.useState(false);

  return (
    <div className="qlip-anim-stage">
      <button
        type="button"
        className="qlip-anim-trigger"
        onClick={() => setActive((prev) => !prev)}
      >
        Toggle
      </button>
      <div className={`qlip-anim-box ${active ? 'is-active' : ''}`} />
    </div>
  );
};
