import React, { useState, useEffect } from 'react';
import './app.css';
import config from './config';

const App = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [i, setIndex] = useState(0);
  const { labels, label, value } = config;

  // 1500
  const fetchData = async () => {
    const res = await fetch('/api/getDataset');
    const dataset = await res.json();

    if (dataset.error !== undefined) {
      setError(dataset.error);
    } else setData(dataset);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validRange = (number) => {
    if (number < 0) return 0;
    if (number >= data.length) return data.length - 1;
    return number;
  };

  const updateData = async () => {
    const res = await fetch('/api/updateDataset', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    });
    let dataset = await res.json();
    dataset = JSON.parse(dataset);
    if (dataset.error !== undefined) {
      setError(dataset.error);
    } else {
      setData(dataset);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };

  const handleTranscriptChange = (e) => {
    setData(data.map((item, index) => {
      if (index === i) {
        return { [value]: e.target.value, [label]: item[label] };
      }
      return item;
    }));
  };

  const handleLabelChange = (e) => {
    setData(data.map((item, index) => {
      if (index === i) {
        return { [value]: item[value], [label]: e.target.value };
      }
      return item;
    }));
  };

  const renderRadioInputs = () => labels.map(labelName => (
    <div className="labeling__radio" key={labelName}>
      <input
        type="radio"
        name={labelName}
        id={labelName}
        value={labelName}
        checked={data[i][label] === labelName}
        onChange={e => handleLabelChange(e)}
      />
      <label htmlFor={labelName}>{labelName}</label>
    </div>
  ));

  return (
    <div className="labeling__wrapper">
      <h1>JSON Labeling Tool</h1>
      {
        data !== null && error === false ? (
          <div className="labeling__content">
            <div className="labeling__transcript">
              <h2>Transcription</h2>
              <textarea
                name="transcript"
                id="transcript"
                className="labeling__datatext"
                value={data[i][value]}
                onChange={e => handleTranscriptChange(e)}
              />
            </div>
            <div className="labeling__label">
              <h2>Label</h2>
              <textarea
                name="label"
                id="label"
                className="labeling__labeltext"
                value={data[i][label]}
                onChange={e => handleLabelChange(e)}
              />
              { renderRadioInputs() }
            </div>
            <div className="labeling__menu">
              <div className="labeling__current">
                <h2>Current Message</h2>
                <span className="labeling__counter">{`${i} of ${data.length - 1}`}</span>
              </div>
              <div className="labeling__actions">
                <h2>Actions</h2>
                <div className="labeling__buttons">
                  <button
                    className="labeling__back"
                    type="button"
                    onClick={() => setIndex(validRange(i - 1))}
                  >
                    Back
                  </button>
                  <button
                    className="labeling__next"
                    type="button"
                    onClick={() => setIndex(validRange(i + 1))}
                  >
                    Next
                  </button>
                  <button
                    className="labeling__save"
                    type="button"
                    onClick={() => updateData()}
                  >
                    Save
                  </button>
                </div>
                <div className="labeling__success">
                  {
                    success ? (
                      <span>Dataset successfully saved!</span>
                    ) : null
                  }
                </div>
              </div>
              <div className="labeling__navigation">
                <h2>Navigate</h2>
                <input
                  id="nav-index"
                  name="nav-index"
                  type="number"
                  value={i}
                  onChange={e => setIndex(validRange(parseInt(e.target.value, 10) || 0))}
                />
              </div>
            </div>
          </div>
        ) : null
      }
      {
        data === null && error === false ? (
          <div className="labeling__loading">Loading data...</div>
        ) : null
      }
      {
        error !== false ? (
          <div className="labeling__error">{`Error: ${error}`}</div>
        ) : null
      }
    </div>
  );
};

export default App;
