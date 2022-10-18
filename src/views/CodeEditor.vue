<template>
	<div v-if="loading && firstLoad" class="absolute-center">
		<v-progress-circular :size="70" color="green" indeterminate />
		<p>Loading...</p>
	</div>
	<div v-else>
		<div class="header">
			<h1>{{ data.title }}</h1>
		</div>
		<div class="code-zone">
			<div class="code-editor">
				<div class="code-tool-bar">
					<v-select
						:item-value="selectedLanguage"
						:items="languages"
						:model-value="selectedLanguage"
						label="Language"
						return-object
						variant="plain"
						@update:modelValue="setSelection"
					></v-select>
					<SavingIndicator
						:loading="saveLoading"
						:unsavedProgress="unsavedProgress"
						:error="!!saveError"
					/>
					<div style="margin: 0 0 0 auto" />
					<v-btn prepend @click="reset">
						<v-icon>mdi-refresh</v-icon>
						Reset
					</v-btn>
					<v-btn
						v-if="
							!userHasChangedCode &&
							evalResult != undefined &&
							evalResult.evaluate.isSuccessful
						"
						color="success"
					>
						<v-progress-circular
							v-if="evalLoading"
							:size="20"
							color="white"
							indeterminate
							style="margin-right: 5px"
						/>
						<v-icon v-else style="pargin-right: 5px">mdi-content-save</v-icon>
						Submit solution
					</v-btn>
					<v-btn v-else color="success" @click="onRunCodeClick">
						<v-progress-circular
							v-if="evalLoading"
							:size="20"
							color="white"
							indeterminate
							style="margin-right: 5px"
						/>
						<v-icon v-else style="margin-right: 5px">mdi-play</v-icon>
						Run Code
					</v-btn>
				</div>
				<MonacoEditor
					v-model:value="data.myCode"
					:language="monacoLanguage"
					:theme="theme"
					height="50%"
					@change="saveChanges"
				></MonacoEditor>
				<div class="container"></div>
				<div class="code-tool-bar">
					<h2>Test code</h2>
				</div>
				<v-divider />
				<MonacoEditor
					v-model:value="data.testCode"
					:language="monacoLanguage"
					:theme="theme"
					height="31%"
					@change="change"
				></MonacoEditor>
				<div class="container" />
			</div>

			<div class="code-zone--left">
				<div class="container container--rounded container--description">
					<h2>Task</h2>
					<v-divider />
					{{ data.description }}
				</div>
				<div :class="outputClass">
					<div style="display: flex">
						<h2>Output</h2>
						<div
							style="
								margin-right: 1rem;
								margin-left: auto;
								vertical-align: baseline;
							"
							v-html="runText"
						></div>
					</div>
					<v-divider />
					<pre v-if="outputText">{{ outputText }}</pre>
				</div>
				<StatsContainer :data="evalResult?.evaluate" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import MonacoEditor from "monaco-editor-vue3";
