-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true);

-- Allow authenticated and anonymous users to upload
CREATE POLICY "Anyone can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents');

-- Allow anyone to read documents
CREATE POLICY "Anyone can read documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

-- Allow anyone to delete their documents
CREATE POLICY "Anyone can delete documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents');

-- Create table to track conversions
CREATE TABLE public.conversions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_filename TEXT NOT NULL,
  pdf_path TEXT,
  options JSONB NOT NULL DEFAULT '{}',
  figures JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public access for this demo
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create conversions"
ON public.conversions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read conversions"
ON public.conversions FOR SELECT
USING (true);

CREATE POLICY "Anyone can update conversions"
ON public.conversions FOR UPDATE
USING (true);