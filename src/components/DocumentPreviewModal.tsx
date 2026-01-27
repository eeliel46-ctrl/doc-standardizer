import { ABNTOptions } from './FormatOptions';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  options: ABNTOptions;
  figures: { id: number; name: string }[];
  htmlContent?: string;
}

export function DocumentPreviewModal({ 
  isOpen, 
  onClose, 
  fileName, 
  options, 
  figures,
  htmlContent 
}: DocumentPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm">
      <div className="bg-card w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-muted px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Prévia do Documento ABNT
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted-foreground/20 transition-colors text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-muted/30">
          {htmlContent ? (
            <div 
              className="bg-white shadow-lg mx-auto"
              style={{
                width: '210mm',
                minHeight: '297mm',
                padding: '3cm 2cm 2cm 3cm',
                fontFamily: options.fontFamily,
                fontSize: options.fontSize,
              }}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          ) : (
            <div 
              className="bg-white shadow-lg mx-auto p-8"
              style={{
                width: '210mm',
                minHeight: '297mm',
              }}
            >
              {/* Simulated Document */}
              <div className="text-center mb-12 pt-16">
                <h1 
                  className="text-sm font-bold uppercase mb-8"
                  style={{ fontFamily: options.fontFamily }}
                >
                  {fileName.replace(/\.(docx?)/i, '').toUpperCase()}
                </h1>
                <p 
                  className="text-sm"
                  style={{ fontFamily: options.fontFamily }}
                >
                  Documento formatado conforme normas ABNT
                </p>
              </div>

              <hr className="my-8 border-muted" />

              <div style={{ fontFamily: options.fontFamily, fontSize: options.fontSize }}>
                <h2 className="text-sm font-bold uppercase mb-4">1 INTRODUÇÃO</h2>
                <p 
                  className="text-justify mb-4"
                  style={{ 
                    textIndent: '1.25cm',
                    lineHeight: options.lineSpacing === '1.5' ? '1.8' : options.lineSpacing === '2.0' ? '2.4' : '1.4'
                  }}
                >
                  Este documento foi automaticamente formatado seguindo as normas da Associação 
                  Brasileira de Normas Técnicas (ABNT). A formatação inclui fonte {options.fontFamily} tamanho {options.fontSize}, 
                  espaçamento entre linhas de {options.lineSpacing}, e margens conforme especificado.
                </p>

                {figures.length > 0 && (
                  <>
                    <h2 className="text-sm font-bold uppercase mb-4 mt-8">2 FIGURAS</h2>
                    {figures.map((fig) => (
                      <div key={fig.id} className="my-8 text-center">
                        <div className="bg-muted/30 border border-border p-12 mb-2 inline-block">
                          <span className="text-muted-foreground">[ Imagem {fig.id} ]</span>
                        </div>
                        {options.autoCaptions && (
                          <>
                            <p className="text-xs mt-2">
                              <strong>Figura {fig.id}</strong> - {fig.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Fonte: Elaborado pelo autor (2024)
                            </p>
                          </>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-muted px-6 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            Formatação: {options.fontFamily}, {options.fontSize} • 
            Espaçamento: {options.lineSpacing} • 
            Margens: {options.margins === 'abnt' ? 'ABNT' : 'Normal'}
          </p>
        </div>
      </div>
    </div>
  );
}
