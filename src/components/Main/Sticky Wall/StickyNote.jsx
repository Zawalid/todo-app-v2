export function StickyNote({ background, adder, title, content }) {
  return (
    <div
      className={"h-[270px] rounded-lg p-5 shadow-[rgba(3_3_3_0.08)_0px_6px_16px] " +
        (adder ? "grid place-content-center" : "")}
      style={{
        backgroundColor: background,
      }}
    >
      {adder && (
        <i className="fas fa-plus cursor-pointer text-5xl text-text-primary"></i>
      )}
      {!adder && (
        <>
          <h2 className="mb-3 text-2xl font-bold text-text-primary">
            {title}
          </h2>
          <p className="h-40 overflow-auto pr-2 text-sm text-text-primary">
            {content}
          </p>
        </>
      )}
    </div>
  );
}
