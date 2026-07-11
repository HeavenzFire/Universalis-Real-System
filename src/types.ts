/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DividendReallocation {
  id: string;
  sector: string;
  sourceAgency: string;
  amountBillion: number;
  recipientProgram: string;
  status: 'PENDING' | 'ROUTING' | 'REALLOCATED' | 'IMMUTABLE';
  progressPercentage: number;
  timestamp: string;
  hash: string;
}

export interface WhistleblowerReport {
  id: string;
  sector: string;
  agency: string;
  dividendAmount: number;
  formatType: string;
  additionalNotes: string;
  reportContent?: string;
  status: 'DRAFT' | 'GENERATING' | 'COMPLETED' | 'FILED';
  timestamp: string;
  txHash?: string;
}

export interface ProtocolFile {
  name: string;
  path: string;
  description: string;
  linesOfCode: number;
  platform: 'GitHub (OpenGovOS)' | 'Mirror' | 'HDX';
  content: string;
}

export interface ArchitectComment {
  id: string;
  fileName: string;
  lineNumber: number;
  author: string;
  text: string;
  timestamp: string;
}
