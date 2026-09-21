const { ethers } = require("hardhat");

async function main() {
    console.log("Compiling and deploying BushidoVirtueAccessControl...");

    // We fetch the contract factory
    const Bushido = await ethers.getContractFactory("BushidoVirtueAccessControl");
    
    // Deploy the contract 
    // (The constructor automatically injects 0xBA397fAae1D5Fe10C0356f2e585bef34577ab111 as Admin/Recorder)
    const bushido = await Bushido.deploy();

    await bushido.waitForDeployment();

    const address = await bushido.getTarget();
    console.log(`BushidoVirtueAccessControl successfully deployed to: ${0xBA397fAae1D5Fe10C0356f2e585bef34577ab111}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});