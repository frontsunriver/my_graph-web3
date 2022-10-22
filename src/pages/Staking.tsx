import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Button, chakra, Image, Spacer, Spinner } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import Trophy from "../assets/trophy.png";
import T1 from "../assets/t1.gif";
import T2 from "../assets/t2.gif";
import T3 from "../assets/t3.gif";
import { useActiveWeb3React } from "../hooks/index";

import { useStaking } from "../hooks/useStaking";
import { useStakingContract, useTokenContract } from "../hooks/useContract";

import { ClaimRewards } from "../components/Staking/ClaimRewards";
import { StakingDeposit } from "../components/Staking/StakingDeposit";
import { StakingModalWithdraw } from "../components/Staking/StakingModalWithdraw";
import { SuspenseSpinner } from "../components/SuspenseSpinner";
import { BigNumber } from "@ethersproject/bignumber";
import TiersAPY from "../contracts/objects/tiersAPY";
import { utils } from "ethers";
import TopStakers, { Staker } from "../contracts/objects/topStakers";

const Staking = () => {
    const { account } = useActiveWeb3React();
    const [loaded, setLoaded] = useState(false);
    const [tiersAPY, setTiersAPY] = useState<TiersAPY | undefined>(undefined);
    const [topStakers, setTopStakers] = useState<TopStakers | undefined>(undefined);
    const [rank, setRank] = useState(0);
    const [stakers, setStakers] = useState(0);
    const [totalStaked, setTotalStaked] = useState(0);
    const [oldTotalStaked, setOldTotalStaked] = useState(0);
    const [claimable, setClaimable] = useState(0);
    const [waitingPercentAPR, setWaitingPercentAPR] = useState(0);
    const [totalStakedTier1, setTotalStakedTier1] = useState(0);
    const [totalStakedTier2, setTotalStakedTier2] = useState(0);
    const [totalStakedTier3, setTotalStakedTier3] = useState(0);
    const [walletTier, setWalletTier] = useState(3);
    const stakingContract = useStakingContract(process.env.REACT_APP_STAKING_CONTRACT);
    const oldStakingContract = useStakingContract(process.env.REACT_APP_OLD_STAKING_CONTRACT);

    const [tx, setTx] = useState(0);

    const { balance, refreshBalance } = useStaking();

    const refreshTiersAPY = async () => {
        return new Promise(async (res: any, _: any) => {
            if (stakingContract == null) {
                return;
            }
            const tiers: BigNumber[] = await stakingContract.getTiersAPY();
            setTiersAPY(new TiersAPY(tiers));
            res();
        });
    };

    const refreshRankPosition = async () => {
        return new Promise(async (res: any, _: any) => {
            if (stakingContract == null) {
                return;
            }
            try {
                const rank: number = (await stakingContract.getPosition(account)).toString();
                setRank(rank);
            } catch (e) {
                console.error(e);
            }
            res();
        });
    };

    const refreshTotalStakers = async () => {
        return new Promise(async (res: any, _: any) => {
            if (stakingContract == null) {
                return;
            }
            const stakers: number = (await stakingContract.getTotalStakers()).toString();
            setStakers(stakers);
            res();
        });
    };

    const refreshClaimable = async () => {
        return new Promise(async (res: any, _: any) => {
            if (stakingContract == null) {
                return;
            }
            try {
                const claimable: number = (await stakingContract.getGlqToClaim(account)).toString();
                setClaimable(parseFloat(utils.formatUnits(claimable, 18)));
            } catch (e) {
                console.error(e);
            }

            res();
        });
    };

    const refreshTotalStaked = async () => {
        return new Promise(async (res: any, _: any) => {
            try {
                if (stakingContract == null) {
                    return;
                }
                const totalStaked: number = (await stakingContract.getTotalStaked()).toString();
                setTotalStaked(parseFloat(utils.formatUnits(totalStaked, 18)));
            } catch (e) {
                console.error(e);
            }
            res();
        });
    };

    const refreshOldTotalStaked = async () => {
        return new Promise(async (res: any, _: any) => {
            try {
                if (oldStakingContract == null) {
                    return;
                }
                const oldTotalStaked: number = (await oldStakingContract.getTotalStaked()).toString();
                setOldTotalStaked(parseFloat(utils.formatUnits(oldTotalStaked, 18)));
            } catch (e) {
                console.error(e);
            }
            res();
        });
    };

    const refreshWaitingPercentAPR = async () => {
        return new Promise(async (res: any, _: any) => {
            if (stakingContract == null) {
                return;
            }
            try {
                const percent: number = (await stakingContract.getWaitingPercentAPR(account)).toString();
                setWaitingPercentAPR(parseFloat(utils.formatUnits(percent, 18)));
            } catch (e) {
                console.error(e);
            }
            res();
        });
    };

    const refreshWalletCurrentTier = async () => {
        return new Promise(async (res: any, _: any) => {
            if (stakingContract == null) {
                return;
            }
            try {
                const tier: number = (await stakingContract.getWalletCurrentTier(account)).toString();
                setWalletTier(tier);
            } catch (e) {
                console.error(e);
            }
            res();
        });
    };

    const refreshTopStakers = async () => {
        return new Promise(async (res: any, _: any) => {
            if (stakingContract == null) {
                return;
            }
            const datas: any = await stakingContract.getTopStakers();
            const stakers: TopStakers = new TopStakers(datas[0], datas[1]);

            setTopStakers(stakers);
            res();
        });
    };

    const refreshTotalStakedTierOne = async () => {
        return new Promise(async (res: any, _: any) => {
            if (stakingContract == null) {
                return;
            }
            try {
                const amount: number = (await stakingContract.getTierTotalStaked(1)).toString();
                setTotalStakedTier1(parseFloat(utils.formatUnits(amount, 18)));
            } catch (e) {
                console.error(e);
            }
            res();
        });
    };

    const refreshTotalStakedTierTwo = async () => {
        return new Promise(async (res: any, _: any) => {
            if (stakingContract == null) {
                return;
            }
            try {
                const amount: number = (await stakingContract.getTierTotalStaked(2)).toString();
                setTotalStakedTier2(parseFloat(utils.formatUnits(amount, 18)));
            } catch (e) {
                console.error(e);
            }
            res();
        });
    };

    const refreshTotalStakedTierThree = async () => {
        return new Promise(async (res: any, _: any) => {
            if (stakingContract == null) {
                return;
            }
            try {
                const amount: number = (await stakingContract.getTierTotalStaked(3)).toString();
                setTotalStakedTier3(parseFloat(utils.formatUnits(amount, 18)));
            } catch (e) {
                console.error(e);
            }
            res();
        });
    };

    function formatCur(num: number, min: number, max: number) {
        const formatConfig = {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: min,
            maximumFractionDigits: max,
            currencyDisplay: "symbol",
        };
        const curFormatter = new Intl.NumberFormat("en-US", formatConfig);

        return curFormatter.format(num);
    }

    const [glqPrice, setGlqPrice] = useState(0);
    const [t3StakedUsdValue, setT3StakedUsdValue] = useState(0);
    const [t2StakedUsdValue, setT2StakedUsdValue] = useState(0);
    const [t1StakedUsdValue, setT1StakedUsdValue] = useState(0);

    const refreshGlqPrice = async () => {
        return new Promise(async (res: any, _: any) => {
            try {
                let response = await fetch("https://api.graphlinq.io/front/token");
                let responseJson = await response.json();
                setGlqPrice(responseJson.uni.glqPrice.toFixed(5));
            } catch (error) {
                console.error(error);
            }
            res();
        });
    };

    const refreshTotalStakedTierThreeUsd = async () => {
        return new Promise(async (res: any, _: any) => {
            try {
                const value = totalStakedTier3 * glqPrice;
                setT3StakedUsdValue(value);
            } catch (error) {
                console.error(error);
            }
            res();
        });
    };
    const refreshTotalStakedTierTwoUsd = async () => {
        return new Promise(async (res: any, _: any) => {
            try {
                const value = totalStakedTier2 * glqPrice;
                setT2StakedUsdValue(value);
            } catch (error) {
                console.error(error);
            }
            res();
        });
    };

    const refreshTotalStakedTierOneUsd = async () => {
        return new Promise(async (res: any, _: any) => {
            try {
                const value = totalStakedTier1 * glqPrice;
                setT1StakedUsdValue(value);
            } catch (error) {
                console.error(error);
            }
            res();
        });
    };

    const loadDatas = async () => {
        await refreshTiersAPY();
        await refreshRankPosition();
        await refreshTotalStakers();
        await refreshClaimable();
        await refreshTotalStaked();
        await refreshOldTotalStaked();
        await refreshWaitingPercentAPR();
        await refreshWalletCurrentTier();
        await refreshTopStakers();
        await refreshTotalStakedTierOne();
        await refreshTotalStakedTierTwo();
        await refreshTotalStakedTierThree();
        await refreshGlqPrice();
        await refreshTotalStakedTierThreeUsd();
        await refreshTotalStakedTierTwoUsd();
        await refreshTotalStakedTierOneUsd();

        setLoaded(true);
    };

    const [stakersAhead, setStakersAhead] = useState(0);


    function calcAhead() {
        let ahead;
        const totalIndex = stakers;
        const currentIndex = rank;
        const t1MaxIndex = totalIndex * 0.15;
        const t2MaxIndex = totalIndex * 0.55;

        if (currentIndex <= t1MaxIndex) {
            ahead = currentIndex - 1;
        } else if (currentIndex > t1MaxIndex && currentIndex <= t2MaxIndex) {
            ahead = currentIndex - t1MaxIndex;
        } else {
            ahead = currentIndex - t2MaxIndex;
        }

        setStakersAhead(Math.round(ahead));
    }

    useEffect(() => {
        refreshBalance();
        loadDatas();
        calcAhead();
    }, [tx, stakers, glqPrice]);

    const [error, setError] = useState("");
    const [pending, setPending] = useState("");
    const [success, setSuccess] = useState("");

    const [dataRefreshed, setDataRefreshed] = useState(true);

    useEffect(() => {
        const interval = setInterval(async () => {
            setDataRefreshed(false);
            refreshBalance();
            await refreshTotalStakers();
            await refreshGlqPrice();
            setDataRefreshed(true);
        }, 60000); //one minute

        return () => clearInterval(interval);
    }, []);

    async function migrateFunds() {
        try {
            setPending("Pending, waiting for response...");
            if (oldStakingContract == null) {
                return;
            }
            const result = await oldStakingContract.emergencyWithdraw();
            setPending("Waiting for confirmations...");
            const txReceipt = await result.wait();
            if (result instanceof String) {
                setPending("");
                setError(result.toString());
                return;
            }
            if (txReceipt.status === 1) {
                setPending("");
                setError("");
                setSuccess(txReceipt.transactionHash);
                setTx(tx + 1);
            }

            setTimeout(() => {
                setTx(tx + 1);
            }, 1000);
        } catch (e) {
            if (e.data?.originalError.message) {
                setPending("");
                setError(`Error: ${e.data?.originalError.message}`);
                return;
            }
            if (e.message) {
                setPending("");
                setError(`Error: ${e.message}`);
            }
        }
    }

    return (
        <>
            <div id="stk">
                <header>
                    <div>
                        <h1>Staking Dashboard</h1>
                        <p>Stake now your GLQ, earn rewards and participate in the community activities.</p>
                    </div>
                </header>

                {!loaded && (
                    <div style={{ margin: 50 }}>
                        <SuspenseSpinner />
                    </div>
                )}

                {loaded && (
                    <div>
                        <div className="stk-m">
                            <div>
                                <div className="stk-p">
                                    <div className="stk-pt">
                                        <Image display={["none", "block"]} src={Trophy} />
                                        <chakra.div h={["100px", "auto"]}>
                                            <chakra.div className="sub" maxW={["100px", "none"]}>Your ranking position</chakra.div>
                                            <div className="pos">
                                                <strong>{rank}</strong>
                                                <small>/ {stakers}</small>
                                            </div>
                                            <div className="rank"></div>
                                        </chakra.div>
                                        <div className="evol">
                                            <strong>Tier {walletTier}</strong>
                                            <small>Current Rank</small>
                                        </div>

                                        <div className="evol1">
                                            <strong>{stakersAhead} Ahead</strong>
                                            <small>Until Next Rank</small>
                                        </div>
                                    </div>
                                    <div className="stk-pc">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <th></th>
                                                    <th>
                                                        <span className="sub">Top 3 stakers</span>
                                                    </th>
                                                </tr>
                                                {topStakers !== undefined &&
                                                    topStakers.stakers.map((staker: Staker, i: any) => {
                                                        return (
                                                            <chakra.tr key={`${staker.wallet}`}>
                                                                <td>
                                                                    {i === 0 && <Image src={T1} />}
                                                                    {i === 1 && <Image src={T2} />}
                                                                    {i === 2 && <Image src={T3} />}
                                                                </td>
                                                                <chakra.td>
                                                                    <div className="ladd">
                                                                        <Box className="laddN" isTruncated>{staker.wallet}</Box>
                                                                        <div>
                                                                            <strong>{Number(staker.amount).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</strong> GLQ
                                                                        </div>
                                                                    </div>
                                                                </chakra.td>
                                                            </chakra.tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="stk-pe">
                                    <div>
                                        <div className="sub">Total Staked GLQ</div>
                                        <p>
                                            <strong>
                                                {totalStaked
                                                    .toFixed(2)
                                                    .toString()
                                                    .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}
                                            </strong>{" "}
                                            GLQ
                                            <small>{formatCur(totalStaked * glqPrice, 0, 2)}</small>
                                        </p>
                                    </div>
                                    <div>
                                        <div className="sub">My staked GLQ</div>
                                        <p>
                                            <strong>
                                                {balance
                                                    .toFixed(2)
                                                    .toString()
                                                    .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}
                                            </strong>{" "}
                                            GLQ
                                            <small>{formatCur(balance * glqPrice, 0, 2)}</small>
                                            <StakingModalWithdraw withdrawAmount={balance} tx={tx} setTx={setTx} claimable={claimable} />
                                        </p>
                                    </div>
                                    <div>
                                        <ClaimRewards
                                            claimable={claimable}
                                            waitingPercentAPR={waitingPercentAPR}
                                            tx={tx}
                                            setTx={setTx}
                                            error={error}
                                            setError={setError}
                                            pending={pending}
                                            setPending={setPending}
                                            success={success}
                                            setSuccess={setSuccess}
                                            rewardValue={formatCur(claimable * glqPrice, 0, 2)}
                                        />
                                    </div>
                                </div>
                                {!success && pending && (
                                    <Alert status="info" className="mod" py="2rem" px="3rem" mx="auto" mt="1rem">
                                        <i className="fal fa-info-circle"></i>
                                        <p>{pending}</p>
                                        <Spacer />
                                        <Spinner thickness="2px" speed="0.65s" emptyColor="#15122b" color="blue.600" size="md" />
                                    </Alert>
                                )}
                                {success && (
                                    <Alert status="success" className="mod" py="2rem" px="3rem" mx="auto" mt="1rem">
                                        <i className="fal fa-check-circle"></i>
                                        <p>
                                            Successfully completed !
                                            <br />
                                            <small>
                                                Transaction hash :{" "}
                                                <a href={`https://etherscan.com/tx/${success}`} target="_blank">
                                                    {success}
                                                </a>
                                            </small>
                                        </p>
                                    </Alert>
                                )}
                                <div className="tier">
                                    <h2>Tiers ranking</h2>
                                    <div title={walletTier == 1 ? "You're current tier rewards" : ""}>
                                        <div className={walletTier == 1 ? "tro act" : "tro"}>
                                            <div className="sub">Tier 1</div>
                                            <strong>{tiersAPY?.tier_1.toFixed(2)} %</strong>
                                        </div>
                                    </div>
                                    <div title={walletTier == 2 ? "You're current tier rewards" : ""}>
                                        <div className={walletTier == 2 ? "tro act" : "tro"}>
                                            <div className="sub">Tier 2</div>
                                            <strong>{tiersAPY?.tier_2.toFixed(2)} %</strong>
                                        </div>
                                    </div>
                                    <div title={walletTier == 3 ? "You're current tier rewards" : ""}>
                                        <div className={walletTier == 3 ? "tro act" : "tro"}>
                                            <div className="sub">Tier 3</div>
                                            <strong>{tiersAPY?.tier_3.toFixed(2)} %</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <ul className="uln">
                                    <li>
                                        <div className="sub">Total Staked Tier 1</div>
                                        <div className="nmb">
                                            <div>
                                                <strong>
                                                    {totalStakedTier1
                                                        .toFixed(2)
                                                        .toString()
                                                        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}
                                                </strong>{" "}
                                                GLQ
                                            </div>
                                            <div></div>
                                            <div>
                                                {!dataRefreshed ? (
                                                    <Spinner thickness="2px" speed="0.65s" emptyColor="#15122b" color="blue.600" size="md" />
                                                ) : (
                                                    <strong>{formatCur(t1StakedUsdValue, 0, 2)}</strong>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="sub">Total Staked Tier 2</div>
                                        <div className="nmb">
                                            <div>
                                                <strong>
                                                    {totalStakedTier2
                                                        .toFixed(2)
                                                        .toString()
                                                        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}
                                                </strong>{" "}
                                                GLQ
                                            </div>
                                            <div></div>
                                            <div>
                                                {!dataRefreshed ? (
                                                    <Spinner thickness="2px" speed="0.65s" emptyColor="#15122b" color="blue.600" size="md" />
                                                ) : (
                                                    <strong>{formatCur(t2StakedUsdValue, 0, 2)}</strong>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="sub">Total Staked Tier 3</div>
                                        <div className="nmb">
                                            <div>
                                                <strong>
                                                    {totalStakedTier3
                                                        .toFixed(2)
                                                        .toString()
                                                        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}
                                                </strong>{" "}
                                                GLQ
                                            </div>
                                            <div></div>
                                            <div>
                                                {!dataRefreshed ? (
                                                    <Spinner thickness="2px" speed="0.65s" emptyColor="#15122b" color="blue.600" size="md" />
                                                ) : (
                                                    <strong>{formatCur(t3StakedUsdValue, 0, 2)}</strong>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <p className="intr">
                                    Stake Your GLQ to get claimable rewards in real-time. The more you HODL, the more your rank is likely to get to the next
                                    tier with higher APY.
                                    <br />
                                    <br />
                                    <u>At each withdrawal you will lose your rank advantages, benefitting the hodlers the most.</u>
                                    <br />
                                    <br />
                                    Your first withdrawal will decrease your APY by half (if you're not on tier 3), and the second will take you back to the
                                    last tier with the least APY.
                                </p>
                                <div className="depo">
                                    <div>
                                        <div className="sub">Stake your GLQ</div>
                                            <StakingDeposit tx={tx} setTx={setTx} />
                                        <Box w="full" m="auto" mt="1rem">
                                            {oldTotalStaked > 0 ? (
                                                <Button size="sm" rounded="full" colorScheme="red" onClick={migrateFunds}>
                                                    Migrate from v1
                                                </Button>
                                            ) : (
                                                ""
                                            )}
                                        </Box>
                                    </div>
                                </div>
                            </div>                            
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Staking;
