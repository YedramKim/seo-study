import Vuex from 'vuex';
import _ from 'lodash';

const Cell = ({top, right, bottom, left}) => ({top, right, bottom, left});
const checkNone = ({top, right, bottom, left}) => top || right || bottom || left;
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
		width: 0,
		height: 0,
		startPos: {},
		maze: [
			// [
			// 	Cell({}),
			// 	Cell({}),
			// 	Cell({}),
			// 	Cell({}),
			// 	Cell({})
			// ],
			// [
			// 	Cell({}),
			// 	Cell({}),
			// 	Cell({}),
			// 	Cell({}),
			// 	Cell({})
			// ],
			// [
			// 	Cell({}),
			// 	Cell({}),
			// 	Cell({}),
			// 	Cell({}),
			// 	Cell({})
			// ],
			// [
			// 	Cell({}),
			// 	Cell({}),
			// 	Cell({}),
			// 	Cell({}),
			// 	Cell({})
			// ],
			// [
			// 	Cell({}),
			// 	Cell({}),
			// 	Cell({}),
			// 	Cell({}),
			// 	Cell({})
			// ]
			[]
		]
	},
	mutations: {
		initMaze(state, {width, height, startPos}) {
			state.width = width;
			state.height = height;
			state.startPos = startPos;

			let maze = [];
			for(let i = 0; i < height; ++i) {
				let row = [];
				for (let j = 0; j < width; ++j) {
					row.push(Cell({}));
				}
				maze.push(row);
			}
			maze[startPos.y][startPos.x].right = true;
			state.maze = maze;
		},
		setMaze(state, {x, y}) {
			console.log('resetMaze', state.maze[0][0]);
			state.maze[y][x].top = true;
		}
	},
	actions: {
		generateMaze(store) {
			const { commit, state, dispatch} = store;
			const { width, height, startPos, maze } = state;

			commit('initMaze', { width, height, startPos });
			commit('setMaze', {x: 0, y: 0});
		}
	}
});


export default store;