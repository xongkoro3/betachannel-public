// import axios from 'axios'
import Cookie from "js-cookie";
import firebase from '~/plugins/firebase';
// const $axios = axios.create();

export const strict = false;

export const state = () => ({
    loadedVideos: [],
    token: null,
    user: null,
    org: null
})

export const mutations = {
    setUser(state, user) {
        state.user = user;
    },
    setOrg(state, org) {
        state.org = org;
    },
    setVideos(state, videos) {
        state.loadedVideos = videos
    },
    setToken(state, token) {
        state.token = token
    },
    clearUser(state) {
        state.currentUser = null
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
                    const user = firebase.auth().currentUser;
                    vuexContext.commit('setUser', user);
                    window.localStorage.setItem('org', authData.org);
                    const actionCodeSettings = {
                        url: 'http://localhost:3000/upload',
                        handleCodeInApp: true
                    };
                    user.sendEmailVerification(actionCodeSettings).then(function () {
                        // Email sent.
                    }).catch(function (error) {
                        // An error happened.
                        console.log('email verification err:', error);
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        signinUser(vuexContext, authData) {
            firebase.auth().signInWithEmailAndPassword(authData.email, authData.password).then((result) => {
                    console.log(result);
                    const user = firebase.auth().currentUser;
                    vuexContext.commit('setUser', user);
                    if (user.emailVerified && !user.displayName) {
                        const org = window.localStorage.getItem('org');
                        user.updateProfile({
                            displayName: org
                        }).catch((e) => {
                            console.log('error when adding org to user', e);
                        })
                        firebase.firestore().collection('organizations')
                            .add({
                                logoUrl: '',
                                name: org,
                                users: [user.uid]
                            }).then(function (docRef) {
                                console.log("Org created with ID: ", docRef.id);
                            }).catch(function (error) {
                                console.error("Error creating org: ", error);
                            });
                        window.localStorage.removeItem('org');
                    }
                    user.getIdTokenResult().then(function(res) {
                        console.log(res);
                        vuexContext.commit("setToken", res.token);
                        localStorage.setItem("token", res.token);
                        localStorage.setItem(
                            "tokenExpiration",
                            new Date().getTime() + String(Number.parseInt(res.expirationTime) * 10000)
                        );

                        Cookie.set("jwt", res.token);
                        Cookie.set(
                            "expirationDate",
                            new Date().getTime() + String(Number.parseInt(res.expirationTime) * 10000)
                        );
                    });
                }).catch(e => console.log('error in signing in', e.message));
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
        firebase.auth().signOut().then(function () {
            vuexContext.commit("clearToken");
            vuexContext.commit("clearUser");
            Cookie.remove("jwt");
            Cookie.remove("expirationDate");
            if (process.client) {
                localStorage.removeItem("token");
                localStorage.removeItem("tokenExpiration");
            }
        });
    },
    updateButton(vuexContext, buttonData) {
        firebase.firestore()
            .collection('organizations')
            .where("users", "array-contains", buttonData.uid)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    firebase.firestore()
                            .collection('organizations')
                            .doc(doc.id)
                            .set({
                                button: buttonData
                            }, { merge: true })
                })
            })
    }
};

export const getters = {
    loadedVideos(state) {
        return state.loadedVideos
    },
    isAuthenticated(state) {
        return state.token != null;
    },
    getCurrentUser(state) {
        return state.user;
    }

}