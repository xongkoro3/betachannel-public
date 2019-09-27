import { ActionTree, MutationTree, GetterTree } from "vuex";
// import { RootState } from ".";
import firebase from '~/plugins/firebase';

export interface UploadState {
  isUploading: boolean;
  uploadTask: firebase.storage.UploadTask | null;
  latestSnapshot: firebase.storage.UploadTaskSnapshot | null;
  uploadError: Error | null;
  unsubscriber: Function | null;
}

export const state = (): UploadState => ({
  isUploading: false,
  uploadTask: null,
  latestSnapshot: null,
  uploadError: null,
  unsubscriber: null
})

export const mutations: MutationTree<UploadState> = {
  updateUploading(state, payload: { isUploading: boolean }) {
    state.isUploading = payload.isUploading;
  },
  setUploadTask(state, payload: { task: firebase.storage.UploadTask | null }) {
    state.uploadTask = payload.task;
  },
  setLatestSnapshot(state, payload: { snapshot: firebase.storage.UploadTaskSnapshot | null }) {
    if (!payload.snapshot) {
      state.latestSnapshot = null;
    } else {
      state.latestSnapshot = {
        ...payload.snapshot,
      };
    }
  },
  setUploadError(state, payload: { error: Error | null }) {
    state.uploadError = payload.error;
  },
  setUnsubscriber(state, payload: { unsubscriber: Function | null }) {
    state.unsubscriber = payload.unsubscriber;
  }
}

export const getters: GetterTree<UploadState, UploadState> = {
  uploadProgress(state) {
    if (!state.latestSnapshot || !state.isUploading) {
      return 0;
    }

    const snapshot = state.latestSnapshot;
    return (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  },
  uploadState(state) {
    if (!state.uploadTask) {
      return null;
    }

    return state.uploadTask.snapshot.state;
  }
}

export const actions: ActionTree<UploadState, UploadState> = {
  uploadVideo({ commit, state }, payload: { channelId: string, title: string, file: File, metadata?: firebase.storage.UploadMetadata }) {
    commit('setUploadTask', { task: null });
    commit('setUploadError', { error: null });
    commit('updateUploading', { isUploading: true });

    const randomKey = firebase.database().ref('channel').push().ref.key as string;
    const ref = firebase.storage()
      .ref('channel')
      .child(payload.channelId)
      .child(randomKey);
    const task = ref.put(payload.file, payload.metadata)
    console.log('sup');

    commit('setUploadTask', { task });

    var getVideoURL = function () {
      return task.then(() => {
        return ref.getDownloadURL()
          .then(url => Promise.resolve(url))
          .catch(e => console.log(e))
      });
    }

    getVideoURL().then(url => {
      console.log('this is url', url);
      firebase.firestore().collection('videos').doc(randomKey).set({
        id: randomKey,
        likes: 0,
        thumbnail: 'https://i.ytimg.com/vi/Pf6oI0j_zpk/hqdefault.jpg?sqp=-oaymwEZCNACELwBSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLAvJvk4k_UNB9nst4pFP-txM1TLZA',
        title: payload.title,
        videoURL: url,
        views: 0
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));

    task.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      {
        next(snapshot) {
          commit('setLatestSnapshot', { snapshot });
        },
        error(error) {
          commit('setUploadError', { error });
        },
        complete() {
          commit('setLatestSnapshot', { snapshot: state.latestSnapshot });
          commit('updateUploading', { isUploading: false });
        }
      }
    );
  }
}