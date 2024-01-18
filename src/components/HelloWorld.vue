<template>
  <v-container class="hello">
    <v-responsive class="">
      <v-row class="">
        <v-col cols="auto">
          <v-btn min-width="164" rel="noopener noreferrer" variant="text" @click="stopTraining" size="x-large">
            <v-icon icon="mdi-view-dashboard" start />
            暂停训练
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-dialog v-model="dialog" persistent width="1024">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" v-bind="props" min-width="228" rel="noopener noreferrer" size="x-large"
                variant="flat">
                <v-icon icon="mdi-speedometer" size="large" start />
                开启训练
              </v-btn>
            </template>
            <v-form ref="form">
              <v-card>
                <v-card-title>
                  <span class="text-h5">训练项目</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-select :items="itemList1" label="一级目录*" v-model="selectOne"
                          @update:model-value="handleSelectChange" required
                          :rules="[v => !!v || '一级目录 is required']"></v-select>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select :items="itemList2" label="二级目录*" v-model="selectTwo"
                          :rules="[v => !!v || '二级目录 is required']" required></v-select>
                      </v-col>
                      <v-col cols="12" sm="12">
                        <v-select :items="['0', '1', '2', '3']" v-model="gpu" label="gpu_index*" required></v-select>
                      </v-col>
                      <v-col cols="12" sm="12">
                        <v-select :items="typeList" v-model="type" label="训练类型*" :rules="[v => !!v || '训练类型 is required']"
                          required></v-select>
                      </v-col>
                      <v-col cols="12" sm="12">
                        <v-text-field label="训练步数*" required v-model="steps" :rules="[v => !!v || '训练步数 is required']"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="close">
                    关闭
                  </v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="startTraining">
                    开启
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
        </v-col>
        <v-col cols="auto">
          <v-dialog v-model="dialog1" persistent width="1024">
            <template v-slot:activator="{ props }">
              <v-btn min-width="164" rel="noopener noreferrer" v-bind="props" size="x-large" color="secondary" dark>
                <v-icon icon="mdi-wrench" start />
                其他
              </v-btn>
            </template>
            <v-form ref="form1">
              <v-card>
                <v-card-title>
                  <span class="text-h5">训练项目</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-select :items="itemList1" label="一级目录*" v-model="selectOne"
                          @update:model-value="handleSelectChange" required
                          :rules="[v => !!v || '一级目录 is required']"></v-select>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select :items="itemList2" label="二级目录*" v-model="selectTwo"
                          :rules="[v => !!v || '二级目录 is required']" required></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="close">
                    关闭
                  </v-btn>
                  <v-btn color="red-darken-1" variant="text" @click="clearTrain">
                    清理
                  </v-btn>
                  <v-btn color="black-darken-1" variant="text" @click="checkTensor">
                    查看tensorboard
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
        </v-col>
        <v-snackbar v-model="snackbar" :timeout="4000" color="success">{{ text }}</v-snackbar>
      </v-row>
      <v-row>
        <v-col cols="12" class="vcol">
          <v-alert dense text type="success">
            下述任务详情
          </v-alert>
          <highlightjs autodetect :code="this.fileData" class="hljs" ref="codeContainer" />
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    timer: null,
    dialog: false,
    dialog1: false,
    itemList1: [],
    itemList2: [],
    typeList: ['物体检测', '特征检测', '类型检测'],
    selectOne: null,
    selectTwo: null,
    gpu: 0,
    type: null,
    steps: 20000,
    snackbar: false,
    text: null,
    fileData: ''
  }),
  methods: {
    startTimer() {
      this.timer = setInterval(this.getData, 3000); // 每3秒发送一次请求
    },
    async getData() {
      try {
        const response = await this.$http.get('/showTraining'); // 发送GET请求到Node.js接口
        this.fileData = response.data; // 将返回的数据保存到fileData中

      } catch (error) {
        console.error(error);
      }
    },
    async getList1() {
      try {
        const response = await this.$http.get("getList1");
        this.itemList1 = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getList2() {
      try {
        const response = await this.$http.get("getList2", { params: { "first": this.selectOne } });
        this.itemList2 = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    handleSelectChange() {
      this.getList2();
    },
    stopTraining() {
      this.$http.get("stopTrain")
        .then(response => {
          console.log(response.data); // 获取响应数据

          if ('ng' !== response.data) {
            this.snackbar = true
            this.text = '暂停成功'
          } else {
            this.snackbar = true
            this.text = '暂停失败'
          }
        })
        .catch(error => {
          console.error("请求错误:", error);
        });
    },
    async startTraining() {
      const { valid } = await this.$refs.form.validate()
      if (valid) {
        const jsonForm = {
          'first': this.selectOne,
          'second': this.selectTwo,
          'gpu': this.gpu,
          'type': this.typeList.indexOf(this.type),
          'steps': this.steps
        }

        this.$http.get("startTraining", { params: jsonForm })
          .then(response => {
            console.log(response.data); // 获取响应数据

            if ('ng' !== response.data) {
              this.snackbar = true
              this.text = '开启成功'
            } else {
              this.snackbar = true
              this.text = '开启失败'
            }
          })
          .catch(error => {
            console.log(error);
            this.snackbar = true
            this.text = '开启失败'
          }).finally(() => {
            this.dialog = false
            this.selectOne = null
            this.selectTwo = null
            this.gpu = 0
            this.type = null
            this.steps = 20000

          });
      }
    },
    close() {
      this.dialog = false
      this.dialog1 = false
      this.selectOne = null
      this.selectTwo = null
      this.gpu = 0
      this.type = null
      this.steps = 20000
    },
    async clearTrain() {
      const { valid } = await this.$refs.form1.validate()
      if (valid) {
        const jsonForm = {
          'first': this.selectOne,
          'second': this.selectTwo
        }
        this.$http.get("clearTrain", { params: jsonForm })
        .then(response => {
          console.log(response.data); // 获取响应数据
          if ('ng' !== response.data) {
            this.snackbar = true
            this.text = '初始化成功'
          } else {
            this.snackbar = true
            this.text = '初始化失败'
          }
        })
        .catch(error => {
          console.error("请求错误:", error);
        }).finally(() => {
          this.dialog1 = false
          this.selectOne = null
          this.selectTwo = null
        });
      }
    },
    async checkTensor() {
      const { valid } = await this.$refs.form1.validate()
      if (valid) {
        const jsonForm = {
          'first': this.selectOne,
          'second': this.selectTwo
        }
        this.$http.get("checkTensor", { params: jsonForm })
        .then(response => {
          console.log(response.data); // 获取响应数据
          if ('ng' !== response.data) {
            this.snackbar = true
            this.text = '等待跳转中 ...'
            setTimeout(() => {
              window.open('http://192.168.11.222:6006', '_blank')
            }, 5000);
          }
        })
        .catch(error => {
          console.error("请求错误:", error);
          this.snackbar = true
          this.text = '查看失败'
        }).finally(() => {
          this.dialog1 = false
          this.selectOne = null
          this.selectTwo = null
        });
      }
    },
  },
  mounted() {
    this.getList1();
    this.startTimer();
  },
  beforeUnmount() {
    clearInterval(this.timer);
  }
};
</script>

<style>
.vcol {
  margin-left: 10px;
}

.hello {
  margin-top: 10px;
}

.hljs {
  height: 900px;

}

.alertx {
  margin-bottom: 2px;
}
</style>
