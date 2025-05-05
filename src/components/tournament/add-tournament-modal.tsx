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
  return (
    <Modal>
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
        <AddTournamentForm />
      </ModalContent>
    </Modal>
  );
};

export default AddTournamentModal;
