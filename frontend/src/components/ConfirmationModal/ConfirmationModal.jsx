import React from "react";
import { Modal } from "../../context/Modal";
import "./ConfirmationModal.css";

//reusable confirmation modal component

const ConfirmationModal = ({
    show,
    title,
    message,
    onConfirm,
    onCancel,
}) => {
    return (
        <Modal onClose={onCancel}>
            <div className="confirmation-modal">
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="buttons">
                    <button onClick={onConfirm} className="confirm-button">
                        Yes
                    </button>
                    <button onClick={onCancel} className="cancel-button">
                        No
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;