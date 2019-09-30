const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const options = new chrome.Options();
const driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function mouseClick(element) {
    const rect = await element.getRect();
	const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;
    const script = `
        var params = {
            bubbles: true, cancelable: true, view: document.defaultView, clientX: ${x}, clientY: ${y}, button: 1
        };
        arguments[0].dispatchEvent(new MouseEvent('mousedown', params));
        arguments[0].dispatchEvent(new MouseEvent('mouseup', params));
        arguments[0].dispatchEvent(new MouseEvent('click', params));
    `;
    return driver.executeScript(script, element);
}

(async () => {
    try {
        await driver.get('https://rhpijnacker.github.io/selenium-click-bug/example/index.html');
        await sleep(2000);
        let element = await driver.findElement(By.css(`div.popup`));

        // [❌] Option 1: 
        await element.click();
        // [❌] Option 2:
        // await driver.actions().click(element).perform();
        // [✓] Option 3:
        // await mouseClick(element);

        await driver.wait(until.alertIsPresent(), 5 * 1000);
        console.log('\nsuccess');
    } finally {
        setTimeout(() => driver.quit(), 1000);
    }
})();

