<template>
	<div v-if="result">
		<p>{{ hello }}</p>
	</div>
</template>

<script setup lang="ts">
import type { HelloQueryQuery } from "@/gql/types/graphql";
import { useQuery } from "@vue/apollo-composable";
import { computed } from "@vue/reactivity";
import gql from "graphql-tag";

const { result } = useQuery<HelloQueryQuery>(gql`
	query helloQuery {
		hello
	}
`);

const hello = computed(() => result.value?.hello ?? "");
</script>

<style scoped>
</style>