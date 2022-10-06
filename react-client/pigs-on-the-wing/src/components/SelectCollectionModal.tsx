import {
  Box,
  Button,
  Center,
  CircularProgress,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useUserCollectionsQuery } from '../generated/graphql';

interface SelectCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (collectionId: string) => Promise<void>;
}

const SelectCollectionModal: React.FC<SelectCollectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [{ data, fetching }] = useUserCollectionsQuery();
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>();

  const onSaveClick = async () => {
    setError(null);
    if (selectedCollection === null) {
      setError(`Please, select some collection.`);
    } else {
      await onSave(selectedCollection);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose collection to save request in</ModalHeader>
        <ModalCloseButton></ModalCloseButton>

        <ModalBody>
          {fetching ? (
            <Center>
              <CircularProgress isIndeterminate />
            </Center>
          ) : (
            <>
              <Select
                placeholder="Select collection"
                onChange={(event) => setSelectedCollection(event.target.value)}
              >
                {data?.userCollections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </Select>
              {error !== null ? <Box color={'red'}>{error}</Box> : null}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme={'telegram'} onClick={onClose}>
            Close
          </Button>
          <Button variant={'ghost'} onClick={onSaveClick}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SelectCollectionModal;
