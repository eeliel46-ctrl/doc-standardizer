import { FileText, Image, Type } from 'lucide-react';
import { ABNTOptions } from './FormatOptions';

interface DocumentPreviewProps {
  fileName: string;
  options: ABNTOptions;
  figures: { id: number; name: string }[];
}

export function DocumentPreview({ fileName, options, figures }: DocumentPreviewProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden">
      <div className="bg-muted/50 px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Prévia do Documento
        </h3>
      </div>
      
      <div className="p-6">
        {/* Document Mock */}
        <div 
          className="bg-white border border-border rounded-lg shadow-sm overflow-hidden"
          style={{
            aspectRatio: '210/297',
            maxHeight: '500px',
          }}
        >
          {/* Page Header */}
          {options.headerFooter && (
            <div className="h-8 border-b border-border/50 flex items-center justify-end px-4">
              <span className="text-xs text-muted-foreground truncate max-w-[80%]">
                {fileName.replace(/\.(docx?)/i, '')}
              </span>
            </div>
          )}
          
          {/* Content Area */}
          <div className="p-6 space-y-4">
            {/* Title */}
            <div className="text-center space-y-2">
              <div className="h-3 bg-foreground/80 rounded w-3/4 mx-auto" />
              <div className="h-2 bg-foreground/40 rounded w-1/2 mx-auto" />
            </div>
            
            {/* Paragraph */}
            <div className="space-y-1.5 pt-4">
              <div className="h-2 bg-muted-foreground/30 rounded w-full" />
              <div className="h-2 bg-muted-foreground/30 rounded w-full" />
              <div className="h-2 bg-muted-foreground/30 rounded w-11/12" />
              <div className="h-2 bg-muted-foreground/30 rounded w-full" />
              <div className="h-2 bg-muted-foreground/30 rounded w-4/5" />
            </div>
            
            {/* Figure with caption */}
            {figures.length > 0 && (
              <div className="py-4">
                <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center gap-2">
                  <Image className="w-12 h-12 text-muted-foreground/50" />
                  {options.autoCaptions && (
                    <p className="text-xs text-center text-muted-foreground">
                      <span className="font-medium">Figura 1</span> - {figures[0]?.name || 'Descrição da imagem'}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* More paragraphs */}
            <div className="space-y-1.5">
              <div className="h-2 bg-muted-foreground/30 rounded w-full" />
              <div className="h-2 bg-muted-foreground/30 rounded w-10/12" />
              <div className="h-2 bg-muted-foreground/30 rounded w-full" />
            </div>
          </div>
          
          {/* Page Footer */}
          {options.pageNumbers && (
            <div className="absolute bottom-0 right-0 p-4">
              <span className="text-xs text-muted-foreground">1</span>
            </div>
          )}
        </div>
        
        {/* Format Info */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Type className="w-4 h-4" />
            <span>{options.fontFamily}, {options.fontSize}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-xs">↕</span>
            <span>Espaço {options.lineSpacing}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
