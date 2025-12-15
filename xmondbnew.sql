--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-12-15 10:14:01

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
-- TOC entry 2 (class 3079 OID 16637)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 895 (class 1247 OID 16675)
-- Name: role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role_enum AS ENUM (
    'admin',
    'worker'
);


ALTER TYPE public.role_enum OWNER TO postgres;

--
-- TOC entry 277 (class 1255 OID 33018)
-- Name: get_stocked_summary(); Type: FUNCTION; Schema: public; Owner: xmo-dev
--

CREATE FUNCTION public.get_stocked_summary() RETURNS TABLE(current_total bigint, percentage_change numeric, difference bigint)
    LANGUAGE plpgsql
    AS $$
DECLARE
  current_month INT := EXTRACT(MONTH FROM CURRENT_DATE);
  current_year INT := EXTRACT(YEAR FROM CURRENT_DATE);
  first_month INT := 1; -- Starting month
  first_year INT := EXTRACT(YEAR FROM CURRENT_DATE); -- Starting year
  first_total BIGINT;
BEGIN
  -- Get the current total (sum of all parts)
  SELECT COALESCE(SUM(quantity), 0) INTO current_total
  FROM transaction_history
  WHERE status = 'stocked'
    AND EXTRACT(MONTH FROM created_at) <= current_month
    AND EXTRACT(YEAR FROM created_at) <= current_year;

  -- Get the first month's total
  SELECT COALESCE(SUM(quantity), 0) INTO first_total
  FROM transaction_history
  WHERE status = 'stocked'
    AND EXTRACT(MONTH FROM created_at) < current_month
    AND EXTRACT(YEAR FROM created_at) <= current_year;

  -- Calculate and return separate columns
  IF first_total = 0 THEN
    percentage_change := 0;
    difference := current_total;
  ELSE
    percentage_change := ROUND(((current_total - first_total)::NUMERIC / first_total::NUMERIC) * 100, 2);
    difference := current_total - first_total;
  END IF;

  RETURN NEXT;
END;
$$;


ALTER FUNCTION public.get_stocked_summary() OWNER TO "xmo-dev";

--
-- TOC entry 276 (class 1255 OID 33017)
-- Name: get_stocked_summary(integer, integer); Type: FUNCTION; Schema: public; Owner: xmo-dev
--

CREATE FUNCTION public.get_stocked_summary(current_month integer, current_year integer) RETURNS TABLE(current_total numeric, percentage_change numeric, difference numeric)
    LANGUAGE plpgsql
    AS $$
DECLARE
  first_total NUMERIC;
BEGIN
  -- Get the current total (sum of all parts)
  SELECT COALESCE(SUM(quantity), 0) INTO current_total
  FROM transaction_history
  WHERE status = 'stocked'
    AND EXTRACT(MONTH FROM created_at) <= current_month
    AND EXTRACT(YEAR FROM created_at) <= current_year;

  -- Get the first month's total (or any starting point you prefer)
  SELECT COALESCE(SUM(quantity), 0) INTO first_total
  FROM transaction_history
  WHERE status = 'stocked'
    AND EXTRACT(MONTH FROM created_at) < current_month
    AND EXTRACT(YEAR FROM created_at) <= current_year;

  -- Calculate percentage change and difference
  IF first_total = 0 THEN
    RETURN QUERY SELECT current_total, 0::NUMERIC, current_total;
  ELSE
    RETURN QUERY SELECT 
      current_total,
      ROUND(((current_total - first_total) / first_total) * 100, 2),
      current_total - first_total;
  END IF;
END;
$$;


ALTER FUNCTION public.get_stocked_summary(current_month integer, current_year integer) OWNER TO "xmo-dev";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 227 (class 1259 OID 33025)
-- Name: email_history; Type: TABLE; Schema: public; Owner: xmo-dev
--

CREATE TABLE public.email_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.email_history OWNER TO "xmo-dev";

--
-- TOC entry 228 (class 1259 OID 33032)
-- Name: email_transaction; Type: TABLE; Schema: public; Owner: xmo-dev
--

CREATE TABLE public.email_transaction (
    email_id uuid,
    transaction_id uuid
);


ALTER TABLE public.email_transaction OWNER TO "xmo-dev";

--
-- TOC entry 218 (class 1259 OID 16679)
-- Name: inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lot_no text NOT NULL,
    quantity integer
);


ALTER TABLE public.inventory OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16685)
-- Name: parts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parts (
    lot_no text NOT NULL,
    stock_no text,
    product_code text,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.parts OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16692)
-- Name: parts_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parts_location (
    lot_no text NOT NULL,
    warehouse_id uuid NOT NULL
);


ALTER TABLE public.parts_location OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16697)
-- Name: recipients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    isactive boolean DEFAULT true NOT NULL
);


ALTER TABLE public.recipients OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16702)
-- Name: transaction_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lot_no character varying(50) NOT NULL,
    status text,
    quantity integer,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.transaction_history OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 33019)
-- Name: transaction_image; Type: TABLE; Schema: public; Owner: xmo-dev
--

CREATE TABLE public.transaction_image (
    id uuid,
    "imgUrl" text,
    created_at date DEFAULT now()
);


ALTER TABLE public.transaction_image OWNER TO "xmo-dev";

--
-- TOC entry 223 (class 1259 OID 16709)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(100) NOT NULL,
    role public.role_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16715)
