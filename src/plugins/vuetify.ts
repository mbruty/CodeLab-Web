// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
// Vuetify
import {createVuetify} from "vuetify";

const mq = window.matchMedia('(prefers-color-scheme: dark)').matches;

export default createVuetify(
	// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
	{
		theme: {
			defaultTheme: mq ? "dark" : "light",
		},
	}
);
