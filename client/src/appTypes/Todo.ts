export interface TodoItemType {
    _id: string;
    description: string;
    done: boolean;
    createdAt: string;
    updatedAt: string;
}

interface TodoResponseMeta {
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
    items: TodoItemType[];
    meta: TodoResponseMeta;
}