-- Name: warehouse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouse (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    location character varying(100) NOT NULL,
    warehouse character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.warehouse OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16720)
-- Name: worker_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.worker_location (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    warehouse_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.worker_location OWNER TO postgres;

--
-- TOC entry 4973 (class 0 OID 33025)
-- Dependencies: 227
-- Data for Name: email_history; Type: TABLE DATA; Schema: public; Owner: xmo-dev
--

COPY public.email_history (id, created_at) FROM stdin;
1935822d-2426-4eb2-b8e3-e2e886fc84fb	2025-07-01 05:53:53.3575+08
27ed2299-d334-4da1-abf3-adbde4347b00	2025-06-19 05:53:53.336265+08
6218c507-d5f0-47d2-aff0-9fc854e3dffd	2025-05-21 13:24:21.807793+08
62915950-0d65-47ec-ab5d-8d829bc88170	2025-06-03 05:47:41.154438+08
726adfea-8656-4a2c-8a3a-ff881f9448c9	2025-05-31 05:48:42.389967+08
73e3fa90-521d-4782-8442-3d26204ea98a	2025-06-10 05:47:40.269688+08
7fb740cd-10ea-471e-b0e3-28a54e74d578	2025-05-28 06:38:50.779422+08
cbd23624-2eca-4c7f-9e66-a4c6776dbdae	2025-05-19 07:56:04.101109+08
d0b3ac96-ef2d-42c3-ab96-d599a89808a4	2025-05-19 13:54:21.325168+08
ef640623-5798-416e-8256-896aa0268978	2025-08-27 05:06:49.370914+08
\.


--
-- TOC entry 4974 (class 0 OID 33032)
-- Dependencies: 228
-- Data for Name: email_transaction; Type: TABLE DATA; Schema: public; Owner: xmo-dev
--

COPY public.email_transaction (email_id, transaction_id) FROM stdin;
1935822d-2426-4eb2-b8e3-e2e886fc84fb	71a92c87-b7a2-4ac0-828a-fd9dc1d4dbf6
1935822d-2426-4eb2-b8e3-e2e886fc84fb	bec976ba-7cb1-4d83-86e1-7121e25874b0
1935822d-2426-4eb2-b8e3-e2e886fc84fb	d83469bf-db91-4583-bcab-9657d4ce9ccd
1935822d-2426-4eb2-b8e3-e2e886fc84fb	ed66c98e-f697-4fd7-89bf-7042ed8ac3a8
27ed2299-d334-4da1-abf3-adbde4347b00	78cb36e6-2224-4655-b662-e6658039c5e8
27ed2299-d334-4da1-abf3-adbde4347b00	989fa080-b3f9-47ee-aef4-0311784030b4
27ed2299-d334-4da1-abf3-adbde4347b00	d6d14a78-d262-40b3-8943-1079564c2817
6218c507-d5f0-47d2-aff0-9fc854e3dffd	47b39b08-f710-4abb-9978-ab894a0d41cc
6218c507-d5f0-47d2-aff0-9fc854e3dffd	6a24bf09-dad1-448e-9d06-308bc3eb9ef0
6218c507-d5f0-47d2-aff0-9fc854e3dffd	b4fa5432-620a-4c09-a3a7-ec56bd6c6136
6218c507-d5f0-47d2-aff0-9fc854e3dffd	da6bd8fb-369c-480d-920d-a53ef488b68c
62915950-0d65-47ec-ab5d-8d829bc88170	0c269881-64c5-4859-a457-aeb64fc35d7b
62915950-0d65-47ec-ab5d-8d829bc88170	30a9fde0-16ed-4106-b384-987b8007fddb
726adfea-8656-4a2c-8a3a-ff881f9448c9	5742171a-e03b-44db-ace6-b9400f93d68f
726adfea-8656-4a2c-8a3a-ff881f9448c9	b02d9037-b85a-49e6-8a38-11ee09d23f88
73e3fa90-521d-4782-8442-3d26204ea98a	4649a816-c70d-4712-a9ad-51baadd37773
\.


--
-- TOC entry 4964 (class 0 OID 16679)
-- Dependencies: 218
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory (id, lot_no, quantity) FROM stdin;
cebc8867-0c17-442c-a78a-3e5cbb6d5af2	01578560008100	200
46806e98-0d21-4162-ad15-577998c19b69	01578560030700	150
eca37035-5ff7-4e48-b753-2ae97d9c0f73	01578560051625\n 	4000
11955cdd-f638-488f-9e82-cba6ccf25bb7	01578560061245	1000
7ef546e0-5bc6-4093-b74d-3404dc6c76bf	01578560099999	400
3cc3f4c0-59ae-484c-a147-fd116fa7ee91	01578560190525\n 	1000
fbf29f00-ab81-489d-9e85-13eb8cb93ab9	01578560200525	450
0b657886-779e-47a1-aa58-ce003ca7e95f	01578560210525	1000
36d09134-85ad-4714-a9e0-c9ed27224e65	01578560220525	750
973c43c2-cae7-4d3e-899b-0abf499bcfdb	01578562210525	200
ace64802-2877-4d67-b183-dd89ccaef3df	01578562220525	350
2c908376-88ec-4a38-afe1-a2cc75bfdb50	01603433000001	25
249ee580-7012-45aa-9a52-ed318732a268	01707386000001	0
d801e082-9a10-4ee1-a1cb-c9d36637ed9b	01717899	1
97b36668-ba5f-4a4e-b79e-a190f6701559	01719928000101	18
95c7c8e0-e8f2-41cf-aacd-7e706d8b2a99	01730199010101	2
16bfbb51-48a0-43ef-940c-f4ca3f97b761	01730200000001	0
cb682726-c6d3-428e-9d37-5ec4858195da	01738345000001	9
30672116-c79b-4cee-b123-a2da6bddb807	01578560005430	300
e10874db-a65a-4b7c-8e92-f2c0ea711a32	01730203000001	0
c39f3fbb-4b93-418b-b9d5-f0c4537200a3	01578560150526	250
062e5155-c584-4a8c-8db0-868c61171f32	LOT123	60
57bf26f8-b838-4aeb-9a69-9b3467428cb0	317MW97	0
c9dfd1ad-dd2d-403d-9fe5-d7a199c951a6	01578560150525	1000
\.


--
-- TOC entry 4965 (class 0 OID 16685)
-- Dependencies: 219
-- Data for Name: parts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parts (lot_no, stock_no, product_code, description, created_at, updated_at) FROM stdin;
01578560005430	31379-05430	CS	Circular Saw RCS	2025-05-16 07:38:15.303124+08	2025-05-16 07:38:15.303124+08
01578560008100	31379-08500	DB	Drill Bit x500	2025-05-16 07:42:02.44624+08	2025-05-16 07:42:02.44624+08
01578560030700	31379-00049	ED	Electric Driller x7000	2025-05-16 07:33:47.578107+08	2025-05-16 07:33:47.578107+08
01578560051625\n 	31379-51625	SD	Screwdriver ドライバー	2025-05-16 10:13:03.301671+08	2025-05-16 10:13:03.301671+08
01578560061245	31379-61245	XW	Cross Screw	2025-05-16 07:59:07.617973+08	2025-05-16 07:59:07.617973+08
01578560099999	31379-99999	HN	Hex Nut	2025-05-16 07:42:01.104749+08	2025-05-16 07:42:01.104749+08
01578560150525	31379-51525	DB	Drill Bit ドリルビット	2025-05-30 08:05:21.629348+08	2025-05-30 08:05:21.629348+08
01578560150526	31379-51525	DB	Drill Bit	2025-05-30 08:05:23.459129+08	2025-05-30 08:05:23.459129+08
01578560190525\n 	31379-51925	DB	Axle Tool	2025-05-19 15:04:45.307017+08	2025-05-19 15:04:45.307017+08
01578560200525	31379-52025	DB	Drill Bit	2025-05-20 06:42:27.106886+08	2025-05-20 06:42:27.106886+08
01578560210525	31379-52125	PS	Power Saw 	2025-05-21 12:46:14.372892+08	2025-05-21 12:46:14.372892+08
01578560220525	31379-52225	SD	Screw Driver	2025-05-22 07:45:17.304929+08	2025-05-22 07:45:17.304929+08
01578562210525	31379-52125	PS	Power Saw 	2025-05-21 13:44:02.276373+08	2025-05-21 13:44:02.276373+08
01578562220525	31379-52225	SD	Screw Driver	2025-05-22 15:43:22.454554+08	2025-05-22 15:43:22.454554+08
01603433000001	81002-405B_NB	DG	【12V/18V/18T】【新型】注文仕様書、シリンダーコントローララック	2025-06-18 10:44:23.991072+08	2025-06-18 10:44:23.991072+08
01707386000001	31565-00871_R01_NB	DG	【18T】ピストン	2025-06-18 10:50:28.657922+08	2025-06-18 10:50:28.657922+08
01717899	11062-00439	DG	【18V/18T】クランク軸組立	2025-06-02 17:15:05.898532+08	2025-06-02 17:15:05.898532+08
01719928000101	31281-00537_R08_NB	DG	【12V/18V/18T】シリンダライナ、　	2025-06-30 12:35:53.861935+08	2025-06-30 12:35:53.861935+08
01730199010101	31095-06772_NB	DG	【18T】カバー、ケーシング蓋	2025-06-18 10:45:45.80659+08	2025-06-18 10:45:45.80659+08
01730200000001	31104-32042	DG	【18T】管、高圧過給機空気入口管	2025-06-09 13:48:31.148714+08	2025-06-09 13:48:31.148714+08
01730203000001	81002-41923_R00_NB	DG	【18V/18T】注文仕様書、潤滑油主こし器	2025-06-30 13:12:23.079238+08	2025-06-30 13:12:23.079238+08
01738345000001	31165-00049	DG	【12V/18V/18T】給気管	2025-06-09 13:24:48.080324+08	2025-06-09 13:24:48.080324+08
317MW97	81002-26206	DG	【18T(50Hz)】注文仕様書、過給機（ＴＣＸ２３）	2025-06-02 17:23:28.560821+08	2025-06-02 17:23:28.560821+08
LOT123	STOCK	PCODE	Description	2025-11-28 13:04:03.403431+08	2025-11-28 13:04:03.403431+08
\.


--
-- TOC entry 4966 (class 0 OID 16692)
-- Dependencies: 220
-- Data for Name: parts_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parts_location (lot_no, warehouse_id) FROM stdin;
01578560005430	6939e940-7c6f-48b3-8393-964623175c24
01578560008100	4ac922c7-67ae-48b6-8a41-e582253ce4f9
01578560030700	6939e940-7c6f-48b3-8393-964623175c24
01578560051625\n 	6939e940-7c6f-48b3-8393-964623175c24
01578560061245	e3d2eaf4-5a6d-4dd6-8a33-f182a097b1d2
01578560099999	4ac922c7-67ae-48b6-8a41-e582253ce4f9
01578560150525	6939e940-7c6f-48b3-8393-964623175c24
01578560150526	6939e940-7c6f-48b3-8393-964623175c24
01578560190525\n 	4ac922c7-67ae-48b6-8a41-e582253ce4f9
01578560200525	4ac922c7-67ae-48b6-8a41-e582253ce4f9
01578560210525	6939e940-7c6f-48b3-8393-964623175c24
01578560220525	4ac922c7-67ae-48b6-8a41-e582253ce4f9
01578562210525	4ac922c7-67ae-48b6-8a41-e582253ce4f9
01578562220525	4ac922c7-67ae-48b6-8a41-e582253ce4f9
01603433000001	6939e940-7c6f-48b3-8393-964623175c24
01707386000001	e3d2eaf4-5a6d-4dd6-8a33-f182a097b1d2
01717899	4ac922c7-67ae-48b6-8a41-e582253ce4f9
01719928000101	4ac922c7-67ae-48b6-8a41-e582253ce4f9
01730199010101	6939e940-7c6f-48b3-8393-964623175c24
01730200000001	e3d2eaf4-5a6d-4dd6-8a33-f182a097b1d2
01730203000001	4ac922c7-67ae-48b6-8a41-e582253ce4f9
01738345000001	6939e940-7c6f-48b3-8393-964623175c24
317MW97	a2f3f8bf-f428-410f-a12b-8304affd7dcf
LOT123	6939e940-7c6f-48b3-8393-964623175c24
\.


--
-- TOC entry 4967 (class 0 OID 16697)
-- Dependencies: 221
-- Data for Name: recipients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipients (id, email, created_at, isactive) FROM stdin;
5a901101-9f1a-4891-a483-3e4a131d78b4	tagumpayfund@gmail.com	2025-03-17 09:27:06.632884+08	f
2078b388-c749-4fd2-a32c-68f03eb32de7	kyomu442@gmail.com	2025-11-04 09:53:27.243133+08	f
32c7c1ba-4df8-42da-8807-2c783aff9c18	admin25@gmail.com	2025-11-04 09:42:30.381704+08	f
3fc31b6f-080b-4abf-bab8-381f0c9727e3	kyomu4224@gmail.com	2025-11-04 09:53:52.363728+08	f
67ecb516-9ff8-4467-8ce1-e406d91f7cab	kyomu4224@gmail.com	2025-11-04 09:54:57.563961+08	f
162a1a27-7e18-46e6-bb93-1caec3751f23	admin24@gmail.com	2025-11-04 09:43:25.436915+08	f
bd6b288d-29e3-45af-bdc8-e7bfa0207211	kikuchi_s@global.kawasaki.com	2025-06-30 15:10:49.568026+08	f
7615c3dd-2a69-4627-a7b0-d3637777bf5a	rivas-kdt@global.kawasaki.com	2025-04-22 13:05:46.634547+08	t
70335e9e-f5a5-4c40-873b-5997d089e039	25@gmail.com	2025-11-04 12:06:43.85322+08	f
72cacfb3-2556-4d9d-9bcb-4875c330e563	admin23@gmail.com	2025-11-04 09:49:52.139445+08	f
265eb2fc-d657-4155-b15b-211a68c795ab	rivasedricjay@gmail.com	2025-05-19 13:53:02.764882+08	t
e15ec8e7-2350-4b93-bdce-095585b4f471	joshuatanedo7@gmail.com	2025-05-27 11:42:51+08	t
3af954e8-c010-4524-b5cd-7cb4e743bc43	testing@gmail.com	2025-12-12 08:32:15.798628+08	f
d9d6fbd9-1f02-4470-82b1-3eb856d4da79	Test123@gmail.com	2025-12-12 08:39:03.460279+08	t
\.


--
-- TOC entry 4968 (class 0 OID 16702)
-- Dependencies: 222
-- Data for Name: transaction_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transaction_history (id, lot_no, status, quantity, created_at) FROM stdin;
0c269881-64c5-4859-a457-aeb64fc35d7b	317MW97	stocked	1	2025-06-02 17:23:30.754517+08
107aba34-5f32-42a9-9356-94f7f23d0366	01578560190525\n 	stocked	500	2025-05-19 15:31:56.362242+08
13ec99ef-64c4-4d1c-9557-218620a646bc	01578560200525	stocked	500	2025-05-20 06:42:28.61621+08
152b296c-2e1e-4c8b-837a-1378b4a7c41e	01578560051625\n 	shipped	900	2025-05-27 10:14:18+08
2e82a22f-7089-4f94-91d2-d60e280daba9	01578560030700	shipped	100	2025-05-20 12:27:31.021717+08
30a9fde0-16ed-4106-b384-987b8007fddb	01717899	stocked	1	2025-06-02 17:15:09.170547+08
322d99d8-8434-4f39-90f7-bd7372292a2b	01578560008100	stocked	250	2025-05-16 07:42:03.07881+08
37704b67-5758-47ce-b11a-baa2ae22c12c	01578560008100	shipped	50	2025-05-16 07:47:45.021676+08
3dab01f1-8c70-4fbd-abf2-4d0a3dee2037	01578560099999	stocked	500	2025-05-16 07:42:01.75179+08
401ae72c-b285-4430-b1ea-b26682a4a77f	01578560030700	stocked	250	2025-04-16 07:33:48.235356+08
4649a816-c70d-4712-a9ad-51baadd37773	01730200000001	stocked	1	2025-06-09 13:48:34.294141+08
47b39b08-f710-4abb-9978-ab894a0d41cc	01578560051625\n 	shipped	32	2025-05-21 12:42:33.375113+08
5061a2df-94f3-4625-8d50-4f9dfbda5403	01578560190525\n 	stocked	500	2025-05-19 15:04:46.003838+08
5742171a-e03b-44db-ace6-b9400f93d68f	01578560150526	stocked	500	2025-05-30 08:05:24.264241+08
5cc44eef-8c45-4e0e-8d0b-1a2739d829a0	01578560220525	shipped	250	2025-05-22 08:11:31.731+08
5d9de10f-ff89-40b4-9407-c8ef7307bd89	01578562210525	shipped	50	2025-05-22 07:29:37.520563+08
6a24bf09-dad1-448e-9d06-308bc3eb9ef0	01578560210525	stocked	500	2025-05-21 13:17:41.802043+08
71a92c87-b7a2-4ac0-828a-fd9dc1d4dbf6	01707386000001	shipped	9	2025-06-30 13:59:33.280118+08
722acd84-ae86-4a81-a61c-6cc0317eefa6	01738345000001	stocked	9	2025-06-09 13:24:49.696762+08
73ff0f50-a70d-4684-8926-4b1eb6f1c193	01578560051625\n 	shipped	50	2025-05-20 10:50:16.747157+08
78cb36e6-2224-4655-b662-e6658039c5e8	01707386000001	stocked	18	2025-06-18 10:50:31.784053+08
8b4ab1fa-d3c4-4283-9e0e-60ad2365ea32	01578560099999	shipped	100	2025-05-16 07:47:44.126177+08
8e16881f-a2ae-49ef-a50a-2e203e1c7a7d	01578560051625\n 	stocked	10000	2025-05-16 10:13:05.83169+08
9643f208-c683-4d05-b16d-315dca4964a2	01578560005430	stocked	325	2025-05-16 07:38:15.95254+08
989fa080-b3f9-47ee-aef4-0311784030b4	01730199010101	stocked	2	2025-06-18 10:45:48.966306+08
9ec3256e-22d6-4307-82b9-4af868d570d0	01578560061245	stocked	1000	2025-05-19 10:37:08+08
a2282ec7-00e6-4e73-b2ee-0ccf77313141	01578560200525	stocked	100	2025-05-20 12:23:48.67523+08
ac96fc9a-db9c-4cdd-8357-f8178e1ece02	01578562220525	shipped	150	2025-05-22 15:44:40.173877+08
ae59da9c-1d1d-4583-ba4f-495efc931735	01578560051625\n 	shipped	5000	2025-05-18 10:14:43+08
b02d9037-b85a-49e6-8a38-11ee09d23f88	01578560150525	stocked	200	2025-05-30 08:05:22.414827+08
b4fa5432-620a-4c09-a3a7-ec56bd6c6136	01578560051625\n 	shipped	18	2025-05-21 12:42:52.567729+08
bc5bc238-6cf4-47f6-82b9-3a224830b7d6	01578562210525	shipped	250	2025-05-21 13:45:28.038124+08
bec976ba-7cb1-4d83-86e1-7121e25874b0	01707386000001	shipped	9	2025-06-30 14:00:09.027159+08
c821ff65-7574-41c7-b847-361331857305	01578560200525	stocked	100	2025-05-20 12:26:46.178265+08
d6d14a78-d262-40b3-8943-1079564c2817	01603433000001	stocked	25	2025-06-18 10:44:27.167565+08
d7eedac2-7812-4427-af33-d37844efa2eb	01578562220525	stocked	500	2025-05-22 15:43:23.186699+08
d83469bf-db91-4583-bcab-9657d4ce9ccd	01730203000001	stocked	1	2025-06-30 13:12:26.31211+08
da6bd8fb-369c-480d-920d-a53ef488b68c	01578560210525	stocked	500	2025-05-21 12:46:15.898354+08
dc046d82-b591-4bcc-b73d-66ebdfe875da	01578560200525	shipped	250	2025-05-20 06:46:41.915289+08
de2ddeda-bf82-4ca2-a692-599c7da62037	01730200000001	shipped	1	2025-06-09 13:49:15.71419+08
e4013bdb-29b5-4fc8-8127-f3b606ca8881	01578560220525	stocked	1000	2025-05-22 07:45:18.028844+08
e4ebba92-a16f-4b36-b1cd-4e3ba6d3fce7	01578562210525	stocked	500	2025-05-21 13:44:05.290045+08
ed66c98e-f697-4fd7-89bf-7042ed8ac3a8	01719928000101	stocked	18	2025-06-30 12:35:57.086933+08
167ddfb9-4d90-4a16-a256-3b5af4d2c2ce	01578560005430	shipped	50	2025-11-06 12:21:40.750019+08
16f67076-9516-47a0-b9dc-5e1bbaf507d1	01730203000001	shipped	1	2025-11-07 09:49:04.891162+08
2784e0cc-a9dd-4404-9dbf-9c4c55adb8b7	01578560150526	shipped	250	2025-11-18 13:15:45.941161+08
63545a33-ce96-4601-8adf-5e830c4aabd1	01578560005430	stocked	25	2025-11-26 09:53:18.475751+08
6653a8dc-3414-43dc-aaa4-f2f30e89de81	LOT123	stocked	10	2025-11-28 13:04:03.423369+08
38c11c3d-4632-4913-b1be-7e281dc8e6d6	LOT123	stocked	10	2025-11-28 13:14:06.063886+08
bd4904ff-d399-4c3c-8b1b-e902c12f047f	LOT123	stocked	10	2025-11-28 13:15:04.747992+08
cf871b91-b974-4c8e-914b-1a2f213fd8cd	LOT123	stocked	10	2025-11-28 13:16:15.444676+08
a8188348-aaad-4882-abdf-520d57f897c9	LOT123	stocked	10	2025-11-28 13:19:42.977626+08
39ad3126-dedb-4c84-a4cd-bf9f28bc688c	LOT123	stocked	10	2025-12-02 12:49:29.281139+08
74e4c666-2e43-45f0-abd5-3dc32fe9754f	317MW97	shipped	1	2025-12-02 14:26:50.133217+08
7dd1f908-9ffb-409f-9bab-884455ea6f56	01578560150525	stocked	1	2025-12-12 09:42:13.786147+08
60270e69-ab67-4952-bdc0-72b2d88b9779	01578560150525	stocked	1000	2025-12-12 15:53:51.41151+08
bf260e80-8db7-4e98-8c7c-64c2987811f6	01578560150525	shipped	201	2025-12-12 15:55:28.582807+08
\.


--
-- TOC entry 4972 (class 0 OID 33019)
-- Dependencies: 226
-- Data for Name: transaction_image; Type: TABLE DATA; Schema: public; Owner: xmo-dev
--

COPY public.transaction_image (id, "imgUrl", created_at) FROM stdin;
a8188348-aaad-4882-abdf-520d57f897c9	https://zbsvoqiaiobcoaxjiwoy.supabase.co/storage/v1/object/public/xmon-storage/receipts/808ea69b-8a62-4ac2-b28b-c6bdd37fcd33.png	2025-11-28
39ad3126-dedb-4c84-a4cd-bf9f28bc688c	https://zbsvoqiaiobcoaxjiwoy.supabase.co/storage/v1/object/public/xmon-storage/receipts/7bf53f76-7fe6-4153-9f56-86e6f7230f9a.png	2025-12-02
7dd1f908-9ffb-409f-9bab-884455ea6f56	https://zbsvoqiaiobcoaxjiwoy.supabase.co/storage/v1/object/public/xmon-storage/receipts/68e51a9f-84e6-4585-9f43-f8714f4598ad.png	2025-12-12
60270e69-ab67-4952-bdc0-72b2d88b9779	https://zbsvoqiaiobcoaxjiwoy.supabase.co/storage/v1/object/public/xmon-storage/receipts/153678e0-85f3-4554-b553-457dc2d8bb7c.png	2025-12-12
\.


--
-- TOC entry 4969 (class 0 OID 16709)
-- Dependencies: 223
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password_hash, role, created_at, updated_at) FROM stdin;
254e02f4-92b5-40d9-83da-6c53fd1c84db	test	test@gmail.com	$2b$10$tveajRWZgR9kbh0vl432TuAPvYidwDuGM5A6/ZA3R.kD4lNLmhU2C	worker	2025-08-06 10:50:18.128797+08	2025-08-06 10:50:18.128797+08
42538aef-431c-4dc8-8404-ffd092cafdd6	worker	worker@yahoo.com	$2b$10$hwSSOsyUYnX6eyWgx2Y2oegQ5fRfShEYiZ90J2KmOPytRiD3Fc0sm	worker	2025-08-07 12:20:16.465419+08	2025-08-07 12:20:16.465419+08
6e56d155-e1fe-452f-baa2-b47adca1f7f4	admin2	admin2@gmail.com	$2b$10$PDSMNIhw/vLaVSoiWQx67OBN1xS2ik2DATX5PalfqtmQliGQcGGKO	admin	2025-03-19 09:12:32.906612+08	2025-03-19 09:12:32.906612+08
7e6c787f-79ee-431a-977b-c7fa43528787	admin	tagumpayfund@gmail.com	$2a$06$XgRadj2cGEMNi8sfePAu/.Q3424IGoFpos2x0u0JTj9XK5BGI9.oS	admin	2025-03-17 09:27:06.632884+08	2025-03-17 09:27:06.632884+08
a0312fd7-42ce-4ec8-a33b-8cc17202ee09	maya	maya@gmail.com	$2b$10$W3s3yg6Rfvb3dWUZ.TuTpuNrUc4H56dJvSSo2e9gQqf47ztg0PygW	worker	2025-06-30 14:03:59.661144+08	2025-06-30 14:03:59.661144+08
ab36136d-e524-4a0d-a481-14d7b8093518	test	tanedo-kdt@global.kawasaki.com	$2b$10$phapYVaQ4lOi1UgLZlnPduZ6Er2wlxG2iwy/cJgg0GbwMlQm24VbO	admin	2025-05-27 12:13:26.009824+08	2025-05-27 12:13:26.009824+08
ae738be0-20a4-4d40-8294-c1ac7fa3268a	user3	user3@example.com	$2b$10$DLTcvYjLO/d.DWlK3uAmCeFk6hma39PGrVsYkjO1BUb25kA8Wq3o.	worker	2025-03-19 09:12:32.906612+08	2025-03-19 09:12:32.906612+08
0d9f874f-fae2-4e44-a399-b20eabd0381d	username1	email1@gmail.com	$2b$10$w65vR.AqtqV0/ijkNNY55u7qyBaV22JAyyW5FrWQbqSBfa.FhMGGy	admin	2025-08-19 10:01:24.573353+08	2025-08-19 10:01:24.573353+08
9120c721-d272-448d-949a-dc9b33cc2b08	username2	email2@gmail.com	$2b$10$gU/D1LjaHwKxwLn0DZHfXeQl1dc/Q39dqYLKI47/V63DndNstF4O6	admin	2025-08-19 10:03:33.698306+08	2025-08-19 10:03:33.698306+08
9de42763-5d3b-43ca-9a52-32b4ac0a24ad	username3	username3@gmail.com	testtest	worker	2025-08-06 09:26:37.808523+08	2025-08-06 09:26:37.808523+08
af9a39b3-0a8b-472d-b600-d415f835f878	username4	email4@gmail.com	$2b$10$UEWipA3vN4niF7wHz732MutOgtfuXfeJth9JmkLEYI7OJAoHLDb3O	admin	2025-08-19 10:02:19.207285+08	2025-08-19 10:02:19.207285+08
e05fec1c-ff70-4e4e-9f58-b003baee9e4c	admin0	admin@gmail.com	$2b$10$hwSSOsyUYnX6eyWgx2Y2oegQ5fRfShEYiZ90J2KmOPytRiD3Fc0sm	admin	2025-08-06 11:00:40.487424+08	2025-08-06 11:00:40.487424+08
f215c318-5891-443c-80a8-ad3cdab4544b	admin23	admin23@gmail.com	$2b$10$mRt4jT3M4EdcsMFASdPAZeCoDSAP3VJu42htubnx7570kJ/cc8Qou	worker	2025-11-04 08:19:24.43545+08	2025-11-04 08:19:24.43545+08
8c272893-6104-4b5d-934d-37479a936571	admin25	admin25@gmail.com	$2b$10$dqYjQGjq49zKN1CILMce5es6prGrJa1IXePFBnbsLfMhaqxbe0jza	worker	2025-11-04 08:24:37.303416+08	2025-11-04 08:24:37.303416+08
726bcaf6-4935-4511-8a78-e426cb7577c8	worker45	worker45@gmail.com	$2b$10$7GdHOIxHfp59PlKzvWZwAesFBvIzskqXaYPC3gIBnbMiDTC5HsdX2	worker	2025-11-18 09:58:00.794403+08	2025-11-18 09:58:00.794403+08
a7685591-4a00-4ce8-a8b4-e41eaac66b81	Alpha23	Alpha@gmail.com	$2b$10$2mwxGuM.dd3ZzCfG6VlW3OAAiY7Ai5Fjm5GsyqjXJhAQuyvskR8p2	worker	2025-12-12 08:43:41.690876+08	2025-12-12 08:43:41.690876+08
1cd79560-78ae-45e9-b703-99a79e4f1798	admin24	admin24@gmail.com	$2b$10$VTeyQa6IfQgGCzcVzJkICu3iKpW6dQpp9zryGxA/mLNzQEYZoNSRu	admin	2025-11-04 08:23:10.068378+08	2025-11-04 08:23:10.068378+08
\.


