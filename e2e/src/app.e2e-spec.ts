import { AppPage } from "./app.po";
import { browser, logging, Key, element, by } from "protractor";

describe("workspace-project App", () => {
  let page: AppPage;

  page = new AppPage();

  it("should display the application name", () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual("Book Shop");
  });

  describe("searchbar", () => {
    it("should be displayed", () => {
      expect(page.getSearchbar().isDisplayed()).toBeTruthy();
    });

    it("should accept keywords", () => {
      const searchbar = page.getSearchbar();
      searchbar.click();
      searchbar.sendKeys("Alice", Key.ENTER);
      expect(searchbar.getAttribute("value")).toEqual("Alice");
      it("should have at least one book", () => {
        expect(page.getBooks().count()).toBeGreaterThan(0);
      });
    });
    it("should have autocompletion", () => {
      const searchbar = page.getSearchbar();
      searchbar.click();
      searchbar.clear();
      searchbar.sendKeys("Alice");
      searchbar.sendKeys(Key.DOWN, Key.DOWN);
      browser.sleep(500);
      searchbar.sendKeys(Key.ENTER);
      expect(searchbar.getAttribute("value").then(value => value === "Alice")).toBeFalsy();
    });

  });

  describe("book", () => {

    const books = page.getBooks();
    it("should display a modal", () => {
      browser.sleep(1000);
      books.first().click();
      browser.waitForAngular();
      expect(browser.findElement(by.css(".modal.open")).isDisplayed()).toBeTruthy();
    });
    it("modal should be closed", () => {
      books.first().click();
      browser.actions()
      .mouseMove(element(by.tagName("body")), {
        x: 10,
        y: 10
      })
      .click()
      .perform();
      browser.waitForAngular("Waiting for overlay");
      expect(browser.isElementPresent(by.css(".modal-overlay"))).toBeFalsy();
    });
  });
  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
