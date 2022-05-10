export function mapValidationErrors(errors) {
  const mappedErrors = [];

  Object.keys(errors).forEach(name => {
    mappedErrors.push({
      name,
      type: 'SSE',
      message: errors[name][0],
    });
  });

  return mappedErrors;
}
