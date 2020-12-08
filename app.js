const axios = require("axios")
const main = require("./")

async function app(){
	let r  = await axios.get(`http://www.sports-data.api/nfl/win-totals/2019?adjusted=true&order=total&tiebreak=random`);
	const wins = r.data
	let page = -50
	let players = []
	while(true){
		page = page + 50;
		r = await axios.get(`http://www.sports-data.api/nfl/players?page=${page}&fields=careerWAR,draftPosition`)
		output = output.concat(r.data);
		if(r.data.length == 0) break;
	}

	const avgs = players.map(p => ({r: Math.floor(p.draftPosition / 32), p: p.draftPosition % 32, w: p.careerWAR})).reduce((a,p) => (a[p.r][p.p] = a[p.r][p.p] || [0,0,0],a[p.r][p.p][1]++,a[p.r][p.p][0] += p.w,a[p.r][p.p][2] = a[p.r][p.p][0]/a[p.r][p.p][1],a), Array(7).fill(1).map(x => Array(32)))

	main(wins, avgs, 39)
}

app();

