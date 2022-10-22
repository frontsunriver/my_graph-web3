import AuthRequest from "./requests/auth"
import { DeployGraphRequest } from "./requests/deploy";
import { CreateManagedRequest } from "./requests/managed";
import { DeployGraphResponse } from "./responses/deploy"
import { CreateManagedResponse, ManagedResponse } from "./responses/managed"
import AuthResponse from "./responses/auth"
import { ErrorResponse } from "./error";
import { GraphResponse } from "./responses/graph";
import { GraphHashRequest } from "./requests/graph";
import { GraphStateRequest } from "./requests/state"
import { GraphStateResponse } from "./responses/state";
import { GraphLogs } from "./responses/logs";
import { ResponseSuccess } from "./responses/success";
import { CompressGraphRequest } from "./requests/compress";
import { CompressGraphResponse } from "./responses/compress";
import { DecompressGraphResponse } from "./responses/decompress";
import { WalletBalanceRequest } from "./requests/balance";
import { WalletBalanceResponse } from "./responses/balance";
import { WithdrawBalanceRequest } from "./requests/withdraw";
import { TemplateGraphResponse } from "./responses/templateGraph";
const fetch = require('node-fetch');

export default class ManagerProvider
{
    public static baseUrl: string = process.env?.REACT_APP_MANAGER_URL ?? "http://localhost"

    public static authRequest(authRequest: AuthRequest): Promise<AuthResponse> {
        return new Promise<AuthResponse>((resolve, reject) => {
            fetch(`${this.baseUrl}/wallets/auth`, {
                method: 'post',
                body:    JSON.stringify(authRequest),
                headers: { 'Content-Type': 'application/json' },
            })
            .then((res: any) => {
                (res.status === 200) ? resolve(res.json() as AuthResponse) : reject(res.json() as ErrorResponse)
            })
            .catch((error: any) => reject(error));
        })
    }

