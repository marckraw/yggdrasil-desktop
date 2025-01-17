export const CURRENT_BREAKPOINT_KEY = 'currentBreakpoint';

/* 
    This is closure based service - functional replacement for class based service.
    Its using closure to create private variables and functions.
    Exports a public interface that can be used to interact with the service.
    Encapsulates the service logic and data within the factory function.
*/
const createLocalStorageService = () => {
  const setItem = (key: string, value: string) => {
    localStorage.setItem(key, value);
  }

  const getItem = (key: string) => {
    return localStorage.getItem(key);
  }

  const removeItem = (key: string) => {
    return localStorage.removeItem(key);
  }
  
    // Exposed public interface
    return {
      setItem,
      getItem,
      removeItem
    };
  };
  
  const localStorageService = createLocalStorageService();
  export { localStorageService };
  
  