import { useParams } from "react-router-dom";
import styles from "./PromotionDetail.module.css";

const promotions = [
  {
    id: 1,
    image: "/images/promo1.jpg",
    title: "Скидка 20% на розы!",
    description: "Только до конца месяца скидка 20% на все букеты с розами.",
  },
  {
    id: 2,
    image: "/images/promo2.jpg",
    title: "2 по цене 1 на лилии!",
    description: "При покупке одного букета с лилиями – второй в подарок!",
  },
  {
    id: 3,
    image: "/images/promo3.jpg",
    title: "Весеннее предложение!",
    description: "Все весенние букеты со скидкой 15%! Успейте купить!",
  },
];

const PromotionDetail = () => {
  const { id } = useParams();
  const promotion = promotions.find((promo) => promo.id === Number(id));

  if (!promotion) {
    return <div className={styles.notFound}>Акция не найдена</div>;
  }

  return (
    <div className={styles.container}>
      <img src={promotion.image} alt={promotion.title} className={styles.promoImage} />
      <p className={styles.description}>{promotion.description}</p>
    </div>
  );
};

export default PromotionDetail;
