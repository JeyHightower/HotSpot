import { useModal } from '../../context/Modal';
import PropTypes from 'prop-types';

function OpenModalButton({
    modalComponent,
    buttonText,
    onButtonClick,
    onModalClose
}) {
    const { setModalContent, setOnModalClose } = useModal();
    const onClick = () => {
        if (onModalClose) setOnModalClose(onModalClose);
        setModalContent(modalComponent);
        if (typeof onButtonClick === "function") onButtonClick();
    };
    return <button onClick={onClick}>{buttonText}</button>;
}

OpenModalButton.propTypes = {
    modalComponent: PropTypes.element.isRequired,
    buttonText: PropTypes.string.isRequired,
    onButtonClick: PropTypes.func,
    onModalClose: PropTypes.func
};
export default OpenModalButton;