import Input from '@/components/Form/Input/Input';
import Modal from '@/components/Modal/Modal';
import StoreContext from '@/store/StoreContext';
import { observer } from 'mobx-react-lite';
import { useContext, useState, useEffect } from 'react'; // Добавляем useEffect
import s from './Auth.module.css';

const ModalRegister = observer(() => {
  const rootStore = useContext(StoreContext);
  const authStore = rootStore.authStore;

  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    repeatPassword: '',
    errors: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      repeatPassword: '',
      general: '', // Общая ошибка
    },
  });

  // Сбрасываем состояние формы при каждом открытии модального окна
  useEffect(() => {
    if (authStore.isModalRegister) {
      setState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        repeatPassword: '',
        errors: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          repeatPassword: '',
          general: '',
        },
      });
    }
  }, [authStore.isModalRegister]);

  const validateFields = () => {
    const { firstName, lastName, email, phone, password, repeatPassword } = state;
    const errors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      repeatPassword: '',
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

    if (!repeatPassword) {
      errors.repeatPassword = 'Поле обязательно для заполнения';
      isValid = false;
    } else if (repeatPassword !== password) {
      errors.repeatPassword = 'Пароли не совпадают';
      isValid = false;
    }

    setState((prev) => ({ ...prev, errors }));
    return isValid;
  };

  const handleRegister = async () => {
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
      });
      authStore.setIsModalRegister(false); // Закрываем модальное окно после успешной регистрации
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
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
      errors: {
        ...prev.errors,
        [name]: '', // Сбрасываем ошибку для изменяемого поля
      },
    }));
  };

  return (
    <Modal
      title="Регистрация"
      isOpen={authStore.isModalRegister}
      onClose={() => authStore.setIsModalRegister(false)}
      onSubmit={handleRegister}
      width="400px"
      action_text_submit="Зарегистрироваться"
      footer={s.footer}
      isOverlay={false}
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
      <Input
        id="repeatPassword"
        name="repeatPassword"
        type="password"
        onChange={handleChange}
        value={state.repeatPassword}
        placeholder="Повторите пароль"
        iconPosition="left"
        error={!!state.errors.repeatPassword}
        errorMessage={state.errors.repeatPassword}
      />
      {state.errors.general && (
        <div className={s.errorMessage}>{state.errors.general}</div>
      )}
      <span
        className="link"
        onClick={() => {
          authStore.setIsModalRegister(false);
          authStore.setIsModalLogin(true);
        }}
      >
        Уже есть аккаунт? Войти
      </span>
    </Modal>
  );
});

export default ModalRegister;