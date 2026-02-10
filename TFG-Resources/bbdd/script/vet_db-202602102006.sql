--
-- PostgreSQL database dump
--

\restrict AW1ylUO0r88xUMfqf3ATQ7pXytbyCULZSaC915psddao8virIy8N0P5qvXfR03s

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 18.1

-- Started on 2026-02-10 20:06:43

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

DROP DATABASE vet_db;
--
-- TOC entry 3511 (class 1262 OID 16384)
-- Name: vet_db; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE vet_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


\unrestrict AW1ylUO0r88xUMfqf3ATQ7pXytbyCULZSaC915psddao8virIy8N0P5qvXfR03s
\connect vet_db
\restrict AW1ylUO0r88xUMfqf3ATQ7pXytbyCULZSaC915psddao8virIy8N0P5qvXfR03s

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
-- TOC entry 852 (class 1247 OID 16389)
-- Name: rol_usuario; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.rol_usuario AS ENUM (
    'cliente',
    'veterinario',
    'admin'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 16444)
-- Name: chat; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat (
    id integer NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado character varying(20) DEFAULT 'abierto'::character varying,
    cliente_id integer,
    veterinario_id integer
);


--
-- TOC entry 220 (class 1259 OID 16443)
-- Name: chat_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3512 (class 0 OID 0)
-- Dependencies: 220
-- Name: chat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_id_seq OWNED BY public.chat.id;


--
-- TOC entry 219 (class 1259 OID 16420)
-- Name: citas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.citas (
    id integer NOT NULL,
    fecha timestamp without time zone NOT NULL,
    tipo character varying(50),
    motivo text,
    mascota_id integer,
    veterinario_id integer,
    cliente_id integer
);


--
-- TOC entry 218 (class 1259 OID 16419)
-- Name: citas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.citas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3513 (class 0 OID 0)
-- Dependencies: 218
-- Name: citas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.citas_id_seq OWNED BY public.citas.id;


--
-- TOC entry 227 (class 1259 OID 16501)
-- Name: enfermedades; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enfermedades (
    id integer NOT NULL,
    historial_id integer,
    fecha_diagnostico date,
    fecha_alta date,
    observaciones text,
    veterinario_id integer
);


--
-- TOC entry 226 (class 1259 OID 16500)
-- Name: enfermedades_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.enfermedades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3514 (class 0 OID 0)
-- Dependencies: 226
-- Name: enfermedades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.enfermedades_id_seq OWNED BY public.enfermedades.id;


--
-- TOC entry 225 (class 1259 OID 16484)
-- Name: historial; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.historial (
    id integer NOT NULL,
    mascota_id integer,
    observaciones text,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 224 (class 1259 OID 16483)
-- Name: historial_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.historial_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3515 (class 0 OID 0)
-- Dependencies: 224
-- Name: historial_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.historial_id_seq OWNED BY public.historial.id;


--
-- TOC entry 217 (class 1259 OID 16408)
-- Name: mascotas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mascotas (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    animal character varying(50) NOT NULL,
    raza character varying(50),
    edad integer,
    peso numeric(5,2),
    usuario_id integer
);


--
-- TOC entry 216 (class 1259 OID 16407)
-- Name: mascotas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mascotas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 216
-- Name: mascotas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mascotas_id_seq OWNED BY public.mascotas.id;


--
-- TOC entry 223 (class 1259 OID 16463)
-- Name: mensajes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mensajes (
    id integer NOT NULL,
    chat_id integer,
    usuario_id integer,
    mensaje text NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    leido boolean DEFAULT false
);


--
-- TOC entry 222 (class 1259 OID 16462)
-- Name: mensajes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mensajes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3517 (class 0 OID 0)
-- Dependencies: 222
-- Name: mensajes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mensajes_id_seq OWNED BY public.mensajes.id;


--
-- TOC entry 215 (class 1259 OID 16396)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido1 character varying(100) NOT NULL,
    apellido2 character varying(100),
    email character varying(150) NOT NULL,
    "contraseña" character varying(255) NOT NULL,
    rol public.rol_usuario DEFAULT 'cliente'::public.rol_usuario
);


