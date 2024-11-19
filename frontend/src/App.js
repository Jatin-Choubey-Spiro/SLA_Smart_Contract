import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SpiroRapidoAgreement from './build/contracts/SpiroRapidoAgreement.json';
import Login from './login';

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [spiro, setSpiro] = useState('Not signed');
  const [rapido, setRapido] = useState('Not signed');
  const [spiroDetails, setSpiroDetails] = useState({ name: '', date: '' });
  const [rapidoDetails, setRapidoDetails] = useState({ name: '', date: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    loadBlockchainData(); // Load blockchain data after login
  };

  const loadBlockchainData = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const accounts = await web3.eth.getAccounts();
        setCurrentAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SpiroRapidoAgreement.networks[networkId];

        if (deployedNetwork) {
          const instance = new web3.eth.Contract(
            SpiroRapidoAgreement.abi,
            deployedNetwork.address
          );
          setContract(instance);

          const spiroAddress = await instance.methods.spiro().call();
          const rapidoAddress = await instance.methods.rapido().call();
          const spiroSigned = await instance.methods.spiroSigned().call();
          const rapidoSigned = await instance.methods.rapidoSigned().call();

          if (spiroSigned) {
            setSpiro(spiroAddress);
            if (!spiroDetails.date) {
              setSpiroDetails({
                name: 'Spiro',
                date: new Date().toLocaleString(),
              });
            }
          }
          if (rapidoSigned) {
            setRapido(rapidoAddress);
            if (!rapidoDetails.date) {
              setRapidoDetails({
                name: 'Rapido',
                date: new Date().toLocaleString(),
              });
            }
          }
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
      setSpiro(spiroAddress);
      setSpiroDetails({
        name: 'Spiro',
        date: new Date().toLocaleString(),
      });
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
      setRapido(rapidoAddress);
      setRapidoDetails({
        name: 'Rapido',
        date: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error('Error signing as Rapido:', error);
      alert(`Failed to sign as Rapido: ${error.message}`);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      {isAuthenticated ? (
        <div style={styles.container}>
          <div style={styles.header}>
            <h1>Spiro-Rapido SLA Agreement</h1>
          </div>
          <div style={styles.buttonRow}>
            <button onClick={loadBlockchainData} style={styles.button}>Connect Wallet</button>
          </div>
          <p>Current Account: {currentAccount}</p>
          <div style={styles.form}>
            <div style={styles.section}>
              <h2 style={styles.sectionHeader}>Agreement Details</h2>
              <ol style={styles.list}>
                <li>Both parties will adhere to the agreed SLA conditions.</li>
                <li>40,000 EV bikes will be leased by Spiro to Rapido.</li>
                <li>Rapido will maintain the bikes as per the maintenance guidelines.</li>
                <li>Monthly payments to Spiro are due by the 5th of each month.</li>
                <li>Rapido must provide monthly usage and mileage reports.</li>
                <li>Late payments will incur a 2% penalty per month.</li>
                <li>Spiro will provide service support for technical issues.</li>
                <li>Any disputes will be resolved via arbitration.</li>
                <li>This agreement is valid for a period of 3 years.</li>
                <li>Both parties must give 60 days' notice for termination.</li>
              </ol>
            </div>
            <div style={styles.section}>
              <h2 style={styles.sectionHeader}>Signatures</h2>
              <div style={styles.signatureRow}>
                <div style={styles.signatureBox}>
                  <p><b>Name:</b> {spiroDetails.name}</p>
                  <p><b>Signature:</b> {spiro}</p>
                  <p><b>Date:</b> {spiroDetails.date}</p>
                </div>
                <div style={styles.signatureBox}>
                  <p><b>Name:</b> {rapidoDetails.name}</p>
                  <p><b>Signature:</b> {rapido}</p>
                  <p><b>Date:</b> {rapidoDetails.date}</p>
                </div>
              </div>
            </div>
            <div style={styles.buttonRow}>
              <button onClick={signAsSpiro} style={styles.button}>Sign as Spiro</button>
              <button onClick={signAsRapido} style={styles.button}>Sign as Rapido</button>
            </div>
          </div>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    maxHeight: '100vh', // Restrict the container to the viewport height
    overflowY: 'auto', // Enable vertical scrolling
    padding: '20px', // Add some padding for aesthetics
    boxSizing: 'border-box', // Ensure padding doesn't affect the width/height
    margin: '0 auto',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  section: {
    marginBottom: '20px',
  },
  sectionHeader: {
    borderBottom: '2px solid #ccc',
    paddingBottom: '5px',
    marginBottom: '10px',
  },
  list: {
    paddingLeft: '20px',
  },
  signatureRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '10px',
    backgroundColor: '#f4f4f4',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordWrap: 'break-word',
  },  
  buttonRow: {
    textAlign: 'center',
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    marginRight: '10px',
  },
};

export default App;
