const moment = require('moment');

module.exports = (lastUpdated) => {
	if (lastUpdated === '?') {
		return '--'
	}
	const relative = moment(lastUpdated, 'YYYY-MM-DD').fromNow();
	if (relative.includes('hours ago')) {
		return 'Today'
	} else {
		return relative
	}
}
