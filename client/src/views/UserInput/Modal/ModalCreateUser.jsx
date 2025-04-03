import Input from '@/components/Form/Input/Input';
import Modal from '@/components/Modal/Modal';
import Select from '@/components/Form/Select/Select';
import StoreContext from '@/store/StoreContext';
import {observer} from 'mobx-react-lite';
import {useContext, useEffect, useState} from 'react';
import s from '@/views/Modals/Auth/Auth.module.css';
import roles from "@/views/UserInput/roles";

const ModalCreateUser = observer(({isOpen, onClose, onSubmit}) => {
    const rootStore = useContext(StoreContext);
    const authStore = rootStore.authStore;

    const [state, setState] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: {label: '', value: ''},
        errors: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            role: '',
            general: '',
        },
    });

    useEffect(() => {
        if (isOpen) {
            setState({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: '',
                role: {label: '', value: ''},
                errors: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    password: '',
                    role: '',
                    general: '',
                },
            });
        }
    }, [isOpen]);

    const validateFields = () => {
        const {lastName, firstName, email, phone, password, role} = state;
        const errors = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            role: '',
        };

        let isValid = true;

        if (!firstName) {
            errors.firstName = 'Поле обязательно для заполнения';
            isValid = false;
        }

        if (!lastName) {
            errors.lastName = 'Поле обязательно для заполнения';
            isValid = false;
        }

        if (!email) {
            errors.email = 'Поле обязательно для заполнения';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Неверный формат email';
            isValid = false;
        }

        if (!phone) {
            errors.phone = 'Поле обязательно для заполнения';
            isValid = false;
        }

        if (!password) {
            errors.password = 'Поле обязательно для заполнения';
            isValid = false;
        } else if (password.length < 8) {
            errors.password = 'Пароль должен содержать минимум 8 символов';
            isValid = false;
        }

        if (!role) {
            errors.role = 'Необходимо выбрать роль';
            isValid = false;
        }

        setState((prev) => ({...prev, errors}));
        return isValid;
    };

    const handleCreateUser = async () => {
        const isFormValid = validateFields();

        if (!isFormValid) {
            return;
        }

        try {
            await authStore.registerUser({
                firstName: state.firstName,
                lastName: state.lastName,
                email: state.email,
                phone: state.phone,
                password: state.password,
                role: state.role.value,
            });
            onSubmit();
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

    const handleChange = (e) => {
        const {name, value} = e.target;
        setState((prev) => ({
            ...prev,
            [name]: value,
            errors: {
                ...prev.errors,
                [name]: '',
            },
        }));
    };

    const handleRoleChange = (selectedOption) => {
        setState((prev) => ({
            ...prev,
            role: selectedOption,
            errors: {
                ...prev.errors,
                role: '',
            },
        }));
    };

    return (
        <Modal
            title="Создать пользователя"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleCreateUser}
            width="400px"
            action_text_submit="Создать"
            footer={s.footer}
        >
            <Input
                id="firstName"
                name="firstName"
                onChange={handleChange}
                value={state.firstName}
                placeholder="Имя"
                iconPosition="left"
                error={!!state.errors.firstName}
                errorMessage={state.errors.firstName}
            />
            <Input
                id="lastName"
                name="lastName"
                onChange={handleChange}
                value={state.lastName}
                placeholder="Фамилия"
                iconPosition="left"
                error={!!state.errors.lastName}
                errorMessage={state.errors.lastName}
            />
            <Input
                id="email"
                name="email"
                onChange={handleChange}
                value={state.email}
                placeholder="Email"
                iconPosition="left"
                error={!!state.errors.email}
                errorMessage={state.errors.email}
            />
            <Input
                id="phone"
                name="phone"
                onChange={handleChange}
                value={state.phone}
                placeholder="Телефон"
                iconPosition="left"
                error={!!state.errors.phone}
                errorMessage={state.errors.phone}
                mask="+375 (00) 000-00-00"
            />
            <Input
                id="password"
                name="password"
                type="password"
                onChange={handleChange}
                value={state.password}
                placeholder="Пароль"
                iconPosition="left"
                error={!!state.errors.password}
                errorMessage={state.errors.password}
            />

            <Select
                options={roles}
                value={state.role}
                onChange={handleRoleChange}
                placeholder="Выберите роль"
                error={!!state.errors.role}
                errorMessage={state.errors.role}
            />

            {state.errors.general && (
                <div className={s.errorMessage}>{state.errors.general}</div>
            )}
        </Modal>
    );
});

export default ModalCreateUser;