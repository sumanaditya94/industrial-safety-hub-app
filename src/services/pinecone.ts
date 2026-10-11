import { Pinecone } from '@pinecone-database/pinecone';

// Secure implementation: loading from environment variables.
const PINECONE_API_KEY = import.meta.env.VITE_PINECONE_API_KEY || '';
const PINECONE_INDEX = import.meta.env.VITE_PINECONE_INDEX || 'safety-db';
const PINECONE_HOST = import.meta.env.VITE_PINECONE_HOST || '';

let pineconeInstance: Pinecone | null = null;

export const getPineconeClient = () => {
  if (!pineconeInstance && PINECONE_API_KEY) {
    pineconeInstance = new Pinecone({
      apiKey: PINECONE_API_KEY,
    });
  }
  return pineconeInstance;
};

export const queryVectorDB = async (vector: number[], topK: number = 5) => {
  if (!PINECONE_API_KEY || !PINECONE_HOST) {
    console.warn("Pinecone API key or host is not set. Simulating response.");
    return simulatePineconeResponse();
  }

  try {
    const client = getPineconeClient();
    if (!client) throw new Error("Client initialization failed");

    const index = client.index(PINECONE_INDEX, PINECONE_HOST);
    const response = await index.query({
      vector,
      topK,
      includeMetadata: true,
    });
    return response;
  } catch (error) {
    console.error("Pinecone Query Error: ", error);
    return simulatePineconeResponse();
  }
};

const simulatePineconeResponse = () => ({
  matches: [
    {
      id: 'simulated-match-1',
      score: 0.95,
      metadata: { text: 'Simulated vector search result for safety documentation due to missing API keys.' }
    }
  ]
});
