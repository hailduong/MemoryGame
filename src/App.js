import $ from "jquery";
import swal from "sweetalert";
const cardNameList = ['bike', 'mail', 'plant', 'flower', 'speaker', 'laptop', 'phone', 'piano'];
const doubleCardList = [...cardNameList, ...cardNameList];
const totalNumberOfCards = doubleCardList.length;

const initialState = {
	numberOfMove: 0,
	isFirstCard: true,
	lastCardName: "",
	totalNumberOfHiddenCard: totalNumberOfCards,
	timeLast: "0:00",
	stars: 3,
	viewingShownCards: false
};

class MemoryGame {

	state = Object.assign({}, initialState);

	constructor() {
		this.initElements();
		this.initButtonStartGame();
		this.initButtonRestartGame();
	}

	initElements() {
		this.$board = $('.game__board');
		this.$numberOfMoves = $('.game__number-of-move').find('.number');
		this.$remainingCards = $('.game__remaining-cards').find('.number');
		this.$btnStartGame = $('#btn-start-game');
		this.$btnRestartGame = $('#btn-restart-game');
		this.$timer = $('.game__timer').find('.time');
		this.$stars = $('.game__rating').find('.stars');

	}

	initButtonStartGame() {
		this.$btnStartGame.click(() => {
			this.startGame();
			this.$btnStartGame.addClass('animated fadeOut');
			setTimeout(() => {
				this.$btnStartGame.hide();
				this.$btnRestartGame.addClass('animated fadeIn').removeClass('hidden');
			}, 300)
		});
	}

	startGame() {
		this.render();
		this.initHandleCardClick();
		this.startTimer();
	}

	initButtonRestartGame() {
		this.$btnRestartGame.click(() => {
			// Reset the state
			this.state = Object.assign({}, initialState);

			// Stop the counter
			clearInterval(this.timerInterval);

			// Start the game again
			this.startGame();
		})
	}

	startTimer() {

		let distance = 0;

		const count = () => {
			distance++;
			let seconds = Math.floor(distance % 60);
			if (seconds.toString().length === 1) seconds = "0" + seconds;
			const minutes = Math.floor(distance / 60);

			this.state.timeLast = `${minutes}:${seconds}`;
			this.renderTimer();

		};

		this.timerInterval = setInterval(count, 1000)


	}

	shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	getShuffledCardList() {
		return this.shuffleArray(doubleCardList);
	}

	renderCard(card) {
		return `<div class="col-xs-3 card hidden-card ${card}" data-name="${card}">
					${card}
				</div>`
	}

	renderAllCards() {
		const html = this.getShuffledCardList().map(item => this.renderCard(item)).join("");
		this.$board.html(html);
	}

	renderNumberOfMoves() {
		const numberOfMove = this.state.numberOfMove;
		this.$numberOfMoves.text(numberOfMove);
	}

	renderRemainingCards() {
		const totalNumberOfHiddenCard = this.state.totalNumberOfHiddenCard;
		this.$remainingCards.text(totalNumberOfHiddenCard);
	}

	renderTimer() {
		const {timeLast} = this.state;
		this.$timer.text(timeLast)
	}

	renderStarRating() {
		const star = "✭";
		let starText = "";
		const numberOfStars = this.state.stars;
		for (let i = 0; i < numberOfStars; i++) {
			starText = starText + star + " ";
		}
		this.$stars.text(starText);
	}

	render() {
		this.renderAllCards();
		this.renderNumberOfMoves();
		this.renderRemainingCards();
		this.renderTimer();
		this.renderStarRating();
	}

	initHandleCardClick() {
		const {$board} = this;
		const self = this;
		$board.on('click', '.card', function() {

			// Already opened card can not be clicked
			const cardIsOpened = $(this).hasClass('opened-card');
			const cardIsShown = $(this).hasClass('shown-card');

			if (cardIsShown || cardIsOpened) return;

			// If 2 cards are open, user should wait until those cards are closed 
			// before they can continue to click
			const {viewingShownCards} = self.state;
			if (viewingShownCards) return;

			// TODO: if 2 cards are shown, users can not click another cards until open cards are closed.
			const {isFirstCard} = self.state;
			if (isFirstCard) {
				// Show the card
				$(this).removeClass('hidden-card').addClass('shown-card');

				// Set save it so we would know the previous card
				self.state.isFirstCard = false;
				self.state.lastCardName = $(this).data('name');

				// Increase the number of move, then re-render it
				const numberOfMove = self.state.numberOfMove;
				self.state.numberOfMove = numberOfMove + 1;
				self.renderNumberOfMoves();

				// Re-adjust the rating and render it
				if (self.state.numberOfMove === 12) self.state.stars = 2;
				if (self.state.numberOfMove === 20) self.state.stars = 1;

				self.renderStarRating();

			} else {
				// Show the card
				self.state.viewingShownCards = true;
				$(this).removeClass('hidden-card').addClass('shown-card');

				// If this card is similar to the previous one, 
				// show it forever, score one point, and change it's status to 'opened-card"
				// Decrease the number of hidden card
				const lastCardName = self.state.lastCardName;
				const currentCardName = $(this).data('name');

				if (lastCardName === currentCardName) {
					const cardClassName = "." + currentCardName;
					$(cardClassName).addClass('opened-card').removeClass('shown-card');

					// Decrease the current number of un-opened cards
					const {totalNumberOfHiddenCard} = self.state;
					self.state.totalNumberOfHiddenCard = totalNumberOfHiddenCard - 2;
					self.renderRemainingCards();

					// If the remaining card is 0, then we should inform users that they win
					if (self.state.totalNumberOfHiddenCard === 0) swal("Good job!", "You opened all the cards!", "success");

					// Reset the state
					self.state.isFirstCard = true;
					self.state.lastCardName = "";
					self.state.viewingShownCards = false;

				} else {
					// If this card is not similar, hide 
					setTimeout(function() {
						$('.shown-card').removeClass('shown-card').addClass('hidden-card');
						self.state.isFirstCard = true;
						self.state.lastCardName = "";
						self.state.viewingShownCards = false;
					}, 1000)
				}
			}

			const totalNumberOfHiddenCard = self.state.totalNumberOfHiddenCard;
			console.log('Number of closed cards:', self.state.totalNumberOfHiddenCard);

			// If all card was opened, then player wins
			if (totalNumberOfHiddenCard === 0) {
				console.log('You Win');
			}
		})
	}
}

new MemoryGame();