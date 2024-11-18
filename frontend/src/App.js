import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SpiroRapidoAgreement from './build/contracts/SpiroRapidoAgreement.json';
import Login from './login';

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [spiro, setSpiro] = useState('Not signed');
  const [rapido, setRapido] = useState('Not signed');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadBlockchainData = async () => {
    try {
      // Connect to MetaMask
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        // Get current account
        const accounts = await web3.eth.getAccounts();
        setCurrentAccount(accounts[0]);

        // Get network ID
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SpiroRapidoAgreement.networks[networkId];

        // Load contract
        if (deployedNetwork) {
          const instance = new web3.eth.Contract(
            SpiroRapidoAgreement.abi,
            deployedNetwork.address
          );
          setContract(instance);

          // Fetch initial contract state
          const spiroAddress = await instance.methods.spiro().call();
          const rapidoAddress = await instance.methods.rapido().call();
          const spiroSigned = await instance.methods.spiroSigned().call();
          const rapidoSigned = await instance.methods.rapidoSigned().call();

          if (spiroSigned) setSpiro(spiroAddress);
          if (rapidoSigned) setRapido(rapidoAddress);
        } else {
          alert('Contract not deployed on this network');
        }
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error loading blockchain data:', error);
    }
  };

  const signAsSpiro = async () => {
    try {
      if (!contract) throw new Error('Contract not loaded');
      const agreementHash = prompt('Enter the agreement hash to sign as Spiro:');
      await contract.methods.signAsSpiro(agreementHash).send({ from: currentAccount });
      const spiroAddress = await contract.methods.spiro().call();
      setSpiro(spiroAddress); // Update UI
    } catch (error) {
      console.error('Error signing as Spiro:', error);
      alert(`Failed to sign as Spiro: ${error.message}`);
    }
  };

  const signAsRapido = async () => {
    try {
      if (!contract) throw new Error('Contract not loaded');
      const agreementHash = prompt('Enter the agreement hash to sign as Rapido:');
      await contract.methods.signAsRapido(agreementHash).send({ from: currentAccount });
      const rapidoAddress = await contract.methods.rapido().call();
      setRapido(rapidoAddress); // Update UI
    } catch (error) {
      console.error('Error signing as Rapido:', error);
      alert(`Failed to sign as Rapido: ${error.message}`);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    loadBlockchainData(); // Load blockchain data after login
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h1>Spiro-Rapido SLA</h1>
          <p>Current Account: {currentAccount}</p>
          <div>
            <h2>Agreement:</h2>
            <p>This agreement is for 40,000 EV bikes between Spiro and Rapido.</p>
            <p>Spiro Signature: {spiro}</p>
            <p>Rapido Signature: {rapido}</p>
          </div>
          <button onClick={signAsSpiro}>Sign as Spiro</button>
          <button onClick={signAsRapido}>Sign as Rapido</button>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;