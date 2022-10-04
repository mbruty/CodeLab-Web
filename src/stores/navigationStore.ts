import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useNavigationStore = defineStore("nav", () => {
	const enabled = ref(false);

	return { enabled };
});
