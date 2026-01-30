import { IDTO } from './interfaces/Interfaces.js';
import { stringifyValue } from './utils.js';

// React is loaded globally via UMD script in index.html
declare const React: {
  useState: <S>(initialState: S | (() => S)) => [S, (newState: S | ((prev: S) => S)) => void];
  useEffect: (effect: () => void | (() => void), deps?: any[]) => void;
  useRef: <T>(initialValue: T) => { current: T };
  createElement: (type: any, props: any, ...children: any[]) => any;
  CSSProperties: any;
};

interface ConnectionStatus {
  text: string;
  connected: boolean;
}

type CSSProperties = {
  [key: string]: string | number | undefined;
};

const App = () => {
  const [status, setStatus] = React.useState<ConnectionStatus>({
    text: 'connecting...',
    connected: false,
  });
  const [payloadMap, setPayloadMap] = React.useState<Map<string, IDTO>>(new Map());
  const socketRef = React.useRef<WebSocket | null>(null);

  React.useEffect(() => {
    const wsUrl = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.addEventListener('open', () => {
      setStatus({ text: 'connected', connected: true });
    });

    socket.addEventListener('close', () => {
      setStatus({ text: 'disconnected', connected: false });
    });

    socket.addEventListener('error', () => {
      setStatus({ text: 'error', connected: false });
    });

    socket.addEventListener('message', ({ data }: { data: string }) => {
      try {
        const { payload } = JSON.parse(data);
        if (payload) {
          mergePayload(payload);
        }
      } catch {
        // ignore invalid messages
      }
    });

    // Keyboard shortcut to log payload map
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'm') {
        console.log('MAP: ', payloadMap);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      socket.close();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const mergePayload = (payload: IDTO[] | Record<string, any>): void => {
    if (!payload) return;

    setPayloadMap((prevMap) => {
      const newMap = new Map(prevMap);

      // Convert object to array format for backwards compatibility
      let entries: IDTO[];
      if (Array.isArray(payload)) {
        entries = payload;
      } else {
        // Convert { mode: "FREE_SPINS", multiplier: 5 } to [{ name: "mode", value: "FREE_SPINS" }, ...]
        entries = Object.entries(payload).map(([name, value]) => ({ name, value }));
      }

      for (const entry of entries) {
        const { name, refresh } = entry;

        if (refresh) {
          newMap.clear();
          continue;
        }

        if (name) {
          newMap.set(name, entry);
        }
      }

      return newMap;
    });
  };

  const entries = Array.from(payloadMap.entries());
  const hasData = entries.length > 0;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>React Bridge Viewer</h1>
      <div
        style={{
          ...styles.status,
          color: status.connected ? '#7cf4c7' : '#ff9090',
        }}
      >
        Status: {status.text}
      </div>
      <div style={styles.content}>
        {hasData ? (
          entries.map(([key, entry]) => {
            const displayValue = Object.prototype.hasOwnProperty.call(entry, 'value')
              ? entry.value
              : entry;
            
            // Parse custom text styles if provided
            let customStyle: CSSProperties = {};
            if (entry.textStyle) {
              try {
                const parsedStyle = typeof entry.textStyle === 'string' 
                  ? JSON.parse(entry.textStyle) 
                  : entry.textStyle;
                
                customStyle = {
                  color: parsedStyle.fill ? `#${parsedStyle.fill.toString(16).padStart(6, '0')}` : undefined,
                  fontSize: parsedStyle.fontSize ? `${parsedStyle.fontSize}px` : undefined,
                  fontFamily: parsedStyle.fontFamily,
                  fontWeight: parsedStyle.fontWeight,
                };
              } catch {
                // Use default style if parsing fails
              }
            }

            return (
              <div key={key} style={{ ...styles.value, ...customStyle }}>
                {key}: {stringifyValue(displayValue)}
              </div>
            );
          })
        ) : (
          <div style={styles.value}>No payload received yet</div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: '20px',
    backgroundColor: '#0b0f1a',
    minHeight: '100vh',
    color: '#c7d2f0',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '42px',
    lineHeight: '32px',
    fontWeight: 'bold',
    color: '#aaaaaa',
    margin: '16px 0',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
  },
  status: {
    fontSize: '17px',
    marginBottom: '20px',
  },
  content: {
    marginTop: '34px',
  },
  value: {
    fontSize: '36px',
    marginBottom: '5px',
    color: '#c7d2f0',
  },
};

export default App;
