import StoreContext from "@/store/StoreContext";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import s from './Flower.module.css'

const Flower = observer(({

}) => {
    const rootStore = useContext(StoreContext);

    return (
        <div className={s.conteiner}>
            
        </div>
    );
})

export default Flower;