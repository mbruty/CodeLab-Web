import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { User } from "@/gql/types/graphql";

export const useUserStore = defineStore("user", () => {
	const user = ref<User | undefined>();
  const isLoading = ref(true);
	return { user, isLoading };
});
