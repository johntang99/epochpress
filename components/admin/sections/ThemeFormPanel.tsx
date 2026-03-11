'use client';

interface ThemeFormPanelProps {
  isThemeFile: boolean;
  formData: Record<string, any> | null;
  getPathValue: (path: string[]) => any;
  updateFormValue: (path: string[], value: any) => void;
  renderColorField: (label: string, path: string[]) => JSX.Element;
}

export function ThemeFormPanel({
  isThemeFile,
  formData,
  getPathValue,
  updateFormValue,
  renderColorField,
}: ThemeFormPanelProps) {
  if (!isThemeFile || !formData) return null;

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-6">
      <div className="text-xs font-semibold text-gray-500 uppercase">Theme</div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">Typography Sizes</div>
          {(['display', 'heading', 'subheading', 'body', 'small'] as const).map((key) => (
            <div key={`type-${key}`}>
              <label className="block text-xs text-gray-500">{key}</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={String(getPathValue(['typography', key]) || '')}
                onChange={(event) => updateFormValue(['typography', key], event.target.value)}
                placeholder="e.g. 2rem"
              />
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">Typography Fonts</div>
          {(['display', 'heading', 'subheading', 'body', 'small'] as const).map((key) => (
            <div key={`font-${key}`}>
              <label className="block text-xs text-gray-500">{key}</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={String(getPathValue(['typography', 'fonts', key]) || '')}
                onChange={(event) =>
                  updateFormValue(['typography', 'fonts', key], event.target.value)
                }
                placeholder="e.g. Inter, sans-serif"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">Primary Colors</div>
          {renderColorField('Primary', ['colors', 'primary', 'DEFAULT'])}
          {renderColorField('Primary Dark', ['colors', 'primary', 'dark'])}
          {renderColorField('Primary Light', ['colors', 'primary', 'light'])}
          {renderColorField('Primary 50', ['colors', 'primary', '50'])}
          {renderColorField('Primary 100', ['colors', 'primary', '100'])}
        </div>
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">Secondary Colors</div>
          {renderColorField('Secondary', ['colors', 'secondary', 'DEFAULT'])}
          {renderColorField('Secondary Dark', ['colors', 'secondary', 'dark'])}
          {renderColorField('Secondary Light', ['colors', 'secondary', 'light'])}
          {renderColorField('Secondary 50', ['colors', 'secondary', '50'])}
        </div>
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">Backdrop Colors</div>
          {renderColorField('Backdrop Primary', ['colors', 'backdrop', 'primary'])}
          {renderColorField('Backdrop Secondary', ['colors', 'backdrop', 'secondary'])}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-3 md:col-span-2">
          <div className="text-xs font-semibold text-gray-500 uppercase">Home Hero Overlay</div>
          {renderColorField('Gradient From', ['heroOverlay', 'from'])}
          {renderColorField('Gradient To', ['heroOverlay', 'to'])}
        </div>
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">Overlay Strength</div>
          <div>
            <label className="block text-xs text-gray-500">Opacity (0-1)</label>
            <input
              type="number"
              min={0}
              max={1}
              step={0.05}
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={String(getPathValue(['heroOverlay', 'opacity']) ?? 0.7)}
              onChange={(event) => {
                const nextValue = Number.parseFloat(event.target.value);
                if (Number.isNaN(nextValue)) {
                  updateFormValue(['heroOverlay', 'opacity'], 0.7);
                  return;
                }
                updateFormValue(['heroOverlay', 'opacity'], Math.min(1, Math.max(0, nextValue)));
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">Radius Tokens</div>
          {(['card', 'photo', 'button', 'pill'] as const).map((key) => (
            <div key={`radius-${key}`}>
              <label className="block text-xs text-gray-500">{key}</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={String(getPathValue(['radii', key]) || '')}
                onChange={(event) => updateFormValue(['radii', key], event.target.value)}
                placeholder={key === 'pill' ? 'e.g. 9999px' : 'e.g. 1rem'}
              />
            </div>
          ))}
        </div>
        <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
          <p className="font-semibold text-gray-700">How radius tokens are used</p>
          <p>`card` controls most panel/card corners (`rounded-2xl`).</p>
          <p>`photo` controls rounded media containers (`rounded-2xl` + `overflow-hidden`).</p>
          <p>`button` controls button/link corners (`rounded-xl`).</p>
          <p>`pill` controls pills/chips (`rounded-full`).</p>
        </div>
      </div>
    </div>
  );
}
