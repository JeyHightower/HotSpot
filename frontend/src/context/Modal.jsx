import { useRef, useContext, useState, createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './Modal.css';


const ModalContext = createContext();

export function ModalProvider ({ children }) {
    const modalRef = useRef ();
    const [modalContent, setModalContent] = useState(null);
    //cb func that will be called when modal is closing
    const [onModalClose, setOnModalClose] = useState(null);
    
    const closeModal = () => {
        //clear the modal contents
        setModalContent(null);
        //if cb func is truthy, call the cb func and reset it to null
        if (typeof onModalClose === "function") {
            setOnModalClose(null);
            onModalClose();
        }
    };
    const contextValue = {
         //ref to modal div
         modalRef,
         //react component to render inside modal
         modalContent,
         //function to set the react component to render inside modal
         setModalContent,
         //function to set the callback function to be called when modal is closing
         setOnModalClose,
         //function to close the modal
         closeModal
    };
    return (
        <>
            <ModalContext.Provider value={contextValue}>
                {children}
            </ModalContext.Provider>
            <div ref={modalRef} />
        </>
    );

}

export function Modal () {
    const { modalRef, modalContent, closeModal } = useContext(ModalContext);
    //if there is no div referenced byt he modalRef or modalContent is not a
    //truthy value, render nothing:
    if(!modalRef || !modalRef.current || !modalContent) return null;

    // render the following components to the div refer by the modalRef
    return ReactDOM.createPortal(
        <div id="modal">
            <div id="modal-background" onClick={closeModal} />
            <div id="modal-content"> {modalContent}</div>
        </div>,
        modalRef.current
    );
    }

export const useModal = () => useContext(ModalContext);