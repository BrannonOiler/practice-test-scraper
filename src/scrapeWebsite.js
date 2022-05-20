/** PACKAGES */
import fs from "fs";
import puppeteer from "puppeteer";

/** CONFIG */
import {
  /* Chrome dev tools -> Application -> Cookies */
  URL,
  COOKIE_NAME,
  COOKIE_VALUE,
  NUM_QUESTIONS,
  IFRAME_SELECTOR,
  QUESTION_SELECTOR,
  OPTION_1_SELECTOR,
  OPTION_2_SELECTOR,
  OPTION_3_SELECTOR,
  OPTION_4_SELECTOR,
  ANSWER_SELECTOR,
  PREV_ANSWER_SELECTOR,
  NEXT_BUTTON_SELECTOR,
} from "./config.json";

/** CONSTANTS */
const TIMEOUT_MS = 5000;

const scrapeWebsite = async () => {
  /* Start {browser} and {page} */
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const [page] = await browser.pages();

  /* Go to {page}, set cookies, and reload */
  await page.goto(URL);
  await page.setCookie({ name: COOKIE_NAME, value: COOKIE_VALUE });
  await page.reload();

  /* All questions */
  const questions = [];

  for (let i = 0; i < NUM_QUESTIONS; i += 1) {
    /* Wait {TIMEOUT_MS} for page to load */
    await page.waitForTimeout(TIMEOUT_MS);

    /* Get iframe */
    const iframe = await page.$(IFRAME_SELECTOR);
    const contentFrame = await iframe.contentFrame();

    /* Question */
    const questionDiv = await contentFrame.$(QUESTION_SELECTOR);
    const questionInnerText = await questionDiv.getProperty("innerText");
    const question = await questionInnerText.jsonValue();

    /* Options */
    const options = [];
    const optionsSpans = [
      await contentFrame.$(OPTION_1_SELECTOR),
      await contentFrame.$(OPTION_2_SELECTOR),
      await contentFrame.$(OPTION_3_SELECTOR),
      await contentFrame.$(OPTION_4_SELECTOR),
    ];

    for (const optionSpan of optionsSpans) {
      const optionInnerText = await optionSpan.getProperty("innerText");
      const optionInnerTextJson = await optionInnerText.jsonValue();
      options.push(optionInnerTextJson);
    }

    /* Answer */
    const answerSpan = await contentFrame.$(ANSWER_SELECTOR);
    const answerInnerText = await answerSpan.getProperty("innerText");
    const [answer] = (await answerInnerText.jsonValue()).split("\n");

    /* Previous answer */
    const prevAnswerSpan = await contentFrame.$(PREV_ANSWER_SELECTOR);
    const prevAnswerText = await prevAnswerSpan.getProperty("innerText");
    const [prevAnswer] = (await prevAnswerText.jsonValue()).split("\n");

    /* Rationale, clean up {option4} */
    const [option4, , , rationale] = options[options.length - 1].split("\n");
    options.pop();
    options.push(option4);

    /* Add {question}, {options}, {answer}, {prevAnswer}, and {rationale} to {questions} */
    questions.push({
      question,
      options,
      answer,
      prevAnswer,
      rationale,
    });

    /** Click next button */
    await page.waitForSelector(NEXT_BUTTON_SELECTOR);
    const buttonElements = await page.$$(NEXT_BUTTON_SELECTOR);
    for (const element of buttonElements) {
      let textContent = await page.evaluate((el) => el.textContent, element);
      if (textContent.includes("Next")) {
        await element.click();
        break;
      }
    }
  }

  /** Save {questions} to file */
  fs.writeFileSync(
    "../output/questions.json",
    JSON.stringify(questions, null, 2),
    "utf8"
  );

  await browser.close();
};

export default scrapeWebsite;
