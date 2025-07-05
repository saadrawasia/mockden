const { getJestProjectsAsync } = require('@nx/jest');

/** @returns {Promise<import('jest').Config>} */
module.exports = async () => {
	return {
		projects: await getJestProjectsAsync(),
	};
};
