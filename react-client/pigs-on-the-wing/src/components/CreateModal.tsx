import {
  Box,
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import InputField from './InputField';

interface CreateCollectionModalProps {
  header: string;
  fields: FormField[];
  isOpen: boolean;
  onSubmit: (values: any, helpers: FormikHelpers<any>) => Promise<void>;
  onClose: () => void;
}

interface FormField {
  name: string;
  label: string;
  placeholder?: string;
  textarea?: boolean;
}

const CreateModal: React.FC<CreateCollectionModalProps> = ({
  header,
  fields,
  isOpen,
  onSubmit,
  onClose,
}) => {
  const initValues: Record<string, string> = {};
  fields.forEach((field) => {
    initValues[field.name] = '';
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton></ModalCloseButton>

        <Formik
          initialValues={{ ...initValues }}
          onSubmit={async (values, helpers) => {
            await onSubmit(values, helpers);
          }}
        >
          {() => (
            <Form>
              <FormControl>
                <ModalBody>
                  {fields.map((field) => (
                    <Box key={field.name}>
                      <Box mt={4}>
                        <InputField
                          name={field.name}
                          placeholder={field.placeholder || ''}
                          label={field.label}
                          textarea={field.textarea || false}
                        />
                      </Box>
                    </Box>
                  ))}
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme={'telegram'} onClick={onClose}>
                    Close
                  </Button>
                  <Button variant={'ghost'} type="submit">
                    Save
                  </Button>
                </ModalFooter>
              </FormControl>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default CreateModal;
