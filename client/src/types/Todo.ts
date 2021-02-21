export interface TodoItem {
    _id: string;
    description: string;
    done: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TodoMeta {
    hasNextPage: boolean,
    hasPrevPage: boolean,
    itemCount: number,
    limit: number,
    offset: number,
    page: number,
    pageCount: number,
    nextPage: number | null,
    prevPage: number | null
}

export interface TodoResponse {
    items: TodoItem[];
    meta: TodoMeta;
}