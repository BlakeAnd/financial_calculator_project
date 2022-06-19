let ages = [];

var investment_value = null;
let pretax_portfolio_values = [];

let distribution_from_portfolio = null;
let distributions = [];
let total_distributions = []

let initial_soc_security = null;
let social_securities = [];

let required_min_distributions = [0];

let single = null;

let taxable_income = [];
let ss_taxable_portions = [];

let total_taxes_paid = [];

let after_tax_investments = [];

let cumulative_after_tax_values = [];

let portfolio_income = [];



let single_ss_brackets = [25000, 34000];
let married_ss_brackets = [32000, 44000];

let life_expectancy_factor = [25.6, 24.7, 23.8, 22.9, 22, 21.2, 20.3, 19.5, 18.7, 17.9, 17.1, 16.3, 15.5, 14.8, 14.1, 13.4, 12.7, 12, 11.4, 10.8, 10.2, 9.6, 9.1, 8.6, 8.1, 7.6, 7.1, 6.7, 6.3, 5.9, 5.5, 5.2, 4.9, 4.5, 4.2, 3.9, 3.7, 3.4, 3.1]; //fill in values


let single_brackets = {
  lower_limits: [0, 9950, 40525, 86375, 164925, 209425, 523600],
  tax_rate: [.05, .07, .17, .19, .27, .30, .32],
  cumulative_tax: [0, 497.50, 2637.75, 10432.25, 25356.75, 37371.75, 131624.25]
}
let married_brackets = {
  lower_limits: [0, 19900, 81050, 172750, 329850, 418850, 628300],
  tax_rate: [.05, .07, .17, .19, .27, .30, .32],
  cumulative_tax: [0, 995, 5275.50, 20864.50, 50713.50, 74743.50, 137578.50]
}

let max_age = 97;



var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
yyyy = parseInt(yyyy)
yyyy = yyyy - (max_age - 1);
yyyy = yyyy.toString();
let min_birthdate = yyyy + '-' + mm + '-' + dd;
console.log(min_birthdate);

document.getElementById("birthdate").min = min_birthdate;

let myChart = new Chart(
  document.getElementById("myChart")
)
let myChart2 = new Chart(
  document.getElementById("myChart2")

)

function main (e) {
  e.preventDefault();

  // if(myChart != null){
  //   myChart.destroy();
  // }  
  // if(myChart2 != null){
  //   myChart2.destroy();
  // }
rate_of_return = document.getElementById("ror").value;
inflation_rate = document.getElementById("inflation").value;
birthday = document.getElementById("birthdate").value;

ages = [];

investment_value = document.getElementById("investmentvalue").value;
investment_value = parseFloat(investment_value);
pretax_portfolio_values = [investment_value];

distribution_from_portfolio = document.getElementById("distribution-from-portfolio").value;
distribution_from_portfolio = parseFloat(distribution_from_portfolio);
distributions = [distribution_from_portfolio];
total_distributions = [distribution_from_portfolio]

initial_soc_security = document.getElementById("distribution-from-ss").value;
initial_soc_security = parseFloat(initial_soc_security);
social_securities = [initial_soc_security];

required_min_distributions = [0];

single = document.getElementById("single").options[document.getElementById("single").selectedIndex].value;
if(single === "single"){
  single = true;
}
else{
  single = false;
}


taxable_income = [];
ss_taxable_portions = [];

total_taxes_paid = [];

after_tax_investments = [];

cumulative_after_tax_values = [];

portfolio_income = [distribution_from_portfolio];

  myChart.destroy();
  myChart2.destroy();

  rate_of_return = convertPercent(rate_of_return);
  inflation_rate = convertPercent(inflation_rate);
  console.log(rate_of_return, inflation_rate)

  let age = calculateAge();
  console.log(age);
  // checkInputs();

  console.log(rate_of_return, inflation_rate, birthday, age, investment_value, distribution_from_portfolio, initial_soc_security, single);

    makeCalculations(age);
  
}

// function checkInputs () {
//   if(birthday === null || investment_value === null || ){

//   }
// }

function calculateAge () {
  birthday = new Date(birthday);
    // document.getElementById("birthdate").value);
  console.log("bday", birthday);
  
  let age = today.getFullYear() - birthday.getFullYear();
  var m = today.getMonth() - birthday.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
  }
  return age;
}

