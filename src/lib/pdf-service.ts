import { supabase } from '@/integrations/supabase/client';
import type { ABNTOptions } from '@/components/FormatOptions';
import type { Figure } from '@/components/FiguresList';

export interface GeneratePDFResponse {
  success: boolean;
  html: string;
  filename: string;
}

export async function generatePDF(
  filename: string,
  options: ABNTOptions,
  figures: Figure[]
): Promise<GeneratePDFResponse> {
  const { data, error } = await supabase.functions.invoke('generate-pdf', {
    body: { filename, options, figures }
  });

  if (error) {
    throw new Error(error.message || 'Erro ao gerar PDF');
  }

  return data as GeneratePDFResponse;
}

export async function downloadPDFFromHtml(html: string, filename: string): Promise<void> {
  // Dynamic import of html2pdf.js
  const html2pdf = (await import('html2pdf.js')).default;
  
  // Create a temporary container
  const container = document.createElement('div');
  container.innerHTML = html;
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  document.body.appendChild(container);

  const opt = {
    margin: 0,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    await html2pdf().set(opt).from(container).save();
  } finally {
    document.body.removeChild(container);
  }
}
