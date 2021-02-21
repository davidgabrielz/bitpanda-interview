import axios from 'axios';
import Vue from 'vue';
import Vuex, { ActionContext } from 'vuex';

import actionTypes from '@/stores/todoActions';
import mutationTypes from '@/stores/todoMutations';
import { TodoItem, TodoResponse, TodoMeta } from '@/types/Todo';
import { BASE_URI } from '@/utils/appConst';

Vue.use(Vuex);

export interface TodoState {
  todoItems: TodoItem[];
  meta: TodoMeta,
  filterTerm: string;
}

const pageDim = 10;

const todoState: TodoState = {
  todoItems: [],
  meta: {
    hasNextPage: false,
    hasPrevPage: false,
    itemCount: 0,
    limit: pageDim,
    nextPage: null,
    prevPage: null,
    offset: 0,
    page: 0,
    pageCount: 0,
  },
  filterTerm: '',
};

export default new Vuex.Store({
  state: todoState,
  mutations: {
    [mutationTypes.SET_TODO_ITEMS](state, items: TodoItem[]): void {
      state.todoItems = items;
    },
    [mutationTypes.ADD_ITEM](state, item: TodoItem) {
      state.todoItems = [item, ...state.todoItems];
    },
    [mutationTypes.UPDATE_ITEM](state, item: TodoItem) {
      state.todoItems = state.todoItems.map((x: TodoItem) => (x._id === item._id
        ? item
        : x
      ));
    },
    [mutationTypes.REMOVE_ITEM](state, item: TodoItem) {
      state.todoItems = state.todoItems.filter((x) => (x._id !== item._id));
    },
    [mutationTypes.SET_TODO_META](state, meta: TodoMeta): void {
      state.meta = meta;
    },
    [mutationTypes.SET_META_OFFSET](state, offset: number): void {
      state.meta = { ...state.meta, offset };
    },
    [mutationTypes.SET_ITEM_DONE](state, payload: { item: TodoItem, isDone: boolean }) {
      state.todoItems = state.todoItems.map((x: TodoItem) => (x._id === payload.item._id
        ? { ...x, done: payload.isDone }
        : x
      ));
    },
    [mutationTypes.SET_FILTER_TERM](state, term: string) {
      state.filterTerm = term;
    },
  },
  actions: {
    [actionTypes.LOAD_TODO_ITEMS](
      context: ActionContext<typeof todoState, typeof todoState>,
    ): void {
      axios.get<TodoResponse>(`${BASE_URI}/todo`, {
        params: {
          limit: pageDim,
          description: context.state.filterTerm,
          offset: context.state.meta.offset,
        },
      })
        .then((r): void => {
          context.commit(mutationTypes.SET_TODO_ITEMS, r.data.items);
          context.commit(mutationTypes.SET_TODO_META, r.data.meta);
        })
        .catch(() => console.log('something failed'));
    },
    [actionTypes.LOAD_PREV_PAGE](context: ActionContext<typeof todoState, typeof todoState>) {
      context.commit(mutationTypes.SET_META_OFFSET,
        context.state.meta.offset - context.state.meta.limit);
      void context.dispatch(actionTypes.LOAD_TODO_ITEMS);
    },
    [actionTypes.LOAD_NEXT_PAGE](context: ActionContext<typeof todoState, typeof todoState>) {
      context.commit(mutationTypes.SET_META_OFFSET,
        context.state.meta.offset + context.state.meta.limit);
      void context.dispatch(actionTypes.LOAD_TODO_ITEMS);
    },
    [actionTypes.ADD_ITEM](context: ActionContext<typeof todoState, typeof todoState>,
      description: string): void {
      axios.post<TodoItem>(`${BASE_URI}/todo/`, { description })
        .then((r) => context.commit(mutationTypes.ADD_ITEM, r.data))
        .catch(() => console.log('something failed'));
    },
    [actionTypes.UPDATE_ITEM](context: ActionContext<typeof todoState, typeof todoState>,
      args: { item: TodoItem, isDone: boolean }): void {
      axios.put<TodoItem>(`${BASE_URI}/todo/${args.item._id}`, { done: args.isDone })
        .then((r) => context.commit(mutationTypes.UPDATE_ITEM, r.data))
        .catch(() => console.log('something failed'));
    },
    [actionTypes.REMOVE_ITEM](context: ActionContext<typeof todoState, typeof todoState>,
      item: TodoItem): void {
      axios.delete<TodoItem>(`${BASE_URI}/todo/${item._id}`)
        .then(() => context.commit(mutationTypes.REMOVE_ITEM, item))
        .catch(() => console.log('something failed'));
    },
  },
});
