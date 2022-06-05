<template>
  <!-- 播放器最外层，visibility: hidden 不能hidden，否则取不到控制条元素，实际并不使用 -->
  <div class="player-wrapper">
    <div id="player" @mouseover="showControl()" @mouseout="hideControl()">
      <!-- 视频内容 -->
      <video
        class="video"
        ref="video"
        preload="auto"
        playsinline
        webkit-playsinline
        :poster="poster"
        :src="source.url"
        @timeupdate="timeUpdateHandle"
        @loadedmetadata="loadedmetadataHandle"
        @waiting="handleWaiting"
        @error="handleError"
        @ended="handleEnded"
      />

      <!-- 视频加载中（loadedmetadata之前） -->
      <!-- <div class="video-loading"></div> -->

      <!-- 加载与播放 -->
      <div class="video-cover" @click="doShowControl">
        <span class="loading-icon" v-show="loading"></span>
        <p class="reload" v-show="reload" @click="replay">
          <span>重新播放</span>
        </p>
      </div>

      <!-- 播放器控制条 -->
      <transition name="control">
        <div class="control" key="1" v-show="control">
          <div class="tool">
            <i
              :class="[paused ? 'icon-play' : 'icon-paused', 'iconfont']"
              @click="doPaused"
            ></i>
          </div>

          <!-- 进度条 -->
          <div class="progress">
            <player-progress
              v-model="progress"
              :disabled="!duration"
              :buffer="bufferPercent"
              @change="progressChangeHandle"
              @drag-start="dragStartHandle"
              @drag-end="dragEndHandle"
            />
          </div>

          <!-- 视频时间 -->
          <div class="duration">{{ currentTime }} / {{ totalTime }}</div>

          <!-- 清晰度 -->
          <div class="clarity-wrapper" v-if="sources.length > 1">
            <span>{{ source.clarity | clarity_zh }}</span>

            <ul class="clarity-list">
              <li
                v-for="item in sources"
                :key="item.clarity"
                :class="{ 'is-active': source.clarity === item.clarity }"
                @click="switchClarity(item)"
              >
                {{ item.clarity | clarity_zh }}
              </li>
            </ul>
          </div>

          <!-- 最大化 -->
          <div class="tool full-screen-btn">
            <i class="iconfont icon-max" @click="fullScreen"></i>
            <div class="full-screen-tip">全屏</div>
          </div>
        </div>
      </transition>

      <!-- 播放进度 -->
      <!-- <transition name="control"> -->
      <!-- <div class="slider" v-show="!control">
          <div class="slider__buffer" :style="`width: ${bufferPercent}%`"></div>
          <div
            class="slider__bar"
            :style="`width: ${(currentDuration / duration) * 100}%`"
          ></div>
        </div> -->
      <!-- </transition> -->
    </div>
  </div>
</template>

<script>
/**
 * video-player
 * @module components/Video/VideoPlayer
 * @desc 视频播放器组件
 * @param {array} sources - 视频地址列表
 * @param {url} poster - 视频封面图片
 *
 * @example
 * <video-player :poster="poster" :sources="sources" />
 */

import PlayerProgress from "./PlayerProgress";

