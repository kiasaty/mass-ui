import Vue        from 'vue'
import VueRouter  from 'vue-router'

Vue.use(VueRouter)

import NotFound from '@/views/NotFound'
import Login    from '@/views/Login'
import Register from '@/views/Register'

import Front  from '@/views/Front'
import Home   from '@/views/Home'

import Panel                from '@/views/panel/Panel'
import Dashboard            from '@/views/panel/Dashboard'
import Appointments         from '@/views/panel/Appointments'
import Appointment          from '@/views/panel/Appointment'
import NewAppointment       from '@/views/panel/NewAppointment'
import Specialties          from '@/views/panel/Specialties'
import Medicines            from '@/views/panel/Medicines'
import Experiments          from '@/views/panel/Experiments'
import Doctors              from '@/views/panel/Doctors'
import Secretaries          from '@/views/panel/Secretaries'
import Patients             from '@/views/panel/Patients'
import PatientMedicalRecord from '@/views/panel/PatientMedicalRecord'
import WorkSchedules        from '@/views/panel/WorkSchedules'

const routes = [
  {
    path: '*',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  { // start of front routes
    path: '/',
    component: Front,
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home,
      },
    ]
  }, // end of front routes
  { // start of panel routes
    path: '/panel',
    name: 'Panel',
    component: Panel,
    redirect: {name: 'Dashboard'},
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'appointments',
        name: 'Appointments',
        component: Appointments
      },
      {
        path: 'appointments/:appointment_id',
        name: 'Appointment',
        component: Appointment
      },
      {
        path: 'new-appointment',
        name: 'NewAppointment',
        component: NewAppointment
      },
      {
        path: 'specialties',
        name: 'Specialties',
        component: Specialties
      },
      {
        path: 'workschedules',
        name: 'WorkSchedules',
        component: WorkSchedules
      },
      {
        path: 'medicines',
        name: 'Medicines',
        component: Medicines
      },
      {
        path: 'experiments',
        name: 'Experiments',
        component: Experiments
      },
      {
        path: 'doctors',
        name: 'Doctors',
        component: Doctors
      },
      {
        path: 'secretaries',
        name: 'Secretaries',
        component: Secretaries
      },
      {
        path: 'patients',
        name: 'Patients',
        component: Patients
      },
      {
        path: 'patients/:patient_id/medicalrecord',
        name: 'PatientMedicalRecord',
        component: PatientMedicalRecord
      },
    ]
  } // end of panel routes
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('user')

  // redirect to login page if user is not logged in and trying to access a restricted page
  const authRequired = to.matched[0].path == '/panel'
  if (!loggedIn && authRequired) {
    return next('/login')
  }

  // some pages should only be shown to guests
  const guestPages = ['/login', '/register']
  const onlyGuestAllowed = guestPages.indexOf(to.matched[0].path) !== -1
  if (loggedIn && onlyGuestAllowed) {
    return next('/panel')
  }

  next()
})

export default router
