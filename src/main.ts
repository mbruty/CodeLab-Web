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

import "./assets/main.css";

loadFonts();

// Apollo
const httpLink = createHttpLink({
	// You should use an absolute URL here
	uri: "http://localhost:8080/graphql",
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
