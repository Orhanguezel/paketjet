interface FilterOption {
  value: string;
  label: string;
}

interface Props {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export function AdminStatusFilter({ options, value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            value === opt.value
              ? "bg-brand text-white"
              : "bg-bg-alt text-muted hover:bg-border-soft hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
