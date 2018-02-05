import $ from "jquery";

const cardNameList = ['bike', 'mail', 'plant', 'flower', 'speaker', 'laptop', 'phone', 'piano'];
const doubleCardList = [...cardNameList, ...cardNameList];
const totalNumberOfCards = doubleCardList.length;


class MemoryGame {

	state = {
		isFirstCard: true,
		lastCardName: "",
		totalNumberOfHiddenCard: totalNumberOfCards
	};

	constructor() {
		this.$board = $('.board');
		this.renderAllCards();
		this.initHandleCardClick();
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

	initHandleCardClick() {
		const {$board} = this;
		const self = this;
		$board.on('click', '.card', function() {
			const {isFirstCard} = self.state;
			if (isFirstCard) {
				// Show the card
				$(this).removeClass('hidden-card').addClass('shown-card');

				// Set save it so we would know the previous card
				self.state.isFirstCard = false;
				self.state.lastCardName = $(this).data('name');
			} else {
				// Show the card
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

					// Reset the state
					self.state.isFirstCard = true;
					self.state.lastCardName = ""

				} else {
					// If this card is not similar, hide 
					setTimeout(function() {
						$('.shown-card').removeClass('shown-card').addClass('hidden-card');
						self.state.isFirstCard = true;
						self.state.lastCardName = ""
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