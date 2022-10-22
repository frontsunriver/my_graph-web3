import ManagerProvider from "../providers/manager"
import { CreateManagedRequest } from "../providers/requests/managed";
import AuthResponse from "../providers/responses/auth"
import { WalletBalanceResponse } from "../providers/responses/balance";
import { CreateManagedResponse, ManagedResponse } from "../providers/responses/managed";
import { ResponseSuccess } from "../providers/responses/success";


export default class WalletService {
    public static async authWallet(addr: string, sign: string): Promise<boolean>
    {
        try
        {
            const result: AuthResponse = await ManagerProvider.authRequest({
                address: addr,
                signature: sign
            })
        
            if (result) {
                localStorage.setItem('session', JSON.stringify({token: result.accessToken, addr: addr}))
            }
            return result.auth;
        }
        catch (error)
        {
            console.error(error)
            return false;
        }
    }

    public static verifySessionIntegrity(currAcc: string): boolean {
        if (localStorage.getItem("session") != null) {
            const session = JSON.parse(localStorage.getItem("session") as string)
            if (session.addr !== currAcc) { 
              localStorage.removeItem('session')
              return false;
            }
          }
        else if (localStorage.getItem("session") == null) { return false; }
        
        return true;
    }

    public static async getBalance(addr: string): Promise<WalletBalanceResponse | undefined> {
        try
        {
            const session = JSON.parse(localStorage.getItem("session") as string)
            const result: WalletBalanceResponse = await ManagerProvider.fetchBalanceWallet({address: addr}, session.token)
            return result
        }
        catch (error)
        {
            console.error(error)
            return undefined;
        }
    }


    public static async withdraw(amount: number): Promise<ResponseSuccess | String > {
        try
        {
            const session = JSON.parse(localStorage.getItem("session") as string)
            const result: ResponseSuccess = await ManagerProvider.withdrawBalanceWallet({amount}, session.token)
            return result
        }
        catch (error)
        {
            if (!error.success) {
                var errorMsg: String = new String(error.msg)
                return errorMsg
            }
            console.error(JSON.stringify(error))
            return "An internal server error occured, please try again later";
        }
    }

    public static async listWallets(): Promise<ManagedResponse[] | undefined>
    {
        try
        {
            const session = JSON.parse(localStorage.getItem("session") as string)
            const result: ManagedResponse[] = await ManagerProvider.fetchManagedWallets(session.token)
            
            //result.forEach(x => { x.updatedAt = new Date(x.updatedAt); x.createdAt = new Date(x.createdAt) })
            return result
        }
        catch (error)
        {
            console.error(error)
            return undefined;
        }
    }

    public static async createWallet(request: CreateManagedRequest): Promise<String | Error>
    {
        try
        {
            const session = JSON.parse(localStorage.getItem("session") as string)
            const result: CreateManagedResponse = await ManagerProvider.createManagedWallet(request, session.token)
            return new String(result.private_key)
        }
        catch (error)
        {
            console.error(error)
            return error as Error;
        }
    }

}