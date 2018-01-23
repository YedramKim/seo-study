<template>
	<div>
		<h1>Maze</h1>
		<div class="maze-wrapper">
			<table>
				<tbody>
					<tr
						v-for="(row, idx) in maze"
						:key="idx">
						<td
							v-for="(cell, rowIdx) in row"
							:key="rowIdx"
							:class="{
								none: !(cell.top || cell.right || cell.bottom || cell.left),
								'connect-left': cell.left,
								'connect-right': cell.right,
								'connect-top': cell.top,
								'connect-bottom': cell.bottom
							}"></td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="set-wrapper">
			<div>
				width: <input type="text" v-model.number="width">
			</div>
			<div>
				heigth: <input type="text" v-model.number="height">
			</div>
			<button @click="initMaze({width, height})">
				apply
			</button>
		</div>
		<div class="generate-wrapper">
			<select v-model="type">
				<option value="prim">Prim's Algorithm</option>
				<option value="hunt">Hunt-and-Kill Algorithm</option>
				<option value="wilson">Wilson's Algorithm</option>
			</select>
			<button @click="generateMaze(type)">
				Generate
			</button>
		</div>
	</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
	name: 'vue-maze',
	computed: {
		...mapState({
			maze: 'maze'
		}),
		...{
			width: {
				get() {
					return this.$store.state.width;
				},
				set(val) {
					this.$store.commit('setWidth', val);
				}
			},
			height: {
				get() {
					return this.$store.state.height;
				},
				set(val) {
					this.$store.commit('setHeight', val);
				}
			}
		}
	},
	methods: {
		...mapMutations({
			initMaze: 'initMaze'
		}),
		...mapActions({
			generateMaze: 'generateMaze'
		})
	},
	data() {
		return {
			type: 'prim'
		};
	},
	mounted() {
		const {width, height} = this;
		this.initMaze({
			width: 5,
			height: 5
		});
	}
};
</script>

<style lang="less" scoped>
	@size: 30px;
	table {
		margin: 0 auto;
		border-collapse: collapse;
		& td {
			width: @size;
			height: @size;
			box-sizing: border-box;

			border: 1px solid #000000;

			&.none {
				background: #000000;
			}

			&.connect-top {
				border-top-color: transparent;
			}

			&.connect-bottom {
				border-bottom-color: transparent;
			}

			&.connect-left {
				border-left-color: transparent;
			}

			&.connect-right {
				border-right-color: transparent;
			}
		}
	}

	select, button {
		width: 100%;
	}
</style>