--
-- TOC entry 4970 (class 0 OID 16715)
-- Dependencies: 224
-- Data for Name: warehouse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouse (id, location, warehouse, created_at) FROM stdin;
a3492ac7-2c0a-402a-aa11-e2290fd7fae2	Tokyo, Japan	Tokyo Warehouse	2025-08-07 12:21:09.587934+08
4ac922c7-67ae-48b6-8a41-e582253ce4f9	Japan	Japan Warehouse	2025-03-19 09:20:36.165633+08
6939e940-7c6f-48b3-8393-964623175c24	Philippines	Philippines Warehouse	2025-03-19 09:20:36.165633+08
a2f3f8bf-f428-410f-a12b-8304affd7dcf	Philippines	Manila Warehouse	2025-05-16 13:06:54.004057+08
e3d2eaf4-5a6d-4dd6-8a33-f182a097b1d2	Japan	Tokyo Warehouse	2025-05-16 07:56:11.801981+08
c552e49c-d4da-4e27-a0d7-c74099f3489d	Philippines	Phi3Pan	2025-11-04 15:35:27.244605+08
7601ebd7-0511-4e8f-beed-6b8be0e23041	Philippines	Phi3Pan Warehouse2	2025-11-04 15:36:30.867714+08
7649edf3-9410-4e8f-9641-ba1c7f175fb0	Test Location	Test Warehouse	2025-12-12 08:32:52.754898+08
\.


