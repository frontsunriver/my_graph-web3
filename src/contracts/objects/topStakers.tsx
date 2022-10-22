import { BigNumber } from "@ethersproject/bignumber";
import { utils } from 'ethers';

export interface Staker {
    wallet: string
    amount: string
}

export default class TopStakers {

    public stakers: Staker[]
    constructor(address: any[], amounts: BigNumber[])
    {
        this.stakers = []

        for (var i = 0; i <= 2; i++) {
            if (address[i] != 0) {
                this.stakers.push({
                    wallet: address[i],
                    amount: utils.formatUnits(amounts[i], 18)
                })
            }
        }
    }
}