export default {
  name: "VideoPlayer",
  components: {
    PlayerProgress,
  },

  props: {
    poster: {
      required: true,
      type: String
    },
    sources: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  data() {
    return {
      $video: null, // 视频实例
      // sources: [], // 资源列表
      source: {}, // 当前播放资源

      videoCover: false, // 视频背景
      loading: false, //	加载中
      reload: false, //	重新播放

      duration: 0, // 视频时长/s
      currentDuration: 0, // 当前播放时长/s

      bufferPercent: 0, // 当前缓冲时长/s

      control: true, //	视频控制条

      paused: true, //	暂停
      timer: null, //	定时器
      progress: 0, // 播放进度百分比
      disabled: true,
      isSwitching: false, // 是否正在切换清晰度
    };
  },

  filters: {
    clarity_zh(val) {
      const clarities = {
        FD: "超清",
        HD: "高清",
        SD: "标清",
      };

      return clarities[val];
    },
  },

  computed: {
    // @return '00:00'
    currentTime() {
      return this.formatTime(this.currentDuration);
    },
    totalTime() {
      return this.formatTime(this.duration);
    },
  },

  watch: {
    sources: {
      handler(val) {
        this.source = val.length ? val[0] : {};
      },
      immediate: true,
      deep: true,
    },
  },

  mounted() {
    this.$video = this.$refs.video;

    // 注册键盘事件
    document.addEventListener("keypress", this.handleKeypress, false);
  },

  methods: {
    // 空格事件
    handleKeypress(e) {
      if (e.target.tagName === "BODY" && e.keyCode === 32) {
        this.doPaused();
      }
    },

    // 切换清晰度
    switchClarity(source) {
      // 点击当前清晰度时禁止
      if (source.clarity === this.source.clarity) {
        return;
      } else {
        // 切换中锁，防止新视频进度条回到初始位置，在新视频设置完时间并播放后释放
        this.isSwitching = true;

        // 切换时暂停原视频
        this.$video.pause();

        // 原视频已播放时长,新视频也需要设置到该时长
        const oldCurrentTime = this.$video.currentTime;

        this.source = source;

        setTimeout(() => {
          this.$video.currentTime = oldCurrentTime;
          this.$video.play();

          this.isSwitching = false;
        }, 0);
      }
    },

    // 开始拖动进度条时，视频暂停
    dragStartHandle() {
      this.paused = true;
      this.$video.pause();
    },

    // 停止拖动进度条时，继续播放
    dragEndHandle() {
      this.paused = false;
      this.$video.play();
    },

    // 视频位置更新
    progressChangeHandle(percent) {
      this.$video.currentTime = (this.$video.duration * percent) / 100;
    },

    // 视频缓冲进度
    getBufferPercent() {
      if (this.$video.buffered.length > 0) {
        this.bufferPercent =
          (this.$video.buffered.end(0) / this.duration) * 100;
      }
    },

    // 当浏览器已加载视频的元数据时
    loadedmetadataHandle(e) {
      this.duration = this.$video.duration;

      this.loading = false;
      // this.$video.play();

      this.setControlStatus();
    },

    // 当前的播放位置已更改时
    timeUpdateHandle(e) {
      if (this.isSwitching) return;

      this.currentDuration = this.$video.currentTime;
      this.progress = (this.currentDuration / this.duration) * 100;
      this.getBufferPercent();
    },

    // 当视频由于需要缓冲下一帧而停止
    handleWaiting() {},

    // 当目前的播放列表已结束
    handleEnded() {
      this.reload = true; //	显示重加载
      this.setControlStatus(); //	显示控制条
    },

    // 视频加载错误
    handleError() {},

    // 播放视频
    play() {
      this.loading = true; //	加载中
      this.reload = false; //	重加载

      this.$nextTick(() => {
        this.$video.load();
      });
    },

    showControl() {
      this.control = true;
    },

    hideControl() {
      if (this.paused || !this.$video.duration) return;

      this.control = false;
    },

    //	控制条
    setControlStatus() {
      this.control = true;
    },

    //	点击视频显示控制条
    doShowControl() {
      if (this.control) {
        this.control = false;
      } else {
        this.setControlStatus();
      }
    },

    //	暂停
    doPaused() {
      if (!this.$video.duration) {
        this.play(this.url);
        return;
      }

      if (this.$video.paused) {
        this.paused = false;
        this.$video.play();
      } else {
        this.paused = true;
        this.$video.pause();
      }
    },

    handelPaused() {
      this.paused = true;
      this.$video.pause();
    },

    destroy() {
      this.paused = true;
      this.$video.pause();
      this.source = {};
    },

    //	全屏显示
    fullScreen() {
      this.$video.webkitRequestFullScreen();
    },

    //	时间格式化 s => 00:00
    formatTime(time) {
      let min = Math.floor(time / 60);
      min < 10 && (min = "0" + min);
      return min + ":" + ((time % 60) / 100).toFixed(2).slice(-2);
    },

    replay() {
      this.reload = false;
      this.$video.currentTime = 0;
      this.paused = false;
      this.$video.play();
    },
  },
  beforeDestroy() {
    document.removeEventListener("keypress", this.handleKeypress, false);
  },
};
</script>

<style scoped lang="scss">
.clarity-wrapper {
  z-index: 1;
  position: relative;
  width: 44px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: rgba(#fff, 0.7);
  transition: color 0.3s ease;
  &:hover {
    color: #fff;
    cursor: pointer;
    .clarity-list {
      visibility: visible;
      opacity: 1;
    }
  }
  .clarity-list {
    transition: visibility 0.2s ease, opacity 0.2s ease;
    visibility: hidden;
    opacity: 0;
    z-index: 2;
    position: absolute;
    padding: 4px 0;
    left: -3px;
    right: -3px;
    bottom: 40px;
    color: #fff;
    background-color: rgba(#000, 0.5);
    border-radius: 4px;
    text-align: center;
    li {
      height: 28px;
      line-height: 28px;
      color: rgba(#fff, 0.5);
      transition: color 300ms ease 0s, background-color 300ms ease 0s;
      &:hover {
        cursor: pointer;
        background-color: rgba(#fff, 0.2);
      }
      &.is-active {
        color: #fff;
      }
    }
  }
}

.full-screen-btn {
  &:hover {
    .full-screen-tip {
      visibility: visible;
      opacity: 1;
    }
  }
  .full-screen-tip {
    transition: visibility 0.2s ease, opacity 0.2s ease;
    visibility: hidden;
    opacity: 0;
    z-index: 2;
    position: absolute;
    padding: 4px 0;
    left: -3px;
    right: -3px;
    bottom: 40px;
    color: #fff;
    background-color: rgba(#000, 0.5);
    border-radius: 4px;
    text-align: center;
  }
}

.player-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56%;
}

#player {
  position: absolute;
  z-index: 99;
  width: 100%;
  left: 0;
  top: 0;
  height: 100%;
  overflow: hidden;
}

.video {
  width: 100%;
  object-fit: fill;
  height: 100%;
}

.video-cover {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  background: rgba(0, 0, 0, 0);
  text-align: center;
}
.loading-icon {
  display: inline-block;
  margin-top: 25%;
  width: 24px;
  height: 24px;
  animation: rotate 1s infinite linear;
  border: 4px solid #ccc;
  border-right: 4px solid rgba(0, 0, 0, 0);
  border-radius: 50%;
}
@keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

.paused {
  position: absolute;
  left: 0;
  right: 0;
  top: 40%;
  width: 40px;
  height: 30px;
  margin: 0 auto;
  text-align: center;
  line-height: 30px;
  z-index: 100;
}

.reload {
  display: inline-block;
  margin-top: 25%;
  height: 36px;
  line-height: 36px;
  padding: 0 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.5);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
.reload:hover {
  background: rgba(255, 255, 255, 0.2);
}
.reload > span {
  display: inline-block;
  vertical-align: top;
  font-size: 14px;
}

/* 控制条样式 */
.control-enter-active,
.control-leave-active {
  transition: opacity 0.3s ease;
}
.control-enter,
.control-leave-to {
  opacity: 0;
  // visibility: hidden;
}

// 控制栏
.control {
  display: flex;
  align-items: center;
  z-index: 2;
  position: absolute;
  padding: 0 8px;
  left: 0;
  right: 0;
  bottom: 0;
  height: 40px;
  font-size: 14px;
  opacity: 1;
  visibility: visible;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3));
  .tool {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      cursor: pointer;
      i {
        color: #fff;
      }
    }
    i {
      font-size: 20px;
      color: rgba(#fff, 0.7);
      transition: color 0.3s ease;
    }
  }
  .progress {
    padding: 0 16px;
    flex: 1;
  }
  .duration {
    padding: 0 8px;
    color: #fff;
    font-size: 14px;
  }
}
</style>