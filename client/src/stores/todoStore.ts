import axios from 'axios';
import Vue from 'vue';
import Vuex, { ActionContext } from 'vuex';

import { TodoItemType, TodoResponse } from '@/appTypes/Todo';

Vue.use(Vuex);

const baseUri = 'http://localhost:3000/api/v1';

export interface TodoState {
  todoItems: TodoItemType[];
  filterTerm: string;
}

const pageDim = 20;

const todoState: TodoState = {
  todoItems: [],
  filterTerm: '',
};

export default new Vuex.Store({
  state: todoState,
  mutations: {
    setTodoItems(state, items: TodoItemType[]): void {
      state.todoItems = items;
    },
    setItemDone(state, payload: { item: TodoItemType, isDone: boolean }) {
      state.todoItems = state.todoItems.map((x: TodoItemType) => (x._id === payload.item._id
        ? { ...x, done: payload.isDone }
        : x
      ));
    },
    addItem(state, item: TodoItemType) {
      state.todoItems = [item, ...state.todoItems];
    },
    updateItemDetails(state, item: TodoItemType) {
      state.todoItems = state.todoItems.map((x: TodoItemType) => (x._id === item._id
        ? item
        : x
      ));
    },
    removeItem(state, item: TodoItemType) {
      state.todoItems = state.todoItems.filter((x) => (x._id !== item._id));
    },
    setFilterTerm(state, term: string) {
      state.filterTerm = term;
    },
  },
  actions: {
    getTodoItems(context: ActionContext<typeof todoState, typeof todoState>): void {
      axios.get<TodoResponse>(`${baseUri}/todo?limit=${pageDim}&description=${context.state.filterTerm}`)
        .then((r): void => {
          context.commit('setTodoItems', r.data.items);
        })
        .catch(() => console.log('something failed'));
    },
    updateItem(context: ActionContext<typeof todoState, typeof todoState>,
      args: { item: TodoItemType, isDone: boolean }): void {
      axios.put<TodoItemType>(`${baseUri}/todo/${args.item._id}`, { done: args.isDone })
        .then((r) => context.commit('updateItemDetails', r.data))
        .catch(() => console.log('something failed'));
    },
    addItem(context: ActionContext<typeof todoState, typeof todoState>,
      description: string): void {
      axios.post<TodoItemType>(`${baseUri}/todo/`, { description })
        .then((r) => context.commit('addItem', r.data))
        .catch(() => console.log('something failed'));
    },
    removeItem(context: ActionContext<typeof todoState, typeof todoState>,
      item: TodoItemType): void {
      axios.delete<TodoItemType>(`${baseUri}/todo/${item._id}`)
        .then(() => context.commit('removeItem', item))
        .catch(() => console.log('something failed'));
    },
  },
});
