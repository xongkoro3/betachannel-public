<template>
  <div class="video-player">
    <div class="video-list-wrapper full no-scrollbar background-color">
      <div @click="backArrow($event)" class="paddles">
        <button class="left-paddle paddle hidden">
          <v-icon color="white">arrow_back</v-icon>
        </button>
      </div>
      <div class="video-list full no-scrollbar background-color">
        <div :key="video.id" v-for="(video, index) in sponsoredVids" class="thumbnail">
          <div class="video-wrapper" @click="chooseVideo($event, index)">
            <div v-if="activeVideo(index)">
              <div v-if="video.orgId='betachannel'">
                <video
                  :src="video.videoURL"
                  width="280"
                  height="180"
                  allowfullscreen
                  controls
                  autoplay
                ></video>
              </div>
            </div>
            <div class="video-wrapper" v-else>
              <img :id="video.videoURL" :src="video.thumbnail" width="280" height="180" />
              <svg class="video-overlay-play-button" viewBox="0 0 200 200" alt="Play video">
                <circle cx="100" cy="100" r="90" />
                <polygon points="70, 55 70, 145 145, 100" fill="#fff" />
              </svg>
            </div>
          </div>
          <div class="thumbnail-info">
            <h3>{{video.title}}</h3>
            <p>{{video.updatedAt}}</p>
            <p class="thumbnail-views">{{video.views}} Views</p>
          </div>
        </div>
      </div>
      <div class="paddles">
        <button class="left-paddle paddle hidden">
          <v-icon color="white">arrow_forward</v-icon>
        </button>
      </div>
    </div>

    <div :key="channel" v-for="channel in channels" class="video-list-wrapper full no-scrollbar">
       <v-row class="pa-md-8 mx-lg-auto" align="center">
      <span class="">
        {{ channel }}
        <v-btn
          :color="org.button.color"
          class=""
          :href="org.button.link"
          v-if="channel == org.name"
        >{{ org.button.text }}</v-btn>
      </span>
       </v-row>
      <div class="video-list-wrapper full no-scrollbar">
      <template v-for="(video, index) in otherVids">
        <div :key="video.id" v-if="video.orgName == channel" class="thumbnail">
          <div class="video-wrapper" @click="chooseOthrVideo($event, index)">
            <div v-if="activeOthrVideo(index)">
              <video
                :src="video.videoURL"
                width="280"
                height="180"
                controls
                allowfullscreen
                autoplay
              ></video>
            </div>
            <div class="video-wrapper" v-else>
              <img :id="video.videoURL" :src="video.thumbnail" width="280" height="180" />
              <svg class="video-overlay-play-button" viewBox="0 0 200 200" alt="Play video">
                <circle cx="100" cy="100" r="90" />
                <polygon points="70, 55 70, 145 145, 100" fill="#fff" />
              </svg>
            </div>
          </div>
          <div class="thumbnail-info">
            <h3>{{video.title}}</h3>
            <p>{{ }}</p>
            <p class="thumbnail-views">{{video.views}} Views</p>
          </div>
        </div>
      </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "VideoPlayer",
  data: function() {
    return {
      activeVideos: [],
      activeOthrVideos: []
    };
  },
  methods: {
    activeVideo(index) {
      return this.activeVideos[index];
    },
    activeOthrVideo(index) {
      return this.activeOthrVideos[index] && this.otherVids[index].videoURL;
    },
    chooseVideo(e, index) {
      this.activeVideos = new Array(this.videos.length).fill(false);
      this.activeVideos[index] = !this.activeVideos[index];
      console.log('test', this.sponsoredVids[index]);
      const currID = this.sponsoredVids[index].id;
      if (e != null) {
        this.$router.push({ path: '/videos/', query: { currID } });
      }
    },
    chooseOthrVideo(e, index) {
      this.activeOthrVideos = new Array(this.otherVids.length).fill(false);
      this.activeOthrVideos[index] = !this.activeOthrVideos[index];
      const currID = this.otherVids[index].id;
      if (e != null) {
        this.$router.push({ path: '/videos/' + currID });
      }
    },
    addLike() {
      this.currVid.likes += 1;
    },
    backArrow(e) {
      console.log(e);
      alert("clicked");
    },
    findWithAttr(array, attr, value) {
      for (let i = 0; i < array.length; i++) {
        if (array[i][attr] === value) {
            return i;
        }
      }
      return -1;
    }
  },
  mounted() {
    console.log('orgggg: ', this.org)
    this.activeVideos = new Array(this.videos.length).fill(false);
    this.activeOthrVideos = new Array(this.otherVids.length).fill(false);

    const IdxAtOthr = this.findWithAttr(this.otherVids, 'id', this.$route.params.id);
    const IdxAtSponsored = this.findWithAttr(this.sponsoredVids, 'id', this.$route.params.id);

    console.log('param id', this.$route.params);
    console.log('IdxAtOthr', IdxAtOthr);

    if (IdxAtOthr >= 0) {
      this.chooseOthrVideo(null, IdxAtOthr);
    }
    if (IdxAtSponsored >= 0) {
      this.chooseVideo(null, IdxAtSponsored);
    }
    // console.log("this is the route: ", this.$route);
  },
  computed: {
    videos() {
      return this.$store.getters.loadedVideos;
    },
    sponsoredVids: function() {
      const vids = this.videos.filter(function(vid) {
        return vid.orgId === "betachannel";
      });
      vids.sort(function(a, b) {
        const keyA = (a.updatedAt || {}).seconds;
        const keyB = (b.updatedAt || {}).seconds;
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });
      return vids;
    },
    otherVids: function() {
      const othrVidsObjArr = this.videos.filter(function(vid) {
        return vid.orgId !== "betachannel";
      });
      othrVidsObjArr.sort(function(a, b) {
        const keyA = (a.updatedAt || {}).seconds;
        const keyB = (b.updatedAt || {}).seconds;
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });
      return othrVidsObjArr;
    },
    channels: function() {
      const channels = [];
      this.otherVids.forEach(element => {
        console.log(typeof (element.updatedAt.seconds))
        // element.updatedAt = new Date(element.updatedAt.nanoseconds).toLocaleString();
        if (!channels.includes(element.orgName)) {
          channels.push(element.orgName);
        }
      });
      return channels;
    },
    ...mapGetters({
        org: "getCurrentOrg"
    })
  }
};
</script>

