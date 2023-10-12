
  export function Title({ title, count }) {
    return (
      <div className="mb-10 flex items-center gap-8">
        <h1 className="text-4xl font-bold text-text-primary">{title}</h1>
        {count >= 0 && (
          <span className="rounded-lg border border-background-tertiary px-3 py-2 text-3xl font-semibold">
            {count}
          </span>
        )}
      </div>
    );
  }
  