import App from './app-react.js';

// Use global React and ReactDOM loaded from UMD scripts
declare const React: any;
declare const ReactDOM: any;

const root = document.getElementById('app');
if (root) {
  const rootContainer = ReactDOM.createRoot(root);
  rootContainer.render(
    React.createElement(React.StrictMode, null,
      React.createElement(App, null)
    )
  );
} else {
  console.error('Root element not found');
}
