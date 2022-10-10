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

let average_annual_taxes = null;

let cumulative_taxes_paid = null;

let after_tax_value = null;

let tax_change = null;

let extra_distribution = null;

let extra_distributions = [];

let extra_taxable_income = [];

let extra_distribution_taxes = [];

let difference_for_extra_distribution_taxes = [];

let extra_after_tax_portion = [];

let single_ss_brackets = [25000, 34000];
let married_ss_brackets = [32000, 44000];

let life_expectancy_factor = [25.6, 24.7, 23.8, 22.9, 22, 21.2, 20.3, 19.5, 18.7, 17.9, 17.1, 16.3, 15.5, 14.8, 14.1, 13.4, 12.7, 12, 11.4, 10.8, 10.2, 9.6, 9.1, 8.6, 8.1, 7.6, 7.1, 6.7, 6.3, 5.9, 5.5, 5.2, 4.9, 4.5, 4.2, 3.9, 3.7, 3.4, 3.1]; //fill in values


let single_brackets = {
  lower_limits: [0, 9950, 40525, 86375, 164925, 209425, 523600],
  tax_rate: [.1, .12, .22, .24, .32, .35, .37],
  cumulative_tax: [0, 497.50, 2637.75, 10432.25, 25356.75, 37371.75, 131624.25]
}
let married_brackets = {
  lower_limits: [0, 19900, 81050, 172750, 329850, 418850, 628300],
  tax_rate: [.1, .12, .22, .24, .32, .35, .37],
  cumulative_tax: [0, 995, 5275.50, 20864.50, 50713.50, 74743.50, 137578.50]
}

let max_age = 100;

let calc_single_brackets = null;
let calc_married_brackets = null;



var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
yyyy = parseInt(yyyy)
yyyy = yyyy - (max_age - 1);
yyyy = yyyy.toString();
let min_birthdate = yyyy + '-' + mm + '-' + dd;
// console.log(min_birthdate);

document.getElementById("birthdate").min = min_birthdate;

let myChart = new Chart(
  document.getElementById("myChart")
)
let myChart2 = new Chart(
  document.getElementById("myChart2")

)

function main (e) {
  e.preventDefault();

  document.body.style.overflowY = "scroll";

  // if(myChart != null){
  //   myChart.destroy();
  // }  
  // if(myChart2 != null){
  //   myChart2.destroy();
  // }
rate_of_return = document.getElementById("ror").value;
inflation_rate = document.getElementById("inflation").value;
tax_change = document.getElementById("tax_change").value;
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

extra_distribution = document.getElementById("extra-distribution").value;
extra_distribution = parseFloat(extra_distribution);

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
  tax_change = tax_change / 100;
  // console.log("tax change", tax_change)
  // console.log(rate_of_return, inflation_rate)

  calc_single_brackets = JSON.parse(JSON.stringify(single_brackets));
  calc_married_brackets = JSON.parse(JSON.stringify(married_brackets));

  // calc_single_brackets.tax_rate = single_brackets.tax_rate;
  // calc_married_brackets.tax_rate = married_brackets.tax_rate;
  calc_single_brackets.tax_rate = adjustTaxBrackets(calc_single_brackets.tax_rate);
  calc_married_brackets.tax_rate = adjustTaxBrackets(calc_married_brackets.tax_rate);
  // console.log(single_brackets.tax_rate, married_brackets.tax_rate);
  
  // calc_single_brackets.lower_limits = single_brackets.lower_limits;
  // calc_married_brackets.lower_limits = married_brackets.lower_limits;
  // calc_single_brackets.cumulative_tax = single_brackets.cumulative_tax;
  // calc_married_brackets.cumulative_tax = married_brackets.cumulative_tax;

  calc_single_brackets.cumulative_tax = adjustCumulativeTaxValues(calc_single_brackets.cumulative_tax, calc_single_brackets.tax_rate, calc_single_brackets.lower_limits);
  calc_married_brackets.cumulative_tax = adjustCumulativeTaxValues(calc_married_brackets.cumulative_tax, calc_married_brackets.tax_rate, calc_married_brackets.lower_limits);
  console.log("calc and og", calc_single_brackets.tax_rate, single_brackets.tax_rate)
  console.log("calc and og", calc_single_brackets.cumulative_tax, single_brackets.cumulative_tax)

  let age = calculateAge();
  // console.log(age);
  // checkInputs();

  // console.log(rate_of_return, inflation_rate, birthday, age, investment_value, distribution_from_portfolio, initial_soc_security, single);

    makeCalculations(age);
  
}


function adjustTaxBrackets (array) {
  for(let i = 0; i < array.length; i++){
    array[i] = array[i] + tax_change;
  }
  array = removeNegative(array);
  return array;
}

function removeNegative (array) {
  for(let i = 0; i < array.length; i++){
    if(array[i] < 0){
      array[i] = 0;
    }
  }
  return array;
}

// function checkInputs () {
//   if(birthday === null || investment_value === null || ){

