CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.appointments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    barber_name text NOT NULL,
    customer_name text NOT NULL,
    customer_phone text NOT NULL,
    customer_email text,
    service text NOT NULL,
    date text NOT NULL,
    "time" text NOT NULL,
    status text DEFAULT 'pending'::text,
    price text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    duration integer,
    booking_number integer NOT NULL,
    notes text,
    CONSTRAINT appointments_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'completed'::text, 'cancelled'::text])))
);


--
-- Name: appointments_booking_number_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.appointments_booking_number_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: appointments_booking_number_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.appointments_booking_number_seq OWNED BY public.appointments.booking_number;


--
-- Name: gallery; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gallery (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    image_url text NOT NULL,
    title text,
    description text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: unavailability; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.unavailability (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    barber_name text NOT NULL,
    date text NOT NULL,
    time_slots text[] NOT NULL,
    is_full_day boolean DEFAULT false,
    reason text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: appointments booking_number; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments ALTER COLUMN booking_number SET DEFAULT nextval('public.appointments_booking_number_seq'::regclass);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: gallery gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery
    ADD CONSTRAINT gallery_pkey PRIMARY KEY (id);


--
-- Name: unavailability unavailability_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unavailability
    ADD CONSTRAINT unavailability_pkey PRIMARY KEY (id);


--
-- Name: appointments_booking_number_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX appointments_booking_number_idx ON public.appointments USING btree (booking_number);


--
-- Name: idx_gallery_display_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gallery_display_order ON public.gallery USING btree (display_order);


--
-- Name: appointments update_appointments_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: appointments Anyone can create appointments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create appointments" ON public.appointments FOR INSERT WITH CHECK (true);


--
-- Name: gallery Anyone can create gallery images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create gallery images" ON public.gallery FOR INSERT WITH CHECK (true);


--
-- Name: unavailability Anyone can create unavailability; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create unavailability" ON public.unavailability FOR INSERT WITH CHECK (true);


--
-- Name: gallery Anyone can delete gallery images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete gallery images" ON public.gallery FOR DELETE USING (true);


--
-- Name: unavailability Anyone can delete unavailability; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete unavailability" ON public.unavailability FOR DELETE USING (true);


--
-- Name: appointments Anyone can update appointments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update appointments" ON public.appointments FOR UPDATE USING (true);


--
-- Name: gallery Anyone can update gallery images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update gallery images" ON public.gallery FOR UPDATE USING (true);


--
-- Name: unavailability Anyone can update unavailability; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update unavailability" ON public.unavailability FOR UPDATE USING (true);


--
-- Name: appointments Anyone can view appointments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view appointments" ON public.appointments FOR SELECT USING (true);


--
-- Name: gallery Anyone can view gallery images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view gallery images" ON public.gallery FOR SELECT USING (true);


--
-- Name: unavailability Anyone can view unavailability; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view unavailability" ON public.unavailability FOR SELECT USING (true);


--
-- Name: appointments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

--
-- Name: gallery; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

--
-- Name: unavailability; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.unavailability ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


