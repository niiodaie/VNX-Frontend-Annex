// Attempt to disable the Vite error overlay
// This is a workaround since we can't modify vite.config.ts directly

// Check if the environment variable is set
if (import.meta.env.VITE_DISABLE_OVERLAY === 'true') {
  // Try to access the window.__vite_plugin_react_preamble_installed__ object
  try {
    const w = window as any;
    if (w.__vite_plugin_react_preamble_installed__) {
      // Override the error overlay
      w.__vite_plugin_react_preamble_installed__.overlay = {
        // Provide empty implementations of the methods
        inject: () => {},
        update: () => {},
        remove: () => {}
      };
    }
  } catch (e) {
    console.log('Failed to disable Vite error overlay:', e);
  }
}