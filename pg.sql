-- Таблица item
CREATE TABLE public.item
(
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(50) NOT NULL,
    type_id INT         NOT NULL,
    cost    MONEY       NOT NULL
);
ALTER TABLE public.item
    OWNER TO postgres;

-- Таблица bonuses
CREATE TABLE public.bonuses
(
    id      SERIAL PRIMARY KEY,
    bonus   INT,
    user_id INT
);
ALTER TABLE public.bonuses
    OWNER TO postgres;

-- Таблица bouquets
CREATE TABLE public.bouquets
(
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(50)  NOT NULL,
    category_id  INT          NOT NULL,
    price        MONEY        NOT NULL,
    image        TEXT         NOT NULL,
    description  VARCHAR(250) NOT NULL,
    amount       INT          NOT NULL,
    sale         INT,
    second_image TEXT
);
ALTER TABLE public.bouquets
    OWNER TO postgres;

-- Таблица cart
CREATE TABLE public.cart
(
    id         SERIAL PRIMARY KEY,
    user_id    INT NOT NULL,
    bouquet_id INT NOT NULL
);
ALTER TABLE public.cart
    OWNER TO postgres;

-- Таблица category
CREATE TABLE public.category
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);
ALTER TABLE public.category
    OWNER TO postgres;

-- Таблица credit_info
CREATE TABLE public.credit_info
(
    id          SERIAL PRIMARY KEY,
    card_number INT         NOT NULL,
    cvv         INT         NOT NULL,
    user_id     INT         NOT NULL,
    owner_name  VARCHAR(50) NOT NULL
);
ALTER TABLE public.credit_info
    OWNER TO postgres;

-- Таблица deliveryman_info
CREATE TABLE public.deliveryman_info
(
    id      SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    ocp_id  INT NOT NULL
);
ALTER TABLE public.deliveryman_info
    OWNER TO postgres;

-- Таблица feedback
CREATE TABLE public.feedback
(
    id       SERIAL PRIMARY KEY,
    order_id INT          NOT NULL,
    user_id  INT          NOT NULL,
    text     VARCHAR(300) NOT NULL,
    score    INT          NOT NULL
);
ALTER TABLE public.feedback
    OWNER TO postgres;

-- Таблица flowers_in_bouquets
CREATE TABLE public.items_in_bouquets
(
    id         SERIAL PRIMARY KEY,
    flower_id  INT NOT NULL,
    amount     INT NOT NULL,
    bouquet_id INT NOT NULL
);
ALTER TABLE public.items_in_bouquets
    OWNER TO postgres;

-- Таблица ocp
CREATE TABLE public.ocp
(
    id      SERIAL PRIMARY KEY,
    address VARCHAR(100) NOT NULL
);
ALTER TABLE public.ocp
    OWNER TO postgres;

-- Таблица ocp_item
CREATE TABLE public.ocp_item
(
    id      SERIAL PRIMARY KEY,
    item_id INT NOT NULL,
    amount  INT NOT NULL,
    ocp_id  INT NOT NULL
);
ALTER TABLE public.ocp_item
    OWNER TO postgres;

-- Таблица orders
CREATE TABLE public.orders
(
    id               SERIAL PRIMARY KEY,
    user_id          INT          NOT NULL,
    bouquet_id       INT          NOT NULL,
    order_date       DATE         NOT NULL,
    price            MONEY        NOT NULL,
    status_id        INT          NOT NULL,
    customer_address VARCHAR(100) NOT NULL,
    delivery_id      INT          NOT NULL
);
ALTER TABLE public.orders
    OWNER TO postgres;

-- Таблица role
CREATE TABLE public.role
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);
ALTER TABLE public.role
    OWNER TO postgres;

-- Таблица status
CREATE TABLE public.status
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);
ALTER TABLE public.status
    OWNER TO postgres;

-- Таблица type
CREATE TABLE public.type
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
ALTER TABLE public.type
    OWNER TO postgres;

-- Таблица users
CREATE TABLE public.users
(
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(50)   NOT NULL,
    passhash      TEXT,
    email         VARCHAR(100),
    phone         VARCHAR(20),
    role_id       INT DEFAULT 1 NOT NULL,
    date_of_birth DATE,
    surname       VARCHAR(50)   NOT NULL
);
ALTER TABLE public.users
    OWNER TO postgres;

-- Таблица wishlist
CREATE TABLE public.wishlist
(
    id         SERIAL PRIMARY KEY,
    user_id    INT NOT NULL,
    bouquet_id INT NOT NULL
);
ALTER TABLE public.wishlist
    OWNER TO postgres;

-- Таблица events
CREATE TABLE IF NOT EXISTS public.events
(
    id          SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    image       TEXT NOT NULL,
    bouquet_id  INT  NOT NULL
);

-- Таблица articles
CREATE TABLE IF NOT EXISTS public.articles
(
    id           SERIAL PRIMARY KEY,
    header       TEXT NOT NULL,
    image1       TEXT,
    image2       TEXT,
    image3       TEXT,
    description1 TEXT,
    description2 TEXT,
    description3 TEXT
);
CREATE TABLE public.user_sessions
(
    id            SERIAL PRIMARY KEY,
    user_id       INT       NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    session_token TEXT      NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW(),
    expires_at    TIMESTAMP NOT NULL
);
-- Внешние ключи
ALTER TABLE ONLY public.items_in_bouquets
    ADD CONSTRAINT fk_bouquet FOREIGN KEY (bouquet_id) REFERENCES public.bouquets (id);

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT fk_bouquet FOREIGN KEY (bouquet_id) REFERENCES public.bouquets (id);

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT fk_bouquet FOREIGN KEY (bouquet_id) REFERENCES public.bouquets (id);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_bouquet FOREIGN KEY (bouquet_id) REFERENCES public.bouquets (id);

ALTER TABLE ONLY public.bouquets
    ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES public.category (id);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_delivery FOREIGN KEY (delivery_id) REFERENCES public.deliveryman_info (id);

ALTER TABLE ONLY public.items_in_bouquets
    ADD CONSTRAINT fk_flower FOREIGN KEY (flower_id) REFERENCES public.item (id);

ALTER TABLE ONLY public.ocp_item
    ADD CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES public.item (id);

ALTER TABLE ONLY public.ocp_item
    ADD CONSTRAINT fk_ocp FOREIGN KEY (ocp_id) REFERENCES public.ocp (id);

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES public.orders (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES public.role (id);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_status FOREIGN KEY (status_id) REFERENCES public.status (id);

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_type FOREIGN KEY (type_id) REFERENCES public.type (id);

ALTER TABLE ONLY public.bonuses
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (id);

ALTER TABLE ONLY public.credit_info
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (id);

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (id);

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (id);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (id);

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (id);

ALTER TABLE ONLY public.deliveryman_info
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (id);

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_bouquet FOREIGN KEY (bouquet_id) REFERENCES public.bouquets (id);