require('dotenv').config();


// i thnk this file is not connected to the other files
class LoanAnalyzer {
  calculateInterestRate(eligibilityScore) {
    if (eligibilityScore >= 80) return 5.5;
    if (eligibilityScore >= 70) return 6.5;
    if (eligibilityScore >= 60) return 7.5;
    if (eligibilityScore >= 50) return 8.5;
    if (eligibilityScore >= 40) return 10.0;
    return 12.0;
  }

  calculateMonthlyPayment(principal, annualRate, termInMonths) {
    const monthlyRate = annualRate / 100 / 12;
    
    if (monthlyRate === 0) {
      return principal / termInMonths;
    }

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / 
                          (Math.pow(1 + monthlyRate, termInMonths) - 1);
    
    return parseFloat(monthlyPayment.toFixed(2));
  }

  determineLoanStatus(eligibilityScore) {
    if (eligibilityScore >= 70) return 'approved';
    if (eligibilityScore >= 50) return 'pending';
    return 'rejected';
  }

  calculateTotalRepayment(principal, monthlyPayment, termInMonths) {
    return parseFloat((monthlyPayment * termInMonths).toFixed(2));
  }

  calculateTotalInterest(totalRepayment, principal) {
    return parseFloat((totalRepayment - principal).toFixed(2));
  }
}

module.exports = new LoanAnalyzer();