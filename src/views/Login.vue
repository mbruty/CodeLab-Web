<template>
	<div class="container">
		<h2>Welcome back!</h2>
		<v-form ref="form" v-model="valid" lazy-validation>
			<v-text-field
				id="email"
				v-model="email"
				:rules="emailRules"
				label="E-mail"
				required
			></v-text-field>

			<v-text-field
				id="password"
				v-model="password"
				:rules="passwordRules"
				label="Password"
				type="password"
				required
			></v-text-field>
			<div v-if="errorText" class="v-messages__message">{{ errorText }}</div>
			<div class="inline">
				<p>
					Don't have an account? <router-link to="join">join us</router-link>
				</p>
				<v-btn id="submit" :disabled="!valid" color="success" @click="submit">
					Login
				</v-btn>
			</div>
		</v-form>
	</div>
</template>

<script setup lang="ts">
import router from "@/router";
import { useNavigationStore } from "@/stores/navigationStore";
import { useUserStore } from "@/stores/userStore";
import { ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import type { User } from "@/gql/types/graphql";

// GQL Mutation
const {
	mutate: login,
	loading,
	onDone,
	onError,
} = useMutation<User, { email: string; password: string }>(gql`
	mutation LoginMutation($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			id
			email
			username
			refreshCount
		}
	}
`);

// Stores
const nav = useNavigationStore();
const userStore = useUserStore();
nav.enabled = false;
// Models
let email = ref("");
let password = ref("");
let errorText = ref("");
// Form bits
let valid = ref(true);

let emailRules = [
	(v: string) => !!v || "E-mail is required",
	(v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
];

function submit() {
	login({
		email: email.value,
		password: password.value,
	});
}

onDone((result) => {
	if (!result.data) return;

	userStore.user = result.data;
	router.push("/dashboard");
	nav.enabled = true;
});

onError(() => {
	errorText.value = "Incorrect login information";
});
</script>

<style scoped>
form {
	width: 100%;
	display: flex;
	flex-direction: column;
}

.container {
	padding: 2rem;
	max-width: 900px;
	min-width: 500px;
}

button {
	margin: 0 0 0 auto;
}

.inline {
	display: flex;
	flex-direction: row;
}

@media only screen and (min-width: 800px) {
	h2 {
		max-width: 40%;
		border-right: 1px solid var(--color-border);
		margin-right: 1rem;
		padding-right: 1rem;
	}
	.container {
		padding: 2rem;
		flex-direction: row;
	}
}
</style>
