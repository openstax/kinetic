SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: api_key(text, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.api_key(text, integer) RETURNS text
    LANGUAGE sql
    AS $_$
          select $1 || '_' || string_agg(substr(characters, (random() * length(characters) + 0.5)::integer, 1), '') as random_word
          from (values('ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789')) as symbols(characters)
          join generate_series(1, $2) on 1 = 1
          $_$;


--
-- Name: random_string(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.random_string(integer) RETURNS text
    LANGUAGE sql
    AS $_$
          select string_agg(substr(characters, (random() * length(characters) + 0.5)::integer, 1), '') as random_word
          from (values('ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789')) as symbols(characters)
          join generate_series(1, $1) on 1 = 1
          $_$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: active_storage_attachments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.active_storage_attachments (
    id bigint NOT NULL,
    name character varying NOT NULL,
    record_type character varying NOT NULL,
    record_id bigint NOT NULL,
    blob_id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: active_storage_attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.active_storage_attachments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: active_storage_attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.active_storage_attachments_id_seq OWNED BY public.active_storage_attachments.id;


--
-- Name: active_storage_blobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.active_storage_blobs (
    id bigint NOT NULL,
    key character varying NOT NULL,
    filename character varying NOT NULL,
    content_type character varying,
    metadata text,
    service_name character varying NOT NULL,
    byte_size bigint NOT NULL,
    checksum character varying NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: active_storage_blobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.active_storage_blobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: active_storage_blobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.active_storage_blobs_id_seq OWNED BY public.active_storage_blobs.id;


--
-- Name: active_storage_variant_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.active_storage_variant_records (
    id bigint NOT NULL,
    blob_id bigint NOT NULL,
    variation_digest character varying NOT NULL
);


--
-- Name: active_storage_variant_records_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.active_storage_variant_records_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: active_storage_variant_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.active_storage_variant_records_id_seq OWNED BY public.active_storage_variant_records.id;


--
-- Name: activesupport_cache_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activesupport_cache_entries (
    key bytea NOT NULL,
    value bytea NOT NULL,
    version character varying,
    created_at timestamp with time zone NOT NULL,
    expires_at timestamp with time zone
);


--
-- Name: admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admins (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL
);


--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: analyses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analyses (
    id bigint NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    repository_url text,
    api_key text DEFAULT public.api_key('an'::text, 18),
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL
);


--
-- Name: analyses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.analyses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: analyses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.analyses_id_seq OWNED BY public.analyses.id;


--
-- Name: analysis_researchers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analysis_researchers (
    id bigint NOT NULL,
    researcher_id bigint NOT NULL,
    analysis_id bigint NOT NULL
);


--
-- Name: analysis_researchers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.analysis_researchers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: analysis_researchers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.analysis_researchers_id_seq OWNED BY public.analysis_researchers.id;


--
-- Name: analysis_run_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analysis_run_messages (
    id bigint NOT NULL,
    analysis_run_id bigint NOT NULL,
    message text NOT NULL,
    stage integer NOT NULL,
    level integer NOT NULL,
    created_at timestamp with time zone
);


--
-- Name: analysis_run_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.analysis_run_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: analysis_run_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.analysis_run_messages_id_seq OWNED BY public.analysis_run_messages.id;


--
-- Name: analysis_runs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analysis_runs (
    id bigint NOT NULL,
    analysis_id bigint NOT NULL,
    api_key text DEFAULT public.api_key('rn'::text, 18) NOT NULL,
    message text NOT NULL,
    started_at timestamp with time zone,
    finished_at timestamp with time zone,
    status integer DEFAULT 0
);


--
-- Name: analysis_runs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.analysis_runs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: analysis_runs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.analysis_runs_id_seq OWNED BY public.analysis_runs.id;


--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL
);


--
-- Name: banners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.banners (
    id bigint NOT NULL,
    message text NOT NULL,
    start_at timestamp with time zone NOT NULL,
    end_at timestamp with time zone NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL
);


--
-- Name: banners_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.banners_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: banners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.banners_id_seq OWNED BY public.banners.id;


--
-- Name: launched_stages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.launched_stages (
    id bigint NOT NULL,
    stage_id bigint NOT NULL,
    user_id uuid,
    first_launched_at timestamp with time zone,
    completed_at timestamp with time zone,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL
);


--
-- Name: launched_stages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.launched_stages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: launched_stages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.launched_stages_id_seq OWNED BY public.launched_stages.id;


--
-- Name: launched_studies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.launched_studies (
    id bigint NOT NULL,
    study_id bigint NOT NULL,
    user_id uuid NOT NULL,
    first_launched_at timestamp with time zone,
    completed_at timestamp with time zone,
    opted_out_at timestamp with time zone,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    aborted_at timestamp with time zone,
    consent_granted boolean
);


--
-- Name: launched_studies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.launched_studies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: launched_studies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.launched_studies_id_seq OWNED BY public.launched_studies.id;


--
-- Name: participant_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participant_metadata (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    study_id bigint NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone
);


--
-- Name: participant_metadata_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.participant_metadata_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: participant_metadata_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.participant_metadata_id_seq OWNED BY public.participant_metadata.id;


--
-- Name: research_ids; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.research_ids (
    id text NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL
);


--
-- Name: researchers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.researchers (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    institution character varying,
    bio text,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    lab_page character varying,
    first_name character varying,
    last_name character varying,
    research_interest1 character varying,
    research_interest2 character varying,
    research_interest3 character varying
);


--
-- Name: researchers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.researchers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: researchers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.researchers_id_seq OWNED BY public.researchers.id;


--
-- Name: response_exports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.response_exports (
    id bigint NOT NULL,
    is_complete boolean DEFAULT false,
    is_empty boolean DEFAULT false,
    is_testing boolean DEFAULT false,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    cutoff_at timestamp with time zone,
    stage_id bigint NOT NULL
);


--
-- Name: response_exports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.response_exports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: response_exports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.response_exports_id_seq OWNED BY public.response_exports.id;


--
-- Name: rewards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rewards (
    id bigint NOT NULL,
    prize text NOT NULL,
    points integer NOT NULL,
    start_at timestamp with time zone NOT NULL,
    end_at timestamp with time zone NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    description character varying
);


--
-- Name: rewards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rewards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rewards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rewards_id_seq OWNED BY public.rewards.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: stages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stages (
    id bigint NOT NULL,
    study_id bigint NOT NULL,
    "order" integer NOT NULL,
    config jsonb NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    available_after_days double precision DEFAULT 1.0 NOT NULL,
    duration_minutes integer DEFAULT 0 NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    status integer DEFAULT 0,
    feedback_types character varying[] DEFAULT '{}'::character varying[] NOT NULL
);


--
-- Name: stages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stages_id_seq OWNED BY public.stages.id;


--
-- Name: studies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.studies (
    id bigint NOT NULL,
    title_for_researchers character varying,
    title_for_participants character varying DEFAULT ''::character varying,
    short_description character varying DEFAULT ''::character varying,
    long_description character varying DEFAULT ''::character varying,
    opens_at timestamp with time zone,
    closes_at timestamp with time zone,
    is_mandatory boolean DEFAULT false NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    benefits character varying,
    image_id character varying,
    completed_count integer DEFAULT 0 NOT NULL,
    is_hidden boolean DEFAULT false NOT NULL,
    view_count integer DEFAULT 0,
    category character varying,
    topic character varying,
    subject character varying,
    internal_description character varying,
    target_sample_size integer,
    public_on timestamp with time zone
);


--
-- Name: studies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.studies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: studies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.studies_id_seq OWNED BY public.studies.id;


--
-- Name: study_analyses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.study_analyses (
    id bigint NOT NULL,
    study_id bigint NOT NULL,
    analysis_id bigint NOT NULL
);


--
-- Name: study_analyses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.study_analyses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: study_analyses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.study_analyses_id_seq OWNED BY public.study_analyses.id;


--
-- Name: study_researchers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.study_researchers (
    id bigint NOT NULL,
    study_id bigint NOT NULL,
    researcher_id bigint NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    role integer DEFAULT 0
);


--
-- Name: study_researchers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.study_researchers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: study_researchers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.study_researchers_id_seq OWNED BY public.study_researchers.id;


--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_preferences (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    cycle_deadlines_email boolean DEFAULT false NOT NULL,
    prize_cycle_email boolean DEFAULT false NOT NULL,
    study_available_email boolean DEFAULT false NOT NULL,
    session_available_email boolean DEFAULT true NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    has_viewed_analysis_tutorial boolean DEFAULT false
);


--
-- Name: user_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_preferences_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_preferences_id_seq OWNED BY public.user_preferences.id;


--
-- Name: active_storage_attachments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.active_storage_attachments ALTER COLUMN id SET DEFAULT nextval('public.active_storage_attachments_id_seq'::regclass);


--
-- Name: active_storage_blobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.active_storage_blobs ALTER COLUMN id SET DEFAULT nextval('public.active_storage_blobs_id_seq'::regclass);


--
-- Name: active_storage_variant_records id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.active_storage_variant_records ALTER COLUMN id SET DEFAULT nextval('public.active_storage_variant_records_id_seq'::regclass);


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: analyses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analyses ALTER COLUMN id SET DEFAULT nextval('public.analyses_id_seq'::regclass);


--
-- Name: analysis_researchers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_researchers ALTER COLUMN id SET DEFAULT nextval('public.analysis_researchers_id_seq'::regclass);


--
-- Name: analysis_run_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_run_messages ALTER COLUMN id SET DEFAULT nextval('public.analysis_run_messages_id_seq'::regclass);


--
-- Name: analysis_runs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_runs ALTER COLUMN id SET DEFAULT nextval('public.analysis_runs_id_seq'::regclass);


--
-- Name: banners id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banners ALTER COLUMN id SET DEFAULT nextval('public.banners_id_seq'::regclass);


--
-- Name: launched_stages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.launched_stages ALTER COLUMN id SET DEFAULT nextval('public.launched_stages_id_seq'::regclass);


--
-- Name: launched_studies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.launched_studies ALTER COLUMN id SET DEFAULT nextval('public.launched_studies_id_seq'::regclass);


--
-- Name: participant_metadata id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_metadata ALTER COLUMN id SET DEFAULT nextval('public.participant_metadata_id_seq'::regclass);


--
-- Name: researchers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.researchers ALTER COLUMN id SET DEFAULT nextval('public.researchers_id_seq'::regclass);


--
-- Name: response_exports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.response_exports ALTER COLUMN id SET DEFAULT nextval('public.response_exports_id_seq'::regclass);


--
-- Name: rewards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rewards ALTER COLUMN id SET DEFAULT nextval('public.rewards_id_seq'::regclass);


--
-- Name: stages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stages ALTER COLUMN id SET DEFAULT nextval('public.stages_id_seq'::regclass);


--
-- Name: studies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.studies ALTER COLUMN id SET DEFAULT nextval('public.studies_id_seq'::regclass);


--
-- Name: study_analyses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_analyses ALTER COLUMN id SET DEFAULT nextval('public.study_analyses_id_seq'::regclass);


--
-- Name: study_researchers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_researchers ALTER COLUMN id SET DEFAULT nextval('public.study_researchers_id_seq'::regclass);


--
-- Name: user_preferences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_preferences ALTER COLUMN id SET DEFAULT nextval('public.user_preferences_id_seq'::regclass);


--
-- Name: active_storage_attachments active_storage_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.active_storage_attachments
    ADD CONSTRAINT active_storage_attachments_pkey PRIMARY KEY (id);


--
-- Name: active_storage_blobs active_storage_blobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.active_storage_blobs
    ADD CONSTRAINT active_storage_blobs_pkey PRIMARY KEY (id);


--
-- Name: active_storage_variant_records active_storage_variant_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.active_storage_variant_records
    ADD CONSTRAINT active_storage_variant_records_pkey PRIMARY KEY (id);


--
-- Name: activesupport_cache_entries activesupport_cache_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activesupport_cache_entries
    ADD CONSTRAINT activesupport_cache_entries_pkey PRIMARY KEY (key);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: analyses analyses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT analyses_pkey PRIMARY KEY (id);


--
-- Name: analysis_researchers analysis_researchers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_researchers
    ADD CONSTRAINT analysis_researchers_pkey PRIMARY KEY (id);


--
-- Name: analysis_run_messages analysis_run_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_run_messages
    ADD CONSTRAINT analysis_run_messages_pkey PRIMARY KEY (id);


--
-- Name: analysis_runs analysis_runs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_runs
    ADD CONSTRAINT analysis_runs_pkey PRIMARY KEY (id);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- Name: launched_stages launched_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.launched_stages
    ADD CONSTRAINT launched_stages_pkey PRIMARY KEY (id);


--
-- Name: launched_studies launched_studies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.launched_studies
    ADD CONSTRAINT launched_studies_pkey PRIMARY KEY (id);


--
-- Name: participant_metadata participant_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_metadata
    ADD CONSTRAINT participant_metadata_pkey PRIMARY KEY (id);


--
-- Name: research_ids research_ids_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.research_ids
    ADD CONSTRAINT research_ids_pkey PRIMARY KEY (id);


--
-- Name: researchers researchers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.researchers
    ADD CONSTRAINT researchers_pkey PRIMARY KEY (id);


--
-- Name: response_exports response_exports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.response_exports
    ADD CONSTRAINT response_exports_pkey PRIMARY KEY (id);


--
-- Name: rewards rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rewards
    ADD CONSTRAINT rewards_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: stages stages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stages
    ADD CONSTRAINT stages_pkey PRIMARY KEY (id);


--
-- Name: studies studies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.studies
    ADD CONSTRAINT studies_pkey PRIMARY KEY (id);


--
-- Name: study_analyses study_analyses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_analyses
    ADD CONSTRAINT study_analyses_pkey PRIMARY KEY (id);


--
-- Name: study_researchers study_researchers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_researchers
    ADD CONSTRAINT study_researchers_pkey PRIMARY KEY (id);


--
-- Name: user_preferences user_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (id);


--
-- Name: index_active_storage_attachments_on_blob_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_active_storage_attachments_on_blob_id ON public.active_storage_attachments USING btree (blob_id);


--
-- Name: index_active_storage_attachments_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_active_storage_attachments_uniqueness ON public.active_storage_attachments USING btree (record_type, record_id, name, blob_id);


--
-- Name: index_active_storage_blobs_on_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_active_storage_blobs_on_key ON public.active_storage_blobs USING btree (key);


--
-- Name: index_active_storage_variant_records_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_active_storage_variant_records_uniqueness ON public.active_storage_variant_records USING btree (blob_id, variation_digest);


--
-- Name: index_activesupport_cache_entries_on_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activesupport_cache_entries_on_created_at ON public.activesupport_cache_entries USING btree (created_at);


--
-- Name: index_activesupport_cache_entries_on_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activesupport_cache_entries_on_expires_at ON public.activesupport_cache_entries USING btree (expires_at);


--
-- Name: index_activesupport_cache_entries_on_version; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activesupport_cache_entries_on_version ON public.activesupport_cache_entries USING btree (version);


--
-- Name: index_admins_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_admins_on_user_id ON public.admins USING btree (user_id);


--
-- Name: index_analyses_on_api_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_analyses_on_api_key ON public.analyses USING btree (api_key);


--
-- Name: index_analysis_researchers_on_analysis_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_analysis_researchers_on_analysis_id ON public.analysis_researchers USING btree (analysis_id);


--
-- Name: index_analysis_researchers_on_researcher_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_analysis_researchers_on_researcher_id ON public.analysis_researchers USING btree (researcher_id);


--
-- Name: index_analysis_run_messages_on_analysis_run_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_analysis_run_messages_on_analysis_run_id ON public.analysis_run_messages USING btree (analysis_run_id);


--
-- Name: index_analysis_runs_on_analysis_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_analysis_runs_on_analysis_id ON public.analysis_runs USING btree (analysis_id);


--
-- Name: index_analysis_runs_on_api_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_analysis_runs_on_api_key ON public.analysis_runs USING btree (api_key);


--
-- Name: index_launched_stages_on_stage_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_launched_stages_on_stage_id ON public.launched_stages USING btree (stage_id);


--
-- Name: index_launched_stages_on_user_id_and_stage_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_launched_stages_on_user_id_and_stage_id ON public.launched_stages USING btree (user_id, stage_id);


--
-- Name: index_launched_studies_on_study_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_launched_studies_on_study_id ON public.launched_studies USING btree (study_id);


--
-- Name: index_launched_studies_on_user_id_and_study_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_launched_studies_on_user_id_and_study_id ON public.launched_studies USING btree (user_id, study_id);


--
-- Name: index_participant_metadata_on_study_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_participant_metadata_on_study_id ON public.participant_metadata USING btree (study_id);


--
-- Name: index_participant_metadata_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_participant_metadata_on_user_id ON public.participant_metadata USING btree (user_id);


--
-- Name: index_research_ids_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_research_ids_on_user_id ON public.research_ids USING btree (user_id);


--
-- Name: index_researchers_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_researchers_on_user_id ON public.researchers USING btree (user_id);


--
-- Name: index_response_exports_on_stage_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_response_exports_on_stage_id ON public.response_exports USING btree (stage_id);


--
-- Name: index_stages_on_feedback_types; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_stages_on_feedback_types ON public.stages USING gin (feedback_types);


--
-- Name: index_stages_on_order_and_study_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_stages_on_order_and_study_id ON public.stages USING btree ("order", study_id);


--
-- Name: index_stages_on_study_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_stages_on_study_id ON public.stages USING btree (study_id);


--
-- Name: index_study_analyses_on_analysis_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_study_analyses_on_analysis_id ON public.study_analyses USING btree (analysis_id);


--
-- Name: index_study_analyses_on_study_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_study_analyses_on_study_id ON public.study_analyses USING btree (study_id);


--
-- Name: index_study_researchers_on_researcher_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_study_researchers_on_researcher_id ON public.study_researchers USING btree (researcher_id);


--
-- Name: index_study_researchers_on_researcher_id_and_study_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_study_researchers_on_researcher_id_and_study_id ON public.study_researchers USING btree (researcher_id, study_id);


--
-- Name: index_study_researchers_on_study_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_study_researchers_on_study_id ON public.study_researchers USING btree (study_id);


--
-- Name: index_user_preferences_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_preferences_on_user_id ON public.user_preferences USING btree (user_id);


--
-- Name: launched_studies fk_rails_17ace1f8f7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.launched_studies
    ADD CONSTRAINT fk_rails_17ace1f8f7 FOREIGN KEY (study_id) REFERENCES public.studies(id);


--
-- Name: launched_stages fk_rails_22f6332745; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.launched_stages
    ADD CONSTRAINT fk_rails_22f6332745 FOREIGN KEY (stage_id) REFERENCES public.stages(id);


--
-- Name: study_analyses fk_rails_4612cd39fb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_analyses
    ADD CONSTRAINT fk_rails_4612cd39fb FOREIGN KEY (analysis_id) REFERENCES public.analyses(id);


--
-- Name: participant_metadata fk_rails_66856d3593; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_metadata
    ADD CONSTRAINT fk_rails_66856d3593 FOREIGN KEY (study_id) REFERENCES public.studies(id);


--
-- Name: active_storage_variant_records fk_rails_993965df05; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.active_storage_variant_records
    ADD CONSTRAINT fk_rails_993965df05 FOREIGN KEY (blob_id) REFERENCES public.active_storage_blobs(id);


--
-- Name: analysis_researchers fk_rails_a9dd5a2de3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_researchers
    ADD CONSTRAINT fk_rails_a9dd5a2de3 FOREIGN KEY (researcher_id) REFERENCES public.researchers(id);


--
-- Name: study_researchers fk_rails_c259172f0c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_researchers
    ADD CONSTRAINT fk_rails_c259172f0c FOREIGN KEY (researcher_id) REFERENCES public.researchers(id);


--
-- Name: active_storage_attachments fk_rails_c3b3935057; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.active_storage_attachments
    ADD CONSTRAINT fk_rails_c3b3935057 FOREIGN KEY (blob_id) REFERENCES public.active_storage_blobs(id);


--
-- Name: study_analyses fk_rails_ca418fcf53; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_analyses
    ADD CONSTRAINT fk_rails_ca418fcf53 FOREIGN KEY (study_id) REFERENCES public.studies(id);


--
-- Name: study_researchers fk_rails_cddbb420c1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_researchers
    ADD CONSTRAINT fk_rails_cddbb420c1 FOREIGN KEY (study_id) REFERENCES public.studies(id);


--
-- Name: analysis_researchers fk_rails_dafb260cc2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_researchers
    ADD CONSTRAINT fk_rails_dafb260cc2 FOREIGN KEY (analysis_id) REFERENCES public.analyses(id);


--
-- Name: stages fk_rails_e8e18d02fd; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stages
    ADD CONSTRAINT fk_rails_e8e18d02fd FOREIGN KEY (study_id) REFERENCES public.studies(id);


--
-- Name: response_exports fk_rails_eef903b740; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.response_exports
    ADD CONSTRAINT fk_rails_eef903b740 FOREIGN KEY (stage_id) REFERENCES public.stages(id);


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO "schema_migrations" (version) VALUES
('20210618163926'),
('20210618164053'),
('20210618181410'),
('20210618181948'),
('20210618182731'),
('20210618182920'),
('20210618183842'),
('20210916155137'),
('20211018140839'),
('20211129180319'),
('20220110162620'),
('20220303160442'),
('20220407193306'),
('20220408162010'),
('20220810173840'),
('20220817161302'),
('20220824152243'),
('20220831143454'),
('20220912181638'),
('20221020135148'),
('20221129153239'),
('20221129161350'),
('20221129202926'),
('20221129224957'),
('20230109200606'),
('20230130155253'),
('20230216162207'),
('20230404161002'),
('20230421153444'),
('20230524011047'),
('20230616223657'),
('20230626173336'),
('20230712163112'),
('20230726142755'),
('20230808163159'),
('20230905121510');


