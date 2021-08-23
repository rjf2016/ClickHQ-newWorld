module.exports = class BaseCommand {
	constructor({ name = '', category = '', aliases = [], usage = '', description = '', requiredPermission = '' }) {
		this.name = name;
		this.category = category;
		this.aliases = aliases;
		this.usage = usage;
		this.description = description;
		this.requiredPermission = requiredPermission;
	}
};