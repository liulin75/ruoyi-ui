<template>
  <div class="app-container">
    <h2>示例二：表格页</h2>
    <el-table :data="tableData" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="age" label="年龄" width="100" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Example2",
  data() {
    return {
      tableData: [
        { id: 1, name: "张三", age: 25 },
        { id: 2, name: "李四", age: 30 },
        { id: 3, name: "王五", age: 22 }
      ]
    };
  }
};
</script>
