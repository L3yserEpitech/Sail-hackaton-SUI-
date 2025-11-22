
import { Transaction } from '@mysten/sui/transactions';
import { CetusAdapter } from '../adapters/dex/cetus-adapter';
import { DexSwapNode } from '../types/strategy';
import { TESTNET_ADDRESSES } from '../config/addresses';

async function test() {
  console.log('🚀 Starting Cetus Adapter Test on Testnet...');

  const adapter = new CetusAdapter('testnet');
  
  // Mock Swap Node
  // Swapping SUI to USDT
  const swapNode: DexSwapNode = {
    id: 'swap_1',
    type: 'DEX_SWAP',
    protocol: 'CETUS',
    params: {
      pool_id: '0xc090b101978bd6370def2666b7a31d7d07704f84e833e108a969eda86150e8cf', // Testnet SUI-USDT pool from init_testnet_sdk.ts
      coin_type_a: '0x2::sui::SUI',
      coin_type_b: TESTNET_ADDRESSES.NAVI.POOLS['0x0eedc3857f39f5e44b5786ebcd790317902ffca9960f44fcea5b7589cfc7a784::usdt::USDT'].poolId, // Wait, coin type B is the type, not poolId
      // Actually coin_type_b should be the coin type string
      // Using the one from config
      // SUI is coin A (decimals 9)
      // USDT is coin B (decimals 6)
      direction: 'A_TO_B',
      amount_mode: 'EXACT_IN',
      amount: '1000000000', // 1 SUI
      slippage_tolerance: '0.01',
    },
    inputs: { coin_in: 'mock_input' },
    outputs: [{ id: 'coin_out', type: 'Coin<USDT>', output_type: 'COIN' }]
  };

  // Fix coin_type_b
  (swapNode.params as any).coin_type_b = '0x0eedc3857f39f5e44b5786ebcd790317902ffca9960f44fcea5b7589cfc7a784::usdt::USDT';

  console.log('1. Pre-swap simulation...');
  try {
    const estimate = await adapter.preSwap(swapNode);
    console.log('✅ Pre-swap success:', estimate);

    console.log('2. Building PTB...');
    const tx = new Transaction();
    // Add dummy sender to avoid build error
    tx.setSender('0x0000000000000000000000000000000000000000000000000000000000000000');
    
    const coinIn = tx.splitCoins(tx.gas, [tx.pure.u64(1000000000)]);
    
    const coinOut = adapter.swap(tx, swapNode, coinIn, estimate);
    console.log('✅ Swap built successfully');
    
    await tx.build({ client: undefined as any });
    console.log('✅ PTB construction verified');
    
    console.log('🎉 Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

test();