<style scoped>
:root {
  --gutter: 20px;
}

.thumbnail {
  display: block;
  padding: 20px;
  margin-top: 30px;
  margin-bottom: 30px;
}

.thumbnail-info {
  margin-left: 20px;
}

.thumbnail h3 {
  font-size: 16px;
}

h3,
p {
  margin: 0;
  padding: 0;
}

circle {
  stroke: #fff;
  fill: none;
  stroke-width: 15px;
}

.thumbnail-views {
  font-size: 14px;
}

.video-list,
.video-list-wrapper {
  display: grid;
  grid-gap: calc(var(--gutter) / 2);
  grid-template-columns: 10px;
  grid-template-rows: minmax(150px, 1fr);
  grid-auto-flow: column;
  grid-auto-columns: calc(50% - var(--gutter) * 2);

  overflow-x: scroll;
  scroll-snap-type: x proximity;
  padding-bottom: calc(0.55 * var(--gutter));
  margin-bottom: calc(-0.25 * var(--gutter));
  -webkit-overflow-scrolling: touch;
}

.video-list:before,
.video-list:after,
.video-list-wrapper:before,
.video-list-wrapper:after {
  content: "";
  width: 10px;
}

.no-scrollbar {
  scrollbar-width: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.video-player {
  padding: var(--gutter) 0;
  display: grid;
  grid-gap: var(--gutter) 0;
  grid-template-columns: var(--gutter) 1fr var(--gutter);
  align-content: start;
}

.video-player > * {
  grid-column: 2 / -2;
}

.video-player > .full {
  grid-column: 1 / -1;
}

.background-color {
  background-color: #333333;
}

.background-color h3,
.background-color p {
  color: white;
}

.video-container {
  margin-right: 40px;
}

.row {
  display: flex;
  justify-content: space-between;
}

button {
  border: none;
  padding: 150px 20px;
}

.video-wrapper {
  display: block;
  max-width: 100%;
  height: auto;
}

.video-wrapper div {
  position: relative;
}

.video-wrapper svg {
  position: absolute;
  top: 0;
  left: 0;
}

.video-wrapper > video.has-media-controls-hidden::-webkit-media-controls {
  display: none;
}

.video-overlay-play-button {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 10px calc(50% - 50px);
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  opacity: 0.95;
  cursor: pointer;
  background-image: linear-gradient(transparent, #000);
  transition: opacity 150ms;
}

.video-overlay-play-button:hover {
  opacity: 1;
}

.video-overlay-play-button.is-hidden {
  display: none;
}

@media only screen and (max-width: 600px) {
  .paddles {
    display: none;
  }
}

.paddles {
  vertical-align: middle;
}

.orgTitle {
  margin-left: 30px;
  margin-right: -100px !important;
  margin-top: 10px;
  position: absolute !important;
}

</style>
