import {
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DeleteIcon,
  HamburgerIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Center,
  CircularProgress,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import {
  RequestMethods,
  useCollectionRequestsQuery,
  useCreateRequestInCollectionMutation,
  useDeleteCollectionMutation,
  useDeleteRequestMutation,
} from '../../generated/graphql';
import RequestListItem from './RequestListItem';
import ConfirmationModal from '../ConfirmationModal';
import CollectionUsersModal from './CollectionUsersModal';

interface CollectionListItemProps {
  collectionName: string;
  collectionId: string;
  refreshCollectionList: () => Promise<void>;
}

export const CollectionListItem: React.FC<CollectionListItemProps> = ({
  collectionName,
  collectionId,
  refreshCollectionList,
}) => {
  const [{ data, fetching }, getCollectionRequests] =
    useCollectionRequestsQuery({
      variables: { collectionId },
      pause: true,
      requestPolicy: 'network-only',
    });
  const toast = useToast();
  const [, deleteCollectionMutation] = useDeleteCollectionMutation();
  const [, createNewRequestMutation] = useCreateRequestInCollectionMutation();
  const [, deleteRequestMutation] = useDeleteRequestMutation();
  const [requestListOpen, setRequestListOpen] = useState(false);
  const {
    isOpen: isCollectionUsersOpen,
    onOpen: onCollectionUserOpen,
    onClose: onCollectionUserClose,
  } = useDisclosure();
  const {
    isOpen: isConfirmModalOpen,
    onOpen: onConfirmModalOpen,
    onClose: onConfirmModalClose,
  } = useDisclosure();

  const deleteCollection = useCallback(async () => {
    const res = await deleteCollectionMutation({
      collectionId,
    });

    if (res.data?.deleteCollection?.errors) {
      toast({
        title: 'Ooops!',
        description: 'Something went wrong, collection was not deleted.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    onConfirmModalClose();
    await refreshCollectionList();
  }, [
    collectionId,
    deleteCollectionMutation,
    onConfirmModalClose,
    toast,
    refreshCollectionList,
  ]);

  const createNewRequest = useCallback(async () => {
    const res = await createNewRequestMutation({
      inputData: {
        name: 'New Request',
        description: '',
        method: RequestMethods.Get,
        url: '',
        body: '',
        headers: [],
      },
      collectionId,
    });

    if (res.data?.createRequestInCollection.errors) {
      toast({
        title: 'Ooops!',
        description: 'Something went wrong, request was not created.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      await getCollectionRequests();
    }
  }, [collectionId, createNewRequestMutation, toast, getCollectionRequests]);

  const deleteRequest = useCallback(
    async (requestId: string) => {
      const res = await deleteRequestMutation({
        requestId,
      });

      if (res.data?.deleteRequest.errors) {
        toast({
          title: 'Ooops!',
          description: 'Something went wrong, request was not deleted.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        await getCollectionRequests();
      }
    },
    [deleteRequestMutation, toast, getCollectionRequests],
  );

  return (
    <>
      <Flex
        width={'100%'}
        height={'40px'}
        borderBottom="1px"
        padding={1}
        align={'center'}
        justifyContent="space-between"
      >
        <Flex>
          <IconButton
            aria-label="Open collection"
            icon={requestListOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
            size={'xs'}
            colorScheme="telegram"
            onClick={async () => {
              await getCollectionRequests();
              setRequestListOpen(() => !requestListOpen);
            }}
          />
          <Box textAlign={'left'} ml={2}>
            {collectionName}
          </Box>
        </Flex>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
            size={'xs'}
          />
          <MenuList>
            <MenuItem icon={<AddIcon />} onClick={() => createNewRequest()}>
              Add request
            </MenuItem>
            <MenuItem icon={<ViewIcon />} onClick={onCollectionUserOpen}>
              Users
            </MenuItem>
            <CollectionUsersModal
              collectionId={collectionId}
              isOpen={isCollectionUsersOpen}
              onClose={onCollectionUserClose}
            />

            <MenuItem
              icon={<DeleteIcon />}
              onClick={onConfirmModalOpen}
              color={'red'}
            >
              Delete collection
            </MenuItem>

            <ConfirmationModal
              header="Delete collection?"
              message={`Are you sure that you want to delete ${collectionName} collection?`}
              messageHighlight={collectionName}
              warning={`This action can't be undone!`}
              warningHightlight={'undone'}
              isOpen={isConfirmModalOpen}
              onClose={onConfirmModalClose}
              onConfirm={deleteCollection}
            ></ConfirmationModal>
          </MenuList>
        </Menu>
      </Flex>
      {!data || !requestListOpen ? null : (
        <>
          {fetching ? (
            <Center>
              <CircularProgress isIndeterminate />
            </Center>
          ) : (
            <Box cursor="pointer">
              {data?.collectionById.collection?.requests.map((req) => (
                <RequestListItem
                  key={req.id}
                  requestId={req.id}
                  name={req.name}
                  method={req.method}
                  deleteRequest={async () => {
                    await deleteRequest(req.id);
                  }}
                />
              ))}
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default CollectionListItem;
