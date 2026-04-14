interface SubjectLinePillsProps {
  subjectLines: [string, string, string]
  selectedIndex: number
  onSelect: (index: number) => void
  disabled?: boolean
}

export function SubjectLinePills({ subjectLines, selectedIndex, onSelect, disabled = false }: SubjectLinePillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {subjectLines.map((subject, index) => {
        const selected = selectedIndex === index
        return (
          <button
            key={`${subject}-${index}`}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(index)}
            className={
              selected
                ? 'rounded-full border border-[var(--border-active)] bg-[var(--accent-gold-light)] px-3 py-1.5 text-sm text-[var(--accent-gold)] disabled:opacity-50'
                : 'rounded-full border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50'
            }
          >
            {subject}
          </button>
        )
      })}
    </div>
  )
}
