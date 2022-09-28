import {
  Button,
  Highlight,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';

interface DeleteCollectionModalProps {
  header: string;
  message: string;
  messageHighlight: string | string[];
  warning: string;
  warningHightlight: string | string[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const ConfirmationModal: React.FC<DeleteCollectionModalProps> = ({
  header,
  message,
  messageHighlight,
  warning,
  warningHightlight,
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={'xs'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton></ModalCloseButton>

        <ModalBody>
          <Highlight
            query={messageHighlight}
            styles={{ px: '2', py: '1', rounded: 'full', bg: 'red.100' }}
          >
            {message}
          </Highlight>
          <br />
          <Highlight
            query={warningHightlight}
            styles={{ px: '2', py: '1', rounded: 'full', bg: 'red.100' }}
          >
            {warning}
          </Highlight>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme={'telegram'} onClick={onClose}>
            Close
          </Button>
          <Button variant={'ghost'} onClick={onConfirm}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
