export interface GraphResponse {
    idGraph: number,
    state: number,
    hashGraph: string,
    alias: string,
    walletOwner: string,
    lastLoadedBytes: string,
    lastExecutionCost: number,
    totalCost: number,
    createdAt: Date,
    updatedAt: Date,
    loadedAt: Date,
    hostedApi: boolean | undefined
}