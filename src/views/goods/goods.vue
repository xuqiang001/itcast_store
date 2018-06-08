<template>
  <el-card class="box-card">
    <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>

    <!-- 搜索框 -->
    <el-row class="searchContainer">
      <el-col :span="24"><div class="grid-content bg-purple-dark">
        <el-input
          placeholder="请输入内容"
          class="searchInput"
          clearable>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="$router.push({name: 'goodsadd'})" type="success" plain>添加商品</el-button>
      </div></el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      height="500"
      v-loading="loading"
      stripe
      border
      :data="tableData"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="400">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格(元)"
        width="130">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="100">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.add_time | fmtDate('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
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

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      pagenum: 1,
      pagesize: 10,
      total: 0
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 分页的方法
    handleSizeChange(val) {
      // 每页显示多少条 变化
      this.pagesize = val;
      this.pagenum = 1;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    },
    // 获取列表数据
    async loadData() {
      this.loading = true;
      const { data: resData } = await this.$http.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);

      // 总共多少条数据
      this.total = resData.data.total;
      this.tableData = resData.data.goods;

      this.loading = false;
    }
  }
};
</script>

<style scoped>
.searchContainer {
  margin-top: 15px;
  margin-bottom: 15px;
}
.searchInput {
  width: 300px;
}
</style>
