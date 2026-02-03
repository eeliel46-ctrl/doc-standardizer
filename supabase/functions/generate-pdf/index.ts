import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ABNTOptions {
  fontFamily: string;
  fontSize: string;
  lineSpacing: string;
  margins: string;
  autoCaptions: boolean;
  pageNumbers: boolean;
  headerFooter: boolean;
}

interface Figure {
  id: number;
  name: string;
  originalName: string;
}

interface RequestBody {
  filename: string;
  options: ABNTOptions;
  figures: Figure[];
  content?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filename, options, figures, content } = await req.json() as RequestBody;

    console.log('Generating PDF for:', filename);
    console.log('Options:', options);
    console.log('Figures:', figures);

    // Generate HTML with ABNT formatting
    const marginStyles = options.margins === 'abnt' 
      ? 'margin: 3cm 2cm 2cm 3cm;' 
      : 'margin: 2.5cm;';

    const lineHeight = options.lineSpacing === '1.5' ? '1.8' : options.lineSpacing === '2.0' ? '2.4' : '1.4';

    const figuresHtml = figures.map((fig, index) => `
      <div style="text-align: center; margin: 2cm 0;">
        <div style="background: #f0f0f0; padding: 3cm; border: 1px solid #ddd;">
          <span style="color: #666;">[ Imagem ${fig.id} ]</span>
        </div>
        ${options.autoCaptions ? `
          <p style="font-size: 10pt; margin-top: 0.5cm; text-align: center;">
            <strong>Figura ${fig.id}</strong> - ${fig.name}
          </p>
          <p style="font-size: 10pt; color: #666;">Fonte: Elaborado pelo autor (2024)</p>
        ` : ''}
      </div>
    `).join('');

    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${filename.replace(/\.(docx?)/i, '')}</title>
  <style>
    @page {
      size: A4;
      ${marginStyles}
    }
    body {
      font-family: '${options.fontFamily}', serif;
      font-size: ${options.fontSize};
      line-height: ${lineHeight};
      color: #000;
      text-align: justify;
    }
    h1, h2, h3 {
      text-transform: uppercase;
      font-weight: bold;
      margin-top: 1.5cm;
      margin-bottom: 1cm;
    }
    h1 { font-size: 14pt; text-align: center; }
    h2 { font-size: 12pt; }
    h3 { font-size: 12pt; font-weight: normal; font-style: italic; }
    p {
      text-indent: 1.25cm;
      margin-bottom: 0.5cm;
    }
    .header {
      position: fixed;
      top: -2cm;
      right: 0;
      font-size: 10pt;
      color: #666;
    }
    .page-number {
      position: fixed;
      top: -2cm;
      right: 0;
      font-size: 10pt;
    }
    .title-page {
      text-align: center;
      padding-top: 8cm;
    }
    .title-page h1 {
      font-size: 14pt;
      margin-bottom: 3cm;
    }
  </style>
</head>
<body>
  ${options.headerFooter ? `<div class="header">${filename.replace(/\.(docx?)/i, '')}</div>` : ''}
  ${options.pageNumbers ? `<div class="page-number">1</div>` : ''}
  
  <div class="title-page">
    <h1>${filename.replace(/\.(docx?)/i, '').toUpperCase()}</h1>
    <p style="text-indent: 0; text-align: center;">Documento formatado conforme normas ABNT</p>
  </div>

  <div style="page-break-before: always;"></div>

  <h2>1 INTRODUÇÃO</h2>
  <p>
    Este documento foi automaticamente formatado seguindo as normas da Associação Brasileira 
    de Normas Técnicas (ABNT). A formatação inclui fonte ${options.fontFamily} tamanho ${options.fontSize}, 
    espaçamento entre linhas de ${options.lineSpacing}, e margens conforme especificado.
  </p>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
    ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
    ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </p>

  ${figures.length > 0 ? `
    <h2>2 FIGURAS</h2>
    <p>
      A seguir são apresentadas as figuras detectadas no documento original, 
      ${options.autoCaptions ? 'com legendas geradas automaticamente conforme normas ABNT.' : 'sem legendas automáticas.'}
    </p>
    ${figuresHtml}
  ` : ''}

  <h2>${figures.length > 0 ? '3' : '2'} CONSIDERAÇÕES FINAIS</h2>
  <p>
    O documento foi processado e convertido para o formato PDF mantendo todas as 
    configurações de formatação ABNT selecionadas pelo usuário.
  </p>

</body>
</html>
    `;

    // For now, return the HTML that can be used to generate PDF on client side
    // In production, you'd use a PDF generation service here
    return new Response(
      JSON.stringify({ 
        success: true,
        html: htmlContent,
        filename: filename.replace(/\.(docx?)/i, '') + '_ABNT.pdf'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
