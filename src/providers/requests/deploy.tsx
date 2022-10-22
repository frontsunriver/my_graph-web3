import { GraphStateEnum } from "../../enums/graphState";

export interface DeployGraphRequest {
    state: GraphStateEnum,
    bytes: string,
    alias: string,
    hash: string | undefined
}