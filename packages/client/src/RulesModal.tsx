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
      <div className="bg-white rounded-lg p-8 shadow-lg w-300 text-black relative">
        <h2 className="text-2xl mb-4">Rules of Engagement</h2>
        <p>This is a game of alliances and betrayal.</p>
        <br />
        <ul>
          <li>A game must have a minimum of 2 players to start.</li>
          <li>
            You can invite other players to your game session by sharing the
            Game ID with them.
          </li>
          <li>
            Each player starts with 3 action points (AP), a range of 2 (show as
            a grey perimeter) and 3 health points (HP).
          </li>
          <li>
            Players can move to an adjacent space, using the arrow keys (cost 1
            AP).
          </li>
          <li>
            Players can shoot at another player within range to deduct 1 HP
            (cost 1 AP).
          </li>
          <li>Players can send AP to another player within range.</li>
          <li>
            Players can increase their range by one space up to a maximum of 5
            (cost 1 AP).
          </li>
          <li>A player loses if their ship reaches zero health</li>
          <li>
            Dead players are still able to claim AP but they can only send them
            to live players, regardless of whether they're in range, therefore
            be careful who you double cross.
          </li>
          <li>A player wins if they are the last ship standing</li>
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
