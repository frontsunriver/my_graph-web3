export interface Log {
    type: string,
    message: string,
    timestamp: number   
}

export interface GraphLogs {
    logs: Log[]
}