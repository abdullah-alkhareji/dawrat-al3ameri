"use client";

import React from "react";
import { ModalTrigger, ModalContent, Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import AddTournamentForm from "./add-tournament-form";

const AddTournamentModal = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button className="font-bold">
          <Plus className="size-4" />
          ضيف بطولة
        </Button>
      </ModalTrigger>
      <ModalContent>
        <AddTournamentForm onSuccess={() => setOpen(false)} />
      </ModalContent>
    </Modal>
  );
};

export default AddTournamentModal;
