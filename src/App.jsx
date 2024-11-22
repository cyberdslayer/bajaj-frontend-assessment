import { useState } from 'react';

function App() {
  const [apiInput, setApiInput] = useState('{"data":["M","1","334","4","B","z","a"]}');
  const [filterType, setFilterType] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate JSON
      JSON.parse(apiInput);

      // Clear previous error message if the input is valid
      setErrorMessage('');

      let headersList = {
        "Content-Type": "application/json",
      };

      let bodyContent = apiInput;
      let response = await fetch("https://bajaj-backend-assessment.vercel.app/bfhl", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });

      let data = await response.json();
      setResponseData(data);
    } catch (error) {
      setResponseData(null);
      setErrorMessage('Invalid JSON input. Please check your input format.');
      console.error("Error:", error);
    }
  };

  const filterOptions = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest-lowercase', label: 'Highest lowercase alphabet' },
    { value: 'all', label: 'Show All' },
  ];

  const getFilteredResponse = () => {
    if (!responseData) return null;

    if (filterType === 'all') {
      return JSON.stringify(responseData, null, 2);
    }

    switch (filterType) {
      case 'alphabets':
        return `Alphabets: ${responseData.alphabets?.join(', ') || 'N/A'}`;
      case 'numbers':
        return `Numbers: ${responseData.numbers?.join(', ') || 'N/A'}`;
      case 'highest-lowercase':
        return `Highest Lowercase Alphabet: ${responseData.highest_lowercase_alphabet?.join(', ') || 'N/A'}`;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="space-y-2">
        <label htmlFor="api-input" className="text-sm text-gray-600">
          API Input
        </label>
        <input
          id="api-input"
          value={apiInput}
          onChange={(e) => setApiInput(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md font-mono focus:outline-none ${
            errorMessage ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
      >
        Submit
      </button>
      {
      responseData != null && <div className="space-y-4">
        <div className="relative">
          <div
            className="flex items-center justify-between border rounded-md p-2 bg-gray-50 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">Multi Filter</span>
              <div className="flex items-center gap-1 bg-gray-200 rounded px-2 py-1">
                <span className="text-sm">{filterOptions.find(option => option.value === filterType).label}</span>
              </div>
            </div>
            <span className="text-sm text-gray-500">▼</span>
          </div>
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              {filterOptions.map((option) => (
                <div
                  key={option.value}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setFilterType(option.value);
                    setIsDropdownOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {responseData && (
          <div className="space-y-2">
            <h2 className="text-sm font-medium">Filtered Response</h2>
            <pre className="bg-gray-100 p-2 rounded-md text-sm overflow-auto">
              {getFilteredResponse()}
            </pre>
          </div>
        )}
      </div>
}
    </div>
  );
}

export default App;
