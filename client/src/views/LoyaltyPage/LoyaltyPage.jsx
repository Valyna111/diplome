import React from "react";
import styles from "./LoyaltyPage.module.css";

const LoyaltyPage = () => {
  // Примерное количество бонусов (можно заменить на состояние)
  const bonusPoints = 1250;

  return (
    <div className={styles.loyaltyPage}>
      <h1 className={styles.title}>Программа лояльности</h1>

      {/* Виртуальная карта */}
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>Flower Shop</h2>
            <p className={styles.cardText}>Виртуальная карта лояльности</p>
          </div>
        </div>
        <p className={styles.bonusPoints}>Ваши бонусы: <span>{bonusPoints}</span></p>
      </div>

      {/* Информация о программе */}
      <div className={styles.infoSection}>
        <h2 className={styles.sectionTitle}>Как зарегистрировать карту?</h2>
        <p className={styles.sectionText}>
          Для регистрации карты лояльности посетите наш магазин и заполните анкету.
          Вы получите виртуальную карту, которая будет доступна в вашем личном кабинете.
        </p>
      </div>

      <div className={styles.infoSection}>
        <h2 className={styles.sectionTitle}>Как получать бонусы?</h2>
        <p className={styles.sectionText}>
          За каждую покупку в нашем магазине вы получаете бонусы. 1 бонус = 1 рубль.
          Чем больше вы покупаете, тем больше бонусов накапливаете!
        </p>
      </div>

      <div className={styles.infoSection}>
        <h2 className={styles.sectionTitle}>Как использовать бонусы?</h2>
        <p className={styles.sectionText}>
          Вы можете использовать бонусы для оплаты следующих покупок. Просто сообщите
          кассиру, что хотите списать бонусы, или выберите эту опцию при онлайн-заказе.
        </p>
      </div>
    </div>
  );
};

export default LoyaltyPage;