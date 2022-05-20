import fs from "fs";

const generateHTML = async () => {
  /* Create beginning of HTML file */
  let html = "";
  html += "<!DOCTYPE html>\n";
  html += '<html lang="en">\n';
  html += "<head>\n";
  html += '<meta charset="UTF-8">\n';
  html +=
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
  html += '<meta http-equiv="X-UA-Compatible" content="ie=edge">\n';
  html += "<title>MSW Practice Exam</title>\n";
  html +=
    '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">\n';
  html += "</head>\n";
  html += "<body>\n";

  /* Load {questions.json} */
  const questions = JSON.parse(fs.readFileSync("../output/questions.json"));

  /** QUESTIONS */
  /* For each {question} in {questions}, show {question.question} and {question.options} */
  html += "<h1>Questions</h1>\n";
  questions.forEach(({ question, options }, index) => {
    html += `<div class="question">\n`;
    html += `<h5>${index + 1}. ${question ?? "MISSING QUESTION"}</h5>\n`;
    html += `<ul>\n`;
    options.forEach((option) => {
      html += `<li>${option ?? "MISSING OPTION"}</li>\n`;
    });
    html += `</ul>\n`;
    html += `</div>\n`;
  });

  /** ANSWERS */
  /* For each {question} in {questions}, show {question.answer} and {question.rationale} */
  html += "<h1>Answers</h1>\n";
  questions.forEach(({ answer, prevAnswer, rationale }, index) => {
    html += `<div class="answer">\n`;
    html += `<p>${index + 1}. ${answer ?? "MISSING ANSWER"}</p>\n`;
    html += `<p>Previous answer: ${
      prevAnswer ?? "MISSING PREVIOUS ANSWER"
    }</p>\n`;
    html += `<p>${rationale ?? "MISSING RATIONALE"}</p>\n`;
    html += `</div>\n`;
  });

  /* Create end of HTML file */
  html += "</body>\n";
  html += "</html>\n";

  /* Write {html} to {index.html} */
  fs.writeFileSync("../output/index.html", html);
};

export default generateHTML;
