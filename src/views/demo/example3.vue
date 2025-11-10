<template>
  <div class="app-container">
    <h2>示例三：卡片页</h2>
    <el-row :gutter="20">
      <el-col :span="8" v-for="card in cards" :key="card.title">
        <el-card shadow="hover">
          <h3>{{ card.title }}</h3>
          <p>{{ card.content }}</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Example3",
  data() {
    return {
      cards: [
        { title: "卡片一", content: "这是第一个卡片" },
        { title: "卡片二", content: "这是第二个卡片" },
        { title: "卡片三", content: "这是第三个卡片" }
      ]
    };
  }
};
</script>
