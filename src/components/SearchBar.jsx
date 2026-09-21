import { useState } from "react";
import { FaMicrophone } from "react-icons/fa";
function SearchBar({ search, setSearch }) {
  const [isListening, setIsListening] = useState(false);
  const cleanVoiceSearch = (transcript) => {
    const commandWords = [
      "show me",
      "search for",
      "find me",
      "find",
      "search",
      "show",
      "look for",
      "i need",
    ];

    let cleanedText = transcript.toLowerCase().trim();

    commandWords.forEach((command) => {
      if (cleanedText.startsWith(command)) {
        cleanedText = cleanedText.replace(command, "").trim();
      }
    });

    return cleanedText;
  };
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support voice search.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      const cleanedSearch = cleanVoiceSearch(transcript);

      setSearch(cleanedSearch);
    };
    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };
  };
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-gray-900">
          Search Products
        </h2>
        <p className="text-center text-gray-500 text-base sm:text-lg mt-4 mb-8 sm:mb-12 max-w-2xl mx-auto">
          Quickly find laptops, desktops, monitors and accessories using text or
          voice search.
        </p>

        {/* Search Input */}
        <div className="flex items-stretch bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6 sm:mb-10 max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Search for laptops, monitors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-0 px-4 sm:px-6 py-4 sm:py-5 text-base sm:text-lg outline-none"
          />

          <button
            type="button"
            onClick={startListening}
            className={`text-white px-5 sm:px-8 py-4 sm:py-5 transition flex items-center justify-center ${
              isListening ? "bg-red-500" : "bg-blue-600 hover:bg-blue-700"
            }`}
            aria-label={
              isListening ? "Listening for voice search" : "Start voice search"
            }
            title={isListening ? "Listening..." : "Search using your voice"}
          >
            <FaMicrophone className="text-xl" />
          </button>
        </div>
        {isListening && (
          <p className="text-center text-sm text-red-500 font-medium -mt-3 mb-6">
            Listening... speak now
          </p>
        )}
      </div>
    </section>
  );
}

export default SearchBar;
