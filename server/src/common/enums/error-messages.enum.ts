export enum ErrorMessages {
  USER_WITH_THIS_USERNAME_DOES_NOT_EXIST = 'User with such username does not exist',
  USERNAME_ALREADY_TAKEN = 'This username has been already taken',
  INCORRECT_PASSWORD = 'Password is incorrect',
  REQUEST_WITH_ID_DOES_NOT_EXIST = 'Request with provided id does not exist',
  REQUEST_WITH_NAME_ALREADY_EXIST = 'Request with provided name already exists in collection',
  COLLECTION_WITH_ID_DOES_NOT_EXIST = 'Collection with provided id does not exist',
  HEADER_WITH_ID_DOES_NOT_EXIST = 'Header with provided id does not exist',
  YOU_CANNOT_MODIFY_COLLECTION = 'Only owner can modify collection and add / remove users to it',
  USER_DOES_NOT_HAVE_ACCESS = 'This user does not have access to this collection',
  OWNER_CANNOT_REMOVE_ITSELF = 'Owner cannot remove itself from Collection',
  USER_ALREADY_HAVE_ACCESS = 'This user already has access to this collection',
}
