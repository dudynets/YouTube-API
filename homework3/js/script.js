const switcher = document.querySelector('#cbx'),
    more = document.querySelector('.more'),
    modal = document.querySelector('.modal'),
    videos = document.querySelectorAll('.videos__item');
const videosWrapper = document.querySelector('.videos__wrapper');
let player;

function bindSlideToggle(trigger, boxBody, content, openClass) {
    let button = {
        'element': document.querySelector(trigger),
        'active': false
    };
    const box = document.querySelector(boxBody),
        boxContent = document.querySelector(content);

    button.element.addEventListener('click', () => {
        if (button.active === false) {
            button.active = true;
            box.style.height = boxContent.clientHeight + 'px';
            box.classList.add(openClass);
        } else {
            button.active = false;
            box.style.height = 0 + 'px';
            box.classList.remove(openClass);
        }
    });
}
bindSlideToggle('.hamburger', '[data-slide="nav"]', '.header__menu', 'slide-active');

function switchMode() {
    if (night === false) {
        night = true;
        //document.body.style.backgroundColor = '#000';
        document.body.classList.add('night');
        document.querySelectorAll('.hamburger > line').forEach(item => {
            item.style.stroke = '#fff';
        });

        document.querySelectorAll('.videos__item-descr').forEach(item => {
            item.style.color = '#fff';
        });

        document.querySelectorAll('.videos__item-views').forEach(item => {
            item.style.color = '#fff';
        });

        document.querySelector('.header__item-descr').style.color = '#fff';

        document.querySelector('.logo > img').src = 'logo/youtube_night.svg';
    } else {
        night = false;
        document.body.classList.remove('night');
        document.querySelectorAll('.hamburger > line').forEach(item => {
            item.style.stroke = '#000';
        });

        document.querySelectorAll('.videos__item-descr').forEach(item => {
            item.style.color = '#000';
        });

        document.querySelectorAll('.videos__item-views').forEach(item => {
            item.style.color = '#000';
        });

        document.querySelector('.header__item-descr').style.color = '#000';

        document.querySelector('.logo > img').src = 'logo/youtube.svg';
    }
}

let night = false;
switcher.addEventListener('change', () => {
    switchMode();
});

// const data = [
//     ['img/thumb_3.webp', 'img/thumb_4.webp', 'img/thumb_5.webp'],
//     ['#3 Верстка на flexbox CSS | Блок преимущества и галерея | Марафон верстки | Артем Исламов',
//         '#2 Установка spikmi и работа с ветками на Github | Марафон вёрстки Урок 2',
//         '#1 Верстка реального заказа landing page | Марафон верстки | Артем Исламов'
//     ],
//     ['3,6 тыс. просмотров', '4,2 тыс. просмотров', '28 тыс. просмотров'],
//     ['X9SmcY3lM-U', '7BvHoh0BrMw', 'mC8JW_aG2EM']
// ];

// more.addEventListener('click', () => {
//     const videosWrapper = document.querySelector('.videos__wrapper');
//     more.remove();

//     for (let i = 0; i < data[0].length; i++) {
//         let card = document.createElement('a');
//         card.classList.add('videos__item', 'videos__item-active');
//         card.setAttribute('data-url', data[3][i]);
//         card.innerHTML = `
//             <img src="${data[0][i]}" alt="thumb">
//             <div class="videos__item-descr">
//                 ${data[1][i]}
//             </div>
//             <div class="videos__item-views">
//                 ${data[2][i]}
//             </div>
//         `;
//         videosWrapper.appendChild(card);
//         setTimeout(() => {
//             card.classList.remove('videos__item-active');
//         }, 10);
//         if (night === true) {
//             card.querySelector('.videos__item-descr').style.color = '#fff';
//             card.querySelector('.videos__item-views').style.color = '#fff';
//         }

//         bindNewModal(card);
//     }

//     sliceTitle('.videos__item-descr', 100);
// });




