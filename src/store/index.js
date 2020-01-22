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
    uploadVal: null,
    uploadStatus: null,
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
    uploadVal (state, payload) {
      state.uploadVal = payload
    },
    uploadStatus (state , payload) {
      state.uploadStatus = payload
    }

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
                description: obj[key].description,
                creatorId: obj[key].creatorId
              })
            }
            commit('meetupsFromDatabase' , meetups)


          })
          .catch(error => {
            console.log(error)
          })
    },
    createNewMeetup ( {commit, getters } , payload ) {
      const meetup = {
        title : payload.title,
        location : payload.location,
        description : payload.description,
        date : payload.date,
        time : payload.time,
        creatorId : getters.user.userID,
      }
      let keyFromFirebase
      let myImageUrlFromFirebase
      firebase.database().ref('meetups').push(meetup)
          .then(data => {
            commit('clearError')
            keyFromFirebase = data.key
            return keyFromFirebase
          })
          .then( key => {
            const filename = payload.image.name
            const ext = filename.slice(filename.lastIndexOf('.'))
            var uploadTask =  firebase.storage().ref('meetups/' + key + ext ).put(payload.image)
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  console.log('Upload is ' + Math.floor(progress) + '% done')
                  commit('uploadVal', Math.floor(progress))
                  switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                      commit('uploadStatus', 'Upload is paused')
                      break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                      commit('uploadStatus', 'Uploading...')
                      break;
                  }
                },
                (error) => {
                  switch (error.code) {
                    case 'storage/unauthorized':
                      // User doesn't have permission to access the object
                      commit('uploadStatus', 'User doesn\'t have permission to access the object')
                      break

                    case 'storage/canceled':
                      // User canceled the upload
                      commit('uploadStatus', 'User canceled the upload')
                      break
                    case 'storage/unknown':
                      // Unknown error occurred, inspect error.serverResponse
                      commit('uploadStatus', 'Unknown error occurred, inspect error.serverResponse')
                      break
                  }
                },
                () => {
                  return uploadTask.snapshot.ref.getDownloadURL()
                      .then( downloadURL => {
                        myImageUrlFromFirebase = downloadURL
                        return firebase.database().ref('meetups').child(keyFromFirebase).update({imageUrl : downloadURL})
                      })
                      .then( () => {
                        commit('pushNewMeetup', {
                          ...meetup,
                          id: keyFromFirebase,
                          imageUrl: myImageUrlFromFirebase
                        })
                        commit('uploadVal', null )
                        commit('setLoading', true )
                      })
                }
                )

          })
          // .then(downloadURL => {
          //   console.log('put hoyce')
          //   console.log(downloadURL)
          //   myImageUrlFromFirebase = downloadURL
          //   return firebase.database().ref('meetups').child(keyFromFirebase).update({imageUrl : downloadURL})
          // })
          // .then( () => {
          //   commit('pushNewMeetup', {
          //     ...meetup,
          //     id: keyFromFirebase,
          //     imageUrl: myImageUrlFromFirebase
          //   })
          // })
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
    },
    uploadVal (state) {
      return state.uploadVal
    }
  }
})
