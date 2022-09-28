import { Box, Flex } from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { requestDataSelector } from '../../redux/slices/request-data.slice';
import { responseDataSelector } from '../../redux/slices/response-data.slice';
import RequestInfo from './RequestInfo';
import RequestOptions from './RequestOptions';
import ResponseData from './ResponseData';

interface WorkspaceProps {}

const Workspace: React.FC<WorkspaceProps> = ({}) => {
  const selectedRequest = useSelector(requestDataSelector);
  const responseData = useSelector(responseDataSelector);

  const handleSaveHotkey = useCallback(
    (event: any) => {
      event.preventDefault();
      if (event.ctrlKey === true && event.key === 's') {
        if (selectedRequest.id) {
          console.log('Updating....');
        } else {
          console.log('Saving...');
        }
      }
    },
    [selectedRequest.id],
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
        <RequestInfo
          name={selectedRequest.name}
          description={selectedRequest.description}
        />
        <RequestOptions
          method={selectedRequest.method}
          url={selectedRequest.url}
          headers={selectedRequest.headers}
          body={selectedRequest.body}
        />
        <ResponseData
          body={responseData.body}
          fetching={responseData.fetching}
          headers={responseData.headers}
          status={responseData.status}
        />
      </Flex>
    </Box>
  );
};

export default Workspace;
