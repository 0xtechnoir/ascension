import { useEffect } from "react";
import Modal from "@material-ui/core/Modal";

type MessageModalProps = {
  message: string;
  onClose: () => void;
};

export const MessageModal: React.FC<MessageModalProps> = ({
  message,
  onClose,
}) => {
  const handleModalContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  useEffect(() => {
    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapePress);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("keydown", handleEscapePress);
    };
  }, [onClose]);

  return (
    <Modal
      onClose={onClose}
      open={true}
      className="flex items-center justify-center"
    >
      <div
        onClick={handleModalContentClick}
        className="bg-white rounded-lg p-8 shadow-lg w-96 text-black relative"
      >
        <p>{message}</p>
        <br />
        <button onClick={onClose} className="btn-sci-fi">
          Dismiss
        </button>
      </div>
    </Modal>
  );
};
