import {createRouter, createWebHistory} from "vue-router";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/join",
			name: "signup",
			component: () => import("@/views/Signup.vue"),
		},
		{
			path: "/login",
			name: "login",
			component: () => import("@/views/Login.vue")
		},
		{
			path: "/dashboard",
			name: "dashboard",
			component: () => import("@/views/Dashboard.vue")
		},
		{
			path: "/code/:id",
			name: "code",
			props: route => ({id: route.query.id}),
			component: () => import("@/views/CodeEditor.vue"),
		}
	],
});

export default router;
