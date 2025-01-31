interface Window {
  electron: {
    onSelectedText: (callback: (text: string) => void) => void;
    openUrl: (url: string) => Promise<void>;
  };
}
