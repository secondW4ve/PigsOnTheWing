import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  IconButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RequestMethods, useRequestByIdQuery } from '../../generated/graphql';
import * as requestDataAction from '../../redux/slices/request-data.slice';
import { AppDispatch } from '../../redux/store';
import ConfirmationModal from '../ConfirmationModal';

interface RequestListItemProps {
  requestId: string;
  name: string;
  method: RequestMethods;
  selected: boolean;
  deleteRequest: () => Promise<void>;
}

const RequestListItem: React.FC<RequestListItemProps> = ({
  requestId,
  name,
  method,
  selected,
  deleteRequest,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [{ data }, getRequestById] = useRequestByIdQuery({
    pause: true,
    variables: {
      requestId,
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const determineMethodColor = useCallback((method: RequestMethods) => {
    if (method === RequestMethods.Get) {
      return 'green';
    } else if (method === RequestMethods.Post) {
      return 'blue';
    } else if (method === RequestMethods.Put) {
      return 'orange';
    } else if (method === RequestMethods.Delete) {
      return 'red';
    }
  }, []);

  const changeSelectedRequest = async () => {
    dispatch(requestDataAction.setLoading({ loading: true }));
    dispatch(requestDataAction.clearRequestData());
    await getRequestById({ requestPolicy: 'network-only' });
  };

  useEffect(() => {
    if (!data) {
      return;
    }
    if (data?.requestById.errors) {
      toast({
        title: 'Ooops!',
        description: data.requestById.errors[0].message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      dispatch(requestDataAction.setLoading({ loading: false }));
      const headersInfo = data?.requestById.request?.headers?.map((header) => ({
        name: header.name,
        value: header.value,
      }));
      dispatch(
        requestDataAction.setRequestData({
          ...data?.requestById.request,
          headers: headersInfo,
        }),
      );
    }
  }, [data, dispatch, toast]);

  return (
    <Flex
      p={1}
      borderRadius={'10px'}
      _hover={{ bg: '#EDF2F7' }}
      bg={selected ? '#EDF2F7' : '#FFFFFF'}
      onClick={() => changeSelectedRequest()}
    >
      <Box color={determineMethodColor(method)}>{method}</Box>
      <Box ml={1}>{name}</Box>
      <IconButton
        ml={'auto'}
        aria-label="Delete request"
        icon={<DeleteIcon />}
        size={'xs'}
        color={'red'}
        onClick={onOpen}
        border={'1px'}
      ></IconButton>
      <ConfirmationModal
        header="Delete request from collection?"
        message={`Are you sure you want to delete request ${name} from collection?`}
        messageHighlight={name}
        warning={`This action can't be undone!`}
        warningHightlight={`undone`}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={deleteRequest}
      />
    </Flex>
  );
};

export default RequestListItem;
