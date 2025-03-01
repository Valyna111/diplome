import Input from '@/components/Form/Input/Input';
import Modal from '@/components/Modal/Modal';
import StoreContext from '@/store/StoreContext';
import { observer } from 'mobx-react-lite';
import { useContext, useState, useEffect } from 'react'; // Добавляем useEffect
import s from './Auth.module.css';

const ModalLogin = observer(() => {
  const rootStore = useContext(StoreContext);
  const authStore = rootStore.authStore;

  const [state, setState] = useState({
    email: '',
    password: '',
    errors: {
      email: '',
      password: '',
      general: '', // Общая ошибка (например, "Неверный пароль")
    },
  });

  // Сбрасываем состояние формы при каждом открытии модального окна
  useEffect(() => {
    if (authStore.isModalLogin) {
      setState({
        email: '',
        password: '',
        errors: {
          email: '',
          password: '',
          general: '',
        },
      });
    }
  }, [authStore.isModalLogin]);

  const validateFields = () => {
    const { email, password } = state;
    const errors = {
      email: '',
      password: '',
    };

    let isValid = true;

    if (!email) {
      errors.email = 'Поле обязательно для заполнения';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Поле обязательно для заполнения';
      isValid = false;
    }

    setState((prev) => ({ ...prev, errors }));
    return isValid;
  };

  const handleLogin = async () => {
    const isFormValid = validateFields();

    if (!isFormValid) {
      return;
    }

    try {
      await authStore.login({ email: state.email, password: state.password });
      authStore.setIsModalLogin(false);
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
        [name]: '',
      },
    }));
  };

  return (
    <Modal
      title="Вход"
      isOpen={authStore.isModalLogin}
      onClose={() => authStore.setIsModalLogin(false)}
      onSubmit={handleLogin}
      width="400px"
      action_text_submit="Вход"
      footer={s.footer}
    >
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
      {state.errors.general && (
        <div className={s.errorMessage}>{state.errors.general}</div>
      )}
      <span
        className="link"
        onClick={() => {
          authStore.setIsModalLogin(false);
          authStore.setIsModalRegister(true);
        }}
      >
        Нет аккаунта? Зарегистрироваться
      </span>
    </Modal>
  );
});

export default ModalLogin;