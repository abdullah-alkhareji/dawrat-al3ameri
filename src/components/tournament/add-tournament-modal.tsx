"use client";

import React from "react";
import {
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  Modal,
} from "../ui/modal";
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
          اضافه بطولة
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>اضافه بطولة</ModalTitle>
        </ModalHeader>
        <AddTournamentForm onSuccess={() => setOpen(false)} />
      </ModalContent>
    </Modal>
  );
};

export default AddTournamentModal;
