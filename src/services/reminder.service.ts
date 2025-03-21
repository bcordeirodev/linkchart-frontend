import apiService from "./api";


export function save(body: IWordCreate){
    return apiService.post<IWordResponse>('word', body)
}

export function update(id: string, body: IWordUpdate){
    return apiService.patch<IWordResponse>(`word/${id}`, body)
}

export function all(){
    return apiService.get<{ data : IWordResponse[]}>('word')
}

export function findOne(id : string){
    return apiService.get<{data: IWordResponse}>(`word/${id}`)
}

export function remove(id : number){
    return apiService.get(`word/${id}`)
}