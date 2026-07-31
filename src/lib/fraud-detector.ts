export class FraudDetector {
  /**
   * Analyzes user registration data and returns a fraud score from 0 to 100.
   * Higher score means higher probability of being fraud/spam.
   */
  static analyze(data: { name: string; email: string; whatsapp: string; city: string; state: string }): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // 1. Check for Disposable / Temp Emails (Heuristics Blacklist)
    const disposableDomains = [
      "tempmail.com", "guerrillamail.com", "10minutemail.com", "mailinator.com",
      "yopmail.com", "trashmail.com", "dispostable.com"
    ];
    const emailDomain = data.email.split("@")[1]?.toLowerCase();
    if (disposableDomains.includes(emailDomain)) {
      score += 60; // Very high signal of spam
      reasons.push("Disposable email domain detected");
    }

    // 2. Suspicious Phone Number Patterns (e.g., all same digits or simple sequence)
    const phone = data.whatsapp.replace(/\D/g, ""); // strip non-digits
    if (phone.length < 10) {
      score += 20;
      reasons.push("Invalid phone number length");
    }
    // Check for repetitive digits (e.g., 9999999999)
    if (/^(\d)\1{7,}$/.test(phone)) {
      score += 50;
      reasons.push("Suspicious repeating digits in phone number");
    }
    // Check for simple sequences (e.g., 1234567890)
    if (phone.includes("12345678") || phone.includes("09876543")) {
      score += 50;
      reasons.push("Sequential digits in phone number");
    }

    // 3. Basic NLP Gibberish Detection on Name
    // Rule: Names should not be extremely long single words without spaces
    if (data.name.length > 15 && !data.name.includes(" ")) {
      score += 30;
      reasons.push("Unusually long single-word name");
    }

    // Rule: Consonant-to-Vowel ratio to detect keyboard smashes (e.g., "asdfghjkl")
    const vowels = data.name.match(/[aeiouy]/gi);
    const consonants = data.name.match(/[bcdfghjklmnpqrstvwxz]/gi);
    
    if (consonants && consonants.length > 5) {
      const vowelCount = vowels ? vowels.length : 0;
      if (vowelCount === 0) {
        score += 80; // Definite gibberish
        reasons.push("Name contains no vowels (keyboard smash)");
      } else {
        const ratio = consonants.length / vowelCount;
        if (ratio > 5) {
          score += 40;
          reasons.push("Unnatural consonant-to-vowel ratio in name");
        }
      }
    }

    // 4. Capitalization Anomalies (bots often use ALL CAPS or all lowercase for everything)
    if (data.name === data.name.toLowerCase() && data.city === data.city.toLowerCase() && data.state === data.state.toLowerCase()) {
      score += 15;
      reasons.push("All text fields are lowercase");
    }
    if (data.name === data.name.toUpperCase() && data.name.length > 3) {
      score += 15;
      reasons.push("Name is ALL CAPS");
    }

    // Cap the score at 100 max
    score = Math.min(score, 100);

    return { score, reasons };
  }
}
