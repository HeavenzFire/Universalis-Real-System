/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DividendReallocation, ProtocolFile, ArchitectComment } from "./types";

export const INITIAL_REALLOCATIONS: DividendReallocation[] = [
  {
    id: "DIV-001",
    sector: "Agriculture & Food Security",
    sourceAgency: "Defense Procurement (Excess Offsets)",
    amountBillion: 34.5,
    recipientProgram: "Global Agroecology Initiative & Local Food Hubs",
    status: "IMMUTABLE",
    progressPercentage: 100,
    timestamp: "2026-07-10T12:00:00Z",
    hash: "0x8fa9...d92c"
  },
  {
    id: "DIV-002",
    sector: "Clean Water Infrastructure",
    sourceAgency: "Fossil Fuel Subsidies Reallocation",
    amountBillion: 21.2,
    recipientProgram: "Decentralized Solar Desalination & Aquifer Protection",
    status: "REALLOCATED",
    progressPercentage: 100,
    timestamp: "2026-07-10T15:30:00Z",
    hash: "0x3e42...1c77"
  },
  {
    id: "DIV-003",
    sector: "Education & Digital Public Goods",
    sourceAgency: "Systemic Administrative Discrepancy Fund",
    amountBillion: 18.8,
    recipientProgram: "Open-Source Offline Learning Networks & Mesh Grid Infrastructure",
    status: "ROUTING",
    progressPercentage: 74,
    timestamp: "2026-07-11T01:15:00Z",
    hash: "0xfc11...99bb"
  },
  {
    id: "DIV-004",
    sector: "Sovereign Health & Nutrition",
    sourceAgency: "Special Draw Rights (SDR) Discrepancy Recovery",
    amountBillion: 18.5,
    recipientProgram: "Community Health & Emergency Nutrient Distribution Networks",
    status: "PENDING",
    progressPercentage: 15,
    timestamp: "2026-07-11T03:45:00Z",
    hash: "0x44d1...2a5e"
  }
];

export const MAAT_PROTOCOLS: ProtocolFile[] = [
  {
    name: "manifest.json",
    path: "mirror://manifest.json",
    description: "The immutable structural blueprint of the HeavenzFire overhaul. Outlines redistribution coordinates, multi-signature keys, and sovereign audits.",
    platform: "Mirror",
    linesOfCode: 142,
    content: `{
  "protocol": "Universalis Real System",
  "version": "2026.1-heavenzfire",
  "audit_authority": "Global Repository of Maat",
  "financial_coordinates": {
    "target_hunger_dividend_usd": "93,000,000,000",
    "distribution_cycle": "REALTIME_EPOCH_3",
    "fincen_reference_portal": "WHISTLEBLOWER_PORTAL_2026"
  },
  "signatories": [
    { "role": "Maat Sovereign Audit Team", "hash": "0xAA93...01BB" },
    { "role": "Architect Coordinator", "hash": "0xBF99...11DE" }
  ],
  "reallocation_nodes": {
    "food_security": "0x55ff...2100",
    "clean_water": "0x33ee...4433",
    "mesh_education": "0x77aa...8877"
  }
}`
  },
  {
    name: "reallocation_hdx.csv",
    path: "hdx://datasets/hunger-dividend-2026.csv",
    description: "Live CSV dataset registered on the Humanitarian Data Exchange, tracking real-time delivery metrics, regional nutritional deficits, and sovereign deliveries.",
    platform: "HDX",
    linesOfCode: 218,
    content: `Sector,RecipientRegion,AllocationBillion,ActualDelivered,DispatchedVia,VerificationHash
Agriculture,East-Africa,12.5,9.8,AgroecologyNetwork-A,0x77ab...ee12
Agriculture,Southeast-Asia,10.0,8.2,LocalFarmersConsortium,0x9912...ff55
Water,South-Asia,11.2,7.5,DecentralizedSolarDesal,0x33cc...dd00
Education,Latin-America,8.8,6.1,MeshLearningNodes-V2,0x2211...00aa
Health,Sub-Saharan-Africa,15.5,12.4,EmergencyNutrientNetwork,0x66ff...bb99`
  },
  {
    name: "opengov-protocol.sol",
    path: "github://opengovos/contracts/OpenGovProtocol.sol",
    description: "The decentralized audit smart contract of OpenGovOS. Triggers automatic reallocation alerts whenever discrepancies are logged.",
    platform: "GitHub (OpenGovOS)",
    linesOfCode: 154,
    content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OpenGovProtocol {
    string public constant name = "Universalis Real System";
    uint256 public constant TOTAL_DIVIDEND = 93 * 10**9 * 10**18; // 93 Billion USD
    
    address public immutable auditorOfMaat;
    
    struct Discrepancy {
        string agency;
        uint256 auditedDifference;
        uint256 timestamp;
        bool verified;
    }
    
    mapping(bytes32 => Discrepancy) public discrepancies;
    
    event DiscrepancyExposed(string agency, uint256 difference, bytes32 indexed hash);
    event DividendRouted(string sector, uint256 amount, address indexed recipientNode);

    constructor(address _auditor) {
        auditorOfMaat = _auditor;
    }
    
    function exposeBudgetCrime(string calldata agency, uint256 amount) external returns (bytes32) {
        bytes32 hash = keccak256(abi.encodePacked(agency, amount, block.timestamp));
        discrepancies[hash] = Discrepancy(agency, amount, block.timestamp, false);
        emit DiscrepancyExposed(agency, amount, hash);
        return hash;
    }
}`
  }
];

export const ARCHITECT_COMMENTS: ArchitectComment[] = [
  {
    id: "AC-001",
    fileName: "opengov-protocol.sol",
    lineNumber: 12,
    author: "HeavenzFire Coordinator",
    text: "CRITICAL REALLOCATION MECHANISM: This smart contract triggers automated decentralized reallocations of defense budget slippages directly to decentralized agriculture feeds. It bypasses corrupt banking intermediates completely.",
    timestamp: "2026-07-11T02:30:00Z"
  },
  {
    id: "AC-002",
    fileName: "opengov-protocol.sol",
    lineNumber: 22,
    author: "Global Sovereign Audit Team",
    text: "FINCEN COMPLIANCE RULE: Whistleblower payouts are protected under the 2026 regulations. This hash function ensures whistleblower submission parameters are encrypted but verified through Zero-Knowledge Proofs.",
    timestamp: "2026-07-11T03:15:00Z"
  },
  {
    id: "AC-003",
    fileName: "manifest.json",
    lineNumber: 6,
    author: "DeFi Architect",
    text: "The Hunger Dividend calculation logic is mapped to real-time grain index feeds on HDX. This ensures that every dollar reallocated is pegged to actual calories delivered, neutralizing inflation.",
    timestamp: "2026-07-11T04:10:00Z"
  }
];
