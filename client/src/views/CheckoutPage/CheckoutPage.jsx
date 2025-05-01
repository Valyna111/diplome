import React, {useContext, useState, useEffect} from "react";
import {observer} from "mobx-react-lite";
import StoreContext from "@/store/StoreContext";
import {useNavigate} from "react-router-dom";
import {AnimatePresence, motion} from "framer-motion";
import {
    ArrowLeftOutlined,
    CarOutlined,
    CheckOutlined,
    CreditCardOutlined,
    DollarOutlined,
    EnvironmentOutlined
} from "@ant-design/icons";
import {Avatar, Badge, Button, Card, DatePicker, Divider, Input, message, Radio, Select, Steps, Typography} from "antd";
import moment from "moment";
import styles from "./CheckoutPage.module.css";

const {Step} = Steps;
const {Title, Text} = Typography;
const {Option} = Select;

const LoadingOverlay = () => (
    <motion.div
        className={styles.loadingOverlay}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.3}}
    >
        <motion.div
            className={styles.loader}
            animate={{
                rotate: 360,
                transition: {
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear"
                }
            }}
        >
            <div className={styles.loaderInner}/>
        </motion.div>
        <Text className={styles.loadingText}>Оформление заказа...</Text>
    </motion.div>
);

const CheckoutPage = observer(() => {
    const {authStore, ocpStore, orderStore} = useContext(StoreContext);
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Проверяем наличие привязанного OCP
    const userOcp = ocpStore.ocpList.find(ocp => ocp.id === authStore.currentUser?.ocp_id);

    // Form states
    const [formData, setFormData] = useState({
        deliveryMethod: "pickup", // По умолчанию самовывоз
        deliveryAddress: authStore.currentUser?.address || "", // Используем адрес пользователя
        deliveryDate: moment(),
        deliveryTime: "12:00",
        paymentMethod: "cash",
        cardNumber: "",
        cardName: "",
        cardExpiry: "",
        cardCvv: ""
    });
    const [errors, setErrors] = useState({});

    // Проверяем, есть ли у пользователя привязанный OCP
    useEffect(() => {
        if (!authStore.currentUser?.ocp_id) {
            message.error("Необходимо указать адрес и выбрать пункт выдачи");
            navigate("/user/profile");
        }
    }, [authStore.currentUser]);

    const primaryColor = "#e91e63";
    const secondaryColor = "#d81b60";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minDeliveryDate = new Date(today);
    minDeliveryDate.setDate(today.getDate());

    const maxDeliveryDate = new Date(today);
    maxDeliveryDate.setDate(today.getDate() + 14);

    const steps = [
        {title: "Доставка", content: "delivery"},
        {title: "Оплата", content: "payment"},
        {title: "Подтверждение", content: "confirmation"}
    ];

    const generateTimeOptions = () => {
        const options = [];
        const startHour = 8;
        const endHour = 22;

        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
                options.push(timeString);
            }
        }

        return options;
    };

    const totalPrice = authStore.cart.reduce(
        (sum, item) => sum + item.bouquet.price * item.quantity,
        0
    );

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when field changes
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateStep = () => {
        const newErrors = {};

        if (step === 0) {
            if (!formData.deliveryMethod) {
                newErrors.deliveryMethod = "Выберите способ получения";
            }

            if (formData.deliveryMethod === "delivery" && !formData.deliveryAddress) {
                newErrors.deliveryAddress = "Введите адрес доставки";
            }

            if (!formData.deliveryDate) {
                newErrors.deliveryDate = "Выберите дату получения";
            }

            if (!formData.deliveryTime) {
                newErrors.deliveryTime = "Выберите время получения";
            }
        } else if (step === 1) {
            if (!formData.paymentMethod) {
                newErrors.paymentMethod = "Выберите способ оплаты";
            }

            if (formData.paymentMethod === "card") {
                if (!formData.cardNumber) newErrors.cardNumber = "Введите номер карты";
                if (!formData.cardName) newErrors.cardName = "Введите имя владельца";
                if (!formData.cardExpiry) newErrors.cardExpiry = "Введите срок действия";
                if (!formData.cardCvv) newErrors.cardCvv = "Введите CVV код";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const next = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const prev = () => {
        if (step === 0) {
            navigate(-1);
        } else {
            setStep(step - 1);
        }
    };

    const handleSubmitOrder = async () => {
        setIsSubmitting(true);
        try {
            const orderData = {
                items: authStore.cart.map(item => ({
                    bouquetId: item.bouquet.id,
                    quantity: item.quantity,
                    price: item.bouquet.price,
                    addons: item.addons || []
                })),
                orderType: formData.deliveryMethod,
                address: formData.deliveryMethod === "delivery" ? formData.deliveryAddress : null,
                ocpId: authStore.currentUser.ocp_id, // Всегда используем привязанный OCP
                paymentType: formData.paymentMethod,
                orderDate: formData.deliveryDate.format("YYYY-MM-DD"),
                orderTime: formData.deliveryTime
            };

            const order = await orderStore.createOrder(orderData);
            await authStore.syncCart([]); // Очищаем корзину
            message.success("Заказ успешно создан!");
            navigate("/user/order-confirmation", {state: {order}});
        } catch (error) {
            console.error("Order creation error:", error);
            message.error(`Ошибка при создании заказа: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Обновляем рендер секции выбора способа получения
    const renderDeliverySection = () => (
        <>
            <Title level={4} className={styles.sectionTitle}>
                Способ получения
            </Title>
            <div className={errors.deliveryMethod ? styles.errorField : ""}>
                <Radio.Group
                    className={styles.deliveryMethods}
                    value={formData.deliveryMethod}
                    onChange={e => handleInputChange("deliveryMethod", e.target.value)}
                >
                    <Card
                        className={styles.methodCard}
                        onClick={() => handleInputChange("deliveryMethod", "pickup")}
                    >
                        <Radio value="pickup">
                            <div className={styles.methodContent}>
                                <EnvironmentOutlined className={styles.methodIcon}/>
                                <div>
                                    <Title level={5}>Самовывоз из OCP</Title>
                                    <Text type="secondary">
                                        {userOcp?.address || "Загрузка..."}
                                    </Text>
                                </div>
                            </div>
                        </Radio>
                    </Card>
                    <Card
                        className={styles.methodCard}
                        onClick={() => handleInputChange("deliveryMethod", "delivery")}
                    >
                        <Radio value="delivery">
                            <div className={styles.methodContent}>
                                <CarOutlined className={styles.methodIcon}/>
                                <div>
                                    <Title level={5}>Доставка курьером</Title>
                                    <Text type="secondary">
                                        {authStore.currentUser?.address || "Укажите адрес доставки"}
                                    </Text>
                                </div>
                            </div>
                        </Radio>
                    </Card>
                </Radio.Group>
                {errors.deliveryMethod && (
                    <Text type="danger" className={styles.errorText}>
                        {errors.deliveryMethod}
                    </Text>
                )}
            </div>

            {formData.deliveryMethod === "delivery" && (
                <>
                    <Title level={4} className={styles.sectionTitle}>
                        Адрес доставки
                    </Title>
                    <div className={errors.deliveryAddress ? styles.errorField : ""}>
                        <Input
                            placeholder="Улица, дом, квартира"
                            size="large"
                            value={formData.deliveryAddress}
                            onChange={e => handleInputChange("deliveryAddress", e.target.value)}
                        />
                        {errors.deliveryAddress && (
                            <Text type="danger" className={styles.errorText}>
                                {errors.deliveryAddress}
                            </Text>
                        )}
                    </div>
                </>
            )}
        </>
    );

    // Обновляем рендер содержимого шагов
    const renderStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <>
                        {renderDeliverySection()}
                        <Title level={4} className={styles.sectionTitle}>
                            Дата и время получения
                        </Title>
                        <div className={styles.datetimeRow}>
                            <div
                                className={`${styles.datePicker} ${errors.deliveryDate ? styles.errorField : ""}`}>
                                <DatePicker
                                    size="large"
                                    style={{width: "100%"}}
                                    value={formData.deliveryDate}
                                    onChange={date => handleInputChange("deliveryDate", date)}
                                    disabledDate={current => {
                                        return (
                                            current &&
                                            (current < minDeliveryDate || current > maxDeliveryDate)
                                        );
                                    }}
                                />
                                {errors.deliveryDate && (
                                    <Text type="danger" className={styles.errorText}>
                                        {errors.deliveryDate}
                                    </Text>
                                )}
                            </div>
                            <div
                                className={`${styles.timeSelect} ${errors.deliveryTime ? styles.errorField : ""}`}>
                                <Select
                                    placeholder="Выберите время"
                                    size="large"
                                    value={formData.deliveryTime}
                                    onChange={value => handleInputChange("deliveryTime", value)}
                                >
                                    {generateTimeOptions().map(time => (
                                        <Option key={time} value={time}>
                                            {time}
                                        </Option>
                                    ))}
                                </Select>
                                {errors.deliveryTime && (
                                    <Text type="danger" className={styles.errorText}>
                                        {errors.deliveryTime}
                                    </Text>
                                )}
                            </div>
                        </div>
                    </>
                );
            case 1:
                return (
                    <>
                        <Title level={4} className={styles.sectionTitle}>
                            Способ оплаты
                        </Title>
                        <div className={errors.paymentMethod ? styles.errorField : ""}>
                            <Radio.Group
                                className={styles.paymentMethods}
                                value={formData.paymentMethod}
                                onChange={e => handleInputChange("paymentMethod", e.target.value)}
                            >
                                {formData.deliveryMethod === "pickup" && (
                                    <>
                                        <Card
                                            className={styles.methodCard}
                                            onClick={() => handleInputChange("paymentMethod", "cash")}
                                        >
                                            <Radio value="cash">
                                                <div className={styles.methodContent}>
                                                    <DollarOutlined className={styles.methodIcon}/>
                                                    <div>
                                                        <Title level={5}>Наличными при получении</Title>
                                                        <Text type="secondary">
                                                            Оплатите заказ при самовывозе
                                                        </Text>
                                                    </div>
                                                </div>
                                            </Radio>
                                        </Card>
                                        <Card
                                            className={styles.methodCard}
                                            onClick={() => handleInputChange("paymentMethod", "card")}
                                        >
                                            <Radio value="card">
                                                <div className={styles.methodContent}>
                                                    <CreditCardOutlined className={styles.methodIcon}/>
                                                    <div>
                                                        <Title level={5}>Онлайн оплата картой</Title>
                                                        <Text type="secondary">Оплатите заказ сейчас</Text>
                                                    </div>
                                                </div>
                                            </Radio>
                                        </Card>
                                    </>
                                )}
                                {formData.deliveryMethod === "delivery" && (
                                    <>
                                        <Card
                                            className={styles.methodCard}
                                            onClick={() => handleInputChange("paymentMethod", "cash")}
                                        >
                                            <Radio value="cash">
                                                <div className={styles.methodContent}>
                                                    <DollarOutlined className={styles.methodIcon}/>
                                                    <div>
                                                        <Title level={5}>Наличными курьеру</Title>
                                                        <Text type="secondary">
                                                            Оплатите заказ при получении
                                                        </Text>
                                                    </div>
                                                </div>
                                            </Radio>
                                        </Card>
                                        <Card
                                            className={styles.methodCard}
                                            onClick={() => handleInputChange("paymentMethod", "card")}
                                        >
                                            <Radio value="card">
                                                <div className={styles.methodContent}>
                                                    <CreditCardOutlined className={styles.methodIcon}/>
                                                    <div>
                                                        <Title level={5}>Онлайн оплата картой</Title>
                                                        <Text type="secondary">Оплатите заказ сейчас</Text>
                                                    </div>
                                                </div>
                                            </Radio>
                                        </Card>
                                    </>
                                )}
                            </Radio.Group>
                            {errors.paymentMethod && (
                                <Text type="danger" className={styles.errorText}>
                                    {errors.paymentMethod}
                                </Text>
                            )}
                        </div>

                        {formData.paymentMethod === "card" && (
                            <>
                                <Title level={4} className={styles.sectionTitle}>
                                    Данные карты
                                </Title>
                                <div className={errors.cardNumber ? styles.errorField : ""}>
                                    <Input
                                        placeholder="Номер карты"
                                        size="large"
                                        maxLength={19}
                                        value={formData.cardNumber}
                                        onChange={e => handleInputChange("cardNumber", e.target.value)}
                                    />
                                    {errors.cardNumber && (
                                        <Text type="danger" className={styles.errorText}>
                                            {errors.cardNumber}
                                        </Text>
                                    )}
                                </div>
                                <div className={errors.cardName ? styles.errorField : ""}>
                                    <Input
                                        placeholder="Имя владельца"
                                        size="large"
                                        value={formData.cardName}
                                        onChange={e => handleInputChange("cardName", e.target.value)}
                                    />
                                    {errors.cardName && (
                                        <Text type="danger" className={styles.errorText}>
                                            {errors.cardName}
                                        </Text>
                                    )}
                                </div>
                                <div className={styles.cardDetails}>
                                    <div
                                        className={`${styles.cardExpiry} ${errors.cardExpiry ? styles.errorField : ""}`}>
                                        <Input
                                            placeholder="MM/YY"
                                            size="large"
                                            maxLength={5}
                                            value={formData.cardExpiry}
                                            onChange={e => handleInputChange("cardExpiry", e.target.value)}
                                        />
                                        {errors.cardExpiry && (
                                            <Text type="danger" className={styles.errorText}>
                                                {errors.cardExpiry}
                                            </Text>
                                        )}
                                    </div>
                                    <div
                                        className={`${styles.cardCvv} ${errors.cardCvv ? styles.errorField : ""}`}>
                                        <Input
                                            placeholder="CVV"
                                            size="large"
                                            maxLength={3}
                                            value={formData.cardCvv}
                                            onChange={e => handleInputChange("cardCvv", e.target.value)}
                                        />
                                        {errors.cardCvv && (
                                            <Text type="danger" className={styles.errorText}>
                                                {errors.cardCvv}
                                            </Text>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                );
            case 2:
                return (
                    <>
                        <Title level={3} className={styles.sectionTitle}>
                            Проверьте данные заказа
                        </Title>
                        <Card className={styles.summaryCard}>
                            <Title level={4} className={styles.summaryTitle}>
                                Способ получения
                            </Title>
                            <div className={styles.summaryItem}>
                                {formData.deliveryMethod === "pickup" ? (
                                    <>
                                        <EnvironmentOutlined className={styles.summaryIcon}/>
                                        <Text>
                                            Самовывоз из {userOcp?.address}
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        <CarOutlined className={styles.summaryIcon}/>
                                        <Text>
                                            Доставка по адресу: {formData.deliveryAddress}
                                        </Text>
                                    </>
                                )}
                            </div>

                            <Title level={4} className={styles.summaryTitle}>
                                Дата и время
                            </Title>
                            <div className={styles.summaryItem}>
                                <Text>
                                    {formData.deliveryDate?.format("DD.MM.YYYY")} в{" "}
                                    {formData.deliveryTime}
                                </Text>
                            </div>

                            <Title level={4} className={styles.summaryTitle}>
                                Способ оплаты
                            </Title>
                            <div className={styles.summaryItem}>
                                {formData.paymentMethod === "cash" ? (
                                    <>
                                        <DollarOutlined className={styles.summaryIcon}/>
                                        <Text>Наличными при получении</Text>
                                    </>
                                ) : (
                                    <>
                                        <CreditCardOutlined className={styles.summaryIcon}/>
                                        <Text>Оплата картой</Text>
                                    </>
                                )}
                            </div>

                            <Divider/>

                            <Title level={4} className={styles.summaryTitle}>
                                Состав заказа
                            </Title>
                            <div className={styles.orderItems}>
                                {authStore.cart.map(item => (
                                    <div key={item.id} className={styles.orderItem}>
                                        <Badge count={item.quantity}>
                                            <Avatar
                                                src={`http://localhost:4000${item.bouquet.image}`}
                                                shape="square"
                                                size={64}
                                            />
                                        </Badge>
                                        <div className={styles.itemInfo}>
                                            <Text strong>{item.bouquet.name}</Text>
                                            <Text type="secondary">
                                                {item.bouquet.price} ₽ × {item.quantity}
                                            </Text>
                                        </div>
                                        <Text strong>
                                            {(item.quantity * item.bouquet.price).toFixed(2)} ₽
                                        </Text>
                                    </div>
                                ))}
                            </div>

                            <Divider/>

                            <div className={styles.totalPrice}>
                                <Title level={4}>Итого:</Title>
                                <Title level={4}>{totalPrice.toFixed(2)} ₽</Title>
                            </div>
                        </Card>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <AnimatePresence>
                {isSubmitting && <LoadingOverlay/>}
            </AnimatePresence>

            <div className={styles.header}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined/>}
                    onClick={prev}
                    className={styles.backButton}
                />
                <Title level={3} className={styles.title}>
                    Оформление заказа
                </Title>
            </div>

            <Steps current={step} className={styles.steps}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title}/>
                ))}
            </Steps>

            <div className={styles.content}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{opacity: 0, x: 100}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: -100}}
                        transition={{duration: 0.3}}
                    >
                        <div className={styles.form}>
                            {renderStepContent()}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className={styles.footer}>
                <div className={styles.footerContent}>
                    {step < steps.length - 1 ? (
                        <>
                            <div className={styles.priceSummary}>
                                <Text strong>Итого:</Text>
                                <Title level={4} style={{color: primaryColor, margin: 0}}>
                                    {totalPrice.toFixed(2)} ₽
                                </Title>
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                onClick={next}
                                style={{background: primaryColor, borderColor: secondaryColor}}
                            >
                                {step === 1 ? "Перейти к оплате" : "Продолжить"}
                            </Button>
                        </>
                    ) : (
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleSubmitOrder}
                            style={{background: primaryColor, borderColor: secondaryColor}}
                            icon={<CheckOutlined/>}
                        >
                            Подтвердить заказ
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
});

export default CheckoutPage;