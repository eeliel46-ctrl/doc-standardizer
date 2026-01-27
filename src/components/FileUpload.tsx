import { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onRemove: () => void;
}

export function FileUpload({ onFileSelect, selectedFile, onRemove }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  if (selectedFile) {
    return (
      <div className="relative bg-card border-2 border-primary/20 rounded-xl p-6 transition-all duration-300 shadow-md">
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-primary/10">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer",
        "hover:border-primary/50 hover:bg-primary/5",
        isDragging 
          ? "border-primary bg-primary/10 scale-[1.02]" 
          : "border-border bg-card"
      )}
    >
      <input
        type="file"
        accept=".doc,.docx"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center gap-4 text-center">
        <div className={cn(
          "p-4 rounded-full transition-all duration-300",
          isDragging ? "bg-primary text-primary-foreground scale-110" : "bg-muted"
        )}>
          <Upload className="w-8 h-8" />
        </div>
        <div>
          <p className="font-semibold text-foreground">
            Arraste seu arquivo Word aqui
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            ou clique para selecionar (.doc, .docx)
          </p>
        </div>
      </div>
    </div>
  );
}
