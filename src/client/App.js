import React, { useState, useEffect } from 'react';
import './app.css';
import config from './config';

const App = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [i, setIndex] = useState(0);
  const [togglePopup, setPopup] = useState(false);
  const { labels, label, value } = config;

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

  const deleteCurrentField = () => {
    setData(data.filter((item, index) => index !== i));
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

  const closePopup = (deleteItem = false) => {
    if (deleteItem) deleteCurrentField();
    setPopup(false);
  };

  return (
    <div className="labeling__wrapper">
      <h1>Keep on labeling!</h1>

      {
      togglePopup ? (
        <div className="labeling__popup">
          <div className="labeling__popupInner">
            <h3>Deleting field!</h3>
            <p>
              Are you sure you want to delete the current field?
            </p>
            <p>Current data:</p>
            <ul>
              <li>
                <span>Index: </span>
                {i}
              </li>
              <li>
                <span>Value: </span>
                {data[i][value].substring(0, 40)}
                {data[i][value].length > 40 ? '...' : null}
              </li>
              <li>
                <span>Label: </span>
                {data[i][label]}
              </li>
            </ul>
            <button
              type="button"
              className="labeling__button labeling__button--popup"
              onClick={() => closePopup()}
            >
              Cancel
            </button>
            <button
              type="button"
              className="labeling__button labeling__button--popup labeling__button--delete"
              onClick={() => closePopup(true)}
            >
              Delete
            </button>
          </div>
        </div>

      )
        : null
       }

      {
        data !== null && error === false ? (
          <div className="labeling__content">
            <div className="labeling__transcript">
              <h2>Current value</h2>
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
                <h2>Current item</h2>
                <span className="labeling__counter">{`${i} of ${data.length - 1}`}</span>
              </div>
              <div className="labeling__actions">
                <h2>Actions</h2>
                <div className="labeling__buttons">
                  <div className="labeling__buttonRow">
                    <button
                      className="labeling__button"
                      type="button"
                      onClick={() => setIndex(validRange(i - 1))}
                    >
                      Back
                    </button>
                    <button
                      className="labeling__button"
                      type="button"
                      onClick={() => setIndex(validRange(i + 1))}
                    >
                      Next
                    </button>

                  </div>
                  <div className="labeling__buttonRow">
                    <button
                      className="labeling__button labeling__button--delete"
                      type="button"
                      onClick={() => setPopup(true)}
                    >
                      Delete
                    </button>
                    <button
                      className="labeling__button labeling__button--save"
                      type="button"
                      onClick={() => updateData()}
                    >
                      Save
                    </button>

                  </div>
                </div>
                <div className="labeling__success">
                  {
                    success ? (
                      <span>Dataset saved!</span>
                    ) : null
                  }
                </div>
              </div>
              <div className="labeling__navigation">
                <h2>Navigation</h2>
                <input
                  id="nav-index"
                  name="nav-index"
                  type="number"
                  value={i.toString()}
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
