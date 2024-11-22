import { useState } from 'react';

function App() {
  const [apiInput, setApiInput] = useState('{"data":["L","22","h","5","U","444","i","S","1"]}');
  const [selectedFilters, setSelectedFilters] = useState(['all']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      JSON.parse(apiInput);
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
    } finally {
      setIsLoading(false);
    }
  };

  const filterOptions = [
    { value: 'all', label: 'Show All' },
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest-lowercase', label: 'Highest lowercase alphabet' },
  ];

  const handleFilterChange = (value) => {
    setSelectedFilters(prev => {
      if (value === 'all') {
        return ['all'];
      }
      const newFilters = prev.includes(value)
        ? prev.filter(f => f !== value)
        : [...prev.filter(f => f !== 'all'), value];
      return newFilters.length ? newFilters : ['all'];
    });
  };

  const getFilteredResponse = () => {
    if (!responseData) return null;

    if (selectedFilters.includes('all')) {
      return JSON.stringify(responseData, null, 2);
    }

    let result = {};
    if (selectedFilters.includes('alphabets')) {
      result.alphabets = responseData.alphabets;
    }
    if (selectedFilters.includes('numbers')) {
      result.numbers = responseData.numbers;
    }
    if (selectedFilters.includes('highest-lowercase')) {
      result.highest_lowercase_alphabet = responseData.highest_lowercase_alphabet;
    }

    return JSON.stringify(result, null, 2);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-3xl font-bold text-center text-blue-400">BFHL API Tester</h1>
        
        <div className="space-y-4 bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="space-y-2">
            <label htmlFor="api-input" className="block text-sm font-medium text-gray-300">
              API Input
            </label>
            <textarea
              id="api-input"
              value={apiInput}
              onChange={(e) => setApiInput(e.target.value)}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-md font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errorMessage ? 'border-red-500' : 'border-gray-600'
              }`}
              rows={4}
            />
            {errorMessage && <p className="text-red-400 text-sm mt-1">{errorMessage}</p>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {responseData && (
          <div className="space-y-6 bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="relative">
              <div
                className="flex items-center justify-between border border-gray-700 rounded-md p-3 bg-gray-700 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Multi Filter</span>
                  <div className="flex flex-wrap items-center gap-1">
                    {selectedFilters.map(filter => (
                      <span key={filter} className="text-xs bg-gray-600 rounded px-2 py-1">
                        {filterOptions.find(option => option.value === filter).label}
                      </span>
                    ))}
                  </div>
                </div>
                <span className={`text-sm transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
              </div>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg">
                  {filterOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`px-4 py-2 hover:bg-gray-600 cursor-pointer transition-colors duration-150 ${
                        selectedFilters.includes(option.value) ? 'bg-gray-600' : ''
                      }`}
                      onClick={() => handleFilterChange(option.value)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFilters.includes(option.value)}
                        onChange={() => {}}
                        className="mr-2"
                      />
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-blue-400">Filtered Response</h2>
              <pre className="bg-gray-700 p-4 rounded-md text-sm overflow-auto max-h-60 whitespace-pre-wrap break-words">
                {getFilteredResponse()}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