import { useMutation, useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import type {
	CodeResponse,
	ProgrammingTask,
	MutationSubmitCodeArgs,
} from "@/gql/types/graphql";
import { useRoute } from "vue-router";
import StatsContainer from "../components/code-editor/StatsContainer.vue";
import SavingIndicator from "../components/code-editor/SavingIndicator.vue";

let originalTestCode = "";
let originalCode = "";

//region Reactive variables
const route = useRoute();

const props = reactive({
	id: parseInt(route.params["id"] as string),
	language: "default",
});

const evaluateProps = {
	code: "",
	language: "",
};

const evaluateOptions = ref({
	enabled: false,
});

const unsavedProgress = ref(false);
const userHasChangedCode = ref(false);
const data = ref<ProgrammingTask>({
	id: -1,
	description: "",
	starterCode: "",
	title: "",
	testCode: "",
	language: "",
	myCode: "",
	availableLanguages: [],
});

const firstLoad = ref(true);

const languages = ref(["loading..."]);

const selectedLanguage = ref("default");

const outputClass = ref("container container--rounded container--output");
//endregion

// region Graphql
const { result, error, loading } = useQuery<{
	programmingTask: ProgrammingTask;
}>(
	gql`
		query GetCode($id: Int!, $language: String!) {
			programmingTask(taskId: $id, language: $language) {
				id
				title
				description
				starterCode
				testCode
				language
				availableLanguages
				myCode
			}
		}
	`,
	props
);

const {
	result: evalResult,
	error: evalError,
	loading: evalLoading,
	refetch: evaluateCode,
} = useQuery<{ evaluate: CodeResponse }>(
	gql`
		query Evaluate($code: String!, $language: String!) {
			evaluate(code: $code, language: $language, taskId: 1) {
				output
				stats {
					mem
				}
				errorText
				isSuccessful
				executionTimeMS
			}
		}
	`,
	evaluateProps,
	evaluateOptions
);

const {
	mutate: saveCode,
	loading: saveLoading,
	error: saveError,
} = useMutation<boolean, MutationSubmitCodeArgs>(
	gql`
		mutation SaveCode($submission: UserCodeSubmissionInput) {
			submitCode(submission: $submission)
		}
	`
);
// endregion

// region Computed variables
const monacoLanguage = computed(() => {
	// Map languages to the monaco editors language
	switch (selectedLanguage.value) {
		case "C#":
			return "csharp";
		default: // If they don't need overriding then allow it
			return selectedLanguage.value.toLowerCase();
	}
});

const runText = computed(() => {
	if (evalResult.value == undefined) return;
	if (evalResult.value?.evaluate.errorText) {
		return `<span style="color: red;">Build error</span>`;
	}
	if (!evalResult.value?.evaluate.isSuccessful) {
		return `<span style="color: red;">Failing Tests</span>`;
	}
	return `<span style="color: green;">Passing Tests</span>`;
});

const outputText = computed(() => {
	if (evalResult.value == undefined) return;
	if (evalResult.value?.evaluate.errorText) {
		return evalResult.value?.evaluate.errorText;
	}
	return evalResult.value?.evaluate.output;
});

watch(result, () => {
	originalTestCode = result.value?.programmingTask.testCode ?? "";
	data.value = result.value?.programmingTask;
	languages.value = result.value?.programmingTask?.availableLanguages ?? [""];
	selectedLanguage.value = result.value?.programmingTask.language ?? "";

	if (!result?.value?.programmingTask.myCode) {
		data.value.myCode = result?.value?.programmingTask.starterCode;
	}
});

// watch([evalResult, unsavedProgress], () => {
// 	console.log(
// 		evalResult.value.evaluate.isSuccessful && unsavedProgress
// 	);
// });

watch(loading, () => {
	if (!loading.value) {
		firstLoad.value = false;
	}
});

let outputClassTimeout: number | undefined;

watch(evalResult, () => {
	userHasChangedCode.value = false;
	const defualtClass = "container container--rounded container--output output";
	if (evalResult.value?.evaluate.isSuccessful) {
		outputClass.value = defualtClass + " output--success";
	} else {
		outputClass.value = defualtClass + " output--failure";
	}
	clearTimeout(outputClassTimeout);
	outputClassTimeout = setTimeout(() => {
		outputClass.value = defualtClass;
	}, 500);
});

// endregion

const theme =
	window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
		? "vs-dark"
		: "vs";

// region Functions
function setSelection(e: string) {
	props.language = e;
}

function change() {
	data.testCode = originalTestCode;
}

let saveTimeout: number | undefined;

function saveChanges() {
	clearTimeout(saveTimeout);
	unsavedProgress.value = true;
	userHasChangedCode.value = true;
	// Save the code after 1s of not typing
	saveTimeout = setTimeout(() => {
		saveCode({
			submission: {
				codeText: data.value.myCode ?? data.value.starterCode,
				language: data.value.language,
				taskId: data.value.id,
			},
		});
		unsavedProgress.value = false;
	}, 1000);
}

function onRunCodeClick() {
	evaluateProps.language = data.value.language;
	evaluateProps.code = data.value.myCode ?? "";
	evaluateOptions.value.enabled = true;
	evaluateCode(evaluateProps);
}

function onSubmitClicked() {
	saveCode({
		submission: {
			codeText: data.value.myCode!!,
			language: data.value.language,
			taskId: data.value.id,
			isSubmitted: true
		}
	})
}

function reset() {
	data.value.starterCode = originalCode;
}

//endregion
</script>

<style scoped>
.header {
	height: 52px;
	border-bottom: 2px solid var(--color-border);
	margin-bottom: 8px;
}

.code-tool-bar {
	background-color: var(--color-background-hard);
	width: 100%;
	display: flex;
	flex-direction: row;
	padding: 0.5rem 0.5rem 0.5rem 2rem;
	border-radius: 15px 15px 0 0;
}

.code-tool-bar .v-input {
	max-width: 200px;
}

.code-zone {
	width: calc(100vw - 60px);
	height: calc(100vh - 60px);
	display: grid;
	grid-template-columns: 60% 40%;
	margin-left: 1em;
}

.code-editor {
	display: flex;
	flex-direction: column;
}

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

.container--description {
	height: 40%;
	overflow: scroll;
	flex-direction: column;
}

.container--output {
	height: 40%;
	overflow: scroll;
	flex-direction: column;
}

.container--stats {
	height: 20%;
	flex-direction: column;
	overflow: scroll;
}

.code-zone--left {
	display: flex;
	flex-direction: column;
	margin-right: 1rem;
}

.output {
	transition: background-color 0.5s ease;
}

.output--success {
	background-color: green;
}

.output--failure {
	background-color: red;
}
button {
	margin-right: 0.5rem;
}

pre {
	white-space: pre-wrap;
}
</style>
