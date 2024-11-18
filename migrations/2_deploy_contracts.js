const SpiroRapidoAgreement = artifacts.require("SpiroRapidoAgreement");

module.exports = function (deployer, network, accounts) {
    deployer.deploy(SpiroRapidoAgreement, { from: accounts[0] });
}