export interface IPagination{
    page: number,
    limit: number,
    totalDocs: number,
}



export interface IPaginationData<T>{
    data: T[],
    paginationData: IPagination
}