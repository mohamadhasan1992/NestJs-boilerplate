export interface IPagination{
    hasNextPage: boolean,
    hasPrevPage: boolean,
    limit: number,
    nextPage: number,
    page: number,
    totalDocs: number,
    totalPages: number
}



export interface IPaginationData<T>{
    data: T[],
    pagination: IPagination
}