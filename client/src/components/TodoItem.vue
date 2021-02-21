<template lang="pug">
  .todo-item(:class="isDone ? 'todo-item-done' : ''")
    //- input(type='checkbox' v-model="isDone")
    .custom-checkbox(@click="isDone = !isDone")
      check-icon(v-if="isDone" :size="50")
    div(class="todo-item-description") {{ item.description }}
    div(class="todo-item-last-modified") {{ lastModfied }}
    .remove-item
      remove-icon(@click="remove")
</template>

<script lang="ts">
import CheckIcon from 'vue-material-design-icons/Check.vue';
import RemoveIcon from 'vue-material-design-icons/Close.vue';
import {
  Vue,
  Component,
  Prop,
  Watch,
} from 'vue-property-decorator';

import { TodoItemType } from '@/appTypes/Todo';

function timeSince(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return `${Math.floor(interval)} years`;
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} months`;
  }

  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)} days`;
  }

  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} hours`;
  }

  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} minutes`;
  }

  return `${Math.floor(seconds)} seconds`;
}

@Component({
  name: 'TodoItem',
  components: {
    CheckIcon,
    RemoveIcon,
  },
})
export default class TodoItem extends Vue {
  @Prop({ required: true }) item!: TodoItemType;

  get isDone(): boolean {
    return this.item.done;
  }

  set isDone(v: boolean) {
    this.$store.commit('setItemDone', {
      item: this.item,
      isDone: v,
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
    return ` - ${timeSince(new Date(this.item.updatedAt))}`;
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
    min-width: 25px;
    min-height: 25px;
    margin-right: 10px;
    color: #5dc2af;
    font-size: 20px;
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
