<template>
   <div id="Mail">
    <div id="tableView">
			<el-row>
				<el-form label-width="75px" :inline="true" class="el-form demo-form-inline">
					<el-row>
						<el-col :span="1" class="searchInline">&nbsp;</el-col>
						<el-col :span="9" class="searchInline">
              <label class="el-form-item__label searchLabel">邮箱名称</label>
              <el-input size="small" placeholder="邮箱名称" clearable></el-input>
						</el-col>
						<el-col :span="2" class="searchInline">&nbsp;</el-col>
						<el-col :span="1" class="searchInline">&nbsp;</el-col>
					</el-row>
					<div>
						<el-form>
							<el-col :span="12" class="btnEditDelete">
								<el-form-item align="left">
									<!-- <el-button type="primary" icon="edit" size="small" @click="editClick">修改</el-button> -->
									<el-button v-if="hasPermission('system/user:add')" type="success" icon="el-icon-plus" size="small" @click="addClick">新增</el-button>
									<el-button v-if="hasPermission('system/user:delete')" type="danger" icon="el-icon-delete" size="small" @click="removeSelection">删除</el-button>
								</el-form-item>
							</el-col>
							<el-col :span="12"></el-col>
							<el-col :span="12" class="btnSearchPlus">
								<el-form-item>
									<el-button type="primary" icon="el-icon-search" size="small" @click="searchClick">查询</el-button>
									<el-button type="clear" icon="el-icon-refresh" size="small" @click="clearClick">重置</el-button>
								</el-form-item>
							</el-col>
						</el-form>
					</div>
				</el-form>
			</el-row>
			
          <div class="table_container">
        <el-table class="tableStyle" border id="table" :data="tableData">
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column type="index" show-overflow-tooltip label="序号" width="65" align="center"></el-table-column>
            <el-table-column prop="username" show-overflow-tooltip label="邮箱名称" min-width="14%" align="center"></el-table-column>
            <el-table-column prop="password" show-overflow-tooltip label="邮箱密码" min-width="12%" align="center"></el-table-column>
            <el-table-column prop="encoding" show-overflow-tooltip label="编码" min-width="11%" align="center"></el-table-column>
            <el-table-column prop="host" show-overflow-tooltip label="SMTP" min-width="13%" align="center"></el-table-column>
            <el-table-column prop="port" show-overflow-tooltip label="端口" min-width="11%" align="center"></el-table-column>
            <el-table-column prop="protocol" show-overflow-tooltip label="授权码" min-width="13%" align="center"></el-table-column>
        </el-table>
        <paginator></paginator>
    </div>	
		</div>
  </div>
</template>

<script>
//引入翻页 paginator
import paginator from '@/components/paginator'
export default {
  name: "Mail",
  data() {
    return {
      // input2: "",
      // input21: "",
      // input22: "",
      // input23: "",
      //搜索表单
      searchForm: {
        id: "",
        username: ""
      },
      //表数据
      tableData:[],
      total:[]
    };
  },
  created: function () {
      this.SearchTable();

    },
  methods: {
    SearchTable() {
      let vm = this;
      
      //邮箱管理-表格
      var params = {
          username: this.searchForm.username.replace(/%/g, "\\%"),
      }
      vm.$axios.post("/mail/findByVO", params).then(function(res) {
         
          vm.tableData = res.data.result;
          vm.total = res.data.result.length;
          
        }.bind(this),function(error) {
          console.log(error);
        }
      );
    }
  }
};
</script>

<style scoped>
.el-col.searchInline {
  display: inline-flex;
}
.el-form-item__label {
  color: #333 !important;
}
.table_container {
  border: 1px solid #eee;
  border-radius: 2px;
  margin-top: 8px;
}
.table-title {
  background-color: #eee;
  color: #409eff;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}
</style>