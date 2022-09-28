import {
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
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FormikHelpers } from 'formik';
import React from 'react';
import {
  useAddUserToCollectionMutation,
  useCollectionUsersQuery,
} from '../../generated/graphql';
import { toErrorMap } from '../../helpers/to-error-map';
import CollectionUserItem from './CollectionUserItem';
import CreateModal from '../CreateModal';

interface CollectionUsersModalProps {
  collectionId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CollectionUsersModal: React.FC<CollectionUsersModalProps> = ({
  collectionId,
  isOpen,
  onClose,
}) => {
  const toast = useToast();
  const [{ data, fetching }, refreshUsersList] = useCollectionUsersQuery({
    variables: {
      collectionId,
    },
    requestPolicy: 'network-only',
  });
  const [, addUserToCollection] = useAddUserToCollectionMutation();
  const {
    isOpen: isAddUserOpen,
    onOpen: onAddUserOpen,
    onClose: onAddUserClose,
  } = useDisclosure();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Collection users</ModalHeader>
        <ModalCloseButton></ModalCloseButton>

        <ModalBody>
          {fetching ? (
            <Center>
              <CircularProgress isIndeterminate />
            </Center>
          ) : (
            data?.collectionById.collection?.users.map((user) => (
              <CollectionUserItem
                key={user.id}
                username={user.username}
                refreshUserList={refreshUsersList}
                collectionId={collectionId}
              />
            ))
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme={'telegram'} onClick={onClose}>
            Close
          </Button>
          <Button ml={2} onClick={onAddUserOpen}>
            Add user
          </Button>
          <CreateModal
            header="Add user"
            fields={[
              {
                name: 'username',
                label: 'Enter username',
                placeholder: 'username',
              },
            ]}
            onClose={onAddUserClose}
            onSubmit={async (values: any, helpers: FormikHelpers<any>) => {
              const response = await addUserToCollection({
                username: values.username,
                collectionId,
              });

              if (response.data?.addUserToCollection.errors) {
                if (
                  response.data.addUserToCollection.errors[0].field ===
                  'collectionId'
                ) {
                  toast({
                    title: 'Ooops!',
                    description:
                      response.data.addUserToCollection.errors[0].message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                  });
                } else {
                  helpers.setErrors(
                    toErrorMap(response.data.addUserToCollection.errors),
                  );

                  return;
                }
              }

              await refreshUsersList();
              onAddUserClose();
            }}
            isOpen={isAddUserOpen}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CollectionUsersModal;
