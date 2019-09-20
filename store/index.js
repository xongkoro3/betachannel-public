import axios from 'axios'
import Cookie from "js-cookie";
import firebase from '~/plugins/firebase';
const $axios = axios.create();

export const strict = false;

export const state = () => ({
    loadedVideos: [],
    token: null,
    user: null
})

export const mutations = {
    setUser(state, user) {
        state.user = user;
    },
    setVideos(state, videos) {
        state.loadedVideos = videos
    },
    setToken(state, token) {
        state.token = token
    },
    clearToken(state) {
        state.token = null
    }
};

export const actions = {
    nuxtServerInit(vuexContext) {
        const videosQuery = firebase.firestore().collection('videos').get();
        return videosQuery.then(res => {
            const videos = res.docs.map(doc => doc.data());
            vuexContext.commit('setVideos', videos)
        }).catch(e => {
            console.log(e)
        })
    },

    setVideos(vuexContext, videos) {
        vuexContext.commit('setVideos', videos);
    },

    registerUser(vuexContext, authData) {
        firebase.auth().createUserWithEmailAndPassword(
            authData.email,
            authData.password).then(() => {
                window.localStorage.setItem('emailForSignIn', authData.email);
                window.localStorage.setItem('orgName', authData.org);
                const user = firebase.auth().currentUser;
                vuexContext.commit('setUser', user);
                const actionCodeSettings = {
                    url: 'http://localhost:3000/?email=' + authData.email,
                    handleCodeInApp: true
                };
                user.sendEmailVerification(actionCodeSettings).then(function() {
                // Email sent.
                }).catch(function(error) {
                // An error happened.
                    console.log('email verification err:', error);
                });
            })
            .catch(function(error) {
                console.log(error);
            }
        );
    },
    signinUser(vuexContext, authData) {
        const authUrl =
            "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" +
            process.env.fbAPIKey;
        return $axios
            .post(authUrl, {
                email: authData.email,
                password: authData.password,
                returnSecureToken: true
            })
            .then(result => {
                console.log('res', result);
                vuexContext.commit("setToken", result.idToken);
                localStorage.setItem("token", result.idToken);
                localStorage.setItem(
                    "tokenExpiration",
                    new Date().getTime() + String(Number.parseInt(result.expiresIn) * 1000)
                );
                Cookie.set("jwt", result.idToken);
                Cookie.set(
                    "expirationDate",
                    new Date().getTime() + String(Number.parseInt(result.expiresIn) * 1000)
                );
            })
            .catch(e => console.log(e));
    },
    verifyEmail() {
        const email = window.localStorage.getItem('emailForSignIn');
        firebase.auth().signInWithEmailLink(email, window.location.href)
            .then(function(result) {
                console.log('signin with email res:', result);
                const uid = result.user.uid;
                const org = window.localStorage.getItem('orgName');
                firebase.firestore().collection('organizations')
                    .add({
                        logoUrl: '',
                        name: org,
                        users: [uid]
                    }).then(function(docRef) {
                        console.log("Org created with ID: ", docRef.id);
                    }).catch(function(error) {
                        console.error("Error creating org: ", error);
                    });
                window.localStorage.removeItem('emailForSignIn');
            })
            .catch(function(err) {
                console.log(err);
            })
    },
    initAuth(vuexContext, req) {
        let token;
        let expirationDate;
        if (req) {
            if (!req.headers.cookie) {
                return;
            }
            const jwtCookie = req.headers.cookie
                .split(";")
                .find(c => c.trim().startsWith("jwt="));
            if (!jwtCookie) {
                return;
            }
            token = jwtCookie.split("=")[1];
            expirationDate = req.headers.cookie
                .split(";")
                .find(c => c.trim().startsWith("expirationDate="))
                .split("=")[1];
        } else {
            token = localStorage.getItem("token");
            expirationDate = localStorage.getItem("tokenExpiration");
        }
        if (new Date().getTime() > +expirationDate || !token) {
            console.log("No token or invalid token");
            vuexContext.dispatch("logout");
            return;
        }
        vuexContext.commit("setToken", token);
    },
    logout(vuexContext) {
        vuexContext.commit("clearToken");
        Cookie.remove("jwt");
        Cookie.remove("expirationDate");
        if (process.client) {
            localStorage.removeItem("token");
            localStorage.removeItem("tokenExpiration");
        }
    }
};

export const getters = {
    loadedVideos(state) {
        return state.loadedVideos
    },
    isAuthenticated(state) {
        return state.token != null;
    }
}
