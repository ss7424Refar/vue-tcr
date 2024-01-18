<template>
    <v-container class="fill-height">
        <v-responsive class="align-center fill-height">
            <!-- <v-img height="300" src="@/assets/logo.svg" /> -->
            <!-- <div class="py-14" /> -->

            <v-row class="d-flex align-center justify-center">
                <v-col cols="auto">
                    <v-dialog v-model="dialog" persistent width="1024">
                        <template v-slot:activator="{ props }">
                            <v-btn min-width="164" rel="noopener noreferrer" variant="text" v-bind:="props">
                                <v-icon icon="mdi-view-dashboard" size="large" start />
                                查看checkpoints
                            </v-btn>
                        </template>
                        <v-form ref="form">
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">查看checkpoints</span>
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
                                    <v-btn color="blue-darken-1" variant="text" @click="showCK">
                                        查看
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-form>
                    </v-dialog>
                </v-col>

                <v-col cols="auto">
                    <v-dialog v-model="dialog1" persistent width="1024">
                        <template v-slot:activator="{ props }">
                            <v-btn color="primary" v-bind="props" min-width="228" rel="noopener noreferrer" size="x-large"
                                variant="flat">
                                <v-icon icon="mdi-speedometer" size="large" start />
                                导出项目
                            </v-btn>
                        </template>
                        <v-form ref="form2">
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">导出bz2</span>
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
                                                <v-text-field label="checkPoints*" required v-model="ckPoints"
                                                    :rules="[v => !!v || 'checkPoints is required']"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12">
                                                <v-select :items="typeList" v-model="type" label="训练类型*" required
                                                    :rules="[v => !!v || '训练类型 is required']"></v-select>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue-darken-1" variant="text" @click="close1">
                                        关闭
                                    </v-btn>
                                    <v-btn color="blue-darken-1" variant="text" @click="startExport">
                                        导出checkPoints
                                    </v-btn>
                                    <v-btn color="red-darken-1" variant="text" @click="openVINO">
                                        导出openVINO
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-form>
                    </v-dialog>
                </v-col>

            </v-row>
            <v-row>
                <v-col cols="10">
                    <highlightjs autodetect :code="this.ckText" v-show="vcard" class="hs" />
                </v-col>
            </v-row>
            <v-row>
                <v-dialog v-model="dialog2" hide-overlay persistent width="300">
                    <v-card color="primary" dark>
                        <v-card-text>
                            checkPoints 导出中 ...
                            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-row>
            <v-row>
                <v-dialog v-model="dialog3" hide-overlay persistent width="300">
                    <v-card color="success" dark>
                        <v-card-text>
                            openVINO 转换中 ...
                            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-row>
        </v-responsive>
        <v-snackbar v-model="snackbar" :timeout="5000" color="error">{{ text }}</v-snackbar>
    </v-container>
</template>
  
<script>

export default {
    data: () => ({
        dialog: false,
        dialog1: false,
        dialog2: false,
        dialog3: false,
        itemList1: [],
        itemList2: [],
        typeList: ['物体检测', '特征检测', '类型检测'],
        selectOne: null,
        selectTwo: null,
        type: null,
        snackbar: false,
        vcard: false,
        text: '',
        ckText: '',
        ckPoints: null,
        type: null
    }),
    methods: {
        async getList1() {
            try {
                // TODO TEST
                const response = await this.$http.get("getList1");
                this.itemList1 = response.data;
            } catch (error) {
                console.log(error);
            }
        },
        async getList2() {
            try {
                // TODO TEST
                const response = await this.$http.get("getList2", { params: { "first": this.selectOne } });
                this.itemList2 = response.data;

            } catch (error) {
                console.log(error);
            }
        },
        handleSelectChange() {
            this.getList2();
        },
        async startExport() {
            const { valid } = await this.$refs.form2.validate()
            if (valid) {
                this.dialog2 = true
                const jsonForm = {
                    'first': this.selectOne,
                    'second': this.selectTwo,
                    'ck': this.ckPoints,
                    'type': this.typeList.indexOf(this.type),
                }
                await this.$http.get("startExport", { params: jsonForm })
                    .then(response => {
                        if ('ok' == response.data) {
                            this.dialog1 = false;
                            window.location.href = this.$http.defaults.baseURL + '/downloadExport?ck=' + this.ckPoints
                            this.snackbar = true
                            this.text = '请耐心等待下载结束!'
                        } else {
                            this.dialog1 = false
                            this.snackbar = true
                            this.text = '导出失败'
                        }
                    })
                    .catch(error => {
                        console.error("请求错误:", error);
                        this.dialog1 = false
                        this.snackbar = true
                        this.text = '导出失败'
                    }).finally(() => {
                        this.dialog1 = false
                        this.dialog2 = false

                        this.selectOne = null
                        this.selectTwo = null
                        this.type = null
                        this.ckPoints = null
                    });
            }

        },
        async showCK() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                const jsonForm = {
                    'first': this.selectOne,
                    'second': this.selectTwo,
                }

                try {
                    // TODO TEST
                    const response = await this.$http.get("getCKPoints", { params: jsonForm });
                    this.vcard = true
                    this.ckText = response.data
                    this.dialog = false

                } catch (error) {
                    console.log(error);
                    this.snackbar = true
                    this.text = '获取失败'
                } finally {
                    this.selectOne = null
                    this.selectTwo = null
                }
            }
        },
        async openVINO() {
            const { valid } = await this.$refs.form2.validate()
            if (valid) {
                this.dialog3 = true
                const jsonForm = {
                    'first': this.selectOne,
                    'second': this.selectTwo,
                    'ck': this.ckPoints,
                    'type': this.typeList.indexOf(this.type),
                }

                await this.$http.get("openVINO", { params: jsonForm })
                    .then(response => {
                        if ('ok' == response.data) {
                            this.dialog1 = false;
                            window.location.href = this.$http.defaults.baseURL + '/downloadOpen?ck=' + this.ckPoints
                            this.snackbar = true
                            this.text = '请耐心等待下载结束!'
                        } else {
                            this.dialog1 = false
                            this.snackbar = true
                            this.text = '导出失败'
                        }
                    })
                    .catch(error => {
                        console.error("请求错误:", error);
                        this.dialog1 = false
                        this.snackbar = true
                        this.text = '导出失败'
                    }).finally(() => {
                        this.dialog1 = false
                        this.dialog3 = false;

                        this.selectOne = null
                        this.selectTwo = null
                        this.type = null
                        this.ckPoints = null
                    });
            }
        },
        close() {
            this.dialog = false
            this.selectOne = null
            this.selectTwo = null
            this.type = null
            this.ckPoints = null
        },
        close1() {
            this.dialog1 = false
            this.selectOne = null
            this.selectTwo = null
            this.type = null
            this.ckPoints = null
        }
        
    },
    mounted() {
        this.getList1();
    },
};
</script>
<style>
.hs {
    height: 50px;
}
</style>