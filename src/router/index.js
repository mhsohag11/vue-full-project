import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AuthGuard from './auth-guard'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/meetups',
    name: 'Meetups',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: () => import('../components/Meetup/Meetups.vue'),
    beforeEnter:  AuthGuard
  },
  {
    path: '/meetup/new',
    name: 'CreateMeetup',
    component: () => import('../components/Meetup/CreateMeetup.vue'),
    beforeEnter:  AuthGuard
  },
  {
    path: '/meetup/:id',
    name: 'Meetup',
    props : true,
    component: () => import('../components/Meetup/Meetup.vue'),
    beforeEnter:  AuthGuard
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../components/User/Profile.vue'),
    beforeEnter:  AuthGuard
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import('../components/User/Signin.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('../components/User/Signup.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
