import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, FormControl } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { CredentialsValidationResult } from '../interfaces/user.interfaces';
import { ValidationErrorMessages } from '../enums/validation-error-messages.enum';
import { toErrorMap } from '../helpers/to-error-map';
import { useRouter } from 'next/router';

interface registerProps {

}

export const Register: React.FC<registerProps> = ({ }) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  const validateInput = (
    username: string,
    password: string
  ): CredentialsValidationResult => {
    const result: CredentialsValidationResult = {
      valid: true,
      errors: {},
    };
    if (!username.match(/^[a-z0-9_-]{3,15}$/g)) {
      result.valid = false;
      result.errors['username'] = ValidationErrorMessages.USERNAME;
    }
    if (!password.match(/\S{3,20}/)) {
      result.valid = false;
      result.errors['password'] = ValidationErrorMessages.PASSWORD;
    }

    return result;
  }

  return (
    <Wrapper>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const validationResult = validateInput(values.username, values.password);
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
                name='username'
                placeholder='username'
                label='Username'
              />
              <Box mt={4}>
                <InputField
                  name='password'
                  placeholder='password'
                  label='Password'
                  type='password'
                />
              </Box>
              <Button
                mt={4}
                type='submit'
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
}

export default Register;
