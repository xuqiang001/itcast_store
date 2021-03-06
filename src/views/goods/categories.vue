<template>
  <el-card class="box-card">
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>

    <el-row class="row">
      <el-col :span="24">
        <el-button @click="handleShowAddDialog" type="success" plain>添加分类</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      border
      stripe
      height="475"
      :data="tableData"
      style="width: 100%">
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        :indentSize="20">
      </el-tree-grid>
      <el-table-column
        label="级别"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否有效">
        <template slot-scope="scope">
          <span>{{ scope.row.cat_deleted ? '无效' : '有效' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            @click="handleOpenEditDialog(scope.row)"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            plain>
          </el-button>
          <el-button
            @click="handleDelete(scope.row.cat_id)"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            plain>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[8, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="addDialogFormVisible">
      <el-form label-position="right" label-width="100px" :model="form">
        <el-form-item label="分类名称">
          <el-input style="width: 300px" v-model="form.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-cascader
            placeholder="默认添加一级分类"
            change-on-select
            clearable
            expand-trigger="hover"
            :options="options"
            :props="defaultProps"
            v-model="selectedOptions">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改分类的对话框 -->
    <el-dialog title="修改商品分类" :visible.sync="editDialogFormVisible">
      <el-form label-position="right" label-width="100px" :model="form">
        <el-form-item label="分类名称">
          <el-input style="width: 300px" v-model="form.cat_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 导入tree-column组件
import ElTreeGrid from 'element-tree-grid';

export default {
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 8,
      total: 0,
      loading: true,
      // 控制新增对话框的显示或者隐藏
      addDialogFormVisible: false,
      form: {
        cat_pid: -1,
        cat_name: '',
        cat_level: 0
      },
      // 绑定层级下拉框
      selectedOptions: [],
      // 层级下拉框中的数据
      options: [],
      // 层级下拉框的配置
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 控制修改分类的对话框
      editDialogFormVisible: false
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 修改分类
    async handleUpdate() {
      const { data: resData } = await this.$http.put(`categories/${this.form.cat_id}`, {
        cat_name: this.form.cat_name
      });
      if (resData.meta.status === 200) {
        this.$message.success('修改成功');
        this.loadData();
        this.editDialogFormVisible = false;
      } else {
        this.$message.error(resData.meta.msg);
      }
    },
    // 点击编辑按钮，打开修改分类的对话框
    handleOpenEditDialog(cat) {
      this.form.cat_name = cat.cat_name;
      this.form.cat_id = cat.cat_id;
      this.editDialogFormVisible = true;
    },
    // 删除分类
    async handleDelete(catId) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 删除分类数据
        const { data: resData } = await this.$http.delete(`categories/${catId}`);
        if (resData.meta.status === 200) {
          this.$message.success('删除成功');
          this.loadData();
        } else {
          this.$message.error(resData.meta.msg);
        }
      });
    },
    // 添加分类
    async handleAdd() {
      // cat_level  cat_pid
      // 分类的父id
      // 如果级联下拉框 没有选择 cat_pid = 0
      // 如果级联下拉框 选中一级分类  cat_pid = selectedOptions[0]
      // 如果级联下拉框 选中二级分类  cat_pid = selectedOptions[1]
      if (this.selectedOptions.length === 0) {
        this.form.cat_pid = 0;
      } else if (this.selectedOptions.length === 1) {
        this.form.cat_pid = this.selectedOptions[0];
      } else if (this.selectedOptions.length === 2) {
        this.form.cat_pid = this.selectedOptions[1];
      }
      this.form.cat_level = this.selectedOptions.length;

      // 发送请求，添加数据，  如果成功，返回的status是201
      const { data: resData } = await this.$http.post('categories', this.form);
      if (resData.meta.status === 201) {
        this.$message.success('添加成功');
        this.loadData();
        this.addDialogFormVisible = false;
      } else {
        this.$message.error(resData.meta.msg);
      }
    },
    // 点击添加按钮，显示添加对话框
    async handleShowAddDialog() {
      this.addDialogFormVisible = true;
      // 加载层级的数据
      const { data: resData } = await this.$http.get('categories?type=2');
      this.options = resData.data;
    },
    async loadData() {
      this.loading = true;
      const { data: resData } = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      this.loading = false;
      // 获取总数据条数
      this.total = resData.data.total;
      this.tableData = resData.data.result;
    },
    // 分页方法
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
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

  .pagination {
    margin-top: 15px;
  }
</style>
