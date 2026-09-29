import { colorTokens, type ColorGroup } from "@/content/design-preview";

export function ColorSwatches() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {(Object.keys(colorTokens) as ColorGroup[]).map((group) => (
        <div key={group} className="flex flex-col gap-3">
          <p className="font-mono text-label text-fg-muted uppercase">{group}</p>
          <ul className="grid grid-cols-2 gap-2">
            {colorTokens[group].map((token) => (
              <li key={token} className="flex items-center gap-3">
                <span
                  className="size-8 shrink-0 rounded-sm border border-line-strong"
                  style={{ backgroundColor: `var(--color-${token})` }}
                />
                <code className="font-mono text-xs text-fg-secondary">{token}</code>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
