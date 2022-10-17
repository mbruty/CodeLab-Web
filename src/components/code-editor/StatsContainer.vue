<template>
	<div class="container container--rounded container--stats">
		<h2>Stats</h2>
		<v-divider />
		<v-table v-if="props.data">
			<thead>
				<tr>
					<th class="text-left">Execution Time</th>
					<th class="text-left">Memory Usage</th>
				</tr>
			</thead>
			<tbody>
				<tr v-if="execTime">
					<td>{{ execTime }} ms</td>
					<td>{{ maxMemory }} kb</td>
				</tr>
			</tbody>
		</v-table>
	</div>
</template>
<script setup lang="ts">
import type { CodeResponse, Stat } from "@/gql/types/graphql";
import { computed } from "@vue/reactivity";
const props = defineProps<{
	data: CodeResponse | undefined;
}>();

const maxMemory = computed(() => {
	if (props.data == undefined) return 0;
	let max = props.data.stats?.reduce((acc: number, val: Stat) => {
		if (val == null) {
			return acc;
		}
		return +val.mem > acc ? val.mem : acc;
	}, 0);
	return Math.round(max / 1000);
});

const execTime = computed(() => props.data?.executionTimeMS ?? 0);
</script>
<style scoped>
.container {
	background-color: var(--color-background-hard);
	border-radius: 0 0 15px 15px;
	margin: 0 0 1rem 0;
	flex-direction: row;
	padding: 1rem;
}

.container--rounded {
	border-radius: 15px;
	margin: 0 1rem 1rem 1rem;
}

.container--stats {
	height: 20%;
	flex-direction: column;
	overflow: scroll;
}
</style>
