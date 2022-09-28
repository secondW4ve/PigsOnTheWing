import {
  Box,
  Center,
  CircularProgress,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { RequestHeader } from '../../interfaces/redux.interfaces';

interface ResponseDataProps {
  body: string;
  headers: RequestHeader[];
  status: number | null;
  fetching: boolean;
}

const ResponseData: React.FC<ResponseDataProps> = ({
  body,
  headers,
  status,
  fetching,
}) => {
  const [bodyValue, setBodyValue] = useState(body);
  const [headersList, setHeadersList] = useState(headers);
  const [statusValue, setStatusValue] = useState(status);
  const [fetchingValue, setFetchingValue] = useState(fetching);
  useEffect(() => {
    setBodyValue(body);
  }, [body]);
  useEffect(() => {
    setHeadersList(headers);
  }, [headers]);
  useEffect(() => {
    setStatusValue(status);
  }, [status]);
  useEffect(() => {
    setFetchingValue(fetching);
  }, [fetching]);

  return (
    <Box height={'100%'} borderTop={'2px'} pt={2}>
      {fetchingValue ? (
        <Center>
          <CircularProgress isIndeterminate />
        </Center>
      ) : (
        <Tabs height={'100%'} display={'flex'} flexDirection={'column'}>
          <TabList>
            <Flex justifyContent={'space-between'} width={'100%'}>
              <Flex>
                <Tab>Body</Tab>
                <Tab>Headers</Tab>
              </Flex>
              <Box verticalAlign={'center'}>
                {statusValue ? `Response status: ${statusValue}` : ''}
              </Box>
            </Flex>
          </TabList>
          <TabPanels flex={'1'} display={'flex'}>
            <TabPanel flex={'1'}>
              <Textarea
                h={'100%'}
                resize={'none'}
                // readOnly={true}
                value={bodyValue}
                onChange={() => setBodyValue(bodyValue)}
              ></Textarea>
            </TabPanel>
            <TabPanel flex={'1'}>
              <Flex direction={'column'}>
                {headersList
                  ? headersList.map((header, index) => (
                      <Flex key={index}>
                        <Box
                          key={`response-name-${index}`}
                          flex={'1'}
                          border={'1px'}
                          p={'2px'}
                          pl={'5px'}
                        >
                          {header.name}
                        </Box>
                        <Box
                          key={`response-value-${index}`}
                          flex={'1'}
                          borderTop={'1px'}
                          borderRight={'1px'}
                          borderBottom={'1px'}
                          p={'2px'}
                          pl={'5px'}
                        >
                          {header.value}
                        </Box>
                      </Flex>
                    ))
                  : null}
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

export default ResponseData;
