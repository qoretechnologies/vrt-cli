import './ignore-mask.css';

export const IgnoreMask = () => {
  return (
    <div className="ignore-mask">
      <div className="ignore-mask__card">
        <p className="ignore-mask__label">Stable content</p>
      </div>
      <div className="ignore-mask__card ignore-mask__card--ignored">
        <p className="ignore-mask__label">Ignored content</p>
        <div className="ignore-mask__pulse" />
      </div>
    </div>
  );
};
