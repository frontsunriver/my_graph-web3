export interface ManagedResponse {
    createdAt: Date,
    idManagedWallet: number,
    name: string,
    password: string,
    privateKey: string,
    publicKey: string,
    updatedAt: Date,
    walletId: number,
}

export interface CreateManagedResponse {
    createdAt: Date,
    password: string,
    private_key: string,
    public_key: string,
}