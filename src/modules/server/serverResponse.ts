export interface ServerResponse<T> {
    isError: boolean;
    content: T;
}