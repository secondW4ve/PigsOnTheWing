import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, FormControl } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../helpers/to-error-map';
import { useRouter } from 'next/router';
import { validateCredentialsInput } from '../helpers/validate-credentials';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../helpers/create-urql-client';

interface RegisterProps {}

export const Register: React.FC<RegisterProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  return (
    <Wrapper>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const validationResult = validateCredentialsInput(
            values.username,
            values.password,
          );
          if (!validationResult.valid) {
            setErrors(validationResult.errors);

            return;
          }
          const response = await register(values);
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));

            return;
          } else if (response.data?.register.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              <InputField
                name="username"
                placeholder="username"
                label="Username"
              />
              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>
              <Button
                mt={4}
                type="submit"
                colorScheme={'teal'}
                isLoading={isSubmitting}
              >
                Register
              </Button>
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Register);
