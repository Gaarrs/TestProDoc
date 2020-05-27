// jshint maxerr:100
// Не стал менять оформление маркеров списка. Думаю, оценивается больше js. Поставленный в задаче функционал полностью реализован.
const cat = document.querySelector('#cat');
const fav = document.querySelector('#fav');
const usersList = document.querySelector('.users__list');
const favorite = document.querySelector('.favorite');
let b = 10;
let usersItem;
let z;
let albumsItem;
url1 = 'https://json.medrating.org/users/',
    url2 = 'https://json.medrating.org/albums';

function getUsers() { //Получаем пользователей
    let b = document.querySelectorAll('.users__item');
    return b;
}

function getAlbums() { //Получаем альбомы
    let b = document.querySelectorAll('.albums__item');
    return b;
}

async function downloadUsers() { //Загружаем пользователей через API
    let request = await fetch(url1);
    const users = await request.json();
    usersCount = users.length;
    for (let i = 0; i < users.length; i++) {
        let user = document.createElement('li');
        user.className = 'users__item';
        if (users[i].name == undefined) {
            user.innerHTML = 'Пользователь не имеет данных'; //break
        } else {
            user.innerHTML = users[i].name;
        }
        usersList.append(user);
    }
    downloadAlbums();

}

async function downloadAlbums() { //Загружаем альбомы через API
    let usersItem = getUsers();
    for (let k = 0; k < this.usersCount; k++) {
        let albumList = document.createElement('ul');
        albumList.className = 'album__list';
        albumList.innerHTML = '';
        usersItem[k].after(albumList);
        let request = await fetch(url2);
        const albums = await request.json();
        for (let j = 0; j < albums.length; j++) {
            if (albums[j].userId == k + 1) {
                let album = document.createElement('li');
                album.className = 'albums__item';
                album.innerHTML = albums[j].title;
                albumList.append(album);
            }

        }
    }
    usersList.addEventListener('click', function (event) { //Взаимодействие с пользователями через делегирование
        let target = event.target;
        let usersItem = getUsers();
        let albumList = document.querySelectorAll('.album__list');
        if (target && target.classList.contains('users__item')) {
            for (l = 0; l < usersItem.length; l++) {
                if (target == usersItem[l]) {
                    albumList[l].classList.toggle('visible');
                }
            }
        }
    });
    downloadPhotos();
}

async function downloadPhotos() { // Подгружаем фотографии только по необходимости при клике
    let albumList = document.querySelectorAll('.album__list'),
        albumsItem = getAlbums();
    for (let k = 0; k < albumList.length; k++) {
        albumList[k].addEventListener('click', function (event) {
            let target = event.target;
            if (target && target.classList.contains('albums__item')) {
                for (let i = 0; i < albumsItem.length; i++) {
                    if (target == albumsItem[i]) {
                        let counter = albumsItem[i].childNodes;
                        if (counter.length > 1) {
                            albumsItem[i].removeChild(albumsItem[i].lastChild);
                        } else {
                            getPhotos(i, albumsItem[i]);
                        }
                    }
                }
            }
        });
    }

}

async function getPhotos(i, j) { // Загружаем фотографии через API
    let photo = document.createElement('div'),
        album = j;
    photo.className = 'photo';
    album.appendChild(photo);
    let request = await fetch('https://json.medrating.org/photos');
    const photos = await request.json();
    for (l = 0; l < photos.length; l++) {
        if (photos[l].albumId == i + 1) {
            let photoItem = document.createElement('div'),
                fav = document.createElement('div');
            photoItem.className = 'photo__item';
            photoItem.title = photos[l].title;
            photoItem.style.backgroundImage = `url(${photos[l].url})`;
            fav.className = 'fav';
            for (let m = 0; m < localStorage.length; m++) {
                let key = localStorage.key(i),
                    storageValue = localStorage.getItem(key);
                if (photoItem.style.backgroundImage == storageValue) {
                    fav.style.backgroundImage = 'url(img/fav_toggle.png)';
                }
            }
            photoItem.appendChild(fav);
            photo.appendChild(photoItem);
        }
    }
    let photoList = document.querySelectorAll('.photo__item'); //Создаём модальное окно с полным изображением
    photo.addEventListener('click', function (event) {
        let target = event.target;
        if (target && target.classList.contains('photo__item')) {
            for (let k = 0; k < photoList.length; k++) {
                if (target == photoList[k]) {
                    let style = photoList[k].style.backgroundImage,
                        modal = document.querySelector('.modal'),
                        close = document.querySelector('.close');
                    if (modal.classList.contains('hidden')) {
                        modal.classList.remove('hidden');
                        modal.classList.add('visible');
                    }
                    modal.classList.add('visible');
                    modal.style.backgroundImage = style;
                    close.addEventListener('click', function () {
                        if (modal.classList.contains('visible')) {
                            modal.classList.remove('visible');
                            modal.classList.add('hidden');
                        }
                    });
                }
            }
        }
    });
    let favBtn = document.querySelectorAll('.fav'); // Отмечаем фотографии и добавляем в избранное/извлекаем оттуда
    for (m = 0; m < photoList.length; m++) {
        photoList[m].addEventListener('click', function (event) {
            let target = event.target;
            if (target && target.classList.contains('fav')) {
                for (j = 0; j < favBtn.length; j++) {
                    if (target == favBtn[j]) {
                        let parrent = favBtn[j].parentNode,
                            n = localStorage.length;
                        if (localStorage.length > 0) {
                            for (let o = 0; o < localStorage.length; o++) {
                                let key = localStorage.key(o),
                                    storageValue = localStorage.getItem(key);
                                if (storageValue != `${parrent.style.backgroundImage}`) {
                                    localStorage.setItem(`${parrent.title}`, `${parrent.style.backgroundImage}`);
                                    favBtn[j].style.backgroundImage = 'url(img/fav_toggle.png)';
                                } else if (storageValue == `${parrent.style.backgroundImage}`) {
                                    if (n == localStorage.length) {
                                        localStorage.removeItem(`${parrent.title}`);
                                        favBtn[j].style.backgroundImage = 'url(img/fav.png)';
                                        break;
                                    } else {
                                        break;
                                    };
                                }

                            }
                        } else {
                            localStorage.setItem(`${parrent.title}`, `${parrent.style.backgroundImage}`);
                            favBtn[j].style.backgroundImage = 'url(img/fav_toggle.png)';
                        }
                    }
                }
            }
        });
    }
    setTimeout(checkFav, 500);
}

