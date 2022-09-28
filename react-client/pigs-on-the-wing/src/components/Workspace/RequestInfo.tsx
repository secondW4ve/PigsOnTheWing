import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Input,
  Textarea,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

interface RequestInfoProps {
  name: string;
  description?: string;
}

const RequestInfo: React.FC<RequestInfoProps> = ({ name, description }) => {
  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(name);
  const [descriptionValue, setDescriptionValue] = useState(description || '');
  useEffect(() => {
    setNameValue(name);
  }, [name]);
  useEffect(() => {
    setDescriptionValue(description || '');
  }, [description]);

  return (
    <Flex direction={'column'} borderTop={'1px'} borderBottom={'1px'} p={2}>
      <Flex justifyContent={'space-between'}>
        {!editing ? (
          <Heading size={'md'}>{nameValue || 'Empty name'}</Heading>
        ) : (
          <Input
            value={nameValue}
            onChange={(event) => setNameValue(event.target.value)}
            mr={2}
            height={'30px'}
          />
        )}
        <IconButton
          aria-label="edit request name"
          icon={<EditIcon />}
          size="xs"
          onClick={() => setEditing((value) => !value)}
        ></IconButton>
      </Flex>
      {!editing ? (
        <Box mt={2}>{descriptionValue || '-'}</Box>
      ) : (
        <Textarea
          value={descriptionValue}
          onChange={(event) => setDescriptionValue(event.target.value)}
          mr={2}
        />
      )}
    </Flex>
  );
};

export default RequestInfo;
