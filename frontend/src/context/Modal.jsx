import { useRef, useState, useContext, createContext, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import PropTypes from 'prop-types';
import './Modal.css';

// Create the Modal Context
const ModalContext = createContext();

// Modal Provider Component
export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);

  // Memoized closeModal function
  const closeModal = useCallback(() => {
    setModalContent(null);
    if (typeof onModalClose === 'function') {
      setOnModalClose(null);
      onModalClose();
    }
  }, [onModalClose, setModalContent, setOnModalClose]);

  // Memoized contextValue
  const contextValue = useMemo(() => ({
    modalRef,
    modalContent,
    setModalContent,
    onModalClose,
    setOnModalClose,
    closeModal
  }), [modalRef, modalContent, onModalClose, setModalContent, setOnModalClose, closeModal]);

  return (
    <>
      <ModalContext.Provider value={contextValue}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

// Modal Component
export function Modal() {
  const { modalRef, modalContent, closeModal } = useContext(ModalContext);

  if (!modalRef || !modalRef.current || !modalContent) return null;

  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={closeModal} />

      <div id="modal-content">{modalContent}</div>
    </div>,
    modalRef.current
  );
}

// Custom Hook for accessing Modal Context
export const useModal = () => useContext(ModalContext);

// Prop Type Validation for ModalProvider
ModalProvider.propTypes = {
  children: PropTypes.node.isRequired
};