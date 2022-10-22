import { GraphStateEnum } from "../../enums/graphState";

export interface GraphStateResponse {
    state: GraphStateEnum,
    loadedAt: Date,
    stoppedAt: Date
}