import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { toNano } from "@ton/core";
import { Initializer } from "../wrappers/Initializer";
import "@ton/test-utils";
import { Logger } from "@henchtab/shrek";

describe("Initializer", () => {
  let blockchain: Blockchain;
  let logger: Logger;

  let deployer: SandboxContract<TreasuryContract>;
  let alice: SandboxContract<TreasuryContract>;

  let initializer: SandboxContract<Initializer>;

  beforeEach(async () => {
    blockchain = await Blockchain.create();
    logger = new Logger(blockchain);

    deployer = await blockchain.treasury("deployer");
    logger.addContract(deployer, "Deployer");

    alice = await blockchain.treasury("alice");
    logger.addContract(alice, "Alice");

    initializer = blockchain.openContract(
      await Initializer.fromInit(deployer.address, alice.address, 1000n),
    );
    logger.addContract(initializer, "Initializer");

    const DeployResult = await initializer.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    );
    await logger.logTransactions(DeployResult.transactions, "DeployResult");

    expect(DeployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: initializer.address,
      deploy: true,
      success: true,
    });
  });

  it("should deploy", async () => {
    // the check is done inside beforeEach
    // blockchain and initializer are ready to use
  });
});