--
-- TOC entry 214 (class 1259 OID 16395)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3518 (class 0 OID 0)
-- Dependencies: 214
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 229 (class 1259 OID 16520)
-- Name: vacunas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vacunas (
    id integer NOT NULL,
    historial_id integer,
    nombre character varying(100) NOT NULL,
    "descripción" text,
    periodicidad character varying(50),
    fecha_aplicacion date DEFAULT CURRENT_DATE
);


--
-- TOC entry 228 (class 1259 OID 16519)
-- Name: vacunas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vacunas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 228
-- Name: vacunas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vacunas_id_seq OWNED BY public.vacunas.id;


--
-- TOC entry 3305 (class 2604 OID 16447)
-- Name: chat id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat ALTER COLUMN id SET DEFAULT nextval('public.chat_id_seq'::regclass);


--
-- TOC entry 3304 (class 2604 OID 16423)
-- Name: citas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.citas ALTER COLUMN id SET DEFAULT nextval('public.citas_id_seq'::regclass);


--
-- TOC entry 3313 (class 2604 OID 16504)
-- Name: enfermedades id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enfermedades ALTER COLUMN id SET DEFAULT nextval('public.enfermedades_id_seq'::regclass);


--
-- TOC entry 3311 (class 2604 OID 16487)
-- Name: historial id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historial ALTER COLUMN id SET DEFAULT nextval('public.historial_id_seq'::regclass);


--
-- TOC entry 3303 (class 2604 OID 16411)
-- Name: mascotas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mascotas ALTER COLUMN id SET DEFAULT nextval('public.mascotas_id_seq'::regclass);


--
-- TOC entry 3308 (class 2604 OID 16466)
-- Name: mensajes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensajes ALTER COLUMN id SET DEFAULT nextval('public.mensajes_id_seq'::regclass);


--
-- TOC entry 3301 (class 2604 OID 16399)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 3314 (class 2604 OID 16523)
-- Name: vacunas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vacunas ALTER COLUMN id SET DEFAULT nextval('public.vacunas_id_seq'::regclass);


--
-- TOC entry 3497 (class 0 OID 16444)
-- Dependencies: 221
-- Data for Name: chat; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3495 (class 0 OID 16420)
-- Dependencies: 219
-- Data for Name: citas; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3503 (class 0 OID 16501)
-- Dependencies: 227
-- Data for Name: enfermedades; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3501 (class 0 OID 16484)
-- Dependencies: 225
-- Data for Name: historial; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3493 (class 0 OID 16408)
-- Dependencies: 217
-- Data for Name: mascotas; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3499 (class 0 OID 16463)
-- Dependencies: 223
-- Data for Name: mensajes; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3491 (class 0 OID 16396)
-- Dependencies: 215
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3505 (class 0 OID 16520)
-- Dependencies: 229
-- Data for Name: vacunas; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 220
-- Name: chat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_id_seq', 1, false);


--
-- TOC entry 3521 (class 0 OID 0)
-- Dependencies: 218
-- Name: citas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.citas_id_seq', 1, false);


--
-- TOC entry 3522 (class 0 OID 0)
-- Dependencies: 226
-- Name: enfermedades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.enfermedades_id_seq', 1, false);


--
-- TOC entry 3523 (class 0 OID 0)
-- Dependencies: 224
-- Name: historial_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.historial_id_seq', 1, false);


--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 216
-- Name: mascotas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mascotas_id_seq', 1, false);


--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 222
-- Name: mensajes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mensajes_id_seq', 1, false);


--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 214
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, false);


--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 228
-- Name: vacunas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.vacunas_id_seq', 1, false);


--
-- TOC entry 3325 (class 2606 OID 16451)
-- Name: chat chat_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (id);


