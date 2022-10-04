// check if user is logged in
if (!localStorage.getItem('access_token')) {
    window.location.href = './index.html'
}

// For tinder card style
// Credit: https://codepen.io/rudtjd2548/pen/qBodXzO
let imgCount = 0
const cloudUrl = 'https://djjjk9bjm164h.cloudfront.net/'
const data = [
    { img: `${cloudUrl}tender01.jpg`, name: 'Korean Fried', price: '20', distance: '2' },
    { img: `${cloudUrl}tender02.jpg`, name: 'Grilled', price: '23', distance: '5' },
    { img: `${cloudUrl}tender03.jpg`, name: 'Fried', price: '25', distance: '11' },
    { img: `${cloudUrl}tender04.jpg`, name: 'Deep Fried', price: '23', distance: '6' }
]
const frame = document.body.querySelector('.frame')
data.forEach(_data => appendCard(_data))

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

function appendCard(data) {
    const firstCard = frame.children[0]
    const newCard = document.createElement('div')
    newCard.className = 'card'
    newCard.style.backgroundImage = `url(${data.img})`
    newCard.innerHTML = `
          <div class="is-like">LIKE</div>
          <div class="bottom">
            <div class="title">
              <span>${data.name}</span>
              <span><b>$</b>${data.price}</span>
            </div>
            <div class="info">
              ${data.distance} miles away
            </div>
          </div>
        `
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

    const prev = current
    const next = current.previousElementSibling
    if (next) initCard(next)
    current = next
    likeText = current.children[0]
    appendCard(data[imgCount % 4]) // append same cards again
    setTimeout(() => frame.removeChild(prev), innerWidth)
}

function cancel() {
    setTransform(0, 0, 0, 100)
    setTimeout(() => current.style.transition = '', 100)
}


// Linking

const baseUrl = 'http://127.0.0.1:8000/api';

// check if user has a profile or no
const profilePicker = document.querySelector('.profile-picker'),
    uploadInput = document.getElementById('uploadProfile'),
    profileResult = document.querySelector('.profile-result'),
    labelPic = document.querySelector('.labelPic');

let checkProfile = localStorage.getItem('profile_check') == 'false' ? false : true;

if (!checkProfile) {
    profilePicker.classList.add('show-profile-picker');
    uploadInput.addEventListener('change', () => {
        validateAndUpload(uploadInput);
    })
}

function validateAndUpload(input) {
    let URL = window.URL || window.webkitURL;
    let file = input.files[0];

    if (file) {
        let image = new Image();

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
        image.src = URL.createObjectURL(file);
    }
}

// Update homepage
const navigationName = document.querySelector('.profile-name'),
    navigationProfile = document.querySelector('.profile-picture');

navigationName.textContent = localStorage.getItem('user_name');
navigationProfile.src = "../" + localStorage.getItem('profile_src');

// Get user chat
(() => {
    axios({
        method: "POST",
        url: baseUrl + '/chat/chat',
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
    }).then((response) => {
        // console.log(response)    
    })
})();

// get users by preference
(() => {
    axios({
        method: "POST",
        url: baseUrl + '/chat/chat',
        data: {
            preference: 'male',
        },
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
    }).then((response) => {
        console.log(response)
    })
})();