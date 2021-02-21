<template lang="pug">
  .todo-items-container
    .filter-items-container
      search-icon.filter-items-icon
      input(v-model="filterTerm" placeholder="Search" class="filter-items-input")
    .todo-items
      .add-new-item-container
        input(
          v-model="newItem"
          placeholder="Take a note"
          class="add-item-input"
          @keyup.enter="addNewItem"
        )
        add-icon.confirm-add(@click="addNewItem")
      todo-item(v-for="(item, i) in items"
        :key="item._id"
        :item="item"
        :class="i === items.length - 1 ? 'last-item' : ''"
      )
      .no-items(v-show="!items.length") Nothing to do :)
    .page-controls
      prev-icon(@click="prevPage"
        :class="['page-control', !meta.hasPrevPage ? 'page-disabled' : '']"
      )
      next-icon(@click="nextPage"
        :class="['page-control', !meta.hasNextPage ? 'page-disabled' : '']"
      )
</template>

<script lang="ts">
import PrevIcon from 'vue-material-design-icons/ChevronLeft.vue';
import NextIcon from 'vue-material-design-icons/ChevronRight.vue';
import SearchIcon from 'vue-material-design-icons/Magnify.vue';
import AddIcon from 'vue-material-design-icons/Plus.vue';
import { Vue, Component, Watch } from 'vue-property-decorator';

import { TodoItemType, TodoResponseMeta } from '@/appTypes/Todo';
import TodoItem from '@/components/TodoItem.vue';
import { TodoState } from '@/stores/todoStore';

@Component({
  name: 'TodoItems',
  components: {
    TodoItem,
    SearchIcon,
    AddIcon,
    PrevIcon,
    NextIcon,
  },
})
export default class TodoItems extends Vue {
  private newItem = '';

  get filterTerm(): string {
    return (this.$store.state as TodoState).filterTerm;
  }

  set filterTerm(v: string) {
    this.$store.commit('setFilterTerm', v);
  }

  @Watch('filterTerm')
  filterTermChanged(): void {
    this.reloadItems();
  }

  get items(): TodoItemType[] {
    return (this.$store.state as TodoState).todoItems;
  }

  get meta(): TodoResponseMeta {
    return (this.$store.state as TodoState).meta;
  }

  created(): void {
    this.reloadItems();
  }

  reloadItems(): void {
    this.$store.commit('setOffset', 0);

    void this.$store.dispatch('getTodoItems');
  }

  prevPage(): void {
    if (!this.meta.hasPrevPage) return;

    void this.$store.dispatch('loadPrevPage');
  }

  nextPage(): void {
    if (!this.meta.hasNextPage) return;

    void this.$store.dispatch('loadNextPage');
  }

  addNewItem(): void {
    // TODO: change this to use notification mechanism
    if (!this.newItem) {
      alert('Please add a description!');
      return;
    }

    void this.$store.dispatch('addItem', this.newItem);
    this.newItem = '';
  }
}
</script>

<style lang="scss">
.todo-items-container {
  padding: 50px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.todo-items {
  background: #ffffff;
  margin-top: 20px;
  border: 1px solid #bbbbbb;
  border-radius: 11px;
}

.page-controls {
  background: #ffffff;
  border: 1px solid #a8a8a8;
  color: #676767;;
  margin-top: 20px;
  border-radius: 11px;
  width: fit-content;
  margin-left: auto;
  // margin-right: 0;
  padding: 7px;
  .page-control {
    cursor: pointer;
    font-size: 2em;
    font-weight: 200;
    &:not(:last-of-type) {
      border-right: 1px solid #bbbbbb;
    }

    &.page-disabled {
      color: lightgray;
    }
  }
}

.filter-items-container {
  display: flex;
  border-radius: 15px;
  align-items: center;
  background: #dbdbdb;
  padding: 5px;

  .filter-items-icon {
    font-size: 20px;
    font-weight: normal;
    color: #676767;
    // margin-left: 8px;
  }

  input.filter-items-input {
    border: none;
    background: transparent;
    padding: 5px;
    width: 100%;
    height: 20px;
    font-size: 16px;
    &::placeholder {
      overflow: visible;
      color: #787878;
      font-weight: 100;
    }
  }
}

.add-new-item-container {
  display: flex;
  padding: 18px;
  padding-top: 23px;
  align-items: center;
  background: #fafafa;
  border-bottom: 1px solid #bbbbbb;
  border-top-left-radius: 11px;
  border-top-right-radius: 11px;
  input.add-item-input {
    margin-left: 5px;;
    background: transparent;
    flex-basis: 100%;
    border: none;
    font-size: 20px;
    color: black;
    &::placeholder {
      font-weight: 100 !important;
      color: #a8a8a8
    }
  }

  .confirm-add {
    cursor: pointer;
    color: #a8a8a8;
    font-size: 30px;
    margin-right: 5px;
  }
}

*:focus {
  outline:  none;
}

.no-items {
  color:  lightgray;
  padding: 10px;
}
</style>
