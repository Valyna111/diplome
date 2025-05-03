-- Таблица item
CREATE TABLE public.item
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(50) NOT NULL,
    type_id    INT         NOT NULL,
    cost       REAL        NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE public.item
    OWNER TO postgres;

-- Таблица bonuses
CREATE TABLE public.bonuses
(
    id         SERIAL PRIMARY KEY,
    bonus      INT,
    user_id    INT,
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE public.bonuses
    OWNER TO postgres;

-- Таблица bouquets
CREATE TABLE public.bouquets
(
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(50)  NOT NULL,
    category_id  INT          NOT NULL,
    price        REAL         NOT NULL,
    image        TEXT         NOT NULL,
    description  VARCHAR(250) NOT NULL,
    sale         INT,
    second_image TEXT,
    created_at   TIMESTAMP DEFAULT NOW()
);
ALTER TABLE public.bouquets
    OWNER TO postgres;

-- Таблица cart (обновленная)
CREATE TABLE public.cart
(
    id         SERIAL PRIMARY KEY,
    user_id    INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Добавляем уникальное ограничение отдельно
ALTER TABLE public.cart
    ADD CONSTRAINT cart_user_id_unique UNIQUE (user_id);

ALTER TABLE public.cart
    OWNER TO postgres;

-- Таблица cart_items (новая)
CREATE TABLE public.cart_items
(
    id         SERIAL PRIMARY KEY,
    cart_id    INT   NOT NULL,
    bouquet_id INT   NOT NULL,
    quantity   INT   NOT NULL DEFAULT 1 CHECK (quantity > 0),
    addons     JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP      DEFAULT NOW(),
    UNIQUE (cart_id, bouquet_id)
);
ALTER TABLE public.cart_items
    OWNER TO postgres;

-- Таблица category
CREATE TABLE public.category
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE public.category
    OWNER TO postgres;
--
-- -- Таблица credit_info
-- CREATE TABLE public.credit_info
-- (
--     id          SERIAL PRIMARY KEY,
--     card_number INT         NOT NULL,
--     cvv         INT         NOT NULL,
--     user_id     INT         NOT NULL,
--     owner_name  VARCHAR(50) NOT NULL,
--     created_at  TIMESTAMP DEFAULT NOW()
-- );
-- ALTER TABLE public.credit_info
--     OWNER TO postgres;

-- Таблица deliveryman_info
CREATE TABLE public.deliveryman_info
(
    id         SERIAL PRIMARY KEY,
    user_id    INT NOT NULL,
    ocp_id     INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE public.deliveryman_info
    OWNER TO postgres;

-- Таблица feedback
CREATE TABLE public.feedback
(
    id         SERIAL PRIMARY KEY,
    order_id   INT          REFERENCES public.orders (id),
    bouquet_id INT          REFERENCES public.bouquets (id),
    user_id    INT          REFERENCES public.users (id) NOT NULL,
    text       VARCHAR(300) NOT NULL,
    score      INT          NOT NULL,
    ref_id     INT          REFERENCES public.feedback (id),
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE public.feedback
    OWNER TO postgres;

-- Таблица flowers_in_bouquets
CREATE TABLE public.items_in_bouquets
(
    id         SERIAL PRIMARY KEY,
    item_id    INT NOT NULL,
    amount     INT NOT NULL,
    bouquet_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE public.items_in_bouquets
    OWNER TO postgres;

-- Таблица ocp
CREATE TABLE public.ocp
(
    id         SERIAL PRIMARY KEY,
    address    VARCHAR(100) NOT NULL,
    latitude FLOAT,
    longitude FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE public.ocp
    OWNER TO postgres;

-- Таблица ocp_item
CREATE TABLE public.ocp_item
(
    id         SERIAL PRIMARY KEY,
    item_id    INT NOT NULL,
    amount     INT NOT NULL,
    ocp_id     INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE public.ocp_item
    OWNER TO postgres;

-- Таблица orders
CREATE TABLE public.orders
(
    id           SERIAL PRIMARY KEY,
    user_id      INT  NOT NULL,
    order_date   DATE NOT NULL,
    order_time   TIME NOT NULL,
    price        REAL NOT NULL,
    status_id    INT  NOT NULL,
    address      VARCHAR(250),
    delivery_id  INT,
    payment_type VARCHAR(50),
    order_type   VARCHAR(50),
    ocp_id       INT REFERENCES public.ocp (id),
    created_at   TIMESTAMP DEFAULT NOW()
);
ALTER TABLE public.orders
    OWNER TO postgres;

-- Таблица order_items (новая, аналогичная cart_items)
CREATE TABLE public.order_items
(
    id         SERIAL PRIMARY KEY,
    order_id   INT   NOT NULL,
    bouquet_id INT   NOT NULL,
    quantity   INT   NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price      REAL  NOT NULL, -- Фиксируем цену на момент заказа
    addons     JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP      DEFAULT NOW(),
    FOREIGN KEY (order_id) REFERENCES public.orders (id) ON DELETE CASCADE,
    FOREIGN KEY (bouquet_id) REFERENCES public.bouquets (id)
);
ALTER TABLE public.order_items
    OWNER TO postgres;

-- Таблица role
CREATE TABLE public.role
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE public.role
    OWNER TO postgres;

-- Таблица status
CREATE TABLE public.status
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE public.status
    OWNER TO postgres;

-- Таблица type
CREATE TABLE public.type
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE public.type
    OWNER TO postgres;

-- Таблица users
CREATE TABLE public.users
(
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(50)         NOT NULL,
    passhash      TEXT,
    email         VARCHAR(100),
    phone         VARCHAR(20),
    role_id       INT       DEFAULT 1 NOT NULL,
    date_of_birth DATE,
    surname       VARCHAR(50)         NOT NULL,
    is_blocked    BOOLEAN   DEFAULT FALSE,
    address       VARCHAR(250),
    ocp_id INT REFERENCES public.ocp(id),
    force_password_change BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMP DEFAULT NOW(),
    reset_token VARCHAR(64),
    reset_token_expires TIMESTAMP
);
ALTER TABLE public.users
    OWNER TO postgres;

-- Таблица wishlist
CREATE TABLE public.wishlist
(
    id         SERIAL PRIMARY KEY,
    user_id    INT NOT NULL,
    bouquet_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE public.wishlist
    OWNER TO postgres;

-- Таблица events
CREATE TABLE IF NOT EXISTS public.events
(
    id          SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    image       TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Создаем новую таблицу articles
CREATE TABLE IF NOT EXISTS public.articles
(
    id         SERIAL PRIMARY KEY,
    header     TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Создаем таблицу для блоков статей
CREATE TABLE IF NOT EXISTS public.article_blocks
(
    id         SERIAL PRIMARY KEY,
    article_id INT  NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    image      TEXT,
    text       TEXT,
    order_num  INT  NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица user_sessions (уже имеет created_at)
CREATE TABLE public.user_sessions
(
    id            SERIAL PRIMARY KEY,
    user_id       INT       NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    session_token TEXT      NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW(),
    expires_at    TIMESTAMP NOT NULL
);

-- Внешние ключи (остаются без изменений)
ALTER TABLE ONLY public.items_in_bouquets
    ADD CONSTRAINT fk_bouquet FOREIGN KEY (bouquet_id) REFERENCES public.bouquets (id);

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT fk_bouquet FOREIGN KEY (bouquet_id) REFERENCES public.bouquets (id);

ALTER TABLE ONLY public.bouquets
    ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES public.category (id);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_delivery FOREIGN KEY (delivery_id) REFERENCES public.deliveryman_info (id);

ALTER TABLE ONLY public.items_in_bouquets
    ADD CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES public.item (id);

ALTER TABLE ONLY public.ocp_item
    ADD CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES public.item (id);

ALTER TABLE ONLY public.ocp_item
    ADD CONSTRAINT fk_ocp FOREIGN KEY (ocp_id) REFERENCES public.ocp (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES public.role (id);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_status FOREIGN KEY (status_id) REFERENCES public.status (id);

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_type FOREIGN KEY (type_id) REFERENCES public.type (id);

ALTER TABLE ONLY public.bonuses
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (id);

-- ALTER TABLE ONLY public.credit_info
--     ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (id);

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (id);

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (id);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (id);

ALTER TABLE ONLY public.deliveryman_info
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (id);

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_bouquet FOREIGN KEY (bouquet_id) REFERENCES public.bouquets (id);

-- Добавляем внешние ключи для новой таблицы cart_items
ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fk_cart FOREIGN KEY (cart_id) REFERENCES public.cart (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fk_bouquet FOREIGN KEY (bouquet_id) REFERENCES public.bouquets (id);

-- Добавляем внешние ключи для новой таблицы cart_items
ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES public.orders (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_bouquet FOREIGN KEY (bouquet_id) REFERENCES public.bouquets (id);

COMMENT ON TABLE public.ocp_item IS E'@name PickupPointItems';
COMMENT ON TABLE public.ocp IS E'@name PickupPoint';
COMMENT ON TABLE public.deliveryman_info IS E'@name DeliverymanAssignment';
COMMENT ON TABLE "public"."order_items" IS E'@name DBOrderItem';
COMMENT ON TABLE "public"."orders" IS E'@name DBOrders';
