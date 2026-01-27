import { Check, Loader2, FileText, Image, Settings, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ProcessingStep = 'idle' | 'reading' | 'detecting' | 'formatting' | 'generating' | 'complete';

interface ProcessingStatusProps {
  currentStep: ProcessingStep;
}

const steps = [
  { id: 'reading', label: 'Lendo documento', icon: FileText },
  { id: 'detecting', label: 'Detectando figuras', icon: Image },
  { id: 'formatting', label: 'Aplicando ABNT', icon: Settings },
  { id: 'generating', label: 'Gerando PDF', icon: Download },
];

export function ProcessingStatus({ currentStep }: ProcessingStatusProps) {
  if (currentStep === 'idle') return null;

  const getStepStatus = (stepId: string) => {
    const stepOrder = ['reading', 'detecting', 'formatting', 'generating', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);
    
    if (stepIndex < currentIndex || currentStep === 'complete') return 'complete';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-md">
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                status === 'complete' && "bg-accent text-accent-foreground",
                status === 'current' && "bg-primary text-primary-foreground animate-pulse",
                status === 'pending' && "bg-muted text-muted-foreground"
              )}>
                {status === 'complete' ? (
                  <Check className="w-5 h-5" />
                ) : status === 'current' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              
              <div className="flex-1">
                <p className={cn(
                  "font-medium transition-colors",
                  status === 'complete' && "text-accent",
                  status === 'current' && "text-foreground",
                  status === 'pending' && "text-muted-foreground"
                )}>
                  {step.label}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <div className={cn(
                  "absolute left-5 mt-10 w-0.5 h-4",
                  status === 'complete' ? "bg-accent" : "bg-border"
                )} />
              )}
            </div>
          );
        })}
      </div>
      
      {currentStep === 'complete' && (
        <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/30">
          <p className="text-sm text-accent font-medium text-center">
            ✓ Documento pronto para download!
          </p>
        </div>
      )}
    </div>
  );
}
