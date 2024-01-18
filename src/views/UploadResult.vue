<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="1"> </v-col>
      <v-col cols="12" md="9">
        <v-file-input
          v-model="selectedFile"
          @change="uploadFile"
          clearable
          label="请上传zip包"
          accept=".zip"
        ></v-file-input>
        <v-progress-linear
          color="primary"
          v-if="uploading"
          :model-value="progress"
          :height="20"
          id="prog"
        >
          <template v-slot:default="{ value }">
            <strong>{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
      </v-col>
      <v-col cols="12" md="2"> </v-col>
    </v-row>
  </v-container>
  <v-snackbar v-model="snackbar" :timeout="3000" color="success">
    {{ text }}
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      selectedFile: null,
      uploading: false, // 是否正在上传
      progress: 0, // 上传进度
      snackbar: false,
      text: ``,
    };
  },
  methods: {
    async uploadFile(event) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      this.uploading = true;

      const response = await this.$http
        .post("/upload", formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent) {
              const percentComplete = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              this.progress = percentComplete;
            }
          },
        })
        .then((response) => {
          // 处理响应数据
          if ("ok" == response.data) {
            this.snackbar = true;
            this.text = "上传成功 !";
          } else {
            this.snackbar = true;
            this.text = "上传失败 !";
          }
        })
        .catch((error) => {
          // 处理错误
          console.error(error);
          this.snackbar = true;
          this.text = "上传失败 !";
        })
        .finally(() => {
          this.uploading = false;
        });
    },
  },
};
</script>
<style>
#prog {
  margin-top: 10px;
}
</style>
