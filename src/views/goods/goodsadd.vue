<template>
  <el-card class="box-card">
    <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>

    <el-alert
      class="alert"
      title="添加商品信息"
      type="info"
      center
      :closable="false"
      show-icon>
    </el-alert>

    <el-steps
      align-center
      :active="active - 0"
      finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <el-form
      style="height: 500px; overflow: auto"
      label-position="top"
      :model="form"
      label-width="100px">
      <el-tabs @tab-click="handleTabClick" v-model="active" class="tabs" tab-position="left">
        <el-tab-pane name="0" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              clearable
              :options="options"
              :props="defaultProps"
              v-model="selectedOptions"
              expand-trigger="hover"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="1" label="商品参数">
          <el-form-item
            v-for="item in dynamicsParams"
            :key="item.attr_id"
            :label="item.attr_name">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                v-for="val in item.attr_vals"
                :key="val"
                border
                :label="val"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品属性">
          <el-form-item
            v-for="item in staticParams"
            :key="item.attr_id"
            :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品图片">商品图片</el-tab-pane>
        <el-tab-pane name="4" label="商品内容">商品内容</el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      active: '0',
      form: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        // 分类id，用,分割的字符串
        goods_cat: ''
      },
      // 层级下拉框的数据源
      options: [],
      // 层级下拉框的数据源配置
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 绑定到层级下拉框上的数据
      selectedOptions: [],
      checkList: [],
      // 动态参数
      dynamicsParams: [],
      // 静态参数
      staticParams: []
    };
  },
  created() {
    this.loadOptions();
  },
  methods: {
    // 点击tab栏执行
    async handleTabClick() {
      // 判断当前的tab栏是否是，商品参数/商品属性
      if (this.active === '1' || this.active === '2') {
        // 如果是的话，要判断层级下拉中，是否选中的三级分类
        // 如果没有选中三级分类，要提示用户 选择三级分类
        if (this.selectedOptions.length !== 3) {
          this.$message.error('请选择商品的三级分类');
          return;
        }
      }
      // 根据当前 tab栏是 商品参数 sel=many  如果是商品属性 sel=only
      const sel = this.active === '1' ? 'many' : 'only';

      // 如果选择了三级分类，发送请求获取数据
      // 请求的接口地址中的id ，是三级分类的id
      const { data: resData } = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${sel}`);

      if (this.active === '1') {
        this.dynamicsParams = resData.data;
        // 获取到动态数据之后，要对数据做一个处理  "attr_vals": "a,b,c"
        // 要把,分割的数据，转换成数组
        this.dynamicsParams.forEach((item) => {
          item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.trim().split(',');
        });
      } else {
        // 静态参数赋值
        this.staticParams = resData.data;
      }
    },
    // 层级下拉框选中内容发生变化的时候执行
    handleChange() {
      // 判断当前是否选中的是三级分类
      // 如果不是三级分类，此时提示，并且清空
      if (this.selectedOptions.length !== 3) {
        this.$message.warning('请选择三级分类,商品只能添加到三级分类');
        this.selectedOptions.length = 0;
      }
    },
    // 加载层级下拉框的数据
    async loadOptions() {
      const { data: resData } = await this.$http.get('categories?type=3');
      this.options = resData.data;
    }
  }
};
</script>

<style scoped>
  .alert {
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .tabs {
    margin-top: 15px;
  }
</style>
