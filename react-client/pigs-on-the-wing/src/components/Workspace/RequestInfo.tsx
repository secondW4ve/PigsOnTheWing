import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Input,
  Textarea,
} from '@chakra-ui/react';
import React, { useState } from 'react';

interface RequestInfoProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  description?: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

const RequestInfo: React.FC<RequestInfoProps> = ({
  name,
  setName,
  description,
  setDescription,
}) => {
  const [editing, setEditing] = useState(false);

  return (
    <Flex direction={'column'} borderTop={'1px'} borderBottom={'1px'} p={2}>
      <Flex justifyContent={'space-between'}>
        {!editing ? (
          <Heading size={'md'}>{name || 'Empty name'}</Heading>
        ) : (
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
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
        <Box mt={2}>{description || '-'}</Box>
      ) : (
        <Textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          mr={2}
        />
      )}
    </Flex>
  );
};

export default RequestInfo;
