const validator = (shcema, body, status) => {
  const { value, error } = shcema.validate(body);
  if (error) {
    error.statusCode = status;
    throw error;
  }
  return value;
};

module.exports = validator;
