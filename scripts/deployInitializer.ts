import { toNano } from "@ton/core";
import { Initializer } from "../wrappers/Initializer";
import { NetworkProvider } from "@ton/blueprint";

export async function run(provider: NetworkProvider) {
  // FIXME: provide admin, recepient, payoutDate;
  const initializer = provider.open(await Initializer.fromInit());

  await initializer.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  );

  await provider.waitForDeploy(initializer.address);

  // run methods on `initializer`
}
