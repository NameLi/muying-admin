<template>
  <el-select
    class="remote-select"
    :loading="loading"
    :popper-append-to-body="false"
    :value="value"
    :size="size"
    :disabled="disabled"
    filterable
    clearable
    remote
    :multiple="multiple"
    :remote-method="remoteSearch"
    @input="$emit('input', $event)"
    @change="onChange"
    :placeholder="placeholder"
  >
    <el-option
      v-for="item in list"
      :key="item.id"
      :label="item.name || item.title"
      :value="item.id"
    >
      <!-- 影视 -->
      <div v-if="type === 'movie'" class="custom-option movie">
        <img :src="item.poster" />
        <div class="content">
          <span
            >{{ item.title
            }}<span class="rating" v-if="item.rating">
              ({{ item.rating }}分)</span
            ></span
          >
          <div class="label">
            {{ item.year }} {{ item.countries }} {{ item.genres }}
          </div>
        </div>
      </div>

      <!-- 影人/角色 -->
      <div
        v-else-if="type === 'actor' || type === 'role'"
        class="custom-option"
      >
        <img :src="item.avatar" />
        <div class="content">
          <span>{{ item.name }}</span>
        </div>
      </div>

      <!-- 国家/地区 -->
      <div v-else-if="type === 'country'" class="custom-option country">
        <div class="flag">
          <img :src="item.flag" />
        </div>
        <div class="name">
          <span>{{ item.name }}</span>
          <label>{{ item.fullname }}</label>
        </div>
      </div>

      <!-- 公司 -->
      <div v-else-if="type === 'company'" class="custom-option company">
        <div class="content">
          <span>{{ item.name }}</span>
          <label>{{ item.name_en }}</label>
        </div>
      </div>
    </el-option>

    <template slot="empty">
      <slot name="empty"></slot>
    </template>
  </el-select>
</template>

<<script>
import { getSimpleMovies } from '@/api/movie'
import { getSimpleActors } from '@/api/actor'
import { getSimpleRoles } from '@/api/role'
import { getSimpleCountries, getSimpleCompanies, getSimpleLanguages } from '@/api/basic'

export default {
  name: 'RemoteSelect',
  props: {
    // 搜索类型
    type: {
      required: true,
      type: String,
      validator(val) {
        return ['movie', 'actor', 'role', 'country', 'company', 'language'].includes(val)
      },
    },

    disabled: {
      type: Boolean,
      default: false
    },

    options: {
      type: Array,
      default: () => []
    },

    multiple: {
      type: Boolean,
      default: false,
    },

    // 传入值
    value: {
      
    },

    // 
    size: {
      type: String,
      default: "small",
    },

    placeholder: {
      type: String,
      default: "请填写关键字",
    },

    // 返回条数
    perPage: {
      type: Number,
      default: 20,
    },
  },
  data() {
    return {
      loading: false,
      list: [],
    }
  },

  watch: {
    options: {
      handler(nVal) {
        this.list = nVal
        console.log(nVal)
      },
      immediate: true,
      deep: true
    },
    value(val) {
      if(!val) {
        this.list = [];
      }
    }
  },

  methods: {
    async remoteSearch(keyword) {
      if(!keyword) {
        this.list = []
        return
      }

      let request = null;

      switch (this.type) {
        case 'movie':
          request = getSimpleMovies
          break;
        
        case 'actor':
          request = getSimpleActors
          break;
        
        case 'role':
          request = getSimpleRoles
          break;

        case 'country':
          request = getSimpleCountries
          break;

        case 'company':
          request = getSimpleCompanies
          break;

        case 'language':
          request = getSimpleLanguages
          break;
      }

      let params = {
        per_page: this.perPage,
        keyword
      }

      this.loading = true;
      const { code, data } = await request(params);
      this.loading = false;

      if(code === 200) {
        if(['language'].includes(this.type)) {
          data.map(item => item.id = item.name)
        }

        if(['movie'].includes(this.type)) {
          data.map(item => item.genres = item.genres.join(','))
          // data.map(item => item.countries = item.countries.join(','))
        }

        this.list = data;
      }
    },

    onChange(val) {
      this.$emit('on-change', val)
    }
  },
}
</script>

<style scoped lang="scss">
.remote-select {
  width: 100%;
  ::v-deep .el-select-dropdown__item {
    height: auto;
    padding: 4px 14px;
  }

  .custom-option {
    display: flex;
    height: 56px;
    .content {
      margin-left: 10px;
      line-height: 26px;
      .rating {
        margin-left: 4px;
        color: #aaa;
        font-size: 12px;
      }
      .label {
        color: #888;
        font-size: 12px;
      }
    }
    > img {
      width: 37px;
      height: 52px;
      background: #f5f5f5;
    }
    &.country {
      display: flex;
      height: 40px;
      line-height: 40px;
      .flag {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 62px;
        img {
          width: auto;
          height: auto;
          max-width: 62px;
          max-height: 40px;
        }
      }
      .name {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        line-height: 20px;
        label {
          font-size: 12px;
          font-weight: normal;
        }
      }
    }
    &.company {
      display: flex;
      .content {
        display: flex;
        height: 56px;
        flex-direction: column;
        > span {
          margin-left: 0;
          height: 30px;
          line-height: 30px;
        }
        > label {
          height: 22px;
          line-height: 22px;
          color: #999;
        }
      }
    }
  }
}
</style>

