export const createUserValidationSchema = {
  username: {
    isString: true,
    notEmpty: {
      errorMessage: "Username must not be empty!",
    },
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "Username must be at least 3-32 characters",
    },
  },
  displayName: {
    notEmpty: {
      errorMessage: "Displayname must not be empty!",
    },
  },
};
