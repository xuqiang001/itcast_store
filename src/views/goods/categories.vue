<template>
  <el-card class="box-card">
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>

    <el-row class="row">
      <el-col :span="24">
        <el-button type="success" plain>添加分类</el-button>
      </el-col>
    </el-row>

    <el-table
      height="500"
      :data="tableData"
      style="width: 100%">
      <!-- <el-table-column
        prop="cat_name"
        label="分类名称"
        width="180">
      </el-table-column> -->
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        :indentSize="20">
      </el-tree-grid>
      <el-table-column
        prop="cat_level"
        label="级别"
        width="180">
      </el-table-column>
      <el-table-column
        prop="cat_deleted"
        label="是否有效">
      </el-table-column>
      <el-table-column
        label="操作">
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
// 导入tree-column组件
import ElTreeGrid from 'element-tree-grid';

export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const { data: resData } = await this.$http.get('categories?type=3&pagenum=1&pagesize=10');
      this.tableData = resData.data.result;
    }
  },
  components: {
    'el-tree-grid': ElTreeGrid
  }
};
</script>

<style scoped>
  .row {
    margin-top: 15px;
    margin-bottom: 15px;
  }
</style>