//   }
// }

function calculateAge () {
  birthday = new Date(birthday);
    // document.getElementById("birthdate").value);
  // console.log("bday", birthday);
  
  let age = today.getFullYear() - birthday.getFullYear();
  var m = today.getMonth() - birthday.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
  }
  return age;
}

function adjustCumulativeTaxValues (array, tax_rates, low_lims) {
  for(let i = 1; i < array.length; i++){
    array[i] = ((low_lims[i] - low_lims[i-1]) * tax_rates[i-1]) + array[i-1]
  }
  return array;
}

function makeCalculations (age) {
  let max_index = max_age - age;

  for(let i = age; i <= max_age; i++){
    ages.push(i);
  }

  for(let i = 1; i < ages.length; i++){
    portfolio_income.push(portfolio_income[i-1] * inflation_rate)
  }
  // console.log(ages.length, portfolio_income);
    

    for(let i = 1; i <= max_index; i++){
      distributions.push(distributions[i-1]*(inflation_rate));
      social_securities.push(social_securities[i-1]*(inflation_rate));
    }

    for(let i = 1; i <= max_index; i++){
      if(i < 72 - age){
        // pretax_values.push(distributions[i-1]*(inflation_rate));
        required_min_distributions.push(0);
        total_distributions.push(distributions[i] + required_min_distributions[i])

        // total_distributions.push(distributions[i] + required_min_distributions[i])
        pretax_portfolio_values.push((pretax_portfolio_values[i - 1] * rate_of_return) - total_distributions[i] - extra_distribution);
      }
      else if (i === 72 - age){
        let life_expectancy_index = i - (72 - age);
        // console.log(pretax_portfolio_values[i-1]*rate_of_return, life_expectancy_index,life_expectancy_factor[life_expectancy_index])
        let val = (pretax_portfolio_values[i-1]*rate_of_return)/life_expectancy_factor[life_expectancy_index];
        // console.log("val", val, portfolio_income[i])
        if(val > portfolio_income[i]){
          // console.log('eyyyyyyyyyyyyy')
          required_min_distributions.push( val - portfolio_income[i] );
          // console.log(required_min_distributions[i]);
        }
        else{
          required_min_distributions.push(val);
        }
        total_distributions.push(distributions[i] + required_min_distributions[i])

        pretax_portfolio_values.push((pretax_portfolio_values[i - 1] * rate_of_return) - total_distributions[i] - extra_distribution); 
      }
      else{

        // console.log(i, (i-(73-age)), life_expectancy_factor[i-(73-age)]);
        let life_expectancy_index = i - (73 - age);
        // console.log("xpectnc", life_expectancy_factor[life_expectancy_index])
        let val = (pretax_portfolio_values[i-1]*rate_of_return)/life_expectancy_factor[life_expectancy_index];
        // console.log("val", val, portfolio_income[i])
        if(val > portfolio_income[i]){
          required_min_distributions.push( val - portfolio_income[i]);
          //  console.log("valdiff", val, required_min_distributions[i])
        }
        else{
          required_min_distributions.push(val);
        }
        total_distributions.push(distributions[i] + required_min_distributions[i])
        pretax_portfolio_values.push((pretax_portfolio_values[i - 1] * rate_of_return) - total_distributions[i]);
        
      

        // required_min_distributions.push((pretax_portfolio_values[i-1]*rate_of_return)/life_expectancy_factor[i-(70-age)]);
      }

      // total_distributions.push(distributions[i] + required_min_distributions[i])

    } 
    // console.log("72", pretax_portfolio_values[72 - age], required_min_distributions[72-age]);

    console.log("73", pretax_portfolio_values[73 - age], required_min_distributions[73 - age], total_distributions[73 - age]);
    // console.log("73", portfolio_income[73 - age]);
    // formular (A14*(1+Sheet1!$G$3)/X4)-R15
      // console.log("rmd 73", required_min_distributions[73-age]);

    for(let i = 0; i <= max_index; i++){
      taxable_income.push(total_distributions[i] + social_securities[i]);
    }

    for(let i = 0; i <= max_index; i++){
      let new_extra_distribution = null;
      if(i < 72 - age){
        new_extra_distribution = extra_distribution + distributions[i];
      }
      else{
        new_extra_distribution = 0;
      }
      extra_distributions.push(new_extra_distribution);
    }
    console.log("ex_dis", extra_distributions);
    console.log("dist", distributions)


    let ss_brackets = [];
    if(single === true){
      ss_brackets = single_ss_brackets;
    }
    else{
      ss_brackets = married_ss_brackets;
    }
    for(let i = 0; i <=max_index; i++){
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

    for(let i = 0; i <= max_index; i++){
      let eti_push_val = null;
      if(i < 72 - age){
        eti_push_val = extra_distributions[i] + ss_taxable_portions[i];
      }
      else{
        eti_push_val = 0;
      }
      console.log()
      extra_taxable_income.push(eti_push_val);
    }
    // console.log(ss_taxable_portions);

    if(single === true){
      createTotalTaxPaid(calc_single_brackets);
      createExtraDistributionTaxes(calc_single_brackets);  
    }
    else{
      createTotalTaxPaid(calc_married_brackets);
      createExtraDistributionTaxes(calc_married_brackets);  
    }

    for(let i = 0; i <= max_index; i++){
      if(i < 72 - age){
        difference_for_extra_distribution_taxes.push(Math.round(extra_distribution_taxes[i] - total_taxes_paid[i]));
      }
      else{
        difference_for_extra_distribution_taxes.push(0);
      }
    }

    for(let i = 0; i <= max_index; i++){
      if(i < 72 - age){
        extra_after_tax_portion.push(extra_distribution - difference_for_extra_distribution_taxes[i]);
      }
      else{
        extra_after_tax_portion.push(0);
      }
    }

    console.log("ttp", total_taxes_paid, "edt", extra_distribution_taxes);
    console.log(difference_for_extra_distribution_taxes);
    console.log("eatp", extra_after_tax_portion);

    

    // console.log(total_taxes_paid);

    for(let i = 0; i <= max_age-age; i++){
      // console.log(required_min_distributions[0], total_taxes_paid[0])
      if((required_min_distributions[i] - total_taxes_paid[i]) < 0){
        after_tax_investments.push(0);
      }
      else{
        after_tax_investments.push(((required_min_distributions[i] - total_taxes_paid[i]) * rate_of_return));
      }
      console.log(i, after_tax_investments[i], extra_after_tax_portion[i]);
      after_tax_investments[i] += extra_after_tax_portion[i];
      // console.log(i, after_tax_investments[i])
    }
    // console.log("pi", portfolio_income)
    // console.log("td", total_distributions)
    // console.log("pre por", pretax_portfolio_values)
    // console.log("rmd", required_min_distributions);
    console.log("ati", after_tax_investments);
    // console.log("socsec", social_securities)

    console.log("addup", after_tax_investments[0], extra_after_tax_portion[0])
    cumulative_after_tax_values.push(after_tax_investments[0] + extra_after_tax_portion[0])
    for(let i = 1; i <= max_age - age; i++){
      cumulative_after_tax_values.push((cumulative_after_tax_values[i-1] * rate_of_return) + after_tax_investments[i] + extra_after_tax_portion[i])
    }
    console.log("catv", cumulative_after_tax_values);
    

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
      for(let i = 0; i <= max_index; i++){
        let lookup_value = total_distributions[i] + ss_taxable_portions[i];
        let total_tax = lookUpAndSumForTotalTaxes(bracket, lookup_value);
        total_taxes_paid.push(total_tax);
      }
    }

    function createExtraDistributionTaxes(bracket){
      for(let i = 0; i <= max_index; i++){
        let lookup_value = extra_taxable_income[i];
        let extra_distribution_tax = lookUpAndSumForTotalTaxes(bracket, lookup_value);
        extra_distribution_taxes.push(extra_distribution_tax);
      }
    }



    function lookUpAndSumForTotalTaxes (bracket, value){
      let index = lookUp(bracket.lower_limits, value);
      let lowlimit_val = value - bracket.lower_limits[index];
      let tax_rate_val = bracket.tax_rate[index];
      let cumulativetax_val = bracket.cumulative_tax[index];
      let return_val = cumulativetax_val + lowlimit_val * tax_rate_val;
      return return_val; 
    }

    function lookUpAndSumForExtraDistribution() {

    }

    function lookUp (array, value) {
      for(let i = 0; i < array.length; i++){
        if(array[i] > value){
          return i-1;
        }
      }
      return array.length - 1;
    }

    required_min_distributions = removeNegative(required_min_distributions);
    cumulative_after_tax_values = removeNegative(cumulative_after_tax_values);
    pretax_portfolio_values = removeNegative(pretax_portfolio_values);



    function sumArray (array) {
      let sum = 0;
      for(let i = 0; i < array.length; i++){
        sum += array[i];
        // console.log(sum)
      }
      return sum;
    }

    // console.log(total_taxes_paid);
    average_annual_taxes = sumArray(total_taxes_paid) / total_taxes_paid.length;
    cumulative_taxes_paid = sumArray(total_taxes_paid);
    after_tax_value = sumArray(after_tax_investments);

    document.getElementById("average-annual-taxes").textContent = "Average Annual Taxes: ";
    document.getElementById("cumulative-taxes-paid").textContent = "Cumulative Taxes Paid: ";
    document.getElementById("after-tax-value").textContent = "After Tax Value: ";

    document.getElementById("average-annual-taxes").textContent += average_annual_taxes.toLocaleString("en-US");
    document.getElementById("cumulative-taxes-paid").textContent += cumulative_taxes_paid.toLocaleString("en-US");
    document.getElementById("after-tax-value").textContent += after_tax_value.toLocaleString("en-US");

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
