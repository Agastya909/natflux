function ValidateRequiredFields(body: {}, validateFields: string[]) {
  for (let i = 0; i < validateFields.length; i++) {
    if (!(validateFields[i] in body)) {
      return false;
    }
  }
  return true;
}

function ValidateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export default { ValidateRequiredFields, ValidateEmail };
