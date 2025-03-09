import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import styles from './Modal.module.css';
import Button from '../Form/Button/Button';
import { motion } from 'framer-motion';

const Modal = ({
                 children,
                 isOpen = false,
                 title = '',
                 onClose,
                 onSubmit,
                 className,
                 action_text_close = 'Отмена',
                 action_text_submit = 'Сохранить',
                 width = 'unset',
                 isFooter = true,
                 footer,
                 closeButton = false,
                 isOverlay = true,
               }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
      <motion.div
          ref={modalRef}
          className={classNames(styles.modal__container, className)}
          style={{ width }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3 }}
      >
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          <span className={styles.close} onClick={onClose}>
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
          >
            <path
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                fill="#444746"
            />
          </svg>
        </span>
        </div>
        <div className={styles.body}>{children}</div>
        {isFooter && (
            <div className={classNames(styles.footer, footer)}>
              {closeButton && (
                  <Button onClick={onClose} placeholder={action_text_close} type="second" />
              )}
              <Button onClick={onSubmit} placeholder={action_text_submit} width="170px" />
            </div>
        )}
      </motion.div>
  );

  return isOverlay ? (
      <div className={styles.modal__overlay} ref={modalRef}>
        {modalContent}
      </div>
  ) : (
      modalContent
  );
};

export default Modal;