import Vuex from 'vuex';
import _ from 'lodash';

const Cell = ({x, y, top, right, bottom, left}) => ({x, y, top, right, bottom, left});
const checkActive = ({top, right, bottom, left}) => top || right || bottom || left;
const isNeighbor = (targetMaze, maze) => {
	let xDiff = Math.abs(targetMaze.x - maze.x);
	let yDiff = Math.abs(targetMaze.y - maze.y);
	if (xDiff === 0) {
		return yDiff === 1;
	} else if (yDiff === 0) {
		return xDiff === 1;
	}
};
const connectMaze = (target, nominee) => {
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
};
const random = (min = 0, max = 0) => {
	if (max < min) {
		[min, max] = [max, min];
	}
	const range = max - min;
	return Math.round(Math.random() * range) + min;
};
const store = () => new Vuex.Store({
	state: {
		width: 10,
		height: 10,
		maze: [],
		startPosition: {},
		startTime: 0,
		timer: 0
	},
	mutations: {
		resetMaze(state) {
			let maze = [];
			for(let y = 0; y < state.height; ++y) {
				let row = [];
				for (let x = 0; x < state.width; ++x) {
					row.push(Cell({x, y}));
				}
				maze.push(row);
			}
			state.maze = maze;
			state.timer;
		},
		setStartPosition(state, pos) {
			state.startPosition = pos;
		},
		setWidth (state, width) {
			state.width = width;
		},
		setHeight (state, height) {
			state.height = height;
		},
		startTimer: function(state) {
			console.time('timer');
			state.startTime = Date.now();
			state.timer = 0;
		},
		endTimer(state) {
			console.timeEnd('timer');
			state.timer = (Date.now() - state.startTime) / 1000;
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
			let startPosition = state.maze[random(state.height)][random(state.width)];
			commit('setStartPosition', startPosition);
			commit('startTimer');
			dispatch(`generate-${type}`);
		},
		'generate-prim': function({ dispatch, state, commit, getters }) {
			let activeMaze = getters.activeMaze;
			let unActiveMaze = getters.unActiveMaze;
			let target;
			let nominee;
			if (activeMaze.length === 0) {
				target = state.startPosition;
				nominee = unActiveMaze.filter(maze => isNeighbor(target, maze))[0];
			} else if (getters.unActiveMaze.length !== 0) {
				let nominees = [];
				do {
					target = activeMaze[random(0, activeMaze.length - 1)];
					nominees = unActiveMaze.filter(maze => isNeighbor(target, maze));
				} while (nominees.length === 0);

				nominee = nominees[random(0, nominees.length - 1)];
			} else {
				commit('endTimer');
				return;
			}

			connectMaze(target, nominee);

			requestAnimationFrame(() => {
				dispatch('generate-prim');
			});
		},
		'generate-hunt': function({ dispatch, state, commit, getters }) {
			let target = state.startPosition;
			let { activeMaze, unActiveMaze } = getters;
			let nominees = unActiveMaze.filter(maze => isNeighbor(target, maze));
			let nominee;
			if (unActiveMaze.length === 0) {
				return;
			} else if (nominees.length === 0) {
				nominee = unActiveMaze.find(maze => {
					let result = activeMaze.some(maze2 => {
						let result2 = isNeighbor(maze, maze2);
						if (result2) {
							target = maze2;
							return true;
						}
					});
					if (result) {
						return maze;
					}
				});
			} else {
				nominee = nominees[random(0, nominees.length - 1)];
			}
			connectMaze(target, nominee);
			commit('setStartPosition', nominee);

			requestAnimationFrame(() => {
				dispatch('generate-hunt');
			});
		},
		'generate-wilson': function({ dispatch, state, commit, getters }) {
			console.log('generate-wilson');
		}
	}
});


export default store;