    public static deployGraph(graphRequest: DeployGraphRequest, accessToken: string): Promise<DeployGraphResponse>
    {
        return new Promise<DeployGraphResponse>((resolve, reject) => {
            fetch(`${this.baseUrl}/graphs/deploy`, {
                method: 'post',
                body:    JSON.stringify(graphRequest),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
            .then((res: any) => {
                (res.status === 200) ? resolve(res.json() as DeployGraphResponse) : reject(res.json() as ErrorResponse)
            })
            .catch((error: any) => reject(error));
        })
    }

    
    public static listGraphs(accessToken: string): Promise<GraphResponse[]>
    {
        return new Promise<GraphResponse[]>((resolve, reject) => {
            fetch(`${this.baseUrl}/graphs/lists`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
            .then((res: any) => {
                (res.status === 200) ? resolve(res.json() as GraphResponse[]) : reject(res.json() as ErrorResponse)
            })
            .catch((error: any) => reject(error));
        })
    }

    public static fetchGraphState(request: GraphHashRequest, accessToken: string): Promise<GraphStateResponse>
    {
        return new Promise<GraphStateResponse>((resolve, reject) => {
            fetch(`${this.baseUrl}/graphs/deploy`, {
                method: 'post',
                body:    JSON.stringify(request),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
            .then((res: any) => {
                (res.status === 200) ? resolve(res.json() as GraphStateResponse) : reject(res.json() as ErrorResponse)
            })
            .catch((error: any) => reject(error));
        })
    }

    public static fetchGraphLogs(request: GraphHashRequest, accessToken: string): Promise<GraphLogs>
    {
        return new Promise<GraphLogs>((resolve, reject) => {
            fetch(`${this.baseUrl}/graphs/logs`, {
                method: 'post',
                body:    JSON.stringify(request),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
            .then((res: any) => {
                (res.status === 200) ? resolve(res.json() as GraphLogs) : reject(res.json() as ErrorResponse)
            })
            .catch((error: any) => reject(error));
        })
    }

    public static updateGraphState(request: GraphStateRequest, accessToken: string): Promise<ResponseSuccess>
    {
        return new Promise<ResponseSuccess>((resolve, reject) => {
            fetch(`${this.baseUrl}/graphs/state`, {
                method: 'post',
                body:    JSON.stringify(request),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
            .then((res: any) => {
                (res.status === 200) ? resolve(res.json() as ResponseSuccess) : reject(res.json() as ErrorResponse)
            })
            .catch((error: any) => reject(error));
        })
    }

    public static compressGraphData(request: CompressGraphRequest, accessToken: string): Promise<CompressGraphResponse>
    {
        return new Promise<CompressGraphResponse>((resolve, reject) => {
            fetch(`${this.baseUrl}/graphs/compress`, {
                method: 'post',
                body:    JSON.stringify(request),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
            .then((res: any) => {
                (res.status === 200) ? resolve(res.json() as CompressGraphResponse) : reject(res.json() as ErrorResponse)
            })
            .catch((error: any) => reject(error));
        })
    }

    
    public static decompressGraphData(request: CompressGraphRequest, accessToken: string): Promise<DecompressGraphResponse>
    {
        return new Promise<DecompressGraphResponse>((resolve, reject) => {
            fetch(`${this.baseUrl}/graphs/decompress`, {
                method: 'post',
                body:    JSON.stringify(request),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
            .then((res: any) => {
                (res.status === 200) ? resolve(res.json() as DecompressGraphResponse) : reject(res.json() as ErrorResponse)
            })
            .catch((error: any) => reject(error));
        })
    }

    public static fetchBalanceWallet(balance: WalletBalanceRequest, accessToken: string): Promise<WalletBalanceResponse>
    {
        return new Promise<WalletBalanceResponse>((resolve, reject) => {
            fetch(`${this.baseUrl}/wallets/balance`, {
                method: 'post',
                body:    JSON.stringify(balance),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
            .then((res: any) => {
                (res.status === 200) ? resolve(res.json() as WalletBalanceResponse) : reject(res.json() as ErrorResponse)
            })
            .catch((error: any) => reject(error));
        })
    }

    public static withdrawBalanceWallet(request: WithdrawBalanceRequest, accessToken: string): Promise<ResponseSuccess>
    {
        return new Promise<ResponseSuccess>((resolve, reject) => {
            fetch(`${this.baseUrl}/wallets/withdraw`, {
                method: 'post',
                body:    JSON.stringify(request),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
            .then(async (res: any) => {
                const jsonValue: any = await res.json()
                if (res.status === 200) {
                    resolve(jsonValue as ResponseSuccess)
                }
                else {
                    reject(jsonValue as ErrorResponse)
                }
            })
            .catch((error: any) => reject(error));
        })
    }

    public static stopAndDeleteGraph(request: GraphStateRequest, accessToken: string): Promise<ResponseSuccess>
    {
        return new Promise<ResponseSuccess>((resolve, reject) => {
            fetch(`${this.baseUrl}/graphs/delete`, {
                method: 'post',
                body:    JSON.stringify(request),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
            .then((res: any) => {
                (res.status === 200) ? resolve(res.json() as ResponseSuccess) : reject(res.json() as ErrorResponse)
            })
            .catch((error: any) => reject(error));
        })
    }
    public static getGraphsTemplates(accessToken: string): Promise<TemplateGraphResponse> 
    {
        return new Promise<TemplateGraphResponse>((resolve, reject) => {
            fetch(`${this.baseUrl}/graphs/templates`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
            .then((res: any) => {
                (res.status === 200) ? resolve(res.json() as TemplateGraphResponse) : reject(res.json() as ErrorResponse)
            })
            .catch((error: any) => reject(error));
        })
    }

    public static checkPresalePwd(pwd: string): Promise<any> 
    {
        return new Promise<TemplateGraphResponse>((resolve, reject) => {
            fetch(`${this.baseUrl}/presale/access`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({pwd})
            })
            .then((res: any) => {
                (res.status === 200) ? resolve(res.json()) : reject(res.json() as ErrorResponse)
            })
            .catch((error: any) => reject(error));
        })
    }

    public static fetchManagedWallets(accessToken: string): Promise<ManagedResponse[]>
    {
        return new Promise<ManagedResponse[]>((resolve, reject) => {
            fetch(`${this.baseUrl}/wallets/listManaged`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
            .then((res: any) => {
                (res.status === 200) ? resolve(res.json() as ManagedResponse[]) : reject(res.json() as ErrorResponse)
            })
            .catch((error: any) => reject(error));
        })
    }

    public static createManagedWallet(walletRequest: CreateManagedRequest, accessToken: string): Promise<CreateManagedResponse>
    {
        return new Promise<any>((resolve, reject) => {
            fetch(`${this.baseUrl}/wallets/createManaged`, {
                method: 'post',
                body:    JSON.stringify(walletRequest),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
            .then((res: any) => {
                (res.status === 200) ? resolve(res.json() as ManagedResponse) : reject(res.text() as ErrorResponse)
            })
            .catch((error: any) => reject(error as Error));
        })
    }
}