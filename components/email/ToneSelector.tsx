import type { EmailTone } from '@/types'

const TONES: Array<{ value: EmailTone; label: string }> = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'bold', label: 'Bold' },
]

interface ToneSelectorProps {
  value: EmailTone
  onChange: (tone: EmailTone) => void
  disabled?: boolean
}

export function ToneSelector({ value, onChange, disabled = false }: ToneSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {TONES.map((tone) => {
        const selected = value === tone.value
        return (
          <button
            key={tone.value}
            type="button"
            onClick={() => onChange(tone.value)}
            disabled={disabled}
            className={
              selected
                ? 'h-10 rounded-[var(--radius-md)] border border-[var(--border-active)] bg-[var(--accent-gold-light)] text-sm font-medium text-[var(--accent-gold)] disabled:opacity-50'
                : 'h-10 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] disabled:opacity-50'
            }
          >
            {tone.label}
          </button>
        )
      })}
    </div>
  )
}
