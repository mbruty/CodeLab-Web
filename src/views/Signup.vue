<template>
	<div class="absolute-center">
		<div class="container">
			<h2>
				Welcome, you're only 1 step away from joining the best online coding
				platform there is
			</h2>
			<v-form ref="form" v-model="valid" lazy-validation>
				<v-text-field
					id="name"
					v-model="name"
					:counter="10"
					:rules="nameRules"
					label="Nick name"
					required
				></v-text-field>

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
					required
					type="password"
				></v-text-field>

				<v-text-field
					id="passwordConf"
					v-model="passwordConf"
					:rules="passwordConfRules"
					label="Confirm Password"
					required
					type="password"
				></v-text-field>
				<div class="inline">
					<p>Already have an account?
						<router-link to="login">log in</router-link>
					</p>
					<v-btn id="submit" :disabled="!valid" color="success" @click="submit">
						Create Account
					</v-btn>
				</div>
			</v-form>
		</div>
	</div>
</template>

<script lang="ts" setup>
import router from "@/router";
import {useNavigationStore} from "@/stores/navigationStore";
import {ref} from "vue";

const nav = useNavigationStore();
nav.enabled = false;
// Models
let name = ref("");
let email = ref("");
let password = ref("");
let passwordConf = ref("");

// Form bits
let valid = ref(true);
let nameRules = [
	(v: string) => !!v || "Name is required",
	(v: string) =>
		(v && v.length <= 10) || "Name must be less than 10 characters",
];
let emailRules = [
	(v: string) => !!v || "E-mail is required",
	(v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
];
let passwordRules = [
	(v: string) => !!v || "Password is required",
	(v: string) =>
		/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
			v
		) ||
		"Password requires: 8 characters | 1 Uppercase letter, | 1 Lowercase letter, | 1 Number, | 1 Special",
];

let passwordConfRules = [
	(v: string) => !!v || "Confirm your password is required",
	(v: string) => v == password.value || "Passwords do not match",
];

function submit() {
	router.push("/dashboard");
	nav.enabled = true;
}
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
