-- Таблица Item
CREATE TABLE public."Item" (
                               itemid SERIAL PRIMARY KEY,
                               itemname character varying(50) NOT NULL,
                               typeid integer NOT NULL,
                               cost money NOT NULL
);
ALTER TABLE public."Item" OWNER TO postgres;

-- Таблица bonuses
CREATE TABLE public.bonuses (
                                bonusid SERIAL PRIMARY KEY,
                                bonus integer,
                                userid integer
);
ALTER TABLE public.bonuses OWNER TO postgres;

-- Таблица buoquets
CREATE TABLE public.buoquets (
                                 bouquetid SERIAL PRIMARY KEY,
                                 bouquetname character varying(50) NOT NULL,
                                 category integer NOT NULL,
                                 price money NOT NULL,
                                 image text NOT NULL,
                                 description character varying(250) NOT NULL,
                                 amount integer NOT NULL,
                                 sale integer,
                                 "secondImage" text
);
ALTER TABLE public.buoquets OWNER TO postgres;

-- Таблица cart
CREATE TABLE public.cart (
                             cartid SERIAL PRIMARY KEY,
                             userid integer NOT NULL,
                             bouquetid integer NOT NULL
);
ALTER TABLE public.cart OWNER TO postgres;

-- Таблица category
CREATE TABLE public.category (
                                 categoryid SERIAL PRIMARY KEY,
                                 category character varying(50) NOT NULL
);
ALTER TABLE public.category OWNER TO postgres;

-- Таблица creditinfo
CREATE TABLE public.creditinfo (
                                   creditid SERIAL PRIMARY KEY,
                                   cardnumber integer NOT NULL,
                                   cvv integer NOT NULL,
                                   userid integer NOT NULL,
                                   ownername character varying(50) NOT NULL
);
ALTER TABLE public.creditinfo OWNER TO postgres;

-- Таблица diliverymaninfo
CREATE TABLE public.diliverymaninfo (
                                        diliverymanid SERIAL PRIMARY KEY,
                                        userid integer NOT NULL,
                                        ocpid integer NOT NULL
);
ALTER TABLE public.diliverymaninfo OWNER TO postgres;

-- Таблица feedback
CREATE TABLE public.feedback (
                                 feedbackid SERIAL PRIMARY KEY,
                                 orderid integer NOT NULL,
                                 userid integer NOT NULL,
                                 text character varying(300) NOT NULL,
                                 score integer NOT NULL
);
ALTER TABLE public.feedback OWNER TO postgres;

-- Таблица flowers_in_buoquets
CREATE TABLE public.flowers_in_buoquets (
                                            fbid SERIAL PRIMARY KEY,
                                            flowerid integer NOT NULL,
                                            amount integer NOT NULL,
                                            bouquetid integer NOT NULL
);
ALTER TABLE public.flowers_in_buoquets OWNER TO postgres;

-- Таблица ocp
CREATE TABLE public.ocp (
                            ocpid SERIAL PRIMARY KEY,
                            address character varying(100) NOT NULL
);
ALTER TABLE public.ocp OWNER TO postgres;

-- Таблица ocpitem
CREATE TABLE public.ocpitem (
                                ocpitemd SERIAL PRIMARY KEY,
                                itemid integer NOT NULL,
                                amount integer NOT NULL,
                                ocpid integer NOT NULL
);
ALTER TABLE public.ocpitem OWNER TO postgres;

-- Таблица orders
CREATE TABLE public.orders (
                               orderid SERIAL PRIMARY KEY,
                               userid integer NOT NULL,
                               bouquetid integer NOT NULL,
                               orderdate date NOT NULL,
                               price money NOT NULL,
                               statusid integer NOT NULL,
                               customeraddress character varying(100) NOT NULL,
                               delivery integer NOT NULL
);
ALTER TABLE public.orders OWNER TO postgres;

-- Таблица role
CREATE TABLE public.role (
                             roleid SERIAL PRIMARY KEY,
                             role character varying(50) NOT NULL
);
ALTER TABLE public.role OWNER TO postgres;

