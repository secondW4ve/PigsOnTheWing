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
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { RequestMethods } from '../../generated/graphql';
import { toHeadersArray } from '../../helpers/headers-array-to-object';
import { RequestHeader } from '../../interfaces/redux.interfaces';
import * as responseDataActions from '../../redux/slices/response-data.slice';
import { restCallService } from '../../services/rest-calls.service';

interface RequestOptionsProps {
  method: RequestMethods;
  setMethod: React.Dispatch<React.SetStateAction<RequestMethods>>;
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  body: string;
  setBody: React.Dispatch<React.SetStateAction<string>>;
  headers: RequestHeader[];
  setHeaders: React.Dispatch<React.SetStateAction<RequestHeader[]>>;
}

const RequestOptions: React.FC<RequestOptionsProps> = ({
  method,
  setMethod,
  url,
  setUrl,
  headers,
  setHeaders,
  body,
  setBody,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const updateHeader = (index: number, prop: string, newValue: string) => {
    const header: any = headers[index];
    header[prop] = newValue;
    setHeaders((headers) => {
      headers.splice(index, 1, header);
      return [...headers];
    });
  };
  const deleteHeader = (index: number) => {
    setHeaders((headers) => {
      headers.splice(index, 1);

      return [...headers];
    });
  };

  const performRequest = async () => {
    dispatch(responseDataActions.setFetching({ fetching: true }));
    dispatch(responseDataActions.clearResponseData());

    try {
      const result = await restCallService.doCall(method, url, headers, body);

      dispatch(
        responseDataActions.setBody({
          body: JSON.stringify(result.data, null, 4),
        }),
      );
      dispatch(responseDataActions.setStatus({ status: result.status }));
      dispatch(
        responseDataActions.setStatusText({ statusText: result.statusText }),
      );
      dispatch(
        responseDataActions.setHeaders({
          headers: toHeadersArray(result.headers),
        }),
      );
      dispatch(responseDataActions.setFetching({ fetching: false }));
    } catch (err: any) {
      toast({
        title: 'Ooops!',
        description: err.message || 'Request failed by me, sorry :(',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction={'column'} mt={2}>
      <Flex>
        <Select
          width={'135px'}
          value={method}
          variant={'filled'}
          onChange={(event) => setMethod(event.target.value as RequestMethods)}
        >
          {Object.values(RequestMethods).map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </Select>
        <Input
          placeholder="http://localhost:8000"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
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
              {headers
                ? headers.map((header, index) => (
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
                  setHeaders((headersList) => [
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
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default RequestOptions;
