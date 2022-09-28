import { DeleteIcon } from '@chakra-ui/icons';
import { Flex, IconButton, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { OperationContext } from 'urql';
import { useRemoveUserFromCollectionMutation } from '../../generated/graphql';
import ConfirmationModal from '../ConfirmationModal';

interface CollectionUserItemProps {
  username: string;
  collectionId: string;
  refreshUserList: (opts?: Partial<OperationContext> | undefined) => void;
}

const CollectionUserItem: React.FC<CollectionUserItemProps> = ({
  username,
  collectionId,
  refreshUserList,
}) => {
  const toast = useToast();
  const [, removeUserFromCollection] = useRemoveUserFromCollectionMutation();
  const {
    isOpen: isRemoveUsersOpen,
    onOpen: onRemoveUserOpen,
    onClose: onRemoveUserClose,
  } = useDisclosure();

  const removeUser = useCallback(async () => {
    const res = await removeUserFromCollection({
      username,
      collectionId,
    });

    if (res.data?.removeUserFromCollection?.errors) {
      toast({
        title: 'Ooops!',
        description: res.data.removeUserFromCollection.errors[0].message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    onRemoveUserClose();
    await refreshUserList({
      variables: {
        collectionId,
      },
    });
  }, [
    removeUserFromCollection,
    username,
    collectionId,
    onRemoveUserClose,
    toast,
    refreshUserList,
  ]);

  return (
    <Flex justifyContent={'space-between'} borderBottom={'1px'} p={1}>
      <Flex alignItems={'center'}>{username}</Flex>
      <IconButton
        aria-label="remove"
        icon={<DeleteIcon />}
        size={'sm'}
        color={'red'}
        onClick={onRemoveUserOpen}
      ></IconButton>

      <ConfirmationModal
        header="Remove user from collection?"
        message={`Are you sure you want to remove ${username} from this collection?`}
        messageHighlight={username}
        warning={`This action can't be undone!`}
        warningHightlight={'undone'}
        isOpen={isRemoveUsersOpen}
        onClose={onRemoveUserClose}
        onConfirm={removeUser}
      />
    </Flex>
  );
};

export default CollectionUserItem;