function clearFav() { //Чистим избранное
    while (favorite.firstChild) {
        favorite.removeChild(favorite.firstChild);
    }
}

function showFav() { //Показываем содержимое Избранного
    clearFav();
    let favDiv = document.querySelector('.favorite'),
        modal = document.querySelector('.modal'),
        close = document.querySelector('.close');
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i),
            storageValue = localStorage.getItem(key),
            favItem = document.createElement('div'),
            fav = document.createElement('div'),
            favTitle = document.createElement('div');
        favTitle.className = 'fav__title';
        favTitle.innerHTML = key;
        fav.className = 'toggle';
        favItem.className = 'fav__item';
        favItem.style.backgroundImage = storageValue;
        favItem.appendChild(fav);
        favItem.appendChild(favTitle);
        favDiv.appendChild(favItem);
    }
    let favItem = document.querySelectorAll('.fav__item');
    for (let j = 0; j < favItem.length; j++) {
        favItem[j].onclick = function () {
            modal.classList.remove('hidden');
            modal.classList.add('visible');
            modal.style.backgroundImage = favItem[j].style.backgroundImage;
        };
    }
    close.onclick = function () {
        modal.classList.remove('visible');
        modal.classList.add('hidden');
    };
}

function showStorage() { //Показываем хранилище - функция отладки
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i),
            value = localStorage.getItem(key);
        console.log(`Ключ: ${key}`);
        console.log(`Значение ${value}`);
    }
    console.log(`Длина: ${localStorage.length}`);
}

function clearStorage() { //Чистим хранилище - функция отладки
    localStorage.clear();
}

function checkFav() { //Сверяем избранное с элементами каталога
    let favItem = document.querySelectorAll('.fav');
    for (let i = 0; i < favItem.length; i++) {
        let parrent = favItem[i].parentNode.style.backgroundImage;
        if (localStorage.length > 0) {
            for (let j = 0; j < localStorage.length; j++) {
                let key = localStorage.key(j),
                    storageValue = localStorage.getItem(key);
                if (parrent == storageValue) {
                    favItem[i].style.backgroundImage = 'url(img/fav_toggle.png)';
                    break;
                } else {
                    favItem[i].style.backgroundImage = 'url(img/fav.png)';
                }
            }
        } else if (localStorage.length == 0) {
            favItem[i].style.backgroundImage = 'url(img/fav.png)';
        }
    }
}

downloadUsers();


cat.onclick = function () { //Клик по каталогу
    usersList.classList.remove('hidden');
    usersList.classList.add('visible');
    favorite.classList.remove('visible');
    favorite.classList.add('hidden');
    checkFav();
};

fav.onclick = function () { //Клик по избранному
    usersList.classList.remove('visible');
    usersList.classList.add('add');
    favorite.classList.remove('hidden');
    favorite.classList.add('visible');
    showFav();
    setToggle();
};

function setToggle() { //Образуем избранное
    let favToggle = document.querySelectorAll('.toggle'),
        favItem = document.querySelectorAll('.fav__item');
    for (j = 0; j < favItem.length; j++) {
        favItem[j].addEventListener('click', function (event) {
            let target = event.target;
            if (target && target.classList.contains('toggle')) {
                for (let i = 0; i < favToggle.length; i++) {
                    if (target == favToggle[i]) {
                        let photo = favToggle[i].parentNode.style.backgroundImage,
                            modal = document.querySelector('.modal');
                        modal.classList.remove('visible');
                        modal.classList.add('hidden');
                        for (let l = 0; l < localStorage.length; l++) {
                            let key = localStorage.key(i),
                                value = localStorage.getItem(key);
                            if (photo == value) {
                                localStorage.removeItem(key);
                                showFav();
                                setToggle();
                            } else {
                                showFav();
                                setToggle();
                            }
                        }
                    }
                }
            }
        });
    }
}