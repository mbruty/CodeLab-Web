<template>
	<div style="margin-top: 14px; margin-left: 0.5rem">
		<div class="inline" v-if="error">
			<v-icon>mdi-alert-circle</v-icon>
			<p class="info">There was an error saving changes</p>
		</div>
		<div class="inline" v-else-if="unsavedProgress">
			<v-icon>mdi-sync-alert</v-icon>
			<p class="info">You have unsaved changes</p>
		</div>
		<div class="inline" v-else-if="loading">
			<v-icon>mdi-sync</v-icon>
			<p class="info">Saving changes...</p>
		</div>
		<div class="inline" v-else>
			<v-icon>mdi-content-save</v-icon>
			<p class="info">Solution Saved</p>
		</div>
	</div>
</template>
<script lang="ts" setup>
const props = defineProps<{
	loading: Boolean;
	unsavedProgress: Boolean;
	error: Boolean;
}>();
</script>
<style scoped>
.inline {
	display: flex;
	flex-direction: row;
}
.info {
	font-size: small;
	font-style: italic;
	padding-left: 0.5em;
}
</style>
