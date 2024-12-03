import React, { useEffect, useRef } from "react";

const GoogleTranslate = () => {
  const googleTranslateRef = useRef(null);

  useEffect(() => {
    // Define the callback function BEFORE loading the script
    window.googleTranslateElementInit = () => {
      if (googleTranslateRef.current) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages:
            "en,zh-CN,hi,es,ar,ru,bn,pt,id,fr",
            layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
          },
          googleTranslateRef.current
        );
      }
    };

    // Dynamically load the Google Translate script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);

    return () => {
      // Cleanup the script when the component unmounts
      const scriptElement = document.querySelector(
        'script[src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]'
      );
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
      delete window.googleTranslateElementInit;
    };
  }, []);

  return <div ref={googleTranslateRef}></div>;
};

export default GoogleTranslate;