function start() {
    gapi.client.init({
        'apiKey': 'AIzaSyDJRFRR_uaTDIIHZVuGXhYRUJn9WLdCU6w',
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
    }).then(function() {
        return gapi.client.youtube.playlistItems.list({
            "part": "snippet,contentDetails",
            "maxResults": '6',
            "playlistId": "PL3LQJkGQtzc4gsrFkm4MjWhTXhopsMgpv"
        });
    }).then(function(response) {
        console.log(response.result);

        response.result.items.forEach(item => {
            let card = document.createElement('a');

            card.classList.add('videos__item', 'videos__item-active');
            card.setAttribute('data-url', item.contentDetails.videoId);
            card.innerHTML = `
                <img src="${item.snippet.thumbnails.high.url}" alt="thumb">
                <div class="videos__item-descr">
                    ${item.snippet.title}
                </div>
                <div class="videos__item-views">
                    2.7k views
                </div>
            `;
            videosWrapper.appendChild(card);
            setTimeout(() => {
                card.classList.remove('videos__item-active');
            }, 10);
            if (night === true) {
                card.querySelector('.videos__item-descr').style.color = '#fff';
                card.querySelector('.videos__item-views').style.color = '#fff';
            }
        });
        sliceTitle('.videos__item-descr', 100);
        bindModal(document.querySelectorAll('.videos__item'));
    }).catch(e => {
        console.log(e);
    });
}

more.addEventListener('click', () => {
    more.remove();
    gapi.load('client', start);
});

function search(target) {
    gapi.client.init({
        'apiKey': 'AIzaSyDJRFRR_uaTDIIHZVuGXhYRUJn9WLdCU6w',
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
    }).then(function() {
        return gapi.client.youtube.search.list({
            'maxResults': '10',
            'part': 'snippet',
            'q': `${target}`,
            'type': ''
        });
    }).then(function(response) {
        console.log(response.result);
        // videosWrapper.innerHTML = '';
        while (videosWrapper.firstChild) {
            videosWrapper.removeChild(videosWrapper.firstChild);
        }

        response.result.items.forEach(item => {
            let card = document.createElement('a');

            card.classList.add('videos__item', 'videos__item-active');
            card.setAttribute('data-url', item.id.videoId);
            if (item.id.kind === "youtube#video") {
                card.innerHTML = `
                <img src="${item.snippet.thumbnails.high.url}" alt="thumb">
                <div class="videos__item-descr">
                    ${item.snippet.title}
                </div>
                <div class="videos__item-views">
                    2.7k views
                </div>
            `;
            } else {
                card.innerHTML = `
                <img src="${item.snippet.thumbnails.high.url}" alt="thumb">
                <div class="videos__item-descr">
                    ${item.snippet.title}
                </div>
                <div class="videos__item-views">
                    Channel / smth else
                </div>
            `;
                closeModal();
            }

            videosWrapper.appendChild(card);
            setTimeout(() => {
                card.classList.remove('videos__item-active');
            }, 10);
            if (night === true) {
                card.querySelector('.videos__item-descr').style.color = '#fff';
                card.querySelector('.videos__item-views').style.color = '#fff';
            }
        });
        sliceTitle('.videos__item-descr', 100);
        bindModal(document.querySelectorAll('.videos__item'));
    })
}

document.querySelector('.search').addEventListener('submit', (e) => {
    e.preventDefault();
    gapi.load('client', () => { search(document.querySelector('.search > input').value) });
    document.querySelector('.search > input').value = '';
});

function sliceTitle(selector, count) {
    document.querySelectorAll(selector).forEach(item => {
        item.textContent.trim();

        if (item.textContent.length < count) {
            return;
        } else {
            const str = item.textContent.slice(0, count + 1) + "...";
            item.textContent = str;
        }
    });
}
sliceTitle('.videos__item-descr', 100);

function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
    player.stopVideo();
}

function bindModal(cards) {
    cards.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const id = item.getAttribute('data-url');
            loadVideo(id);
            openModal();
        });
    });
}
bindModal(videos);

function bindNewModal(cards) {
    cards.addEventListener('click', (e) => {
        e.preventDefault();
        const id = cards.getAttribute('data-url');
        loadVideo(id);
        openModal();
    });
}

modal.addEventListener('click', (e) => {
    if (!e.target.classList.contains('.modal__body')) {
        closeModal();
    }
});

document.addEventListener('keydown', function(evt) { if (evt.keyCode === 27) { closeModal(); } });

function createVideo() {
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    setTimeout(() => {
        player = new YT.Player('frame', {
            height: '100%',
            width: '100%',
            videoId: 'M7lc1UVf-VE'
        });
    }, 300);
}

createVideo();

function loadVideo(id) {
    player.loadVideoById({ 'videoId': `${id}` });
}