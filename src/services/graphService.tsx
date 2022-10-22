import { GraphStateEnum } from "../enums/graphState";
import { ErrorResponse } from "../providers/error";
import ManagerProvider from "../providers/manager"
import { DeployGraphRequest } from "../providers/requests/deploy";
import AuthResponse from "../providers/responses/auth"
import { DeployGraphResponse } from "../providers/responses/deploy";
import { GraphResponse } from "../providers/responses/graph";
import { GraphLogs, Log } from "../providers/responses/logs";
import { GraphStateResponse } from "../providers/responses/state";
import { GraphStateRequest } from "../providers/requests/state"
import { ResponseSuccess } from "../providers/responses/success";
import { CompressGraphResponse } from "../providers/responses/compress";
import { DecompressGraphResponse } from "../providers/responses/decompress";
import { GraphTemplate, TemplateGraphResponse } from "../providers/responses/templateGraph";

export default class GraphService {
    public static async deployGraph(request: DeployGraphRequest): Promise<String | undefined>
    {
        try
        {
            const session = JSON.parse(localStorage.getItem("session") as string)
            const result: DeployGraphResponse = await ManagerProvider.deployGraph(request, session.token)
            return new String(result.hash)
        }
        catch (error)
        {
            console.error(error)
            return undefined;
        }
    }

    public static async listGraphs(): Promise<GraphResponse[] | undefined>
    {
        try
        {
            const session = JSON.parse(localStorage.getItem("session") as string)
            const result: GraphResponse[] = await ManagerProvider.listGraphs(session.token)
            
            result.forEach(x => { x.loadedAt = new Date(x.loadedAt); x.createdAt = new Date(x.createdAt) })
            return result
        }
        catch (error)
        {
            console.error(error)
            return undefined;
        }
    }

    public static async graphState(hash: string): Promise<GraphStateResponse | undefined>
    {
        try
        {
            const session = JSON.parse(localStorage.getItem("session") as string)
            const result: GraphStateResponse = await ManagerProvider.fetchGraphState({ hash }, session.token)
            return result
        }
        catch (error)
        {
            console.error(error)
            return undefined;
        }
    }

    public static async graphLogs(hash: string): Promise<Log[] | undefined>
    {
        try
        {
            const session = JSON.parse(localStorage.getItem("session") as string)
            const result: GraphLogs = await ManagerProvider.fetchGraphLogs({ hash }, session.token)
            return result.logs
        }
        catch (error)
        {
            console.error(error)
            return undefined;
        }
    }

    public static async setGraphState(state: GraphStateEnum, hash: string): Promise<boolean>
    {
        try
        {
            const session = JSON.parse(localStorage.getItem("session") as string)
            const result: ResponseSuccess = await ManagerProvider.updateGraphState({ state, hash }, session.token)
            return result.success
        }
        catch (error)
        {
            console.error(error)
            return false;
        }
    }

    public static async compressGraph(toCompress: any): Promise<string>
    {
        try
        {
            const session = JSON.parse(localStorage.getItem("session") as string)
            const result: CompressGraphResponse = await ManagerProvider.compressGraphData({ data: toCompress }, session.token)
            return result.compressed
        }
        catch (error)
        {
            console.error(error)
            return error;
        }
    }

    public static async decompressGraph(toDecompress: any): Promise<string>
    {
        try
        {
            const session = JSON.parse(localStorage.getItem("session") as string)
            const result: DecompressGraphResponse = await ManagerProvider.decompressGraphData({ data: toDecompress }, session.token)
            return result.decompressed
        }
        catch (error)
        {
            console.error(error)
            return error;
        }
    }

    public static async removeGraph(hash: string): Promise<boolean>
    {
        try
        {
            const session = JSON.parse(localStorage.getItem("session") as string)
            const result: ResponseSuccess = await ManagerProvider.stopAndDeleteGraph({ state: GraphStateEnum.Stopped, hash }, session.token)
            return result.success
        }
        catch (error)
        {
            console.error(error)
            return false;
        }
    }
    public static async listGraphsTemplates(): Promise<GraphTemplate[]>
    {
        try
        {
            const session = JSON.parse(localStorage.getItem("session") as string)
            const result: TemplateGraphResponse = await ManagerProvider.getGraphsTemplates(session.token)
            if (result.success) {
                return result.templates
            }
        }
        catch (error) {
            console.error(error)    
        }
        return []
    }
}