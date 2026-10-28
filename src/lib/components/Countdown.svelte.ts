export class Countdown {
	seconds = $state(0);
	private lastIntervalId: number | NodeJS.Timeout | undefined;

	constructor(secs?: number) {
		if (secs) this.setSeconds(secs);
	}

	setSeconds(secs: number) {
		this.seconds = secs;
		this.startCountdown();
	}

	private startCountdown() {
		this.lastIntervalId = setInterval(() => {
			this.seconds--;
		}, 1000);
	}

	stopCountdown() {
		if (!this.lastIntervalId) return;
		clearInterval(this.lastIntervalId);
	}
}
