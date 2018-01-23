import Vuex from 'vuex';
import _ from 'lodash';

const Cell = ({x, y, top, right, bottom, left}) => ({x, y, top, right, bottom, left});
const checkActive = ({top, right, bottom, left}) => top || right || bottom || left;
const isNominee = (targetMaze, maze) => {
	let xDiff = Math.abs(targetMaze.x - maze.x);
	let yDiff = Math.abs(targetMaze.y - maze.y);
	if (xDiff === 0) {
		return yDiff === 1;
	} else if (yDiff === 0) {
		return xDiff === 1;
	}
};
const random = (min = 0, max = 0) => {
	if (max < min) {
		[min, max] = [max, min];
	}
	const range = max - min;
	return Math.round(Math.random() * range) + min;
};
const top = true;
const right = true;
const bottom = true;
const left = true;
const mazeExample = [
	[
		Cell({top, right}),
		Cell({left, right}),
		Cell({left, right}),
		Cell({left, right}),
		Cell({left, bottom})
	],
	[
		Cell({right, bottom}),
		Cell({left, right}),
		Cell({left, right}),
		Cell({left, right}),
		Cell({top, left})
	],
	[
		Cell({right, top}),
		Cell({right, left}),
		Cell({right, left}),
		Cell({right, left}),
		Cell({left, bottom})
	],
	[
		Cell({bottom, right}),
		Cell({left, right}),
		Cell({left, right}),
		Cell({left, right}),
		Cell({top, left})
	]
];
const store = () => new Vuex.Store({
	state: {
		width: 10,
		height: 10,
		maze: [],
		lastPosition: {}
	},
	mutations: {
		initMaze(state) {

			let maze = [];
			for(let y = 0; y < state.height; ++y) {
				let row = [];
				for (let x = 0; x < state.width; ++x) {
					row.push(Cell({x, y}));
				}
				maze.push(row);
			}
			state.maze = maze;
		},
		resetMaze(state) {
			state.maze = JSON.parse(JSON.stringify(state.maze));
		},
		setLastPosition(state, pos) {
			state.lastPosition = pos;
		},
		setWidth (state, width) {
			state.width = width;
		},
		setHeight (state, height) {
			state.height = height;
		}
	},
	getters: {
		flattenMaze(state) {
			return _.flatten(state.maze);
		},
		activeMaze(state, getters) {
			return getters.flattenMaze.filter(maze => checkActive(maze));
		},
		unActiveMaze(state, getters) {
			return getters.flattenMaze.filter(maze => !checkActive(maze));
		}
	},
	actions: {
		generateMaze({ dispatch, state, commit, getters }, type) {
			const {width, height} = state;
			let lastPosition = state.maze[random(state.height)][random(state.width)];
			commit('setLastPosition', lastPosition);
			dispatch(`generate-${type}`);
		},
		'generate-prim': function({ dispatch, state, commit, getters }) {
			let activeMaze = getters.activeMaze;
			let unActiveMaze = getters.unActiveMaze;
			let target;
			let nominee;
			if (activeMaze.length === 0) {
				target = state.lastPosition;
				nominee = unActiveMaze.filter(maze => isNominee(target, maze))[0];
			} else if (getters.unActiveMaze.length !== 0) {
				let nominees = [];
				do {
					target = activeMaze[random(0, activeMaze.length - 1)];
					nominees = unActiveMaze.filter(maze => isNominee(target, maze));
				} while (nominees.length === 0);

				nominee = nominees[random(0, nominees.length - 1)];
			} else {
				return;
			}

			console.log(target, nominee);
			let xDiff = (target.x - nominee.x);
			let yDiff = (target.y - nominee.y);

			if (Math.abs(xDiff) === 0) {
				if (yDiff === -1) {
					target.bottom = true;
					nominee.top = true;
				} else if (yDiff === 1) {
					target.top = true;
					nominee.bottom = true;
				}
			} else if (Math.abs(yDiff) === 0) {
				if (xDiff === -1) {
					target.right = true;
					nominee.left = true;
				} else if (xDiff === 1) {
					target.left = true;
					nominee.right = true;
				}
			}

			requestAnimationFrame(() => {
				dispatch('generate-prim');
			});
		},
		'generate-hunt': function({ dispatch, state, commit, getters }) {
			console.log('generate-hunt');
		},
		'generate-wilson': function({ dispatch, state, commit, getters }) {
			console.log('generate-wilson');
		}
	}
});


export default store;