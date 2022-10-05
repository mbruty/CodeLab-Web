<template>
	<v-card v-if="nav.enabled" style="z-index: 1">
		<v-layout>
			<v-navigation-drawer expand-on-hover rail>
				<v-list>
					<v-list-item>
						<div class="avatar-container">
							<img :src="imageUrl" alt="Avatar" width="24"/>
							<h2>{{ userStore.user.username }}</h2>
						</div>
					</v-list-item>
				</v-list>
				<v-divider></v-divider>

				<v-list>
					<v-list-item>
						<div class="level-container">
							<div class="level-text">{{ level }}</div>
							<div class="xp-container">
								<div class="xp-progress">
									<div class="xp-indicator">{{ xpRemaining }}</div>
									<div class="xp-indicator">100</div>
								</div>
								<v-progress-linear :model-value="xpRemaining" rounded/>
							</div>
						</div>
					</v-list-item>
				</v-list>

				<v-divider></v-divider>

				<v-list v-for="item in navItems" density="compact" nav>
					<router-link :to="item.url"
					>
						<v-list-item
							:prepend-icon="item.icon"
							:title="item.title"
						></v-list-item
						>
					</router-link>
				</v-list>
			</v-navigation-drawer>
		</v-layout>
	</v-card>
</template>

<script lang="ts" setup>
import {useNavigationStore} from "@/stores/navigationStore";
import {computed} from "vue";
import {useUserStore} from "../stores/userStore";

const userStore = useUserStore();
const nav = useNavigationStore();

const navItems: Array<{ icon: string; title: string; url: string }> = [
	{
		icon: "mdi-view-dashboard",
		title: "Home",
		url: "dashboard",
	},
	{
		icon: "mdi-logout",
		title: "Log out",
		url: "logout"
	}
];

let imageUrl = computed(
	() =>
		`https://avatars.dicebear.com/api/bottts/${
			userStore.user?.username ?? "default"
		}.svg`
);

const level = computed(() => Math.floor(userStore.user?.xp / 100));
const xpRemaining = computed(() => userStore.user?.xp % 100);
</script>

<style scoped>
.avatar-container {
	display: flex;
	flex-direction: row;
}

.avatar-container h2 {
	padding-left: 1em;
}

.level-container {
	display: flex;
	flex-direction: row;
}

.level-text {
	min-width: 24px;
	height: 100%;
	text-align: center;
	background-image: url("@/assets/star.svg");
}

.xp-container {
	display: flex;
	flex-direction: column;
	width: 100%;
	margin-left: 15px;
}

.xp-progress {
	display: flex;
	flex-direction: row;
}

.xp-progress .xp-indicator:last-of-type {
	margin: 0 0 0 auto;
}
</style>
