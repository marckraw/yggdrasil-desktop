export interface GenerateImageRequestArgs {
  prompt: string;
  model: string;
  debug: boolean;
  rephrase?: boolean;
}

/* 
    This is closure based service - functional replacement for class based service.
    Its using closure to create private variables and functions.
    Exports a public interface that can be used to interact with the service.
    Encapsulates the service logic and data within the factory function.
*/
const createPrimeApiService = ({
  baseUrl,
  apiKey,
}: {
  baseUrl: string;
  apiKey: string;
}) => {
  const testRequest = async () => {
    console.log("This is api key request");
    console.log(apiKey);
    return apiKey;
  };

  const chatAGI = async ({ messages }: { messages: any }) => {
    console.log("This is messages", messages);
    console.log("This is base url", baseUrl);
    console.log("This is api key", apiKey);

    const body = {
      model: {
        company: "openai",
        model: "gpt-4o-mini",
      },
      messages,
    };

    const response = await fetch(`${baseUrl}/api/ai/agi`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return response;
  };

  const generateImageRequest = async (args: GenerateImageRequestArgs) => {
    const { prompt, model, debug, rephrase } = args;

    const body = {
      prompt,
      model,
      debug,
      rephrase,
    };

    const response = await fetch(`${baseUrl}/api/images/generate`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return response;
  };

  const chatStream = async ({
    messages,
    model,
    controller,
  }: {
    messages: any;
    model: any;
    controller: any;
  }) => {
    return fetch(`${baseUrl}/api/chat/stream`, {
      method: "POST",
      body: JSON.stringify({
        model: {
          company: "openai",
          model: "gpt-4o",
        },
        messages,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
    });
  };
  // Exposed public interface
  return {
    testRequest,
    chatAGI,
    chatStream,
    generateImageRequest,
  };
};

const primeApiService = createPrimeApiService({
  baseUrl: import.meta.env.VITE_BASE_API_URL,
  apiKey: import.meta.env.VITE_PRIME_AI_API_KEY,
});
export { primeApiService };
