<template>
    <v-navigation-drawer :width="300">
        <v-list v-model:opened="open">
          <v-list-group value="Train">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" title="训练管理" prepend-icon="mdi-account-circle" color="blue darken-2"></v-list-item>
              </template>

              <v-list-item 
                v-for="([title, icon, path], i) in trains"
                :key="i"
                :title="title"
                :prepend-icon="icon"
                :value="title"
                @click="navigateTo(path)"
              ></v-list-item>
          </v-list-group>
          
          <v-list-group value="resultSet">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" title="结果集管理" prepend-icon="mdi-heart" color="blue darken-2"></v-list-item>
              </template>

              <v-list-item
                v-for="([title, icon, path], i) in resultSet"
                :key="i"
                :title="title"
                :prepend-icon="icon"
                :value="title"
                @click="navigateTo(path)"
              ></v-list-item>
          </v-list-group>

        </v-list>
    </v-navigation-drawer>

</template>

<script>
  export default {
    data: () => ({
      open: ['Train'],
      trains: [
        ['任务管理', 'mdi-account-multiple-outline', '/home'],
        ['导出模型', 'mdi-cog-outline', '/export'],
      ],
      resultSet: [
        ['上传训练集', 'mdi-arrow-up-bold-box-outline', '/upload'],
        ['验证训练集', 'mdi-dialpad', '/about'],
      ]
    }),
    methods: {
      navigateTo(path) {
        // 切换路由
        this.$router.push(path);
      },
  },
  }
</script>