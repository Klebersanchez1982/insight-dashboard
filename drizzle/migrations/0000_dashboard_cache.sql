CREATE TABLE public.dashboard_cache (id text PRIMARY KEY, body jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.dashboard_cache TO service_role;
ALTER TABLE public.dashboard_cache ENABLE ROW LEVEL SECURITY;