--
-- TOC entry 4971 (class 0 OID 16720)
-- Dependencies: 225
-- Data for Name: worker_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.worker_location (id, user_id, warehouse_id, created_at, updated_at) FROM stdin;
74ad216c-5d0b-45f3-99c5-cecadf033d35	42538aef-431c-4dc8-8404-ffd092cafdd6	6939e940-7c6f-48b3-8393-964623175c24	2025-08-07 12:22:11.951958+08	2025-08-07 12:22:11.951958+08
9026b2b3-a465-4826-a5a3-b10ba3ff3445	0d9f874f-fae2-4e44-a399-b20eabd0381d	a2f3f8bf-f428-410f-a12b-8304affd7dcf	2025-08-19 10:01:24.583784+08	2025-08-19 10:01:24.583784+08
0e0e4213-b109-47f1-90aa-02df36ba3694	af9a39b3-0a8b-472d-b600-d415f835f878	a2f3f8bf-f428-410f-a12b-8304affd7dcf	2025-08-19 10:02:19.215435+08	2025-08-19 10:02:19.215435+08
f160aeff-a474-4d91-8e6b-2d6477880890	9120c721-d272-448d-949a-dc9b33cc2b08	a2f3f8bf-f428-410f-a12b-8304affd7dcf	2025-08-19 10:03:33.701533+08	2025-08-19 10:03:33.701533+08
a9813c6a-1231-4282-8243-d2d956d162a0	f215c318-5891-443c-80a8-ad3cdab4544b	e3d2eaf4-5a6d-4dd6-8a33-f182a097b1d2	2025-11-04 08:19:24.449441+08	2025-11-04 08:19:24.449441+08
0c2fa1cb-6df6-48ed-bb79-bf591594692e	8c272893-6104-4b5d-934d-37479a936571	6939e940-7c6f-48b3-8393-964623175c24	2025-11-04 08:24:37.305967+08	2025-11-04 08:24:37.305967+08
d4831ae7-a50a-45c1-94b8-fc760fe0a459	6e56d155-e1fe-452f-baa2-b47adca1f7f4	4ac922c7-67ae-48b6-8a41-e582253ce4f9	2025-11-04 08:24:37.305967+08	2025-11-04 08:24:37.305967+08
1e218bda-ebdb-4381-801d-d6f16e3d7697	726bcaf6-4935-4511-8a78-e426cb7577c8	e3d2eaf4-5a6d-4dd6-8a33-f182a097b1d2	2025-11-18 09:58:00.807552+08	2025-11-18 09:58:00.807552+08
462ad34f-46fe-4579-b3bd-651290802481	a7685591-4a00-4ce8-a8b4-e41eaac66b81	7601ebd7-0511-4e8f-beed-6b8be0e23041	2025-12-12 08:43:41.737+08	2025-12-12 08:43:41.737+08
48290b72-ab0c-4a5b-a35f-63f0d3b58e21	1cd79560-78ae-45e9-b703-99a79e4f1798	a3492ac7-2c0a-402a-aa11-e2290fd7fae2	2025-12-12 13:19:10.047127+08	2025-12-12 13:19:10.047127+08
\.


