import {observer} from "mobx-react-lite";
import Modal from "@/components/Modal/Modal";
import {useContext, useEffect, useState} from "react";
import StoreContext from "@/store/StoreContext";
import s from "./ModalItemCategory.module.css"
import Input from "@/components/Form/Input/Input";

const ModalItemCategory = observer(() => {
    const rootStore = useContext(StoreContext);
    const modal = rootStore.auxiliaryStore.ModalItemCategory;
    const [state, setState] = useState({
        name: '',
        errors: {
            name: '',
            general: ''
        },
    });

    // Сбрасываем состояние формы при каждом открытии модального окна
    useEffect(() => {
        if (modal.data) {
            setState({
                name: modal.data?.name || '',
                errors: {
                    name: '',
                    general: ''
                },
            });
        }
    }, [modal.data]);

    const validateFields = () => {
        const { name } = state;
        const errors = {
            name: '',
            general: ''
        };

        let isValid = true;

        if (!name) {
            errors.name = 'Поле обязательно для заполнения';
            isValid = false;
        }
        setState((prev) => ({ ...prev, errors }));
        return isValid;
    };

    const handleSubmit = async () => {
        const isFormValid = validateFields();

        if (!isFormValid) {
            return;
        }

        try {
            await modal.onSubmit({ name: state.name });
        } catch (error) {
            setState((prev) => ({
                ...prev,
                errors: {
                    ...prev.errors,
                    general: error.message,
                },
            }));
        }
    };
    //TODO валидация с поиском сущ. ли такой элемент уже в таблицах
    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prev) => ({
            ...prev,
            [name]: value,
            errors: {
                ...prev.errors,
                [name]: '',
            },
        }));
    };
    // TODO удалять связанные записи или просто показывать ошибку
    return (
        <Modal
            width="400px"
            isOpen={modal.isOpen}
            onClose={modal.onClose}
            onSubmit={handleSubmit}
            title={`${modal.data?.action} ${modal.data?.type}`}
            action_text_submit={modal.data?.action === "Удаление" ? 'Удалить' : "Сохранить"}
            closeButton
        >
            {
                modal.data?.action === "Удаление" ?
                    <span className={s.delete__text}>
                        Вы уверены что хотите удалить <span style={{ fontWeight: 500}}>{modal.data?.type}</span> с именем <span style={{ fontWeight: 500}}>{modal.data?.name}</span> удалив все связанные записи будут удалены.
                    </span>
                    :
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        onChange={handleChange}
                        value={state.name}
                        placeholder="Название"
                        iconPosition="left"
                        error={!!state.errors.password}
                        errorMessage={state.errors.password}
                    />

            }
        </Modal>
    )
});
export default ModalItemCategory;