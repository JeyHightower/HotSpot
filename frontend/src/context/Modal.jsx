import { useRef, useState, useContext, createContext, useMemo, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
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
  }, [onModalClose]);

  // Handle Escape key to close modal
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  }, [closeModal]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Memoized contextValue
  const contextValue = useMemo(() => ({
    modalRef,
    modalContent,
    setModalContent,
    onModalClose,
    setOnModalClose,
    closeModal
  }), [modalRef, modalContent, onModalClose, closeModal]);

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
  const contentRef = useRef();

  useEffect(() => {
    if (modalContent) {
      contentRef.current.focus(); // Set focus to modal content when it opens
    }
  }, [modalContent]);

  if (!modalRef.current || !modalContent) return null;

  return ReactDOM.createPortal(
    <div className="modal" onClick={closeModal}>
      <div className="modal-content" ref={contentRef} onClick={(e) => e.stopPropagation()}>
        {modalContent}
      </div>
    </div>,
    modalRef.current
  );
}

// Remove the PropTypes for children since it's not needed
Modal.propTypes = {}; // No props are required

// Hook to use the modal context
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}