<template lang="pug">
  .todo-app
    todo-items
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import TodoItems from '@/components/TodoItems.vue';

@Component({
  name: 'App',
  components: {
    TodoItems,
  },
})
export default class App extends Vue {
}
</script>

<style lang="scss">
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
}
.material-design-icon {
  margin-top: -5px;
}
.todo-app {
  // text-align: center;
  width: 100%;
  min-height: 100%;
  height: fit-content;
  background: #e5e5e5;
  font-family: 'Calibri';
  font-weight: 300;
}
</style>
