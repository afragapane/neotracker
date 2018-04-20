/* @flow */
import type { Monitor } from '@neo-one/monitor';

import { type Context } from '../types';

import { fixIssued } from './common';

const THOR_HASH = '67a5086bac196b67d5fd20745b0dc9db4d2930ed';

export default (context: Context, monitor: Monitor, checkpoint: string) =>
  fixIssued(context, monitor, checkpoint, THOR_HASH);
