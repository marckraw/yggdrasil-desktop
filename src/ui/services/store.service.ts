/* 
    This is closure based service - functional replacement for class based service.
    Its using closure to create private variables and functions.
    Exports a public interface that can be used to interact with the service.
    Encapsulates the service logic and data within the factory function.
*/
const createStoreService = () => {
  const getAIResponse = () => {
    return "asdasd";
  };

  // Exposed public interface
  return {
    getAIResponse,
  };
};

const storeService = createStoreService();
export { storeService };
