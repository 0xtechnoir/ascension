import React from "react";
import Modal from "@material-ui/core/Modal";

type RulesModalProps = {
  showRulesModal: boolean;
  setShowRulesModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const RulesModal: React.FC<RulesModalProps> = ({
  showRulesModal: showRulesModal,
  setShowRulesModal: setShowRulesModal,
}) => {

  const handleCloseRulesModal = () => {
    setShowRulesModal(false);
  };

  return (
    <Modal
      onClose={handleCloseRulesModal}
      open={showRulesModal}
      className="flex items-center justify-center"
    >
      <div className="bg-white rounded-lg p-8 shadow-lg w-96 text-black relative">
        <h2 className="text-2xl mb-4">Rules of Engagement</h2>
        <ul>
          <li>Each player starts with three action points.</li>
          <li>Each player starts with a shooting range of two spaces.</li>
          <li>Each player starts with three health.</li>
          <li>Players can move to an adjacent space.</li>
          <li>Players can shoot at another player within shooting range.</li>
          <li>Players can trade with another player within shooting range.</li>
          <li>Players can increase their shooting range by one space.</li>
          <li>A player loses if their tank reaches zero health</li>
        </ul>
        <br />
        <button onClick={handleCloseRulesModal} className="btn-sci-fi">
          Dismiss
        </button>
      </div>
    </Modal>
  );
};

export default RulesModal;
