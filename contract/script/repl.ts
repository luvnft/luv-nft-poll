import readline from "readline";
import * as interactions from "./contract-interactions.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const functionMap = {
  1: { name: "createProfile", func: interactions.createProfile },
  2: { name: "mintToken", func: interactions.mintToken },
  3: { name: "approveAllo", func: interactions.approveAllo },
  4: { name: "transferNFTOwnership", func: interactions.transferNFTOwnership },
  5: {
    name: "createPoolWithCustomStrategy",
    func: interactions.createPoolWithCustomStrategy,
  },
  6: { name: "registerRecipient", func: interactions.registerRecipient },
  7: {
    name: "updateRecipientStatus",
    func: interactions.updateRecipientStatus,
  },
  8: { name: "allocate", func: interactions.allocate },
  9: { name: "distributeFunds", func: interactions.distributeFunds },
  10: { name: "mintTokenTocapyCore", func: interactions.mintTokenToCapyCore },
  11: { name: "capyCoreTest", func: interactions.capyCoreTest },
  12: { name: "createStrategy", func: interactions.createStrategy },
  13: { name: "balanceOfDrips", func: interactions.balanceOfDrips },
};

function displayMenu() {
  console.log("\nAvailable functions:");
  for (const [key, value] of Object.entries(functionMap)) {
    console.log(`${key}. ${value.name}`);
  }
  console.log(
    'Type the number or name of the function to call it, or "exit" to quit.'
  );
}

async function handleInput(input: string) {
  input = input.trim().toLowerCase();

  if (input === "exit") {
    rl.close();
    return;
  }

  let selectedFunction;
  const numericInput = parseInt(input);
  if (
    !isNaN(numericInput) &&
    functionMap[numericInput as keyof typeof functionMap]
  ) {
    selectedFunction = functionMap[numericInput as keyof typeof functionMap];
  } else {
    selectedFunction = Object.values(functionMap).find(
      (f) => f.name.toLowerCase() === input
    );
  }

  if (selectedFunction) {
    console.log(`Calling ${selectedFunction.name}...`);
    try {
      const result = await selectedFunction.func();
      console.log(
        `${selectedFunction.name} called successfully. Result:`,
        result
      );
    } catch (error) {
      console.error(`Error calling ${selectedFunction.name}:`, error);
    }
  } else {
    console.log("Invalid input. Please try again.");
  }

  displayMenu();
}

function startREPL() {
  console.log("Welcome to the Contract Interaction REPL");
  displayMenu();

  rl.on("line", handleInput);
}

startREPL();
