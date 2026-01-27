import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ABNTOptions {
  fontFamily: string;
  fontSize: string;
  lineSpacing: string;
  margins: string;
  autoCaptions: boolean;
  pageNumbers: boolean;
  headerFooter: boolean;
}

interface FormatOptionsProps {
  options: ABNTOptions;
  onChange: (options: ABNTOptions) => void;
}

export function FormatOptions({ options, onChange }: FormatOptionsProps) {
  const updateOption = <K extends keyof ABNTOptions>(key: K, value: ABNTOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-md">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Formatação ABNT
      </h3>
      
      <div className="space-y-5">
        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Fonte
          </label>
          <select
            value={options.fontFamily}
            onChange={(e) => updateOption('fontFamily', e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          >
            <option value="Times New Roman">Times New Roman</option>
            <option value="Arial">Arial</option>
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Tamanho da fonte
          </label>
          <select
            value={options.fontSize}
            onChange={(e) => updateOption('fontSize', e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          >
            <option value="12pt">12pt (Padrão ABNT)</option>
            <option value="10pt">10pt (Citações)</option>
          </select>
        </div>

        {/* Line Spacing */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Espaçamento entre linhas
          </label>
          <select
            value={options.lineSpacing}
            onChange={(e) => updateOption('lineSpacing', e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          >
            <option value="1.5">1,5 (Padrão ABNT)</option>
            <option value="1.0">Simples</option>
            <option value="2.0">Duplo</option>
          </select>
        </div>

        {/* Margins */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Margens
          </label>
          <select
            value={options.margins}
            onChange={(e) => updateOption('margins', e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          >
            <option value="abnt">ABNT (3cm sup/esq, 2cm inf/dir)</option>
            <option value="normal">Normal (2,5cm)</option>
          </select>
        </div>

        {/* Toggle Options */}
        <div className="space-y-3 pt-2">
          <ToggleOption
            label="Legendas automáticas nas figuras"
            description="Adiciona 'Figura X - ' antes de cada imagem"
            checked={options.autoCaptions}
            onChange={(checked) => updateOption('autoCaptions', checked)}
          />
          <ToggleOption
            label="Numeração de páginas"
            description="Insere números no canto superior direito"
            checked={options.pageNumbers}
            onChange={(checked) => updateOption('pageNumbers', checked)}
          />
          <ToggleOption
            label="Cabeçalho e rodapé"
            description="Adiciona título do documento no cabeçalho"
            checked={options.headerFooter}
            onChange={(checked) => updateOption('headerFooter', checked)}
          />
        </div>
      </div>
    </div>
  );
}

interface ToggleOptionProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleOption({ label, description, checked, onChange }: ToggleOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left",
        checked 
          ? "border-primary/30 bg-primary/5" 
          : "border-border bg-background hover:bg-muted/50"
      )}
    >
      <div className={cn(
        "mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
        checked 
          ? "bg-primary border-primary" 
          : "border-muted-foreground/30"
      )}>
        {checked && <Check className="w-3 h-3 text-primary-foreground" />}
      </div>
      <div>
        <p className="font-medium text-foreground text-sm">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </button>
  );
}
