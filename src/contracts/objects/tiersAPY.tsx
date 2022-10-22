import { BigNumber } from "@ethersproject/bignumber";
import { utils } from 'ethers';

export default class TiersAPY {
    public tier_1: number;
    public tier_2: number;
    public tier_3: number;
    
    constructor(tiers: BigNumber[]) {
        this.tier_1 = Number(utils.formatUnits(tiers[0].toString(), 18));
        this.tier_2 = Number(utils.formatUnits(tiers[1].toString(), 18));
        this.tier_3 = Number(utils.formatUnits(tiers[2].toString(), 18));
    }
}