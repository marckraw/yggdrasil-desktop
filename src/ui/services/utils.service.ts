/* 
    This is closure based service - functional replacement for class based service.
    Its using closure to create private variables and functions.
    Exports a public interface that can be used to interact with the service.
    Encapsulates the service logic and data within the factory function.
*/
const createUtilsService = () => {
  const isEmpty = (obj: any) => {
    if (!obj) return true;
    return Object.keys(obj).length === 0;
  }

    // Exposed public interface
    return {
      isEmpty
    };
  };
  
  const utilsService = createUtilsService();
  export { utilsService };
  
  