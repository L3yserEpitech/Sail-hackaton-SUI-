/**
 * Navi Protocol Flash Loan Adapter
 *
 * Integrates with Navi Protocol's flash loan functionality.
 * Fee: 0.06%
 */

import { Transaction } from "@mysten/sui/transactions";
import { FlashBorrowNode, FlashRepayNode } from "../../types/strategy";
import { BaseFlashLoanAdapter, BorrowResult } from "./types";
import { MAINNET_ADDRESSES, TESTNET_ADDRESSES } from "../../config/addresses";

export class NaviAdapter extends BaseFlashLoanAdapter {
  readonly protocol = "NAVI";
  protected readonly feePercentage = 0.0006; // 0.06%

  constructor(
    private readonly network: "mainnet" | "testnet" = "testnet"
  ) {
    super();
  }

  private getConfig() {
    return this.network === "mainnet" ? MAINNET_ADDRESSES : TESTNET_ADDRESSES;
  }

  borrow(tx: Transaction, node: FlashBorrowNode): BorrowResult {
    const config = this.getConfig();
    // Get pool config for the asset
    const poolConfig = this.getPoolConfig(node.params.asset);

    const amount = BigInt(node.params.amount);

    // Construct the PTB call for flash loan
    // Based on Navi SDK implementation: flash_loan_with_ctx_v2
    const [balance, receipt] = tx.moveCall({
      target: `${config.NAVI.PACKAGE}::lending::flash_loan_with_ctx_v2`,
      arguments: [
        tx.object(config.NAVI.FLASHLOAN_CONFIG),
        tx.object(poolConfig.poolId),
        tx.pure.u64(amount),
        tx.object("0x05"), // System object required by Navi
      ],
      typeArguments: [node.params.asset],
    });

    // Convert Balance to Coin so it can be used in the strategy graph
    const coin = tx.moveCall({
      target: "0x2::coin::from_balance",
      arguments: [balance],
      typeArguments: [node.params.asset],
    });

    return { coin, receipt };
  }

  repay(tx: Transaction, node: FlashRepayNode, coin: any, receipt: any): void {
    const config = this.getConfig();
    const poolConfig = this.getPoolConfig(node.params.asset);

    // Convert Coin back to Balance for repayment
    // Navi flash_repay expects Balance, mirroring the flash_loan output
    const balance = tx.moveCall({
      target: "0x2::coin::into_balance",
      arguments: [coin],
      typeArguments: [node.params.asset],
    });

    // Repay the flash loan
    // Based on Navi SDK implementation: flash_repay_with_ctx
    tx.moveCall({
      target: `${config.NAVI.PACKAGE}::lending::flash_repay_with_ctx`,
      arguments: [
        tx.object("0x06"), // Clock
        tx.object(config.NAVI.STORAGE),
        tx.object(poolConfig.poolId),
        receipt,
        balance,
      ],
      typeArguments: [node.params.asset],
    });
  }

  /**
   * Get pool configuration for a given asset
   */
  private getPoolConfig(asset: string): { poolId: string; assetId: number; name: string } {
    const config = this.getConfig();
    const pool = config.NAVI.POOLS[asset as keyof typeof config.NAVI.POOLS];

    if (!pool) {
      throw new Error(`No Navi pool found for asset: ${asset}. Please add it to backend/src/config/addresses.ts`);
    }

    return pool;
  }
}
