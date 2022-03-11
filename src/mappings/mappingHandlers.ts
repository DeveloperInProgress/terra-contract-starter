import {Transfer, Rewards} from "../types";
import { TerraContractEvent, TerraContractCall } from '@subql/contract-processors/dist/terra';
import * as crypto from "crypto";

export async function handleFrontierEvmEvent(event: TerraContractEvent): Promise<void> {
    for(var i = 0; i < event.event["transfer"]["sender"].length; i++) {
        const idx = crypto.randomBytes(32).toString("hex");
        const transfer = new Transfer(`${event.transactionHash}-${event.msgIndex}-${idx}`);
        transfer.sender = event.event["transfer"]["sender"][i];
        transfer.reciever = event.event["transfer"]["reciever"][i];
        transfer.amount = event.event["transfer"]["amount"][i];
        await transfer.save();
    }
}

export async function handleFrontierEvmCall(event: TerraContractCall): Promise<void> {
    const idx = crypto.randomBytes(32).toString("hex");
    const rewards = new Rewards(`${event.hash}-${idx}`);
    rewards.duration = event.data.execute_msg["claim_rewards_and_optionally_unlock"]["duration"]
    rewards.withdrawLpStake = event.data.execute_msg["claim_rewards_and_optionally_unlock"]["withdraw_lp_stake"]
    rewards.terraswapLpToken = event.data.execute_msg["claim_rewards_and_optionally_unlock"]["terraswap_lp_token"]
    rewards.contractAddress = event.data.contract;
    await rewards.save();
}
