import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import StoreContext from '@/store/StoreContext';
import ModalLogin from './ModalLogin';
import ModalRegister from './ModalRegister';
import ModalChangePassword from './ModalChangePassword';
import s from './Auth.module.css';
import ModalForgotPassword from './ModalForgotPassword';

const AuthModal = observer(() => {
  const rootStore = useContext(StoreContext);
  const authStore = rootStore.authStore;

  // Сбрасываем состояния при каждом открытии модального окна
  useEffect(() => {
    if (authStore.isModalLogin || authStore.isModalRegister) {
      authStore.resetFormStates();
    }
  }, [authStore.isModalLogin, authStore.isModalRegister]);

  return (
    <AnimatePresence>
      {(authStore.isModalLogin || authStore.isModalRegister || authStore.isModalChangePassword || authStore.isModalForgotPassword) && (
        <motion.div
          className={s.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {authStore.isModalChangePassword && (
              <motion.div
                key="changePassword"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ModalChangePassword />
              </motion.div>
            )}
            {authStore.isModalForgotPassword && (
              <motion.div
                key="forgotPassword"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ModalForgotPassword />
              </motion.div>
            )}
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