import Vuex from 'vuex';
import _ from 'lodash';

const Cell = ({x, y, ready, top, right, bottom, left}) => ({x, y,ready,  top, right, bottom, left});
const checkActive = ({top, right, bottom, left, ready}) => (top || right || bottom || left) && !ready;
// const isNeighbor = (targetMaze, maze) => {
// 	let xDiff = Math.abs(targetMaze.x - maze.x);
// 	let yDiff = Math.abs(targetMaze.y - maze.y);
// 	if (xDiff === 0) {
// 		return yDiff === 1;
// 	} else if (yDiff === 0) {
// 		return xDiff === 1;
// 	}
// };
const isNeighbor = (targetMaze, maze) => Math.abs(targetMaze.x - maze.x) + Math.abs(targetMaze.y - maze.y) === 1;
const connectMaze = (target, nominee, ready = false) => {
	let xDiff = (target.x - nominee.x);
	let yDiff = (target.y - nominee.y);

	target.ready = ready;
	nominee.ready = ready;
	
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
		current: -1,
		startTime: 0,
		timer: 0,
		tracking: []
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
		resetTracking(state) {
			state.tracking = [];
		},
		pushTracking(state, track) {
			state.tracking.push(track);
		},
		popTracking(state) {
			state.tracking.pop();
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
		setCurrent(state, c) {
			state.current = c;
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
			commit('setCurrent', -1);
			commit('resetTracking');
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

			requestAnimationFrame(() => dispatch('generate-prim'));
		},
		'generate-hunt': function({ dispatch, state, commit, getters }) {
			let target = state.startPosition;
			let { activeMaze, unActiveMaze } = getters;
			let nominees = unActiveMaze.filter(maze => isNeighbor(target, maze));
			let nominee;
			if (unActiveMaze.length === 0) {
				commit('endTimer');
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

			requestAnimationFrame(() => dispatch('generate-hunt'));
		},
		'generate-backtracking': function({ dispatch, state, commit, getters }) {
			let target = state.startPosition;
			let { tracking } = state;
			let { activeMaze, unActiveMaze } = getters;
			let nominee;
			if (tracking.length === 0) {
				if (unActiveMaze.length === 0) {
					commit('endTimer');
				} else {
					target.ready = true;
					tracking.push(target);
					requestAnimationFrame(() => dispatch('generate-backtracking'));
				}
				return;
			}

			let nominees = unActiveMaze.filter(maze => isNeighbor(target, maze) && !maze.ready);
			if (nominees.length !== 0) {
				nominee = nominees[random(0, nominees.length - 1)];
				nominee.ready = true;
				connectMaze(target, nominee, true);
				tracking.push(nominee);
				commit('setStartPosition', nominee);
				requestAnimationFrame(() => dispatch('generate-backtracking'));
			} else if(tracking.length === 1 && unActiveMaze.length === 0) {
				commit('endTimer');
				return;
			} else {
				target = tracking[tracking.length - 2];
				nominee = tracking[tracking.length - 1];
				connectMaze(target, nominee);
				commit('popTracking');
				commit('setStartPosition', target);
				requestAnimationFrame(() => dispatch('generate-backtracking'));
			}
		},
		'generate-wilson': function({ dispatch, state, commit, getters }) {
			let { tracking, startPosition, maze, width } = state;
			let { activeMaze, unActiveMaze, flattenMaze } = getters;
			let lastTracking = tracking[tracking.length - 1];
			if (unActiveMaze.lenght === 0) {
				commit('endTimer');
				return;
			}
			
			const setCurrent = (target) => {
				commit('setCurrent', target.y * state.width + target.x);
			};

			if (activeMaze.length === 0) {
				if (tracking.length === 0) {
					do {
						lastTracking = unActiveMaze[random(unActiveMaze.length - 1)];
					} while(lastTracking === startPosition);
					commit('pushTracking', lastTracking);
				}

				let nominees = unActiveMaze.filter(maze => isNeighbor(lastTracking, maze));
				let nominee = nominees[random(nominees.length - 1)];

				if (nominee === startPosition) {
					connectMaze(lastTracking, nominee);
					commit('pushTracking', nominee);
					requestAnimationFrame(() => dispatch('generate-wilson'));
					return;
				} else if (tracking.indexOf(nominee) !== -1) {
					while (tracking.indexOf(nominee) !== -1) {
						commit('popTracking');
					}
				}
				lastTracking.ready = true;
				nominee.ready = true;
				setCurrent(nominee);
				commit('pushTracking', nominee);
			} else {			
				let llastTracking = tracking[tracking.length - 2];
				let nominee;
				
				if (tracking.length >= 2) {
					if (checkActive(lastTracking)) {
						connectMaze(llastTracking, lastTracking);
						if (unActiveMaze.length === 2) {
							flattenMaze.forEach(maze => maze.ready = false);
							commit('popTracking');
							setCurrent({x: -1, y: 0});
						} else {
							setCurrent(llastTracking);
						}
						commit('popTracking');
					} else {
						let nominees = flattenMaze.filter(maze => isNeighbor(lastTracking, maze));
						nominee = nominees[random(nominees.length - 1)];
						commit('pushTracking', nominee);
						setCurrent(nominee);
						llastTracking.ready = true;
						lastTracking.ready = true;
					}
				} else if (tracking.length === 1) {
					let nominees = flattenMaze.filter(maze => isNeighbor(lastTracking, maze));
					nominee = nominees[random(nominees.length - 1)];
					nominee.ready = true;
					commit('pushTracking', nominee);
					setCurrent(lastTracking);
				} else {
					lastTracking = unActiveMaze[random(unActiveMaze.length - 1)];
					lastTracking.ready = true;
					commit('pushTracking', lastTracking);
					setCurrent(lastTracking);
				}
			}
			requestAnimationFrame(() => dispatch('generate-wilson'));
		}
	}
});


export default store;