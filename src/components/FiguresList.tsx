import { useState } from 'react';
import { Image, Edit2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Figure {
  id: number;
  name: string;
  originalName: string;
}

interface FiguresListProps {
  figures: Figure[];
  onUpdateCaption: (id: number, caption: string) => void;
}

export function FiguresList({ figures, onUpdateCaption }: FiguresListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEditing = (figure: Figure) => {
    setEditingId(figure.id);
    setEditValue(figure.name);
  };

  const saveEdit = (id: number) => {
    onUpdateCaption(id, editValue);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  if (figures.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-md">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Image className="w-5 h-5 text-primary" />
        Figuras Detectadas ({figures.length})
      </h3>
      
      <div className="space-y-3">
        {figures.map((figure) => (
          <div 
            key={figure.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border transition-all",
              editingId === figure.id 
                ? "border-primary bg-primary/5" 
                : "border-border bg-muted/30"
            )}
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <Image className="w-5 h-5 text-muted-foreground" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">
                Figura {figure.id}
              </p>
              
              {editingId === figure.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 h-8 px-2 text-sm rounded border border-input bg-background focus:ring-2 focus:ring-ring"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(figure.id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                  <button
                    onClick={() => saveEdit(figure.id)}
                    className="p-1.5 rounded-md bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1.5 rounded-md bg-muted hover:bg-muted-foreground/20 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-sm font-medium text-foreground truncate">
                  {figure.name}
                </p>
              )}
            </div>
            
            {editingId !== figure.id && (
              <button
                onClick={() => startEditing(figure)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground mt-4">
        Clique no ícone de edição para personalizar a legenda de cada figura.
      </p>
    </div>
  );
}
