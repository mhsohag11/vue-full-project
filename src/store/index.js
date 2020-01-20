import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    siteTitle : 'Meet Up Devs',
    menuItems : [
      { icon: 'face', title: 'Sign up', link: '/signup' },
      { icon: 'lock_open', title: 'Sign in', link: '/signin' }
    ],
    loadedMeetups : [],
    user : null,
    loading : false,
    error : false,
  },
  mutations: {
    pushNewMeetup (state , payload) {
      state.loadedMeetups.push(payload)
    },
    setUser (state , payload) {
        state.user = payload
    },
    setLoading (state , payload) {
      state.loading = payload
    },
    setError (state , payload) {
      state.error = payload
    },
    clearError ( state ) {
      state.error = null
    },
    meetupsFromDatabase ( state , payload ) {
      state.loadedMeetups = payload
    },

  },
  actions: {
    loadedMeetupsFromFirebase ({ commit }) {
      firebase.database().ref('meetups').once('value')
          .then(data => {
            const meetups = []
            const obj = data.val()
            for ( let key in obj ) {
              meetups.push({
                imageUrl: obj[key].imageUrl,
                id: key,
                title: obj[key].title,
                date : obj[key].date,
                time : obj[key].time,
                location: obj[key].location,
                description: obj[key].description
              })
            }
            commit('meetupsFromDatabase' , meetups)


          })
          .catch(error => {
            console.log(error)
          })
    },
    createNewMeetup ( {commit} , payload ) {
      const meetup = {
        title : payload.title,
        location : payload.location,
        imageUrl : payload.imageUrl,
        description : payload.description,
        date : payload.date,
        time : payload.time,
      }
      firebase.database().ref('meetups').push(meetup)
          .then(data => {
            commit('clearError')
            console.log(data.key)
            payload.id = data.key
            commit('pushNewMeetup', payload);
          })
          .catch( error => {
            console.log(error)
            commit( 'setError' , error )
          })
    },
    doActionForSignup ({commit} , payload) {
      commit('clearError')
      commit('setLoading' , true )
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
          .then( userObj => {
              commit('setLoading' , false )
              const newUser = {
                userID: userObj.user.id,
                registerMeetups: []
              }
            commit('setUser', newUser)
          })
          .catch( error => {
            commit('setLoading' , false )
            commit('setError', error)
            console.log(error)
          })

    },
    singIn ({ commit }, payload) {
      commit('clearError')
      commit('setLoading' , true )
      firebase.auth().signInWithEmailAndPassword(payload.email , payload.password)
          .then( userObj => {
            commit('setLoading', false)
            const existUser = {
              userID: userObj.user.uid,
              registerMeetups: []
            }
            commit('setUser', existUser)

          })
          .catch( error => {
            commit( 'setLoading' , false)
            commit( 'setError' , error)
            console.log(error)
          })
    },
    autoSignIn ({commit} , payload) {
      commit('setUser' , { userID : payload.uid , registerMeetups : [] })
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    }
  },
  getters : {
    user (state) {
      return state.user
    },
    sortedMeetupByDate (state) {
      return state.loadedMeetups.sort( (meetupA,meetupB) => {
        return new Date(meetupB.date) - new Date(meetupA.date);
      })
    },
    featuredMeetups (state,getters) {
      return getters.sortedMeetupByDate.slice(0,5);
    },
    SingleMeetup (state) {
      return  (idFromMeetupsPage) => {
        return state.loadedMeetups.find( (meetup) => {
          return meetup.id==idFromMeetupsPage;
        })
      }

    },
    error (state) {
      return state.error
    },
    loading (state) {
      return state.loading
    }
  }
})
