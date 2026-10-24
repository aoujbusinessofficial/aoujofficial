-- Table for Contact Us queries and customer complaints
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  order_number TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW', -- NEW, IN_PROGRESS, RESOLVED
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public/customers to insert inquiries
CREATE POLICY "Allow public insert on contact_inquiries"
  ON public.contact_inquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow admins/anon to read inquiries
CREATE POLICY "Allow read on contact_inquiries"
  ON public.contact_inquiries
  FOR SELECT
  TO public
  USING (true);

-- Allow updates (e.g. status changes to RESOLVED)
CREATE POLICY "Allow update on contact_inquiries"
  ON public.contact_inquiries
  FOR UPDATE
  TO public
  USING (true);
