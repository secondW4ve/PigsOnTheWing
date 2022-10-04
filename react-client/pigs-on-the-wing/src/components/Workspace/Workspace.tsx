import {
  Box,
  Center,
  CircularProgress,
  Flex,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useCreateRequestInCollectionMutation,
  useUpdateRequestMutation,
} from '../../generated/graphql';
import { requestDataSelector } from '../../redux/slices/request-data.slice';
import { responseDataSelector } from '../../redux/slices/response-data.slice';
import { AppDispatch } from '../../redux/store';
import RequestInfo from './RequestInfo';
import RequestOptions from './RequestOptions';
import ResponseData from './ResponseData';
import * as requestDataAction from '../../redux/slices/request-data.slice';
import SelectCollectionModal from '../SelectCollectionModal';

interface WorkspaceProps {}

const Workspace: React.FC<WorkspaceProps> = ({}) => {
  const selectedRequest = useSelector(requestDataSelector);
  const responseData = useSelector(responseDataSelector);
  const [nameValue, setNameValue] = useState(selectedRequest.name);
  const [methodValue, setMethodValue] = useState(selectedRequest.method);
  const [urlValue, setUrlValue] = useState(selectedRequest.url);
  const [headersList, setHeadersList] = useState(selectedRequest.headers);
  const [bodyValue, setBodyValue] = useState(selectedRequest.body || '');
  const [descriptionValue, setDescriptionValue] = useState(
    selectedRequest.description || '',
  );
  useEffect(() => {
    setNameValue(selectedRequest.name);
  }, [selectedRequest.name]);
  useEffect(() => {
    setMethodValue(selectedRequest.method);
  }, [selectedRequest.method]);
  useEffect(() => {
    setUrlValue(selectedRequest.url);
  }, [selectedRequest.url]);
  useEffect(() => {
    setHeadersList(selectedRequest.headers);
  }, [selectedRequest.headers]);
  useEffect(() => {
    setBodyValue(selectedRequest.body || '');
  }, [selectedRequest.body]);
  useEffect(() => {
    setDescriptionValue(selectedRequest.description || '');
  }, [selectedRequest.description]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [, updateRequestData] = useUpdateRequestMutation();
  const [, createRequest] = useCreateRequestInCollectionMutation();
  const toast = useToast();
  const dispatch: AppDispatch = useDispatch();

  const handleSaveHotkey = useCallback(
    async (event: any) => {
      if (event.ctrlKey === true && event.key === 's') {
        event.preventDefault();
        if (selectedRequest.id) {
          console.log('Updating....');
          const res = await updateRequestData({
            requestId: selectedRequest.id,
            requestData: {
              name: nameValue,
              description: descriptionValue,
              method: methodValue,
              url: urlValue,
              body: bodyValue,
              headers: [...headersList],
            },
          });
          if (res.data?.updateRequest.errors) {
            toast({
              title: 'Ooops!',
              description: res.data.updateRequest.errors[0].message,
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
          } else {
            dispatch(requestDataAction.clearRequestData());
            dispatch(
              requestDataAction.setRequestData(res.data?.updateRequest.request),
            );
            toast({
              title: 'Yeah!',
              description: 'Request was updated!',
              status: 'success',
              duration: 2000,
              isClosable: true,
            });
          }
        } else {
          console.log('Saving...');
          onOpen();
        }
      }
    },
    [
      selectedRequest.id,
      bodyValue,
      descriptionValue,
      nameValue,
      methodValue,
      headersList,
      urlValue,
      dispatch,
      toast,
      updateRequestData,
      onOpen,
    ],
  );

  const onRequestSave = useCallback(
    async (collectionId: string) => {
      await createRequest({
        inputData: {
          name: nameValue,
          description: descriptionValue,
          method: methodValue,
          url: urlValue,
          body: bodyValue,
          headers: [...headersList],
        },
        collectionId,
      });

      onClose();
      toast({
        title: 'Yeah!',
        description: 'Request was saved!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    },
    [
      bodyValue,
      createRequest,
      descriptionValue,
      headersList,
      methodValue,
      nameValue,
      urlValue,
      onClose,
      toast,
    ],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleSaveHotkey);

    return () => {
      document.removeEventListener('keydown', handleSaveHotkey);
    };
  });
  return (
    <Box height={'100%'}>
      <Flex direction={'column'} p={2} height={'100%'}>
        {selectedRequest.loading ? (
          <Center>
            <CircularProgress isIndeterminate />
          </Center>
        ) : (
          <RequestInfo
            name={nameValue}
            setName={setNameValue}
            description={descriptionValue}
            setDescription={setDescriptionValue}
          />
        )}
        <RequestOptions
          method={methodValue}
          setMethod={setMethodValue}
          url={urlValue}
          setUrl={setUrlValue}
          headers={headersList}
          setHeaders={setHeadersList}
          body={bodyValue}
          setBody={setBodyValue}
        />
        <ResponseData
          body={responseData.body}
          fetching={responseData.fetching}
          headers={responseData.headers}
          status={responseData.status}
          statusText={responseData.statusText}
        />
      </Flex>
      <SelectCollectionModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={onRequestSave}
      />
    </Box>
  );
};

export default Workspace;
