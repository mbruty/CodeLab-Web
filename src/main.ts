import { createApp, provide, h } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import {
	ApolloClient,
	createHttpLink,
	InMemoryCache,
} from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";

// Monaco
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

self.MonacoEnvironment = {
	getWorker(_: any, label: string) {
		if (label === "typescript" || label === "javascript") {
			return new tsWorker();
		}
		return new editorWorker();
	},
};

import "./assets/main.css";

loadFonts();

// Apollo
const httpLink = createHttpLink({
	// You should use an absolute URL here
	uri: "http://localhost:8080/graphql",
	credentials: "include",
});
const cache = new InMemoryCache();
const apolloClient = new ApolloClient({
	link: httpLink,
	cache,
});

const app = createApp({
	setup() {
		provide(DefaultApolloClient, apolloClient);
	},

	render: () => h(App),
});

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.mount("#app");
