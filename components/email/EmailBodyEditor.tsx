interface EmailBodyEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

function getWordCount(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  return words.length
}

export function EmailBodyEditor({ value, onChange, disabled = false }: EmailBodyEditorProps) {
  const wordCount = getWordCount(value)
  const overLimit = wordCount > 120

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        rows={14}
        className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-placeholder)] focus:border-[var(--border-active)] disabled:opacity-70"
        placeholder="Your generated email body appears here"
      />
      <p className={overLimit ? 'text-right text-xs text-[var(--error)]' : 'text-right text-xs text-[var(--text-secondary)]'}>
        {wordCount} words / 120
      </p>
    </div>
  )
}
