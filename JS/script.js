// Переменные

let points = 1000
let username = prompt('Введите логин')
document.cookie = encodeURIComponent('username') + '=' + encodeURIComponent(username)
let game_id = ''

// Лисенеры

document.querySelectorAll('.point').forEach( btn => {
    btn.addEventListener('click', setPoints)
})

document.querySelector('.point.input').addEventListener('input', setPointsFrominput)

document.querySelector('#gameButton').addEventListener('click', startOrStopGame)

getUser(username)

// Функции

function setPoints() {
    let userBtn = event.target

    document.querySelectorAll('.point').forEach( btn => {
        btn.classList.remove('active')
    })

    userBtn.classList.add('active')
    if(userBtn.innerHTML == 'другое'){
        document.querySelector('.point.input').classList.remove('disabled')
        document.querySelector('.point.input').classList.add('active')
}   else if(userBtn == document.querySelector('.point.input') || userBtn == document.querySelector('.point.input input')) {
    document.querySelector('.point.input').classList.add('active')
}   else {
    document.querySelector('.point.input').classList.add('disabled')
    points = +userBtn.innerHTML
}
}

function setPointsFrominput() {
    let input = event.target
    points = +input.value
}

function startOrStopGame(){
    let gameBtn = event.target
    let gameBtnText = gameBtn.innerHTML
    if(gameBtnText == 'играть') {
    gameBtn.innerHTML = 'завершить игру'
    newGame()
}   else {
    gameBtn.innerHTML = 'играть'
    stopGame()
}
}



async function sendRequest(url, method, data) {
    url = `https://tg-api.tehnikum.school/tehnikum_course/minesweeper/${url}`
    
    if(method == "POST") {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    
        response = await response.json()
        return response
    } else if(method == "GET") {
        url = url+"?"+ new URLSearchParams(data)
        let response = await fetch(url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        response = await response.json()
        return response
    }
}

async function getUser(username) {
    let response = await sendRequest('user', 'GET', {
        username
    })
    if(response.error) {
        alert(response.message)
    } else {
        let userInfo = document.querySelector('header span')
        userInfo.innerHTML = `[${username}, ${response.balance}]`
    }
}

async function newGame() {
    let response = await sendRequest('new_game', 'POST', {
        username, points
    })
    if(response.error) {
        alert(response.message)
    } else {
        game_id = response.game_id
        let userInfo = document.querySelector('header span')
        userInfo.innerHTML = `[${username}, ${response.user_balance}]`
        cleanArea()
        activateArea()
        console.log(response)
    }
}

function activateArea() {
    let cells = document.querySelectorAll('.cell')
    for(let i = 0; i < cells.length; i++) {
        let cell = cells[i]
        cell.classList.add('active')
        let row = Math.ceil((i+1) / 10)
        let column = i + 1 - 10*(row-1)
        cell.setAttribute('data-row', row-1)
        cell.setAttribute('data-column', column-1)
        cell.addEventListener('contextmenu', setFlag)
        cell.addEventListener('click', gameStep)
    }
}

async function stopGame() {
    let response = await sendRequest('stop_game', 'POST', {
        username, game_id
    })
    if(response.error) {
        alert(response.message)
    } else {
        cleanArea()
        getUser(username)
    }
}

function cleanArea() {
    let field = document.querySelector('.field')
    field.innerHTML = `
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>`
}

function setFlag() {
    let cell = event.target
    cell.classList.toggle('flag')

    return false
}

async function gameStep() {
    let cell = event.target
    let row = +cell.getAttribute('data-row')
    let column = +cell.getAttribute('data-column')

    let response = await sendRequest('game_step', 'POST', {
        game_id, row, column
    })
    if(response.error) {
        alert(response.message)
    } else {
        updateArea(response.table)
        if(response.status == "Failed") {
            let gameBtn = document.querySelector('#gameButton')
            gameBtn.innerHTML = "играть"
            alert('Ты проиграл, лузер')
        } else if(response.status == "Won") {
            alert('Ты выиграл, красавчик')
        }
    }
}

function updateArea(arr) {
    let cells = document.querySelectorAll('.cell')
    let k = 0
    for(let i = 0; i < arr.length; i++) {
        for(let j = 0; j < arr[i].length; j++) {
            let cellStatus = arr[i] [j]
            if(cellStatus == "BOMB") {
                cells[k].classList.add('bomb')
                cells[k].classList.remove('active')
            } else if (cellStatus === 0) {
                cells[k].classList.remove('active')
            } else if(cellStatus > 0) {
                cells[k].innerHTML = cellStatus
                cells[k].classList.remove('active')
            }
            k++
        }
    }
}