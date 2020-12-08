function main(adjustedWins, valueChart, subtractor) {
	const teams = Object.keys(adjustedWins)
	const tdPicks = []
	const buPicks = []
	let i = valueChart.length
	while (i-- > 0) {
		tdPicks.push([])
		buPicks.push([])
	}

	const totalDraftValue = valueChart.reduce(
		(sum, arr) => sum + arr.reduce((x, y) => x + y),
		0
	)

	const {scores, wins} = teams
		.reduce((obj, team) => {
			obj.wins += (obj.scores[team] = subtractor - adjustedWins[team])
			return obj
		},
		{scores: {}, wins: 0})

	const coeff = totalDraftValue / wins
	for (const team of Object.keys(adjustedWins)) {
		scores[team] *= coeff
	}
	console.log({ ...scores })
	const buScores = { ...scores }

	const findMax = () =>
		Object.keys(scores).reduce((team1, team2) =>
			scores[team1] > scores[team2] ? team1 : team2
		)

	console.log("VALUE-ORDER METHOD")
	for (let round = 0; round < valueChart.length; round++) {
		for (let pick = 0; pick < valueChart[round].length; pick++) {
			const team = findMax(scores)
			tdPicks[round].push(team)
			scores[team] -= valueChart[round][pick]
		}
	}
	Object.keys(scores).forEach((team, i) => {
		let str = team + ":"
		let val = 0
		let oldVal = 0
		tdPicks.forEach((round, r) =>
			round.forEach((team_, p) => {
				if (team === team_) {
					str += team === team_ ? ` ${r + 1}:${p + 1},` : ""
					val += valueChart[r][p]
				}
				if (p === i) {
					oldVal += valueChart[r][p]
				}
			})
		)
		const diff = val - oldVal
		console.log(str)
		console.log(
			`new total value: ${val} (${diff > 0 ? "+" : ""}${diff}) remainder: ${
				scores[team]
			}`
		)
	})

	console.log("DISCRETE-ORDER METHOD")


	let teamsPointer = 0
	const deferralList = []
	for (let round = 0; round < valueChart.length; round++) {
		for (let pick = 0; pick < valueChart[round].length; pick++) {
			let team = deferralList[0]
			if (team) {
				for (
					let i = 0;
					buScores[team] - valueChart[round][pick] < 0;
					team = teams[++i]
				);
			}
			if (!team) {
				team = teams[teamsPointer]
				let deferralCounter = 0
				while (buScores[team] - valueChart[round][pick] < 0) {
					deferralList.push(team)
					if (++deferralCounter > 32) return
					if (++teamsPointer >= teams.length) teamsPointer = 0
					team = teams[teamsPointer]
				}
			}
			buPicks[round].push(team)
			buScores[team] -= valueChart[round][pick]
			if (++teamsPointer >= teams.length) teamsPointer = 0
		}
	}


	Object.keys(scores).forEach((team, i) => {
		let str = team + ":"
		let val = 0
		let oldVal = 0
		buPicks.forEach((round, r) =>
			round.forEach((team_, p) => {
				if (team === team_) {
					str += team === team_ ? ` ${r + 1}:${p + 1},` : ""
					val += valueChart[r][p]
				}
				if (p === i) {
					oldVal += valueChart[r][p]
				}
			})
		)
		const diff = val - oldVal
		console.log(str)
		console.log(
			`new total value: ${val} (${diff > 0 ? "+" : ""}${diff}) remainder: ${
				buScores[team]
			}`
		)
	})
}

module.exports = main
