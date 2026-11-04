// src/components/LoginPromptDialog.jsx
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";

function LoginPromptDialog({ open, onClose }) {
  const navigate = useNavigate();

  return (
    <ConfirmDialog
      open={open}
      title="Athlete Authentication Required"
      confirmText="Log In"
      cancelText="Maybe Later"
      onConfirm={() => {
        onClose();
        navigate("/login");
      }}
      onClose={onClose}
    >
      <p className="m-0 font-medium">
        You need a Prolane account to add professional sports equipment to your cart. Log in or create a free account in seconds.
      </p>
    </ConfirmDialog>
  );
}

export default LoginPromptDialog;