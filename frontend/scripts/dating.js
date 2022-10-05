/**
 * @description Check whether user is logged in or no by checking token in localStorage
 * @action If user is not logged in redirect him to login page
 */

if (!localStorage.getItem('access_token')) {
    window.location.href = './index.html'
}


////////////////////////////////////////////////////////
/**
 * @description Linking section
 * @action Linking apis to frontend
 */

// Api link base URL
const baseUrl = 'http://127.0.0.1:8000/api';

/**
 * @description Check if user has profile picture or no
 * @action If there's no profile pop up profile upload screen
 */

// Variables
const profilePicker = document.querySelector('.profile-picker'),
    uploadInput = document.getElementById('uploadProfile'),
    profileResult = document.querySelector('.profile-result'),
    labelPic = document.querySelector('.labelPic'),
    signOutBtn = document.querySelector('.profile-picture');

// Checking condition variable
let checkProfile = localStorage.getItem('profile_check') == 'false' ? false : true;

// Show profile uploac screen
if (!checkProfile) {
    profilePicker.classList.add('show-profile-picker');
    uploadInput.addEventListener('change', () => {
        validateAndUpload(uploadInput);
    })
}

/**
 * @param {HTMLElement input:file}
 * @description Validate and upload profile picture
 * @action Extract image from input file and validate it before sending it to server
 */

function validateAndUpload(input) {
    let URL = window.URL || window.webkitURL;
    let file = input.files[0];

    if (file) {
        let image = new Image();
        // If image loaded that mean the uploaded file is a working image 
        image.onload = function () {
            if (this.width) {
                axios({
                    method: "POST",
                    url: baseUrl + '/images/upload',
                    data: {
                        image: file
                    },
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }).then((response) => {
                    let data = response.data;
                    let image_src = data.image_src;
                    localStorage.setItem('profile_src', image_src);
                    localStorage.setItem('profile_check', true);
                    profileResult.hidden = false;
                    labelPic.innerHTML = ""
                    labelPic.style.backgroundImage = `url('${URL.createObjectURL(file)}')`;
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000)
                })
            }
        };
        // Append the uploaded image blob link to image variable to check if it's a working image
        image.src = URL.createObjectURL(file);
    }
}


////////////////////////////////////////////////////////
/**
 * @description After login and setting up profile (if needed) update user infos
 * @action Update user name and profile in navigation bar
 */

// Navigation bar variables
const navigationName = document.querySelector('.profile-name'),
    navigationProfile = document.querySelector('.profile-picture');

// Updating the name and profile to logged in user info
// Note: User info stored inside localStorage upon logging in, to prevent extra axios calls and better/faster performance
navigationName.textContent = localStorage.getItem('user_name');
navigationProfile.src = "../" + localStorage.getItem('profile_src');

/**
 * @description Get user chat 
 * @action Fetch user available chat/contacts and display them inside the side bar 
 */

// Side bar chat container where all chats are stored
const chatContainer = document.querySelector('.chat-cards-container');

(() => {
    axios({
        method: "POST",
        url: baseUrl + '/chat/chat',
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
    }).then((response) => {
        let data = response.data;
        data.forEach(d => {
            let user = d[0].original;
            let cardHtml = `
                <div  class = "chat-card" data-id="${d[1].id}" data-name="${user.name}">
                <img  src   = "../backend/public/images/${user.profile}"
                alt   = "profile" class     = "chart-card-profile">
                <span class = "chat-card-name">${user.name}</span>
                </div>`
            chatContainer.innerHTML += cardHtml;
        })
    })
})();


////////////////////////////////////////////////////////
/**
 * @description Tinder cards + Show users to pick from
 * @action Adding tinder cards functionality + Fetch available users to show the for the logged in user to match from (based on preference)
 */

