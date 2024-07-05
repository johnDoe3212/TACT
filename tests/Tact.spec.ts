import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Tact } from '../wrappers/Tact';
import '@ton/test-utils';

describe('Tact', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let tact: SandboxContract<Tact>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        tact = blockchain.openContract(await Tact.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await tact.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tact.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and tact are ready to use
    });
});
