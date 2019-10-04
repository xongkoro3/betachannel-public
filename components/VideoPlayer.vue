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
            <p>{{video.creator}}</p>
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
      <template v-for="(video, index) in otherVids">
        <div :key="video.id" v-if="video.orgId == channel" class="thumbnail">
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
              <p>{{video.creator}}</p>
              <p class="thumbnail-views">{{video.views}} Views</p>
            </div>
          </div>
        </template>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "VideoPlayer",
  data: function() {
    return {
      activeVideos: [],
      activeOthrVideos: []
    };
  },
  props: {
    videos: {
      type: Array,
      required: true
    }
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
      console.log('s[index]', this.sponsoredVids[index]);
    },
    chooseOthrVideo(e, index) {
      this.activeOthrVideos = new Array(this.otherVids.length).fill(false);
      this.activeOthrVideos[index] = !this.activeOthrVideos[index];
    },
    addLike() {
      this.currVid.likes += 1;
    },
    backArrow(e) {
      console.log(e);
      alert('clicked');
    }
  },
  mounted() {
    this.activeVideos = new Array(this.videos.length).fill(false);
    this.activeOthrVideos = new Array(this.otherVids.length).fill(false);
    console.log('h: ', this.otherVids)
  },
  computed: {
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
        if (!channels.includes(element.orgId)) {
          channels.push(element.orgId);
        }
      });
      return channels;
    }
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
  padding-bottom: calc(0.75 * var(--gutter));
  margin-bottom: calc(-0.25 * var(--gutter));
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

.paddles {
  vertical-align: middle;
}
</style>
