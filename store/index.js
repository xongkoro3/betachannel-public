import axios from 'axios'
import Cookie from "js-cookie";
import firebase from '~/plugins/firebase';
const $axios = axios.create();

export const strict = false;

export const state = () => ({
    loadedVideos: [],
    token: null
})

export const mutations = {
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

    signinUser(vuexContext, authData) {
        const authUrl =
            "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" +
            process.env.fbAPIKey;
        // if (!authData.isLogin) {
        //     authUrl =
        //         "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" +
        //         process.env.fbAPIKey;
        // }
        return $axios
            .post(authUrl, {
                email: authData.email,
                password: authData.password,
                returnSecureToken: true
            })
            .then(result => {
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
    emailUser(vuexContext, authData) {
        const actionCodeSettings = {
            url: 'http://localhost:3000/',
            handleCodeInApp: true
            // iOS: {
            //   bundleId: 'com.example.ios'
            // },
            // android: {
            //   packageName: 'com.example.android',
            //   installApp: true,
            //   minimumVersion: '12'
            // },
            // dynamicLinkDomain: 'example.page.link'
        };
        console.log(authData.email);
        firebase.auth().sendSignInLinkToEmail(authData.email, actionCodeSettings)
        .then(function() {
          window.localStorage.setItem('emailForSignIn', authData.email);
        })
        .catch(function(error) {
            console.log('error in emailing user', error);
        });
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
