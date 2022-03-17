import {Transfer, ExecuteMsgs} from "../types";
import { TerraEvent, TerraMessage } from '@subql/types-terra';
import { MsgExecuteContract } from "@terra-money/terra.js";

export async function handleEvent(event: TerraEvent<MsgExecuteContract>): Promise<void> {
    const idx = `${event.tx.tx.txhash}-${event.msg.idx}-${event.idx}`
    const transfer = new Transfer(idx);
    for(const attr of event.event.attributes) {
        switch(attr.key) {
            case 'sender':
                transfer.sender = attr.value;
                break;
            case 'recipient':
                transfer.recipient = attr.value;
                break;
            case 'amount':
                transfer.amount = attr.value;
                break;
            default:
        }
    }
    await transfer.save();
}

export async function handleMessage(msg: TerraMessage<MsgExecuteContract>): Promise<void> {
    const idx = `${msg.tx.tx.txhash}-${msg.idx}`;
    const executeMsg = new ExecuteMsgs(idx);
    executeMsg.contract = msg.msg.toData().contract;
    executeMsg.sender = msg.msg.toData().sender;
    executeMsg.executeMsg = JSON.stringify(msg.msg.toData().execute_msg);
    await executeMsg.save();
}
