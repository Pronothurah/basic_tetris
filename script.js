
document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0

    const colors = [
        'black',
        'red',
        'green',
        'blue',
        'purple'
    ]
    
    // Tetrominoes
    
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]
    
    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
      ]
    
      const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
      ]
    
      const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
      ]
    
      const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
      ]
    
    
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
    
    let currentPosition = 4
    let currentRotation = 0
    
    // Randomly silect tetrominoes
    
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]
    
    // Draw tetromino
    
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetrominoes')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }
    
    // Undraw Tetromino
    
    function unDraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetrominoes')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }
    
    // Assign functions to key codes
    
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    
    document.addEventListener('keyup', control)
    
    // Move down function
    
    function moveDown() {
        unDraw()
        currentPosition += width
        draw()
        freeze()
    }
    
    // Freeze function
    
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            
            random = nextRandom
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }
    
    // Move Tetrominoes
    // Move Left
    
    function moveLeft() {
        unDraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    
        if (!isAtLeftEdge) currentPosition -=1
    
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition +=1
        }
    
        draw()
    }
    
    // Move Right
    
    function moveRight() {
        unDraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    
        if (!isAtRightEdge) currentPosition +=1
    
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -=1
        }
    
        draw()
    }


    // Rotate Tetromino

    function rotate() {
        unDraw()
        currentRotation ++
        if (currentRotation === current.length) {
            // If the current rotation gets to 4 make it go back to 0
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }


    // Show up next tetromino in mini-grid

    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0

    // tetrominoes without rotation

    const upNextTetrominoe = [
        [1, displayWidth+1, displayWidth*2+1, 2],    //ltetrominoe
        [0,displayWidth,displayWidth+1,displayWidth*2+1],      // ztetrominoe
        [1,displayWidth,displayWidth+1,displayWidth+2],    // ttetrominoe
        [0,1,displayWidth,displayWidth+1],              // otetrominoe
        [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1] //ltetrominoe
    ]

    // display shape in mini-grid

    function displayShape() {
        //remove any traces opf tetromino from grid
        displaySquares.forEach(square => {
            square.classList.remove('tetrominoes')
            square.style.backgroundColor = ''
        })
        upNextTetrominoe[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetrominoes')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }


    // Add functionality of start button

    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })

    // Add score

    function addScore() {
        for (let i=0 ; i<199 ; i+=width) {
            row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score +=10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetrominoes')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }


    // Game Over

    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'Game Over'
            clearInterval(timerId)
        }
        
    }

    































})
