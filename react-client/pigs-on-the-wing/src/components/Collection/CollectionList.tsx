import { AddIcon } from '@chakra-ui/icons';
import {
  Center,
  CircularProgress,
  Flex,
  IconButton,
  List,
  Tooltip,
  useDisclosure,
  Heading,
  Box,
} from '@chakra-ui/react';
import { FormikHelpers } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import {
  useCreateCollectionMutation,
  useUserCollectionsQuery,
} from '../../generated/graphql';
import { toErrorMap } from '../../helpers/to-error-map';
import CollectionListItem from './CollectionListItem';
import CreateModal from '../CreateModal';
import { useSelector } from 'react-redux';
import { requestDataSelector } from '../../redux/slices/request-data.slice';

interface CollectionListProps {}

const CollectionList: React.FC<CollectionListProps> = ({}) => {
  // useIsAuth();
  const [isServer, setIsServer] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [{ data, fetching }, getUserCollections] = useUserCollectionsQuery({
    pause: isServer,
    requestPolicy: 'network-only',
  });
  useEffect(() => setIsServer(false), []);
  const [, createCollection] = useCreateCollectionMutation();
  const refreshCollectionList = useCallback(async () => {
    await getUserCollections();
  }, [getUserCollections]);

  const selectedRequest = useSelector(requestDataSelector);
  const [selectedRequestId, setSelectedRequestId] = useState(
    selectedRequest.id,
  );
  useEffect(() => {
    setSelectedRequestId(selectedRequest.id);
  }, [selectedRequest.id]);

  return (
    <Box>
      <Flex padding={1} justifyContent="space-between">
        <Heading ml={2} as="u" size={'md'}>
          Collections
        </Heading>
        <Tooltip label="Create new collection">
          <IconButton
            aria-label="Create new collection"
            icon={<AddIcon />}
            size={'xs'}
            colorScheme="telegram"
            onClick={onOpen}
          ></IconButton>
        </Tooltip>

        <CreateModal
          header="Create Collection"
          fields={[
            {
              name: 'name',
              label: 'Collection name',
              placeholder: 'Collection name',
            },
            {
              name: 'description',
              label: 'Description',
              placeholder: 'Description',
              textarea: true,
            },
          ]}
          onClose={onClose}
          onSubmit={async (values: any, helpers: FormikHelpers<any>) => {
            const response = await createCollection({
              collectionData: { ...values },
            });
            if (response.data?.createCollection.errors) {
              helpers.setErrors(
                toErrorMap(response.data.createCollection.errors),
              );

              return;
            }

            await refreshCollectionList();
            onClose();
          }}
          isOpen={isOpen}
        />
      </Flex>
      {fetching ? (
        <Center>
          <CircularProgress isIndeterminate />
        </Center>
      ) : (
        <List>
          {data?.userCollections.map((collection) => (
            <CollectionListItem
              key={collection.id}
              selectedRequestId={selectedRequestId}
              collectionId={collection.id}
              collectionName={collection.name}
              refreshCollectionList={refreshCollectionList}
            />
          ))}
        </List>
      )}
    </Box>
  );
};

export default CollectionList;
