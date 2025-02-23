//玩遊戲的按鈕
var startBtn = document.querySelector('#start')
var pauseBtn = document.querySelector('#pause')
var restartBtn = document.querySelector('#restart')



class Food {
    constructor(ele) {
        this.map = document.querySelector(ele)
        this.food = document.createElement('div')
        this.food.className = 'food'
        this.map.appendChild(this.food)

        this.x = 0
        this.y = 0

        this.changePos()

    }

    // 隨機改變食物座標位置
    changePos(po) {

        let check = true
        console.log(po)

        let map_width = this.map.clientWidth
        let map_height = this.map.clientHeight

        let row_num = map_width / 20 - 1
        let col_num = map_height / 20 - 1


        let pos_x = Math.floor(Math.random() * (row_num + 1))
        let pos_y = Math.floor(Math.random() * (col_num + 1))

        this.x = pos_x * 20
        this.y = pos_y * 20

        this.food.style.left = this.x + 'px'
        this.food.style.top = this.y + 'px'
    }
}

if (localStorage.getItem('record')) {
    document.querySelector('.high').innerHTML = localStorage.getItem('record')
}


class Snake {
    constructor(ele) {
        this.map = document.querySelector(ele)
        //初始方向設置
        this.direction = 'right'

        //蛇的數據類型
        this.snake = []

        //創建初始化的蛇
        this.creSnake()
    }

    //創建一截蛇身
    creOne() {
        let head = this.snake[0]

        let pos = {
            left: 0,
            top: 0
        }

        if (head) {
            switch (this.direction) {
                case 'right':
                    pos.left = head.offsetLeft + 20
                    pos.top = head.offsetTop + 0
                    break
                case 'left':
                    pos.left = head.offsetLeft - 20
                    pos.top = head.offsetTop + 0
                    break
                case 'bottom':
                    pos.left = head.offsetLeft + 0
                    pos.top = head.offsetTop + 20
                    break
                case 'top':
                    pos.left = head.offsetLeft + 0
                    pos.top = head.offsetTop - 20
                    break
            }
        }

        let creatHead = document.createElement('div')
        creatHead.className = 'head'
        this.map.appendChild(creatHead)
        creatHead.style.left = pos.left + 'px'
        creatHead.style.top = pos.top + 'px'
        this.snake.unshift(creatHead)
        if (head) head.className = 'body'
    }

    //創建一條初始化的蛇
    creSnake() {
        for (let i = 0; i < 5; i++)this.creOne()
    }

    //讓蛇移動一步
    move() {
        let del = this.snake.pop()
        del.remove()
        this.creOne()
    }

    //判定是否吃到食物
    eaten(foodX, foodY) {
        let head = this.snake[0]
        let x = head.offsetLeft
        let y = head.offsetTop

        if (x === foodX && y === foodY) {
            return true
        } else {
            return false
        }
    }


    //判定蛇是否死亡
    die() {
        let head = this.snake[0]
        let x = head.offsetLeft
        let y = head.offsetTop
        let isfail = false

        for (let i = 1; i < this.snake.length; i++) {
            if (x === this.snake[i].offsetLeft && y === this.snake[i].offsetTop) {
                isfail = true
                break
            }
        }

        if (!isfail) {
            if (x < 0 || y < 0 || x >= this.map.clientWidth || y >= this.map.clientHeight) {
                isfail = true
            } else {
                isfail = false
            }
        }
        return isfail
    }

    getBody() {
        let o = {
            x: [],
            y: []
        }
        for (let i = 0; i < this.snake.length; i++) {
            o.x.push(this.snake[i].offsetLeft)
            o.y.push(this.snake[i].offsetTop)
        }
        return o
    }

}

class Game {
    constructor(ele) {
        this.map = document.querySelector(ele)
        this.food = new Food(ele)
        this.snake = new Snake(ele)
        this.level = 1
        this.le = document.querySelector('.level')
        this.timer = 0
        this.score = 0
        this.now = document.querySelector('.now')
        this.high = document.querySelector('.high')
    }

    //遊戲開始
    start() {
        startBtn.removeEventListener('click', go)
        this.timer = setInterval(() => {
            this.snake.move()
            this.highScore()
            if (this.snake.die()) {
                clearInterval(this.timer)
                alert('game over')
            }

            if (this.snake.eaten(this.food.x, this.food.y)) {
                let po = this.snake.getBody()
                this.food.changePos(po)
                this.snake.creOne()
                this.changeScore()

            }
        }, 300 - this.level * 30)


    }

    //遊戲暫停
    pause() {
        clearInterval(this.timer)
        startBtn.addEventListener('click', go)
    }

    //遊戲重新開始
    restart() {
        window.location.reload()
    }

    //改變方向
    change(type) {
        switch (type) {
            case 'right': this.snake.direction = 'right'; break
            case 'left': this.snake.direction = 'left'; break
            case 'top': this.snake.direction = 'top'; break
            case 'bottom': this.snake.direction = 'bottom'; break
        }
    }

    //積分調整
    changeScore() {
        this.score += 100
        this.now.innerText = this.score

        //調整級別
        if (this.score > 0 && this.score % 500 === 0) {
            this.level++
            this.le.innerText = this.level
            this.pause()
            this.highScore()
            let con = confirm('恭喜晉級！')
            if (con) {
                this.start()
            } else {
                this.restart()
            }
        }
    }

    //積分紀錄更新
    highScore() {
        if (!(localStorage.getItem('record')) || (localStorage.getItem('record') - 0) < this.score) {
            localStorage.setItem('record', this.score)
            this.high.innerHTML = localStorage.getItem('record')
        }
    }


}


var g1 = new Game('.map')

startBtn.addEventListener('click', go)
function go() {
    g1.start()
}
pauseBtn.addEventListener('click', () => {
    g1.pause()
})
restartBtn.addEventListener('click', () => {
    g1.restart()
})

document.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
        case 32: g1.start(); break
        case 13: g1.pause(); break
        case 37: g1.change('left'); break
        case 38: g1.change('top'); break
        case 39: g1.change('right'); break
        case 40: g1.change('bottom'); break
    }
})
