export interface CredentialsValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}
