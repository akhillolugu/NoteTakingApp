import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [teluguText, setTeluguText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTranslation = async () => {
    setLoading(true);
    setError(null);
    const translateFrom = "te"; // Telugu
    const translateTo = "en";   // English
    const maxLength = 500;

  
    const paragraphs = teluguText.split("\n").filter((p) => p.trim() !== "");

    try {
      const translatedParagraphs = await Promise.all(
        paragraphs.map(async (paragraph) => {
          
          const chunks = paragraph.match(new RegExp(`.{1,${maxLength}}`, "g"));
          let finalTranslation = "";

          for (const chunk of chunks) {
            const response = await axios.get(
              `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
                chunk
              )}&langpair=${translateFrom}|${translateTo}`
            );
            if (response.data?.responseData) {
              finalTranslation += response.data.responseData.translatedText + " ";
            } else {
              setError("Failed to retrieve translated text");
              break;
            }
          }

          return finalTranslation.trim();
        })
      );

      // Join translated paragraphs with paragraph breaks
      setTranslatedText(translatedParagraphs.join("\n\n"));
    } catch (error) {
      setError("Error translating text: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Telugu to English Translation</h1>
      <textarea
        value={teluguText}
        onChange={(e) => setTeluguText(e.target.value)}
        placeholder="Enter Telugu text here"
      />
      <button onClick={handleTranslation} disabled={loading}>
        {loading ? "Translating..." : "Translate"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {translatedText && (
        <div>
          <h2>Translated Text</h2>
          <pre>{translatedText}</pre> {/* Use <pre> to preserve whitespace */}
        </div>
      )}
    </div>
  );
}

export default App;
