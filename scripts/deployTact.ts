import { toNano } from '@ton/core';
import { Tact } from '../wrappers/Tact';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const tact = provider.open(await Tact.fromInit());

    await tact.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(tact.address);

    // run methods on `tact`
}
