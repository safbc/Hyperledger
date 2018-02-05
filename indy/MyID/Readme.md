# MyID - SAFBC Identity Proof of Concept

In order to demostrate the potential of the Sovrin Identity Framework in a _real_ way, the SAFBC's Identity Working Group is attempting to build out a sample set of applications to test a KYC scenario.

There are three components to this POC.

## MyID Agent

An Agent will exist for each participant on the Sovrin Idenity Network, and provides the following functionality:

* it is the interface to the Sovrin distributed ledger
* it controls the identity wallet containing keys and data

## MyID Bank Application

The application will perform two roles in this demo:

* Cater for the capture of a _clients_ PII data into a KYC data Claim and subsequent attestation of said claim (signing with the banks public key)
* Verification of subsequent identy claims provided by prospective clients

## MyID User Mobile App

The MyID app will be used by individuals to manage their own idenity. The app will:

* Connect to the users Agent in order to interact with the Sovrin Network.
* Manage the clients DID's and relationships with other network participants
* Provide a mechanism for processing Identity information requests