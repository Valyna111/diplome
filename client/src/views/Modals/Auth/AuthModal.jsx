import { motion, AnimatePresence } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react'; // Добавляем useEffect
import StoreContext from '@/store/StoreContext';
import ModalLogin from './ModalLogin';
import ModalRegister from './ModalRegister';
import s from './Auth.module.css';

const AuthModal = observer(() => {
  const rootStore = useContext(StoreContext);
  const authStore = rootStore.authStore;

  // Сбрасываем состояния при каждом открытии модального окна
  useEffect(() => {
    if (authStore.isModalLogin || authStore.isModalRegister) {
      authStore.resetFormStates(); // Вызываем метод сброса состояний
    }
  }, [authStore.isModalLogin, authStore.isModalRegister]);

  return (
    <AnimatePresence>
      {(authStore.isModalLogin || authStore.isModalRegister) && (
        <motion.div
          className={s.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {authStore.isModalLogin && (
              <motion.div
                key="login"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ModalLogin />
              </motion.div>
            )}
            {authStore.isModalRegister && (
              <motion.div
                key="register"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ModalRegister />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default AuthModal;