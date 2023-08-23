import { useEffect } from "react";

type ErrorModalProps = {
    message: string;
    onClose: () => void;
  };

export const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {

    const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onClose();
    };
  
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
      <div onClick={handleBackgroundClick} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
        <div onClick={handleModalContentClick} style={{backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '300px', textAlign: 'center', color: 'black', position: 'relative'}}>
        <div onClick={onClose} style={{position: 'absolute', right: '10px', top: '10px', cursor: 'pointer', fontWeight: 'bold'}}>X</div>
          <p>{message}</p>
        </div>
      </div>
    );
  };