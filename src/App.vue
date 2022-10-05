<script lang="ts" setup>
import {RouterView} from "vue-router";
import NavBar from "./components/NavBar.vue";
import {useUserStore} from "./stores/userStore";
import {useQuery} from "@vue/apollo-composable";
import gql from "graphql-tag";
import {watch} from "vue";
import router from "./router";
import {useNavigationStore} from "./stores/navigationStore";
import {User} from "./gql/types/graphql";

const userStore = useUserStore();
const navigationStore = useNavigationStore();
const {result, error} = useQuery<{ me: User }>(gql`
	query AuthCheck {
		me {
			id
			email
			username
			xp
		}
	}
`);
watch(result, () => {
	userStore.isLoading = false;
	console.log(result.value?.me);
	userStore.user = result.value?.me;
	navigationStore.enabled = true;
});

watch(error, () => {
	userStore.isLoading = false;
	router.push("/join");
});
</script>

<template>
	<div v-if="userStore.isLoading" class="center">
		<v-progress-circular :size="70" color="green" indeterminate/>
		<p>Loading...</p>
	</div>
	<div v-else>
		<header>
			<NavBar/>
		</header>
		<div style="margin-left: 60px; width: calc(100vw - 60px); height: 100vh;">
			<RouterView/>
		</div>
	</div>
</template>

<style scoped>

.center {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

p {
	margin-top: 1em;
}
</style>
