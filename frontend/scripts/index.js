

//  Login and sign up form switcher
const loginSwitcher = document.getElementById('loginSwitcher'),
    signupSwitcher = document.getElementById('signupSwitcher'),
    signInForm = document.getElementById('signInForm'),
    signUpForm = document.getElementById('signUpForm'),
    nextSignUpForm = document.getElementById('nextSignUpForm'),
    backgroundSwitcher = document.querySelector('.background-switcher'),
    formHeader = document.getElementById('formIdentifier'),
    nextButton = document.getElementById('nextButton');

const getCurrentActiveForm = () => {
    return signUpForm.classList.contains("active-form") ? 'signUp' : 'signIn';
}

const hideSignInFrom = () => {
    signInForm.classList.remove("active-form");
    loginSwitcher.classList.remove("active");
    setTimeout(() => {
    }, 100)

}

const hideSignUpForm = (removeActive = true) => {
    removeActive ? backgroundSwitcher.classList.remove("signup-switch") : null;
    removeActive ? signupSwitcher.classList.remove("active") : null;
    signUpForm.classList.remove("active-form");
}

const hideNextSignUpForm = () => {
    nextSignUpForm.classList.remove("active-form");
}

const showSignUpForm = (current) => {
    if (current == 'signIn') {
        hideSignInFrom();
        hideNextSignUpForm();
        formHeader.textContent = "Signup";
        backgroundSwitcher.classList.add("signup-switch");
        signupSwitcher.classList.add('active');
        signUpForm.style.display = "flex";
        signUpForm.classList.add('active-form');
    } else return;
}

const showSignInForm = (current) => {
    if (current == 'signUp') {
        hideSignUpForm();
        hideNextSignUpForm();
        formHeader.textContent = "Login";
        loginSwitcher.classList.add('active');
        signInForm.style.display = "flex";
        signInForm.classList.add('active-form');
    } else return;
}

signupSwitcher.addEventListener('click', () => {
    let current = getCurrentActiveForm();
    showSignUpForm(current)
});

loginSwitcher.addEventListener('click', () => {
    let current = getCurrentActiveForm();
    showSignInForm(current)
});

nextButton.addEventListener('click', () => {
    let current = getCurrentActiveForm();
    hideSignInFrom();
    if (current == 'signUp') {
        hideSignUpForm(false);
    } else {
        hideSignUpForm();
    }
    nextSignUpForm.classList.add('active-form');
})