

// check if user already logged in
if (localStorage.getItem('access_token')) {
    window.location.href = "./dating.html"
} else {
    //  Login and sign up form switcher

    // Variables
    const loginSwitcher = document.getElementById('loginSwitcher'),
        signupSwitcher = document.getElementById('signupSwitcher'),
        signInForm = document.getElementById('signInForm'),
        signUpForm = document.getElementById('signUpForm'),
        nextSignUpForm = document.getElementById('nextSignUpForm'),
        backgroundSwitcher = document.querySelector('.background-switcher'),
        formHeader = document.getElementById('formIdentifier'),
        nextButton = document.getElementById('nextButton');

    // Getting on what form current user is
    const getCurrentActiveForm = () => {
        return (signUpForm.classList.contains("active-form") || nextSignUpForm.classList.contains("active-form")) ? 'signUp' : 'signIn';
    }

    const hideSignInFrom = () => {
        signInForm.classList.remove("active-form");
        loginSwitcher.classList.remove("active");
        setTimeout(() => {
        }, 100)

    }

    const hideSignUpForm = (removeActive = true) => {
        // removeActive is used for switching to next form, we don't want to remove sign up tab highlight
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
        // TODO: Add validation to check if password and confirmed password are the same
        if (signUpForm.checkValidity()) {
            hideSignInFrom();
            if (current == 'signUp') {
                hideSignUpForm(false);
            } else {
                hideSignUpForm();
            }
            nextSignUpForm.classList.add('active-form');
        } else return;
    })



    // Sign up and sign in functionality
    const nameInput = document.getElementById('signUpName'),
        emailInput = document.getElementById('signupEmailAddress'),
        passwordInput = document.getElementById('signupPassword'),
        ageInput = document.getElementById('ageInput'),
        maleGender = document.getElementById('maleGender'),
        femaleGender = document.getElementById('femaleGender'),
        malePreference = document.getElementById('malePreference'),
        femalePreference = document.getElementById('femalePreference'),
        result = document.getElementById('authResult');


    const baseUrl = 'http://127.0.0.1:8000/api';

    const register = (name, email, password, age, gender, preference) => {
        axios({
            method: "POST",
            url: baseUrl + '/auth/register',
            data: {
                name,
                email,
                password,
                age,
                gender,
                preference
            },
            headers: { "Content-Type": "multipart/form-data" },
        }).then((response) => {
            let data = response.data;
            let status = data.status;
            result.textContent = "";
            if (status) {
                result.dataset.status = "ok";
                result.textContent = "Successfully registered. Redirecting to sign in";
                result.hidden = false;
                setTimeout(() => {
                    window.location.reload();
                }, 2000)
            } else {
                result.dataset.status = "error";
                result.hidden = false;
                let errors = data.error;
                for (let i of Object.keys(errors)) {
                    result.innerHTML += `${errors[i]}<br>`;
                }
            }
        })
    }

    nextSignUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const gender = maleGender.checked ? 'male' : 'female',
            preference = malePreference.checked ? 'male' : 'female',
            name = nameInput.value,
            email = emailInput.value,
            password = passwordInput.value,
            age = ageInput.value;
        register(name, email, password, age, gender, preference);
    })

    // login
    const signInEmailInput = document.getElementById('signinEmailAddress'),
        signInPasswordInput = document.getElementById('signinPassword');

    const login = (email, password) => {
        axios({
            method: "POST",
            url: baseUrl + '/auth/login',
            data: {
                email,
                password,
            },
            headers: { "Content-Type": "multipart/form-data" },
        }).then((response) => {
            let data = response.data;
            let error = data.error;
            result.textContent = ""
            if (error) {
                result.dataset.status = "error";
                result.hidden = false;
                result.textContent = "Email or password incorrect";
            } else {
                let access_token = data.access_token;
                let user = data.user;
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('user_id', user.id);
                localStorage.setItem('user_age', user.age);
                localStorage.setItem('user_name', user.name);
                localStorage.setItem('user_email', user.email);
                localStorage.setItem('user_gender', user.gender);
                localStorage.setItem('user_preference', user.preference);
                localStorage.setItem('profile_src', '/backend/public/images/' + user.profile);
                localStorage.setItem('profile_check', user.profile == null ? false : true);
                result.dataset.status = "ok";
                result.textContent = "Successfully signed in as " + user.name;
                result.hidden = false;
                setTimeout(() => {
                    window.location.reload();
                }, 2000)
            }
        })
    }

    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = signInEmailInput.value,
            password = signInPasswordInput.value;

        login(email, password);
    })
}