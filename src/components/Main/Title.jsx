
  export function Title({ title, count }) {
    return (
      <div className="mb-5 flex items-center gap-8">
        <h1 className="text-3xl sm:text-4xl truncate font-bold text-text-primary">{title}</h1>
        {count >= 0 && (
          <span className="rounded-lg border text-text-primary border-border px-2 py-1  sm:px-3 sm:py-2 text-2xl sm:text-3xl font-semibold">
            {count}
          </span>
        )}
      </div>
    );
  }
  