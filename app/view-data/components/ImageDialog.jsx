import React from "react";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";

const ImageDialog = ({ open, onClose, imageUrl }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <img src={imageUrl} alt="User" style={{ width: "100%", height: "auto" }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageDialog;
