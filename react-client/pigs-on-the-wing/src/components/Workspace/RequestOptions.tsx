import { DeleteIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  IconButton,
  Input,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RequestMethods } from '../../generated/graphql';
import { toHeadersArray } from '../../helpers/headers-array-to-object';
import { RequestHeader } from '../../interfaces/redux.interfaces';
import * as responseDataActions from '../../redux/slices/response-data.slice';
import { restCallService } from '../../services/rest-calls.service';

interface RequestOptionsProps {
  method: RequestMethods;
  url: string;
  body?: string;
  headers: RequestHeader[];
}

const RequestOptions: React.FC<RequestOptionsProps> = ({
  method,
  url,
  headers,
  body,
}) => {
  const [methodValue, setMethodValue] = useState(method);
  const [urlValue, setUrlValue] = useState(url);
  const [headersList, setHeadersList] = useState(headers);
  const [bodyValue, setBodyValue] = useState(body || '');
  useEffect(() => {
    setMethodValue(method);
  }, [method]);
  useEffect(() => {
    setUrlValue(url);
  }, [url]);
  useEffect(() => {
    setHeadersList(headers);
  }, [headers]);
  useEffect(() => {
    setBodyValue(body || '');
  }, [body]);
  const dispatch = useDispatch();

  const updateHeader = (index: number, prop: string, newValue: string) => {
    const header: any = headersList[index];
    header[prop] = newValue;
    setHeadersList((headers) => {
      headers.splice(index, 1, header);
      return [...headers];
    });
  };
  const deleteHeader = (index: number) => {
    setHeadersList((headers) => {
      headers.splice(index, 1);

      return [...headers];
    });
  };

  const performRequest = async () => {
    dispatch(responseDataActions.setFetching({ fetching: true }));
    const response = await restCallService.doCall(
      methodValue,
      urlValue,
      headersList,
      bodyValue,
    );

    dispatch(
      responseDataActions.setBody({
        body: JSON.stringify(response.data, null, 4),
      }),
    );
    dispatch(responseDataActions.setStatus({ status: response.status }));
    dispatch(
      responseDataActions.setHeaders({
        headers: toHeadersArray(response.headers),
      }),
    );
    dispatch(responseDataActions.setFetching({ fetching: false }));
    console.log(response);
  };

  return (
    <Flex direction={'column'} mt={2}>
      <Flex>
        <Select
          width={'135px'}
          value={methodValue}
          variant={'filled'}
          onChange={(event) =>
            setMethodValue(event.target.value as RequestMethods)
          }
        >
          {Object.values(RequestMethods).map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </Select>
        <Input
          placeholder="http://localhost:8000"
          value={urlValue}
          onChange={(event) => setUrlValue(event.target.value)}
          mr={2}
          ml={2}
        />
        <Button colorScheme={'telegram'} onClick={() => performRequest()}>
          Send
        </Button>
      </Flex>
      <Tabs isFitted variant="enclosed" h={'100%'} mt={2} mb={2}>
        <TabList>
          <Tab>Headers</Tab>
          <Tab>Body</Tab>
        </TabList>
        <TabPanels
          h={'400px'}
          borderLeft={'1px'}
          borderRight={'1px'}
          borderBottom={'1px'}
          borderColor={'#E2E8F0'}
        >
          <TabPanel>
            <Flex direction={'column'}>
              {headersList
                ? headersList.map((header, index) => (
                    <Flex key={index}>
                      <Input
                        key={`name-${index}`}
                        value={header.name}
                        name="header-name"
                        onChange={(event) =>
                          updateHeader(index, 'name', event.target.value)
                        }
                      />
                      <Input
                        key={`value-${index}`}
                        value={header.value}
                        name="header-value"
                        onChange={(event) =>
                          updateHeader(index, 'value', event.target.value)
                        }
                      />
                      <IconButton
                        ml={1}
                        aria-label="remove-header"
                        icon={<DeleteIcon />}
                        onClick={() => deleteHeader(index)}
                      />
                    </Flex>
                  ))
                : null}
              <Button
                ml={'auto'}
                mt={2}
                onClick={() =>
                  setHeadersList((headersList) => [
                    ...headersList,
                    { name: '', value: '' },
                  ])
                }
              >
                Add header
              </Button>
            </Flex>
          </TabPanel>
          <TabPanel h={'100%'}>
            <Textarea
              h={'100%'}
              resize={'none'}
              value={bodyValue}
              onChange={(event) => setBodyValue(event.target.value)}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default RequestOptions;
