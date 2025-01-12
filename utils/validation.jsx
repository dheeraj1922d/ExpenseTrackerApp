export const validateLoginInputs = (credentials) => {
    const { username, password } = credentials;
  
    if (!username || username.trim().length === 0) {
      return 'Username is required';
    }
  
    if (!password || password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
  
    return null;
  };

  export const validateSignupInputs = (formData) => {
    const { firstName, lastName, username, email, phoneNo, password, confirmPassword } = formData;
  
    if (!firstName || firstName.trim().length < 2) {
      return 'First name must be at least 2 characters long';
    }
  
    if (!lastName || lastName.trim().length < 2) {
      return 'Last name must be at least 2 characters long';
    }
  
    if (!username || username.trim().length < 3) {
      return 'Username must be at least 3 characters long';
    }
  
    if (!email || !email.includes('@') || !email.includes('.')) {
      return 'Please enter a valid email address';
    }
  
    if (!phoneNo || phoneNo.length < 10) {
      return 'Please enter a valid phone number';
    }
  
    if (!password || password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
  
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
  
    return null;
  };