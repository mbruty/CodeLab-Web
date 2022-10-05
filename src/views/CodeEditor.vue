<template>
	<div class="header">
		<h1>Task Name</h1>
	</div>
	<div class="code-zone">
		<div>
			<p>hi</p>
		</div>
		<div>
			<div class="code-tool-bar">
				<v-select
					:items="languages"
					label="Language"
					return-object
					variant="plain"
					@update:modelValue="setSelection"
				></v-select>
			</div>
			<MonacoEditor
				v-model:value="code"
				:language="selectedLanguage"
				:theme="theme"
				height="70%"
			></MonacoEditor>
		</div>
	</div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import MonacoEditor from "monaco-editor-vue3";

const code = ref(`// Please select a language first`);

const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "vs-dark" : "vs"

function setSelection(e: string) {
	// Cases where the name needs to be overwritten
	switch (e) {
		case "C-Sharp":
			selectedLanguage.value = "csharp"
			break;
		default:
			selectedLanguage.value = e.toLowerCase();

	}
}

const languages = ref([
	"JavaScript",
	"TypeScript",
	"C-Sharp"
]);

let selectedLanguage = ref("javascript");
</script>

<style scoped>
.header {
	height: 52px;
	border-bottom: 2px solid var(--color-border);
	margin-bottom: 8px;
}

.code-tool-bar {
	background-color: #1e1e1e;
	width: 100%;
	display: flex;
	flex-direction: row;
	padding: 0.5rem 0.5rem 0.5rem 2rem;
}

.code-tool-bar .v-input {
	max-width: 200px;
}

.code-zone {
	width: calc(100vw - 60px);
	height: calc(100vh - 60px);
	display: grid;
	grid-template-columns: 40% 60%;
}
</style>
