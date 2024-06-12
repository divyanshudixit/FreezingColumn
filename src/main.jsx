import React, { useState } from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import BaseTable, { Column } from 'https://esm.sh/react-base-table@1.11.0';

const generateColumns = (num) => {
  return Array.from({ length: num }, (v, i) => ({
    key: `col${i}`,
    title: `Column ${i}`,
    dataKey: `col${i}`,
    width: 150,
  }));
};

const generateData = (columns, numRows, idPrefix = 'row-') => {
  return Array.from({ length: numRows }, (v, i) => {
    const row = { id: `${idPrefix}${i}` };
    columns.forEach((col) => {
      row[col.dataKey] = `${col.title} - ${i}`;
    });
    return row;
  });
};

const freezeColumns = (columns, freezeLeftCount, freezeRightCount) => {
  return columns.map((column, index) => {
    let frozen = null;
    if (index < freezeLeftCount) {
      frozen = Column.FrozenDirection.LEFT;
    } else if (index >= columns.length - freezeRightCount) {
      frozen = Column.FrozenDirection.RIGHT;
    }
    return { ...column, frozen };
  });
};

const Snackbar = ({ message, onClose }) => (
  <div style={{ 
    position: 'fixed', 
    bottom: '10px', 
    left: '50%', 
    transform: 'translateX(-50%)', 
    backgroundColor: '#323232', 
    color: 'white', 
    padding: '10px 20px', 
    borderRadius: '5px', 
    zIndex: 1000 
  }}>
    {message}
    <button onClick={onClose} style={{ marginLeft: '20px', color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>
      Close
    </button>
  </div>
);

const columns = generateColumns(10);
const data = generateData(columns, 200);

const App = () => {
  const [freezeLeftCount, setFreezeLeftCount] = useState(2);
  const [freezeRightCount, setFreezeRightCount] = useState(2);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleLeftChange = (e) => {
    const value = Number(e.target.value);
    if (value + freezeRightCount > columns.length - 2) {
      setSnackbarMessage('Cannot freeze more columns. Please decrease the left or right freeze count.');
      setShowSnackbar(true);
    } else {
      setFreezeLeftCount(value);
      setShowSnackbar(false);
    }
  };

  const handleRightChange = (e) => {
    const value = Number(e.target.value);
    if (freezeLeftCount + value > columns.length - 2) {
      setSnackbarMessage('Cannot show Frozen property, Decrease left or right count.');
      setShowSnackbar(true);
    } else {
      setFreezeRightCount(value);
      setShowSnackbar(false);
    }
  };

  const fixedColumns = freezeColumns(columns, freezeLeftCount, freezeRightCount);

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Freeze Left Columns:
          <input
            type="number"
            value={freezeLeftCount}
            onChange={handleLeftChange}
            min="0"
            max={columns.length - freezeRightCount}
            style={{ marginLeft: '10px', marginRight: '20px' }}
          />
        </label>
        <label>
          Freeze Right Columns:
          <input
            type="number"
            value={freezeRightCount}
            onChange={handleRightChange}
            min="0"
            max={columns.length - freezeLeftCount}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <div style={{ width: '100%', height: '80vh', overflowX: 'auto' }}>
        <BaseTable
          fixed
          columns={fixedColumns}
          data={data}
          width={1300}
          height={600}
          rowKey="id"
        />
      </div>
      {showSnackbar && (
        <Snackbar 
          message={snackbarMessage} 
          onClose={() => setShowSnackbar(false)} 
        />
      )}
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