--
-- TOC entry 3323 (class 2606 OID 16427)
-- Name: citas citas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_pkey PRIMARY KEY (id);


--
-- TOC entry 3333 (class 2606 OID 16508)
-- Name: enfermedades enfermedades_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enfermedades
    ADD CONSTRAINT enfermedades_pkey PRIMARY KEY (id);


--
-- TOC entry 3329 (class 2606 OID 16494)
-- Name: historial historial_mascota_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historial
    ADD CONSTRAINT historial_mascota_id_key UNIQUE (mascota_id);


--
-- TOC entry 3331 (class 2606 OID 16492)
-- Name: historial historial_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historial
    ADD CONSTRAINT historial_pkey PRIMARY KEY (id);


--
-- TOC entry 3321 (class 2606 OID 16413)
-- Name: mascotas mascotas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mascotas
    ADD CONSTRAINT mascotas_pkey PRIMARY KEY (id);


--
-- TOC entry 3327 (class 2606 OID 16472)
-- Name: mensajes mensajes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensajes
    ADD CONSTRAINT mensajes_pkey PRIMARY KEY (id);


--
-- TOC entry 3317 (class 2606 OID 16406)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 3319 (class 2606 OID 16404)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 3335 (class 2606 OID 16528)
-- Name: vacunas vacunas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vacunas
    ADD CONSTRAINT vacunas_pkey PRIMARY KEY (id);


--
-- TOC entry 3340 (class 2606 OID 16452)
-- Name: chat chat_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.usuarios(id);


--
-- TOC entry 3341 (class 2606 OID 16457)
-- Name: chat chat_veterinario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_veterinario_id_fkey FOREIGN KEY (veterinario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 3337 (class 2606 OID 16438)
-- Name: citas citas_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.usuarios(id);


--
-- TOC entry 3338 (class 2606 OID 16428)
-- Name: citas citas_mascota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_mascota_id_fkey FOREIGN KEY (mascota_id) REFERENCES public.mascotas(id) ON DELETE CASCADE;


--
-- TOC entry 3339 (class 2606 OID 16433)
-- Name: citas citas_veterinario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_veterinario_id_fkey FOREIGN KEY (veterinario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 3345 (class 2606 OID 16509)
-- Name: enfermedades enfermedades_historial_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enfermedades
    ADD CONSTRAINT enfermedades_historial_id_fkey FOREIGN KEY (historial_id) REFERENCES public.historial(id) ON DELETE CASCADE;


--
-- TOC entry 3346 (class 2606 OID 16514)
-- Name: enfermedades enfermedades_veterinario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enfermedades
    ADD CONSTRAINT enfermedades_veterinario_id_fkey FOREIGN KEY (veterinario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 3344 (class 2606 OID 16495)
-- Name: historial historial_mascota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historial
    ADD CONSTRAINT historial_mascota_id_fkey FOREIGN KEY (mascota_id) REFERENCES public.mascotas(id) ON DELETE CASCADE;


--
-- TOC entry 3336 (class 2606 OID 16414)
-- Name: mascotas mascotas_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mascotas
    ADD CONSTRAINT mascotas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 3342 (class 2606 OID 16473)
-- Name: mensajes mensajes_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensajes
    ADD CONSTRAINT mensajes_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chat(id) ON DELETE CASCADE;


--
-- TOC entry 3343 (class 2606 OID 16478)
-- Name: mensajes mensajes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensajes
    ADD CONSTRAINT mensajes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 3347 (class 2606 OID 16529)
-- Name: vacunas vacunas_historial_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vacunas
    ADD CONSTRAINT vacunas_historial_id_fkey FOREIGN KEY (historial_id) REFERENCES public.historial(id) ON DELETE CASCADE;


-- Completed on 2026-02-10 20:06:44

--
-- PostgreSQL database dump complete
--

\unrestrict AW1ylUO0r88xUMfqf3ATQ7pXytbyCULZSaC915psddao8virIy8N0P5qvXfR03s

