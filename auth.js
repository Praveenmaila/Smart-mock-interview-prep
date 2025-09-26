// Authentication JavaScript for Login and Registration Pages
document.addEventListener("DOMContentLoaded", function () {
  // Get current page type
  const isLoginPage = document.getElementById("loginForm") !== null;
  const isRegisterPage = document.getElementById("registerForm") !== null;

  // Initialize page-specific functionality
  if (isLoginPage) {
    initializeLoginPage();
  } else if (isRegisterPage) {
    initializeRegisterPage();
  }

  // Common functionality for both pages
  initializeCommonFeatures();
});

// Login Page Initialization
function initializeLoginPage() {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const authBtn = document.querySelector(".auth-btn");

  // Password toggle functionality
  togglePassword.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    this.querySelector("i").classList.toggle("fa-eye");
    this.querySelector("i").classList.toggle("fa-eye-slash");
  });

  // Form submission
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateLoginForm()) {
      simulateLogin();
    }
  });

  // Real-time validation
  emailInput.addEventListener("blur", function () {
    validateEmail(this.value, "emailError");
  });

  passwordInput.addEventListener("blur", function () {
    validatePassword(this.value, "passwordError", false);
  });

  // Social login buttons
  initializeSocialLogin();
}

// Register Page Initialization
function initializeRegisterPage() {
  const registerForm = document.getElementById("registerForm");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const togglePassword = document.getElementById("togglePassword");
  const toggleConfirmPassword = document.getElementById(
    "toggleConfirmPassword"
  );

  // Password toggle functionality
  if (togglePassword) {
    togglePassword.addEventListener("click", function () {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.querySelector("i").classList.toggle("fa-eye");
      this.querySelector("i").classList.toggle("fa-eye-slash");
    });
  }

  if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener("click", function () {
      const type =
        confirmPasswordInput.getAttribute("type") === "password"
          ? "text"
          : "password";
      confirmPasswordInput.setAttribute("type", type);
      this.querySelector("i").classList.toggle("fa-eye");
      this.querySelector("i").classList.toggle("fa-eye-slash");
    });
  }

  // Password strength indicator
  passwordInput.addEventListener("input", function () {
    updatePasswordStrength(this.value);
  });

  // Confirm password validation
  confirmPasswordInput.addEventListener("input", function () {
    validatePasswordMatch(passwordInput.value, this.value);
  });

  // Form submission
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateRegisterForm()) {
      simulateRegistration();
    }
  });

  // Real-time validation for all fields
  const inputs = registerForm.querySelectorAll("input[required]");
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });
  });

  // Social login buttons
  initializeSocialLogin();
}

// Common Features Initialization
function initializeCommonFeatures() {
  // Add loading animation to auth button
  const authBtn = document.querySelector(".auth-btn");
  if (authBtn) {
    authBtn.addEventListener("click", function () {
      if (!this.classList.contains("loading")) {
        this.classList.add("loading");
      }
    });
  }

  // Input focus effects
  const inputs = document.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      this.parentElement.classList.remove("focused");
    });
  });
}

// Login Form Validation
function validateLoginForm() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  let isValid = true;

  if (!validateEmail(email, "emailError")) {
    isValid = false;
  }

  if (!validatePassword(password, "passwordError", false)) {
    isValid = false;
  }

  return isValid;
}

// Register Form Validation
function validateRegisterForm() {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const agreeTerms = document.getElementById("agreeTerms").checked;

  let isValid = true;

  if (!validateName(firstName, "firstNameError", "First name")) {
    isValid = false;
  }

  if (!validateName(lastName, "lastNameError", "Last name")) {
    isValid = false;
  }

  if (!validateEmail(email, "emailError")) {
    isValid = false;
  }

  if (!validatePassword(password, "passwordError", true)) {
    isValid = false;
  }

  if (!validatePasswordMatch(password, confirmPassword)) {
    isValid = false;
  }

  if (!agreeTerms) {
    showError("agreeTermsError", "You must agree to the terms and conditions");
    isValid = false;
  } else {
    clearError("agreeTermsError");
  }

  return isValid;
}

// Individual Field Validation
function validateField(input) {
  const value = input.value;
  const fieldName = input.name;
  const errorId = fieldName + "Error";

  switch (fieldName) {
    case "firstName":
    case "lastName":
      return validateName(
        value,
        errorId,
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      );
    case "email":
      return validateEmail(value, errorId);
    case "password":
      return validatePassword(value, errorId, true);
    default:
      return true;
  }
}

// Validation Functions
function validateName(name, errorId, fieldName) {
  if (!name.trim()) {
    showError(errorId, `${fieldName} is required`);
    return false;
  } else if (name.trim().length < 2) {
    showError(errorId, `${fieldName} must be at least 2 characters`);
    return false;
  } else if (!/^[a-zA-Z\s]+$/.test(name)) {
    showError(errorId, `${fieldName} can only contain letters and spaces`);
    return false;
  } else {
    clearError(errorId);
    return true;
  }
}

function validateEmail(email, errorId) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    showError(errorId, "Email is required");
    return false;
  } else if (!emailRegex.test(email)) {
    showError(errorId, "Please enter a valid email address");
    return false;
  } else {
    clearError(errorId);
    return true;
  }
}

function validatePassword(password, errorId, isRegistration = false) {
  if (!password) {
    showError(errorId, "Password is required");
    return false;
  } else if (isRegistration && password.length < 8) {
    showError(errorId, "Password must be at least 8 characters long");
    return false;
  } else if (
    isRegistration &&
    !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
  ) {
    showError(
      errorId,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    );
    return false;
  } else {
    clearError(errorId);
    return true;
  }
}

