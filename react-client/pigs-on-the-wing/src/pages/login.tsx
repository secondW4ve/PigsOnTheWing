import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, Flex, FormControl, Link } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../helpers/to-error-map';
import { useRouter } from 'next/router';
import { validateCredentialsInput } from '../helpers/validate-credentials';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../helpers/create-urql-client';
import InputField from '../components/InputField';
import NextLink from 'next/link';

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();

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
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));

            return;
          } else if (response.data?.login.user) {
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
              <Flex mt={2} direction={'row-reverse'}>
                <NextLink href={'/register'}>
                  <Button colorScheme="cyan" variant={'link'} ml={1}>
                    register
                  </Button>
                </NextLink>
                Don't have an account?{' '}
              </Flex>
              <Button
                mt={4}
                type="submit"
                colorScheme={'teal'}
                isLoading={isSubmitting}
              >
                Login
              </Button>
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Login);
