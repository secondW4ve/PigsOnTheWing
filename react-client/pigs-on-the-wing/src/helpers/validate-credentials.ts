import { ValidationErrorMessages } from '../enums/validation-error-messages.enum';
import { CredentialsValidationResult } from '../interfaces/user.interfaces';

export const validateCredentialsInput = (
  username: string,
  password: string,
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
};
