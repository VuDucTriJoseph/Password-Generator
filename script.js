const passwordInput = document.getElementById("password");
const copyButton = document.getElementById("copy-btn");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowerscaseCheckbox = document.getElementById("lowercase");
const numberCheckbox = document.getElementById("number");
const symbolsCheckbox = document.getElementById("symbols");
const strengthLabel = document.getElementById("strength-label");
const generateButton = document.getElementById("generate-btn");
const strengthBar = document.querySelector(".strength-bar");
const strengthText = document.querySelector(".strength-container p");

const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,./<>?";

// control length value when length slidebar move

lengthSlider.addEventListener("input", () => {
  lengthDisplay.textContent = lengthSlider.value;
});

generateButton.addEventListener("click", makePassword);

function makePassword() {
  // get all input value

  const length = Number(lengthSlider.value); // because fist value is a string
  const includeUppercase = uppercaseCheckbox.checked;
  const includeLowerscase = lowerscaseCheckbox.checked;
  const includeNumbers = numberCheckbox.checked;
  const includeSymbols = symbolsCheckbox.checked;
  //   console.log(length);
  if (
    !includeUppercase &&
    !includeLowerscase &&
    !includeNumbers &&
    !includeSymbols
  ) {
    alert("Please seclect as least one char type");
    return;
  }

  const newPassword = createRandomPassword(
    length,
    includeUppercase,
    includeLowerscase,
    includeNumbers,
    includeSymbols,
  );

  passwordInput.value = newPassword;
  updateStrengthMeter(newPassword);
}

function updateStrengthMeter(password) {
  const length = password.length;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[@#$%^&*()-_=+[\]{}|;:,.<>?]/.test(password);

  let strengthScore = 0;

  strengthScore += Math.min(length * 2, 40);

  if (hasUppercase) strengthScore += 15;
  if (hasLowercase) strengthScore += 15;
  if (hasNumber) strengthScore += 15;
  if (hasSymbol) strengthScore += 15;

  // enforce minimun score for every short password
  if (length < 8) {
    strengthScore = Math.min(strengthScore, 40);
  }

  // ensure  the width of the strength bar is 5 to 100

  const safeScore = Math.max(5, Math.min(100, strengthScore));
  strengthBar.style.width = safeScore + "%";

  // --week-color: #fc8181; --medium-color: #fbd38d;--strong-color: #68d391;

  let strengthColor = "";
  let strengthTextLabel = "";

  if (strengthScore < 40) {
    strengthColor = "#fc8181";
    strengthTextLabel = "Week";
  } else if (strengthScore < 70) {
    strengthColor = "#fbd38d";
    strengthTextLabel = "Medium";
  } else {
    strengthColor = "#68d391";
    strengthTextLabel = "Strong";
  }
  strengthBar.style.backgroundColor = strengthColor;
  strengthLabel.textContent = strengthTextLabel;
}

function createRandomPassword(
  length,
  includeUppercase,
  includeLowerscase,
  includeNumbers,
  includeSymbols,
) {
  let allCharacters = "";

  if (includeUppercase) allCharacters += uppercaseLetters;
  if (includeLowerscase) allCharacters += lowercaseLetters;
  if (includeNumbers) allCharacters += numberCharacters;
  if (includeSymbols) allCharacters += symbolCharacters;

  // if all checked allCharacters ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/"

  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    password += allCharacters[randomIndex];
  }

  return password;
}

window.addEventListener("DOMContentLoaded", makePassword);
// add password into clipboard

copyButton.addEventListener("click", () => {
  if (!passwordInput.value) return;

  navigator.clipboard
    .writeText(passwordInput.value)
    .then(() => showCopySuccess())
    .catch((error) => console.log("Could not copy", error));
});

function showCopySuccess() {
  copyButton.classList.remove("far", "fa-copy");
  copyButton.classList.add("fas", "fa-check");
  copyButton.style.color = "#48bb78";

  setTimeout(() => {
    copyButton.classList.remove("fas", "fa-check");
    copyButton.classList.add("far", "fa-copy");
    copyButton.style.color = "";
  }, 1500);
}
