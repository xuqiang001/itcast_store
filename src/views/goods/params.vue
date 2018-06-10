<template>
  <el-card class="box-card">
    <my-breadcrumb level1="商品管理" level2="分类参数"></my-breadcrumb>

    <el-alert
      class="alert"
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      :closable="false"
      show-icon>
    </el-alert>

    <el-row>
      <el-col :span="24">
        请选择商品分类：
        <el-cascader
          expand-trigger="hover"
          :options="options"
          :show-all-levels="false"
          @change="handleChange"
          :props="{ label: 'cat_name', value: 'cat_id' }"
          v-model="selectedOptions">
        </el-cascader>
      </el-col>
    </el-row>

    <!-- v-model 绑定的是 激活的tab-pane的name属性的值 -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="动态参数" name="many">
        <el-button :disabled="isDisabled" type="primary">添加动态参数</el-button>
        <el-table
          :data="dynamicParams"
          style="width: 100%">
          <el-table-column
            type="expand">
            <template slot-scope="scope">
            </template>
          </el-table-column>
          <el-table-column
            type="index"
            width="40">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="商品参数"
            width="180">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                plain>
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                plain>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="only">
        <el-button :disabled="isDisabled" type="primary">添加静态参数</el-button>
        <el-table
          :data="staticParams"
          style="width: 100%">
          <el-table-column
            type="index"
            width="40">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="属性名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="attr_vals"
            label="属性值"
            width="180">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                plain>
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                plain>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      selectedOptions: [],
      activeName: 'many',
      dynamicParams: [],
      staticParams: [],
      isDisabled: true
    };
  },
  created() {
    this.loadOptions();
  },
  methods: {
    // 层级下拉框 发生改变
    handleChange() {
      // 判断 当前是否选择的3 级分类
      // 如果选择的3级分类  此时按钮可用
      if (this.selectedOptions.length === 3) {
        // 可用
        this.isDisabled = false;
      } else {
        // 不可用
        this.isDisabled = true;
      }
    },
    // 加载层级下拉框的数据
    async loadOptions() {
      const { data: { data, meta: { status } } } = await this.$http.get('categories?type=3');
      if (status === 200) {
        this.options = data;
      }
    }
  }
};
</script>

<style scoped>
  .alert {
    margin-top: 15px;
    margin-bottom: 15px;
  }
</style>