--
-- TOC entry 4812 (class 2606 OID 33031)
-- Name: email_history email_history_pkey; Type: CONSTRAINT; Schema: public; Owner: xmo-dev
--

ALTER TABLE ONLY public.email_history
    ADD CONSTRAINT email_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4796 (class 2606 OID 16727)
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (lot_no);


--
-- TOC entry 4800 (class 2606 OID 16729)
-- Name: parts_location parts_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parts_location
    ADD CONSTRAINT parts_location_pkey PRIMARY KEY (lot_no, warehouse_id);


--
-- TOC entry 4798 (class 2606 OID 16731)
-- Name: parts parts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parts
    ADD CONSTRAINT parts_pkey PRIMARY KEY (lot_no);


--
-- TOC entry 4802 (class 2606 OID 16733)
-- Name: recipients recipients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipients
    ADD CONSTRAINT recipients_pkey PRIMARY KEY (id);


--
-- TOC entry 4804 (class 2606 OID 16735)
-- Name: transaction_history transaction_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_history
    ADD CONSTRAINT transaction_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4806 (class 2606 OID 16737)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4808 (class 2606 OID 16739)
-- Name: warehouse warehouse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse
    ADD CONSTRAINT warehouse_pkey PRIMARY KEY (id);


--
-- TOC entry 4810 (class 2606 OID 16741)
-- Name: worker_location worker_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.worker_location
    ADD CONSTRAINT worker_location_pkey PRIMARY KEY (id, user_id, warehouse_id);


