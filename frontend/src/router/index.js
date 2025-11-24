// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import GroupsView from '../views/GroupsView.vue'
import GroupDetailView from '../views/GroupDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'groups',
    component: GroupsView
  },
  {
    path: '/groups/:id',
    name: 'group-detail',
    component: GroupDetailView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router