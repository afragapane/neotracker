import { ActionRaw, scriptHashToAddress } from '@neo-one/client';
import { utils } from '@neotracker/shared-utils';
import BigNumber from 'bignumber.js';
import { ActionData, Context } from '../types';

export function getActionDataForClient({
  context,
  action: actionIn,
}: {
  readonly context: Context;
  readonly action: ActionRaw;
}): ActionData<ActionRaw> {
  const nep5Contract = context.nep5Contracts[actionIn.scriptHash];
  if (nep5Contract === undefined) {
    return { action: actionIn };
  }
  // tslint:disable-next-line no-any
  let action: any;
  try {
    action = nep5Contract.convertAction(actionIn);
  } catch {
    // ignore errors
  }
  if (action === undefined || action.type !== 'Event' || action.name !== 'transfer') {
    return { action: actionIn };
  }

  const parameters = action.parameters;

  let fromAddressHash = parameters.from === undefined ? undefined : scriptHashToAddress(parameters.from);
  const toAddressHash = parameters.to === undefined ? undefined : scriptHashToAddress(parameters.to);
  const value = parameters.amount as BigNumber;
  if (scriptHashToAddress(actionIn.scriptHash) === fromAddressHash) {
    fromAddressHash = undefined;
  }

  const result = {
    fromAddressID: fromAddressHash,
    toAddressID: toAddressHash,
    assetID: actionIn.scriptHash,
    transferID: actionIn.globalIndex.toString(),
    coinChanges: [
      fromAddressHash === undefined
        ? undefined
        : {
            address: fromAddressHash,
            asset: actionIn.scriptHash,
            value: value.negated(),
          },
      toAddressHash === undefined
        ? undefined
        : {
            address: toAddressHash,
            asset: actionIn.scriptHash,
            value,
          },
    ].filter(utils.notNull),
  };

  return { action: actionIn, transfer: { value, result } };
}
