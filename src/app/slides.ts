export interface Slide {
  imageUrl: string;
  explainerImageUrl: string;
  title: string;
  subtitle?: string;
  content: string[];
  explanation: string;
  imagePrompt: string;
  visualType: 'diagram' | 'hero' | 'flowchart' | 'comparison';
}

export const slides: Slide[] = [
  {
    title: "The Era of Retrieval-Augmented Generation",
    subtitle: "Bridging the Gap Between LLM Reasoning and Real-World Knowledge",
    content: [
      "Dynamic context injection",
      "Fact-checking LLM outputs",
      "Reducing hallucinations",
      "Access to private/proprietary data"
    ],
    explanation: "Retrieval-Augmented Generation, or RAG, is the revolutionary technique of providing Large Language Models with external, real-time data to improve accuracy and relevance. Instead of relying solely on pre-trained knowledge, the model acts like a researcher, looking up specific facts before generating an answer.",
    imagePrompt: "A high-tech cinematic visualization of a glowing brain connected to a vast network of floating data nodes and library archives, neon blue and purple highlights, futuristic aesthetic, 8k resolution.",
    visualType: 'hero',
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1600",
    explainerImageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1600"
  },
  {
    title: "Why Do We Need RAG?",
    subtitle: "The limitations of static pre-training",
    content: [
      "Knowledge Cut-off (training data is old)",
      "Hallucinations (making things up)",
      "Lack of context (no access to your private files)",
      "High Cost (fine-tuning is expensive)"
    ],
    explanation: "LLMs are like extremely smart students who graduated a few years ago. They are brilliant but don't know what happened yesterday. RAG gives them an open-book exam, allowing them to look at the latest documents to provide accurate, up-to-date answers without needing expensive retraining.",
    imagePrompt: "A futuristic library where some shelves are dusty and broken while a bright holographic scanner is reading fresh, glowing scrolls.",
    visualType: 'comparison',
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600",
    explainerImageUrl: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&q=80&w=1600"
  },
  {
    title: "The RAG Pipeline Architecture",
    subtitle: "From raw data to intelligent answers",
    content: [
      "Load: Ingesting PDFs, Docs, APIs",
      "Split: Breaking data into manageable chunks",
      "Embed: Converting text to vector math",
      "Store: Saving in Vector Databases",
      "Retrieve: Finding relevant chunks",
      "Generate: Producing the final response"
    ],
    explanation: "The RAG process follows a clear path: first, we load and split our data into chunks. These chunks are converted into numerical embeddings and stored in a vector database. When a user asks a question, we retrieve the most relevant chunks and feed them to the LLM to generate a grounded answer.",
    imagePrompt: "A clean, modern technical flowchart showing data moving through stages.",
    visualType: 'flowchart',
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600",
    explainerImageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc4b?auto=format&fit=crop&q=80&w=1600"
  },
  {
    title: "Vector Embeddings & Search",
    subtitle: "Understanding text as geometric points",
    content: [
      "Semantic meaning vs keyword matching",
      "High-dimensional space (1536+ dimensions)",
      "Cosine Similarity & Euclidean distance",
      "Turning 'Apple' the fruit vs 'Apple' the tech company"
    ],
    explanation: "Embeddings are the magic behind RAG. They transform words into coordinates in a high-dimensional space. Words with similar meanings are physically close to each other. This allows the computer to understand that 'King' and 'Queen' are related, even if the words don't look the same.",
    imagePrompt: "A 3D visualization of a galaxy-like star field.",
    visualType: 'diagram',
    imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1600",
    explainerImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600"
  },
  {
    title: "Vector Databases",
    subtitle: "The long-term memory for your AI",
    content: [
      "Pinecone: Scalable managed cloud",
      "Chroma & Milvus: Open-source powerhouses",
      "Weaviate: Multi-modal capabilities",
      "Efficient indexing (HNSW, IVF)"
    ],
    explanation: "Standard databases search for exact matches, but Vector Databases search for 'meaning'. They are optimized to find the nearest neighbors in a sea of millions of vectors in milliseconds, acting as the long-term memory for your RAG applications.",
    imagePrompt: "A high-tech digital vault with glowing honeycomb structures representing vector storage, deep blue and teal lighting.",
    visualType: 'hero',
    imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=1600",
    explainerImageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1600"
  },
  {
    title: "Retrieval Strategies",
    subtitle: "Finding the needle in the haystack",
    content: [
      "Similarity Search",
      "Hybrid Search (Keyword + Semantic)",
      "Reranking: Sorting for maximum relevance",
      "Context Window management"
    ],
    explanation: "Not all retrieved data is useful. Advanced RAG uses retrieval strategies like Hybrid Search to combine keyword matching with semantic understanding, and Reranking to ensure the most important information is placed at the top for the LLM to see first.",
    imagePrompt: "A digital magnifying glass hovering over a sea of data.",
    visualType: 'diagram',
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1600",
    explainerImageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1600"
  },
  {
    title: "The Generation Phase",
    subtitle: "Prompt engineering with context",
    content: [
      "System Prompting",
      "Context Injection",
      "Source Attribution",
      "Grounded Output"
    ],
    explanation: "In the final step, we combine the user's query with the retrieved documents. We tell the LLM: 'Using only the following information, answer the user's question.' This ensures the output is grounded in facts rather than training-set hallucinations.",
    imagePrompt: "An LLM interface showing a user query and cited answer.",
    visualType: 'flowchart',
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1600",
    explainerImageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1600"
  },
  {
    title: "Advanced RAG Techniques",
    subtitle: "Pushing the boundaries of performance",
    content: [
      "Query Expansion: Rewriting user questions",
      "HyDE: Hypothetical Document Embeddings",
      "Agentic RAG: Multi-step reasoning",
      "Self-Correction & Evaluation"
    ],
    explanation: "To handle complex questions, advanced RAG uses techniques like Query Expansion to rephrase vague queries and Agentic RAG where the AI can decide which tools or databases to search, leading to much more sophisticated and reliable systems.",
    imagePrompt: "A complex web of interconnected AI agents.",
    visualType: 'hero',
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1600",
    explainerImageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1600"
  },
];


