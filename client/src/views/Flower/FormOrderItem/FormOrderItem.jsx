import s from './FormOrderItem.module.css';

const FormOrderItem = ({
    item
}) => {
    const [ size, setSize ] = useState(null);

    return (
        <div className={s.conteiner}>
            <p className={s.title}>{item?.name}</p>
            <p className={s.desc}>{item?.shortDesc}</p>
            <p className={s.price}>{item?.price}</p>
            <div className={s.sizes__wrapper}>
            </div>
        </div>
    );
}

export default FormOrderItem;