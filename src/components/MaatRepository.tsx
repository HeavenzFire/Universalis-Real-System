/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProtocolFile } from '../types';
import { 
  GitBranch, Link, ExternalLink, FileCode, Check, 
  Copy, Database, Globe, Share2, CornerDownRight 
} from 'lucide-react';

interface MaatRepositoryProps {
  protocols: ProtocolFile[];
}

export default function MaatRepository({ protocols }: MaatRepositoryProps) {
  const [selectedFile, setSelectedFile] = useState<ProtocolFile>(protocols[0]);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (content: string, name: string) => {
    navigator.clipboard.writeText(content);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  const getPlatformIcon = (platform: ProtocolFile['platform']) => {
    switch (platform) {
      case 'GitHub (OpenGovOS)':
        return <GitBranch className="w-4 h-4 text-slate-400" />;
      case 'Mirror':
        return <Globe className="w-4 h-4 text-slate-400" />;
      case 'HDX':
        return <Database className="w-4 h-4 text-slate-400" />;
    }
  };

  const getPlatformURL = (file: ProtocolFile) => {
    if (file.platform === 'HDX') return 'https://centre.humdata.org';
    if (file.platform === 'Mirror') return 'https://mirror.xyz';
    return 'https://github.com/topics/mirror-xyz';
  };

  return (
    <div className="space-y-6" id="maat-repository-section">
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/20" id="repository-grid-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          
          {/* File Selector Column */}
          <div className="p-4 space-y-4 lg:col-span-1" id="file-selector-column">
            <div className="space-y-1">
              <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Global Repository of Maat</h3>
              <p className="text-xs text-slate-500">Decentralized protocols deployed across validated 2026 humanitarian platforms.</p>
            </div>

            <div className="space-y-2.5">
              {protocols.map((file) => (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedFile.name === file.name
                      ? 'bg-slate-900 border-slate-700 shadow-md'
                      : 'bg-transparent border-transparent hover:bg-slate-900/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {getPlatformIcon(file.platform)}
                    <span className="text-sm font-mono font-medium text-slate-200">{file.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{file.description}</p>
                  
                  <div className="flex items-center gap-3 mt-2.5 text-[10px] font-mono text-slate-400">
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/60">
                      {file.platform}
                    </span>
                    <span>{file.linesOfCode} lines</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg space-y-2 text-xs text-slate-400">
              <div className="font-semibold text-slate-300 font-mono text-[10px] uppercase">VERIFIED REDISTRIBUTION CORES</div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <CornerDownRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>OpenGovOS Smart Contracts</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <CornerDownRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>HDX Sovereign Datasets</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <CornerDownRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Mirror Immutable Manifests</span>
              </div>
            </div>
          </div>

          {/* Code Viewer Column */}
          <div className="lg:col-span-2 flex flex-col bg-slate-950/60" id="code-viewer-column">
            {/* Toolbar */}
            <div className="p-3 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                <FileCode className="w-4 h-4 text-emerald-500" />
                <span>{selectedFile.path}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(selectedFile.content, selectedFile.name)}
                  className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all text-xs flex items-center gap-1"
                >
                  {copied === selectedFile.name ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-mono text-[10px]">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="font-mono text-[10px]">COPY SOURCE</span>
                    </>
                  )}
                </button>

                <a
                  href={getPlatformURL(selectedFile)}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all text-xs flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="font-mono text-[10px]">EXPLORE PROTOCOL</span>
                </a>
              </div>
            </div>

            {/* Code Panel */}
            <div className="p-4 flex-1 font-mono text-xs overflow-auto max-h-[460px] bg-slate-950/80">
              <pre className="text-slate-300 leading-relaxed tab-size-2">
                <code>
                  {selectedFile.content}
                </code>
              </pre>
            </div>

            {/* Verification Footer */}
            <div className="p-3.5 border-t border-slate-800 bg-slate-900/20 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>SHA-256 VALIDATED PROTOCOL</span>
              </div>
              <span className="text-slate-400">
                LATEST TRANSACTION: 2026-07-11
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
