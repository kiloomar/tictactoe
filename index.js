class Game {
	gameStatus = true
	round = 0
	gameboardPlaces = document.querySelectorAll('#gameboard > div > div')
	gameboardBoundaryDivs = document.querySelectorAll('#gameboard > div')
	winConditions = [
		['p1', 'p2', 'p3'],
		['p4', 'p5', 'p6'],
		['p7', 'p8', 'p9'],
		['p1', 'p4', 'p7'],
		['p2', 'p5', 'p8'],
		['p3', 'p6', 'p9'],
		['p3', 'p5', 'p7'],
		['p1', 'p5', 'p9'],
	]

	constructor() {
		document.getElementById('counter').style.visibility = 'visible'
		this.registerListeners()
		this.loadScoreData()
		this.displayScore()
		this.start()
	}

	registerListeners() {
		for (const div of this.gameboardBoundaryDivs.values()) {
			let place = div.childNodes[0]
			if (!this.isMobileDevice()) {
				div.addEventListener('mousemove', ev => { this.visualizeMouseOver(ev, place) })
				div.addEventListener('mouseleave', () => { this.visualizeMouseLeave(place) })
			}
			div.addEventListener('click', () => { this.userPlay(place) })
		}
	}

	isDraw() {
		if (this.getCurrentEmptyPlaces().length === 0)
			return true
		return false
	}

	isMobileDevice() {
		return typeof window.orientation !== "undefined"
	}

	isScoreDataSaved() {
		if (localStorage.getItem('ai') != null && localStorage.getItem('player') != null)
			return true
		return false
	}

	loadScoreData() {
		if (!this.isScoreDataSaved()) {
			localStorage.setItem('ai', 0)
			localStorage.setItem('player', 0)
		}
	}

	displayScore() {
		document.getElementById('aic').innerHTML = `AI: ${localStorage.getItem('ai')}`
		document.getElementById('pic').innerHTML = `Player: ${localStorage.getItem('player')}`
	}

	displayGameStatus(status) {
		document.getElementById('gamestatus').style.visibility = 'visible'
		document.getElementById('gamestatus').innerHTML = `${status}, <a onclick="GAME.reset()">Again?</a>`
	}

	hideGameStatus() {
		document.getElementById('gamestatus').style.visibility = 'hidden'
	}

	AIPlay() {
		let emptyPlaces = this.getCurrentEmptyPlaces()
		let emptyPlace = emptyPlaces[Math.ceil(Math.random() * emptyPlaces.length - 1)]
		try {
			this.placeMark(emptyPlace, 'X')
			this.nextRound()
		} catch (error) {
			return	
		}
	}

	userPlay(place) {
		if (this.gameStatus) {
			try {
				this.placeMark(place, 'O')
				this.nextRound()
			} catch (error) {
				return
			}
		}
	}

	visualizeMouseOver(ev, place) {
		requestAnimationFrame(() => {
			place.style.transition = `transform 0.06s ease-out`
			const centerX = place.clientWidth / 2
			const centerY = place.clientHeight / 2
			let mouseX, mouseY
	
			mouseX = (ev.offsetX - centerX) / centerX
			mouseY = (ev.offsetY - centerY) / centerY
	
			const rotationX = mouseX * 20
			const rotationY = mouseY * 20
			place.style.transform = `perspective(100px) rotateY(${rotationX}deg) rotateX(${-rotationY}deg)`
		})
	}


	visualizeMouseLeave(place) {
		window.requestAnimationFrame(() => {
			place.style.transition = 'transform 1s'
			place.style.transform = `rotateY(0deg) rotateX(0deg)`
		})
	}

	placeMark(div, mark) {
		const isOccupied = div.innerHTML != ''
		if (isOccupied) throw new Error('Occupied')
		div.innerHTML = mark
	}

	nextRound() {
		this.endGameIfPossible()
		if (!this.gameStatus)
			return
		this.round++
		if (this.round % 2 != 0)
			this.AIPlay()
	}

	getCurrentEmptyPlaces() {
		let emptyPlaces = []
		for (const place of this.gameboardPlaces.values())
			if (place.innerHTML == '')
				emptyPlaces.push(place)
		return emptyPlaces
	}

	endGameIfPossible() {
		let winner = this.getWinner()
		if (!winner && this.isDraw()) {
			this.displayGameStatus('Draw')
		}
		if (winner === 'X') {
			this.displayGameStatus('You lost')
			localStorage.setItem('ai', Number(localStorage.getItem('ai')) + 1)
		}
		if (winner === 'O') {
			this.displayGameStatus('You win')
			localStorage.setItem('player', Number(localStorage.getItem('player')) + 1)
		}
		if (winner) {
			this.displayScore()
			this.gameStatus = false
		}
	}

	getWinner() {
		let x = 0
		let o = 0
		for (const places of this.winConditions) {
			for (let i = 0; i < places.length; i++) {
				let place = document.getElementById(places[i])
				if (place.innerHTML === 'X') x++
				if (place.innerHTML === 'O') o++
			}
			if (x === 3) {
				return 'X'
			}
			if (o === 3) {
				return 'O'
			}
			o = 0
			x = 0
		}
		return
	}

	reset() {
		for (const place of this.gameboardPlaces.values())
			place.innerHTML = ''
		this.hideGameStatus()
		this.gameStatus = true
		this.nextRound()
	}

	start() {
		this.nextRound()
	}
}

const GAME = new Game()