(() => {
    axios({
        method: "POST",
        url: baseUrl + '/info/users',
        data: {
            preference: localStorage.getItem('user_preference'),
        },
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
    }).then((response) => {
        // Credits: https://codepen.io/rudtjd2548/pen/qBodXzO
        // Tinder cards functionality
        let imgCount = 0
        const cloudUrl = 'https://djjjk9bjm164h.cloudfront.net/'
        const data = response.data
        const frame = document.body.querySelector('.frame')
        for (let i of Object.keys(data)) {
            appendCard(data[i])
        }

        let current = frame.querySelector('.card:last-child')
        let likeText = current.children[0]
        let startX = 0, startY = 0, moveX = 0, moveY = 0
        initCard(current)

        document.querySelector('#like').onclick = () => {
            moveX = 1
            moveY = 0
            complete()
        }
        document.querySelector('#hate').onclick = () => {
            moveX = -1
            moveY = 0
            complete()
        }

        /**
        * @param {Object userData}
        * @description Make a new card 
        * @action Make a new tinder card with passed user data (name, age, image)
        */

        function appendCard(data) {
            const firstCard = frame.children[0]
            const newCard = document.createElement('div')
            newCard.className = 'card'
            newCard.style.backgroundImage = `url('../backend/public/images/${data.profile}')`
            newCard.innerHTML = `
                <div class="is-like"></div>
                <div class="bottom">
                        <div class = "title">
                            <span>${data.name}</span>
                        </div>
                        <div class = "info">
                            ${data.age} years old
                        </div>
                </div>
        `
            newCard.dataset.id = data.id;
            if (firstCard) frame.insertBefore(newCard, firstCard)
            else frame.appendChild(newCard)
            imgCount++
        }

        function initCard(card) {
            card.addEventListener('pointerdown', onPointerDown)
        }

        function setTransform(x, y, deg, duration) {
            current.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${deg}deg)`
            likeText.style.opacity = Math.abs((x / innerWidth * 2.1))
            likeText.className = `is-like ${x > 0 ? 'like' : 'nope'}`
            // swipping right will set status to match and match the user, to left will reject him
            if (x > 0) {
                current.dataset.status = "match"
            } else {
                current.dataset.status = "yuck"
            }
            if (duration) current.style.transition = `transform ${duration}ms`
        }

        function onPointerDown({ clientX, clientY }) {
            startX = clientX
            startY = clientY
            current.addEventListener('pointermove', onPointerMove)
            current.addEventListener('pointerup', onPointerUp)
            current.addEventListener('pointerleave', onPointerUp)
        }

        function onPointerMove({ clientX, clientY }) {
            moveX = clientX - startX
            moveY = clientY - startY
            setTransform(moveX, moveY, moveX / innerWidth * 50)
        }

        function onPointerUp() {
            current.removeEventListener('pointermove', onPointerMove)
            current.removeEventListener('pointerup', onPointerUp)
            current.removeEventListener('pointerleave', onPointerUp)
            if (Math.abs(moveX) > frame.clientWidth / 2) {
                current.removeEventListener('pointerdown', onPointerDown)
                complete()
            } else cancel()
        }

        function complete() {
            const flyX = (Math.abs(moveX) / moveX) * innerWidth * 1.3
            const flyY = (moveY / moveX) * flyX
            setTransform(flyX, flyY, flyX / innerWidth * 50, innerWidth)
            let status = current.dataset.status;
            // if user matched the current person
            if (status == 'match') {
                matchUser(current.dataset.id)
            }
            const prev = current
            const next = current.previousElementSibling
            if (next) initCard(next)
            current = next
            likeText = current.children[0]
            // appendCard(data[imgCount % 4]) // append same cards again
            setTimeout(() => frame.removeChild(prev), innerWidth)
        }

        function cancel() {
            setTransform(0, 0, 0, 100)
            setTimeout(() => current.style.transition = '', 100)
        }
    })
})();

////////////////////////////////////////////////////////
/**
 * @description Sign out
 * @action Clear localStorage from stored user info and revoke bearer token
 */

/**
 * @param {Array batchList}
 * @description Removed items from localStorage
 * @action Loop over batchList and remove localStorage with the key appended to it
 */

const batchRemove = (batchList) => {
    for (key of batchList) {
        localStorage.removeItem(key);
    }
}

// Sign out functionality
const signout = () => {
    const authUserInformations = ['access_token', 'user_id', 'user_age', 'user_name', 'user_email', 'user_gender', 'user_preference', 'profile_src', 'profile_check'];
    batchRemove(authUserInformations);
    window.location.reload();
}

// assign click event to sign out button
signOutBtn.onclick = signout;

////////////////////////////////////////////////////////
/**
 * @param {Integer user_id}
 * @description Match users together
 * @action Match logged in user with user_id
 */

function matchUser(user_id) {
    axios({
        method: "POST",
        url: baseUrl + '/date/match',
        data: {
            match_with: user_id
        },
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
    }).then((response) => {
        console.log(response)
    })
}

////////////////////////////////////////////////////////
/**
 * @description Conversation section
 * @action Show conversation screen and chat with other user
 */

// Variables
const conversationPage = document.querySelector('.conversation-page'),
    matchingSection = document.querySelector('.lovinder'),
    chatterName = document.querySelector('.chatter-name'),
    messagesContainer = document.querySelector('.messages-container');

/**
 * @description Show conversation screen + fetch conversation messages
 * @action Hide matching page and show conversation screen with the chat messages and user info 
 */
const showConversationScreen = (e) => {
    // update chatter name
    // Note: chatter name is saved in the div dataset, to reduce axios calls and better performance
    chatterName.textContent = e.dataset.name;

    let conversationId = e.dataset.id;

    // get conversation messages
    getMessages(conversationId);

    // hide matching section
    matchingSection.hidden = true;

    // Show conversation screen
    conversationPage.hidden = false;
}

/**
 * @description Close conversation screen
 * @action Hide=conversation screen and show matching page
 */
const closeConversationScreen = () => {
    matchingSection.hidden = false;
    conversationPage.hidden = true;
}

// message component
const message = (properties) => {
    return `
        <div class="message ${properties.byMe ? 'me' : ''}">
            <p class="message-content">${properties.message}</p>
            <p class="message-time">${properties.time}</p>
        </div>
    `;
}

/**
 * @param {Integer conversationId}
 * @description Get chat for a conversation
 * @action Fetch chat by conversation id and show it on screen
 */
function getMessages(conversationId) {
    // empty old messages
    messagesContainer.innerHTML = "";

    axios({
        method: "POST",
        url: baseUrl + '/chat/messages',
        data: {
            conversation_id: conversationId,
        },
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
    }).then((response) => {
        let messages = response.data;
        for (let i of Object.keys(messages)) {
            messagesContainer.innerHTML += message({
                message: messages[i].message,
                time: `${messages[i].created_at.split('T')[0]} ${messages[i].created_at.split('T')[1].split('.')[0]}`,
                byMe: messages[i].sender_id == localStorage.getItem('user_id') ? true : false,
            })
        }
    })
}

// Add the function to each card
setTimeout(() => {
    // Grab chatting cards
    const chatCards = document.querySelectorAll('.chat-card');
    chatCards.forEach((card) => {
        card.addEventListener('click', () => {
            showConversationScreen(card);
        })
    })

    const closeBtn = document.querySelector('.close-conversation');

    closeBtn.onclick = closeConversationScreen;
}, 1000)

