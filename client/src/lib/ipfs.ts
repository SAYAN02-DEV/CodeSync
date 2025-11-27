import { create } from '@web3-storage/w3up-client';

let client: Awaited<ReturnType<typeof create>> | null = null;

export async function getIPFSClient() {
  if (client) return client;
  
  client = await create();
  return client;
}

export interface ProjectFile {
  path: string;
  content: string;
}

export interface IPFSUploadResult {
  cid: string;
  url: string;
}

/**
 * Upload project files to IPFS
 * @param files Array of files with path and content
 * @param projectName Name of the project
 */
export async function uploadToIPFS(
  files: ProjectFile[],
  projectName: string
): Promise<IPFSUploadResult> {
  try {
    const w3client = await getIPFSClient();
    
    // Create File objects from project files
    const fileObjects = files.map(file => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      return new File([blob], file.path);
    });

    // Add project metadata
    const metadata = {
      name: projectName,
      timestamp: new Date().toISOString(),
      fileCount: files.length,
    };
    
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { 
      type: 'application/json' 
    });
    fileObjects.push(new File([metadataBlob], 'project.json'));

    // Upload to IPFS
    const cid = await w3client.uploadDirectory(fileObjects);
    
    return {
      cid: cid.toString(),
      url: `https://w3s.link/ipfs/${cid}`,
    };
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

/**
 * Retrieve project from IPFS
 * @param cid IPFS CID
 */
export async function retrieveFromIPFS(cid: string): Promise<ProjectFile[]> {
  try {
    const response = await fetch(`https://w3s.link/ipfs/${cid}`);
    if (!response.ok) {
      throw new Error('Failed to fetch from IPFS');
    }

    // For now, return a simple structure
    // In production, you'd parse the directory structure
    const text = await response.text();
    return [
      {
        path: 'retrieved.txt',
        content: text,
      },
    ];
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    throw new Error('Failed to retrieve from IPFS');
  }
}

/**
 * Get IPFS gateway URL for a CID
 */
export function getIPFSUrl(cid: string): string {
  return `https://w3s.link/ipfs/${cid}`;
}