function validatePasswordMatch(password, confirmPassword) {
  const errorId = "confirmPasswordError";

  if (!confirmPassword) {
    showError(errorId, "Please confirm your password");
    return false;
  } else if (password !== confirmPassword) {
    showError(errorId, "Passwords do not match");
    return false;
  } else {
    clearError(errorId);
    return true;
  }
}

// Password Strength Indicator
function updatePasswordStrength(password) {
  const strengthBar = document.querySelector(".strength-fill");
  const strengthText = document.querySelector(".strength-text");

  if (!strengthBar || !strengthText) return;

  let strength = 0;
  let strengthLabel = "";

  // Check password criteria
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;

  // Update strength indicator
  strengthBar.className = "strength-fill";

  switch (strength) {
    case 0:
    case 1:
      strengthBar.classList.add("weak");
      strengthLabel = "Weak";
      break;
    case 2:
      strengthBar.classList.add("fair");
      strengthLabel = "Fair";
      break;
    case 3:
    case 4:
      strengthBar.classList.add("good");
      strengthLabel = "Good";
      break;
    case 5:
      strengthBar.classList.add("strong");
      strengthLabel = "Strong";
      break;
  }

  strengthText.textContent = password
    ? `Password strength: ${strengthLabel}`
    : "Password strength";
}

// Error Handling Functions
function showError(errorId, message) {
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.opacity = "1";

    // Add invalid class to input container
    const inputContainer = errorElement.previousElementSibling;
    if (
      inputContainer &&
      inputContainer.classList.contains("input-container")
    ) {
      inputContainer.classList.add("invalid");
      inputContainer.classList.remove("valid");
    }
  }
}

function clearError(errorId) {
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.opacity = "0";

    // Add valid class to input container
    const inputContainer = errorElement.previousElementSibling;
    if (
      inputContainer &&
      inputContainer.classList.contains("input-container")
    ) {
      inputContainer.classList.add("valid");
      inputContainer.classList.remove("invalid");
    }
  }
}

// Social Login Initialization
function initializeSocialLogin() {
  const socialButtons = document.querySelectorAll(".social-btn");

  socialButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const provider = this.classList.contains("google-btn")
        ? "Google"
        : this.classList.contains("github-btn")
        ? "GitHub"
        : "LinkedIn";

      // Add loading state
      this.style.opacity = "0.7";
      this.style.pointerEvents = "none";

      setTimeout(() => {
        this.style.opacity = "1";
        this.style.pointerEvents = "auto";
        showToast(`${provider} authentication will be available soon!`, "info");
      }, 1000);
    });
  });
}

// Simulate Login Process
function simulateLogin() {
  const authBtn = document.querySelector(".auth-btn");
  const email = document.getElementById("email").value;

  // Show loading state
  authBtn.classList.add("loading");

  // Simulate API call
  setTimeout(() => {
    authBtn.classList.remove("loading");

    // Show success message
    showToast(`Welcome back! Redirecting to dashboard...`, "success");

    // Simulate redirect to dashboard
    setTimeout(() => {
      showToast(
        "Dashboard feature coming soon! For now, redirecting to home page.",
        "info"
      );
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    }, 1500);
  }, 2000);
}

// Simulate Registration Process
function simulateRegistration() {
  const authBtn = document.querySelector(".auth-btn");
  const firstName = document.getElementById("firstName").value;

  // Show loading state
  authBtn.classList.add("loading");

  // Simulate API call
  setTimeout(() => {
    authBtn.classList.remove("loading");

    // Show success message
    showToast(
      `Welcome to Smart Mock Interview Prep, ${firstName}! Account created successfully.`,
      "success"
    );

    // Simulate redirect to dashboard or login
    setTimeout(() => {
      showToast("Redirecting to login page...", "info");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    }, 2000);
  }, 2500);
}

// Toast Notification System
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  const toastIcon = toast.querySelector(".toast-icon");
  const toastMessage = toast.querySelector(".toast-message");

  // Set toast content
  toastMessage.textContent = message;

  // Set toast type and icon
  toast.className = `toast ${type}`;

  switch (type) {
    case "success":
      toastIcon.className = "toast-icon fas fa-check-circle";
      break;
    case "error":
      toastIcon.className = "toast-icon fas fa-exclamation-circle";
      break;
    case "info":
    default:
      toastIcon.className = "toast-icon fas fa-info-circle";
      break;
  }

  // Show toast
  toast.classList.add("show");

  // Hide toast after 4 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add smooth animations on page load
window.addEventListener("load", function () {
  const authForm = document.querySelector(".auth-form");
  const brandingContent = document.querySelector(".branding-content");

  if (authForm) {
    authForm.style.opacity = "0";
    authForm.style.transform = "translateY(20px)";

    setTimeout(() => {
      authForm.style.transition = "all 0.6s ease";
      authForm.style.opacity = "1";
      authForm.style.transform = "translateY(0)";
    }, 100);
  }

  if (brandingContent) {
    brandingContent.style.opacity = "0";
    brandingContent.style.transform = "translateX(-20px)";

    setTimeout(() => {
      brandingContent.style.transition = "all 0.6s ease";
      brandingContent.style.opacity = "1";
      brandingContent.style.transform = "translateX(0)";
    }, 200);
  }
});

// Handle form reset on page navigation
window.addEventListener("beforeunload", function () {
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    if (form.checkValidity) {
      form.reset();
    }
  });
});
