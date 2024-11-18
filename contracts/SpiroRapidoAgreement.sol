// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SpiroRapidoAgreement {
    address public spiro;
    address public rapido;
    string public agreementHash;
    bool public spiroSigned;
    bool public rapidoSigned;

    event AgreementSigned(address signer);

    constructor() {
        spiro = msg.sender;
    }

    function signAsSpiro(string memory _agreementHash) public {
        require(msg.sender == spiro, "Only Spiro can sign this");
        agreementHash = _agreementHash;
        spiroSigned = true;
        emit AgreementSigned(msg.sender);
    }

    function signAsRapido() public {
        require(msg.sender != spiro, "Spiro cannot sign as Rapido");
        rapido = msg.sender;
        rapidoSigned = true;
        emit AgreementSigned(msg.sender);
    }

    function isAgreementComplete() public view returns (bool) {
        return spiroSigned && rapidoSigned;
    }
}