--
-- TOC entry 4817 (class 2606 OID 33035)
-- Name: email_transaction eh_et_email_id; Type: FK CONSTRAINT; Schema: public; Owner: xmo-dev
--

ALTER TABLE ONLY public.email_transaction
    ADD CONSTRAINT eh_et_email_id FOREIGN KEY (email_id) REFERENCES public.email_history(id);


--
-- TOC entry 4813 (class 2606 OID 16742)
-- Name: parts_location lot_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parts_location
    ADD CONSTRAINT lot_no_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouse(id);


--
-- TOC entry 4818 (class 2606 OID 33040)
-- Name: email_transaction th_et_transaction_id; Type: FK CONSTRAINT; Schema: public; Owner: xmo-dev
--

ALTER TABLE ONLY public.email_transaction
    ADD CONSTRAINT th_et_transaction_id FOREIGN KEY (transaction_id) REFERENCES public.transaction_history(id);


--
-- TOC entry 4815 (class 2606 OID 16747)
-- Name: worker_location uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.worker_location
    ADD CONSTRAINT uid_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4814 (class 2606 OID 16752)
-- Name: parts_location warehouse_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parts_location
    ADD CONSTRAINT warehouse_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouse(id);


--
-- TOC entry 4816 (class 2606 OID 16757)
-- Name: worker_location wid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.worker_location
    ADD CONSTRAINT wid_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouse(id);


-- Completed on 2025-12-15 10:14:01

--
-- PostgreSQL database dump complete
--

