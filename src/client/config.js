/*
* The configuration for the expected dataset
* You can customize the present labels of your dataset here
* so they get displayed correctly in the application.
* You need to also set the appropriate names for the fields
* 'label' and 'value' according to how they are name din your dataset.
*/

const config = {
  labels: [
    'appointment', 'prescription', 'message', 'callback',
    'transfer', 'pain', 'sick', 'change', 'sicknote',
    'vaccination', 'result', 'unique', 'other'
  ],
  label: 'label',
  value: 'automatic_transcript'
};

export default config;
