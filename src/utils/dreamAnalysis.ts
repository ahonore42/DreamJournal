export const detectDreamSigns = (transcription: string): string[] => {
  const commonDreamSigns = [
    "flying",
    "falling",
    "dead person",
    "animals",
    "water",
    "fire",
    "being chased",
    "teeth falling",
    "naked",
    "late for exam",
    "lost",
    "can't run",
    "phone not working",
    "impossible architecture",
    "deceased relative",
    "childhood home",
    "school",
    "work",
    "floating",
    "infinite",
    "strange doors",
    "mirrors",
    "text changing",
  ];

  const detectedSigns: string[] = [];
  const lowerTranscription = transcription.toLowerCase();

  commonDreamSigns.forEach((sign) => {
    if (lowerTranscription.includes(sign)) {
      detectedSigns.push(sign);
    }
  });

  return detectedSigns;
};

export const suggestRealityChecks = (dreamSigns: string[]): string[] => {
  const realityCheckMap: { [key: string]: string } = {
    flying: "Try to fly by jumping up",
    teeth: "Count your teeth in a mirror",
    hands: "Look at your hands - count fingers",
    text: "Read text twice - does it stay the same?",
    mirrors: "Look in a mirror - does your reflection look normal?",
    time: "Check a clock twice - does time make sense?",
    lights: "Try turning lights on/off - do they work normally?",
    doors: "Pay attention to doorways and passages",
  };

  const suggestions: string[] = [];

  dreamSigns.forEach((sign) => {
    Object.keys(realityCheckMap).forEach((key) => {
      if (sign.includes(key) && !suggestions.includes(realityCheckMap[key])) {
        suggestions.push(realityCheckMap[key]);
      }
    });
  });

  // Always include basic reality checks
  if (suggestions.length === 0) {
    suggestions.push(
      "Look at your hands - count your fingers",
      "Read text twice - does it change?",
      "Check a digital clock twice",
    );
  }

  return suggestions.slice(0, 3); // Limit to 3 suggestions
};

export const analyzeDreamClarity = (transcription: string): number => {
  // Simple algorithm to assess dream clarity based on detail level
  const words = transcription.split(" ").length;
  const detailWords = ["color", "texture", "sound", "feeling", "emotion", "detail", "vivid"];
  const detailCount = detailWords.reduce((count, word) => {
    return count + (transcription.toLowerCase().includes(word) ? 1 : 0);
  }, 0);

  // Basic scoring: longer descriptions with detail words = higher clarity
  let clarity = Math.min(10, Math.floor(words / 20 + detailCount * 2));
  return Math.max(1, clarity);
};

export const detectLucidityLevel = (transcription: string): number => {
  const lucidityIndicators = [
    "realized",
    "aware",
    "lucid",
    "control",
    "knew i was dreaming",
    "conscious",
    "decided",
    "chose",
    "willed",
    "intentionally",
  ];

  const lowerTranscription = transcription.toLowerCase();
  const lucidCount = lucidityIndicators.reduce((count, indicator) => {
    return count + (lowerTranscription.includes(indicator) ? 1 : 0);
  }, 0);

  return Math.min(10, lucidCount * 2);
};
