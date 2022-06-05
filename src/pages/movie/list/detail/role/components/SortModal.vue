<template>
  <el-dialog
    title="角色排序"
    width="800px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="modal-container" v-loading="loading">
      <div class="drag-list">
        <draggable v-model="roles" v-bind="dragOptions" @update="dragUpdate">
          <transition-group>
            <div class="drag-item" v-for="role in roles" :key="role.id">
              <div class="drag-inner" v-if="role.role">
                <img class="avatar" :src="role.role.avatar" />
                <div class="name">{{ role.role.name }}</div>
              </div>
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>

    <div slot="footer">
      <m-button type="cancel" @click="visible = false" />
      <m-button
        type="submit"
        :disabled="disabled"
        :loading="submitLoading"
        @click="submitForm()"
      />
    </div>
  </el-dialog>
</template>

<script>
import { getMovieRoles, updateMovieRolesSort } from "@/api/movie";
import { modal } from "@/mixins/modal";

import draggable from "vuedraggable";
import dragOptions from "@/config/dragOptions";

export default {
  name: "SortModal",

  components: {
    draggable,
  },

  mixins: [modal],

  data() {
    return {
      roles: [],
      disabled: true,
      dragOptions,
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.disabled = true;
        this.getMovieRoles();
      }
    },
  },

  methods: {
    async getMovieRoles() {
      let params = {
        page: 1,
        per_page: 999,
      };

      this.loading = true;
      const { code, data, total } = await getMovieRoles(this.id, params);
      this.loading = false;

      if (code === 200) {
        this.roles = data;
        this.total = total;
        this.disabled = true;
      }
    },

    dragUpdate() {
      this.disabled = false;
    },

    submit() {
      let sortIds = this.$Util.formatSortParams(this.roles);
      return updateMovieRolesSort(this.id, { sortIds });
    },
  },
};
</script>