function makeCalculations (age) {
  for(let i = age; i <= max_age; i++){
    ages.push(i);
  }

  for(let i = 1; i < ages.length; i++){
    portfolio_income.push(portfolio_income[i-1] * inflation_rate)
  }
  console.log(ages.length, portfolio_income);
    

    for(let i = 1; i <= max_age-age; i++){
      distributions.push(distributions[i-1]*(inflation_rate));
      social_securities.push(social_securities[i-1]*(inflation_rate));
    }

    for(let i = 1; i <= max_age-age; i++){
      if(i <= 72 - age){
        // pretax_values.push(distributions[i-1]*(inflation_rate));
        required_min_distributions.push(0);
      }
      else{
        // console.log(i, (i-(70-age)), life_expectancy_factor[i-(70-age)]);
        required_min_distributions.push((pretax_portfolio_values[i-1]*rate_of_return)/life_expectancy_factor[i-(70-age)]);
      }

      total_distributions.push(distributions[i] + required_min_distributions[i])

      pretax_portfolio_values.push((pretax_portfolio_values[i - 1]*rate_of_return) - total_distributions[i]);
    } 

    for(let i = 0; i <= max_age-age; i++){
      taxable_income.push(total_distributions[i] + social_securities[i]);
    }

    let ss_brackets = [];
    if(single === true){
      ss_brackets = single_ss_brackets;
    }
    else{
      ss_brackets = married_ss_brackets;
    }
    for(let i = 0; i <=97-age; i++){
      if(taxable_income[i] < ss_brackets[0]){
        ss_taxable_portions.push(0);
      }
      else if(taxable_income[i] < ss_brackets[1]){
        ss_taxable_portions.push(social_securities[i]*0.5)
      }
      else{
        ss_taxable_portions.push(social_securities[i]*0.85)
      }
    }
    // console.log(ss_taxable_portions);

    if(single === true){
      createTotalTaxPaid(single_brackets);
    }
    else{
      createTotalTaxPaid(married_brackets);
    }

    console.log(total_taxes_paid);

    for(let i = 0; i <= max_age-age; i++){
      if(required_min_distributions[i] <= total_taxes_paid[i]){
        after_tax_investments.push(0);
      }
      else{
        after_tax_investments.push((required_min_distributions[i] - total_taxes_paid[i]) * rate_of_return);
      }
      // console.log(i, after_tax_investments[i])
    }

    cumulative_after_tax_values.push(after_tax_investments[0])
    for(let i = 1; i <= max_age - age; i++){
      cumulative_after_tax_values.push(cumulative_after_tax_values[i-1] + after_tax_investments[i])
    }
    // console.log(cumulative_after_tax_values);

    

    // console.log(required_min_distributions.length)
    // console.log(total_taxes_paid.length)
    // console.log(after_tax_investments.length)
    // console.log(pretax_portfolio_values.length)
    // console.log(distributions.length)
    // console.log(total_distributions.length)
    // console.log(social_securities.length)
    // console.log(taxable_income.length)
    // console.log(ss_taxable_portions.length)
    // console.log(life_expectancy_factor.length)

    function  createTotalTaxPaid (bracket) {
      for(let i = 0; i <= max_age-age; i++){
        let lookup_value = total_distributions[i] + ss_taxable_portions[i];
        let total_tax = lookUpAndSum(bracket, lookup_value);
        total_taxes_paid.push(total_tax);
      }
    }

    

    function lookUpAndSum (bracket, value){
      let index = lookUp(bracket.lower_limits, value);
      let lowlimit_val = value - bracket.lower_limits[index];
      let tax_rate_val = bracket.tax_rate[index];
      let cumulativetax_val = bracket.cumulative_tax[index];
      let return_val = cumulativetax_val + lowlimit_val * tax_rate_val;
      return return_val; 
    }

    function lookUp (array, value) {
      for(let i = 0; i < array.length; i++){
        if(array[i] > value){
          return i-1;
        }
      }
    }


    const labels = ages;
  
    const data = {
      labels: labels,
      datasets: 
      [
        {
        label: 'Social Security',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: social_securities,
      }, 
      {
        label: 'Portfolio Income',
        backgroundColor: 'yellow',
        borderColor: 'yellow',
        data: portfolio_income,
      },
      {
        label: 'Required Minimum Distribution',
        backgroundColor: 'blue',
        borderColor: 'blue',
        data: required_min_distributions,
      },

    
    ]
    };
  
    const config = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      }
    };

    myChart = new Chart (
      document.getElementById('myChart'),
      config
    )

    const labels2 = ages;
  
    const data2 = {
      labels: labels,
      datasets: 
      [
        {
        label: 'Cumulative After Tax Value',
        backgroundColor: 'orange',
        borderColor: 'orange',
        data: cumulative_after_tax_values,
      }, 
      {
        label: 'Pretax Portfolio Value',
        backgroundColor: 'green',
        borderColor: 'green',
        data: pretax_portfolio_values,
      },
    ]
    };
  
    const config2 = {
      type: 'bar',
      data: data2,
      options: {
        responsive: true
      }
    };

    myChart2 = new Chart (
      document.getElementById('myChart2'),
      config2
    )



    // console.log(pretax_portfolio_values)
    // console.log(required_min_distributions)
    // console.log(total_distributions)

// if(single){
//   if(F12<25000){
//     0
//   }
//   else if(F12<34000){
//     E12*0.5
//   }
//   else{
//     E12*0.85
//   }
// }
// else {
//   if(F12<32000){
//     0
//   }
//   else if(F12<44000){
//       E12*0.5
//     }
//   else{
//       E12*0.85
//   }
// }

  }

  function convertPercent (number) {
    number = number / 100;
    number = 1 + number;
    return number;
  }
