"use client";

import { useState } from "react";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

// Example 1: Basic Modal
export function BasicModal() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button>Open Basic Modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Basic Modal</ModalTitle>
          <ModalDescription>
            This is a basic modal example with a title and description.
          </ModalDescription>
        </ModalHeader>
        <div className="py-4">
          <p>Your content goes here</p>
        </div>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Cancel</Button>
          </ModalClose>
          <Button>Save Changes</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Example 2: Modal with Form
export function FormModal() {
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <Modal>
      <ModalTrigger asChild>
        <Button>Open Form Modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Contact Form</ModalTitle>
          <ModalDescription>
            Fill out the form below to get in touch with us.
          </ModalDescription>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                className="border rounded-md p-2"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="border rounded-md p-2"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline">Cancel</Button>
            </ModalClose>
            <Button type="submit">Submit</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

// Example 3: Confirmation Modal
export function ConfirmationModal() {
  const handleConfirm = () => {
    // Handle confirmation
  };

  return (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="destructive">Delete Item</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Are you sure?</ModalTitle>
          <ModalDescription>
            This action cannot be undone. This will permanently delete your
            item.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Cancel</Button>
          </ModalClose>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Example 4: Custom Styled Modal
export function CustomStyledModal() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button>Open Custom Modal</Button>
      </ModalTrigger>
      <ModalContent className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
        <ModalHeader>
          <ModalTitle className="text-2xl font-bold">
            Custom Styled Modal
          </ModalTitle>
          <ModalDescription className="text-purple-100">
            This modal has custom styling applied.
          </ModalDescription>
        </ModalHeader>
        <div className="py-4">
          <p>Custom content with gradient background</p>
        </div>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline" className="bg-white/20 hover:bg-white/30">
              Close
            </Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
