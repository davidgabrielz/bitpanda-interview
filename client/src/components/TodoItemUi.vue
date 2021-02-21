<template lang="pug">
  .todo-item(:class="isDone ? 'todo-item-done' : ''")
    checkbox(v-model="isDone")
    div(class="todo-item-description") {{ item.description }}
    div(class="todo-item-last-modified") - {{ lastModfied }}
    .remove-item
      remove-icon(@click="remove")
</template>

<script lang="ts">
import RemoveIcon from 'vue-material-design-icons/Close.vue';
import {
  Vue,
  Component,
  Prop,
  Watch,
} from 'vue-property-decorator';

import { TodoItem } from '@/types/Todo';
import Checkbox from '@/utils/Checkbox.vue';
import { timeSince } from '@/utils/formatters';

@Component({
  name: 'TodoItemUi',
  components: {
    RemoveIcon,
    Checkbox,
  },
})
export default class TodoItemUi extends Vue {
  @Prop({ required: true }) item!: TodoItem;

  get isDone(): boolean {
    return this.item.done;
  }

  set isDone(newV: boolean) {
    this.$store.commit('setItemDone', {
      item: this.item,
      isDone: newV,
    });
  }

  @Watch('isDone')
  itemStateChanged(newV: boolean): void {
    void this.$store.dispatch('updateItem', {
      item: this.item,
      isDone: newV,
    });
  }

  get lastModfied(): string {
    return timeSince(new Date(this.item.updatedAt));
  }

  remove(): void {
    void this.$store.dispatch('removeItem', this.item);
  }
}
</script>

<style lang="scss">
.todo-item {
  display: flex;
  align-items: center;
  padding: 14px;
  height: 30px;
  &:not(.last-item) {
    border-bottom: 1px solid #bbbbbb;
  }
  .todo-item-description {
    font-size: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #000000;
  }
  .todo-item-last-modified {
    font-size: 13px;
    color: #b8b8b8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 5px;
    margin-bottom: -5px;
  }
  .custom-checkbox {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 1px solid lightgray;
    min-width: 30px;
    min-height: 30px;
    margin-right: 10px;
    color: #5dc2af;
    font-size: 28px;

    .material-design-icon {
      transform: rotate(-11deg);
    }
  }
  .remove-item {
    margin-left: auto;
    margin-right: 8px;
    color: #a8a8a8;
    display: none;
    font-size: 30px;
    overflow: hidden;
  }

  &:hover{
    cursor: pointer;
    .remove-item {
      display: initial;
    }
  }

   &.todo-item-done {
    .todo-item-description {
      color: #d6d6d6;
      text-decoration: line-through;
    }

    .custom-checkbox {
      border: 1px solid #bddad5;
    }
  }

}
</style>