-- Таблица status
CREATE TABLE public.status (
                               statusid SERIAL PRIMARY KEY,
                               status character varying(50) NOT NULL
);
ALTER TABLE public.status OWNER TO postgres;

-- Таблица type
CREATE TABLE public.type (
                             typeid SERIAL PRIMARY KEY,
                             name character varying(100) NOT NULL
);
ALTER TABLE public.type OWNER TO postgres;

-- Таблица users
CREATE TABLE public.users (
                              userid SERIAL PRIMARY KEY,
                              username character varying(50) NOT NULL,
                              passhash text,
                              email character varying(100),
                              phone character varying(20),
                              role integer DEFAULT 1 NOT NULL,
                              dateofbirth date,
                              usersyrname character varying NOT NULL
);
ALTER TABLE public.users OWNER TO postgres;

-- Таблица wishlist
CREATE TABLE public.wishlist (
                                 wishlist SERIAL PRIMARY KEY,
                                 userid integer NOT NULL,
                                 bouquetid integer NOT NULL
);
ALTER TABLE public.wishlist OWNER TO postgres;


ALTER TABLE ONLY public.flowers_in_buoquets
    ADD CONSTRAINT bouqueteid FOREIGN KEY (bouquetid) REFERENCES public.buoquets(bouquetid) NOT VALID;
ALTER TABLE ONLY public.cart
    ADD CONSTRAINT bouquetid FOREIGN KEY (bouquetid) REFERENCES public.buoquets(bouquetid);
ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT bouquetid FOREIGN KEY (bouquetid) REFERENCES public.buoquets(bouquetid);
ALTER TABLE ONLY public.orders
    ADD CONSTRAINT bouquetid FOREIGN KEY (bouquetid) REFERENCES public.buoquets(bouquetid);
ALTER TABLE ONLY public.buoquets
    ADD CONSTRAINT category FOREIGN KEY (category) REFERENCES public.category(categoryid);
ALTER TABLE ONLY public.orders
    ADD CONSTRAINT delivery FOREIGN KEY (delivery) REFERENCES public.diliverymaninfo(diliverymanid) NOT VALID;
ALTER TABLE ONLY public.flowers_in_buoquets
    ADD CONSTRAINT flowerid FOREIGN KEY (flowerid) REFERENCES public."Item"(itemid);
ALTER TABLE ONLY public.ocpitem
    ADD CONSTRAINT flowerid FOREIGN KEY (itemid) REFERENCES public."Item"(itemid);
ALTER TABLE ONLY public.ocpitem
    ADD CONSTRAINT ocpid FOREIGN KEY (ocpid) REFERENCES public.ocp(ocpid) NOT VALID;
ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT orderid FOREIGN KEY (orderid) REFERENCES public.orders(orderid);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT role FOREIGN KEY (role) REFERENCES public.role(roleid);
ALTER TABLE ONLY public.orders
    ADD CONSTRAINT statusid FOREIGN KEY (statusid) REFERENCES public.status(statusid);
ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT typeid FOREIGN KEY (typeid) REFERENCES public.type(typeid) NOT VALID;
ALTER TABLE ONLY public.bonuses
    ADD CONSTRAINT userid FOREIGN KEY (userid) REFERENCES public.users(userid);
ALTER TABLE ONLY public.creditinfo
    ADD CONSTRAINT userid FOREIGN KEY (userid) REFERENCES public.users(userid);
ALTER TABLE ONLY public.cart
    ADD CONSTRAINT userid FOREIGN KEY (userid) REFERENCES public.users(userid);
ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT userid FOREIGN KEY (userid) REFERENCES public.users(userid);
ALTER TABLE ONLY public.orders
    ADD CONSTRAINT userid FOREIGN KEY (userid) REFERENCES public.users(userid);
ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT userid FOREIGN KEY (userid) REFERENCES public.users(userid);
ALTER TABLE ONLY public.diliverymaninfo
    ADD CONSTRAINT userid FOREIGN KEY (userid) REFERENCES public.users(userid);