import { GraphStateEnum } from "../../enums/graphState";

export interface GraphStateRequest {
    state: GraphStateEnum,
    hash: string
}