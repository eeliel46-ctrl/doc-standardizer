import { useState, useCallback } from 'react';
import { FileDown, Sparkles, BookOpen, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/FileUpload';
import { FormatOptions, ABNTOptions } from '@/components/FormatOptions';
import { DocumentPreview } from '@/components/DocumentPreview';
import { FiguresList, Figure } from '@/components/FiguresList';
import { ProcessingStatus, ProcessingStep } from '@/components/ProcessingStatus';
import { toast } from 'sonner';

const defaultOptions: ABNTOptions = {
  fontFamily: 'Times New Roman',
  fontSize: '12pt',
  lineSpacing: '1.5',
  margins: 'abnt',
  autoCaptions: true,
  pageNumbers: true,
  headerFooter: true,
};

// Mock figures for demo
const mockFigures: Figure[] = [
  { id: 1, name: 'Screenshot do sistema', originalName: 'img001.png' },
  { id: 2, name: 'Diagrama de fluxo', originalName: 'img002.png' },
  { id: 3, name: 'Gráfico de resultados', originalName: 'img003.png' },
];

export default function Index() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [options, setOptions] = useState<ABNTOptions>(defaultOptions);
  const [figures, setFigures] = useState<Figure[]>([]);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('idle');

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setFigures(mockFigures); // In real app, would detect figures from document
    toast.success('Documento carregado com sucesso!');
  }, []);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setFigures([]);
    setProcessingStep('idle');
  }, []);

  const updateFigureCaption = useCallback((id: number, caption: string) => {
    setFigures(prev => 
      prev.map(fig => fig.id === id ? { ...fig, name: caption } : fig)
    );
  }, []);

  const handleConvert = async () => {
    if (!selectedFile) return;

    const steps: ProcessingStep[] = ['reading', 'detecting', 'formatting', 'generating', 'complete'];
    
    for (const step of steps) {
      setProcessingStep(step);
      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    toast.success('PDF gerado com sucesso!', {
      description: 'Clique no botão de download para baixar.',
    });
  };

  const handleDownload = () => {
    // In real app, would download the generated PDF
    toast.info('Em uma implementação real, o PDF seria baixado aqui.');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[hsl(200_70%_45%)] flex items-center justify-center shadow-md">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ABNT Formatter</h1>
                <p className="text-xs text-muted-foreground">Word → PDF Padronizado</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                Seguro
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Legendas automáticas
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Converta seus documentos para
            <span className="text-primary"> normas ABNT</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Faça upload do seu arquivo Word e converta automaticamente para PDF 
            com formatação padrão ABNT. Inclui legendas automáticas para todas as figuras.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Options */}
          <div className="space-y-6">
            <FileUpload
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              onRemove={handleRemoveFile}
            />

            {selectedFile && (
              <>
                <FormatOptions options={options} onChange={setOptions} />
                
                <FiguresList 
                  figures={figures} 
                  onUpdateCaption={updateFigureCaption}
                />

                {processingStep === 'idle' ? (
                  <Button 
                    variant="hero" 
                    size="xl" 
                    className="w-full"
                    onClick={handleConvert}
                  >
                    <Sparkles className="w-5 h-5" />
                    Converter para PDF
                  </Button>
                ) : processingStep === 'complete' ? (
                  <Button 
                    variant="success" 
                    size="xl" 
                    className="w-full"
                    onClick={handleDownload}
                  >
                    <FileDown className="w-5 h-5" />
                    Baixar PDF Formatado
                  </Button>
                ) : null}
              </>
            )}
          </div>

          {/* Right Column - Preview & Status */}
          <div className="space-y-6">
            {selectedFile ? (
              <>
                {processingStep !== 'idle' && (
                  <ProcessingStatus currentStep={processingStep} />
                )}
                <DocumentPreview 
                  fileName={selectedFile.name}
                  options={options}
                  figures={figures}
                />
              </>
            ) : (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Nenhum documento selecionado
                </h3>
                <p className="text-sm text-muted-foreground">
                  Faça upload de um arquivo Word (.doc ou .docx) para visualizar a prévia.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-16 md:mt-24">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">
            Recursos Incluídos
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Formatação ABNT',
                description: 'Fonte Times New Roman 12pt, espaçamento 1,5, margens corretas e numeração de páginas.',
              },
              {
                title: 'Legendas Automáticas',
                description: 'Detecta todas as imagens do documento e adiciona legendas no formato "Figura X - Descrição".',
              },
              {
                title: 'Download Instantâneo',
                description: 'Gera o PDF formatado em segundos, pronto para impressão ou envio digital.',
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold">{index + 1}</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8 mt-16">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>ABNT Formatter — Conversão de documentos seguindo normas brasileiras</p>
        </div>
      </footer>
    </div>
  );
}
